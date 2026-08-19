import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Bookmark, BookmarkCheck, Share2, Volume2, VolumeX, ShieldCheck, Flame } from 'lucide-react';
import { LotItem } from '../types';
import { getDailyLotByDate } from '../data/fortuneLots';
import { getTodayLunarInfo } from '../data/calendar';
import { DAILY_PROVERBS } from '../data/blessings';
import { storage } from '../utils/storage';
import { sound, speakText, stopSpeech } from '../utils/audio';
import { generateLotPosterDataUrl, downloadPoster } from '../utils/posterGenerator';

interface DailyLotProps {
  onOpenFullDetail: (lot: LotItem) => void;
}

export const DailyLot: React.FC<DailyLotProps> = ({ onOpenFullDetail }) => {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  const lunar = getTodayLunarInfo();
  const dailyLot = getDailyLotByDate(dateStr);

  const [hasRevealed, setHasRevealed] = useState<boolean>(false);
  const [isFav, setIsFav] = useState<boolean>(() => storage.isFavorite(dailyLot.id));
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);

  // 今日固定格言
  const proverbIndex = (today.getFullYear() * 100 + today.getMonth() * 30 + today.getDate()) % DAILY_PROVERBS.length;
  const todayProverb = DAILY_PROVERBS[proverbIndex];

  useEffect(() => {
    const status = storage.getDailyStatus();
    if (status && status.dateStr === dateStr) {
      setHasRevealed(true);
    }
  }, [dateStr]);

  const handleRevealDaily = () => {
    sound.playLotReveal();
    setHasRevealed(true);
    storage.saveDailyStatus({
      dateStr,
      lotId: dailyLot.id,
      viewedAt: Date.now(),
      blessingWord: todayProverb,
      luckyIndex: dailyLot.score,
    });
    // 自动记入一次求签历史
    storage.saveHistory({
      id: 'daily_' + dateStr,
      timestamp: Date.now(),
      lotId: dailyLot.id,
      category: 'all',
      categoryName: '每日一签',
    });
  };

  const toggleFav = () => {
    sound.playClick(600);
    const nextState = storage.toggleFavorite(dailyLot.id);
    setIsFav(nextState);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(
        `今日一签，第${dailyLot.id}签，${dailyLot.title}，${dailyLot.tier}吉。签诗：${dailyLot.poem.join('，')}。解曰：${dailyLot.summary}`,
        () => setIsSpeaking(false)
      );
    }
  };

  const handleGeneratePoster = async () => {
    sound.playClick(580);
    const url = await generateLotPosterDataUrl(dailyLot, `【今日一签】${todayProverb}`);
    setPosterUrl(url);
  };

  return (
    <div className="max-w-md mx-auto w-full p-4 pb-24">
      {/* 顶部黄历与日期 */}
      <div className="bg-white/80 border border-[#D9C7B6] rounded-3xl p-5 mb-4 shadow-xs backdrop-blur-xs">
        <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C94D3F]" />
            <span className="font-serif font-bold text-[#2A2422] text-sm">
              {lunar.solarDateStr}
            </span>
          </div>
          <span className="text-xs text-[#8A7E72] font-serif">
            {lunar.lunarMonthDayStr}
          </span>
        </div>

        {/* 宜忌指示 */}
        <div className="grid grid-cols-2 gap-2 text-xs font-serif">
          <div className="flex items-start gap-1.5 p-2 rounded-xl bg-[#EAF5EC] border border-[#7BB78C]/40 text-[#246A38]">
            <span className="font-bold text-[#246A38] shrink-0">宜：</span>
            <span>{lunar.auspicious.slice(0, 4).join(' · ')}</span>
          </div>
          <div className="flex items-start gap-1.5 p-2 rounded-xl bg-[#FDF2F0] border border-[#C94D3F]/30 text-[#A63C31]">
            <span className="font-bold text-[#C94D3F] shrink-0">忌：</span>
            <span>{lunar.inauspicious.slice(0, 3).join(' · ')}</span>
          </div>
        </div>

        <div className="mt-3 text-center text-xs text-[#2A2422] font-serif bg-[#FAF5EE] p-2.5 rounded-xl border border-[#E8DCCB]">
          ✦ 今日吉语：“{todayProverb}”
        </div>
      </div>

      {/* 未揭晓状态：点击翻开今日专属日签 */}
      {!hasRevealed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-b from-white/90 via-[#FAF5EE] to-white/90 border border-[#D9C7B6] rounded-3xl p-8 text-center shadow-md flex flex-col items-center justify-center min-h-[380px]"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C94D3F] to-[#9E3529] flex items-center justify-center text-white shadow-lg shadow-[#C94D3F]/20 mb-5 border-2 border-[#FAF5EE]">
            <Sparkles className="w-10 h-10 animate-pulse text-[#FDF8F2]" />
          </div>

          <h2 className="font-serif font-black text-2xl text-[#2A2422] tracking-widest mb-2">
            今日专属灵签
          </h2>
          <p className="text-xs text-[#8A7E72] font-serif max-w-xs leading-relaxed mb-6">
            每日仅可求取一次专属灵签，凝聚今日天干地支之气运，为您指引迷津。
          </p>

          <button
            id="reveal-daily-lot-btn"
            onClick={handleRevealDaily}
            className="px-8 py-4 rounded-full bg-[#2A2422] hover:bg-[#3D3532] text-[#FDF8F2] font-serif font-bold text-base shadow-xl tracking-wider active:scale-95 transition flex items-center gap-2 border border-[#4A3E3B]/40"
          >
            <Flame className="w-5 h-5 text-[#E8DCCB]" />
            <span>开启今日灵签</span>
          </button>
        </motion.div>
      ) : (
        /* 已揭晓状态：今日专属日签卡片 */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FAF5EE] text-[#2A2422] rounded-3xl p-6 border border-[#D9C7B6] shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-[#D9C7B6] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-[#2A2422] text-lg">
                今日第 {dailyLot.id} 签
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C94D3F] text-white font-serif font-bold">
                {dailyLot.tier}吉
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleSpeech}
                className="p-2 rounded-full bg-white hover:bg-[#F5EBE1] border border-[#D9C7B6] text-[#2A2422] transition"
                title="语音朗诵"
              >
                {isSpeaking ? <Volume2 className="w-4 h-4 text-[#C94D3F] animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleFav}
                className="p-2 rounded-full bg-white hover:bg-[#F5EBE1] border border-[#D9C7B6] text-[#2A2422] transition"
                title="收藏日签"
              >
                {isFav ? <BookmarkCheck className="w-4 h-4 text-[#C94D3F]" /> : <Bookmark className="w-4 h-4" />}
              </button>
              <button
                onClick={handleGeneratePoster}
                className="p-2 rounded-full bg-white hover:bg-[#F5EBE1] border border-[#D9C7B6] text-[#2A2422] transition"
                title="生成日签海报"
              >
                <Share2 className="w-4 h-4 text-[#C94D3F]" />
              </button>
            </div>
          </div>

          <div className="text-center my-3">
            <h3 className="font-serif font-black text-2xl text-[#2A2422] tracking-widest">
              【 {dailyLot.title} 】
            </h3>
            <p className="text-xs text-[#8A7E72] font-serif mt-0.5">
              运势指数：{dailyLot.score} 分 · 今日吉方：{dailyLot.luckyDirection}
            </p>
          </div>

          {/* 纵向古风排版四言绝句 */}
          <div className="my-4 p-4 rounded-2xl bg-[#EFE5D8]/70 border border-[#D9C7B6] shadow-inner flex justify-center items-center py-5">
            <div className="flex flex-row-reverse justify-center gap-4 font-serif">
              {dailyLot.poem.map((line, colIdx) => (
                <div
                  key={colIdx}
                  className="flex flex-col items-center gap-1 border-l border-[#D9C7B6] pl-2 first:border-l-0"
                >
                  {line.split('').map((char, charIdx) => (
                    <span
                      key={charIdx}
                      className="font-bold text-base text-[#2A2422] font-serif leading-none"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 白话解签精粹 */}
          <div className="bg-white/70 rounded-xl p-3.5 border border-[#D9C7B6] text-xs font-serif leading-relaxed text-[#2A2422] mb-4">
            <p className="font-bold text-[#C94D3F] mb-1">【今日运势点拨】</p>
            <p>{dailyLot.summary}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onOpenFullDetail(dailyLot)}
              className="flex-1 py-3 rounded-full bg-[#2A2422] hover:bg-[#3D3532] text-[#FDF8F2] font-serif font-bold text-xs transition flex items-center justify-center gap-1 shadow-md"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#E8DCCB]" />
              <span>查看详尽分项解析</span>
            </button>
            <button
              onClick={handleGeneratePoster}
              className="py-3 px-4 rounded-full bg-[#C94D3F] hover:bg-[#B54134] text-[#FDF8F2] font-serif font-bold text-xs transition flex items-center justify-center gap-1 shadow-md"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>保存日签</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* 海报弹窗 */}
      {posterUrl && (
        <div className="fixed inset-0 z-50 bg-[#2A2422]/90 p-4 flex flex-col items-center justify-center backdrop-blur-md">
          <div className="max-w-xs w-full flex flex-col items-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D9C7B6] max-h-[70vh] overflow-y-auto mb-4 bg-white">
              <img src={posterUrl} alt="今日日签海报" className="w-full h-auto object-contain" />
            </div>
            <div className="flex w-full gap-2">
              <button
                onClick={() => downloadPoster(posterUrl, `永喜日签_${dateStr}.png`)}
                className="flex-1 py-2.5 rounded-full bg-[#C94D3F] hover:bg-[#B54134] text-white font-serif font-bold text-xs shadow-lg"
              >
                下载日签海报
              </button>
              <button
                onClick={() => setPosterUrl(null)}
                className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-serif text-xs"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
