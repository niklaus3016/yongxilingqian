// 农历与干支传统历法计算辅助模块

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

const LUNAR_MONTHS = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const LUNAR_DAYS = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

const AUSPICIOUS_ACTIONS = [
  ['祈福', '求嗣', '开市', '出行', '修造', '纳财'],
  ['祭祀', '动土', '入学', '安床', '求医', '进宝'],
  ['合帐', '裁衣', '立券', '挂匾', '订盟', '纳采'],
  ['纳畜', '会友', '安门', '栽种', '上梁', '开光'],
  ['理发', '开渠', '扫舍', '修饰', '牧养', '安宅'],
];

const INAUSPICIOUS_ACTIONS = [
  ['动土', '破土', '诉讼', '远行', '争吵'],
  ['作灶', '安葬', '伐木', '借贷', '忧虑'],
  ['结网', '栽种', '探病', '重利', '嗔怒'],
  ['出火', '行舟', '开仓', '逞强', '赌博'],
];

export interface LunarDateInfo {
  solarDateStr: string; // e.g. 2026年8月17日 星期一
  lunarYearStr: string; // e.g. 丙午年 [马年]
  lunarMonthDayStr: string; // e.g. 农历七月初五
  solarTerm: string; // 节气或吉言
  auspicious: string[]; // 宜
  inauspicious: string[]; // 忌
  luckyHour: string; // 今日吉时
  zodiac: string; // 属相
}

export function getTodayLunarInfo(date: Date = new Date()): LunarDateInfo {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];

  // 计算干支年 (以 1984 甲子年为基准)
  const baseYear = 1984;
  const yearOffset = (year - baseYear) % 60;
  const stemIndex = (yearOffset % 10 + 10) % 10;
  const branchIndex = (yearOffset % 12 + 12) % 12;
  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];
  const zodiac = ZODIAC_ANIMALS[branchIndex];

  // 简易农历月日估算算法（纯离线逼真黄历生成）
  const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 1).getTime()) / (24 * 3600 * 1000));
  const approxLunarMonthIndex = Math.floor((dayOfYear + 20) / 29.53) % 12;
  const approxLunarDayIndex = Math.floor((dayOfYear + 5) % 29.53);

  const lunarMonthStr = LUNAR_MONTHS[approxLunarMonthIndex] || '七';
  const lunarDayStr = LUNAR_DAYS[approxLunarDayIndex] || '初五';

  // 随机但每日固定的黄历宜忌
  const dateHash = year * 10000 + month * 100 + day;
  const ausIndex = dateHash % AUSPICIOUS_ACTIONS.length;
  const inausIndex = (dateHash + 1) % INAUSPICIOUS_ACTIONS.length;

  const hours = ['辰时 (07:00-09:00)', '巳时 (09:00-11:00)', '午时 (11:00-13:00)', '申时 (15:00-17:00)', '酉时 (17:00-19:00)'];
  const luckyHour = hours[dateHash % hours.length];

  return {
    solarDateStr: `${year}年${month}月${day}日 星期${dayOfWeek}`,
    lunarYearStr: `${stem}${branch}年 · 生肖${zodiac}`,
    lunarMonthDayStr: `农历${lunarMonthStr}月${lunarDayStr}`,
    solarTerm: '天朗气清·紫气东来',
    auspicious: AUSPICIOUS_ACTIONS[ausIndex],
    inauspicious: INAUSPICIOUS_ACTIONS[inausIndex],
    luckyHour,
    zodiac,
  };
}
