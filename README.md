WIRED TOKYO 活動平台

多專案單一儲存庫，包含三個獨立應用程式，用於 WIRED TOKYO 活動管理與數位體驗。

專案結構

\/a-la-page
À LA PAGE - TSUTAYA BOOKSTORE × WIRED TOKYO 的數位第三空間網站

技術堆疊：Next.js 15、TypeScript、Tailwind CSS
用途：雜誌風格數位平台，呈現每月活動、故事與合作機會
狀態：可正式上線
開始開發：cd a-la-page && npm run dev

主要功能：
每月雜誌風格首頁與編輯內容
活動探索與詳細頁面
店舖資訊與活動
合作申請表單
聯絡資訊

\/daffy-queue
活動場地排隊管理系統

技術堆疊：HTML/JavaScript + Firebase 即時資料庫
用途：Daffy POPUP 人像繪製活動的即時排隊管理
功能：
顧客顯示頁面（自動更新、即時同步）
工作人員管理面板（密碼保護，+1／跳過控制）
活動顯示看板（適用側向電視旋轉顯示）
狀態：可正式上線
部署：Vercel（根目錄：daffy-queue）
開始開發：
python3 -m http.server 8000
# 開啟 http://localhost:8000/
設定：於 assets/config.js 編輯 Firebase 凭證與工作人員密碼
活動前準備：完整部署檢核表請見 daffy-queue/SETUP.md

\/taichung-8th-anniversary
台中據點八週年慶祝網站

技術堆疊：Next.js、React、TypeScript
用途：據點里程碑活動的特別網站
文件：請參考專案目錄中的 CLAUDE.md 與 OPERATION_MANUAL.md

快速開始

開發 À LA PAGE
cd a-la-page
npm install
npm run dev  # 啟動本機開發伺服器於 localhost:3000

產生正式版本
cd a-la-page
npm run build
npm run start

部署
所有專案皆已設定 Vercel 部署。將變更推送至對應分支，Vercel 會自動建置與部署。

開發分支
目前開發作業於：develop/a-la-page

專案相依性
À LA PAGE 需 Node.js 18+ 與 npm/yarn
daffy-queue 與 taichung-8th-anniversary 各自有其環境需求（詳見各專案 README）

文件
À LA PAGE 設計系統：請見 a-la-page/tailwind.config.ts 中元件與設計標準
API/資料結構：請見 a-la-page/lib/types.ts
模擬資料：a-la-page/lib/mockData.ts

最近更新
將 À LA PAGE 遷移至子目錄，優化單一儲存庫結構（v1.0）
完成所有 8 個開發階段
已準備正式上線
