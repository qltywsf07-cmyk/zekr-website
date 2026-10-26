/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Hadith {
  id: number;
  title: string;
  category: string;
  matn: string; // The hadith text with tashkeel
  narrator: string; // Sahabi narrator
  source: string; // e.g. صحيح البخاري، صحيح مسلم
  reference: string; // Book, chapter or Hadith number
  authenticity: string; // e.g. صحيح (متفق عليه)، صحيح البخاري، صحيح مسلم
  explanation?: string; // Brief benefit or note
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface NextPrayerInfo {
  name: string; // e.g. "الظهر"
  nameKey: string; // e.g. "Dhuhr"
  time: string; // e.g. "12:15"
  remainingSeconds: number;
  formattedRemaining: string; // e.g. "02:15:30"
  isToday: boolean;
}

export interface DateInfo {
  gregorian: {
    date: string;
    dayName: string;
    day: number;
    month: string;
    year: number;
  };
  hijri: {
    date: string;
    dayName: string;
    day: string;
    monthName: string;
    year: string;
    designation: string;
  };
}

export interface CalculationMethod {
  id: number;
  name: string;
}

export interface DhikrItem {
  id: number;
  text: string;
  count: number;
  reward: string;
  reference: string;
}

export interface AllahName {
  number: number;
  name: string;
  meaning: string;
}

export interface IslamicPillar {
  title: string;
  summary: string;
  evidence: string;
  details: string[];
}
