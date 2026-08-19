import React from 'react';
import { Volume2, VolumeX, Sparkles, Bell } from 'lucide-react';
import { getTodayLunarInfo } from '../data/calendar';
import { sound } from '../utils/audio';
import { AppSettings } from '../types';

interface HeaderProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenWoodenFish: () => void;
  onOpenDaily: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenWoodenFish,
  onOpenDaily,
}) => {
  const lunar = getTodayLunarInfo();

  const toggleSound = () => {
    const nextSound = !settings.soundEnabled;
    onUpdateSettings({ soundEnabled: nextSound });
    if (nextSound) {
      sound.playClick(520);
    }
  };

  return (
    <header className="relative z-20 w-full pt-3 pb-2.5 px-4 bg-[#FDF8F2]/90 border-b border-[#D9C7B6]/70 backdrop-blur-md">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* 左侧：APP名称与生肖年 */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C94D3F] to-[#9E3529] p-0.5 shadow-md shadow-[#C94D3F]/20 border border-[#E8DCCB]/40 flex items-center justify-center shrink-0">
            <span className="font-serif font-black text-[#FDF8F2] text-lg leading-none tracking-tighter">
              靈
            </span>
          </div>
          <div>
            <h1 className="font-serif font-bold text-[#2A2422] text-lg tracking-wider leading-tight">
              永喜灵签
            </h1>
            <p className="text-[11px] text-[#8A7E72] font-serif mt-0.5 whitespace-nowrap">
              {lunar.lunarMonthDayStr} · {lunar.lunarYearStr.split('·')[0]}
            </p>
          </div>
        </div>

        {/* 右侧：快捷工具栏（电子木鱼、音效开关、今日一签） */}
        <div className="flex items-center gap-1.5">
          <button
            id="header-wooden-fish-btn"
            onClick={() => {
              sound.playClick(600);
              onOpenWoodenFish();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/70 hover:bg-[#F5EBE1] border border-[#D9C7B6] text-[#2A2422] text-xs transition active:scale-95 shadow-xs"
            title="电子木鱼静心"
          >
            <Bell className="w-3.5 h-3.5 text-[#C94D3F]" />
            <span className="text-[11px] font-serif font-medium">木鱼</span>
          </button>

          <button
            id="header-daily-btn"
            onClick={() => {
              sound.playClick(600);
              onOpenDaily();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#C94D3F]/10 hover:bg-[#C94D3F]/20 border border-[#C94D3F]/30 text-[#C94D3F] text-xs transition active:scale-95 shadow-xs"
            title="今日一签"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C94D3F] animate-pulse" />
            <span className="text-[11px] font-serif font-semibold">日签</span>
          </button>

          <button
            id="header-sound-toggle-btn"
            onClick={toggleSound}
            className="w-8 h-8 rounded-full bg-white/70 hover:bg-[#F5EBE1] border border-[#D9C7B6] flex items-center justify-center text-[#2A2422] transition active:scale-90"
            title={settings.soundEnabled ? '音效已开启' : '音效已静音'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#C94D3F]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#8A7E72]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
