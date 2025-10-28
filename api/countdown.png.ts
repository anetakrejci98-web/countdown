import { createCanvas } from '@napi-rs/canvas';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const TARGET = dayjs.tz('2025-11-06 08:00', 'Europe/Prague');
