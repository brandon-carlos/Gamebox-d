// frontend/src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar        from './components/Navbar';
import Home          from './pages/Home';
import Login         from './pages/Login';
import Signup        from './pages/Signup';
import Search        from './pages/Search';
import GameDetail    from './pages/GameDetail';
import WriteReview   from './pages/WriteReview';
import Library       from './pages/Library';
import Profile       from './pages/Profile';
import Activity      from './pages/Activity';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"                 element={<Home />} />
          <Route path="/login"            element={<Login />} />
          <Route path="/signup"           element={<Signup />} />
          <Route path="/search"           element={<Search />} />
          <Route path="/game/:rawgId"     element={<GameDetail />} />
          <Route path="/review/:rawgId"   element={<WriteReview />} />
          <Route path="/library/:userId"  element={<Library />} />
          <Route path="/profile/:userId"  element={<Profile />} />
          <Route path="/activity"         element={<Activity />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
