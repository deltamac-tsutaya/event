/**
 * 格式化日期為顯示格式
 * @param date ISO 8601 格式的日期字串
 * @returns 格式化後的日期 (YYYY.MM.DD)
 */
export function formatDate(date: string): string {
  try {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  } catch {
    return date;
  }
}

/**
 * 格式化為完整日期文字
 * @param date ISO 8601 格式的日期字串
 * @returns 格式化後的日期 (2025年5月10日)
 */
export function formatDateFull(date: string): string {
  try {
    const d = new Date(date);
    return d.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

/**
 * 格式化為月份
 * @param monthString YYYY-MM 格式
 * @returns 格式化後的月份 (2025.05)
 */
export function formatMonth(monthString: string): string {
  const [year, month] = monthString.split("-");
  return `${year}.${month}`;
}

/**
 * 格式化為月份文字
 * @param monthString YYYY-MM 格式
 * @returns 格式化後的月份 (2025年5月)
 */
export function formatMonthFull(monthString: string): string {
  try {
    const [year, month] = monthString.split("-");
    return `${year}年${parseInt(month)}月`;
  } catch {
    return monthString;
  }
}

/**
 * 格式化價格
 * @param price 價格字串或數字
 * @returns 格式化後的價格 (NT$1,200 或 免費)
 */
export function formatPrice(price: string | number | undefined): string {
  if (!price) return "免費";
  if (typeof price === "string" && price.toLowerCase() === "free") return "免費";
  if (price === 0) return "免費";

  const priceNum = typeof price === "string" ? parseInt(price) : price;
  if (isNaN(priceNum)) return String(price);

  return `NT$${priceNum.toLocaleString("zh-TW")}`;
}

/**
 * 截斷文字
 * @param text 原始文字
 * @param maxLength 最大長度
 * @param suffix 結尾符號
 * @returns 截斷後的文字
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = "..."
): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
}

/**
 * 將字串轉換為 slug (URL 安全)
 * @param text 原始文字
 * @returns slug 格式
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/^-+|-+$/g, "");
}

/**
 * 反向 slug - 將 slug 轉回可讀文字
 * @param slug slug 格式
 * @returns 可讀文字
 */
export function unslugify(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * 計算活動是否進行中
 * @param startDate 開始日期
 * @param endDate 結束日期
 * @returns 是否進行中
 */
export function isEventOngoing(startDate: string, endDate: string): boolean {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return now >= start && now <= end;
}

/**
 * 計算活動是否已結束
 * @param endDate 結束日期
 * @returns 是否已結束
 */
export function isEventEnded(endDate: string): boolean {
  return new Date() > new Date(endDate);
}

/**
 * 計算活動是否即將開始
 * @param startDate 開始日期
 * @param daysAhead 提前天數
 * @returns 是否即將開始
 */
export function isEventUpcoming(startDate: string, daysAhead: number = 7): boolean {
  const now = new Date();
  const start = new Date(startDate);
  const daysInMs = daysAhead * 24 * 60 * 60 * 1000;
  return now < start && now.getTime() >= start.getTime() - daysInMs;
}

/**
 * 格式化時間範圍
 * @param startTime HH:MM 格式
 * @param endTime HH:MM 格式
 * @returns 格式化後的時間範圍 (14:00-17:00)
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime}–${endTime}`;
}

/**
 * 將類別代碼轉換為中文
 * @param category 類別代碼
 * @returns 中文類別名稱
 */
export function getCategoryLabel(
  category: "course" | "dining" | "event" | "collaboration" | "member"
): string {
  const labels: Record<string, string> = {
    course: "課程與工作坊",
    dining: "餐飲優惠",
    event: "活動",
    collaboration: "合作企劃",
    member: "會員任務",
  };
  return labels[category] || category;
}

/**
 * 計算文章閱讀時間（分鐘）
 * @param text 文字內容
 * @param wordsPerMinute 每分鐘字數（中文約 400 字/分鐘）
 * @returns 估計閱讀時間（分鐘）
 */
export function getReadingTime(text: string, wordsPerMinute: number = 400): number {
  const wordCount = text.length;
  return Math.ceil(wordCount / wordsPerMinute);
}
