/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Hadith } from '../types';
import {
  Sparkles,
  Shuffle,
  Copy,
  Check,
  Share2,
  Heart,
  BookOpen,
  UserCheck,
  Award,
} from 'lucide-react';

interface DailyHadithCardProps {
  hadith: Hadith;
  onShuffle: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  fontSizeOffset: number;
}

export const DailyHadithCard: React.FC<DailyHadithCardProps> = ({
  hadith,
  onShuffle,
  isFavorite,
  onToggleFavorite,
  fontSizeOffset,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Compute text size class
  const baseFontSize = 20 + fontSizeOffset; // default 20px (1.25rem)

  const handleCopy = async () => {
    const textToCopy = `«${hadith.matn}»\n\nالراوي: ${hadith.narrator}\nالمصدر: ${hadith.source} - ${hadith.reference}\nدرجة الصحة: ${hadith.authenticity}\nمنقول من منصة ذِكر للأحاديث القدسية الصحيحة`;
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    const textToShare = `«${hadith.matn}»\n\nالراوي: ${hadith.narrator} | المصدر: ${hadith.source}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: hadith.title,
          text: textToShare,
          url: window.location.href,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch {
        // User cancelled or not supported
      }
    } else {
      handleCopy();
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  return (
    <article className="relative bg-gradient-to-b from-emerald-900/95 via-emerald-950 to-stone-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-emerald-700/40 overflow-hidden">
      {/* Decorative Islamic Background Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-amber-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-radial from-teal-500/10 via-emerald-800/5 to-transparent rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

      {/* Header Tag / Section Banner */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-emerald-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                حديث قدسي اليوم
              </span>
              <span className="text-stone-400 text-xs">·</span>
              <span className="text-xs text-emerald-300/90 font-medium">
                {hadith.category}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-cairo text-stone-100 mt-0.5">
              {hadith.title}
            </h2>
          </div>
        </div>

        {/* Authenticity Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>{hadith.authenticity}</span>
        </div>
      </div>

      {/* Hadith Matn (Text with Tashkeel) */}
      <div className="relative z-10 my-8 py-2">
        <blockquote
          className="font-amiri text-stone-100 leading-loose text-center sm:text-right tracking-wide selection:bg-amber-400 selection:text-stone-900"
          style={{ fontSize: `${baseFontSize}px`, lineHeight: 2.1 }}
        >
          {hadith.matn}
        </blockquote>

        {hadith.explanation && (
          <div className="mt-5 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800/40 text-stone-300 text-xs sm:text-sm leading-relaxed flex items-start gap-2.5">
            <span className="text-amber-400 font-bold shrink-0">فائدة الحديث:</span>
            <span>{hadith.explanation}</span>
          </div>
        )}
      </div>

      {/* Attribution & Metadata */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 border-t border-emerald-800/60 text-xs text-emerald-200/90">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-stone-200">الراوي من الصحابة:</strong> {hadith.narrator}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-stone-200">المصدر:</strong> {hadith.source} ({hadith.reference})
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-emerald-800/40">
        {/* Shuffle / Another Hadith */}
        <button
          onClick={onShuffle}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
          title="عرض حديث قدسي آخر"
        >
          <Shuffle className="w-4 h-4" />
          <span>حديث قدسي آخر</span>
        </button>

        {/* Right action tools: Favorite, Copy, Share */}
        <div className="flex items-center gap-2">
          {/* Favorite Toggle */}
          <button
            onClick={() => onToggleFavorite(hadith.id)}
            aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 shadow-sm'
                : 'bg-emerald-900/60 border-emerald-700/60 text-stone-200 hover:bg-emerald-800/60'
            }`}
            title={isFavorite ? 'في المفضلة' : 'أضف للمفضلة'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline">{isFavorite ? 'في المفضلة' : 'المفضلة'}</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            aria-label="نسخ نص الحديث"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/60 border border-emerald-700/60 text-stone-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            title="نسخ نص الحديث مع التخريج"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'تم النسخ!' : 'نسخ'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            aria-label="مشاركة الحديث"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/60 border border-emerald-700/60 text-stone-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            title="مشاركة الحديث"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{shareSuccess ? 'تمت المشاركة' : 'مشاركة'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
