
import React, { useState } from 'react';
import { Save, User, BookOpen, Sparkles, CheckCircle, Search, ClipboardCheck, ShieldCheck } from 'lucide-react';
import { Santri, Subject, ExamScore, Examiner } from '../types';
import { SUBJECT_LIST } from '../constants';
import { generateEvaluationFeedback } from '../services/geminiService';

interface PenilaianProps {
  santriList: Santri[];
  examiners: Examiner[];
  onSaveScore: (score: ExamScore) => void;
  existingScores: ExamScore[];
}

const Penilaian: React.FC<PenilaianProps> = ({ santriList, examiners, onSaveScore, existingScores }) => {
  const [selectedSantriId, setSelectedSantriId] = useState<string>('');
  const [selectedExaminerId, setSelectedExaminerId] = useState<string>('');
  const [currentScores, setCurrentScores] = useState<Record<string, number>>({});
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedSantri = santriList.find(s => s.id === selectedSantriId);

  const handleScoreChange = (subject: Subject, value: string) => {
    const num = parseInt(value) || 0;
    const clamped = Math.min(100, Math.max(0, num));
    setCurrentScores(prev => ({ ...prev, [subject]: clamped }));
  };

  const handleSelectSantri = (id: string) => {
    setSelectedSantriId(id);
    const existing = existingScores.find(s => s.santriId === id);
    if (existing) {
      setCurrentScores(existing.subjectScores as Record<string, number>);
      setAiFeedback(existing.aiFeedback || '');
      setSelectedExaminerId(existing.examinerId || '');
    } else {
      setCurrentScores({});
      setAiFeedback('');
      setSelectedExaminerId('');
    }
  };

  const handleGenerateAI = async () => {
    if (!selectedSantri) return;
    setIsGeneratingAI(true);
    const feedback = await generateEvaluationFeedback(selectedSantri, currentScores as any);
    setAiFeedback(feedback);
    setIsGeneratingAI(false);
  };

  const handleSave = () => {
    if (!selectedSantriId) return;
    if (!selectedExaminerId) {
      alert("Harap pilih penguji terlebih dahulu!");
      return;
    }
    onSaveScore({
      santriId: selectedSantriId,
      subjectScores: currentScores as any,
      examinerId: selectedExaminerId,
      updatedAt: new Date().toISOString(),
      aiFeedback: aiFeedback
    });
    alert(`Nilai untuk ${selectedSantri?.name} berhasil disimpan!`);
  };

  const filteredSantri = santriList.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">
      {/* Sidebar: Santri Selection */}
      <div className="lg:col-span-4 flex flex-col gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-full">
        <h3 className="font-bold flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-600" />
          Pilih Santri
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari santri..." 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
          {filteredSantri.map(s => {
            const hasScore = existingScores.some(sc => sc.santriId === s.id);
            return (
              <button
                key={s.id}
                onClick={() => handleSelectSantri(s.id)}
                className={`
                  w-full text-left p-3 rounded-xl transition-all flex items-center justify-between
                  ${selectedSantriId === s.id 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'hover:bg-emerald-50 text-gray-700'}
                `}
              >
                <div>
                  <p className="font-bold text-sm leading-none mb-1">{s.name}</p>
                  <p className={`text-[10px] ${selectedSantriId === s.id ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {s.tpqOrigin}
                  </p>
                </div>
                {hasScore && <CheckCircle className={`w-4 h-4 ${selectedSantriId === s.id ? 'text-emerald-200' : 'text-emerald-500'}`} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Panel: Scoring Form */}
      <div className="lg:col-span-8 flex flex-col gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-y-auto custom-scrollbar">
        {!selectedSantriId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-60">
            <ClipboardCheck className="w-20 h-20 mb-4 stroke-1" />
            <p className="text-lg font-medium">Pilih santri dari daftar untuk memulai penilaian</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedSantri?.name}</h2>
                <p className="text-sm text-gray-500">Kelompok {selectedSantri?.group} • {selectedSantri?.tpqOrigin}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  <select 
                    className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none w-full sm:w-48 appearance-none"
                    value={selectedExaminerId}
                    onChange={(e) => setSelectedExaminerId(e.target.value)}
                  >
                    <option value="">Pilih Penguji</option>
                    {examiners.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name} ({ex.subject})</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={handleSave}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all"
                >
                  <Save className="w-5 h-5" />
                  Simpan Nilai
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {SUBJECT_LIST.map((subject, idx) => (
                <div key={subject} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center bg-emerald-50 text-emerald-700 rounded-lg text-xs">{idx + 1}</span>
                      {subject}
                    </label>
                    <span className="text-xs text-gray-400">Range 0-100</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      placeholder="Input nilai..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-bold text-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-center"
                      value={currentScores[subject] || ''}
                      onChange={(e) => handleScoreChange(subject, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Analysis Section */}
            <div className="mt-8 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 border-dashed relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="w-12 h-12 text-indigo-500/10" />
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 p-2 rounded-xl">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-indigo-900">Analisis Performa (AI Assistant)</h4>
                </div>
                <button 
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI || Object.keys(currentScores).length === 0}
                  className="bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingAI ? 'Menganalisis...' : 'Generate Review'}
                </button>
              </div>

              {aiFeedback ? (
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-100 animate-in fade-in duration-500">
                  <p className="text-gray-700 text-sm italic leading-relaxed">
                    "{aiFeedback}"
                  </p>
                </div>
              ) : (
                <p className="text-sm text-indigo-400">
                  Klik tombol di samping untuk mendapatkan analisis otomatis dan kalimat motivasi berbasis AI untuk santri ini.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Penilaian;
