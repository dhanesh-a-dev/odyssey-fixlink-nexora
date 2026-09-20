import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home/Home';
import { Discovery } from './pages/Discovery/Discovery';
import { Marketplace } from './pages/Marketplace/Marketplace';
import { Profile } from './pages/Profile/Profile';
import { Booking } from './pages/Booking/Booking';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Messages } from './pages/Messages/Messages';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AuthModal />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="discovery" element={<Discovery />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="booking/:id" element={<Booking />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
