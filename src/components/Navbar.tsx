import React from 'react';
import { Home, Sparkles, HeartHandshake, BookOpen, Settings } from 'lucide-react';
import { sound } from '../utils/audio';

export type NavTab = 'home' | 'daily' | 'wishes' | 'history' | 'settings';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  favoritesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount = 0,
}) => {
  const tabs: Array<{ id: NavTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'home', label: '祈福求签', icon: Home },
    { id: 'daily', label: '每日一签', icon: Sparkles },
    { id: 'wishes', label: '祈福寄语', icon: HeartHandshake },
    { id: 'history', label: '灵签阁', icon: BookOpen },
    { id: 'settings', label: '设置', icon: Settings },
  ];

  const handleTabClick = (id: NavTab) => {
    if (activeTab !== id) {
      sound.playClick(500);
      onSelectTab(id);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#FDF8F2]/95 border-t border-[#D9C7B6]/80 backdrop-blur-md pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto flex items-center justify-around py-1.5 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-[#C94D3F] font-bold'
                  : 'text-[#8A7E72] hover:text-[#2A2422]'
              }`}
            >
              {isActive && (
                <div className="absolute -top-1.5 w-6 h-0.5 bg-[#C94D3F] rounded-full shadow-[0_0_6px_rgba(201,77,63,0.6)]" />
              )}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`}
                />
                {tab.id === 'history' && favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[#C94D3F] ring-2 ring-[#FDF8F2]" />
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-serif whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
