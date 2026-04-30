import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import GameDetail from './pages/GameDetail';
import WriteReview from './pages/WriteReview';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Activity from './pages/Activity';
import About from './pages/About';
import Members from './pages/Members';
import Contact from './pages/Contact';
import { pageBackgrounds } from './data/siteData';
import { CRITICAL_IMAGES, preloadImages } from './utils/preloadImages';

function getTheme(pathname) {
  if (pathname === '/') return 'green';
  if (pathname.startsWith('/game') || pathname.startsWith('/review')) return 'red';
  if (pathname.startsWith('/games') || pathname.startsWith('/search')) return 'blue';
  if (pathname.startsWith('/members') || pathname.startsWith('/profile') || pathname.startsWith('/library') || pathname.startsWith('/activity')) return 'cyan';
  return 'purple';
}

function Shell() {
  useEffect(() => {
    preloadImages(CRITICAL_IMAGES);
  }, []);

  const location = useLocation();
  const theme = getTheme(location.pathname);

  return (
    <div className={`app-shell theme-${theme}`} style={{ backgroundImage: `url(${pageBackgrounds[theme]})` }}>
      <div className="screen-frame">
        <Navbar />
        <main className="screen-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Search />} />
            <Route path="/search" element={<Navigate to="/games" replace />} />
            <Route path="/game/:rawgId" element={<GameDetail />} />
            <Route path="/review/:rawgId" element={<WriteReview />} />
            <Route path="/about" element={<About />} />
            <Route path="/members" element={<Members />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/library/:userId" element={<Library />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/activity" element={<Activity />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AuthProvider>
  );
}
