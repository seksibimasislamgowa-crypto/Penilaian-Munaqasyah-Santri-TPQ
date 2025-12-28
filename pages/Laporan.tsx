
import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Search } from 'lucide-react';
import { Santri, ExamScore, Subject } from '../types';
import { SUBJECT_LIST } from '../constants';

interface LaporanProps {
  santriList: Santri[];
  scores: ExamScore[];
}

const Laporan: React.FC<LaporanProps> = ({ santriList, scores }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const reportData = santriList.map(santri => {
    const scoreObj = scores.find(s => s.santriId === santri.id);
    const subScores = scoreObj?.subjectScores || {};
    // Fix: Explicitly cast Object.values to number array and type the reduce accumulator and current value to resolve arithmetic errors.
    const total = (Object.values(subScores) as (number | undefined)[]).reduce((a: number, b) => a + (b || 0), 0);
    const average = total / SUBJECT_LIST.length;
    
    return {
      ...santri,
      scores: subScores,
      total,
      average: parseFloat(average.toFixed(1)),
      isCompleted: Object.keys(subScores).length === SUBJECT_LIST.length
    };
  }).filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleExport = () => {
    alert("Fitur ekspor Excel/PDF sedang disiapkan.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Laporan Rekapitulasi Nilai</h1>
          <p className="text-sm text-gray-500">Rekapitulasi lengkap hasil Munaqasyah Santri 2025</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button 
             onClick={handleExport}
             className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-200"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Ekspor Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
           <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama santri..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-tighter">
              <tr>
                <th className="px-4 py-3 sticky left-0 bg-gray-50 z-10">Nama Santri</th>
                {SUBJECT_LIST.map(sub => (
                  <th key={sub} className="px-3 py-3 text-center">{sub}</th>
                ))}
                <th className="px-4 py-3 text-center bg-gray-100">Total</th>
                <th className="px-4 py-3 text-center bg-emerald-50 text-emerald-700">Rata-rata</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reportData.map((data) => (
                <tr key={data.id} className="hover:bg-gray-50/50 text-sm">
                  <td className="px-4 py-4 sticky left-0 bg-white font-bold text-gray-800 z-10 border-r border-gray-100">
                    {data.name}
                  </td>
                  {SUBJECT_LIST.map(sub => (
                    <td key={sub} className="px-3 py-4 text-center">
                      {data.scores[sub] !== undefined ? (
                        <span className={`font-medium ${data.scores[sub]! < 70 ? 'text-red-500' : 'text-gray-600'}`}>
                          {data.scores[sub]}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-4 text-center font-bold bg-gray-50/30 text-gray-700">{data.total}</td>
                  <td className="px-4 py-4 text-center font-black bg-emerald-50 text-emerald-600 text-base">{data.average}</td>
                  <td className="px-4 py-4 text-center">
                    {data.isCompleted ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full whitespace-nowrap">LENGKAP</span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full whitespace-nowrap">BELUM LENGKAP</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Laporan;
