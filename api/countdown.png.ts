import { ImageResponse } from '@vercel/og';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  const target = dayjs.tz('2025-11-06 08:00', 'Europe/Prague');
  const now = dayjs();
  const diff = target.diff(now);

  let mins = Math.floor(diff / (1000 * 60));
  let secs = Math.floor((diff % (1000 * 60)) / 1000);

  if (mins < 0) mins = 0;
  if (secs < 0) secs = 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: '800px',
          height: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Poppins, sans-serif',
          background: 'transparent',
        }}
      >
        <div
          style={{
            fontSize: '80px',
            fontWeight: 800,
            color: '#ff96d5',
            textShadow: '0 0 20px #ff0099',
          }}
        >
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
      </div>
    )
  );
}
