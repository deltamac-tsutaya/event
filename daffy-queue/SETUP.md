# Daffy POPUP 似顏畫 — 部署檢查清單

## 狀態檢查

### ✅ 前端配置
- [x] index.html - 客戶顯示頁面（根路由 `/`）
- [x] admin/index.html - 管理員面板（路由 `/admin`）
- [x] display/index.html - 現場看板（路由 `/display` - 橫向電視用）
- [x] assets/styles.css - 完整樣式表
- [x] assets/config.js - Firebase 配置文件
- [x] vercel.json - Clean URLs 配置

### 🔧 Firebase 配置（已完成）

在 `assets/config.js` 中已設定：

```javascript
firebaseConfig = {
  apiKey: "AIzaSyByGQiiKY1CjLOCyyzRXmeVR012HKTVDqQ",
  authDomain: "daffy-queue.firebaseapp.com",
  databaseURL: "https://daffy-queue-default-rtdb.firebaseio.com",
  projectId: "daffy-queue",
  ...
}
ADMIN_PASSWORD = "daffy2026"
```

## 部署前檢查清單

### 1. Firebase 資料庫規則 ✅
使用以下規則設置在 Firebase Console → Realtime Database → Rules：

```json
{
  "rules": {
    "queue": {
      "current": {
        ".read": true,
        ".write": true,
        ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 9999"
      }
    }
  }
}
```

**活動結束後**：立即將 `.write` 改為 `false` 以防止數據篡改。

### 2. Vercel 部署設置 ✅

- **Root Directory**: daffy-queue
- **Build Command**: (默認 - 靜態文件無需構建)
- **Output Directory**: (默認 - 整個目錄)
- **Framework**: Static

`vercel.json` 已配置以支持：
- `/` → `index.html` (客戶頁)
- `/admin` → `admin/index.html` (管理員)
- `/display` → `display/index.html` (看板)

### 3. 活動前準備

#### 設備配置

**客戶顯示屏** (`https://your-domain.vercel.app/`)
- 大屏幕（40"+ 推薦）
- 自動重新整理（頁面每30秒自動刷新）
- 實時更新（Firebase 當數據變化時立即更新）

**管理員面板** (`https://your-domain.vercel.app/admin`)
- iPad / 平板電腦
- 需輸入密碼：`daffy2026`
- 功能：
  - ＋1 下一位 - 呼叫下一號
  - 跳號 - 直接跳到指定號碼
  - 過號區 - 管理未到達的號碼

**現場看板** (`https://your-domain.vercel.app/display`)
- 側放電視（-90° 旋轉顯示）
- 在 iPad 上開啟並固定於側放的電視
- 雙視圖：
  - 左側：當前號碼（大字）
  - 右側：活動信息和預估等候時間

### 4. 活動當天流程

1. **早上活動前**：確認所有設備連接正常
   ```bash
   # 測試客戶頁
   https://your-domain.vercel.app/
   
   # 測試管理員
   https://your-domain.vercel.app/admin
   
   # 測試看板
   https://your-domain.vercel.app/display
   ```

2. **初始化號碼**：在管理員面板輸入密碼，設定初始號碼（通常為 0）

3. **呼叫客戶**：每次服務完成後點擊「＋1 下一位」

4. **過號處理**：未到達客戶的號碼自動進入「過號區」（黃色顯示）

5. **活動結束**：
   - 記錄最終號碼
   - **立即更新 Firebase 規則**：將 `.write` 改為 `false`
   - 存檔當日號碼記錄

### 5. 故障排查

| 問題 | 解決方案 |
|------|---------|
| 客戶頁顯示「連線失敗」| 檢查 Firebase 配置和網絡連接 |
| 管理員無法登入 | 確認密碼為 `daffy2026`，檢查 config.js |
| 號碼無法更新 | 檢查 Firebase 規則是否允許寫入 |
| 頁面不刷新 | 清除瀏覽器緩存，重新加載 |

### 6. 數據備份

活動結束後從 Firebase Console 導出數據：
1. Realtime Database → ⋮ (更多選項) → 匯出 JSON
2. 保存至 `queue-data-YYYY-MM-DD.json`

## 技術文檔

- **Framework**: Vanilla HTML/CSS/JavaScript（無構建工具）
- **Database**: Firebase Realtime Database
- **Hosting**: Vercel
- **Browser**: 現代瀏覽器（Chrome 90+, Safari 14+, Firefox 88+）
- **Dependencies**: Firebase JavaScript SDK v10.12.0

## 常見問題

**Q: 若客戶未達到時怎辦？**
A: 號碼自動進入「過號區」（黃色），可以點擊重新加入隊列。

**Q: 密碼遺忘了怎辦？**
A: 更改 `assets/config.js` 中的 `ADMIN_PASSWORD`，推送新版本至 Vercel。

**Q: 可以在多台設備上同時管理嗎？**
A: 可以，所有設備都連接相同的 Firebase 資料庫，改變會實時同步。

---

最後更新：2026-05-01
