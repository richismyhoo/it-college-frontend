import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import Register from './pages/Register';
import OfflineCollege from './pages/OfflineCollege';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Manrope, "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function FooterController() {
  const location = useLocation();
  const isProfile = location.pathname === '/profile';
  const isRegister = location.pathname === '/register';
  const hasToken = Boolean(localStorage.getItem('jwt_token'));
  // Показываем футер, если не на /profile или /register, либо если на /profile и токен есть
  if ((isProfile && !hasToken) || isRegister) return null;
  return <Footer />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/offline" element={<OfflineCollege />} />
            </Routes>
          </main>
          <FooterController />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 