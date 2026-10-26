/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  PrayerTimings,
  NextPrayerInfo,
  DateInfo,
} from '../types';
import {
  PRAYER_NAMES_AR,
  CALCULATION_METHODS,
  POPULAR_CITIES,
  formatArabic12H,
  calculateNextPrayer,
  cleanTimeStr,
  FALLBACK_TIMINGS,
} from '../utils/prayerTimes';
import {
  Clock,
  MapPin,
  Calendar,
  Compass,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Sun,
  Sunrise,
  Sunset,
  Moon,
} from 'lucide-react';

interface PrayerTimesSectionProps {
  prayerTimings: PrayerTimings;
  setPrayerTimings: React.Dispatch<React.SetStateAction<PrayerTimings>>;
  nextPrayer: NextPrayerInfo | null;
  city: string;
  setCity: (city: string) => void;
  country: string;
  setCountry: (country: string) => void;
  method: number;
  setMethod: (method: number) => void;
  dateInfo: DateInfo | null;
  isLoading: boolean;
  error: string | null;
  fetchTimings: (cityToUse?: string, countryToUse?: string, methodToUse?: number) => void;
  handleGeolocation: () => void;
}

export const PrayerTimesSection: React.FC<PrayerTimesSectionProps> = ({
  prayerTimings,
  nextPrayer,
  city,
  setCity,
  country,
  setCountry,
  method,
  setMethod,
  dateInfo,
  isLoading,
  error,
  fetchTimings,
  handleGeolocation,
}) => {
  const [customCity, setCustomCity] = useState(city);
  const [customCountry, setCustomCountry] = useState(country);
  const [showSettings, setShowSettings] = useState(false);

  // Sync internal custom input fields when props change
  useEffect(() => {
    setCustomCity(city);
    setCustomCountry(country);
  }, [city, country]);

  const prayersList = [
    { key: 'Fajr', name: 'الفجر', icon: Moon, description: 'بداية وقت الإمساك وصلاة الصبح' },
    { key: 'Sunrise', name: 'الشروق', icon: Sunrise, description: 'شروق الشمس ونهاية وقت الفجر' },
    { key: 'Dhuhr', name: 'الظهر', icon: Sun, description: 'زوال الشمس عن كبد السماء' },
    { key: 'Asr', name: 'العصر', icon: Sun, description: 'مصير ظل الشيء مثليه' },
    { key: 'Maghrib', name: 'المغرب', icon: Sunset, description: 'غروب الشمس ووقت الإفطار للصائم' },
    { key: 'Isha', name: 'العشاء', icon: Moon, description: 'مغيب الشفق الأحمر وحلول الظلام' },
  ];

  const handleCitySelect = (item: typeof POPULAR_CITIES[0]) => {
    setCity(item.city);
    setCountry(item.country);
    setCustomCity(item.city);
    setCustomCountry(item.country);
    fetchTimings(item.city, item.country, method);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCity.trim() || !customCountry.trim()) return;
    setCity(customCity.trim());
    setCountry(customCountry.trim());
    fetchTimings(customCity.trim(), customCountry.trim(), method);
  };

  const handleMethodChange = (newMethodId: number) => {
    setMethod(newMethodId);
    fetchTimings(city, country, newMethodId);
  };

  return (
    <section className="space-y-8" id="prayer-times-section">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/40">
          <Clock className="w-3.5 h-3.5" />
          <span>مواقيت الصلاة الدقيقة</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          مواقيت الصلاة بحسب موقعك
        </h2>
        <p className="text-stone-600 dark:text-stone-400 text-sm">
          أوقات الصلوات الخمس مع وقت الشروق والعد التنازلي التفاعلي المباشر حتى موعد الصلاة القادمة.
        </p>
      </div>

      {/* City Picker Bar & Geolocation Button */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 shadow-md border border-amber-200/60 dark:border-stone-800 space-y-5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Current City display + Geolocation Action */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">المدينة الحالية:</span>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-cairo">
                  {city}، {country}
                </h3>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Geolocation Button */}
            <button
              onClick={handleGeolocation}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="تحديد الموقع التلقائي عبر متصفحك"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>حدد موقعي تلقائياً</span>
            </button>

            {/* Toggle Custom Search / Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
            >
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>{showSettings ? 'إخفاء الإعدادات' : 'تغيير المدينة والحساب'}</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => fetchTimings()}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
              title="تحديث المواقيت"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Collapsible Settings Form */}
        {showSettings && (
          <div className="pt-5 border-t border-stone-100 dark:border-stone-800 space-y-5 animate-fadeIn">
            {/* Custom Input Form */}
            <form onSubmit={handleCustomSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  اسم المدينة (بالإنجليزية أو العربية):
                </label>
                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="مثال: Cairo أو Riyadh"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  اسم الدولة:
                </label>
                <input
                  type="text"
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  placeholder="مثال: Egypt أو Saudi Arabia"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-colors cursor-pointer shadow-sm"
                >
                  تطبيق وبحث
                </button>
              </div>
            </form>

            {/* Calculation Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                طريقة حساب المواقيت الفقهية:
              </label>
              <select
                value={method}
                onChange={(e) => handleMethodChange(Number(e.target.value))}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                {CALCULATION_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Popular Cities Quick Buttons */}
            <div>
              <span className="block text-xs font-semibold text-stone-500 dark:text-stone-400 mb-2">
                مدن شائعة سريعة الاختيار:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                {POPULAR_CITIES.map((c) => (
                  <button
                    key={`${c.city}-${c.country}`}
                    onClick={() => handleCitySelect(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      city === c.city
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    {c.nameAr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Notification if any */}
        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">{error}</p>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                يتم الآن عرض المواقيت الاحتياطية المعتمدة لمدينة مكة المكرمة لحين استعادة الاتصال.
              </p>
            </div>
          </div>
        )}

        {/* Date Headers: Hijri & Gregorian */}
        {dateInfo && (
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-stone-600 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>
                <strong className="text-stone-900 dark:text-stone-200">التاريخ الهجري:</strong>{' '}
                {dateInfo.hijri.dayName}، {dateInfo.hijri.day} {dateInfo.hijri.monthName}{' '}
                {dateInfo.hijri.year} هـ
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>
                <strong className="text-stone-900 dark:text-stone-200">التاريخ الميلادي:</strong>{' '}
                {dateInfo.gregorian.dayName}، {dateInfo.gregorian.day}{' '}
                {dateInfo.gregorian.month} {dateInfo.gregorian.year} م
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 6 Prayer Times Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {prayersList.map((item) => {
          const Icon = item.icon;
          const isNext = nextPrayer?.nameKey === item.key;
          const rawTime = prayerTimings[item.key] || '--:--';
          const cleanTime = cleanTimeStr(rawTime);
          const time12 = formatArabic12H(cleanTime);

          return (
            <div
              key={item.key}
              className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between ${
                isNext
                  ? 'bg-gradient-to-b from-emerald-800 to-emerald-950 text-white shadow-xl ring-2 ring-amber-400 transform scale-102 z-10'
                  : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-amber-200/50 dark:border-stone-800 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Highlight ribbon for Next Prayer */}
              {isNext && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black tracking-wider uppercase shadow-sm">
                  الصلاة القادمة
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-sm sm:text-base font-bold font-cairo ${
                      isNext ? 'text-amber-300' : 'text-stone-900 dark:text-stone-100'
                    }`}
                  >
                    {item.name}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isNext
                        ? 'bg-emerald-700/80 text-amber-300'
                        : 'bg-amber-50 dark:bg-stone-800 text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="my-2">
                  <span
                    dir="ltr"
                    className={`font-mono text-2xl sm:text-3xl font-black block tracking-tight ${
                      isNext ? 'text-white' : 'text-emerald-900 dark:text-emerald-200'
                    }`}
                  >
                    {cleanTime}
                  </span>
                  <span
                    className={`text-[11px] font-medium block mt-0.5 ${
                      isNext ? 'text-emerald-200' : 'text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {time12}
                  </span>
                </div>
              </div>

              {/* Countdown badge if next prayer */}
              {isNext && nextPrayer && (
                <div className="mt-4 pt-3 border-t border-emerald-700/60 text-center">
                  <span className="text-[10px] text-amber-300 block mb-0.5 font-semibold">
                    متبقي:
                  </span>
                  <span dir="ltr" className="font-mono text-sm font-extrabold text-amber-300">
                    {nextPrayer.formattedRemaining}
                  </span>
                </div>
              )}

              {!isNext && (
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1">
                  {item.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
