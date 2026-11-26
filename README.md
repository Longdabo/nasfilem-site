# NASFileM 官网

静态网页由 GitHub Pages 托管。此仓库仅包含官网文件。

本地预览可在此目录运行 `python3 -m http.server 8080`，然后访问 `http://localhost:8080`。

## 发布客户端

- 将桌面公开安装包作为 GitHub Releases 附件上传。Mac 对外发布前需完成 Developer ID 签名与公证。
- 在 `assets/releases.js` 填入已上线的公开链接。键与首页的 `data-platform` 一致。
- 示例：`mac: { label: '下载 DMG', url: 'https://github.com/Longdabo/nasfilem-site/releases/latest/download/NASFileM-macOS-AppleSilicon.dmg', details: '1.0.0 · 58 MB' }`。
- Android 和 Apple 平台的入口使用已公开的正式商品页 URL。可将商店提供的官方徽章存入 `assets/`，并在对应入口加上 `badge: 'assets/文件名'`。链接未配置时，页面显示对应平台的发布状态。
- 发布前检查页面公开可访问性、系统要求、版本信息，以及隐私和支持信息是否符合最终发行版。
