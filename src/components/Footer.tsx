/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, BookOpen, Clock, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavClick: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="mt-20 border-t border-amber-200/50 dark:border-stone-800 bg-white/70 dark:bg-stone-900/80 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 text-center md:text-right">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-scheherazade text-2xl font-bold shadow-xs">
              ذ
            </div>
            <div>
              <span className="text-xl font-black font-cairo text-emerald-950 dark:text-emerald-100">
                منصة ذِكْـر
              </span>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                تذكير المسلم بالأحاديث القدسية الصحيحة ومواقيت الصلاة
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-stone-600 dark:text-stone-300">
            <button
              onClick={() => onNavClick('home')}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              الرئيسية
            </button>
            <button
              onClick={() => onNavClick('hadiths')}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              مكتبة الأحاديث القدسية
            </button>
            <button
              onClick={() => onNavClick('prayer')}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              مواقيت الصلاة
            </button>
            <button
              onClick={() => onNavClick('knowledge')}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              معارف وأذكار
            </button>
            <button
              onClick={() => onNavClick('about')}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              عن الموقع والمنهج
            </button>
          </div>
        </div>

        {/* Bottom copyright and du'aa */}
        <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500 dark:text-stone-400">
          <p>
            جميع الأحاديث المضمنة مستقاة من الصحيحين أو ما صححه أئمة الحديث المعتبرون.
          </p>
          <div className="flex items-center gap-1.5">
            <span>جُعل هذا العمل خالصاً لوجه الله الكريم</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
