import {loadArticles,escapeHtml as e} from './content.mjs';

const routes={android:'/downloads/android/',windows:'/downloads/windows/',tutorials:'/tutorials/'};
export async function loadLandingPages(){
 const pages=await loadArticles('content/pages',['downloads','tutorials']);
 for(const p of pages){if(!routes[p.slug])throw Error('未知专题页面 '+p.slug);p.route=routes[p.slug];}
 return pages;
}
export function landingBody(p){
 const nested=p.category==='downloads';
 return `<nav class="wrap article-path" aria-label="当前位置"><a href="/">首页</a><span>/</span>${nested?'<a href="/downloads/">软件下载</a><span>/</span>':''}<span>${e(p.title)}</span></nav><div class="page-intro wrap"><span class="eyebrow">${nested?'DOWNLOAD & SET UP':'START HERE'}</span><h1>${e(p.title)}</h1><p>${e(p.description)}</p><div class="guide-update">内容核验：${p.updated} · ${e(p.author)}</div></div><section class="wrap detail-layout section landing-layout"><article class="prose">${p.html}</article><aside class="detail-aside"><h2>本页导航</h2>${p.toc.filter(x=>x.depth===2).map(x=>`<a class="toc" href="#${x.id}">${e(x.title)}</a>`).join('')}<hr><a href="/downloads/android/">安卓下载与安装 →</a><a href="/downloads/windows/">Windows 下载与配置 →</a><a href="/tutorials/">完整使用教程 →</a></aside></section>`;
}
export function platformEntries(){return '<div class="platform-paths"><a href="/downloads/android/"><span>ANDROID</span><strong>Clash 安卓下载</strong><p>手机 APK 选择、安装权限与首次连接</p></a><a href="/downloads/windows/"><span>WINDOWS</span><strong>Clash 电脑版下载</strong><p>x64 / ARM64、安装与系统代理设置</p></a><a href="/tutorials/"><span>GET STARTED</span><strong>Clash 怎么用</strong><p>从导入订阅到验证规则与排查故障</p></a></div><p class="source-path">先核对来源：<a href="/articles/clash-official-sources/">各客户端开发者仓库与发布页</a> · <a href="/articles/android-first-run/">Clash Meta for Android 首次运行教程</a></p>';}
