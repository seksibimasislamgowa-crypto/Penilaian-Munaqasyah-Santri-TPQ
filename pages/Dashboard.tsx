
import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Award,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Santri, ExamScore, Subject } from '../types';
import { SUBJECT_LIST } from '../constants';

interface DashboardProps {
  santriList: Santri[];
  scores: ExamScore[];
}

const Dashboard: React.FC<DashboardProps> = ({ santriList, scores }) => {
  const totalSantri = santriList.length;
  const gradedCount = scores.length;
  const pendingCount = totalSantri - gradedCount;
  
  // Fix: Explicitly typed the accumulator and return value for the average score calculation to resolve arithmetic type errors.
  const averageScore = scores.length > 0 
    ? (scores.reduce((acc: number, curr: ExamScore) => {
        const s = Object.values(curr.subjectScores) as (number | undefined)[];
        const sum = s.reduce((a: number, b) => a + (b || 0), 0);
        return acc + (sum / SUBJECT_LIST.length);
      }, 0) / scores.length).toFixed(1)
    : 0;

  const chartData = SUBJECT_LIST.map(subject => {
    const subScores = scores.map(s => s.subjectScores[subject] || 0).filter(v => v > 0);
    const avg = subScores.length > 0 
      ? subScores.reduce((a, b) => a + b, 0) / subScores.length 
      : 0;
    return { name: subject, avg: parseFloat(avg.toFixed(1)) };
  });

  const colors = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#064e3b', '#065f46'];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Ahlan wa Sahlan, Panitia!</h1>
        <p className="text-emerald-100 opacity-90 max-w-xl">
          Selamat datang di panel monitoring hasil munaqasyah santri TPQ Kemenag Kabupaten Gowa Tahun 2025. 
          Berikut adalah ringkasan data terbaru.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Santri', value: totalSantri, icon: Users, color: 'bg-blue-500' },
          { label: 'Sudah Dinilai', value: gradedCount, icon: CheckCircle2, color: 'bg-emerald-500' },
          { label: 'Belum Dinilai', value: pendingCount, icon: Clock, color: 'bg-amber-500' },
          { label: 'Rata-rata Nilai', value: averageScore, icon: Award, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-xl text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Rata-rata Nilai Per Kategori
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">LIVE UPDATE</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10 }}
                  interval={0}
                />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="avg" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Links / Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Info Materi Ujian
          </h3>
          <div className="space-y-4">
            {SUBJECT_LIST.map((sub, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-emerald-50 transition-colors group cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-400 group-hover:text-emerald-600 group-hover:border-emerald-200">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{sub}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
