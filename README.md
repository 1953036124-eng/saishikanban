# 英语赛事看板 · 赛事惊喜卡

英语类重大事项时间表看板：截止倒计时、月日程表、我的关注、重要比赛汇总，以及关注即可解锁的电影惊喜卡。

## 在线地址

https://f8aa4b574bce439883ed3d2b13316c8d.app.workbuddy.host/

## 目录结构

```
.
├── index.html          ← 入口页（必须在最外层，文件名一个字母都不能错）
├── manifest.json       ← 安装到桌面/主屏幕所需的配置
├── sw.js               ← 离线缓存（Service Worker）
├── .nojekyll           ← 告诉 GitHub Pages 不要用 Jekyll 处理，纯静态直出
├── README.md
└── assets/
    ├── apple-touch-icon.png
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-512.png
    ├── shot-wide.png
    ├── shot-narrow.png
    └── cards/          ← 30 张赛事惊喜卡（c01.webp ~ c30.webp）
```

## 部署到 GitHub Pages

1. 仓库 → **Settings** → 左侧 **Pages**
2. **Source** 选 `Deploy from a branch`
3. Branch 选 `main`，目录选 `/(root)`，点 **Save**
4. 等 1~2 分钟，访问 `https://<你的用户名>.github.io/<仓库名>/`

## 说明

- 整站是一个自包含页面，所有样式、脚本、数据都在 `index.html` 里内联，外加 `assets/` 里的图标与卡面。
- 站内没有登录、没有后端；用户的收藏、打卡、集卡进度只存在自己设备上。
- 更新内容时，改完 `index.html` 后重新上传覆盖即可（`assets/` 一般不用动）。
