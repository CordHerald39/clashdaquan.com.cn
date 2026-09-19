---
title: "Mihomo 本地实测：HTTP、SOCKS5、拒绝规则与停止端口的对照"
category: "tutorials"
label: "本地实测"
description: "公开 Mihomo v1.19.31 的最小配置、复现命令、SHA256 和实际结果，区分配置错误、规则拒绝与端口未监听。"
date: "2026-09-19"
updated: "2026-09-19"
author: "Clash 大全编辑部"
draft: false
---

## 这次实验验证了什么

2026-09-19 07:45（UTC+8），本站在 Windows x64 使用开发者发布的 Mihomo v1.19.31 完成一次隔离实验。HTTP 测试服务和代理都只在回环地址运行；未启用 TUN、DNS 接管、系统代理或远端节点，不需要订阅。

实验回答三个具体问题：混合端口能否处理两种代理协议？YAML 解析失败与规则拒绝能否区分？核心停止后请求是什么结果？它不验证机场速度、真实订阅、Android VPN、OpenClash 透明代理或任何客户端 GUI。

## 软件来源与下载一致性

下载来源：[MetaCubeX/mihomo v1.19.31](https://github.com/MetaCubeX/mihomo/releases/tag/v1.19.31)。附件为 mihomo-windows-amd64-compatible-v1.19.31.zip。本地 SHA256 与 GitHub 发行资产 digest 一致：

```text
93d14e9a13b49b2f2d256202d02cc8d14a7c4695edf084cae0f941986bc9c218
```

执行内核的 -v，实际输出包含：

```text
Mihomo Meta v1.19.31 windows amd64 with go1.26.8
Use tags: with_gvisor
```

摘要一致证明这次下载内容与该发布值相符，不是独立安全审计。这个摘要只适用于上述 ZIP，不能用于解压后的 exe。

## 最小配置

在独立实验文件夹保存 lab.yaml。18790、18791 是本文自选测试端口，执行前确认没有被占用；若更换端口，配置与命令必须一起替换。不把它覆盖到正在使用的配置目录。

```yaml
mixed-port: 18790
allow-lan: false
bind-address: 127.0.0.1
mode: rule
log-level: info
ipv6: false
find-process-mode: off
dns:
  enable: false
tun:
  enable: false
proxies: []
proxy-groups: []
rules:
  - IP-CIDR,127.0.0.1/32,DIRECT,no-resolve
  - MATCH,REJECT
```

只有回环目标允许 DIRECT，其他目标拒绝。这样的设计能把实验限制在本机，并提供明确的拒绝对照。代理策略与模式定义可在[Mihomo 配置文档](https://wiki.metacubex.one/config/)核对。

## 怎样重复这次实验

需要 Node.js、Windows curl.exe 和上述官方核心。下面使用与实验一致的配置和请求；终端输出顺序与动态源端口可能不同。

先在 PowerShell 中创建实验数据目录并检查配置。目录已存在时可跳过创建：

```powershell
New-Item -ItemType Directory -Force -Path '.\data'
.\mihomo-windows-amd64-compatible.exe -t -d .\data -f .\lab.yaml
```

应看到配置校验成功。接着在一个终端启动本地 HTTP 服务，并保持运行：

```powershell
node -e "require('node:http').createServer((q,s)=>s.end('clash-lab-ok\n')).listen(18791,'127.0.0.1')"
```

在第二个终端启动核心：

```powershell
.\mihomo-windows-amd64-compatible.exe -d .\data -f .\lab.yaml
```

在第三个终端分别执行测试。--noproxy 的值用于避免环境中的常见回环绕过项干扰显式代理；--fail 使 HTTP 错误状态返回非零退出码，--max-time 限制等待时间。

```powershell
curl.exe --silent --show-error --fail --max-time 5 --noproxy "!" --proxy http://127.0.0.1:18790 http://127.0.0.1:18791/
curl.exe --silent --show-error --fail --max-time 5 --noproxy "!" --proxy socks5h://127.0.0.1:18790 http://127.0.0.1:18791/
curl.exe --silent --show-error --fail --max-time 5 --noproxy "!" --proxy http://127.0.0.1:18790 http://192.0.2.1/
```

192.0.2.1 是文档示例地址，本实验通过 MATCH,REJECT 拒绝它，不将其作为互联网可达性测试。每条命令执行后可以查看 PowerShell 的 $LASTEXITCODE。

保持 HTTP 服务不变，在核心终端按 Ctrl+C 停止核心，再执行第一条 HTTP 命令观察端口连接失败。完成后也停止本地 HTTP 服务。本站自动化运行时最终关闭了两个进程，没有保留代理服务。

## 实际观测结果

| 测试 | 实际结果 | 能证明什么 |
| --- | --- | --- |
| 正确 lab.yaml 的 -t 检查 | 退出码 0，test is successful | 本核心接受这份配置 |
| 内容为 mixed-port: [ 的错误 YAML | 退出码 1，yaml: line 1: did not find expected node content | YAML 错误在运行前被识别 |
| HTTP 代理请求本地服务 | 退出码 0，正文 clash-lab-ok | HTTP 入口和 DIRECT 本地转发成功 |
| SOCKS5 代理请求本地服务 | 退出码 0，同一正文 | 同一个混合端口处理 SOCKS5 成功 |
| HTTP 代理请求 192.0.2.1 | HTTP 502，curl 退出码 22 | 配合日志确认本次被 REJECT |
| 停止核心后请求代理端口 | curl 退出码 7，Could not connect to server | 代理端口已不可连接 |

以下为实测日志内容摘录，省略时间戳与动态源端口，未改动目标、规则或出口：

```text
Mixed(http+socks) proxy listening at: 127.0.0.1:18790
127.0.0.1:18791 match IPCIDR(127.0.0.1/32) using DIRECT
192.0.2.1:80 match Match using REJECT
```

## 怎么用于自己的故障判断

看到 YAML 错误，先处理配置；无法连接本地代理端口，先检查监听和客户端状态；能连接端口但出现 HTTP 错误，再对照规则和上游日志。不要把所有失败都叫“节点超时”。尤其不能看到 502 就认定 REJECT：本实验因为同时记录了规则日志，才有这个结论。

本页公开配置、命令、摘要与经过说明的结果摘录，原始自动化脚本和完整结果另存维护目录。没有生成模拟软件截图，也没有把第三方截图作为本站实际使用证据。
