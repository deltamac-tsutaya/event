# ♾️ Nexus Life 8 週年慶典 —— 操作與部署說明書

本專案是一個結合 LINE LIFF、Supabase 與 Next.js 的高質感集章抽獎系統。這份文件將引導您完成最終部署、環境設定與日常操作。

---

## 🚀 一、環境變數與 LIFF 設定 (Vercel)

在您的 Vercel 專案設定中（Settings -> Environment Variables），請確保已填寫以下四個變數：

### 1. Supabase 連線資訊
您可以在 Supabase Dashboard 的 **Project Settings -> API** 中找到：
- `NEXT_PUBLIC_SUPABASE_URL`: 專案的 URL (例如 `https://xyz...supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 您的 anon public key
- `SUPABASE_SERVICE_ROLE_KEY`: 您的 service_role key (用於後端寫入)

### 2. LIFF ID 設定
- `NEXT_PUBLIC_LIFF_ID`: 在 LINE Developers Console 中取得的 LIFF ID。
  - **重要**：如果沒有填寫這個變數，網頁會自動啟動「本機測試模式 (Mock User)」，無法獲取真實的 LINE 帳號資料。

---

## 🗄️ 二、資料庫初始化 (Supabase)

如果您在測試時遇到「沒有 QR Code」或是「抽獎錯誤」，請依照以下步驟重置與灌入資料：

1. 進入 Supabase 的 **SQL Editor**。
2. 複製專案中 `supabase/schema.sql` 的全文，貼上並執行 (Run)。
   - **注意**：這會幫您建立所有必備資料表，並開啟 UUID 支援。
3. 清除舊有視窗，複製專案中 `supabase/seed.sql` 的全文，貼上並執行。
   - **注意**：這會清除舊有設定，並自動寫入最新的 **11 個點位** 與 **14 個動態獎項**。

---

## 📱 三、活動流程與隱藏點位說明

### 1. 使用者集章流程
- 使用者在 LINE 中點開 LIFF 連結，進入首頁。
- 點擊「掃描印記」開啟相機，掃描現場的 QR Code。
- 集滿 **8 個標準點位 (01~08)** 後，即達成進度，解鎖抽獎。

### 2. 隱藏成就點 (A, B, C)
為了增加場域探索的趣味性，我們安插了三個隱藏點位：
- **A 點 (松鼠)**
- **B 點 (小鳥)**
- **C 點 (小鹿)**
- **機制**：掃描隱藏點會觸發專屬成就卡片與感性對話，但 **不會** 增加主進度的計數 (主進度最多只顯示 8)。

---

## 🎁 四、獎項管理與抽獎輪替

### 1. 動態修改獎項
我們已經將獎項資料從程式碼分離至資料庫的 `rewards` 表格。您可以隨時在 Supabase 後台：
- 修改 `probability` (中獎權重)：數字越大，越容易被抽中。
- 修改 `daily_limit` (每日限量)：控制該獎項一天最多送出幾個。
- **無需重新部署**，存檔後 API 會自動即時生效。

### 2. 每日輪替點位 (02, 05, 06)
- 點位 02、05、06 擁有多個版本 (Variant)。
- 系統 API 會在每次後台要求印出新 QR Code 或換日資料重置時，自動於這些版本中亂數挑選一個啟用。

---

## 🛠️ 五、常見問題 (Troubleshooting)

**Q: 在 Vercel 上打開網頁，畫面一片白或報錯？**
A: 請檢查 Vercel 的環境變數是否設定正確。特別是 `SUPABASE_SERVICE_ROLE_KEY` 如果缺漏，API 將直接回傳 500 錯誤。

**Q: 列印頁面 (`/staff/print`) 看不到 QR Code？**
A: 請確認已在 Supabase 執行過 `seed.sql` 灌入設定資料。若已經灌入，請檢查您的瀏覽器 Network 工具，是否 `/api/staff/configs` 請求失敗。

**Q: 想要清除測試資料重新開始？**
A: 在 Supabase SQL Editor 中執行以下指令：
```sql
TRUNCATE public.stamps CASCADE;
TRUNCATE public.draws CASCADE;
```
這會清除所有使用者的集章紀錄與抽獎紀錄，但保留系統的獎項與點位配置。
