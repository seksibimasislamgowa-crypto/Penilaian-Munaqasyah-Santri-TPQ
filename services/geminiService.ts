
import { GoogleGenAI } from "@google/genai";
import { Subject, ExamScore, Santri } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateEvaluationFeedback = async (santri: Santri, scores: ExamScore['subjectScores']) => {
  if (!process.env.API_KEY) return "Sistem AI tidak terkonfigurasi.";

  const scoreSummary = Object.entries(scores)
    .map(([subject, score]) => `${subject}: ${score}`)
    .join(', ');

  const prompt = `
    Anda adalah penilai ahli Munaqasyah Santri TPQ Kementerian Agama Gowa. 
    Analisis nilai ujian santri berikut dan berikan feedback motivasi dalam Bahasa Indonesia yang singkat namun mendalam.
    
    Nama Santri: ${santri.name}
    Asal TPQ: ${santri.tpqOrigin}
    Nilai: ${scoreSummary}

    Struktur Feedback:
    1. Pujian untuk nilai tertinggi.
    2. Saran perbaikan untuk nilai terendah.
    3. Kalimat penyemangat untuk terus belajar Al-Qur'an.
    Maksimal 3-4 kalimat.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Feedback tidak dapat digenerate.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI.";
  }
};
