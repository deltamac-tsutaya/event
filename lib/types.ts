/* Issue (月刊期數) 型別定義 */
export interface IssueStory {
  title: string;
  subtitle: string;
  excerpt: string;
  slug: string;
  category: string;
}

export interface EditorNote {
  text: string;
  author: string;
  date: string;
}

export interface CoverImage {
  url: string;
  alt: string;
  credit?: string;
}

export type IssueStatus = "draft" | "scheduled" | "published" | "archived";

export interface Issue {
  id: string;
  issueName: string;
  month: string;
  issue_number: number;
  year: number;
  theme: string;
  coverImage: CoverImage;
  coverStory: IssueStory;
  editorNote: EditorNote;
  status: IssueStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  viewCount?: number;
  eventCount?: number;
}

/* Event (活動) 型別定義 */
export type EventCategory =
  | "course"
  | "dining"
  | "event"
  | "collaboration"
  | "member";
export type EventPlacement =
  | "coverStory"
  | "feature"
  | "column"
  | "shortlist"
  | "hidden";
export type EventStatus = "draft" | "published" | "ended" | "cancelled";

export interface EventCTA {
  text: string;
  url: string;
  type: "internal" | "external";
}

export interface EventLocation {
  store: "taipei" | "all";
  address?: string;
  openingHours?: string;
}

export interface EventImage {
  url: string;
  alt: string;
  credit?: string;
}

export interface EventTime {
  start: string;
  end: string;
}

export interface Event {
  id: string;
  issue: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: EventCategory;
  subcategory?: string;
  placement: EventPlacement;
  startDate: string;
  endDate: string;
  time?: EventTime;
  location: EventLocation;
  image: EventImage;
  cta: EventCTA;
  price?: string;
  capacity?: number;
  isFeatured?: boolean;
  tags: string[];
  status: EventStatus;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  viewCount?: number;
  clickCount?: number;
  registrationCount?: number;
}

/* Store (店舖) 型別定義 */
export interface Store {
  id: string;
  name: string;
  code: "taipei" | "all";
  address: string;
  phone: string;
  openingHours: string;
  description: string;
  image?: CoverImage;
}

/* Metadata 型別 */
export interface SEOMeta {
  title: string;
  description: string;
  image?: string;
  url?: string;
}
