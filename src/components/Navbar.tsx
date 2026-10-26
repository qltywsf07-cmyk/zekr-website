/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Moon, Sun, BookOpen, Clock, Sparkles, Info, Heart, Menu, X, Plus, Minus, RotateCcw } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  setIsDark: (val: boolean | ((prev: boolean) => boolean)) => void;
  fontSizeOffset: number;
  setFontSizeOffset: (val: number | ((prev: number) => number)) => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  fontSizeOffset,
  setFontSizeOffset,
  favoritesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Sparkles },
    { id: 'hadiths', label: 'الأحاديث القدسية', icon: BookOpen },
    { id: 'prayer', label: 'مواقيت الصلاة', icon: Clock },
    { id: 'knowledge', label: 'معارف إسلامية', icon: Sparkles },
    { id: 'about', label: 'عن الموقع', icon: Info },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-amber-50/90 dark:bg-stone-900/90 border-b border-amber-200/50 dark:border-stone-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            title="منصة ذِكر"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-amber-300 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-amber-400/30">
              <span className="font-scheherazade text-2xl sm:text-3xl font-bold leading-none mb-1">
                ذ
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black font-cairo text-emerald-900 dark:text-emerald-100 tracking-tight">
                  ذِكْـر
                </span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300/40">
                  الأحاديث القدسية
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium hidden sm:block">
                موقع إسلامي للتذكير بالأحاديث النبوية القدسية الصحيحة
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100/70 dark:hover:bg-stone-800 hover:text-emerald-800 dark:hover:text-emerald-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: Font Size, Favorites badge, Dark Mode, Mobile menu */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Font Resizer Control */}
            <div className="hidden sm:flex items-center gap-0.5 bg-stone-100 dark:bg-stone-800/80 rounded-lg p-1 border border-stone-200 dark:border-stone-700" title="تغيير حجم خط الأحاديث">
              <button
                onClick={() => setFontSizeOffset((prev) => Math.max(-4, prev - 2))}
                aria-label="تصغير الخط"
                className="p-1 rounded text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700 hover:text-emerald-700 transition-colors"
                title="تصغير حجم الخط"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFontSizeOffset(0)}
                aria-label="الحجم الافتراضي"
                className="px-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-emerald-600"
                title="إعادة ضبط حجم الخط"
              >
                خط
              </button>
              <button
                onClick={() => setFontSizeOffset((prev) => Math.min(8, prev + 2))}
                aria-label="تكبير الخط"
                className="p-1 rounded text-stone-600 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-700 hover:text-emerald-700 transition-colors"
                title="تكبير حجم الخط"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Favorites shortcut */}
            <button
              onClick={() => {
                setActiveTab('hadiths');
                // Will trigger favorites view in Hadith section
                const event = new CustomEvent('openFavorites');
                window.dispatchEvent(event);
              }}
              aria-label={`المفضلة (${favoritesCount})`}
              className="relative p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800 transition-colors"
              title="عرض الأحاديث المفضلة"
            >
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={isDark ? 'التحويل للوضع النهاري' : 'التحويل للوضع الليلي'}
              className="p-2 rounded-lg text-stone-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-stone-800 transition-colors"
              title={isDark ? 'التحويل للوضع النهاري' : 'التحويل للوضع الليلي'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="فتح القائمة الرئيسية"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 rounded-lg text-stone-700 dark:text-stone-200 hover:bg-amber-100 dark:hover:bg-stone-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-amber-200/50 dark:border-stone-800 animate-fadeIn">
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-emerald-700 text-white'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-emerald-600 dark:text-emerald-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            {/* Mobile Font Size Adjuster */}
            <div className="mt-3 pt-3 border-t border-amber-200/50 dark:border-stone-800 flex items-center justify-between px-4 text-xs text-stone-600 dark:text-stone-400">
              <span>حجم خط قراءة الأحاديث:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSizeOffset((prev) => Math.max(-4, prev - 2))}
                  className="px-2.5 py-1 rounded bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                >
                  أصغر -
                </button>
                <button
                  onClick={() => setFontSizeOffset(0)}
                  className="px-2 py-1 rounded bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                >
                  افتراضي
                </button>
                <button
                  onClick={() => setFontSizeOffset((prev) => Math.min(8, prev + 2))}
                  className="px-2.5 py-1 rounded bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                >
                  أكبر +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
