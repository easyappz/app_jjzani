import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PhotoStats from './components/Stats/PhotoStats';
import PhotoRating from './components/Rating/PhotoRating';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/stats/:photoId" element={<PhotoStats />} />
        <Route path="/rating" element={<PhotoRating />} />
        <Route path="/" element={<div>Добро пожаловать! Выберите раздел.</div>} />
      </Routes>
    </Router>
  );
}

export default App;
