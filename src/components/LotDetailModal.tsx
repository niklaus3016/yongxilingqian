import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark,
  BookmarkCheck,
  Share2,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Heart,
  Briefcase,
  Coins,
  ShieldCheck,
  Home,
  CheckCircle2,
  Download,
  X,
  PenTool,
} from 'lucide-react';
import { LotItem } from '../types';
import { storage } from '../utils/storage';
import { sound, speakText, stopSpeech } from '../utils/audio';
import { generateLotPosterDataUrl, downloadPoster } from '../utils/posterGenerator';

interface LotDetailModalProps {
  lot: LotItem;
  categoryName?: string;
  onClose: () => void;
  onRedraw?: () => void;
}

export const LotDetailModal: React.FC<LotDetailModalProps> = ({
  lot,
  categoryName = '通用祈福',
  onClose,
  onRedraw,
}) => {
  const [isFav, setIsFav] = useState<boolean>(() => storage.isFavorite(lot.id));
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState<boolean>(false);

  // 寄语便签弹窗
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'career' | 'love' | 'wealth' | 'health' | 'family'>('all');

  // 切换收藏
  const handleToggleFav = () => {
    sound.playClick(650);
    const nextState = storage.toggleFavorite(lot.id);
    setIsFav(nextState);
  };

  // 朗读签诗
  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToRead = `第${lot.id}签，${lot.title}，${lot.tier}吉。签诗曰：${lot.poem.join('，')}。解曰：${lot.summary}。`;
      speakText(textToRead, () => setIsSpeaking(false));
    }
  };

  // 生成签文图片
  const handleGeneratePoster = async () => {
    sound.playClick(580);
    setIsGeneratingPoster(true);
    const url = await generateLotPosterDataUrl(lot, noteText || undefined);
    setPosterUrl(url);
    setIsGeneratingPoster(false);
  };

  // 保存寄语便签
  const handleSaveNote = () => {
    sound.playClick(600);
    if (noteText.trim()) {
      storage.addWish({
        id: 'wish_' + Date.now(),
        timestamp: Date.now(),
        text: `【第${lot.id}签·${lot.title}】${noteText.trim()}`,
        sender: '我',
        category: categoryName,
        type: 'plaque',
        incenseCount: 1,
        color: '#8b1e1e',
      });
    }
    setShowNoteModal(false);
  };

  const getTierBadge = (tier: LotItem['tier']) => {
    switch (tier) {
      case '上上':
        return { bg: 'bg-[#C94D3F] text-white border-[#C94D3F]', label: '上上大吉' };
      case '上吉':
        return { bg: 'bg-[#B45309] text-white border-[#B45309]', label: '上吉顺遂' };
      case '中吉':
        return { bg: 'bg-[#246A38] text-white border-[#246A38]', label: '中吉安泰' };
      case '平平':
        return { bg: 'bg-[#8A7E72] text-white border-[#8A7E72]', label: '平平守常' };
      case '下吉':
        return { bg: 'bg-[#C94D3F]/80 text-white border-[#C94D3F]', label: '下吉蓄力' };
      case '下凶':
      default:
        return { bg: 'bg-[#8E2F26] text-white border-[#8E2F26]', label: '审慎修德' };
    }
  };

  const tierBadge = getTierBadge(lot.tier);

  return (
    <div className="fixed inset-0 z-40 bg-[#2A2422]/90 backdrop-blur-md flex flex-col overflow-y-auto pb-20 font-serif">
      {/* 顶部控制栏 */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#FDF8F2]/95 border-b border-[#D9C7B6] backdrop-blur-md">
        <button
          id="detail-close-btn"
          onClick={() => {
            stopSpeech();
            onClose();
          }}
          className="p-2 rounded-full bg-white hover:bg-[#F5EBE1] border border-[#D9C7B6] text-[#2A2422] transition active:scale-95"
          title="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            id="detail-speech-btn"
            onClick={handleToggleSpeech}
            className={`p-2 rounded-full border transition active:scale-95 ${
              isSpeaking
                ? 'bg-[#FDF2F0] text-[#C94D3F] border-[#C94D3F] animate-pulse'
                : 'bg-white text-[#2A2422] border-[#D9C7B6] hover:bg-[#FAF5EE]'
            }`}
            title="语音诵读"
          >
            {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            id="detail-fav-btn"
            onClick={handleToggleFav}
            className={`p-2 rounded-full border transition active:scale-95 ${
              isFav
                ? 'bg-[#FDF2F0] text-[#C94D3F] border-[#C94D3F]'
                : 'bg-white text-[#8A7E72] border-[#D9C7B6] hover:bg-[#FAF5EE]'
            }`}
            title="收藏灵签"
          >
            {isFav ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>

          <button
            id="detail-share-btn"
            onClick={handleGeneratePoster}
            disabled={isGeneratingPoster}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C94D3F] hover:bg-[#B54134] text-[#FDF8F2] border border-[#E8DCCB]/30 text-xs font-serif transition active:scale-95 shadow-sm"
            title="生成古风海报"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>生成海报</span>
          </button>
        </div>
      </div>

      {/* 核心宣纸解签卷轴 */}
      <div className="max-w-md mx-auto w-full p-4 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl bg-[#FAF5EE] text-[#2A2422] border border-[#D9C7B6] p-6 shadow-2xl overflow-hidden"
        >
          {/* 卷轴背景暗纹 */}
          <div className="absolute top-2 right-2 text-[#D9C7B6]/20 font-serif font-black text-8xl pointer-events-none select-none">
            靈
          </div>

          {/* 卷轴头部：签号与等级徽章 */}
          <div className="flex items-center justify-between border-b border-[#D9C7B6] pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-[#2A2422] text-xl tracking-wider">
                第 {lot.id} 签
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-serif font-bold border ${tierBadge.bg}`}
              >
                {tierBadge.label}
              </span>
            </div>
            <span className="text-xs text-[#8A7E72] font-serif">
              所求：{categoryName}
            </span>
          </div>

          {/* 典故签题 */}
          <div className="text-center my-3">
            <h2 className="font-serif font-black text-3xl text-[#2A2422] tracking-widest">
              【 {lot.title} 】
            </h2>
            {lot.subTitle && (
              <p className="text-xs text-[#8A7E72] font-serif mt-1 tracking-wider">
                {lot.subTitle}
              </p>
            )}
          </div>

          {/* 纵向古风排版签诗核心区 */}
          <div className="my-5 p-4 rounded-2xl bg-[#EFE5D8]/70 border border-[#D9C7B6] shadow-inner flex justify-center items-center py-6">
            <div className="flex flex-row-reverse justify-center gap-4 sm:gap-6 font-serif">
              {lot.poem.map((line, colIdx) => (
                <div
                  key={colIdx}
                  className="flex flex-col items-center gap-1.5 border-l border-[#D9C7B6] pl-2 first:border-l-0"
                >
                  {line.split('').map((char, charIdx) => (
                    <span
                      key={charIdx}
                      className="font-bold text-lg text-[#2A2422] font-serif leading-none"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 解签总述 */}
          <div className="mb-5 bg-white/70 rounded-2xl p-4 border border-[#D9C7B6] shadow-xs">
            <div className="flex items-center gap-1.5 text-[#C94D3F] font-serif font-bold text-sm mb-1.5">
              <Sparkles className="w-4 h-4 text-[#C94D3F]" />
              <span>【 运势总述 】</span>
            </div>
            <p className="text-[#2A2422] text-sm font-serif leading-relaxed text-justify">
              {lot.summary}
            </p>
          </div>

          {/* 分项细析标签切换 */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-3 scrollbar-none">
              {[
                { id: 'all', label: '全部细析', icon: CheckCircle2 },
                { id: 'career', label: '事业学业', icon: Briefcase },
                { id: 'love', label: '姻缘情感', icon: Heart },
                { id: 'wealth', label: '财运富贵', icon: Coins },
                { id: 'health', label: '健康平安', icon: ShieldCheck },
                { id: 'family', label: '家宅出行', icon: Home },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playClick(600);
                      setActiveTab(tab.id as typeof activeTab);
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-serif whitespace-nowrap transition border ${
                      isSelected
                        ? 'bg-[#2A2422] text-[#FDF8F2] border-[#2A2422] shadow-xs font-bold'
                        : 'bg-white text-[#8A7E72] border-[#D9C7B6] hover:bg-[#FAF5EE]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 细析内容卡片 */}
            <div className="space-y-2.5 font-serif text-xs leading-relaxed text-[#2A2422] bg-white/70 p-4 rounded-2xl border border-[#D9C7B6] shadow-xs">
              {(activeTab === 'all' || activeTab === 'career') && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#C94D3F] shrink-0">❖ 事业学业：</span>
                  <span>{lot.career}</span>
                </div>
              )}
              {(activeTab === 'all' || activeTab === 'love') && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#A63C31] shrink-0">❖ 姻缘情感：</span>
                  <span>{lot.love}</span>
                </div>
              )}
              {(activeTab === 'all' || activeTab === 'wealth') && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#B45309] shrink-0">❖ 财运富贵：</span>
                  <span>{lot.wealth}</span>
                </div>
              )}
              {(activeTab === 'all' || activeTab === 'health') && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#246A38] shrink-0">❖ 健康平安：</span>
                  <span>{lot.health}</span>
                </div>
              )}
              {(activeTab === 'all' || activeTab === 'family') && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-[#4F46E5] shrink-0">❖ 家宅出行：</span>
                  <span>{lot.family}</span>
                </div>
              )}
            </div>
          </div>

          {/* 仙机与开运良方 */}
          <div className="p-4 rounded-2xl bg-[#F5ECE0] border border-[#D9C7B6] text-xs font-serif text-[#2A2422] space-y-1.5 shadow-xs mb-4">
            <div className="flex items-center gap-1 font-bold text-[#C94D3F]">
              <Sparkles className="w-4 h-4 text-[#C94D3F]" />
              <span>【 仙机开运指引 】</span>
            </div>
            <p>✦ 提点：{lot.guide}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#8A7E72] font-semibold pt-1.5 border-t border-[#D9C7B6]">
              <span>开运色：<strong className="text-[#2A2422]">{lot.luckyColor}</strong></span>
              <span>吉利方位：<strong className="text-[#2A2422]">{lot.luckyDirection}</strong></span>
              <span>吉时：<strong className="text-[#2A2422]">{lot.luckyHour}</strong></span>
            </div>
          </div>

          {/* 用户备注便签展示 */}
          {noteText && (
            <div className="p-3 rounded-xl bg-[#FDF2F0] border border-[#C94D3F]/30 text-xs font-serif text-[#C94D3F] mb-4">
              <span className="font-bold">我的祈福便签：</span>“{noteText}”
            </div>
          )}

          {/* 操作按钮群 */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              id="add-lot-note-btn"
              onClick={() => setShowNoteModal(true)}
              className="py-3 px-3 rounded-full bg-white hover:bg-[#F5EBE1] border border-[#D9C7B6] text-[#2A2422] text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
            >
              <PenTool className="w-3.5 h-3.5 text-[#C94D3F]" />
              <span>{noteText ? '修改祈福便签' : '添加祈福便签'}</span>
            </button>

            {onRedraw && (
              <button
                id="redraw-lot-btn"
                onClick={() => {
                  sound.playClick(550);
                  onRedraw();
                }}
                className="py-3 px-3 rounded-full bg-[#2A2422] hover:bg-[#3D3532] text-[#FDF8F2] text-xs font-serif font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#E8DCCB]" />
                <span>再次静心求签</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* 签文海报生成模态框 */}
      <AnimatePresence>
        {posterUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2A2422]/90 p-4 flex flex-col items-center justify-center backdrop-blur-md"
          >
            <div className="max-w-xs w-full flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-3">
                <h3 className="font-serif text-[#FDF8F2] font-bold text-base">
                  灵签宣纸海报已生成
                </h3>
                <button
                  onClick={() => setPosterUrl(null)}
                  className="p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D9C7B6] max-h-[70vh] overflow-y-auto bg-white">
                <img
                  src={posterUrl}
                  alt="永喜灵签海报"
                  className="w-full h-auto object-contain"
                />
              </div>

              <div className="w-full mt-4 flex gap-2">
                <button
                  onClick={() => downloadPoster(posterUrl, `永喜灵签_第${lot.id}签_${lot.title}.png`)}
                  className="flex-1 py-3 rounded-full bg-[#C94D3F] hover:bg-[#B54134] text-white font-serif font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>保存海报到本地</span>
                </button>
                <button
                  onClick={() => setPosterUrl(null)}
                  className="px-5 py-3 rounded-full bg-white/20 text-white font-serif text-sm hover:bg-white/30 transition"
                >
                  关闭
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 填写便签弹窗 */}
      <AnimatePresence>
        {showNoteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2A2422]/80 p-4 flex items-center justify-center backdrop-blur-xs"
          >
            <div className="max-w-sm w-full bg-[#FDF8F2] border border-[#D9C7B6] rounded-3xl p-5 text-[#2A2422] shadow-2xl">
              <h3 className="font-serif font-bold text-lg text-[#2A2422] mb-2">
                为本签添加祈福寄语
              </h3>
              <p className="text-xs text-[#8A7E72] font-serif mb-3">
                写下您的心愿或领悟，将永久保存于灵签阁中
              </p>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                maxLength={100}
                placeholder="例如：愿家人四季安康，诸事顺遂；今年考研一战成硕！"
                rows={4}
                className="w-full rounded-2xl bg-white border border-[#D9C7B6] p-3 text-[#2A2422] text-sm font-serif placeholder:text-[#8A7E72] focus:outline-hidden focus:border-[#C94D3F]"
              />
              <div className="flex justify-between items-center text-xs text-[#8A7E72] mt-1 mb-4 font-serif">
                <span>最多100字</span>
                <span>{noteText.length}/100</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="flex-1 py-2.5 rounded-full bg-white hover:bg-[#F5EBE1] border border-[#D9C7B6] text-[#8A7E72] font-serif text-xs"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveNote}
                  className="flex-1 py-2.5 rounded-full bg-[#C94D3F] hover:bg-[#B54134] text-white font-serif font-bold text-xs shadow-md"
                >
                  保存寄语
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
