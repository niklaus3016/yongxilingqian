import { LotItem } from '../types';
import { getTodayLunarInfo } from '../data/calendar';

export function generateLotPosterDataUrl(lot: LotItem, userNote?: string): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const width = 900;
    const height = 1500;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    const lunar = getTodayLunarInfo();

    // 1. 底色：典雅宣纸/羊皮纸质感
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#f9f4ea');
    bgGradient.addColorStop(0.5, '#f4ece1');
    bgGradient.addColorStop(1, '#ebe0cf');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 绘制纸质微暗角
    const vignette = ctx.createRadialGradient(width / 2, height / 2, 200, width / 2, height / 2, 800);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(120,80,40,0.08)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // 2. 外部传统中式双重回纹边框
    ctx.strokeStyle = '#8b1e1e';
    ctx.lineWidth = 6;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 2;
    ctx.strokeRect(46, 46, width - 92, height - 92);

    // 边角吉祥祥云/回字饰角
    const drawCorner = (x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.strokeStyle = '#8b1e1e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(24, 0);
      ctx.lineTo(24, 8);
      ctx.lineTo(8, 8);
      ctx.lineTo(8, 24);
      ctx.lineTo(0, 24);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    drawCorner(52, 52, 0);
    drawCorner(width - 52, 52, 90);
    drawCorner(width - 52, height - 52, 180);
    drawCorner(52, height - 52, 270);

    // 3. 顶部横额：永喜灵签
    ctx.fillStyle = '#8b1e1e';
    ctx.font = 'bold 38px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.fillText('永 喜 灵 签', width / 2, 110);

    ctx.fillStyle = '#78350f';
    ctx.font = '20px "Noto Serif SC", serif';
    ctx.fillText('—— 祈福开运 · 静心解惑 ——', width / 2, 145);

    // 4. 签号与等级勋章
    const tierBgColor =
      lot.tier === '上上'
        ? '#b45309'
        : lot.tier === '上吉'
        ? '#d97706'
        : lot.tier === '中吉'
        ? '#15803d'
        : lot.tier === '平平'
        ? '#475569'
        : '#b91c1c';

    // 签号徽章
    ctx.fillStyle = tierBgColor;
    ctx.beginPath();
    ctx.roundRect(width / 2 - 140, 180, 280, 54, 8);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px "Noto Serif SC", serif';
    ctx.fillText(`第 ${lot.id} 签 · ${lot.tier}吉`, width / 2, 216);

    // 5. 典故签题
    ctx.fillStyle = '#1c1917';
    ctx.font = 'bold 44px "Ma Shan Zheng", "Noto Serif SC", serif';
    ctx.fillText(`【 ${lot.title} 】`, width / 2, 290);

    if (lot.subTitle) {
      ctx.fillStyle = '#78350f';
      ctx.font = '22px "Noto Serif SC", serif';
      ctx.fillText(lot.subTitle, width / 2, 330);
    }

    // 6. 纵向古风排版签诗核心区（右起竖排）
    ctx.fillStyle = '#fffaf0';
    ctx.strokeStyle = '#d6c29a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(80, 360, width - 160, 340, 12);
    ctx.fill();
    ctx.stroke();

    // 签诗内饰暗纹
    ctx.fillStyle = 'rgba(139,30,30,0.03)';
    ctx.font = 'bold 120px "Noto Serif SC", serif';
    ctx.fillText('靈', width / 2, 570);

    // 绘制 4 句 7 言诗
    const poemLines = lot.poem;
    const startX = width - 200;
    const colSpacing = 130;
    const startY = 410;
    const charSpacing = 36;

    poemLines.forEach((line, colIndex) => {
      const x = startX - colIndex * colSpacing;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const y = startY + i * charSpacing;
        ctx.fillStyle = '#292524';
        ctx.font = 'bold 30px "Ma Shan Zheng", "Noto Serif SC", serif';
        ctx.fillText(char, x, y);
      }
    });

    // 7. 解签评说区域
    ctx.fillStyle = '#8b1e1e';
    ctx.font = 'bold 24px "Noto Serif SC", serif';
    ctx.textAlign = 'left';
    ctx.fillText('【 灵签解义 】', 80, 740);

    ctx.fillStyle = '#44403c';
    ctx.font = '20px "Noto Serif SC", serif';
    const summaryText = lot.summary;
    // 自动换行
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      let currentLine = '';
      let curY = y;
      for (let i = 0; i < text.length; i++) {
        const testLine = currentLine + text[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(currentLine, x, curY);
          currentLine = text[i];
          curY += lineHeight;
        } else {
          currentLine = testLine;
        }
      }
      ctx.fillText(currentLine, x, curY);
      return curY;
    };

    let nextY = wrapText(summaryText, 80, 775, width - 160, 32);

    // 8. 诸事运程吉兆
    nextY += 45;
    ctx.fillStyle = '#8b1e1e';
    ctx.font = 'bold 24px "Noto Serif SC", serif';
    ctx.fillText('【 诸事问卜 】', 80, nextY);

    nextY += 35;
    const items = [
      `事业：${lot.career}`,
      `姻缘：${lot.love}`,
      `财运：${lot.wealth}`,
      `平安：${lot.health}`,
    ];

    items.forEach((item) => {
      ctx.fillStyle = '#334155';
      ctx.font = '19px "Noto Serif SC", serif';
      nextY = wrapText(item, 80, nextY, width - 160, 28) + 30;
    });

    // 9. 仙机开运锦囊
    nextY += 15;
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 20px "Noto Serif SC", serif';
    ctx.fillText(`✦ 仙机指引：${lot.guide}`, 80, nextY);

    nextY += 28;
    ctx.fillStyle = '#854d0e';
    ctx.font = '18px "Noto Serif SC", serif';
    ctx.fillText(`✦ 开运良方：吉色【${lot.luckyColor}】 · 吉方【${lot.luckyDirection}】 · 吉时【${lot.luckyHour}】`, 80, nextY);

    // 用户祈福便签（如果有）
    if (userNote) {
      nextY += 40;
      ctx.fillStyle = 'rgba(139,30,30,0.06)';
      ctx.fillRect(80, nextY - 24, width - 160, 60);
      ctx.strokeStyle = '#b91c1c';
      ctx.strokeRect(80, nextY - 24, width - 160, 60);
      ctx.fillStyle = '#8b1e1e';
      ctx.font = 'italic 19px "Noto Serif SC", serif';
      ctx.fillText(`祈福寄语：“${userNote}”`, 100, nextY + 12);
    }

    // 10. 底部朱砂古篆印章 & 日期黄历
    const footerY = height - 90;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#78716c';
    ctx.font = '18px "Noto Serif SC", serif';
    ctx.fillText(`${lunar.solarDateStr} · ${lunar.lunarMonthDayStr}`, 80, footerY);
    ctx.fillText('永喜灵签 · 诚心祈愿 · 诸恶莫作 · 众善奉行', 80, footerY + 28);

    // 朱红印章 (印章文字 "永喜吉祥")
    ctx.save();
    ctx.translate(width - 160, footerY - 30);
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(0, 0, 72, 72);
    ctx.strokeStyle = '#fef2f2';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 64, 64);

    ctx.fillStyle = '#fef2f2';
    ctx.font = 'bold 22px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.fillText('永喜', 36, 32);
    ctx.fillText('吉祥', 36, 56);
    ctx.restore();

    resolve(canvas.toDataURL('image/png'));
  });
}

export function downloadPoster(dataUrl: string, filename: string = '永喜灵签.png') {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
