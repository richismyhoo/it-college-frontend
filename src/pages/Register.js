import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Snackbar, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const backgroundStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 0,
  background: '#0a0618',
  overflow: 'hidden',
};

const gradient1 = {
  position: 'absolute',
  width: '36.46vw',
  height: '64.81vh',
  left: '-10.42vw',
  top: '-18.52vh',
  background: 'radial-gradient(circle at 30% 30%, #7c3aed 0%, transparent 70%)',
  filter: 'blur(3.13vw)',
  opacity: 0.7,
};
const gradient2 = {
  position: 'absolute',
  width: '31.25vw',
  height: '55.56vh',
  right: '-7.81vw',
  top: '18.52vh',
  background: 'radial-gradient(circle at 70% 30%, #2196f3 0%, transparent 70%)',
  filter: 'blur(4.17vw)',
  opacity: 0.6,
};
const gradient3 = {
  position: 'absolute',
  width: '26.04vw',
  height: '46.30vh',
  left: '50%',
  bottom: '-18.52vh',
  background: 'radial-gradient(circle at 50% 80%, #ff3c6e 0%, transparent 70%)',
  filter: 'blur(5.21vw)',
  opacity: 0.4,
  transform: 'translateX(-50%)',
};

const TOKEN_KEY = 'jwt_token';
const LIVE_UNTIL_KEY = 'jwt_live_until';
const DAY_MS = 24 * 60 * 60 * 1000;

function Register() {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!login || !email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    setError('');
    try {
      const response = await fetch('http://77.239.97.190/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: login, email, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(LIVE_UNTIL_KEY, String(Date.now() + DAY_MS));
        setSnackbar({ open: true, message: 'Регистрация успешна! Выполняется вход...', severity: 'success' });
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1000);
        return;
      } else if (response.status === 401) {
        setSnackbar({ open: true, message: 'Пользователь уже существует или ошибка авторизации', severity: 'error' });
      } else if (response.status === 500) {
        setSnackbar({ open: true, message: 'Ошибка на сервере', severity: 'error' });
      } else {
        setSnackbar({ open: true, message: data.message || 'Ошибка соединения с сервером', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Ошибка соединения с сервером', severity: 'error' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none' }}>
      {/* Космический фон */}
      <Box sx={backgroundStyle}>
        <Box sx={gradient1} />
        <Box sx={gradient2} />
        <Box sx={gradient3} />
      </Box>
      <Box sx={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper elevation={6} sx={{ p: '2.60vw', borderRadius: '0.21vw', minWidth: '17.71vw', maxWidth: '20.83vw', background: 'rgba(20,20,30,0.95)', boxShadow: '0 0.21vw 1.67vw #7c3aed33', border: '0.078vw solid #7c3aed55' }}>
          <Typography variant="h5" align="center" sx={{ mb: '1.04vh', color: '#fff', fontWeight: 800, textShadow: '0 0.104vw 0.83vw #7c3aed55' }}>
            Регистрация
          </Typography>
          {success ? (
            <Typography align="center" sx={{ color: '#7c3aed', fontWeight: 700 }}>
              Регистрация успешна! Теперь вы можете <Box component={RouterLink} to="/profile" sx={{ color: '#2196f3', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', '&:hover': { color: '#7c3aed' } }}>войти</Box>.
            </Typography>
          ) : (
            <form onSubmit={handleRegister}>
              <TextField
                label="Логин"
                variant="filled"
                fullWidth
                value={login}
                onChange={e => setLogin(e.target.value)}
                sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#aaa' }, background: 'rgba(33,33,55,0.7)', borderRadius: 2 }}
                InputLabelProps={{ style: { color: '#aaa' } }}
              />
              <TextField
                label="Email"
                type="email"
                variant="filled"
                fullWidth
                value={email}
                onChange={e => setEmail(e.target.value)}
                sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#aaa' }, background: 'rgba(33,33,55,0.7)', borderRadius: 2 }}
                InputLabelProps={{ style: { color: '#aaa' } }}
              />
              <TextField
                label="Пароль"
                type="password"
                variant="filled"
                fullWidth
                value={password}
                onChange={e => setPassword(e.target.value)}
                sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#aaa' }, background: 'rgba(33,33,55,0.7)', borderRadius: 2 }}
                InputLabelProps={{ style: { color: '#aaa' } }}
              />
              {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  py: 1.2,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  borderRadius: '2rem',
                  background: 'linear-gradient(90deg, #7c3aed 0%, #2196f3 100%)',
                  boxShadow: '0 2px 24px #7c3aed55',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #2196f3 0%, #7c3aed 100%)',
                    boxShadow: '0 4px 32px #2196f355',
                  },
                }}
              >
                Зарегистрироваться
              </Button>
              <Typography align="center" sx={{ mt: 2, color: '#fff', fontWeight: 500 }}>
                Уже есть аккаунт?
                <Box component={RouterLink} to="/profile" sx={{ color: '#7c3aed', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', ml: 1.2, display: 'inline-block', '&:hover': { color: '#2196f3' } }}>
                  Войти
                </Box>
              </Typography>
            </form>
          )}
        </Paper>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default Register; 