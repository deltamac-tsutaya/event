/* 色彩系統 */
export const COLORS = {
  // 主色
  black: "#000000",
  white: "#FFFFFF",
  cream: "#F5F0E8",
  // 識別色
  greenInk: "#2D5016",
  redWine: "#8B4C5C",
  goldChampagne: "#D4AF37",
  // 輔助色
  grayLight: "#E8E3D8",
  grayDark: "#3D3D3D",
} as const;

/* 字體系統 */
export const FONTS = {
  serif: "Cormorant Garamond, Georgia, serif",
  serifTc: "思源宋體, serif",
  sans: "Noto Sans TC, sans-serif",
  display: "Playfair Display, serif",
} as const;

/* 分類標籤 */
export const CATEGORIES = {
  course: "課程與工作坊",
  dining: "餐飲優惠",
  event: "活動",
  collaboration: "合作企劃",
  member: "會員任務",
} as const;

/* Placement 位置描述 */
export const PLACEMENTS = {
  coverStory: "封面故事",
  feature: "專題報導",
  column: "固定欄目",
  shortlist: "策展選輯",
  hidden: "隱藏 (不在首頁顯示)",
} as const;

/* 店舖代碼 */
export const STORE_CODES = {
  taipei: "台北信義店",
  all: "全店舖",
} as const;

/* 狀態標籤 */
export const STATUS_LABELS = {
  draft: "草稿",
  published: "已發佈",
  scheduled: "排定中",
  ended: "已結束",
  archived: "已歸檔",
  cancelled: "已取消",
} as const;

/* 間距系統 */
export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "40px",
  "3xl": "48px",
  "4xl": "60px",
  "5xl": "80px",
} as const;

/* 最大寬度 */
export const MAX_WIDTHS = {
  content: "1400px",
  container: "1200px",
} as const;

/* 斷點 */
export const BREAKPOINTS = {
  mobile: 767,
  tablet: 768,
  tabletMax: 1024,
  desktop: 1025,
} as const;

/* 分頁配置 */
export const PAGINATION = {
  issuesPerPage: 12,
  eventsPerPage: 8,
  relatedEventsCount: 3,
} as const;

/* 時間格式 */
export const DATE_FORMATS = {
  iso: "YYYY-MM-DD",
  display: "YYYY.MM.DD",
  month: "YYYY.MM",
  fullDisplay: "YYYY年M月D日",
} as const;

/* 社群連結 */
export const SOCIAL_LINKS = {
  lineOa: "https://line.me/",
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
} as const;

/* API 端點 */
export const API_ENDPOINTS = {
  issues: "/api/issues",
  events: "/api/events",
  stores: "/api/stores",
} as const;
