---
title: "Mihomo fake-ip-filter 怎么用：局域网域名与真实 IP 排错"
category: "tutorials"
label: "配置排错"
description: "检查 fake-ip 例外、黑白名单模式和直连规则，区分域名解析结果与实际出口。"
date: "2026-10-04"
updated: "2026-10-04"
author: "Clash 大全编辑部"
draft: false
---

## 什么时候需要检查 fake-ip 例外

开启 fake-ip 后，某个局域网设备只能用 IP 访问、使用原域名却失败，可以检查这个域名是否需要真实解析结果。先保留一份原配置，记录失败的完整域名、客户端与内核版本；不要直接把所有域名都排除。

本文依据 Mihomo 官方 DNS 文档整理，核验日期为2026年10月4日。它提供配置判断方法，没有声称在你的路由器或手机上测试通过。基础概念可先看[规则、全局与直连的区别](/articles/rule-global-direct/)。

## 过滤解析与选择出口分别检查

官方文档区分 fake-ip 和 redir-host 两种增强模式。fake-ip-filter 控制哪些地址不获得 fake-ip 映射；它不会代替路由规则决定连接直连还是代理。因此，“已经加入过滤列表”与“已经命中 DIRECT”需要分别验证。

blacklist 模式表示匹配的域名排除在 fake-ip 之外；whitelist 则让匹配域名使用 fake-ip。排错时先确认 filter-mode，不能拿相同列表推断两种模式会得到相同结果。rule 模式还有自己的匹配语法，不应与普通列表混用。

## 先用一个真实域名验证

下面是局部配置示意，只展示字段关系。将已使用的配置备份后，确认它没有重复的 dns 键，再在客户端支持的覆写位置合并：

```yaml
dns:
  enable: true
  enhanced-mode: fake-ip
  fake-ip-filter-mode: blacklist
  fake-ip-filter:
    - '*.lan'
```

这个例子针对 .lan 后缀；你的设备若使用其他名称，它不会自动匹配。保留现有 nameserver 等设置，不把这几行当成完整可运行的订阅。用自己实际设备的域名替换测试对象，在同一网络下对比修改前后解析与访问结果。

## 结果不变时留下哪条证据

如果域名仍返回 fake-ip，先核对实际加载的配置以及是否命中例外，而不是继续扩大列表。如果已经得到真实地址却无法访问，再检查路由出口、设备服务端口与局域网隔离；这时单改过滤列表缺少依据。

每轮只改变一个域名例外。验证完保留最小有效改动，并确认订阅更新后覆写仍然存在。涉及连接层问题时，可继续阅读[订阅错误的分层排查](/articles/subscription-errors/)。

## 一手来源

[MetaCubeX：Mihomo DNS 配置](https://wiki.metacubex.one/config/dns/)，重点核对 enhanced-mode、fake-ip-filter 与 fake-ip-filter-mode。字段支持程度以正在运行的内核为准。
