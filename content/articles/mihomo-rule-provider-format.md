---
title: "Mihomo 规则集合加载失败：behavior、format 与文件内容对照"
category: "tutorials"
label: "配置排错"
description: "区分规则集合类型、存储格式和引用关系，按加载错误与规则命中两条线排查。"
date: "2026-10-04"
updated: "2026-10-04"
author: "Clash 大全编辑部"
draft: false
---

## 先区分下载失败与格式错误

规则集合没有生效，至少有两种情况：文件没有成功取得，或者文件已取得却不能按声明的格式解析。先保留日志里的错误类别和集合名称。如果订阅本身都未成功加载，先看[订阅导入步骤](/articles/import-subscription/)，不要先改规则集合。

本文核验日期为2026年10月4日，依据 Mihomo 官方 rule-provider 及集合内容文档。没有把配置检查写成对节点服务的性能测试。

## behavior 与 format 描述不同维度

behavior 指集合承载的规则类别，可选 domain、ipcidr 或 classical；format 指存储格式，可选 yaml、text 或 mrs。名字相近不代表能互换：一份带 DOMAIN-SUFFIX 等完整规则表达式的文件，不应只因为它含有域名，就随意改为 domain。

官方说明目前 mrs 只支持 domain 与 ipcidr。使用 classical 时，先确认源文件的写法，再选择相符的存储格式。换扩展名不会转换内容，改成 .mrs 也不会把 YAML 变成二进制规则集。

## 引用链上有三个名称要一致

检查 rule-providers 中的集合名称、规则里 RULE-SET 引用的名称，以及最终策略或代理组。集合下载成功但引用拼错，和集合被引用后目标策略不存在，是不同的错误。

排查时把这一条链写在纸上：集合定义 → RULE-SET 引用 → 已存在的策略。再查看规则顺序；前面的规则若已经匹配，后面的集合规则可能没有机会被使用。这不是集合更新失败的证据。

## 文件型与网络型分别核对

http 类型需要 url，interval 的单位为秒；proxy 可以指定下载和更新所走的代理。file 类型则关注实际文件的位置与可读性，inline 关注内联 payload。不要把网络型的排错步骤全部套到本地文件。

如果手动填写 path，应确保每个集合使用不同路径，并留在内核允许的 HomeDir 范围。遇到路径限制先确认启动目录；不要为了绕开一条错误而直接放开全部目录。原始规则列表也需要保存，便于比较更新前后的差异。

## 用一个能命中的目标验证

配置加载通过后，选择一个确实包含在集合中的测试目标，重新发起请求，并检查连接记录里的规则与策略。如果没有命中，先核对内容是否属于该 behavior，再看顺序与引用，不要以列表条目数量判断有效性。

为了让结果可解释，每次只修一个错误：先让文件被读取，再让解析通过，最后核对路由结果。配置变更应放在不会被订阅覆盖的维护位置。相关基础可见[Clash 术语说明](/articles/clash-terms/)。

## 一手来源

- [MetaCubeX：规则集合字段](https://wiki.metacubex.one/config/rule-providers/)
- [MetaCubeX：规则集合内容格式](https://wiki.metacubex.one/config/rule-providers/content/)
