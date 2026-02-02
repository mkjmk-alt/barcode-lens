import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { ScanPage } from './pages/ScanPage';
import { GeneratePage } from './pages/GeneratePage';
import { TestPage } from './pages/TestPage';
import { ComparePage } from './pages/ComparePage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            {/* Swapped default to GeneratePage to match the new dashboard feel */}
            <Route path="/" element={<GeneratePage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/compare" element={<ComparePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
