import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, Heart, Briefcase, Coins, ShieldCheck, Flame, RotateCcw } from 'lucide-react';
import { LotCategory, LotItem } from '../types';
import { drawLot } from '../data/fortuneLots';
import { sound } from '../utils/audio';

interface DivinationFlowProps {
  onLotDrawn: (lot: LotItem, category: LotCategory, categoryName: string) => void;
  onCancel?: () => void;
}

const CATEGORIES: Array<{
  id: LotCategory;
  name: string;
  desc: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}> = [
  { id: 'all', name: '通用祈福', desc: '诸事顺遂 · 逢凶化吉', icon: Compass, color: 'from-amber-600 to-red-800' },
  { id: 'career', name: '事业学业', desc: '功名及第 · 步步高升', icon: Briefcase, color: 'from-blue-600 to-indigo-800' },
  { id: 'love', name: '姻缘情感', desc: '佳偶天成 · 琴瑟和鸣', icon: Heart, color: 'from-rose-500 to-pink-800' },
  { id: 'wealth', name: '财运富贵', desc: '财源广进 · 招财纳福', icon: Coins, color: 'from-yellow-500 to-amber-700' },
  { id: 'health', name: '健康平安', desc: '身康体健 · 岁岁平安', icon: ShieldCheck, color: 'from-emerald-600 to-teal-800' },
  { id: 'random', name: '随心所求', desc: '随顺因缘 · 冥冥指引', icon: Sparkles, color: 'from-purple-600 to-slate-800' },
];

export const DivinationFlow: React.FC<DivinationFlowProps> = ({ onLotDrawn, onCancel }) => {
  // Step: 'select_category' | 'praying' | 'shaking' | 'lot_popped' | 'jiao_ritual' | 'revealed'
  const [step, setStep] = useState<'select_category' | 'praying' | 'lot_popped' | 'jiao_ritual'>('select_category');
  const [selectedCategory, setSelectedCategory] = useState<LotCategory>('all');
  const [categoryName, setCategoryName] = useState<string>('通用祈福');

  // 摇签状态
  const [isPressing, setIsPressing] = useState(false);
  const [shakeProgress, setShakeProgress] = useState(0);
  const [targetLot, setTargetLot] = useState<LotItem | null>(null);

  // 掷茭状态
  const [jiaoResult, setJiaoResult] = useState<'sheng' | 'xiao' | 'yin' | null>(null);
  const [isThrowingJiao, setIsThrowingJiao] = useState(false);

  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rattleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 清理计时器
  useEffect(() => {
    return () => {
      if (pressTimerRef.current) clearInterval(pressTimerRef.current);
      if (rattleIntervalRef.current) clearInterval(rattleIntervalRef.current);
    };
  }, []);

  // 1. 选择分类后进入祈福静心室
  const handleSelectCategory = (cat: LotCategory, name: string) => {
    sound.playClick(580);
    setSelectedCategory(cat);
    setCategoryName(name);
    setStep('praying');
    sound.playTempleBell();
  };

  // 2. 长按或连续点击摇签
  const startShaking = () => {
    if (step !== 'praying') return;
    setIsPressing(true);
    sound.playBambooRattle();

    // 播放竹签持续碰撞音效
    rattleIntervalRef.current = setInterval(() => {
      sound.playBambooRattle();
    }, 180);

    // 蓄力进度推进
    pressTimerRef.current = setInterval(() => {
      setShakeProgress((prev) => {
        if (prev >= 100) {
          triggerLotRelease();
          return 100;
        }
        return prev + 6;
      });
    }, 80);
  };

  const stopShaking = () => {
    if (rattleIntervalRef.current) clearInterval(rattleIntervalRef.current);
    if (pressTimerRef.current) clearInterval(pressTimerRef.current);
    setIsPressing(false);

    // 如果未达到出签进度，缓慢衰减，给用户继续摇的机会；若已过60%则直接触发落签
    if (shakeProgress >= 65) {
      triggerLotRelease();
    } else {
      setShakeProgress((prev) => Math.max(0, prev - 20));
    }
  };

  // 3. 灵签腾空飞出
  const triggerLotRelease = () => {
    if (rattleIntervalRef.current) clearInterval(rattleIntervalRef.current);
    if (pressTimerRef.current) clearInterval(pressTimerRef.current);
    setIsPressing(false);

    const lot = drawLot(selectedCategory);
    setTargetLot(lot);
    setStep('lot_popped');
    sound.playLotReveal();

    // 自动在 2.4 秒后进入掷茭确认或直接出签
    setTimeout(() => {
      setStep('jiao_ritual');
      sound.playTempleBell();
    }, 2400);
  };

  // 4. 掷茭（圣杯问卜）
  const handleThrowJiao = () => {
    if (isThrowingJiao) return;
    setIsThrowingJiao(true);
    sound.playJiaoThrow();

    setTimeout(() => {
      // 90% 概率出圣茭 (一正一反 大吉顺遂)，体验温和治愈
      const rand = Math.random();
      const res: 'sheng' | 'xiao' | 'yin' = rand < 0.88 ? 'sheng' : rand < 0.94 ? 'xiao' : 'sheng';
      setJiaoResult(res);
      setIsThrowingJiao(false);

      if (res === 'sheng') {
        sound.playTempleBell();
        setTimeout(() => {
          if (targetLot) {
            onLotDrawn(targetLot, selectedCategory, categoryName);
          }
        }, 1200);
      }
    }, 800);
  };

  // 跳过掷茭直接解签
  const handleSkipJiao = () => {
    sound.playClick(620);
    if (targetLot) {
      onLotDrawn(targetLot, selectedCategory, categoryName);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex flex-col justify-between p-4 overflow-hidden">
      {/* 背景动态祥云与烛光微影 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E8DCCB]/60 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#C94D3F]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-4 w-60 h-60 bg-[#D9C7B6]/30 rounded-full blur-2xl" />
      </div>

      {/* 阶段 1：分类选择弹窗 */}
      <AnimatePresence>
        {step === 'select_category' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full z-10 py-4"
          >
            <div className="bg-white/85 border border-[#D9C7B6] rounded-3xl p-6 backdrop-blur-md shadow-xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-2 rounded-full bg-[#C94D3F]/10 text-[#C94D3F] border border-[#C94D3F]/20 mb-2">
                  <Flame className="w-5 h-5 text-[#C94D3F]" />
                </div>
                <h2 className="font-serif font-bold text-2xl text-[#2A2422] tracking-wider">
                  请选择所求之事
                </h2>
                <p className="text-xs text-[#8A7E72] mt-1 font-serif">
                  心诚则灵 · 意笃则通 · 专心致志
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      id={`category-btn-${cat.id}`}
                      onClick={() => handleSelectCategory(cat.id, cat.name)}
                      className="group p-3.5 rounded-2xl bg-[#FAF5EE] hover:bg-[#F5EBE1] border border-[#E5D8C8] hover:border-[#C94D3F]/60 text-left transition-all duration-200 active:scale-95 shadow-xs flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-[#8A7E72] font-serif group-hover:text-[#C94D3F]">
                          问卜
                        </span>
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-[#2A2422] text-sm group-hover:text-[#C94D3F]">
                          {cat.name}
                        </h3>
                        <p className="text-[11px] text-[#8A7E72] mt-0.5 font-serif line-clamp-1">
                          {cat.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {onCancel && (
                <button
                  onClick={onCancel}
                  className="w-full py-2.5 text-xs text-[#8A7E72] hover:text-[#2A2422] font-serif transition"
                >
                  返回首页
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 阶段 2：沉浸式静心与摇签室 */}
      {step === 'praying' && (
        <div className="flex-1 flex flex-col items-center justify-between max-w-md mx-auto w-full z-10 py-2 select-none">
          {/* 顶部指示牌 */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C94D3F]/10 border border-[#C94D3F]/30 text-[#C94D3F] text-xs font-serif shadow-xs">
              <span>所求问卜：</span>
              <span className="font-bold text-[#C94D3F]">{categoryName}</span>
            </div>
            <h2 className="font-serif font-bold text-2xl text-[#2A2422] tracking-widest mt-2">
              静心默念 · 所求之事
            </h2>
            <p className="text-xs text-[#8A7E72] mt-1 font-serif">
              长按下方按钮或签筒蓄力摇签，心意到时灵签自出
            </p>
          </div>

          {/* 中间核心：香案、袅袅青烟、3D动态签筒 */}
          <div className="relative w-full flex flex-col items-center justify-center my-auto py-6">
            {/* 袅袅青烟粒子效果 */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none opacity-60">
              <span className="w-1.5 h-12 bg-gradient-to-t from-[#8A7E72]/40 to-transparent rounded-full animate-bounce [animation-duration:2.5s]" />
              <span className="w-1.5 h-16 bg-gradient-to-t from-[#8A7E72]/30 to-transparent rounded-full animate-bounce [animation-duration:3.2s]" />
              <span className="w-1.5 h-10 bg-gradient-to-t from-[#8A7E72]/50 to-transparent rounded-full animate-bounce [animation-duration:2.1s]" />
            </div>

            {/* 3D 签筒主体 */}
            <motion.div
              id="interactive-cylinder"
              animate={
                isPressing
                  ? {
                      rotate: [0, -7, 8, -6, 7, -4, 0],
                      y: [0, -10, 6, -8, 4, 0],
                      scale: [1, 1.04, 0.98, 1.03, 1],
                    }
                  : { y: [0, -4, 0] }
              }
              transition={
                isPressing
                  ? { repeat: Infinity, duration: 0.28, ease: 'easeInOut' }
                  : { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
              }
              onTouchStart={startShaking}
              onTouchEnd={stopShaking}
              onMouseDown={startShaking}
              onMouseUp={stopShaking}
              onMouseLeave={stopShaking}
              className="relative cursor-pointer group flex flex-col items-center"
            >
              {/* 签筒上部露出的多支竹签 */}
              <div className="relative w-28 h-20 -mb-2 flex items-end justify-center gap-1 overflow-visible">
                {[1, 2, 3, 4, 5, 6, 7].map((stick, i) => (
                  <motion.div
                    key={stick}
                    animate={
                      isPressing
                        ? {
                            y: [0, -15 - (i % 3) * 6, 0],
                            rotate: [0, (i - 3) * 4, 0],
                          }
                        : { y: 0 }
                    }
                    transition={{
                      repeat: isPressing ? Infinity : 0,
                      duration: 0.2 + (i % 3) * 0.05,
                    }}
                    className={`w-2.5 rounded-t-sm bg-gradient-to-t from-[#C59B6A] via-[#E8DCCB] to-[#C94D3F] border-x border-[#A67B48]/40 shadow-xs ${
                      i === 3 ? 'h-18 z-10 ring-1 ring-[#C94D3F]/40' : 'h-14'
                    }`}
                  >
                    <div className="w-full h-3 bg-[#C94D3F] rounded-t-xs" />
                  </motion.div>
                ))}
              </div>

              {/* 签筒圆柱筒身 (红木/黑檀雕花质感) */}
              <div className="relative w-36 h-52 rounded-2xl bg-gradient-to-r from-[#A63C31] via-[#C94D3F] to-[#78231B] border-2 border-[#D9C7B6] shadow-[0_20px_40px_rgba(201,77,63,0.25)] flex flex-col items-center justify-between p-3 overflow-hidden">
                {/* 筒身金属铜箍 */}
                <div className="w-full h-3 bg-gradient-to-r from-[#E5C9A4] via-[#FFF3E0] to-[#C59B6A] rounded-full shadow-inner" />

                {/* 筒身铭文篆刻 */}
                <div className="my-auto text-center">
                  <div className="w-14 h-24 mx-auto rounded-lg bg-[#5A1711]/80 border border-[#E5C9A4]/60 flex flex-col items-center justify-center p-1 shadow-inner">
                    <span className="font-serif font-black text-[#FDF8F2] text-xl leading-snug tracking-widest writing-vertical">
                      永喜
                    </span>
                    <span className="font-serif font-black text-[#F7D8B5] text-xl leading-snug tracking-widest writing-vertical">
                      靈籤
                    </span>
                  </div>
                </div>

                {/* 筒身下铜箍 */}
                <div className="w-full h-3 bg-gradient-to-r from-[#E5C9A4] via-[#FFF3E0] to-[#C59B6A] rounded-full shadow-inner" />
              </div>

              {/* 案台底座 */}
              <div className="w-48 h-5 rounded-full bg-[#2A2422] border border-[#D9C7B6]/60 -mt-2.5 shadow-xl" />
            </motion.div>

            {/* 蓄力进度指示 */}
            <div className="w-48 mt-5">
              <div className="flex justify-between items-center text-[10px] text-[#C94D3F] mb-1 font-serif font-semibold">
                <span>蓄力祈愿</span>
                <span>{shakeProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E8DCCB] overflow-hidden border border-[#D9C7B6] p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#D99B5C] via-[#C94D3F] to-[#9E3529] transition-all duration-75 shadow-xs"
                  style={{ width: `${shakeProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* 底部长按摇签大按钮 */}
          <div className="w-full space-y-2">
            <button
              id="press-shake-lot-btn"
              onTouchStart={startShaking}
              onTouchEnd={stopShaking}
              onMouseDown={startShaking}
              onMouseUp={stopShaking}
              onMouseLeave={stopShaking}
              className={`w-full py-4 rounded-full font-serif text-lg font-bold tracking-[0.2em] transition-all duration-150 shadow-xl flex items-center justify-center gap-2 select-none active:scale-98 ${
                isPressing
                  ? 'bg-[#C94D3F] text-[#FDF8F2] scale-98 shadow-[#C94D3F]/30'
                  : 'bg-[#2A2422] text-[#FDF8F2] hover:bg-[#3D3532] border border-[#4A3E3B]/40'
              }`}
            >
              <Sparkles className={`w-5 h-5 text-[#E8DCCB] ${isPressing ? 'animate-spin' : ''}`} />
              <span>{isPressing ? '摇签祈愿中 ···' : '长按 / 触控摇签'}</span>
            </button>

            <div className="flex items-center justify-between px-2">
              <button
                onClick={() => setStep('select_category')}
                className="text-xs text-[#8A7E72] hover:text-[#2A2422] font-serif flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重选分类</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick(500);
                  triggerLotRelease();
                }}
                className="text-xs text-[#C94D3F] hover:text-[#9E3529] font-serif font-medium transition"
              >
                直接出签 &gt;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 阶段 3：灵签出鞘腾空动画 */}
      {step === 'lot_popped' && targetLot && (
        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full z-20 py-4">
          <motion.div
            initial={{ y: 250, scale: 0.4, rotate: -25, opacity: 0 }}
            animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 90 }}
            className="relative flex flex-col items-center"
          >
            {/* 灵签金光四溢光晕 */}
            <div className="absolute inset-0 bg-[#C94D3F]/15 rounded-3xl blur-2xl animate-pulse" />

            {/* 单支特大灵签 */}
            <div className="relative w-32 min-h-[350px] rounded-2xl bg-gradient-to-b from-[#FAF5EE] via-[#FDF8F2] to-[#E8DCCB] border-2 border-[#D9C7B6] shadow-2xl p-3 flex flex-col items-center justify-between text-[#2A2422]">
              {/* 顶部朱砂红顶 */}
              <div className="w-full py-1.5 bg-gradient-to-r from-[#B54134] via-[#C94D3F] to-[#9E3529] rounded-t-xl text-center shadow-xs">
                <span className="text-xs font-serif font-bold text-[#FDF8F2] tracking-wider">
                  第 {targetLot.id} 签
                </span>
              </div>

              {/* 签级印章与典雅典故竖排 */}
              <div className="my-auto py-3 px-1 text-center flex flex-col items-center justify-center">
                <span className="inline-block px-3 py-0.5 rounded-full bg-[#C94D3F] text-[#FDF8F2] text-xs font-serif font-bold mb-3 shadow-xs">
                  {targetLot.tier}吉
                </span>
                
                {/* 逐字居中规整排版，绝不错位挤压 */}
                <div className="flex flex-col items-center justify-center gap-1.5 my-1">
                  {targetLot.title.split('').map((char, cIdx) => (
                    <span
                      key={cIdx}
                      className="font-serif font-black text-2xl text-[#2A2422] leading-none select-none drop-shadow-xs"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              {/* 底部竹纹与标识 */}
              <div className="w-full text-center border-t border-[#D9C7B6]/80 pt-1.5">
                <span className="text-[10px] font-serif text-[#8A7E72] tracking-[0.2em]">永喜灵签</span>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-serif text-[#2A2422] text-sm font-bold tracking-wider mt-4"
            >
              灵签落地 · 诸事显化
            </motion.p>
          </motion.div>
        </div>
      )}

      {/* 阶段 4：掷茭（圣杯问卜）仪式 */}
      {step === 'jiao_ritual' && targetLot && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full z-20 py-2"
        >
          <div className="text-center">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#C94D3F]/10 text-[#C94D3F] border border-[#C94D3F]/20 font-serif font-medium">
              传统古礼 · 掷杯问圣
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#2A2422] tracking-wider mt-2">
              灵签第 {targetLot.id} 签 · 【{targetLot.title}】
            </h2>
            <p className="text-xs text-[#8A7E72] mt-1 font-serif">
              可掷圣杯确认神明指引，或直接揭晓全篇详解
            </p>
          </div>

          {/* 掷杯交互核心区 */}
          <div className="my-auto flex flex-col items-center justify-center py-6">
            {/* 圣杯模型 */}
            <div className="flex items-center gap-6 mb-6">
              {/* 左杯 */}
              <motion.div
                animate={
                  isThrowingJiao
                    ? { rotate: [0, 180, 360, 540], y: [-40, -80, -20, 0] }
                    : { rotate: jiaoResult === 'yin' ? 180 : 0 }
                }
                transition={{ duration: 0.8 }}
                className="w-16 h-24 rounded-t-full rounded-b-xl bg-gradient-to-br from-[#A63C31] via-[#C94D3F] to-[#2A2422] border border-[#D9C7B6] shadow-xl shadow-[#C94D3F]/20 flex items-center justify-center"
              >
                <span className="text-xs font-serif text-[#FDF8F2] font-bold">
                  {jiaoResult === 'yin' ? '阴' : '阳'}
                </span>
              </motion.div>

              {/* 右杯 */}
              <motion.div
                animate={
                  isThrowingJiao
                    ? { rotate: [0, -180, -360, -540], y: [-50, -90, -30, 0] }
                    : { rotate: jiaoResult === 'xiao' ? 0 : 180 }
                }
                transition={{ duration: 0.8 }}
                className="w-16 h-24 rounded-t-full rounded-b-xl bg-gradient-to-br from-[#A63C31] via-[#C94D3F] to-[#2A2422] border border-[#D9C7B6] shadow-xl shadow-[#C94D3F]/20 flex items-center justify-center"
              >
                <span className="text-xs font-serif text-[#FDF8F2] font-bold">
                  {jiaoResult === 'xiao' ? '阳' : '阴'}
                </span>
              </motion.div>
            </div>

            {/* 掷杯结果提示 */}
            {jiaoResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-4"
              >
                {jiaoResult === 'sheng' && (
                  <div className="p-3 rounded-2xl bg-[#EAF5EC] border border-[#7BB78C] text-[#246A38] font-serif">
                    <p className="font-bold text-base">一阳一阴 · 圣茭大吉！</p>
                    <p className="text-xs mt-0.5 text-[#32844A]">神明允准，所求灵验，正在进入详尽解签...</p>
                  </div>
                )}
                {jiaoResult === 'xiao' && (
                  <div className="p-3 rounded-2xl bg-[#FAF0E4] border border-[#D99B5C] text-[#8C531B] font-serif">
                    <p className="font-bold text-base">两阳相向 · 笑茭明朗</p>
                    <p className="text-xs mt-0.5 text-[#A6682A]">心有灵犀，凡事莫急，顺其自然即可解签。</p>
                  </div>
                )}
                {jiaoResult === 'yin' && (
                  <div className="p-3 rounded-2xl bg-white border border-[#D9C7B6] text-[#2A2422] font-serif">
                    <p className="font-bold text-base">两阴相扣 · 阴茭自省</p>
                    <p className="text-xs mt-0.5 text-[#8A7E72]">心念尚待沉淀，可细阅签诗指点迷津。</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* 按钮群 */}
          <div className="space-y-2">
            <button
              id="throw-jiao-btn"
              onClick={handleThrowJiao}
              disabled={isThrowingJiao}
              className="w-full py-3.5 rounded-full bg-[#C94D3F] hover:bg-[#B54134] text-[#FDF8F2] font-serif font-bold text-base shadow-lg shadow-[#C94D3F]/20 active:scale-98 transition disabled:opacity-50"
            >
              {isThrowingJiao ? '神明问卜中···' : '掷圣杯 (问卜)'}
            </button>

            <button
              id="skip-jiao-btn"
              onClick={handleSkipJiao}
              className="w-full py-2.5 rounded-full bg-white/70 hover:bg-[#F5EBE1] border border-[#D9C7B6] text-[#2A2422] text-xs font-serif transition"
            >
              直接查看解签详情 &gt;
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
