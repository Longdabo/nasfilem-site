# BeaverNAS 官网

静态网页由 GitHub Pages 托管。公开安装包作为同一仓库的 GitHub Releases 附件分发。

本地预览可在此目录运行 `python3 -m http.server 8080`，然后访问 `http://localhost:8080`。

## 发布客户端

1. 在对应系统安装并验证候选包。Mac 官网版需要 Developer ID 签名和 Apple 公证，Android 官网版需要与正式发行渠道一致的应用签名。
2. 在这个仓库创建带固定版本标签的 GitHub Release，先保存草稿。上传已验证的安装包，核对附件的 SHA-256 与本地产物相同，再发布 Release。同一版本可按平台补齐附件。修订已发布的安装包时，使用新的版本标签。
3. 在 Release 公开后运行 `python3 scripts/add_release_assets.py v1.0.0 windows linux-deb`。按已发布的平台传参，可用键为 `mac`、`windows`、`linux-deb`、`linux-appimage`、`android`、`android-tv`。脚本匿名验证附件可访问，再填写固定版本的下载地址、架构、大小和 SHA-256。其他平台继续读取各自已发布的版本。
4. 在 Pages 部署后检查 `/download/`，点开每个新增下载和 SHA-256，确认发行版、系统要求及下载入口一致。

对 App Store 或 Google Play，使用已公开的商品页。`assets/releases.js` 中每个平台对应一个数组，商店入口可写为 `{"label": "在 App Store 下载", "url": "正式商品页 URL"}`，可加 `badge` 指向存入 `assets/` 的官方商店徽章。Android 手机和 Android TV 可同时展示商店和直下载，同一个正式 APK 可供两处引用。
