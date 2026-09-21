import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Browse from './pages/Browse.jsx';
import ListingDetails from './pages/ListingDetails.jsx';
import Sell from './pages/Sell.jsx';
import Messages from './pages/Messages.jsx';
import Profile from './pages/Profile.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      {/* pb-20 keeps content clear of the mobile bottom bar */}
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-6 md:pb-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
          <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute admin><Admin /></ProtectedRoute>} />
          <Route path="*" element={<p className="py-20 text-center text-slate-500">Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
