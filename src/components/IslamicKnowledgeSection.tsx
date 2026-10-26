/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import islamicData from '../data/islamicInfo.json';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Heart,
  Sun,
  Moon,
  Search,
  Calendar,
  CheckCircle,
  RotateCcw,
  Scale,
  Award,
} from 'lucide-react';

export const IslamicKnowledgeSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'pillars' | 'adhkar' | 'names' | 'virtues' | 'calendar'>('comparison');
  const [adhkarTab, setAdhkarTab] = useState<'morning' | 'evening'>('morning');
  const [adhkarCounts, setAdhkarCounts] = useState<Record<string, number>>({});
  const [namesSearch, setNamesSearch] = useState('');
  const [expandedPillar, setExpandedPillar] = useState<number | null>(0);
  const [expandedVirtue, setExpandedVirtue] = useState<number | null>(0);

  // Increment dhikr counter
  const handleDhikrClick = (key: string, maxCount: number) => {
    setAdhkarCounts((prev) => {
      const current = prev[key] || 0;
      if (current >= maxCount) return prev;
      return { ...prev, [key]: current + 1 };
    });
  };

  const handleResetDhikr = (key: string) => {
    setAdhkarCounts((prev) => ({ ...prev, [key]: 0 }));
  };

  // Filter 99 Names
  const filteredNames = islamicData.allahNames.filter(
    (item) =>
      item.name.includes(namesSearch.trim()) ||
      item.meaning.includes(namesSearch.trim()) ||
      item.number.toString() === namesSearch.trim()
  );

  return (
    <section className="space-y-8" id="islamic-knowledge-section">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/40">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>معارف وعلوم إسلامية</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          دليل المسلم من الأصول والآداب
        </h2>
        <p className="text-stone-600 dark:text-stone-400 text-sm">
          أركان الدين، الفروق العلمية بين الوحي والحديث، أذكار الصباح والمساء بعداد تفاعلي، وأسماء الله الحسنى.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-amber-200/50 dark:border-stone-800 max-w-4xl mx-auto">
        {[
          { id: 'comparison', label: 'القرآن والقدسي والنبوي', icon: Scale },
          { id: 'pillars', label: 'أركان الإسلام والإيمان', icon: Award },
          { id: 'adhkar', label: 'أذكار الصباح والمساء', icon: Sun },
          { id: 'names', label: 'أسماء الله الحسنى (99)', icon: Heart },
          { id: 'virtues', label: 'آداب وفضائل الأعمال', icon: BookOpen },
          { id: 'calendar', label: 'تقويم المناسبات الفاضلة', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-stone-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-emerald-600'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Comparison between Quran, Hadith Qudsi, and Hadith Nabawi */}
      {activeTab === 'comparison' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/50 dark:border-stone-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-cairo">
              الفرق بين القرآن الكريم والحديث القدسي والحديث النبوي
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              جدول تحليلي وتأصيلي يوضح الفروق الجوهرية الستة المعتمدة عند أئمة أصول الفقه وعلوم الحديث:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-emerald-700/60 bg-emerald-50/60 dark:bg-emerald-950/40 text-stone-900 dark:text-stone-100">
                  <th className="py-3 px-4 font-bold text-emerald-900 dark:text-emerald-200 w-1/4">وجه المقارنة</th>
                  <th className="py-3 px-4 font-bold text-emerald-800 dark:text-emerald-300 w-1/4">القرآن الكريم</th>
                  <th className="py-3 px-4 font-bold text-amber-800 dark:text-amber-400 w-1/4">الحديث القدسي</th>
                  <th className="py-3 px-4 font-bold text-teal-800 dark:text-teal-300 w-1/4">الحديث النبوي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {islamicData.comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/40 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-stone-900 dark:text-stone-100 bg-stone-50/50 dark:bg-stone-800/40">
                      {row.aspect}
                    </td>
                    <td className="py-4 px-4 text-stone-700 dark:text-stone-300 leading-relaxed">
                      {row.quran}
                    </td>
                    <td className="py-4 px-4 text-stone-700 dark:text-stone-300 leading-relaxed font-medium bg-amber-50/20 dark:bg-amber-950/20">
                      {row.qudsi}
                    </td>
                    <td className="py-4 px-4 text-stone-700 dark:text-stone-300 leading-relaxed">
                      {row.nabawi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Pillars of Islam & Iman */}
      {activeTab === 'pillars' && (
        <div className="space-y-6">
          {/* Pillars of Islam */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/50 dark:border-stone-800 space-y-4">
            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-200 font-cairo flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>أركان الإسلام الخمسة (الأعمال الظاهرة)</span>
            </h3>

            <div className="space-y-3">
              {islamicData.islamPillars.map((p, idx) => {
                const isExpanded = expandedPillar === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedPillar(isExpanded ? null : idx)}
                      className="w-full flex items-center justify-between p-4 bg-stone-50/60 dark:bg-stone-800/50 text-right font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 hover:bg-emerald-50/50 dark:hover:bg-stone-800 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{p.title}</span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-white dark:bg-stone-900 space-y-3 text-xs sm:text-sm border-t border-stone-100 dark:border-stone-800 animate-fadeIn">
                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                          {p.summary}
                        </p>
                        <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-stone-800/60 border border-amber-200/50 dark:border-stone-700 text-amber-900 dark:text-amber-200 text-xs">
                          <strong>الدليل:</strong> {p.evidence}
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-stone-600 dark:text-stone-400">
                          {p.details.map((d, dIdx) => (
                            <li key={dIdx}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pillars of Iman */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/50 dark:border-stone-800 space-y-4">
            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-200 font-cairo flex items-center gap-2">
              <Heart className="w-5 h-5 text-amber-500" />
              <span>أركان الإيمان الستة (الاعتقاد الباطن)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {islamicData.imanPillars.map((p, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-5 border border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-800/40 space-y-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                      {p.title}
                    </h4>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {p.summary}
                  </p>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                    {p.evidence}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Morning and Evening Adhkar with Interactive Counter */}
      {activeTab === 'adhkar' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/50 dark:border-stone-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-cairo">
                أذكار المسلم اليومية مع عداد التسبيح التفاعلي
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                انقر على بطاقة الذكر لاحتساب التكرار ومتابعة إتمام الورد اليومي.
              </p>
            </div>

            {/* Morning vs Evening switcher */}
            <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
              <button
                onClick={() => setAdhkarTab('morning')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  adhkarTab === 'morning'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>أذكار الصباح</span>
              </button>
              <button
                onClick={() => setAdhkarTab('evening')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  adhkarTab === 'evening'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>أذكار المساء</span>
              </button>
            </div>
          </div>

          {/* Adhkar Cards */}
          <div className="space-y-4">
            {(adhkarTab === 'morning' ? islamicData.morningAdhkar : islamicData.eveningAdhkar).map((dhikr) => {
              const key = `${adhkarTab}-${dhikr.id}`;
              const current = adhkarCounts[key] || 0;
              const isFinished = current >= dhikr.count;

              return (
                <div
                  key={key}
                  className={`rounded-2xl p-5 border transition-all ${
                    isFinished
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/60'
                      : 'bg-stone-50/40 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Text */}
                    <div className="space-y-2 flex-1">
                      <p className="font-amiri text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-relaxed font-semibold">
                        {dhikr.text}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                          <strong>الفضل:</strong> {dhikr.reward}
                        </span>
                        <span>·</span>
                        <span>{dhikr.reference}</span>
                      </div>
                    </div>

                    {/* Interactive Counter Button */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleDhikrClick(key, dhikr.count)}
                        disabled={isFinished}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer active:scale-95 ${
                          isFinished
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                        }`}
                        title="انقر لزيادة العداد"
                      >
                        {isFinished ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-amber-300" />
                            <span>اكتمل ({current}/{dhikr.count})</span>
                          </>
                        ) : (
                          <>
                            <span>كرر:</span>
                            <span dir="ltr" className="font-mono font-black text-amber-300">
                              {current} / {dhikr.count}
                            </span>
                          </>
                        )}
                      </button>

                      {current > 0 && (
                        <button
                          onClick={() => handleResetDhikr(key)}
                          className="p-2 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:text-stone-900"
                          title="إعادة ضبط هذا الذكر"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: 99 Names of Allah */}
      {activeTab === 'names' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/50 dark:border-stone-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-cairo">
                أسماء الله الحسنى الـ 99 مع معانيها
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                قال ﷺ: «إِنَّ لِلَّهِ تِسْعَةً وَتِسْعِينَ اسْمًا مِائَةً إِلَّا وَاحِدًا، مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ» (متفق عليه).
              </p>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={namesSearch}
                onChange={(e) => setNamesSearch(e.target.value)}
                placeholder="ابحث في الأسماء والمعاني..."
                className="w-full pr-9 pl-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {filteredNames.map((item) => (
              <div
                key={item.number}
                className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:border-amber-400/50 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-scheherazade text-xl sm:text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                    #{item.number}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {item.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Virtues & Etiquette */}
      {activeTab === 'virtues' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/50 dark:border-stone-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-cairo">
              آداب وفضائل العبادات الإسلامية
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              فضائل الصلاة والصيام والصدقة وشروط إجابة الدعاء وآدابه المستحبة.
            </p>
          </div>

          <div className="space-y-4">
            {islamicData.virtuesAndEtiquette.map((v, idx) => {
              const isExpanded = expandedVirtue === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedVirtue(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between p-4 bg-stone-50/60 dark:bg-stone-800/50 text-right font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 hover:bg-emerald-50/50 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    <span>{v.category}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 animate-fadeIn">
                      <ul className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                        {v.items.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold">✦</span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: Islamic Calendar Events */}
      {activeTab === 'calendar' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/50 dark:border-stone-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-cairo">
              تقويم الأيام الفاضلة والمناسبات الإسلامية
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              المواسم الفاضلة التي يستحب فيها مضاعفة الطاعات والصيام والذكر على مدار العام الهجري.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {islamicData.islamicCalendarEvents.map((event, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-800/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm sm:text-base">
                    {event.occasion}
                  </h4>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300/40">
                    {event.timing}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {event.virtue}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
