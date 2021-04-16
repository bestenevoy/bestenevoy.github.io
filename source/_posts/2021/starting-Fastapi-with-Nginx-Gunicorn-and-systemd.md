---
title: starting Fastapi with Nginx Gunicorn and systemd
categories: 技术
tags:
  - Python
  - FastApi
  - Nginx
  - systemd
  - Gunicorn
date: 2021-04-16 08:46:48
updated: 2021-04-16 08:46:48
---

# 使用 Nginx Gunicorn systemd 启动 fastapi 项目

## 1.配置 systemd 服务

需要新建以下两个文件,文件内容根据提示和需要自行配置
```
/etc/systemd/system/gunicorn.socket
/etc/systemd/system/gunicorn.service
```

**/etc/systemd/system/gunicorn.socket:**
```bash
[Unit]
Description=gunicorn socket

[Socket]
# ListenStream 写要生成的 sock 文件路径，要写完整路径。我是放到项目根目录下的。
ListenStream=/run/gunicorn.sock
# Our service won't need permissions for the socket, since it
# inherits the file descriptor by socket activation
# only the nginx daemon will need access to the socket
User=www-data
# Optionally restrict the socket permissions even more.
# Mode=600

[Install]
WantedBy=sockets.target
```

**note:**
- www-data 是 nginx 进程的拥有者
- 可以使用 ps aux | grep nginx | grep worker 查看

**/etc/systemd/system/gunicorn.service:**
```bash
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
Type=notify
# the specific user that our service will run as
User=someuser
Group=someuser
# another option for an even more restricted service is
# DynamicUser=yes
# see http://0pointer.net/blog/dynamic-users-with-systemd.html
RuntimeDirectory=gunicorn

# WorkingDirectory 是项目路径目录
WorkingDirectory=/home/someuser/project
# 代替手动执行的命令，
# 原本在虚拟环境中要执行的 gunicorn -c gconfig.py main:app -k uvicorn.workers.UvicornWorker
# where gunicorn 查看路径
# 其中 gunicorn 和 gconfig.py 要写完整的路径名称
ExecStart=/home/someuser/.pyenv/shims/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

### 2.Nginx 配置文件新增内容
```nginx
http {
    server {
        listen          8000;
        server_name     127.0.0.1;
        location / {
            proxy_pass http://unix:/run/gunicorn.sock;
        }
    }
}
```

## 3.启动服务

### 3.1 启动`gunicorn socket`
```
sudo systemctl enable gunicorn.socket --now
sudo systemctl start gunicorn.service
```

### 3.2 重启 `nginx`

```
sudo nginx -t
sudo nginx -s reload
```

## 4.其他

### 4.1 停止服务

```
sudo systemctl disable gunicorn.socket --now
sudo systemctl stop gunicorn.service
```

### 4.2 问题

- 项目无法启动, 先查看错误日志
- 文件或目录不存在,则是因为 `gunicorn.sock` 文件找不到
-  `ListenStream=/run/gunicorn.sock`  和 `User=www-data` 配置错误,可能会导致 `nginx` 提示权限不足