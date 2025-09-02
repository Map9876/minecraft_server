#!/usr/bin/env python3
import requests
import json
import re
import subprocess
import time
import threading
import signal
import sys
import os
import shlex

# 全局变量
ssh_process = None
stop_flag = False

def signal_handler(signum, frame):
    """信号处理器，用于优雅退出"""
    global stop_flag, ssh_process
    print("\n收到退出信号，正在关闭SSH连接...")
    stop_flag = True
    if ssh_process:
        close_ssh_connection()
    sys.exit(0)

def get_workspace_list():
    """获取工作空间列表"""
    url = "https://api.cnb.cool/workspace/list"
    
    params = {
        'branch': 'main',
        'end': '2100-12-01 00:00:00+0800',
        'page': 1,
        'pageSize': 20,
        'slug': '仓库',
        'start': '2024-12-01 00:00:00+0800',
        'status': 'running'
    }
    
    headers = {
        'accept': 'application/json',
        'Authorization': 'APITOKEN'
    }
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"获取工作空间列表失败: {e}")
        return None

def get_workspace_detail(sn):
    """获取工作空间详细信息"""
    url = f"https://api.cnb.cool/仓库/-/workspace/detail/{sn}"
    
    headers = {
        'accept': 'application/json',
        'Authorization': '5Q5MZm1285Efm9udrYEHE50gnoG'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"获取工作空间详情失败: {e}")
        return None

def extract_ssh_command(ssh_string):
    """从SSH字符串中提取SSH命令"""
    # 移除可能的引号和多余的空格
    ssh_command = ssh_string.strip().strip('"')
    return ssh_command

def update_config_json(ssh_command):
    """更新config.json文件"""
    try:
        # 读取现有的config.json
        with open('config.json', 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        # 添加SSH命令
        config['ssh_command'] = ssh_command
        
        # 写回文件
        with open('config.json', 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
        
        print(f"已成功更新config.json，添加SSH命令: {ssh_command}")
        
    except Exception as e:
        print(f"更新config.json失败: {e}")

def execute_ssh_command(ssh_command):
    """执行SSH命令"""
    global ssh_process
    
    try:
        print(f"正在执行SSH命令: {ssh_command}")
        
        # 解析SSH命令
        ssh_parts = shlex.split(ssh_command)
        
        # 添加SSH选项以避免主机密钥检查
        ssh_parts.insert(1, '-o')
        ssh_parts.insert(2, 'StrictHostKeyChecking=no')
        ssh_parts.insert(3, '-o')
        ssh_parts.insert(4, 'UserKnownHostsFile=/dev/null')
        
        print(f"完整SSH命令: {' '.join(ssh_parts)}")
        
        # 执行SSH连接
        ssh_process = subprocess.Popen(
            ssh_parts,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            stdin=subprocess.PIPE,
            text=True,
            bufsize=1,
            universal_newlines=True
        )
        
        # 等待一段时间检查连接状态
        time.sleep(3)
        
        if ssh_process.poll() is None:
            print("SSH连接已建立")
            return True
        else:
            stdout, stderr = ssh_process.communicate()
            print(f"SSH连接失败")
            print(f"stdout: {stdout}")
            print(f"stderr: {stderr}")
            return False
            
    except Exception as e:
        print(f"执行SSH命令失败: {e}")
        return False

def close_ssh_connection():
    """关闭SSH连接"""
    global ssh_process
    
    if ssh_process:
        try:
            print("正在关闭SSH连接...")
            ssh_process.terminate()
            ssh_process.wait(timeout=5)
            print("SSH连接已关闭")
        except subprocess.TimeoutExpired:
            print("SSH连接关闭超时，强制终止...")
            ssh_process.kill()
        except Exception as e:
            print(f"关闭SSH连接时出错: {e}")
        finally:
            ssh_process = None

def check_connection_status():
    """检查连接状态"""
    global ssh_process
    if ssh_process:
        return ssh_process.poll() is None
    return False

def ssh_connection_manager():
    """SSH连接管理器，处理自动重连"""
    global stop_flag, ssh_process
    
    reconnect_interval = 300  # 5分钟
    last_connect_time = time.time()
    connection_active = True
    
    while not stop_flag:
        current_time = time.time()
        
        # 检查是否需要重连
        if current_time - last_connect_time >= reconnect_interval:
            print(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] 执行定时重连...")
            
            # 关闭现有连接
            close_ssh_connection()
            
            # 获取最新的SSH命令
            ssh_command = get_ssh_command_from_config()
            if ssh_command:
                # 建立新连接
                if execute_ssh_command(ssh_command):
                    last_connect_time = current_time
                    connection_active = True
                    print(f"重连成功，下次重连时间: {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(current_time + reconnect_interval))}")
                else:
                    print("重连失败，将在下次循环中重试")
                    connection_active = False
            else:
                print("无法获取SSH命令，将在下次循环中重试")
                connection_active = False
        
        # 检查SSH进程是否还在运行
        if not check_connection_status() and connection_active:
            print("SSH连接已断开，准备重连...")
            connection_active = False
            last_connect_time = 0  # 立即重连
        
        # 等待一段时间再检查
        time.sleep(10)

def get_ssh_command_from_config():
    """从config.json中获取SSH命令"""
    try:
        with open('config.json', 'r', encoding='utf-8') as f:
            config = json.load(f)
        
        if 'ssh_command' in config:
            return config['ssh_command']
        else:
            return None
    except Exception as e:
        print(f"读取config.json失败: {e}")
        return None

def main():
    global stop_flag
    
    print("=" * 60)
    print("SSH工作空间连接管理器")
    print("=" * 60)
    
    # 设置信号处理器
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    print("开始获取工作空间信息...")
    
    # 第一步：获取工作空间列表
    workspace_list = get_workspace_list()
    if not workspace_list:
        print("无法获取工作空间列表")
        return
    
    print("工作空间列表获取成功")
    
    # 提取sn值
    if 'list' in workspace_list and len(workspace_list['list']) > 0:
        sn = workspace_list['list'][0]['sn']
        print(f"提取到sn值: {sn}")
        
        # 第二步：获取工作空间详情
        workspace_detail = get_workspace_detail(sn)
        if not workspace_detail:
            print("无法获取工作空间详情")
            return
        
        print("工作空间详情获取成功")
        
        # 提取SSH命令
        if 'ssh' in workspace_detail:
            ssh_command = extract_ssh_command(workspace_detail['ssh'])
            print(f"提取到SSH命令: {ssh_command}")
            
            # 更新config.json
            update_config_json(ssh_command)
            
            print("\n" + "=" * 60)
            print("SSH信息获取完成，正在建立连接...")
            print("=" * 60)
            
            # 直接建立SSH连接
            if execute_ssh_command(ssh_command):
                print("初始SSH连接成功，启动自动重连管理器...")
                print("=" * 60)
                
                # 启动自动重连管理器线程
                reconnect_thread = threading.Thread(target=ssh_connection_manager, daemon=True)
                reconnect_thread.start()
                
                print("SSH连接管理器已启动")
                print("连接将每5分钟自动重连一次")
                print("按Ctrl+C退出")
                print("=" * 60)
                
                # 主线程等待
                try:
                    while not stop_flag:
                        time.sleep(1)
                except KeyboardInterrupt:
                    print("\n收到键盘中断信号")
                    stop_flag = True
                    close_ssh_connection()
            else:
                print("SSH连接失败")
        else:
            print("未找到SSH信息")
    else:
        print("工作空间列表为空")

if __name__ == "__main__":
    main() 