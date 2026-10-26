/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeArabicText, filterHadiths, getDailyHadith } from './hadithFilters';
import { Hadith } from '../types';

const mockHadiths: Hadith[] = [
  {
    id: 1,
    title: 'تحريم الظلم بين العباد',
    category: 'حسن الخلق والعدل',
    matn: 'يَا عِبَادِي إِنِّي حَرَّمْتُ الظُّلْمَ عَلَى نَفْسِي',
    narrator: 'أبو ذر الغفاري',
    source: 'صحيح مسلم',
    reference: 'رقم 2577',
    authenticity: 'صحيح',
  },
  {
    id: 2,
    title: 'فضل الذكر',
    category: 'الذكر والدعاء',
    matn: 'أَنَا عِنْدَ ظَنِّ عَبْدِي بِي',
    narrator: 'أبو هريرة',
    source: 'صحيح البخاري',
    reference: 'رقم 7405',
    authenticity: 'صحيح',
  },
];

test('normalizeArabicText strips diacritics and unifies letters', () => {
  assert.equal(normalizeArabicText('الظُّلْمَ'), 'الظلم');
  assert.equal(normalizeArabicText('أَبُو هُرَيْرَةَ'), 'ابو هريره');
  assert.equal(normalizeArabicText('عَلَى'), 'علي');
});

test('filterHadiths searches accurately regardless of tashkeel', () => {
  const result = filterHadiths(mockHadiths, { query: 'الظلم' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 1);
});

test('filterHadiths matches even when search query has or lacks Al- prefix', () => {
  const result = filterHadiths(mockHadiths, { query: 'ذكر' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 2);
});

test('filterHadiths filters by category', () => {
  const result = filterHadiths(mockHadiths, { category: 'الذكر والدعاء' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 2);
});

test('filterHadiths filters favorites only', () => {
  const result = filterHadiths(mockHadiths, { favoritesOnly: true, favoriteIds: [2] });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 2);
});

test('getDailyHadith selects a stable hadith for a given day', () => {
  const d1 = new Date('2026-05-15');
  const d2 = new Date('2026-05-15');
  const h1 = getDailyHadith(mockHadiths, d1);
  const h2 = getDailyHadith(mockHadiths, d2);
  assert.equal(h1?.id, h2?.id);
});
