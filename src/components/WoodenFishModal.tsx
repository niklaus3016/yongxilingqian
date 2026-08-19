import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Volume2, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';
import { storage } from '../utils/storage';
import { WOODEN_FISH_MANTRAS } from '../data/blessings';

interface WoodenFishModalProps {
  onClose: () => void;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
}

export const WoodenFishModal: React.FC<WoodenFishModalProps> = ({ onClose }) => {
  const [meritCount, setMeritCount] = useState<number>(0);
  const [isKnocking, setIsKnocking] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [selectedMantra, setSelectedMantra] = useState<string>('功德 +1');

  useEffect(() => {
    setMeritCount(storage.getMeritCount());
  }, []);

  const handleKnock = (e: React.MouseEvent | React.TouchEvent) => {
    sound.playWoodenFish();
    setIsKnocking(true);
    setTimeout(() => setIsKnocking(false), 120);

    const newCount = storage.incrementMeritCount();
    setMeritCount(newCount);

    // 随机微小偏移生成浮动文字
    const id = Date.now() + Math.random();
    const offsetX = (Math.random() - 0.5) * 60;
    setFloatingTexts((prev) => [
      ...prev.slice(-8),
      { id, text: selectedMantra, x: offsetX, y: 0 },
    ]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FDF8F2] flex flex-col items-center justify-between p-4 font-serif select-none">
      {/* 顶部栏 */}
      <div className="w-full max-w-md flex items-center justify-between py-2 border-b border-[#D9C7B6]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#2A2422] text-base">
            静心木鱼 · 积功累德
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white hover:bg-[#F5EBE1] border border-[#D9C7B6] text-[#2A2422] transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 功德计数与加持铭文 */}
      <div className="text-center my-auto w-full max-w-md">
        <div className="mb-6">
          <p className="text-xs text-[#8A7E72] tracking-widest mb-1">
            今日心念与功德值
          </p>
          <motion.div
            key={meritCount}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className="font-bold text-4xl text-[#C94D3F] tracking-widest font-mono drop-shadow-xs"
          >
            {meritCount.toLocaleString()}
          </motion.div>
        </div>

        {/* 电子木鱼本体 */}
        <div className="relative my-8 flex items-center justify-center">
          {/* 浮动文字粒子群 */}
          <AnimatePresence>
            {floatingTexts.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 1, y: 0, scale: 0.8, x: item.x }}
                animate={{ opacity: 0, y: -70, scale: 1.25 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: 'easeOut' }}
                className="absolute -top-6 font-bold text-lg text-[#C94D3F] drop-shadow-sm pointer-events-none z-20"
              >
                {item.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* 木鱼 3D 拟真图样 */}
          <motion.div
            id="wooden-fish-body"
            animate={isKnocking ? { scale: 0.93, y: 4 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.08 }}
            onClick={handleKnock}
            className="w-48 h-44 rounded-[50px] bg-gradient-to-br from-[#8C5835] via-[#5C3218] to-[#361C0D] border-4 border-[#D9C7B6] shadow-[0_20px_40px_rgba(42,36,34,0.3)] flex flex-col items-center justify-center cursor-pointer active:scale-95 transition relative overflow-hidden group"
          >
            {/* 木质光泽纹理 */}
            <div className="absolute top-4 left-6 w-16 h-8 bg-white/20 rounded-full blur-md transform -rotate-12 pointer-events-none" />

            {/* 木鱼嘴缝刻纹 */}
            <div className="w-32 h-3.5 bg-[#1F0E05] rounded-full border-t border-[#A86B42]/50 shadow-inner my-auto flex items-center justify-end px-3">
              <div className="w-3 h-3 rounded-full bg-[#5C3218] border border-[#D9C7B6]" />
            </div>

            {/* 木鱼鱼鳞祥云雕纹 */}
            <div className="text-[#E8DCCB]/60 font-bold text-xs tracking-widest pb-3">
              ✦ 心 静 如 水 ✦
            </div>
          </motion.div>
        </div>

        <p className="text-xs text-[#8A7E72] font-serif">
          轻触木鱼即可敲击发声，除却杂念，身心安泰
        </p>

        {/* 祈愿语切换 */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-6">
          {WOODEN_FISH_MANTRAS.map((m) => (
            <button
              key={m}
              onClick={() => {
                sound.playClick(600);
                setSelectedMantra(m);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-serif transition border ${
                selectedMantra === m
                  ? 'bg-[#C94D3F] border-[#C94D3F] text-white font-bold shadow-xs'
                  : 'bg-white border-[#D9C7B6] text-[#8A7E72] hover:text-[#2A2422] hover:bg-[#FAF5EE]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="w-full max-w-md pb-4">
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-full bg-[#2A2422] hover:bg-[#3D3532] text-[#FDF8F2] text-sm font-bold transition shadow-md"
        >
          返回
        </button>
      </div>
    </div>
  );
};
