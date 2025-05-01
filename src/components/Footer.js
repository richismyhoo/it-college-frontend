import React from 'react';
import { Box, Typography, Link, Container, Stack, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';

const year = new Date().getFullYear();

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 6,
        background: 'linear-gradient(0deg, #232336 90%, #7c3aed22 100%)',
        color: '#fff',
        boxShadow: '0 -2px 24px #7c3aed33',
        zIndex: 20,
      }}
    >
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={3}>
          <Stack direction="column" spacing={3} alignItems={{ xs: 'center', md: 'flex-start' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
              <Link href="/" underline="hover" color="inherit" sx={{ fontWeight: 700, fontSize: '1.05rem', '&:hover': { color: '#7c3aed' } }}>Главная</Link>
              <Link href="/courses" underline="hover" color="inherit" sx={{ fontWeight: 700, fontSize: '1.05rem', '&:hover': { color: '#2196f3' } }}>Курсы</Link>
              <Link href="/offline" underline="hover" color="inherit" sx={{ fontWeight: 700, fontSize: '1.05rem', '&:hover': { color: '#ff3c6e' } }}>Офлайн Колледж</Link>
              <Link href="/profile" underline="hover" color="inherit" sx={{ fontWeight: 700, fontSize: '1.05rem', '&:hover': { color: '#ff3c6e' } }}>Личный кабинет</Link>
            </Stack>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.85rem',
                maxWidth: '600px',
                textAlign: { xs: 'center', md: 'left' },
                lineHeight: 1.6
              }}
            >
              Настоящий веб-сайт является учебным проектом, выполненным в рамках дипломной работы студентом: Леонтьев Сергей ИСП3-О/СПОо/ЧБ21 ЧКИ РУК. Все представленные на сайте данные, включая имена преподавателей, отзывы и географические локации, являются вымышленными и не имеют отношения к реальности. Указаный адрес: Улица Бармалеева 14 был выбран случайным образом и не несет никакой смысловой или референциальной нагрузки. Любые совпадения с реальными людьми или организациями случайны.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton href="https://github.com/richismyhoo" target="_blank" rel="noopener" sx={{ color: '#fff', '&:hover': { color: '#7c3aed' } }}><GitHubIcon /></IconButton>
            <IconButton href="https://t.me/richismyho" target="_blank" rel="noopener" sx={{ color: '#fff', '&:hover': { color: '#2196f3' } }}><TelegramIcon /></IconButton>
          </Stack>
        </Stack>
        <Typography variant="body2" align="center" sx={{ mt: 4, color: 'rgba(255,255,255,0.7)' }}>
          © {year} IT College. Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer; 