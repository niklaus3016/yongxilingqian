export type LotTier = '上上' | '上吉' | '中吉' | '平平' | '下吉' | '下凶';

export type LotCategory = 'all' | 'career' | 'love' | 'wealth' | 'health' | 'random';

export interface LotItem {
  id: number;
  tier: LotTier;
  title: string; // 典故四字，如 "太公钓鱼", "嫦娥奔月"
  subTitle?: string; // 典故出处或主旨
  poem: [string, string, string, string]; // 四句七言诗
  summary: string; // 综合白话解签
  career: string; // 事业学业
  love: string; // 姻缘情感
  wealth: string; // 财运富贵
  health: string; // 健康平安
  family: string; // 家宅出行
  guide: string; // 仙机点化/开运建议
  luckyColor: string; // 开运色
  luckyDirection: string; // 开运方位
  luckyHour: string; // 开运时辰 (如 辰时/巳时)
  score: number; // 运势指数 60 - 100
}

export interface FortuneRecord {
  id: string;
  timestamp: number;
  lotId: number;
  category: LotCategory;
  categoryName: string;
  isFavorite?: boolean;
  userNote?: string;
}

export interface WishItem {
  id: string;
  timestamp: number;
  text: string;
  sender: string;
  category: string;
  type: 'ribbon' | 'plaque'; // 红丝带 或 祈福木牌
  incenseCount: number;
  color: string;
}

export type ThemeType = 'imperial-red' | 'bamboo-green' | 'ink-black' | 'golden-amber';

export interface AppSettings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  animationEnabled: boolean;
  theme: ThemeType;
  autoSpeech: boolean;
}

export interface DailyFortuneStatus {
  dateStr: string; // YYYY-MM-DD
  lotId: number;
  viewedAt: number;
  blessingWord: string;
  luckyIndex: number;
}
