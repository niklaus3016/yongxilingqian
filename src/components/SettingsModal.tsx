import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Vibrate,
  Sparkles,
  Palette,
  Database,
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { AppSettings, ThemeType } from '../types';
import { storage } from '../utils/storage';
import { sound } from '../utils/audio';
import { AgreementModal } from './PrivacyConsent';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onDataReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onDataReset,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const toggleSound = () => {
    const nextVal = !settings.soundEnabled;
    onUpdateSettings({ soundEnabled: nextVal });
    if (nextVal) sound.playClick(550);
  };

  const toggleVibration = () => {
    const nextVal = !settings.vibrationEnabled;
    onUpdateSettings({ vibrationEnabled: nextVal });
    if (nextVal) sound.vibrate(40);
  };

  const toggleAnimation = () => {
    sound.playClick(500);
    onUpdateSettings({ animationEnabled: !settings.animationEnabled });
  };

  const handleSelectTheme = (theme: ThemeType) => {
    sound.playClick(520);
    onUpdateSettings({ theme });
  };

  // 导出备份
  const handleExportBackup = () => {
    sound.playClick(580);
    const jsonStr = storage.exportBackupData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `永喜灵签_数据备份_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 导入备份
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = storage.importBackupData(content);
      if (ok) {
        sound.playTempleBell();
        setImportStatus('备份数据恢复成功！');
        onDataReset();
      } else {
        setImportStatus('文件格式不正确，恢复失败');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  // 清空所有本地数据
  const handleClearAll = () => {
    sound.playClick(400);
    storage.clearAllData();
    setShowClearConfirm(false);
    onDataReset();
  };

  return (
    <div className="max-w-md mx-auto w-full p-4 pb-24 font-serif space-y-4">
      {/* 标题 */}
      <div>
        <h2 className="font-bold text-xl text-[#2A2422] tracking-wider">
          系统设置
        </h2>
        <p className="text-xs text-[#8A7E72] mt-0.5">
          个性化偏好 · 数据安全 · 纯离线运行
        </p>
      </div>

      {/* 体验交互设置 */}
      <div className="bg-white/80 border border-[#D9C7B6] rounded-3xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#C94D3F] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>体验与反馈设置</span>
        </h3>

        <div className="flex items-center justify-between py-1 border-b border-[#E8DCCB]">
          <div>
            <p className="text-sm text-[#2A2422] font-medium">古风音效</p>
            <p className="text-[11px] text-[#8A7E72]">
              求签摇筒声、古钟声、敲木鱼清脆音效
            </p>
          </div>
          <button
            id="setting-toggle-sound"
            onClick={toggleSound}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.soundEnabled ? 'bg-[#C94D3F]' : 'bg-[#D9C7B6]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-[#E8DCCB]">
          <div>
            <p className="text-sm text-[#2A2422] font-medium">触觉震动反馈</p>
            <p className="text-[11px] text-[#8A7E72]">
              摇签蓄力、落签与按键微震动反馈
            </p>
          </div>
          <button
            id="setting-toggle-vibrate"
            onClick={toggleVibration}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.vibrationEnabled ? 'bg-[#C94D3F]' : 'bg-[#D9C7B6]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm text-[#2A2422] font-medium">祥云动效与流光</p>
            <p className="text-[11px] text-[#8A7E72]">
              开启流畅微动动效（关闭可极致省电）
            </p>
          </div>
          <button
            id="setting-toggle-anim"
            onClick={toggleAnimation}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.animationEnabled ? 'bg-[#C94D3F]' : 'bg-[#D9C7B6]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.animationEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 典雅古风主题切换 */}
      <div className="bg-white/80 border border-[#D9C7B6] rounded-3xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#C94D3F] flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5" />
          <span>典雅主题配色</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'imperial-red', name: '故宫朱红', color: 'from-[#C94D3F] to-[#9E3529]', desc: '祥瑞庄严' },
            { id: 'bamboo-green', name: '竹林青翠', color: 'from-[#246A38] to-[#154724]', desc: '幽静清心' },
            { id: 'ink-black', name: '玄墨宣纸', color: 'from-[#2A2422] to-[#1A1615]', desc: '素雅沉稳' },
            { id: 'golden-amber', name: '流金琥珀', color: 'from-[#B45309] to-[#78350F]', desc: '富贵康泰' },
          ].map((th) => {
            const isSelected = settings.theme === th.id;
            return (
              <button
                key={th.id}
                onClick={() => handleSelectTheme(th.id as ThemeType)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition active:scale-95 ${
                  isSelected
                    ? 'border-[#C94D3F] bg-[#FAF5EE] shadow-xs ring-1 ring-[#C94D3F]/40'
                    : 'border-[#D9C7B6] bg-white hover:bg-[#FAF5EE]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full bg-gradient-to-br ${th.color} border border-[#D9C7B6] shrink-0`}
                  />
                  <div>
                    <p className="text-xs font-bold text-[#2A2422]">{th.name}</p>
                    <p className="text-[10px] text-[#8A7E72]">{th.desc}</p>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-[#C94D3F] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 本地数据管理与备份 */}
      <div className="bg-white/80 border border-[#D9C7B6] rounded-3xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#C94D3F] flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5" />
          <span>本地数据管理（零云端·全私密）</span>
        </h3>

        {importStatus && (
          <div className="p-2.5 rounded-xl bg-[#FAF5EE] border border-[#C94D3F]/40 text-[#C94D3F] text-xs text-center">
            {importStatus}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            id="btn-export-backup"
            onClick={handleExportBackup}
            className="p-3 rounded-2xl bg-white hover:bg-[#FAF5EE] text-[#2A2422] text-xs flex flex-col items-center justify-center gap-1 border border-[#D9C7B6] transition active:scale-95"
          >
            <Download className="w-4 h-4 text-[#C94D3F]" />
            <span className="font-bold">导出数据备份</span>
            <span className="text-[10px] text-[#8A7E72]">保存为本地 JSON</span>
          </button>

          <label className="p-3 rounded-2xl bg-white hover:bg-[#FAF5EE] text-[#2A2422] text-xs flex flex-col items-center justify-center gap-1 border border-[#D9C7B6] transition active:scale-95 cursor-pointer">
            <Upload className="w-4 h-4 text-[#C94D3F]" />
            <span className="font-bold">导入数据备份</span>
            <span className="text-[10px] text-[#8A7E72]">恢复历史与收藏</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={() => setShowClearConfirm(true)}
          className="w-full py-2.5 rounded-xl bg-[#FDF2F0] hover:bg-[#FCE8E6] text-[#C94D3F] border border-[#C94D3F]/30 text-xs flex items-center justify-center gap-1.5 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>重置与清空所有本地数据</span>
        </button>
      </div>

      {/* 隐私政策入口与关于 */}
      <div className="bg-white/80 border border-[#D9C7B6] rounded-3xl p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#C94D3F] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#246A38]" />
          <span>合规与隐私保护</span>
        </h3>

        {/* 隐私政策点击按钮 */}
        <button
          id="btn-open-privacy-policy"
          onClick={() => {
            sound.playClick(540);
            setShowPrivacyModal(true);
          }}
          className="w-full p-3.5 rounded-2xl bg-white hover:bg-[#FAF5EE] border border-[#D9C7B6] text-left flex items-center justify-between transition active:scale-98 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#246A38]/10 text-[#246A38] flex items-center justify-center shrink-0 border border-[#246A38]/20">
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#2A2422]">隐私政策</p>
          </div>
          <div className="flex items-center gap-1 text-[#8A7E72]">
            <span className="text-[11px]">查看详情</span>
            <ChevronRight className="w-4 h-4 text-[#8A7E72]" />
          </div>
        </button>
      </div>

      {/* 完整隐私政策弹窗：复用启动流程中的 AgreementModal，保证全应用内文案与样式完全一致 */}
      {showPrivacyModal && (
        <AgreementModal
          onClose={() => {
            sound.playClick(500);
            setShowPrivacyModal(false);
          }}
          title="隐私政策"
          contentType="privacy"
        />
      )}

      {/* 清空所有数据二次确认弹窗 */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-[#2A2422]/80 p-4 flex items-center justify-center backdrop-blur-xs">
          <div className="max-w-xs w-full bg-[#FDF8F2] border border-[#D9C7B6] rounded-3xl p-5 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#FDF2F0] text-[#C94D3F] border border-[#C94D3F]/40 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#2A2422] text-base mb-1">
              确认清空所有数据？
            </h3>
            <p className="text-xs text-[#8A7E72] mb-4">
              此操作将清空所有求签历史、灵签收藏、祈福寄语及木鱼功德数，且不可逆。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-full bg-white hover:bg-[#F5EBE1] border border-[#D9C7B6] text-[#8A7E72] text-xs"
              >
                取消
              </button>
              <button
                id="btn-confirm-clear-all-data"
                onClick={handleClearAll}
                className="flex-1 py-2.5 rounded-full bg-[#C94D3F] hover:bg-[#B54134] text-white font-bold text-xs"
              >
                确认全部清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
