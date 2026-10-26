/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import rawHadiths from './data/hadiths.json';
import { Hadith, PrayerTimings, NextPrayerInfo, DateInfo } from './types';
import { Navbar } from './components/Navbar';
import { DailyHadithCard } from './components/DailyHadithCard';
import { NextPrayerCard } from './components/NextPrayerCard';
import { PrayerTimesSection } from './components/PrayerTimesSection';
import { HadithLibrarySection } from './components/HadithLibrarySection';
import { IslamicKnowledgeSection } from './components/IslamicKnowledgeSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import {
  calculateNextPrayer,
  FALLBACK_TIMINGS,
  cleanTimeStr,
  POPULAR_CITIES,
} from './utils/prayerTimes';
import { getDailyHadith, getAnotherHadith } from './utils/hadithFilters';
import {
  BookOpen,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ArrowUp,
} from 'lucide-react';

const hadithsData: Hadith[] = rawHadiths as Hadith[];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('home');

  // Dark Mode state with localStorage persistence
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('dhikr_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Font size offset for Hadith texts (-4 to +8)
  const [fontSizeOffset, setFontSizeOffset] = useState<number>(() => {
    const saved = localStorage.getItem('dhikr_font_size');
    return saved ? Number(saved) : 0;
  });

  // Favorites state with localStorage persistence
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('dhikr_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Daily Hadith state
  const [currentDailyHadith, setCurrentDailyHadith] = useState<Hadith>(() => {
    return getDailyHadith(hadithsData) || hadithsData[0];
  });

  // Prayer times state with persistence
  const [city, setCity] = useState<string>(() => {
    return localStorage.getItem('dhikr_city') || 'Makkah';
  });

  const [country, setCountry] = useState<string>(() => {
    return localStorage.getItem('dhikr_country') || 'Saudi Arabia';
  });

  const [method, setMethod] = useState<number>(() => {
    const saved = localStorage.getItem('dhikr_method');
    return saved ? Number(saved) : 4; // 4: Umm al-Qura
  });

  const [prayerTimings, setPrayerTimings] = useState<PrayerTimings>(FALLBACK_TIMINGS);
  const [nextPrayer, setNextPrayer] = useState<NextPrayerInfo | null>(null);
  const [dateInfo, setDateInfo] = useState<DateInfo | null>(null);
  const [isLoadingPrayer, setIsLoadingPrayer] = useState(false);
  const [prayerError, setPrayerError] = useState<string | null>(null);

  // Quick feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync Dark Mode class with <html> element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dhikr_dark_mode', String(isDark));
  }, [isDark]);

  // Sync font size
  useEffect(() => {
    localStorage.setItem('dhikr_font_size', String(fontSizeOffset));
  }, [fontSizeOffset]);

  // Sync favorites
  useEffect(() => {
    localStorage.setItem('dhikr_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Sync city & country & method
  useEffect(() => {
    localStorage.setItem('dhikr_city', city);
    localStorage.setItem('dhikr_country', country);
    localStorage.setItem('dhikr_method', String(method));
  }, [city, country, method]);

  // Toggle favorite hadith
  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('تمت إزالة الحديث من المفضلة');
        return prev.filter((item) => item !== id);
      } else {
        showToast('تمت إضافة الحديث إلى المفضلة بنجاح');
        return [...prev, id];
      }
    });
  };

  // Shuffle daily hadith
  const handleShuffleDailyHadith = () => {
    const nextOne = getAnotherHadith(hadithsData, currentDailyHadith.id);
    if (nextOne) {
      setCurrentDailyHadith(nextOne);
      showToast('تم عرض حديث قدسي آخر');
    }
  };

  // Fetch Prayer Timings from Aladhan API
  const fetchPrayerTimings = useCallback(
    async (cityParam?: string, countryParam?: string, methodParam?: number) => {
      const c = cityParam || city;
      const co = countryParam || country;
      const m = methodParam !== undefined ? methodParam : method;

      setIsLoadingPrayer(true);
      setPrayerError(null);

      try {
        const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
          c
        )}&country=${encodeURIComponent(co)}&method=${m}`;

        const res = await fetch(url, { cache: 'default' });
        if (!res.ok) {
          throw new Error('فشل جلب المواقيت من الخادم');
        }

        const data = await res.json();
        if (data.code === 200 && data.data) {
          const rawTimings = data.data.timings;
          setPrayerTimings({
            Fajr: cleanTimeStr(rawTimings.Fajr),
            Sunrise: cleanTimeStr(rawTimings.Sunrise),
            Dhuhr: cleanTimeStr(rawTimings.Dhuhr),
            Asr: cleanTimeStr(rawTimings.Asr),
            Maghrib: cleanTimeStr(rawTimings.Maghrib),
            Isha: cleanTimeStr(rawTimings.Isha),
          });

          // Date info
          const gDate = data.data.date.gregorian;
          const hDate = data.data.date.hijri;
          setDateInfo({
            gregorian: {
              date: gDate.date,
              dayName: gDate.weekday.en,
              day: Number(gDate.day),
              month: gDate.month.en,
              year: Number(gDate.year),
            },
            hijri: {
              date: hDate.date,
              dayName: hDate.weekday.ar,
              day: hDate.day,
              monthName: hDate.month.ar,
              year: hDate.year,
              designation: hDate.designation.abbreviated,
            },
          });
        } else {
          throw new Error('البيانات غير صالحة');
        }
      } catch (err: any) {
        console.warn('Aladhan API fetch error, using fallback:', err);
        setPrayerError('تعذر الاتصال بخدمة المواقيت حالياً أو اسم المدينة غير مطابق.');
        // Keep or set fallback timings
        setPrayerTimings((prev) => prev || FALLBACK_TIMINGS);
      } finally {
        setIsLoadingPrayer(false);
      }
    },
    [city, country, method]
  );

  // Initial prayer timings fetch
  useEffect(() => {
    fetchPrayerTimings();
  }, []);

  // Geolocation handler
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      showToast('المتصفح لا يدعم تحديد الموقع الجغرافي');
      return;
    }

    setIsLoadingPrayer(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const url = `https://api.aladhan.com/v1/timings/${Math.floor(
            Date.now() / 1000
          )}?latitude=${lat}&longitude=${lon}&method=${method}`;

          const res = await fetch(url);
          const data = await res.json();
          if (data.code === 200 && data.data) {
            const rawTimings = data.data.timings;
            setPrayerTimings({
              Fajr: cleanTimeStr(rawTimings.Fajr),
              Sunrise: cleanTimeStr(rawTimings.Sunrise),
              Dhuhr: cleanTimeStr(rawTimings.Dhuhr),
              Asr: cleanTimeStr(rawTimings.Asr),
              Maghrib: cleanTimeStr(rawTimings.Maghrib),
              Isha: cleanTimeStr(rawTimings.Isha),
            });

            // Set approximate city label from timezone or default
            const tz = data.data.meta?.timezone || 'موقعي الحالي';
            const cleanTz = tz.split('/').pop()?.replace(/_/g, ' ') || 'موقعي الحالي';
            setCity(cleanTz);
            setCountry('إحداثيات جغرافية');

            const gDate = data.data.date.gregorian;
            const hDate = data.data.date.hijri;
            setDateInfo({
              gregorian: {
                date: gDate.date,
                dayName: gDate.weekday.en,
                day: Number(gDate.day),
                month: gDate.month.en,
                year: Number(gDate.year),
              },
              hijri: {
                date: hDate.date,
                dayName: hDate.weekday.ar,
                day: hDate.day,
                monthName: hDate.month.ar,
                year: hDate.year,
                designation: hDate.designation.abbreviated,
              },
            });
            showToast('تم تحديد مواقيت الصلاة حسب موقعك بنجاح');
          }
        } catch {
          showToast('تعذر جلب المواقيت للإحداثيات المحددة');
        } finally {
          setIsLoadingPrayer(false);
        }
      },
      (err) => {
        setIsLoadingPrayer(false);
        showToast('يرجى السماح بصلاحية الموقع في المتصفح');
      },
      { timeout: 10000 }
    );
  };

  // Live Next Prayer and Countdown Ticker (updates every second)
  useEffect(() => {
    const updateCountdown = () => {
      const next = calculateNextPrayer(prayerTimings, new Date());
      setNextPrayer(next);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [prayerTimings]);

  // Listen to openFavorites custom event
  useEffect(() => {
    const handler = () => {
      setActiveTab('hadiths');
    };
    window.addEventListener('openFavorites', handler);
    return () => window.removeEventListener('openFavorites', handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-cairo islamic-pattern bg-amber-50/40 text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-stone-900/95 text-white dark:bg-stone-100 dark:text-stone-900 text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 border border-emerald-500/50 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        fontSizeOffset={fontSizeOffset}
        setFontSizeOffset={setFontSizeOffset}
        favoritesCount={favorites.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Hero Banner with Islamic Calligraphy vibe */}
            <div className="relative text-center max-w-3xl mx-auto space-y-4 pt-4 sm:pt-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 text-xs font-bold border border-emerald-300/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>موقع إسلامي للتذكير بكلام رب العزة</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-emerald-950 dark:text-emerald-100 tracking-tight font-cairo">
                الأحاديث القدسية الصحيحة
              </h1>

              <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                قال الله تعالى: ﴿وَذَكِّرْ فَإِنَّ الذِّكْرَى تَنفَعُ الْمُؤْمِنِينَ﴾. منصة موثوقة تجمع ما صح وثبت من الأحاديث النبوية القدسية عند أهل السنة والجماعة، مع مواقيت الصلاة الدقيقة وأذكار اليوم والليلة.
              </p>
            </div>

            {/* Split Grid: Hadith of the Day (2 cols) + Next Prayer Countdown (1 col) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Daily Hadith Card (Takes 2 Columns on desktop) */}
              <div className="lg:col-span-2">
                <DailyHadithCard
                  hadith={currentDailyHadith}
                  onShuffle={handleShuffleDailyHadith}
                  isFavorite={favorites.includes(currentDailyHadith.id)}
                  onToggleFavorite={handleToggleFavorite}
                  fontSizeOffset={fontSizeOffset}
                />
              </div>

              {/* Next Prayer Live Card (Takes 1 Column on desktop) */}
              <div className="lg:col-span-1">
                <NextPrayerCard
                  nextPrayer={nextPrayer}
                  cityName={city}
                  countryName={country}
                  dateInfo={dateInfo}
                  onOpenPrayerTimes={() => setActiveTab('prayer')}
                />
              </div>
            </div>

            {/* Quick Feature Highlights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div
                onClick={() => setActiveTab('hadiths')}
                className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-amber-200/50 dark:border-stone-800 shadow-sm hover:border-emerald-600 transition-all cursor-pointer group space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                  مكتبة 40+ حديثاً قدسياً
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  أحاديث محققة بدقة ومصنفة حسب الموضوع، مع بحث سريع وحفظ للمفضلة.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('prayer')}
                className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-amber-200/50 dark:border-stone-800 shadow-sm hover:border-emerald-600 transition-all cursor-pointer group space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                  مواقيت الصلاة العالمية
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  تحديد الموقع التلقائي، واختيار طرق الحساب المعتمدة، والتاريخ الهجري.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('knowledge')}
                className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-amber-200/50 dark:border-stone-800 shadow-sm hover:border-emerald-600 transition-all cursor-pointer group space-y-2"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                  معارف وأذكار تفاعلية
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  أذكار الصباح والمساء بعداد ذكي، أسماء الله الحسنى، ومقارنة القرآن بالحديث.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: HADITHS LIBRARY */}
        {activeTab === 'hadiths' && (
          <div className="animate-fadeIn">
            <HadithLibrarySection
              hadiths={hadithsData}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              fontSizeOffset={fontSizeOffset}
            />
          </div>
        )}

        {/* VIEW 3: PRAYER TIMES */}
        {activeTab === 'prayer' && (
          <div className="animate-fadeIn">
            <PrayerTimesSection
              prayerTimings={prayerTimings}
              setPrayerTimings={setPrayerTimings}
              nextPrayer={nextPrayer}
              city={city}
              setCity={setCity}
              country={country}
              setCountry={setCountry}
              method={method}
              setMethod={setMethod}
              dateInfo={dateInfo}
              isLoading={isLoadingPrayer}
              error={prayerError}
              fetchTimings={fetchPrayerTimings}
              handleGeolocation={handleGeolocation}
            />
          </div>
        )}

        {/* VIEW 4: ISLAMIC KNOWLEDGE */}
        {activeTab === 'knowledge' && (
          <div className="animate-fadeIn">
            <IslamicKnowledgeSection />
          </div>
        )}

        {/* VIEW 5: ABOUT */}
        {activeTab === 'about' && (
          <div className="animate-fadeIn">
            <AboutSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavClick={(tab) => setActiveTab(tab)} />
    </div>
  );
}
