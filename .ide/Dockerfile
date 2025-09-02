FROM node:20.11.0
# 以及按需安装其他软件
RUN apt-get update && apt-get install -y git

# 安装 ssh 服务，用于支持 VSCode 客户端通过 Remote-SSH 访问开发环境
RUN apt-get update && apt-get install -y net-tools git-lfs sudo screen wget unzip openssh-server nano python-is-python3 python3-pip htop lsof openjdk-17-jre-headless curl wget

# 安装 code-server 和 vscode 常用插件
RUN curl -fsSL https://code-server.dev/install.sh | sh \
  && code-server --install-extension redhat.vscode-yaml \
  && code-server --install-extension dbaeumer.vscode-eslint \
  && code-server --install-extension waderyan.gitblame \
  && code-server --install-extension mhutchie.git-graph \
  && code-server --install-extension donjayamanne.githistory \
  && echo done

RUN wget -O cnb-welcome.vsix https://open-vsx.org/api/cnbcool/cnb-welcome/0.2.8/file/cnbcool.cnb-welcome-0.2.8.vsix && \
    pip install websocket-client --break-system-packages && \
    pip install requests --break-system-packages && \
    pip install jq --break-system-packages && \
    npm install -g @google/gemini-cli && \
    code-server --install-extension cnb-welcome.vsix 
RUN wget https://download.oracle.com/java/21/latest/jdk-21_linux-x64_bin.deb &&\
    dpkg -i jdk-21_linux-x64_bin.deb && \
    apt-get install -f && \
    rm jdk-21_linux-x64_bin.deb

# 指定字符集支持命令行输入中文（根据需要选择字符集）
ENV LANG C.UTF-8
ENV LANGUAGE C.UTF-8