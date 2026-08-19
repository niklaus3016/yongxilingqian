import { AppSettings, FortuneRecord, WishItem, DailyFortuneStatus } from '../types';
import { sound } from './audio';

const STORAGE_KEYS = {
  HISTORY: 'yx_fortune_history_v1',
  FAVORITES: 'yx_fortune_favorites_v1',
  WISHES: 'yx_fortune_wishes_v1',
  SETTINGS: 'yx_app_settings_v1',
  DAILY_STATUS: 'yx_daily_fortune_status_v1',
  MERIT_COUNT: 'yx_merit_count_v1',
  CONSENT: 'yx_user_consent_v1',
};

export interface UserConsent {
  agreed: boolean;
  version: string;
  timestamp: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  vibrationEnabled: true,
  animationEnabled: true,
  theme: 'imperial-red',
  autoSpeech: false,
};

const INITIAL_WISHES: WishItem[] = [
  {
    id: 'w1',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    text: '愿家人福寿康宁，四季顺遂，平安无疾苦。',
    sender: '香客·善缘',
    category: '平安',
    type: 'plaque',
    incenseCount: 88,
    color: '#8b1e1e',
  },
  {
    id: 'w2',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    text: '愿今年考研金榜题名，一战成硕，前程万里！',
    sender: '逐梦书生',
    category: '学业',
    type: 'ribbon',
    incenseCount: 168,
    color: '#c2410c',
  },
  {
    id: 'w3',
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
    text: '求得良缘，与所爱之人相濡以沫，岁岁年年。',
    sender: '灵犀一指',
    category: '姻缘',
    type: 'ribbon',
    incenseCount: 99,
    color: '#be185d',
  },
  {
    id: 'w4',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    text: '事业蒸蒸日上，遇贵人指点，日进斗金，福禄双全。',
    sender: '商贾客',
    category: '财运',
    type: 'plaque',
    incenseCount: 120,
    color: '#b45309',
  },
];

export const storage = {
  // 1. 求签历史
  getHistory(): FortuneRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveHistory(record: FortuneRecord): FortuneRecord[] {
    const list = this.getHistory();
    const updated = [record, ...list].slice(0, 200); // 保留最多 200 条
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Storage full', e);
    }
    return updated;
  },

  deleteHistoryItem(id: string): FortuneRecord[] {
    const list = this.getHistory().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(list));
    return list;
  },

  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  },

  // 2. 收藏
  getFavorites(): number[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite(lotId: number): boolean {
    const favs = this.getFavorites();
    const index = favs.indexOf(lotId);
    let isFav = false;
    if (index >= 0) {
      favs.splice(index, 1);
      isFav = false;
    } else {
      favs.unshift(lotId);
      isFav = true;
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    return isFav;
  },

  isFavorite(lotId: number): boolean {
    return this.getFavorites().includes(lotId);
  },

  // 3. 祈福寄语
  getWishes(): WishItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHES);
      return data ? JSON.parse(data) : INITIAL_WISHES;
    } catch {
      return INITIAL_WISHES;
    }
  },

  addWish(wish: WishItem): WishItem[] {
    const list = this.getWishes();
    const updated = [wish, ...list];
    localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(updated));
    return updated;
  },

  addIncenseToWish(id: string): WishItem[] {
    const list = this.getWishes().map((w) =>
      w.id === id ? { ...w, incenseCount: w.incenseCount + 1 } : w
    );
    localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(list));
    return list;
  },

  deleteWish(id: string): WishItem[] {
    const list = this.getWishes().filter((w) => w.id !== id);
    localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(list));
    return list;
  },

  // 4. 用户设置
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const res = data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
      sound.setConfig(res.soundEnabled, res.vibrationEnabled);
      return res;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    sound.setConfig(updated.soundEnabled, updated.vibrationEnabled);
    return updated;
  },

  // 5. 每日一签状态
  getDailyStatus(): DailyFortuneStatus | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_STATUS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveDailyStatus(status: DailyFortuneStatus): void {
    localStorage.setItem(STORAGE_KEYS.DAILY_STATUS, JSON.stringify(status));
  },

  // 6. 木鱼功德值
  getMeritCount(): number {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MERIT_COUNT);
      return data ? parseInt(data, 10) : 0;
    } catch {
      return 0;
    }
  },

  incrementMeritCount(): number {
    const count = this.getMeritCount() + 1;
    localStorage.setItem(STORAGE_KEYS.MERIT_COUNT, count.toString());
    return count;
  },

  // 7. 数据备份与恢复
  exportBackupData(): string {
    const data = {
      history: this.getHistory(),
      favorites: this.getFavorites(),
      wishes: this.getWishes(),
      settings: this.getSettings(),
      meritCount: this.getMeritCount(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },

  // 8. 用户协议与隐私政策同意状态
  getConsent(): UserConsent | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONSENT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveConsent(agreed: boolean): UserConsent {
    const record: UserConsent = {
      agreed,
      version: '1.0',
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.CONSENT, JSON.stringify(record));
    return record;
  },

  hasUserConsented(): boolean {
    return this.getConsent()?.agreed === true;
  },

  importBackupData(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.history) localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(parsed.history));
      if (parsed.favorites) localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(parsed.favorites));
      if (parsed.wishes) localStorage.setItem(STORAGE_KEYS.WISHES, JSON.stringify(parsed.wishes));
      if (parsed.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));
      if (parsed.meritCount !== undefined) localStorage.setItem(STORAGE_KEYS.MERIT_COUNT, parsed.meritCount.toString());
      return true;
    } catch {
      return false;
    }
  },

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    localStorage.removeItem(STORAGE_KEYS.WISHES);
    localStorage.removeItem(STORAGE_KEYS.DAILY_STATUS);
    localStorage.removeItem(STORAGE_KEYS.MERIT_COUNT);
    // 注意：CONSENT 不在此处清理 —— 即使数据被清空，用户的同意记录依然有效，
    // 避免每次重置都强制用户重新同意协议；如需重新同意，可手动调用 revokeConsent。
  },

  revokeConsent(): void {
    localStorage.removeItem(STORAGE_KEYS.CONSENT);
  },
};
