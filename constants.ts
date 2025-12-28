
import { Subject, Santri, Examiner } from './types';

export const SUBJECT_LIST: Subject[] = [
  Subject.TADARRUS,
  Subject.AYAT_PILIHAN,
  Subject.BACAAN_SHOLAT,
  Subject.SURAH_PENDEK,
  Subject.DOA_HARIAN,
  Subject.DINUL_ISLAM,
  Subject.KHAT,
];

export const INITIAL_EXAMINERS: Examiner[] = [
  // Group A
  { id: 'E1', name: 'Ust. A', subject: Subject.TADARRUS, group: 'A' },
  { id: 'E2', name: 'Ust. S', subject: Subject.AYAT_PILIHAN, group: 'A' },
  { id: 'E3', name: 'Ust. D', subject: Subject.BACAAN_SHOLAT, group: 'A' },
  { id: 'E4', name: 'Ust. F', subject: Subject.SURAH_PENDEK, group: 'A' },
  { id: 'E5', name: 'Ust. G', subject: Subject.DOA_HARIAN, group: 'A' },
  { id: 'E6', name: 'Ust. H', subject: Subject.DINUL_ISLAM, group: 'A' },
  { id: 'E7', name: 'Ust. J', subject: Subject.KHAT, group: 'A' },
  // Group B
  { id: 'E8', name: 'Ust. Z', subject: Subject.TADARRUS, group: 'B' },
  { id: 'E9', name: 'Ust. X', subject: Subject.AYAT_PILIHAN, group: 'B' },
  { id: 'E10', name: 'Ust. C', subject: Subject.BACAAN_SHOLAT, group: 'B' },
  { id: 'E11', name: 'Ust. V', subject: Subject.SURAH_PENDEK, group: 'B' },
  { id: 'E12', name: 'Ust. B', subject: Subject.DOA_HARIAN, group: 'B' },
  { id: 'E13', name: 'Ust. N', subject: Subject.DINUL_ISLAM, group: 'B' },
  { id: 'E14', name: 'Ust. M', subject: Subject.KHAT, group: 'B' },
];

export const INITIAL_SANTRI: Santri[] = [
  { id: 'S1', name: 'Abdullah', tpqOrigin: 'TPQ Nurul Huda', gender: 'L', group: 'A' },
  { id: 'S2', name: 'Budi Santoso', tpqOrigin: 'TPQ Al-Ikhlas', gender: 'L', group: 'A' },
  { id: 'S3', name: 'Citra Dewi', tpqOrigin: 'TPQ Baitul Hikmah', gender: 'P', group: 'A' },
  { id: 'S4', name: 'Dina Maria', tpqOrigin: 'TPQ Ar-Raudhah', gender: 'P', group: 'A' },
  { id: 'S5', name: 'Fikri Haikal', tpqOrigin: 'TPQ As-Salam', gender: 'L', group: 'A' },
  { id: 'S6', name: 'Ganis Putri', tpqOrigin: 'TPQ Al-Istiqomah', gender: 'P', group: 'A' },
  { id: 'S7', name: 'Hamdan Syukur', tpqOrigin: 'TPQ Hidayatullah', gender: 'L', group: 'A' },
];
