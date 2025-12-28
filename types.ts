
export enum Subject {
  TADARRUS = 'Tadarrus',
  AYAT_PILIHAN = 'Ayat-Ayat Pilihan',
  BACAAN_SHOLAT = 'Bacaan Sholat',
  SURAH_PENDEK = 'Surah-Surah Pendek',
  DOA_HARIAN = 'Doa-Doa Harian',
  DINUL_ISLAM = 'Dinul Islam',
  KHAT = 'Khat'
}

export interface Santri {
  id: string;
  name: string;
  tpqOrigin: string;
  gender: 'L' | 'P';
  group: string;
}

export interface ExamScore {
  santriId: string;
  subjectScores: {
    [key in Subject]?: number;
  };
  examinerId: string;
  notes?: string;
  aiFeedback?: string;
  updatedAt: string;
}

export interface Examiner {
  id: string;
  name: string;
  subject: Subject;
  group: 'A' | 'B';
}
