/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PrayerTimings, NextPrayerInfo } from '../types';

export const PRAYER_NAMES_AR: Record<string, string> = {
  Fajr: 'الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

// Calculation methods supported by Aladhan API
export const CALCULATION_METHODS = [
  { id: 4, name: 'جامعة أم القرى - مكة المكرمة' },
  { id: 3, name: 'رابطة العالم الإسلامي' },
  { id: 5, name: 'الهيئة المصرية العامة للمساحة' },
  { id: 1, name: 'جامعة العلوم الإسلامية بكراتشي' },
  { id: 2, name: 'الاتحاد الإسلامي لأمريكا الشمالية (ISNA)' },
  { id: 8, name: 'منطقة الخليج العربي' },
  { id: 12, name: 'الاتحاد الفرنسي للمنظمات الإسلامية' },
  { id: 13, name: 'ديانة تركيا (Diyanet)' },
  { id: 14, name: 'الإدارة الدينية لمسلمي روسيا' },
];

export const POPULAR_CITIES = [
  { city: 'Makkah', country: 'Saudi Arabia', nameAr: 'مكة المكرمة', countryAr: 'المملكة العربية السعودية' },
  { city: 'Madinah', country: 'Saudi Arabia', nameAr: 'المدينة المنورة', countryAr: 'المملكة العربية السعودية' },
  { city: 'Riyadh', country: 'Saudi Arabia', nameAr: 'الرياض', countryAr: 'المملكة العربية السعودية' },
  { city: 'Cairo', country: 'Egypt', nameAr: 'القاهرة', countryAr: 'مصر' },
  { city: 'Jerusalem', country: 'Palestine', nameAr: 'القدس الشريف', countryAr: 'فلسطين' },
  { city: 'Amman', country: 'Jordan', nameAr: 'عمّان', countryAr: 'الأردن' },
  { city: 'Dubai', country: 'United Arab Emirates', nameAr: 'دبي', countryAr: 'الإمارات' },
  { city: 'Doha', country: 'Qatar', nameAr: 'الدوحة', countryAr: 'قطر' },
  { city: 'Kuwait', country: 'Kuwait', nameAr: 'الكويت', countryAr: 'الكويت' },
  { city: 'Baghdad', country: 'Iraq', nameAr: 'بغداد', countryAr: 'العراق' },
  { city: 'Damascus', country: 'Syria', nameAr: 'دمشق', countryAr: 'سوريا' },
  { city: 'Beirut', country: 'Lebanon', nameAr: 'بيروت', countryAr: 'لبنان' },
  { city: 'Casablanca', country: 'Morocco', nameAr: 'الدار البيضاء', countryAr: 'المغرب' },
  { city: 'Algiers', country: 'Algeria', nameAr: 'الجزائر', countryAr: 'الجزائر' },
  { city: 'Tunis', country: 'Tunisia', nameAr: 'تونس', countryAr: 'تونس' },
  { city: 'Tripoli', country: 'Libya', nameAr: 'طرابلس', countryAr: 'ليبيا' },
  { city: 'Khartoum', country: 'Sudan', nameAr: 'الخرطوم', countryAr: 'السودان' },
  { city: 'Muscat', country: 'Oman', nameAr: 'مسقط', countryAr: 'عُمان' },
  { city: 'Manama', country: 'Bahrain', nameAr: 'المنامة', countryAr: 'البحرين' },
  { city: 'Istanbul', country: 'Turkey', nameAr: 'إسطنبول', countryAr: 'تركيا' },
  { city: 'London', country: 'United Kingdom', nameAr: 'لندن', countryAr: 'المملكة المتحدة' },
  { city: 'Paris', country: 'France', nameAr: 'باريس', countryAr: 'فرنسا' },
  { city: 'Berlin', country: 'Germany', nameAr: 'برلين', countryAr: 'ألمانيا' },
  { city: 'New York', country: 'United States', nameAr: 'نيويورك', countryAr: 'الولايات المتحدة' },
  { city: 'Toronto', country: 'Canada', nameAr: 'تورونتو', countryAr: 'كندا' },
  { city: 'Kuala Lumpur', country: 'Malaysia', nameAr: 'كوالالمبور', countryAr: 'ماليزيا' },
  { city: 'Jakarta', country: 'Indonesia', nameAr: 'جاكرتا', countryAr: 'إندونيسيا' },
];

/**
 * Clean timing string (e.g. "04:52 (EEST)" -> "04:52")
 */
export function cleanTimeStr(raw: string): string {
  if (!raw) return '00:00';
  return raw.split(' ')[0].trim();
}

/**
 * Convert HH:MM time to minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  const clean = cleanTimeStr(timeStr);
  const [hours, minutes] = clean.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Format 24h time "18:45" to Arabic 12h representation e.g. "06:45 م"
 */
export function formatArabic12H(timeStr: string): string {
  const clean = cleanTimeStr(timeStr);
  const [h, m] = clean.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return timeStr;

  const isPM = h >= 12;
  const hours12 = h % 12 === 0 ? 12 : h % 12;
  const padH = hours12.toString().padStart(2, '0');
  const padM = m.toString().padStart(2, '0');
  const period = isPM ? 'م' : 'ص';

  return `${padH}:${padM} ${period}`;
}

/**
 * Format remaining seconds as HH:MM:SS or text
 */
export function formatCountdown(totalSeconds: number): {
  hours: string;
  minutes: string;
  seconds: string;
  fullStr: string;
} {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  const hoursStr = h.toString().padStart(2, '0');
  const minStr = m.toString().padStart(2, '0');
  const secStr = s.toString().padStart(2, '0');

  return {
    hours: hoursStr,
    minutes: minStr,
    seconds: secStr,
    fullStr: `${hoursStr}:${minStr}:${secStr}`,
  };
}

/**
 * Determine next prayer given timings and current date
 */
export function calculateNextPrayer(
  timings: PrayerTimings,
  now: Date = new Date()
): NextPrayerInfo {
  // Prayers in order of the day
  const prayerKeys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentSeconds = now.getSeconds();
  const currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

  for (const key of prayerKeys) {
    const timeStr = cleanTimeStr(timings[key] || '');
    if (!timeStr) continue;

    const [h, m] = timeStr.split(':').map(Number);
    const prayerTotalSeconds = h * 3600 + m * 60;

    if (prayerTotalSeconds > currentTotalSeconds) {
      const remaining = prayerTotalSeconds - currentTotalSeconds;
      return {
        name: PRAYER_NAMES_AR[key] || key,
        nameKey: key,
        time: timeStr,
        remainingSeconds: remaining,
        formattedRemaining: formatCountdown(remaining).fullStr,
        isToday: true,
      };
    }
  }

  // If passed Isha, next prayer is Fajr tomorrow
  const fajrStr = cleanTimeStr(timings.Fajr || '05:00');
  const [fajrH, fajrM] = fajrStr.split(':').map(Number);
  const secondsUntilMidnight = 86400 - currentTotalSeconds;
  const fajrSecondsTomorrow = fajrH * 3600 + fajrM * 60;
  const remaining = secondsUntilMidnight + fajrSecondsTomorrow;

  return {
    name: PRAYER_NAMES_AR.Fajr,
    nameKey: 'Fajr',
    time: fajrStr,
    remainingSeconds: remaining,
    formattedRemaining: formatCountdown(remaining).fullStr,
    isToday: false,
  };
}

/**
 * Fallback static prayer timings in case API is unreachable or offline
 */
export const FALLBACK_TIMINGS: PrayerTimings = {
  Fajr: '05:08',
  Sunrise: '06:27',
  Dhuhr: '12:12',
  Asr: '15:33',
  Maghrib: '17:58',
  Isha: '19:28',
};
