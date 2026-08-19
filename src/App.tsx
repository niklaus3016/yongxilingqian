import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, HeartHandshake, BookOpen, Bell, Flame, ChevronRight } from 'lucide-react';
import { LotCategory, LotItem, AppSettings } from './types';
import { storage } from './utils/storage';
import { sound } from './utils/audio';
import { getTodayLunarInfo } from './data/calendar';
import { Header } from './components/Header';
import { Navbar, NavTab } from './components/Navbar';
import { DivinationFlow } from './components/DivinationFlow';
import { LotDetailModal } from './components/LotDetailModal';
import { DailyLot } from './components/DailyLot';
import { HistoryAndFavorites } from './components/HistoryAndFavorites';
import { BlessingWall } from './components/BlessingWall';
import { WoodenFishModal } from './components/WoodenFishModal';
import { SettingsModal } from './components/SettingsModal';
import { PrivacyConsent } from './components/PrivacyConsent';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings());
  const [favoritesCount, setFavoritesCount] = useState<number>(0);

  // 启动协议同意状态：未同意时全屏拦截，禁止使用应用
  const [consentGranted, setConsentGranted] = useState<boolean>(() =>
    storage.hasUserConsented()
  );

  // 核心求签流程状态
  const [isDivinating, setIsDivinating] = useState<boolean>(false);
  const [activeLot, setActiveLot] = useState<LotItem | null>(null);
  const [activeCategoryName, setActiveCategoryName] = useState<string>('通用祈福');

  // 木鱼弹窗
  const [showWoodenFish, setShowWoodenFish] = useState<boolean>(false);

  const lunar = getTodayLunarInfo();

  const refreshFavorites = () => {
    setFavoritesCount(storage.getFavorites().length);
  };

  useEffect(() => {
    refreshFavorites();
  }, [activeLot]);

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = storage.saveSettings(newSettings);
    setSettings(updated);
  };

  // 用户点击主界面【静心求签】
  const handleStartDivination = () => {
    sound.playTempleBell();
    setIsDivinating(true);
  };

  // 求签完成出签
  const handleLotDrawn = (lot: LotItem, category: LotCategory, categoryName: string) => {
    // 自动保存至本地历史记录
    storage.saveHistory({
      id: 'rec_' + Date.now(),
      timestamp: Date.now(),
      lotId: lot.id,
      category,
      categoryName,
    });

    setIsDivinating(false);
    setActiveLot(lot);
    setActiveCategoryName(categoryName);
    refreshFavorites();
  };

  // 查看历史或日签详情
  const handleInspectLot = (lot: LotItem, categoryName: string = '灵签解义') => {
    sound.playClick(600);
    setActiveLot(lot);
    setActiveCategoryName(categoryName);
    refreshFavorites();
  };

  // 主题色类名映射
  const getThemeBackground = () => {
    switch (settings.theme) {
      case 'bamboo-green':
        return 'bg-[#F4F8F3]';
      case 'ink-black':
        return 'bg-[#F2EFEB]';
      case 'golden-amber':
        return 'bg-[#FCF8EE]';
      case 'imperial-red':
      default:
        return 'bg-[#FDF8F2]';
    }
  };

  return (
    <div
      className={`min-h-screen ${getThemeBackground()} text-[#2A2422] flex flex-col justify-between font-serif relative overflow-x-hidden`}
    >
      {/* 启动协议同意拦截：未同意前阻止使用应用 */}
      {!consentGranted && (
        <PrivacyConsent
          onAccept={() => {
            storage.saveConsent(true);
            setConsentGranted(true);
          }}
          onDecline={() => {
            storage.saveConsent(false);
          }}
        />
      )}

      {/* 艺术古风环境氛围微光 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-[#E8DCCB]/60 rounded-full blur-3xl opacity-70" />
        <div className="absolute top-1/3 -right-12 w-80 h-80 bg-[#C94D3F]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#D9C7B6]/40 rounded-full blur-2xl" />
      </div>

      {/* 顶部状态栏与快捷工具 */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenWoodenFish={() => setShowWoodenFish(true)}
        onOpenDaily={() => setActiveTab('daily')}
      />

      {/* 主视图区域 */}
      <main className="flex-1 flex flex-col w-full relative z-10">
        {/* 如果正在进行沉浸式求签流程 */}
        {isDivinating ? (
          <DivinationFlow
            onLotDrawn={handleLotDrawn}
            onCancel={() => setIsDivinating(false)}
          />
        ) : (
          <>
            {/* 1. 首页 (Home) */}
            {activeTab === 'home' && (
              <div className="max-w-md mx-auto w-full p-4 pb-24 flex flex-col justify-between flex-1">
                {/* 顶部每日黄历气运提示 */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 border border-[#D9C7B6]/80 rounded-2xl p-3 shadow-xs backdrop-blur-xs flex items-center justify-between text-xs mb-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C94D3F]" />
                    <span className="text-[#C94D3F] font-bold">今日吉相：</span>
                    <span className="text-[#2A2422] font-medium">
                      宜{lunar.auspicious.slice(0, 3).join('、')}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8A7E72]">
                    吉时：{lunar.luckyHour.split(' ')[0]}
                  </span>
                </motion.div>

                {/* 核心中区：3D 沉浸式动态签筒与主祈福按钮 */}
                <div className="flex flex-col items-center justify-center my-auto py-4 select-none text-center">
                  {/* 光晕与粒子 */}
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#C94D3F]/15 via-[#E8DCCB]/30 to-[#C94D3F]/15 rounded-full blur-2xl animate-pulse" />

                    {/* 灵签签筒主视效 */}
                    <motion.div
                      animate={
                        settings.animationEnabled
                          ? { y: [0, -6, 0] }
                          : { y: 0 }
                      }
                      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                      onClick={handleStartDivination}
                      className="relative cursor-pointer group flex flex-col items-center"
                    >
                      {/* 签筒顶部探出的竹签群 */}
                      <div className="w-24 h-14 -mb-2 flex items-end justify-center gap-1.5 overflow-visible">
                        {[1, 2, 3, 4, 5].map((stick, i) => (
                          <div
                            key={stick}
                            className={`w-2.5 rounded-t-sm bg-gradient-to-t from-[#C59B6A] via-[#E8DCCB] to-[#C94D3F] border-x border-[#A67B48]/40 shadow-xs transition-transform duration-300 group-hover:-translate-y-2 ${
                              i === 2 ? 'h-14' : i % 2 === 0 ? 'h-10' : 'h-12'
                            }`}
                          >
                            <div className="w-full h-2.5 bg-[#C94D3F] rounded-t-xs" />
                          </div>
                        ))}
                      </div>

                      {/* 筒身 (雅致朱砂红檀与纯铜箍饰) */}
                      <div className="w-32 h-44 rounded-2xl bg-gradient-to-br from-[#A63C31] via-[#C94D3F] to-[#78231B] border-2 border-[#D9C7B6] shadow-[0_20px_40px_rgba(201,77,63,0.25)] flex flex-col items-center justify-between p-2.5 transition-transform duration-300 group-hover:scale-105">
                        <div className="w-full h-2.5 bg-gradient-to-r from-[#E5C9A4] via-[#FFF3E0] to-[#C59B6A] rounded-full shadow-inner" />
                        <div className="w-12 h-20 rounded-lg bg-[#5A1711]/80 border border-[#E5C9A4]/60 flex flex-col items-center justify-center p-1 shadow-inner">
                          <span className="font-serif font-black text-[#FDF8F2] text-lg leading-snug tracking-widest writing-vertical">
                            永喜
                          </span>
                          <span className="font-serif font-black text-[#F7D8B5] text-lg leading-snug tracking-widest writing-vertical">
                            靈籤
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gradient-to-r from-[#E5C9A4] via-[#FFF3E0] to-[#C59B6A] rounded-full shadow-inner" />
                      </div>

                      <div className="w-40 h-4 rounded-full bg-[#2A2422] border border-[#D9C7B6]/60 -mt-2 shadow-xl" />
                    </motion.div>
                  </div>

                  {/* 引导文案 */}
                  <div className="mt-6 mb-4">
                    <h2 className="font-serif font-black text-2xl text-[#2A2422] tracking-widest">
                      诚心祈愿 · 逢凶化吉
                    </h2>
                    <p className="text-xs text-[#8A7E72] mt-1 font-serif">
                      涵盖事业、姻缘、财运、健康等全维度百支传统灵签
                    </p>
                  </div>

                  {/* 艺术黑檀/朱砂质感【静心求签】主按钮 */}
                  <button
                    id="main-start-divination-btn"
                    onClick={handleStartDivination}
                    className="w-full py-4 rounded-full bg-[#2A2422] hover:bg-[#3D3532] text-[#FDF8F2] font-serif font-bold text-lg tracking-[0.25em] shadow-xl hover:shadow-2xl active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 border border-[#4A3E3B]/40"
                  >
                    <Sparkles className="w-5 h-5 text-[#E8DCCB] animate-pulse" />
                    <span>静 心 求 签</span>
                  </button>
                </div>

                {/* 快捷功能卡片区 */}
                <div className="grid grid-cols-3 gap-2.5 mt-4">
                  <button
                    id="quick-daily-btn"
                    onClick={() => {
                      sound.playClick(500);
                      setActiveTab('daily');
                    }}
                    className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-[#D9C7B6]/80 text-center transition active:scale-95 shadow-xs flex flex-col items-center justify-center gap-1.5 group hover:border-[#C94D3F]/50"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#C94D3F]/10 text-[#C94D3F] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#2A2422] group-hover:text-[#C94D3F]">
                      每日一签
                    </span>
                    <span className="text-[10px] text-[#8A7E72]">今日运势</span>
                  </button>

                  <button
                    id="quick-wishes-btn"
                    onClick={() => {
                      sound.playClick(500);
                      setActiveTab('wishes');
                    }}
                    className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-[#D9C7B6]/80 text-center transition active:scale-95 shadow-xs flex flex-col items-center justify-center gap-1.5 group hover:border-[#C94D3F]/50"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#C94D3F]/10 text-[#C94D3F] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#2A2422] group-hover:text-[#C94D3F]">
                      祈福寄语
                    </span>
                    <span className="text-[10px] text-[#8A7E72]">心愿祈愿</span>
                  </button>

                  <button
                    id="quick-history-btn"
                    onClick={() => {
                      sound.playClick(500);
                      setActiveTab('history');
                    }}
                    className="p-3 rounded-2xl bg-white/70 hover:bg-white border border-[#D9C7B6]/80 text-center transition active:scale-95 shadow-xs flex flex-col items-center justify-center gap-1.5 group hover:border-[#C94D3F]/50"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#2A2422]/10 text-[#2A2422] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#2A2422] group-hover:text-[#C94D3F]">
                      灵签阁
                    </span>
                    <span className="text-[10px] text-[#8A7E72]">历史收藏</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. 每日一签 (Daily) */}
            {activeTab === 'daily' && (
              <DailyLot onOpenFullDetail={(lot) => handleInspectLot(lot, '每日一签')} />
            )}

            {/* 3. 祈福寄语堂 (Wishes) */}
            {activeTab === 'wishes' && <BlessingWall />}

            {/* 4. 灵签阁与收藏 (History) */}
            {activeTab === 'history' && (
              <HistoryAndFavorites
                onSelectLot={(lot, catName) => handleInspectLot(lot, catName)}
              />
            )}

            {/* 5. 系统设置 (Settings) */}
            {activeTab === 'settings' && (
              <SettingsModal
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onDataReset={() => {
                  refreshFavorites();
                  setActiveTab('home');
                }}
              />
            )}
          </>
        )}
      </main>

      {/* 签文详情全屏抽屉/弹窗 */}
      <AnimatePresence>
        {activeLot && (
          <LotDetailModal
            lot={activeLot}
            categoryName={activeCategoryName}
            onClose={() => setActiveLot(null)}
            onRedraw={() => {
              setActiveLot(null);
              setIsDivinating(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* 电子木鱼全屏弹窗 */}
      <AnimatePresence>
        {showWoodenFish && (
          <WoodenFishModal onClose={() => setShowWoodenFish(false)} />
        )}
      </AnimatePresence>

      {/* 底部固定导航栏 */}
      {!isDivinating && (
        <Navbar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsDivinating(false);
          }}
          favoritesCount={favoritesCount}
        />
      )}
    </div>
  );
}
