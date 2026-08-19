import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, FileText, Lock, Sparkles, X, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

/* ============================================================
 * 永喜灵签 · 启动同意流程
 * 风格：古风朱红宣纸（与 LotDetailModal / SettingsModal 保持一致）
 * 配色：朱砂红 #C94D3F / 宣纸米白 #FDF8F2 / 暖灰 #8A7E72 / 米色边框 #D9C7B6
 * 字体：font-serif (Noto Serif SC)
 * 公司主体：深圳丰佰瑞网络科技有限公司
 * 联系邮箱：Jp182025@163.com
 * 生效日期：2026年08月19日
 * ========================================================== */

const POLICY_EFFECTIVE_DATE = '2026年08月19日';
const APP_VERSION = '1.0';

/* ---------- 1. 隐私政策正文 ---------- */
const PrivacyPolicyContent: React.FC = () => (
  <div className="font-serif text-[#2A2422]">
    <h1 className="text-2xl font-black text-[#C94D3F] text-center mb-2 tracking-widest">
      隐私政策
    </h1>
    <p className="text-center text-xs text-[#8A7E72] mb-6 font-serif">
      生效日期：<strong className="text-[#2A2422]">{POLICY_EFFECTIVE_DATE}</strong>
      &nbsp;·&nbsp;版本号：v{APP_VERSION}
    </p>

    {/* 核心承诺徽章 */}
    <div className="bg-gradient-to-r from-[#FDF2F0] to-[#FAF5EE] p-5 rounded-2xl border-l-4 border-[#C94D3F] mb-6 shadow-xs">
      <p className="text-sm text-[#2A2422] leading-relaxed">
        欢迎使用《永喜灵签》（以下简称「本应用」）。本应用由
        <strong className="text-[#C94D3F]">深圳丰佰瑞网络科技有限公司</strong>
        （以下简称「我们」）开发并运营。我们深知个人信息对您的重要性，将严格遵守《中华人民共和国个人信息保护法》等相关法律法规，保护您的个人信息安全。
      </p>
    </div>

    <p className="mb-6 text-sm text-[#2A2422] leading-relaxed">
      本隐私政策旨在说明我们如何收集、使用、存储和保护您在使用本应用过程中产生的相关数据，以及您对这些数据所享有的权利。请您在使用本应用前仔细阅读并充分理解本政策的全部内容，尤其是加粗的条款。如您对本政策有任何疑问、意见或建议，可通过本政策末尾提供的联系方式与我们联系。
    </p>

    {/* 第一条 */}
    <h2 className="text-lg font-bold mt-8 mb-4 border-b-2 border-[#D9C7B6] pb-2 text-[#C94D3F] tracking-wider">
      一、我们收集与使用的信息
    </h2>
    <p className="mb-4 text-sm text-[#2A2422] leading-relaxed">
      在您使用本应用的过程中，我们收集与使用的信息如下，以提供、维护和改进本应用的服务：
    </p>
    <ol className="list-decimal pl-6 mb-6 space-y-3 text-sm text-[#2A2422]">
      <li>
        <strong>本地数据：</strong>
        您在使用本应用过程中主动产生或保存的所有数据，包括但不限于<strong>求签历史记录、灵签收藏、祈福寄语留言、木鱼功德计数、每日一签状态以及音效/震动/动画/主题等偏好设置</strong>。这些数据是本应用的核心功能内容，用于为您提供求签、解签、祈福与静心等服务。
      </li>
      <li>
        <strong>设备权限调用：</strong>
        为保障应用的稳定运行与基础功能体验，本应用会在您主动触发相关功能时调用以下设备能力，但<strong>不采集、不上传</strong>相关敏感数据：
        <ul className="list-disc pl-6 mt-2 space-y-1 text-[#5C534B]">
          <li>音频播放权限（Web Audio API）：仅用于在本地合成并播放古风签筒摇晃声、晨钟暮鼓与木鱼清脆音效；</li>
          <li>触觉震动反馈（Vibration API）：仅用于模拟摇签蓄力与落签时的触感反馈；</li>
          <li>本地文件读写与画报保存：当您主动使用「导出备份」或「生成宣纸海报」时，应用会在本地通过 HTML5 Canvas 渲染图片并触发浏览器自带的下载保存。</li>
        </ul>
      </li>
    </ol>

    {/* 第二条 */}
    <h2 className="text-lg font-bold mt-8 mb-4 border-b-2 border-[#D9C7B6] pb-2 text-[#C94D3F] tracking-wider">
      二、信息的存储与保护
    </h2>
    <ol className="list-decimal pl-6 mb-6 space-y-3 text-sm text-[#2A2422]">
      <li>
        <strong>纯本地存储承诺：</strong>
        您在本应用中的所有数据均仅保存在您当前设备的浏览器本地存储区（LocalStorage）中，本应用<strong>不设立任何后端服务器</strong>，运行时不需要且不会向任何外部服务器发送数据。开发者及任何第三方均无权且无法访问您设备上的本地数据。
      </li>
      <li>
        <strong>无账号与无注册机制：</strong>
        本应用无需注册、登录，亦不索取手机号、邮箱、身份证号或第三方账号授权。
      </li>
      <li>
        <strong>安全措施：</strong>
        本应用采用符合行业标准的技术手段保护您设备上的本地数据，包括但不限于本地浏览器存储隔离、数据导出加密校验等。但请您知悉，因设备丢失、浏览器数据被清理等不可抗力造成的本地数据损失，本应用不承担责任，建议您定期使用「导出数据备份」功能妥善保存。
      </li>
    </ol>

    {/* 第三条 */}
    <h2 className="text-lg font-bold mt-8 mb-4 border-b-2 border-[#D9C7B6] pb-2 text-[#C94D3F] tracking-wider">
      三、信息的共享、转让与公开披露
    </h2>
    <p className="mb-4 text-sm text-[#2A2422] leading-relaxed">
      本应用承诺<strong>绝不嵌入任何第三方商业广告 SDK、行为统计 SDK 或追踪 Cookie</strong>，绝无任何商业广告弹窗或跨应用追踪行为。除以下情形外，我们不会向任何第三方共享、转让或公开披露您的信息：
    </p>
    <ol className="list-decimal pl-6 mb-6 space-y-3 text-sm text-[#2A2422]">
      <li>
        <strong>法定情形：</strong>
        根据法律法规的规定、行政或司法机关的强制性要求，我们可能会向有关部门披露您的相关信息。
      </li>
      <li>
        <strong>获得明确同意：</strong>
        在获得您的明确同意后，我们才会向第三方共享您的个人信息。
      </li>
    </ol>

    {/* 第四条 */}
    <h2 className="text-lg font-bold mt-8 mb-4 border-b-2 border-[#D9C7B6] pb-2 text-[#C94D3F] tracking-wider">
      四、您的权利
    </h2>
    <p className="mb-4 text-sm text-[#2A2422] leading-relaxed">
      您对本地存储的所有数据拥有绝对控制权。根据相关法律法规，您享有以下权利：
    </p>
    <ol className="list-decimal pl-6 mb-6 space-y-3 text-sm text-[#2A2422]">
      <li>
        <strong>访问权：</strong>
        您可以随时在本应用「灵签阁」中查看您的求签历史与收藏签目，在「祈福寄语」中查看祈福留言。
      </li>
      <li>
        <strong>更正权：</strong>
        您可以在应用内修改您的祈福寄语便签、用户偏好设置（音效/震动/动画/主题）等内容。
      </li>
      <li>
        <strong>删除权：</strong>
        您可以随时删除单条求签记录、单条收藏、单条祈福寄语，或一键清空所有本地数据。
      </li>
      <li>
        <strong>数据可携带权：</strong>
        您可以通过「导出数据备份」将全部历史与收藏导出为本地独立 JSON 文件，便于您在其他设备上恢复使用。
      </li>
    </ol>

    {/* 第五条 */}
    <h2 className="text-lg font-bold mt-8 mb-4 border-b-2 border-[#D9C7B6] pb-2 text-[#C94D3F] tracking-wider">
      五、未成年人保护
    </h2>
    <p className="mb-6 text-sm text-[#2A2422] leading-relaxed">
      我们非常重视对未成年人个人信息的保护。本应用为传统民俗文化与静心养性工具，不含任何付费内购、博彩机制或诱导消费内容，适宜各年龄段用户安心体验。如您是未满 14 周岁的未成年人，在使用本应用前，应在监护人的指导下仔细阅读本政策，并征得监护人的同意。如我们发现自己在未事先获得监护人可验证同意的情况下收集了未成年人的个人信息，将立即删除相关数据。
    </p>

    {/* 第六条 */}
    <h2 className="text-lg font-bold mt-8 mb-4 border-b-2 border-[#D9C7B6] pb-2 text-[#C94D3F] tracking-wider">
      六、本政策的更新
    </h2>
    <p className="mb-6 text-sm text-[#2A2422] leading-relaxed">
      我们可能会根据法律法规的更新、业务的调整或技术的发展，适时对本隐私政策进行修订。修订后的政策将在本应用内显著位置公示，并在生效前通过合理方式通知您。如您在政策更新后继续使用本应用，即表示您同意接受修订后的政策；如您不同意修订后的内容，您可以选择停止使用本应用。
    </p>

    {/* 第七条 */}
    <h2 className="text-lg font-bold mt-8 mb-4 border-b-2 border-[#D9C7B6] pb-2 text-[#C94D3F] tracking-wider">
      七、联系我们
    </h2>
    <p className="mb-4 text-sm text-[#2A2422] leading-relaxed">
      如您对本隐私政策有任何疑问、意见或建议，或需要行使您的相关权利，请通过以下方式与我们联系：
    </p>
    <div className="bg-[#FAF5EE] p-4 rounded-xl border border-[#D9C7B6] mb-6">
      <p className="mb-1 text-sm text-[#2A2422]">
        <strong>开发运营主体：</strong>深圳丰佰瑞网络科技有限公司
      </p>
      <p className="text-sm text-[#2A2422]">
        <strong>联系邮箱：</strong>
        <a href="mailto:Jp182025@163.com" className="text-[#C94D3F] hover:underline">
          Jp182025@163.com
        </a>
      </p>
    </div>

    <div className="mt-8 pt-6 border-t border-[#D9C7B6] text-center">
      <p className="mb-2 text-xs text-[#8A7E72] font-serif">感谢您使用永喜灵签！</p>
      <p className="mb-2 text-xs text-[#8A7E72] font-serif">诚心祈愿 · 诸恶莫作 · 众善奉行</p>
      <p className="text-[11px] text-[#8A7E72]">
        © 2026 深圳丰佰瑞网络科技有限公司 版权所有
      </p>
    </div>
  </div>
);

/* ---------- 2. 用户服务协议正文 ---------- */
const UserAgreementContent: React.FC = () => (
  <div className="font-serif text-[#2A2422]">
    <h1 className="text-2xl font-black text-[#C94D3F] text-center mb-2 tracking-widest">
      用户服务协议
    </h1>
    <p className="text-center text-xs text-[#8A7E72] mb-8 font-serif">
      更新日期：<strong className="text-[#2A2422]">{POLICY_EFFECTIVE_DATE}</strong>
      &nbsp;·&nbsp;版本号：v{APP_VERSION}
    </p>

    <h2 className="text-lg font-bold mt-8 mb-4 text-[#C94D3F] tracking-wider">一、协议的接受</h2>
    <p className="mb-3 text-sm text-[#2A2422] leading-relaxed">
      欢迎使用《永喜灵签》应用（以下简称「本应用」）。
    </p>
    <p className="mb-3 text-sm text-[#2A2422] leading-relaxed">
      本协议是您与<strong className="text-[#C94D3F]">深圳丰佰瑞网络科技有限公司</strong>（以下简称「我们」）之间关于使用本应用所订立的协议。
    </p>
    <p className="mb-3 text-sm text-[#2A2422] leading-relaxed">
      当您下载、安装、启动或以任何方式使用本应用，即视为您已充分阅读、理解并同意接受本协议的全部条款和条件。如您不同意本协议任何条款，请您立即停止使用本应用。
    </p>

    <h2 className="text-lg font-bold mt-8 mb-4 text-[#C94D3F] tracking-wider">二、服务内容</h2>
    <p className="mb-3 text-sm text-[#2A2422] leading-relaxed">本应用为纯单机离线运行的传统民俗文化工具，主要提供以下服务：</p>
    <ul className="list-disc pl-6 space-y-2 text-sm text-[#2A2422] mb-3">
      <li>沉浸式古风求签、解签与每日一签功能；</li>
      <li>祈福寄语堂（含红丝带、愿望木牌、点香加持）；</li>
      <li>灵签阁（求签历史与珍藏签文管理）；</li>
      <li>电子木鱼静心与功德计数；</li>
      <li>签文宣纸海报生成与本地下载；</li>
      <li>本地数据导出备份与恢复。</li>
    </ul>
    <p className="mb-3 text-sm text-[#2A2422] leading-relaxed">
      本应用所有功能均<strong>纯本地运行、离线可用</strong>，运行过程不依赖任何后端服务器，亦不会向任何外部服务器发送您的数据。
    </p>

    <h2 className="text-lg font-bold mt-8 mb-4 text-[#C94D3F] tracking-wider">三、用户义务</h2>
    <p className="mb-3 text-sm text-[#2A2422] leading-relaxed">作为本应用的用户，您同意：</p>
    <ul className="list-disc pl-6 space-y-2 text-sm text-[#2A2422] mb-3">
      <li>遵守本协议的所有条款；</li>
      <li>不使用本应用进行任何违反中华人民共和国法律法规的活动；</li>
      <li>不干扰本应用的正常运行，不对本应用进行反向工程、反编译、反汇编等行为；</li>
      <li>本应用签文内容为传统民俗文化参考，<strong>请您理性看待，不迷信、不依赖签文结果做出重大决策</strong>；</li>
      <li>妥善保管您的设备，防止未授权访问您设备上的本地数据。</li>
    </ul>

    <h2 className="text-lg font-bold mt-8 mb-4 text-[#C94D3F] tracking-wider">四、知识产权</h2>
    <p className="mb-3 text-sm text-[#2A2422] leading-relaxed">
      本应用的所有内容，包括但不限于签文文字、签诗典故、视觉设计、音效合成算法、海报渲染逻辑、软件代码等，均受《中华人民共和国著作权法》及相关知识产权法律保护。
    </p>
    <p className="mb-3 text-sm text-[#2A2422] leading-relaxed">
      未经我们书面许可，您不得复制、修改、分发、出租、出售或商业使用本应用的任何内容。您通过「导出数据备份」或「生成海报」所得的本地文件，仅供您个人留存与分享使用，不得用于商业用途。
    </p>

    <h2 className="text-lg font-bold mt-8 mb-4 text-[#C94D3F] tracking-wider">五、免责声明</h2>
    <p className="mb-3 text-sm text-[#2A2422] leading-relaxed">
      本应用按「原样」提供，除法律法规另有规定外，我们不做任何明示或暗示的保证。在法律允许的最大范围内：
    </p>
    <ul className="list-disc pl-6 space-y-2 text-sm text-[#2A2422] mb-3">
      <li>我们不保证本应用将完全符合您的所有需求；</li>
      <li>我们不保证本应用将无中断、及时、安全或无错误地运行（受限于浏览器能力、设备性能、网络字体加载等外部因素）；</li>
      <li>本应用签文、黄历、吉凶等内容均为传统民俗文化生成，仅供文化参考与静心娱乐，<strong>不代表对您任何现实事项的预测、承诺或决策建议</strong>，您据此做出的任何决策及后果由您自行承担。</li>
    </ul>

    <h2 className="text-lg font-bold mt-8 mb-4 text-[#C94D3F] tracking-wider">六、协议的变更与终止</h2>
    <p className="mb-3 text-sm text-[#2A2422] leading-relaxed">
      我们有权根据法律法规、业务调整或技术发展，适时修订本协议。修订后的协议将在本应用内显著位置公示，自公示之时起生效。如您在协议更新后继续使用本应用，即视为您同意接受修订后的协议。
    </p>
    <p className="mb-3 text-sm text-[#2A2422] leading-relaxed">
      您可随时停止使用本应用并卸载本应用，届时您设备上的本地数据将随浏览器存储一并清除。
    </p>

    <h2 className="text-lg font-bold mt-8 mb-4 text-[#C94D3F] tracking-wider">七、适用法律与争议解决</h2>
    <p className="mb-3 text-sm text-[#2A2422] leading-relaxed">
      本协议的订立、生效、解释与争议解决均适用中华人民共和国法律。
    </p>
    <p className="mb-3 text-sm text-[#2A2422] leading-relaxed">
      任何因本协议或本应用引起的或与之相关的争议，双方应首先通过友好协商解决；协商不成的，任何一方均有权将争议提交至<strong>深圳市有管辖权的人民法院</strong>诉讼解决。
    </p>

    <div className="mt-8 pt-6 border-t border-[#D9C7B6] text-center">
      <p className="mb-2 text-xs text-[#8A7E72] font-serif">永喜灵签 · 诚心祈愿</p>
      <p className="text-[11px] text-[#8A7E72]">
        © 2026 深圳丰佰瑞网络科技有限公司 版权所有
      </p>
    </div>
  </div>
);

/* ---------- 3. 协议详情查看弹窗 ---------- */
interface AgreementModalProps {
  onClose: () => void;
  title: string;
  contentType: 'privacy' | 'agreement';
}

export const AgreementModal: React.FC<AgreementModalProps> = ({ onClose, title, contentType }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-[#2A2422]/80 backdrop-blur-md flex items-center justify-center p-4 z-[60]"
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 220 }}
      className="bg-[#FDF8F2] rounded-3xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl border-2 border-[#D9C7B6] flex flex-col"
    >
      {/* 头部 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#D9C7B6] bg-gradient-to-r from-[#FAF5EE] to-[#FDF8F2] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#C94D3F]/10 text-[#C94D3F] flex items-center justify-center border border-[#C94D3F]/30">
            {contentType === 'privacy' ? (
              <Lock className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
          </div>
          <h2 className="font-serif font-bold text-base text-[#2A2422] tracking-wider">
            {title}
          </h2>
        </div>
        <button
          onClick={() => {
            sound.playClick(500);
            onClose();
          }}
          className="w-8 h-8 rounded-full bg-white hover:bg-[#F5EBE1] border border-[#D9C7B6] text-[#8A7E72] flex items-center justify-center transition active:scale-90"
          title="关闭"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 正文（滚动区） */}
      <div className="flex-1 overflow-y-auto bg-[#FAF5EE] p-5 scrollbar-none">
        {contentType === 'privacy' ? <PrivacyPolicyContent /> : <UserAgreementContent />}
      </div>

      {/* 底部操作 */}
      <div className="px-5 py-3 border-t border-[#D9C7B6] bg-[#FAF5EE] shrink-0">
        <button
          onClick={() => {
            sound.playClick(500);
            onClose();
          }}
          className="w-full py-2.5 rounded-full bg-[#C94D3F] hover:bg-[#B54134] text-white font-serif font-bold text-xs tracking-widest transition active:scale-98 shadow-sm"
        >
          我已阅读
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ---------- 4. 拒绝后二次确认弹窗 ---------- */
interface DeclineConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeclineConfirmModal: React.FC<DeclineConfirmModalProps> = ({ onConfirm, onCancel }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-[#2A2422]/80 backdrop-blur-md flex items-center justify-center p-4 z-[70]"
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-[#FDF8F2] rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl border-2 border-[#D9C7B6] flex flex-col"
    >
      <div className="p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FDF2F0] border border-[#C94D3F]/40 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-[#C94D3F]" />
        </div>
        <h2 className="font-serif font-bold text-base text-[#2A2422] mb-2 tracking-wider">
          确认拒绝协议
        </h2>
        <p className="text-xs text-[#8A7E72] font-serif leading-relaxed">
          拒绝《用户服务协议》与《隐私政策》后，您将<strong className="text-[#C94D3F]">无法使用本应用</strong>的任何功能。确定要拒绝吗？
        </p>
      </div>
      <div className="flex border-t border-[#D9C7B6]">
        <button
          onClick={() => {
            sound.playClick(500);
            onCancel();
          }}
          className="flex-1 py-3.5 text-center text-xs font-serif font-medium text-[#8A7E72] hover:bg-[#FAF5EE] transition border-r border-[#D9C7B6]"
        >
          再想想
        </button>
        <button
          onClick={() => {
            sound.playClick(400);
            onConfirm();
          }}
          className="flex-1 py-3.5 text-center text-xs font-serif font-bold text-[#C94D3F] hover:bg-[#FDF2F0] transition"
        >
          仍要拒绝
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ---------- 5. 应用锁定全屏视图（拒绝后） ---------- */
interface AppBlockedViewProps {
  onRetry: () => void;
}

const AppBlockedView: React.FC<AppBlockedViewProps> = ({ onRetry }) => (
  <div className="fixed inset-0 z-[80] bg-[#FDF8F2] flex flex-col items-center justify-center p-6 font-serif text-center select-none">
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C94D3F] to-[#9E3529] flex items-center justify-center text-white shadow-lg shadow-[#C94D3F]/20 mb-6 border-2 border-[#FAF5EE]">
      <Lock className="w-10 h-10" />
    </div>

    <h1 className="font-serif font-black text-2xl text-[#2A2422] tracking-widest mb-2">
      应用已锁定
    </h1>
    <p className="text-sm text-[#8A7E72] font-serif leading-relaxed max-w-xs mb-6">
      您已拒绝《用户服务协议》与《隐私政策》，本应用无法继续提供服务。
    </p>

    <div className="bg-[#FAF5EE] border border-[#D9C7B6] rounded-2xl p-4 max-w-xs mb-6">
      <p className="text-xs text-[#2A2422] font-serif leading-relaxed">
        请<strong className="text-[#C94D3F]">关闭本应用</strong>后重新打开，并在启动时同意协议，方可继续使用。
      </p>
    </div>

    <button
      onClick={() => {
        sound.playClick(550);
        onRetry();
      }}
      className="w-full max-w-xs py-3.5 rounded-full bg-[#2A2422] hover:bg-[#3D3532] text-[#FDF8F2] font-serif font-bold text-sm tracking-widest transition active:scale-98 shadow-md flex items-center justify-center gap-2 border border-[#4A3E3B]/40"
    >
      <RotateCcw className="w-4 h-4 text-[#E8DCCB]" />
      <span>重新查看协议</span>
    </button>
  </div>
);

/* ---------- 6. 主入口：启动同意弹窗（隐私政策同意弹窗） ---------- */
export interface PrivacyConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const PrivacyConsent: React.FC<PrivacyConsentProps> = ({ onAccept, onDecline }) => {
  const [detailView, setDetailView] = useState<'privacy' | 'agreement' | null>(null);
  const [showDeclineConfirm, setShowDeclineConfirm] = useState<boolean>(false);
  const [blocked, setBlocked] = useState<boolean>(false);

  const handleAccept = () => {
    sound.playTempleBell();
    onAccept();
  };

  const handleDeclineRequest = () => {
    sound.playClick(450);
    setShowDeclineConfirm(true);
  };

  const handleDeclineConfirm = () => {
    setShowDeclineConfirm(false);
    setBlocked(true);
    onDecline();
  };

  const handleRetryFromBlocked = () => {
    setBlocked(false);
  };

  // 拒绝锁定后：仅显示锁定视图
  if (blocked) {
    return <AppBlockedView onRetry={handleRetryFromBlocked} />;
  }

  return (
    <>
      {/* 主同意弹窗 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-[#2A2422]/80 backdrop-blur-md flex items-center justify-center p-4 z-[50]"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220 }}
          className="bg-[#FDF8F2] rounded-3xl w-full max-w-sm max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-[#D9C7B6] scrollbar-none"
        >
          {/* 顶部装饰 logo */}
          <div className="pt-6 px-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C94D3F] to-[#9E3529] shadow-md shadow-[#C94D3F]/20 border border-[#E8DCCB]/40 mb-3">
              <span className="font-serif font-black text-[#FDF8F2] text-2xl leading-none">
                永
              </span>
            </div>
            <h3 className="font-serif font-black text-xl text-[#2A2422] tracking-widest">
              永喜灵签
            </h3>
            <p className="text-[11px] text-[#8A7E72] font-serif mt-1 tracking-wider">
              心诚则灵 · 知情同意 · 静心安签
            </p>
          </div>

          <div className="px-6 py-5">
            {/* 标题 */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C94D3F]/10 border border-[#C94D3F]/30 text-[#C94D3F] text-[11px] font-serif mb-2">
                <Sparkles className="w-3 h-3" />
                <span>首次启动 · 用户协议与隐私政策</span>
              </div>
              <h2 className="font-serif font-bold text-lg text-[#2A2422] tracking-wider">
                用户协议与隐私政策
              </h2>
            </div>

            {/* 内容摘要（两条要点，对齐原文风格） */}
            <div className="mb-5 space-y-3 bg-[#FAF5EE] rounded-2xl p-4 border border-[#D9C7B6]">
              <p className="text-sm text-[#2A2422] font-serif leading-relaxed">
                <span className="font-bold text-[#C94D3F]">(1)</span>
                《隐私政策》中关于本应用对您<strong>本地设备数据</strong>的收集与使用说明。
              </p>
              <p className="text-sm text-[#2A2422] font-serif leading-relaxed">
                <span className="font-bold text-[#C94D3F]">(2)</span>
                《隐私政策》中关于<strong>设备权限调用</strong>（音频/震动/文件读写）及<strong>第三方 SDK 与广告声明</strong>的相关说明。
              </p>
            </div>

            {/* 链接区 */}
            <div className="mb-2 text-xs text-[#8A7E72] font-serif leading-relaxed">
              请阅读完整的
              <button
                onClick={() => {
                  sound.playClick(550);
                  setDetailView('agreement');
                }}
                className="text-[#C94D3F] hover:underline font-bold mx-0.5"
              >
                《用户服务协议》
              </button>
              和
              <button
                onClick={() => {
                  sound.playClick(550);
                  setDetailView('privacy');
                }}
                className="text-[#C94D3F] hover:underline font-bold mx-0.5"
              >
                《隐私政策》
              </button>
              了解详细内容。如您同意，请点击下方「同意并继续」开始使用。
            </div>

            <p className="text-[11px] text-[#8A7E72] font-serif mt-3 leading-relaxed">
              本应用为纯单机离线应用，所有数据仅存于您的设备本地，无任何网络回传。
            </p>
          </div>

          {/* 底部按钮组 */}
          <div className="flex border-t border-[#D9C7B6]">
            <button
              onClick={handleDeclineRequest}
              className="flex-1 py-3.5 text-sm font-serif font-medium text-[#8A7E72] bg-white hover:bg-[#FAF5EE] border-r border-[#D9C7B6] rounded-bl-3xl transition active:scale-98"
            >
              不同意
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 py-3.5 text-sm font-serif font-bold text-white bg-[#C94D3F] hover:bg-[#B54134] rounded-br-3xl transition active:scale-98 shadow-sm"
            >
              同意并继续
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* 协议详情弹窗 */}
      <AnimatePresence>
        {detailView && (
          <AgreementModal
            onClose={() => setDetailView(null)}
            title={detailView === 'privacy' ? '隐私政策' : '用户服务协议'}
            contentType={detailView}
          />
        )}
      </AnimatePresence>

      {/* 拒绝二次确认 */}
      <AnimatePresence>
        {showDeclineConfirm && (
          <DeclineConfirmModal
            onConfirm={handleDeclineConfirm}
            onCancel={() => setShowDeclineConfirm(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PrivacyConsent;
