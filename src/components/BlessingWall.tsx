import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Plus, HeartHandshake, Sparkles, Trash2, Heart, ShieldCheck, X } from 'lucide-react';
import { WishItem } from '../types';
import { storage } from '../utils/storage';
import { BLESSING_PRESETS } from '../data/blessings';
import { sound } from '../utils/audio';

export const BlessingWall: React.FC = () => {
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // 表单状态
  const [wishText, setWishText] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('善缘居士');
  const [wishType, setWishType] = useState<'ribbon' | 'plaque'>('ribbon');
  const [selectedCategory, setSelectedCategory] = useState<string>('平安');

  // 点香动画反馈
  const [incenseFloatingId, setIncenseFloatingId] = useState<string | null>(null);

  const loadWishes = () => {
    setWishes(storage.getWishes());
  };

  useEffect(() => {
    loadWishes();
  }, []);

  // 添加祈福
  const handleCreateWish = () => {
    if (!wishText.trim()) return;
    sound.playTempleBell();

    const colors = ['#8b1e1e', '#c2410c', '#b45309', '#be185d', '#047857', '#4338ca'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newWish: WishItem = {
      id: 'wish_' + Date.now(),
      timestamp: Date.now(),
      text: wishText.trim(),
      sender: senderName.trim() || '心诚居士',
      category: selectedCategory,
      type: wishType,
      incenseCount: 1,
      color: randomColor,
    };

    const updated = storage.addWish(newWish);
    setWishes(updated);
    setWishText('');
    setShowAddModal(false);
  };

  // 点香敬献（功德香火+1）
  const handleOfferIncense = (id: string) => {
    sound.playClick(620);
    setIncenseFloatingId(id);
    const updated = storage.addIncenseToWish(id);
    setWishes(updated);
    setTimeout(() => setIncenseFloatingId(null), 1000);
  };

  // 删除祈福
  const handleDeleteWish = (id: string) => {
    sound.playClick(450);
    const updated = storage.deleteWish(id);
    setWishes(updated);
  };

  // 格式化时间
  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return (
    <div className="max-w-md mx-auto w-full p-4 pb-24 font-serif">
      {/* 顶部祈福堂香案 */}
      <div className="bg-[#2A2422] text-[#FDF8F2] border border-[#4A3E3B] rounded-3xl p-5 mb-4 shadow-xl text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C94D3F]/20 text-[#E8DCCB] border border-[#C94D3F]/40 text-xs mb-2">
          <Flame className="w-3.5 h-3.5 text-[#C94D3F]" />
          <span>万民祈福 · 心诚则灵</span>
        </div>

        <h2 className="font-bold text-2xl text-[#FDF8F2] tracking-widest mb-1">
          祈 福 寄 语 堂
        </h2>
        <p className="text-xs text-[#D9C7B6] max-w-xs mx-auto leading-relaxed">
          挂上祈福红丝带或祥瑞木牌，写下心中宏愿，燃一柱心香，愿所求皆如愿。
        </p>

        {/* 快捷悬挂新心愿按钮 */}
        <button
          id="open-create-wish-modal-btn"
          onClick={() => {
            sound.playClick(550);
            setShowAddModal(true);
          }}
          className="mt-4 px-6 py-2.5 rounded-full bg-[#C94D3F] hover:bg-[#B54134] text-[#FDF8F2] font-bold text-xs shadow-lg active:scale-95 transition inline-flex items-center gap-2 border border-[#E8DCCB]/30"
        >
          <Plus className="w-4 h-4" />
          <span>祈愿许愿 · 结缘祈福</span>
        </button>
      </div>

      {/* 祈福愿望墙展示区 */}
      <div className="space-y-3">
        {wishes.map((item) => {
          const isRibbon = item.type === 'ribbon';
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative rounded-2xl p-4 shadow-xs border transition duration-200 ${
                isRibbon
                  ? 'bg-gradient-to-r from-[#A63C31] via-[#C94D3F] to-[#8E2F26] border-[#D9C7B6]/40 text-[#FDF8F2]'
                  : 'bg-gradient-to-r from-[#F5ECE0] via-[#FAF5EE] to-[#EFE5D8] border-[#D9C7B6] text-[#2A2422]'
              }`}
            >
              {/* 装饰红丝带/木牌挂扣 */}
              <div className={`flex items-center justify-between border-b pb-2 mb-2 ${isRibbon ? 'border-white/20' : 'border-[#D9C7B6]'}`}>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      isRibbon
                        ? 'bg-black/20 text-[#FDF8F2] border-white/30'
                        : 'bg-[#C94D3F]/10 text-[#C94D3F] border-[#C94D3F]/30'
                    }`}
                  >
                    {isRibbon ? '祈福丝带' : '愿望木牌'} · {item.category}
                  </span>
                  <span className={`text-xs font-bold ${isRibbon ? 'text-[#FDF8F2]' : 'text-[#2A2422]'}`}>
                    {item.sender}
                  </span>
                </div>

                <div className={`flex items-center gap-2 text-xs ${isRibbon ? 'text-white/70' : 'text-[#8A7E72]'}`}>
                  <span>{formatDate(item.timestamp)}</span>
                  <button
                    onClick={() => handleDeleteWish(item.id)}
                    className="hover:text-red-400 transition"
                    title="删除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 寄语正文 */}
              <p className="text-sm font-medium leading-relaxed tracking-wide my-2">
                “{item.text}”
              </p>

              {/* 底部点香与香火赞助 */}
              <div className={`flex items-center justify-between pt-2 border-t text-xs ${isRibbon ? 'border-white/20 text-white/80' : 'border-[#D9C7B6] text-[#8A7E72]'}`}>
                <span className="flex items-center gap-1">
                  <Flame className={`w-3.5 h-3.5 ${isRibbon ? 'text-amber-200' : 'text-[#C94D3F]'}`} />
                  <span>香火共鸣 {item.incenseCount} 柱</span>
                </span>

                <button
                  onClick={() => handleOfferIncense(item.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition active:scale-90 ${
                    isRibbon
                      ? 'bg-white/20 hover:bg-white/30 text-white border border-white/40'
                      : 'bg-[#C94D3F]/10 hover:bg-[#C94D3F]/20 text-[#C94D3F] border border-[#C94D3F]/30'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>燃香加持</span>
                </button>
              </div>

              {/* 点香浮动特效 */}
              {incenseFloatingId === item.id && (
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -25 }}
                  className="absolute right-6 bottom-8 text-[#C94D3F] font-bold text-xs pointer-events-none bg-white px-2 py-0.5 rounded-md shadow-xs"
                >
                  功德香火 +1 ✦
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 许愿弹窗 */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2A2422]/80 p-4 flex items-center justify-center backdrop-blur-xs"
          >
            <div className="max-w-sm w-full bg-[#FDF8F2] border border-[#D9C7B6] rounded-3xl p-5 text-[#2A2422] shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-3 border-b border-[#D9C7B6] pb-2">
                <h3 className="font-bold text-lg text-[#2A2422]">
                  写下您的祈福心愿
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full text-[#8A7E72] hover:text-[#2A2422]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 载体类型 */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setWishType('ribbon')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    wishType === 'ribbon'
                      ? 'bg-[#C94D3F] text-white border border-[#C94D3F]'
                      : 'bg-white border border-[#D9C7B6] text-[#8A7E72]'
                  }`}
                >
                  祈福红丝带 (悬挂祈愿)
                </button>
                <button
                  onClick={() => setWishType('plaque')}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    wishType === 'plaque'
                      ? 'bg-[#2A2422] text-[#FDF8F2] border border-[#2A2422]'
                      : 'bg-white border border-[#D9C7B6] text-[#8A7E72]'
                  }`}
                >
                  祥瑞愿望木牌 (祈福长青)
                </button>
              </div>

              {/* 愿望分类 */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none text-xs">
                {['平安', '事业', '姻缘', '财运', '学业', '心愿'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-[#C94D3F] text-white font-bold'
                        : 'bg-white border border-[#D9C7B6] text-[#8A7E72]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* 内置经典古风祈福文案选择 */}
              <div className="mb-3">
                <p className="text-[11px] text-[#8A7E72] mb-1.5">
                  快捷选用古风吉语：
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-[#FAF5EE] rounded-xl border border-[#D9C7B6]">
                  {BLESSING_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setWishText(preset.text)}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-[#F5EBE1] text-[10px] text-[#2A2422] border border-[#D9C7B6] transition"
                    >
                      {preset.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 文本输入 */}
              <div className="mb-3">
                <textarea
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  maxLength={100}
                  placeholder="请输入您的心愿寄语（100字以内）..."
                  rows={3}
                  className="w-full rounded-2xl bg-white border border-[#D9C7B6] p-3 text-[#2A2422] text-sm placeholder:text-[#8A7E72] focus:outline-hidden focus:border-[#C94D3F]"
                />
                <div className="flex justify-between text-[11px] text-[#8A7E72] mt-0.5">
                  <span>诚心祈愿</span>
                  <span>{wishText.length}/100</span>
                </div>
              </div>

              {/* 署名 */}
              <div className="mb-4">
                <label className="text-[11px] text-[#8A7E72] block mb-1">
                  祈愿者署名：
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  maxLength={10}
                  placeholder="善缘居士"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9C7B6] text-xs text-[#2A2422] focus:outline-hidden focus:border-[#C94D3F]"
                />
              </div>

              {/* 提交按钮 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-full bg-white hover:bg-[#F5EBE1] border border-[#D9C7B6] text-[#8A7E72] text-xs"
                >
                  取消
                </button>
                <button
                  id="submit-wish-btn"
                  onClick={handleCreateWish}
                  disabled={!wishText.trim()}
                  className="flex-1 py-2.5 rounded-full bg-[#C94D3F] hover:bg-[#B54134] text-white font-bold text-xs disabled:opacity-50 shadow-md"
                >
                  挂上祈福牌
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
