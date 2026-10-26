/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Info,
  ShieldCheck,
  BookOpen,
  Mail,
  Send,
  Heart,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [senderName, setSenderName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback('');
      setSenderName('');
    }, 3500);
  };

  return (
    <section className="space-y-8" id="about-section">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/40">
          <Info className="w-3.5 h-3.5" />
          <span>عن منصة ذِكر</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          الهدف والمنهج والأمانة العلمية
        </h2>
        <p className="text-stone-600 dark:text-stone-400 text-sm">
          مشروع تقني دعوي غير ربحي يسعى لتقريب كلام رب العزة إلى قلوب المسلمين وتيسير حفظه والتأمل فيه.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Purpose Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-200/50 dark:border-stone-800 space-y-4">
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-cairo flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>الهدف من المشروع</span>
            </h3>
            <p className="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
              انطلقت فكرة منصة <strong>«ذِكْـر»</strong> استشعاراً لحاجة المسلم المعاصر إلى محطة روحية نقية تربطه بمناجاة ربه وكلامه القدسي الجليل، بعيداً عن الغثاء أو الأحاديث الضعيفة والموضوعة المنتشرة في الفضاء الرقمي.
            </p>
            <p className="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
              نهدف إلى:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>نشر الأحاديث القدسية الصحيحة:</strong> الاقتصار على ما ثبت في الصحيحين وما صححه أئمة الحديث المعتبرون عند أهل السنة والجماعة.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong>تيسير العبادة والذكر:</strong> تذكير بالصلاة بمواقيتها الدقيقة وعرض العد التنازلي المباشر لها حسب كل مدينة ودولة.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>التثقيف والتأصيل الشرعي:</strong> تبسيط الفروق بين مصادر الوحي (القرآن والقدسي والنبوي) مع أذكار الصباح والمساء وأسماء الله الحسنى.
                </span>
              </li>
            </ul>
          </div>

          {/* Scientific Caution & Scholar Reference Alert */}
          <div className="bg-amber-50/90 dark:bg-amber-950/30 rounded-3xl p-6 sm:p-8 border border-amber-300/80 dark:border-amber-800/60 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>تنبيه شرعي وأمانة علمية</span>
            </div>
            <p className="text-stone-800 dark:text-stone-200 text-xs sm:text-sm leading-relaxed">
              هذه المنصة وسيلة للتذكير والمطالعة المبدئية، وليست مرجعاً بديلاً عن مجالس العلماء أو أمهات كتب الفقه وشروح الحديث (كفتح الباري لابن حجر، وشرح صحيح مسلم للنووي، وجامع العلوم والحكم لابن رجب).
            </p>
            <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed font-semibold">
              ندعو جميع الإخوة والأخوات الكرام إلى مراجعة أهل العلم وكتب السلف عند استنباط الأحكام الفقهية أو البحث في دقائق العقيدة والتفسير.
            </p>
          </div>
        </div>

        {/* Contact and Feedback Form */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-amber-200/50 dark:border-stone-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-lg font-cairo">
              <Mail className="w-5 h-5" />
              <span>تواصل واقتراحات</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              إذا لاحظت خطأً طباعياً، أو رغبت في اقتراح حديث قدسي صحيح لإضافته مع توثيقه، فنرحب بمراسلتك.
            </p>

            {submitted ? (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                <h4 className="font-bold text-sm">جزاك الله خيراً!</h4>
                <p className="text-xs">تم استلام رسالتك واقتراحك وسيتم مراجعته بعناية إن شاء الله.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    الاسم أو الكنية (اختياري):
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="فاعل خير"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    رسالتك أو اقتراح الحديث ومصدره:
                  </label>
                  <textarea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                    placeholder="اكتب ملاحظتك، تصويبك، أو اقتراحك هنا..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm active:scale-98"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>إرسال الرسالة</span>
                </button>
              </form>
            )}
          </div>

          <div className="pt-6 border-t border-stone-100 dark:border-stone-800 mt-6 text-center text-xs text-stone-500 dark:text-stone-400">
            <p>مشروع خالص لوجه الله تعالى</p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
              لا تنسونا ووالدينا من صالح دعائكم
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
