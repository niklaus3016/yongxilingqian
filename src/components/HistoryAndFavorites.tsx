import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Bookmark,
  Trash2,
  Search,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { FortuneRecord, LotItem } from '../types';
import { storage } from '../utils/storage';
import { getLotById } from '../data/fortuneLots';
import { sound } from '../utils/audio';

interface HistoryAndFavoritesProps {
  onSelectLot: (lot: LotItem, categoryName?: string) => void;
}

export const HistoryAndFavorites: React.FC<HistoryAndFavoritesProps> = ({ onSelectLot }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');
  const [historyList, setHistoryList] = useState<FortuneRecord[]>([]);
  const [favoritesList, setFavoritesList] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const loadData = () => {
    setHistoryList(storage.getHistory());
    setFavoritesList(storage.getFavorites());
  };

  useEffect(() => {
    loadData();
  }, []);

  // 删除单条历史记录
  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    sound.playClick(450);
    const updated = storage.deleteHistoryItem(id);
    setHistoryList(updated);
  };

  // 取消单条收藏
  const handleRemoveFavorite = (e: React.MouseEvent, lotId: number) => {
    e.stopPropagation();
    sound.playClick(450);
    storage.toggleFavorite(lotId);
    setFavoritesList(storage.getFavorites());
  };

  // 清空历史
  const handleClearHistory = () => {
    sound.playClick(400);
    storage.clearHistory();
    setHistoryList([]);
    setShowClearConfirm(false);
  };

  // 格式化时间戳
  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(
      d.getMinutes()
    ).padStart(2, '0')}`;
  };

  // 过滤列表
  const filteredHistory = historyList.filter((item) => {
    const lot = getLotById(item.lotId);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      lot.title.toLowerCase().includes(q) ||
      lot.id.toString() === q ||
      lot.poem.some((p) => p.includes(q)) ||
      item.categoryName.includes(q)
    );
  });

  const filteredFavorites = favoritesList
    .map((id) => getLotById(id))
    .filter((lot) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        lot.title.toLowerCase().includes(q) ||
        lot.id.toString() === q ||
        lot.poem.some((p) => p.includes(q))
      );
    });

  const getTierColor = (tier: LotItem['tier']) => {
    switch (tier) {
      case '上上':
        return 'text-[#9E3529] bg-[#FDF2F0] border-[#C94D3F]/40';
      case '上吉':
        return 'text-[#B45309] bg-[#FEF3C7] border-[#D97706]/40';
      case '中吉':
        return 'text-[#15803D] bg-[#DCFCE7] border-[#16A34A]/40';
      case '平平':
        return 'text-[#64748B] bg-[#F1F5F9] border-[#94A3B8]/40';
      default:
        return 'text-[#B91C1C] bg-[#FEE2E2] border-[#DC2626]/40';
    }
  };

  return (
    <div className="max-w-md mx-auto w-full p-4 pb-24 font-serif">
      {/* 顶部标题与切换标签 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-xl text-[#2A2422] tracking-wider">
              灵签阁
            </h2>
            <p className="text-xs text-[#8A7E72] mt-0.5">
              记录求签行迹 · 珍藏吉庆吉语
            </p>
          </div>

          {activeTab === 'history' && historyList.length > 0 && (
            <button
              id="clear-history-confirm-btn"
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-[#F5EBE1] text-[#8A7E72] hover:text-[#C94D3F] border border-[#D9C7B6] text-xs transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空历史</span>
            </button>
          )}
        </div>

        {/* 标签切换栏 */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#FAF5EE] rounded-full border border-[#D9C7B6]">
          <button
            id="tab-history-records"
            onClick={() => {
              sound.playClick(520);
              setActiveTab('history');
            }}
            className={`py-2 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#2A2422] text-[#FDF8F2] shadow-sm'
                : 'text-[#8A7E72] hover:text-[#2A2422]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>求签历史 ({historyList.length})</span>
          </button>

          <button
            id="tab-favorite-lots"
            onClick={() => {
              sound.playClick(520);
              setActiveTab('favorites');
            }}
            className={`py-2 rounded-full text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'bg-[#2A2422] text-[#FDF8F2] shadow-sm'
                : 'text-[#8A7E72] hover:text-[#2A2422]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>珍藏灵签 ({favoritesList.length})</span>
          </button>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-[#8A7E72] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索签号、典故、诗句关键词..."
          className="w-full pl-9 pr-4 py-2.5 rounded-full bg-white border border-[#D9C7B6] text-xs text-[#2A2422] placeholder:text-[#8A7E72] focus:outline-hidden focus:border-[#C94D3F] shadow-xs"
        />
      </div>

      {/* 列表渲染 */}
      {activeTab === 'history' ? (
        filteredHistory.length === 0 ? (
          <div className="p-8 text-center bg-white/80 rounded-3xl border border-[#D9C7B6] my-4 shadow-xs">
            <Sparkles className="w-8 h-8 text-[#D9C7B6] mx-auto mb-2" />
            <p className="text-[#2A2422] text-xs font-bold">暂无求签记录</p>
            <p className="text-[#8A7E72] text-[11px] mt-1">
              前往“祈福求签”静心摇签，记录将自动保存在此处
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredHistory.map((item) => {
              const lot = getLotById(item.lotId);
              const tierStyle = getTierColor(lot.tier);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => onSelectLot(lot, item.categoryName)}
                  className="p-3.5 rounded-2xl bg-white hover:bg-[#FAF5EE] border border-[#D9C7B6] hover:border-[#C94D3F]/60 transition active:scale-98 shadow-xs cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] flex flex-col items-center justify-center border border-[#D9C7B6] shrink-0">
                      <span className="text-[10px] text-[#2A2422] font-bold">
                        {lot.id}
                      </span>
                      <span className="text-[9px] text-[#C94D3F]">签</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#2A2422] group-hover:text-[#C94D3F] transition-colors">
                          {lot.title}
                        </h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${tierStyle}`}
                        >
                          {lot.tier}吉
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#8A7E72]">
                        <span className="text-[#C94D3F] font-bold">
                          {item.categoryName}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-[#8A7E72]">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDeleteItem(e, item.id)}
                      className="p-2 rounded-xl text-[#8A7E72] hover:text-[#C94D3F] hover:bg-[#F5EBE1] transition"
                      title="删除记录"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-[#8A7E72] group-hover:text-[#C94D3F] transition" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )
      ) : (
        /* 收藏列表 */
        filteredFavorites.length === 0 ? (
          <div className="p-8 text-center bg-white/80 rounded-3xl border border-[#D9C7B6] my-4 shadow-xs">
            <Bookmark className="w-8 h-8 text-[#D9C7B6] mx-auto mb-2" />
            <p className="text-[#2A2422] text-xs font-bold">暂无珍藏灵签</p>
            <p className="text-[#8A7E72] text-[11px] mt-1">
              在签文详情中点击“收藏”，可将心仪签文置于此处随时品读
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredFavorites.map((lot) => {
              const tierStyle = getTierColor(lot.tier);
              return (
                <motion.div
                  key={lot.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => onSelectLot(lot, '珍藏灵签')}
                  className="p-3.5 rounded-2xl bg-white hover:bg-[#FAF5EE] border border-[#D9C7B6] hover:border-[#C94D3F]/60 transition active:scale-98 shadow-xs cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] flex flex-col items-center justify-center border border-[#D9C7B6] shrink-0">
                      <span className="text-[10px] text-[#C94D3F] font-bold">
                        {lot.id}
                      </span>
                      <span className="text-[9px] text-[#2A2422]">签</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#2A2422] group-hover:text-[#C94D3F] transition-colors">
                          {lot.title}
                        </h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${tierStyle}`}
                        >
                          {lot.tier}吉
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8A7E72] mt-1 line-clamp-1">
                        {lot.poem[0]} · {lot.poem[1]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleRemoveFavorite(e, lot.id)}
                      className="p-2 rounded-xl text-[#C94D3F] hover:bg-[#F5EBE1] transition"
                      title="取消收藏"
                    >
                      <Bookmark className="w-4 h-4 fill-[#C94D3F] text-[#C94D3F]" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-[#8A7E72] group-hover:text-[#C94D3F] transition" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )
      )}

      {/* 清空历史确认弹窗 */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2A2422]/80 p-4 flex items-center justify-center backdrop-blur-xs"
          >
            <div className="max-w-xs w-full bg-[#FDF8F2] border border-[#D9C7B6] rounded-3xl p-5 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-[#FDF2F0] text-[#C94D3F] border border-[#C94D3F]/40 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-[#2A2422] text-base mb-1">
                确认清空所有求签历史？
              </h3>
              <p className="text-xs text-[#8A7E72] font-serif mb-4">
                清空后历史求签记录将无法找回（收藏的灵签仍会保留）。
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 rounded-full bg-white hover:bg-[#F5EBE1] border border-[#D9C7B6] text-[#8A7E72] font-serif text-xs"
                >
                  取消
                </button>
                <button
                  id="confirm-clear-history-action-btn"
                  onClick={handleClearHistory}
                  className="flex-1 py-2.5 rounded-full bg-[#C94D3F] hover:bg-[#B54134] text-white font-serif font-bold text-xs shadow-md"
                >
                  确认清空
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
