import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Teachers } from './pages/Teachers';
import { Gallery } from './pages/Gallery';
import { News } from './pages/News';
import { Admin } from './pages/Admin';
import { ChatAssistant } from './components/ChatAssistant';
import { DataProvider } from './context/DataContext';

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/news" element={<News />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
        <ChatAssistant />
      </HashRouter>
    </DataProvider>
  );
};

export default App;