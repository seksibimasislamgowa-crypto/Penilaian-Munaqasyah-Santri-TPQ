
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SantriManagement from './pages/SantriManagement';
import Penilaian from './pages/Penilaian';
import Laporan from './pages/Laporan';
import { Santri, ExamScore, Examiner } from './types';
import { INITIAL_SANTRI, INITIAL_EXAMINERS } from './constants';

const App: React.FC = () => {
  const [santriList, setSantriList] = useState<Santri[]>(INITIAL_SANTRI);
  const [scores, setScores] = useState<ExamScore[]>([]);
  const [examiners] = useState<Examiner[]>(INITIAL_EXAMINERS);

  // Local Storage persistence
  useEffect(() => {
    const savedSantri = localStorage.getItem('munaqasyah_santri');
    const savedScores = localStorage.getItem('munaqasyah_scores');
    if (savedSantri) setSantriList(JSON.parse(savedSantri));
    if (savedScores) setScores(JSON.parse(savedScores));
  }, []);

  useEffect(() => {
    localStorage.setItem('munaqasyah_santri', JSON.stringify(santriList));
    localStorage.setItem('munaqasyah_scores', JSON.stringify(scores));
  }, [santriList, scores]);

  const addScore = (newScore: ExamScore) => {
    setScores(prev => {
      const existing = prev.findIndex(s => s.santriId === newScore.santriId);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = {
          ...updated[existing],
          subjectScores: { ...updated[existing].subjectScores, ...newScore.subjectScores },
          examinerId: newScore.examinerId,
          updatedAt: new Date().toISOString()
        };
        return updated;
      }
      return [...prev, newScore];
    });
  };

  const addSantri = (newSantri: Santri) => {
    setSantriList(prev => [...prev, newSantri]);
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard santriList={santriList} scores={scores} />} />
          <Route path="/santri" element={<SantriManagement santriList={santriList} onAddSantri={addSantri} />} />
          <Route path="/penilaian" element={<Penilaian santriList={santriList} examiners={examiners} onSaveScore={addScore} existingScores={scores} />} />
          <Route path="/laporan" element={<Laporan santriList={santriList} scores={scores} />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
