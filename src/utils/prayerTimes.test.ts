/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanTimeStr,
  timeToMinutes,
  formatArabic12H,
  formatCountdown,
  calculateNextPrayer,
  PRAYER_NAMES_AR,
} from './prayerTimes';

test('cleanTimeStr removes timezone suffixes', () => {
  assert.equal(cleanTimeStr('04:52 (EEST)'), '04:52');
  assert.equal(cleanTimeStr('18:30 (+03)'), '18:30');
  assert.equal(cleanTimeStr('12:00'), '12:00');
  assert.equal(cleanTimeStr(''), '00:00');
});

test('timeToMinutes calculates total minutes from midnight', () => {
  assert.equal(timeToMinutes('00:00'), 0);
  assert.equal(timeToMinutes('01:30'), 90);
  assert.equal(timeToMinutes('12:00'), 720);
  assert.equal(timeToMinutes('23:59'), 1439);
});

test('formatArabic12H converts 24h to Arabic 12h representation', () => {
  assert.equal(formatArabic12H('05:30'), '05:30 ص');
  assert.equal(formatArabic12H('12:15'), '12:15 م');
  assert.equal(formatArabic12H('15:45'), '03:45 م');
  assert.equal(formatArabic12H('20:00'), '08:00 م');
  assert.equal(formatArabic12H('00:10'), '12:10 ص');
});

test('formatCountdown formats remaining seconds into HH:MM:SS', () => {
  const result = formatCountdown(3665); // 1h 1m 5s
  assert.equal(result.hours, '01');
  assert.equal(result.minutes, '01');
  assert.equal(result.seconds, '05');
  assert.equal(result.fullStr, '01:01:05');
});

test('calculateNextPrayer finds the immediate next prayer', () => {
  const mockTimings = {
    Fajr: '05:00',
    Sunrise: '06:30',
    Dhuhr: '12:30',
    Asr: '15:45',
    Maghrib: '18:15',
    Isha: '19:45',
  };

  // 10:00 AM -> Next is Dhuhr at 12:30
  const morning = new Date();
  morning.setHours(10, 0, 0, 0);
  const nextMorning = calculateNextPrayer(mockTimings, morning);
  assert.equal(nextMorning.nameKey, 'Dhuhr');
  assert.equal(nextMorning.name, 'الظهر');
  assert.equal(nextMorning.remainingSeconds, 2.5 * 3600);

  // 16:00 (4:00 PM) -> Next is Maghrib at 18:15
  const afternoon = new Date();
  afternoon.setHours(16, 0, 0, 0);
  const nextAfternoon = calculateNextPrayer(mockTimings, afternoon);
  assert.equal(nextAfternoon.nameKey, 'Maghrib');
  assert.equal(nextAfternoon.name, 'المغرب');

  // 21:00 (9:00 PM) -> After Isha, next is Fajr tomorrow
  const night = new Date();
  night.setHours(21, 0, 0, 0);
  const nextNight = calculateNextPrayer(mockTimings, night);
  assert.equal(nextNight.nameKey, 'Fajr');
  assert.equal(nextNight.isToday, false);
});
