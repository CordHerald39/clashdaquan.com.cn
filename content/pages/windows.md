---
title: Clash 电脑版下载与配置教程
category: downloads
description: 查找 Windows 版 Clash Verge Rev 与 FlClash 开发者下载入口，区分 x64、ARM64 和安装包格式，完成订阅导入、系统代理与连接验收。
date: '2026-09-28'
updated: '2026-09-28'
---

本页面向 Windows 用户。先确认电脑架构，再选客户端和安装包，最后导入配置并启用代理。使用 Mac 或 Linux？在[下载中心](/downloads/)切换对应平台，避免下载 Windows 安装程序。

## Windows 客户端怎么选

| 客户端 | 使用方向 | 原始下载入口 |
| --- | --- | --- |
| Clash Verge Rev | 以 Windows 桌面图形界面管理配置、代理组与连接 | [开发者 Releases](https://github.com/clash-verge-rev/clash-verge-rev/releases) · [安装文档](https://www.clashverge.dev/install.html) |
| FlClash | 在 Windows 与安卓等平台使用同一项目 | [开发者 Releases](https://github.com/chen08209/FlClash/releases) · [项目说明](https://github.com/chen08209/FlClash) |

Clash for Windows（CFW）与 Clash Verge Rev 不是同一软件的连续版本。寻找历史教程时，请先核对其实际对应客户端，旧界面步骤不能直接套到新项目上。下载入口指向开发者的发行列表，版本、已知问题和系统要求以当前说明为准。

## x64、ARM64 与安装包格式

打开 Windows“设置 → 系统 → 关于”，查看系统类型。x64 通常对应 Intel / AMD 64 位 PC；ARM64 对应 Windows on ARM 设备。不要仅凭 Windows 11 或电脑品牌决定。

| 你看到的标记 | 含义与选择依据 |
| --- | --- |
| x64 / amd64 / x86_64 | 同一类 64 位 x86 架构标记；与 ARM64 不同 |
| arm64 / aarch64 | ARM 64 位架构；下载前确认所选项目提供对应 Windows 包 |
| .exe / .msi | 常见安装器格式；EXE 也可能是程序本体，按附件名称与项目说明判断，项目不保证同时提供两者 |
| portable / .zip | 仅在发行说明明确为便携包时使用；Source code.zip 是源代码 |
| fix_webview2 | Clash Verge Rev 为缺少且无法正常安装 WebView2 的特定场景提供的包，先读安装说明 |

Clash Verge Rev 安装文档列出 Windows x64 / ARM64，并明确不支持 Windows 7。这不是所有 Clash 衍生客户端的统一兼容性声明；旧系统需单独核对项目要求。

## 安装前与安装后要检查什么

先确认文件来自预期仓库，查看发行说明和提供的校验信息。开发者给出 SHA256 时，可在 PowerShell 执行 `Get-FileHash -Algorithm SHA256 -LiteralPath '安装包完整路径'`，与同一资产的摘要逐字符比对。摘要一致只能说明文件匹配，不能代替来源信任。

安装提示缺少运行组件时，沿开发者文档定位组件来源。遇到签名、风险提示或异常文件名，应停下来核对，避免把“关闭安全软件”当作通用解决办法。安装后先打开主界面，不急着同时开启所有接管选项。

## 从订阅导入到首次连接

1. 在订阅/配置页面添加服务方提供的配置链接，保存并刷新。显示拉取成功后，再确认配置中存在节点与代理组。
2. 选中并启用这份配置，在规则模式下选择节点。模式选择详解见[规则、全局与直连](/articles/rule-global-direct/)。
3. 首次验证可从系统代理开始：它主要覆盖遵循系统代理设置的应用。开启后刷新浏览器目标页面，同时观察客户端连接记录。
4. 只有需要接管不遵循系统代理的软件时，再依据客户端文档尝试 TUN。它可能需要安装服务与权限，也可能与其他 VPN 或虚拟网卡冲突。
5. 用同一页面分别验证开启和关闭代理后的表现；记录时间、模式和日志中的规则命中。不要把测速成功等同于全部应用已被接管。
6. 退出客户端时检查系统代理是否恢复，尤其是强制结束进程之后。恢复直连再排查，避免遗留代理设置影响其他应用。

完整流程见 [Clash 使用教程](/tutorials/)；导入步骤和常见返回错误分别见[订阅导入](/articles/import-subscription/)与[订阅错误排查](/articles/subscription-errors/)。

## 电脑版常见问题

| 现象 | 定位方法 |
| --- | --- |
| 浏览器可用，某个程序不可用 | 确认程序是否读取系统代理；查看连接日志中是否有它的请求，再决定是否需要 TUN |
| 所有节点超时 | 先验证订阅是否过期及本地网络，再检查防火墙、端口冲突和服务方状态 |
| 配置更新失败 | 保留 HTTP 错误码，核对链接是否完整；不要把包含令牌的订阅 URL 发到公共 Issue |
| 开启 TUN 后网络异常 | 关闭 TUN 回到系统代理逐项验证，排除其他 VPN/网卡冲突，并依据日志检查 DNS |
| 退出后无法上网 | 检查 Windows 代理设置中是否遗留本地地址，再确认客户端进程或服务状态 |

## 来源与核验日期

2026-09-28 核对 [Clash Verge Rev 安装文档](https://www.clashverge.dev/install.html)、[快速入门](https://www.clashverge.dev/guide/quickstart.html)、[项目仓库](https://github.com/clash-verge-rev/clash-verge-rev)与 [FlClash 项目](https://github.com/chen08209/FlClash)。本文依据开发者文档说明操作路径，不将整理过程表述为 Windows 客户端实测。[官方来源核验指南](/articles/clash-official-sources/)解释如何区分项目与下载聚合站。
