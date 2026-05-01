import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Event, Issue } from "./types";

/**
 * 合併 Tailwind CSS 類名
 * @param inputs 類名陣列
 * @returns 合併後的類名字串
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * 按指定欄位排序陣列
 * @param array 原始陣列
 * @param key 排序欄位
 * @param order 排序順序 ('asc' 或 'desc')
 * @returns 排序後的陣列
 */
export function sortBy<T extends Record<string, any>>(
  array: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc"
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return order === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return order === "asc" ? aVal - bVal : bVal - aVal;
    }

    if (
      aVal &&
      bVal &&
      "getTime" in aVal &&
      "getTime" in bVal &&
      typeof (aVal as Record<string, any>).getTime === "function" &&
      typeof (bVal as Record<string, any>).getTime === "function"
    ) {
      const aTime = (aVal as Record<string, any>).getTime();
      const bTime = (bVal as Record<string, any>).getTime();
      return order === "asc" ? aTime - bTime : bTime - aTime;
    }

    return 0;
  });
}

/**
 * 按 sortOrder 欄位排序
 * @param array 原始陣列
 * @returns 已排序的陣列
 */
export function sortByOrder<T extends { sortOrder?: number }>(
  array: T[]
): T[] {
  return [...array].sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
}

/**
 * 篩選陣列 - 按多個條件
 * @param array 原始陣列
 * @param predicates 篩選條件物件
 * @returns 篩選後的陣列
 */
export function filterBy<T extends Record<string, any>>(
  array: T[],
  predicates: Record<keyof T, any>
): T[] {
  return array.filter((item) =>
    Object.entries(predicates).every(([key, value]) => {
      if (value === null || value === undefined) return true;
      if (Array.isArray(value)) {
        return value.includes(item[key as keyof T]);
      }
      return item[key as keyof T] === value;
    })
  );
}

/**
 * 按類別分組
 * @param array 原始陣列
 * @param key 分組欄位
 * @returns 分組後的物件
 */
export function groupBy<T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> {
  return array.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

/**
 * 從陣列中移除重複項目
 * @param array 原始陣列
 * @param key 用於比較的欄位（可選）
 * @returns 移除重複後的陣列
 */
export function unique<T>(
  array: T[],
  key?: (item: T) => any
): T[] {
  if (!key) return [...new Set(array)];

  const seen = new Set();
  return array.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/**
 * 從陣列中取出前 N 個項目
 * @param array 原始陣列
 * @param count 取出數量
 * @returns 前 N 個項目的陣列
 */
export function take<T>(array: T[], count: number): T[] {
  return array.slice(0, count);
}

/**
 * 檢查物件是否為空
 * @param obj 物件
 * @returns 是否為空
 */
export function isEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * 深度複製物件
 * @param obj 原始物件
 * @returns 複製後的物件
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 延遲執行
 * @param ms 延遲毫秒數
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 按月份和年份排序 Issues
 * @param issues Issue 陣列
 * @param order 排序順序
 * @returns 已排序的 Issue 陣列
 */
export function sortIssuesByMonth(
  issues: Issue[],
  order: "asc" | "desc" = "desc"
): Issue[] {
  return [...issues].sort((a, b) => {
    const aDate = new Date(a.month);
    const bDate = new Date(b.month);
    return order === "asc"
      ? aDate.getTime() - bDate.getTime()
      : bDate.getTime() - aDate.getTime();
  });
}

/**
 * 按分類分組 Events
 * @param events Event 陣列
 * @returns 分類分組後的物件
 */
export function groupEventsByCategory(
  events: Event[]
): Record<string, Event[]> {
  return groupBy(events, "category");
}

/**
 * 按 placement 分組 Events
 * @param events Event 陣列
 * @returns placement 分組後的物件
 */
export function groupEventsByPlacement(
  events: Event[]
): Record<string, Event[]> {
  return groupBy(events, "placement");
}

/**
 * 獲取指定 Issue 的所有 Events
 * @param events Event 陣列
 * @param issueId Issue ID
 * @returns 該 Issue 的 Event 陣列
 */
export function getEventsByIssue(
  events: Event[],
  issueId: string
): Event[] {
  return events.filter((e) => e.issue === issueId);
}

/**
 * 獲取指定類別的 Events
 * @param events Event 陣列
 * @param category 類別
 * @returns 該類別的 Event 陣列
 */
export function getEventsByCategory(
  events: Event[],
  category: string
): Event[] {
  return events.filter((e) => e.category === category);
}

/**
 * 搜尋 Events (標題 + 標籤)
 * @param events Event 陣列
 * @param query 搜尋字串
 * @returns 符合的 Event 陣列
 */
export function searchEvents(events: Event[], query: string): Event[] {
  const q = query.toLowerCase();
  return events.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.summary.toLowerCase().includes(q) ||
      e.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

/**
 * 檢查是否為有效的 URL
 * @param url URL 字串
 * @returns 是否為有效的 URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 取得相對時間文字 (e.g., "2 天前")
 * @param date 日期字串
 * @returns 相對時間文字
 */
export function getRelativeTime(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} 年前`;
  if (months > 0) return `${months} 個月前`;
  if (weeks > 0) return `${weeks} 週前`;
  if (days > 0) return `${days} 天前`;
  if (hours > 0) return `${hours} 小時前`;
  if (minutes > 0) return `${minutes} 分鐘前`;
  return "剛剛";
}
