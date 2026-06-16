// Core domain types for Mentoria Hub. Field names are final (see SPEC.md §2).

export type Grade = 8 | 9 | 10 | 11;
export type Language = "ru" | "kk" | "en";
export type Citizenship = "KZ" | "other";
export type Role = "student" | "mentor" | "admin";
export type EnglishLevel = "none" | "A2" | "B1" | "B2" | "C1";

export type OpportunityCategory =
  | "scholarship"
  | "olympiad"
  | "hackathon"
  | "research"
  | "internship"
  | "summer_school"
  | "prep"
  | "program";

export type Direction =
  | "STEM"
  | "business"
  | "social"
  | "finance"
  | "coding"
  | "science"
  | "languages";

export type Format = "online" | "offline" | "hybrid";

export type TopicLevelValue = "weak" | "mid" | "strong";

export interface OpportunityReq {
  min_grade?: Grade;
  max_grade?: Grade;
  citizenship?: Citizenship;
  min_english?: EnglishLevel;
  subjects?: string[];
  // map of topic -> required mastery level, used by the readiness engine
  target_levels?: Record<string, TopicLevelValue>;
}

export interface Opportunity {
  id: string;
  title: string;
  org: string;
  category: OpportunityCategory;
  direction: Direction;
  format: Format;
  region?: string | null;
  city?: string | null;
  deadline: string; // ISO date (YYYY-MM-DD)
  description: string;
  apply_url: string;
  tags: string[];
  req: OpportunityReq;
  save_count: number;
}

export interface TopicLevel {
  topic: string;
  score: number; // 0..100
  level: TopicLevelValue;
}

export interface Profile {
  id: string;
  name: string;
  grade: Grade;
  region: string;
  city: string;
  language: Language;
  citizenship: Citizenship;
  role: Role;
  english_level: EnglishLevel;
  goals: string[];
  diagnostic_status: "offered" | "skipped" | "done";
  topic_levels: TopicLevel[];
}

export type EligibilityStatus = "qualify" | "soon" | "locked";

export interface EligibilityResult {
  status: EligibilityStatus;
  met: string[]; // plain-language reasons satisfied
  missing: string[]; // plain-language reasons not yet satisfied
}

export interface ReadinessResult {
  percent: number; // 0..100
  gaps: string[]; // topics below required level
  perTopic: { topic: string; have: TopicLevelValue | "none"; need: TopicLevelValue; ok: boolean }[];
}

export interface Certificate {
  id: string;
  profile_id: string;
  course_id: string;
  issued_at: string; // ISO date/time
  hash: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  correctIndex: number;
}

export interface Lesson {
  id: string;
  ord: number;
  title: string;
  content_md: string;
  video_url?: string;
  task_md?: string;
  quiz: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate";
  topic_tags: string[];
  lessons: Lesson[];
}

export type SavedStatus = "saved" | "preparing" | "ready" | "applied";

export interface SavedItem {
  profile_id: string;
  opportunity_id: string;
  status: SavedStatus;
}

export interface Enrollment {
  profile_id: string;
  course_id: string;
  progress: number; // 0..100
  completed_at: string | null;
}
