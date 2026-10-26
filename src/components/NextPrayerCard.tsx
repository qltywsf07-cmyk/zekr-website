/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NextPrayerInfo, DateInfo } from '../types';
import { Clock, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { formatArabic12H, cleanTimeStr } from '../utils/prayerTimes';

interface NextPrayerCardProps {
  nextPrayer: NextPrayerInfo | null;
  cityName: string;
  countryName: string;
  dateInfo: DateInfo | null;
  onOpenPrayerTimes: () => void;
}

export const NextPrayerCard: React.FC<NextPrayerCardProps> = ({
  nextPrayer,
  cityName,
  countryName,
  dateInfo,
  onOpenPrayerTimes,
}) => {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 shadow-md border border-amber-200/70 dark:border-stone-800 transition-colors flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-sm">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>الصلاة القادمة</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>{cityName}</span>
          </div>
        </div>

        {/* Next prayer content */}
        <div className="py-5 text-center">
          <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold block mb-1">
            موعد أذان
          </span>
          <h3 className="text-3xl sm:text-4xl font-black font-cairo text-emerald-900 dark:text-emerald-200 mb-2">
            صلاة {nextPrayer?.name || '...'}
          </h3>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <span>في تمام:</span>
            <span dir="ltr" className="font-mono font-bold">{nextPrayer ? cleanTimeStr(nextPrayer.time) : '--:--'}</span>
            <span className="text-xs font-semibold">{nextPrayer && Number(cleanTimeStr(nextPrayer.time).split(':')[0]) >= 12 ? 'مساءً' : 'صباحاً'}</span>
          </div>

          {/* Live Countdown Box */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 dark:bg-stone-800/70 border border-amber-200/60 dark:border-stone-700/60">
            <span className="text-[11px] text-amber-900 dark:text-amber-300 font-bold block mb-1.5">
              الوقت المتبقي للأذان:
            </span>
            <div dir="ltr" className="font-mono text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-amber-400 tracking-wider">
              {nextPrayer?.formattedRemaining || '00:00:00'}
            </div>
            <div className="flex justify-center gap-8 text-[10px] text-stone-500 dark:text-stone-400 font-medium mt-1">
              <span>ثوانٍ</span>
              <span>دقائق</span>
              <span>ساعات</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Dates & Action */}
      <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {dateInfo ? `${dateInfo.hijri.day} ${dateInfo.hijri.monthName} ${dateInfo.hijri.year} هـ` : 'التاريخ الهجري'}
          </span>
        </div>

        <button
          onClick={onOpenPrayerTimes}
          className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer group"
        >
          <span>جدول مواقيت اليوم كاملة</span>
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
