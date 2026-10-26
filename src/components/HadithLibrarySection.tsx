/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Hadith } from '../types';
import { filterHadiths } from '../utils/hadithFilters';
import {
  Search,
  BookOpen,
  Heart,
  Copy,
  Check,
  Share2,
  Award,
  UserCheck,
  Tag,
  X,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface HadithLibrarySectionProps {
  hadiths: Hadith[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  fontSizeOffset: number;
}

export const HadithLibrarySection: React.FC<HadithLibrarySectionProps> = ({
  hadiths,
  favorites,
  onToggleFavorite,
  fontSizeOffset,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Available categories
  const categories = [
    'الكل',
    'التوحيد والإخلاص',
    'سعة الرحمة والمغفرة',
    'الصلاة ومناجاة الله',
    'الصيام وفضله',
    'الذكر والدعاء',
    'التوبة والرجوع',
    'محبة الله وأولياؤه',
    'الإنفاق والصدقة',
    'الجنة ونعيمها',
    'حسن الخلق والعدل',
  ];

  // Filtered hadiths based on search, category, favorites
  const filteredHadiths = useMemo(() => {
    return filterHadiths(hadiths, {
      query: searchQuery,
      category: selectedCategory,
      favoritesOnly: favoritesOnly,
      favoriteIds: favorites,
    });
  }, [hadiths, searchQuery, selectedCategory, favoritesOnly, favorites]);

  const handleCopyHadith = async (hadith: Hadith) => {
    const textToCopy = `«${hadith.matn}»\n\nالراوي: ${hadith.narrator}\nالمصدر: ${hadith.source} - ${hadith.reference}\nدرجة الصحة: ${hadith.authenticity}\nمن منصة ذِكر للأحاديث القدسية الصحيحة`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedId(hadith.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleShareHadith = async (hadith: Hadith) => {
    const textToShare = `«${hadith.matn}»\n\nالراوي: ${hadith.narrator} | المصدر: ${hadith.source}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: hadith.title,
          text: textToShare,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyHadith(hadith);
    }
  };

  const baseFontSize = 18 + fontSizeOffset;

  return (
    <section className="space-y-8" id="hadiths-library-section">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/40">
          <BookOpen className="w-3.5 h-3.5" />
          <span>مكتبة الأحاديث القدسية الصحيحة</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          أحاديث رب العزة والجلال
        </h2>
        <p className="text-stone-600 dark:text-stone-400 text-sm">
          أحاديث قدسية ثابتة في الصحيحين والسنن المعتمدة، مرتبة ومحققة مع بيان الراوي والمصدر الدقيق.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 shadow-md border border-amber-200/60 dark:border-stone-800 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-stone-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في نص الحديث، الراوي، الباب، أو الموضوع (مثال: الظلم، التوبة، البخاري...)"
            className="w-full pr-11 pl-10 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              title="مسح البحث"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs & Favorites Toggle */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          {/* Favorites Filter Tab */}
          <button
            onClick={() => {
              setFavoritesOnly(!favoritesOnly);
              if (!favoritesOnly) setSelectedCategory('الكل');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              favoritesOnly
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-50 dark:hover:bg-stone-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-white' : 'text-rose-500'}`} />
            <span>المفضلة ({favorites.length})</span>
          </button>

          <span className="text-stone-300 dark:text-stone-700 px-1 hidden sm:inline">|</span>

          {/* Category Tabs */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat && !favoritesOnly;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setFavoritesOnly(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-amber-100/70 dark:hover:bg-stone-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Result Counter & Active Filters Reset */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1">
          <span>
            يُعرض <strong>{filteredHadiths.length}</strong> من أصل {hadiths.length} حديث قدسي
          </span>

          {(searchQuery || selectedCategory !== 'الكل' || favoritesOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('الكل');
                setFavoritesOnly(false);
              }}
              className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
            >
              إعادة تعيين الفلاتر
            </button>
          )}
        </div>
      </div>

      {/* Hadiths Cards List */}
      {filteredHadiths.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredHadiths.map((hadith) => {
            const isFav = favorites.includes(hadith.id);
            const isCopied = copiedId === hadith.id;

            return (
              <article
                key={hadith.id}
                className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-amber-200/50 dark:border-stone-800 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 transition-all duration-200"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                      #{hadith.id}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-cairo text-stone-900 dark:text-stone-100">
                      {hadith.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium">
                      {hadith.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/50">
                      <Award className="w-3 h-3 text-amber-500" />
                      <span>{hadith.authenticity}</span>
                    </span>
                  </div>
                </div>

                {/* Hadith Text */}
                <div className="my-5">
                  <blockquote
                    className="font-amiri text-stone-800 dark:text-stone-100 leading-loose text-right"
                    style={{ fontSize: `${baseFontSize}px`, lineHeight: 2.1 }}
                  >
                    {hadith.matn}
                  </blockquote>

                  {hadith.explanation && (
                    <div className="mt-4 p-3 rounded-xl bg-amber-50/60 dark:bg-stone-800/50 border border-amber-200/40 dark:border-stone-700/50 text-xs text-stone-700 dark:text-stone-300 leading-relaxed flex items-start gap-2">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">فائدة:</span>
                      <span>{hadith.explanation}</span>
                    </div>
                  )}
                </div>

                {/* Attribution & Actions */}
                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-600 dark:text-stone-400">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        <strong className="text-stone-800 dark:text-stone-200">الراوي:</strong> {hadith.narrator}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        <strong className="text-stone-800 dark:text-stone-200">المصدر:</strong> {hadith.source} - {hadith.reference}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Favorite, Copy, Share */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => onToggleFavorite(hadith.id)}
                      aria-label={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                      className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isFav
                          ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
                      }`}
                      title={isFav ? 'في المفضلة' : 'إضافة إلى المفضلة'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleCopyHadith(hadith)}
                      aria-label="نسخ نص الحديث"
                      className="flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold transition-all cursor-pointer"
                      title="نسخ نص الحديث مع التخريج"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'تم النسخ' : 'نسخ'}</span>
                    </button>

                    <button
                      onClick={() => handleShareHadith(hadith)}
                      aria-label="مشاركة الحديث"
                      className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 transition-all cursor-pointer"
                      title="مشاركة الحديث"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-10 text-center border border-dashed border-stone-300 dark:border-stone-700 space-y-3">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200">
            لم نجد أحاديث تطابق بحثك
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            جرّب تغيير كلمات البحث أو اختيار تصنيف آخر، أو استعراض جميع الأحاديث القدسية المتاحة.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('الكل');
              setFavoritesOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            عرض كافة الأحاديث
          </button>
        </div>
      )}

      {/* Scholarly Disclaimer Card (Strict requirement from prompt) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/80 dark:bg-stone-800/80 border border-amber-300/70 dark:border-stone-700 flex items-start gap-3.5 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
            تنبيه وأمانة علمية بشأن نصوص الأحاديث ومصادرها:
          </p>
          <p>
            تقتصر هذه المكتبة على الأحاديث القدسية الثابتة الصحيحة في الصحيحين (صحيح البخاري وصحيح مسلم) أو التي صححها أئمة الحديث وحفاظ السنة المعتبرون. نؤكد على ضرورة الرجوع إلى المصادر الأصلية ودواوين السنة وشروحها المعتمدة عند طلب التحقيق الفقهي أو الاستدلال العلمي الدقيق.
          </p>
        </div>
      </div>
    </section>
  );
};
