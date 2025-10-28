import { createCanvas } from '@napi-rs/canvas';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

// Cíl: 6. 11. 2025 08:00 Europe/Prague
const TARGET = dayjs.tz('2025-11-06 08:00', 'Europe/Prague');

export default async function handler(req: any, res: any) {
  const width = 430;
  const height = 80;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);

  const now = dayjs();
  let diff = TARGET.diff(now, 'second');
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const mins = Math.floor((diff % 3600) / 60);

  // Neon čísla
  const drawNeon = (text: string, x: number, y: number) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '800 48px Poppins, Arial, sans-serif';
    ctx.fillStyle = '#ff96d5';
    ctx.shadowColor = '#ff0099';
    ctx.shadowBlur = 18; ctx.fillText(text, x, y);
    ctx.shadowBlur = 10; ctx.fillText(text, x, y);
    ctx.shadowBlur = 6;  ctx.fillText(text, x, y);
    ctx.shadowBlur = 0;  ctx.fillText(text, x, y);
    ctx.restore();
  };

  const drawLabel = (label: string, x: number, y: number) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '700 13px Poppins, Arial, sans-serif';
    ctx.fillStyle = '#a7e8ff';
    ctx.shadowColor = '#a7e8ff';
    ctx.shadowBlur = 8;
    ctx.fillText(label, x, y);
    ctx.restore();
  };

  const colW = width / 3;
  const topNum = 6;
  const topLabel = 54;

  drawNeon(String(days), colW * 0.5, topNum);
  drawLabel('DNI', colW * 0.5, topLabel);

  drawNeon(hours.toString().padStart(2, '0'), colW * 1.5, topNum);
  drawLabel('GODZ', colW * 1.5, topLabel);

  drawNeon(mins.toString().padStart(2, '0'), colW * 2.5, topNum);
  drawLabel('MIN', colW * 2.5, topLabel);

  // jemný grain
  ctx.save();
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 500; i++) {
    const gx = Math.random() * width;
    const gy = Math.random() * height;
    const gs = Math.random() * 1.2;
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(gx, gy, gs, gs);
  }
  ctx.restore();

  const buffer = await canvas.encode('png');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).end(buffer);
}
