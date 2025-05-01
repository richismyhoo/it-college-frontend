import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const testimonials = [
  {
    name: 'Анна Петрова',
    role: 'Выпускница 2023',
    avatar: 'A',
    text: 'Благодаря IT College я получила все необходимые навыки для работы веб-дизайнером. Преподаватели - настоящие профессионалы!',
  },
  {
    name: 'Иван Смирнов',
    role: 'Студент',
    avatar: 'И',
    text: 'Отличная программа обучения, современное оборудование и дружелюбная атмосфера. Рекомендую всем, кто хочет освоить веб-дизайн!',
  },
  {
    name: 'Мария Иванова',
    role: 'Выпускница 2022',
    avatar: 'М',
    text: 'После обучения в IT College я сразу нашла работу в крупной компании. Качество образования на высшем уровне!',
  },
];

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

const mainContentStyle = {
  position: 'relative',
  zIndex: 2,
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
};

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', background: '#0a0618', position: 'relative' }}>
      {/* Абстрактные светящиеся пятна */}
      <Box sx={backgroundStyle}>
        <Box sx={gradient1} />
        <Box sx={gradient2} />
        <Box sx={gradient3} />
      </Box>
      <Box sx={mainContentStyle}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box
            sx={{
              pt: { xs: '10.42vh', md: '5.21vh' },
              pb: { xs: '8.34vh', md: '4.17vh' },
              textAlign: 'center',
            }}
          >
            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: '1.04vh',
                color: '#fff',
                fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                letterSpacing: '-0.104vw',
                lineHeight: 1.1,
                textShadow: '0 0.21vw 1.67vw #7c3aed99, 0 0.052vw 0 #fff1',
                px: { xs: 2, md: 0 }
              }}
            >
              IT College
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: '2.08vh',
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 400,
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                textShadow: '0 0.104vw 0.83vw #2196f355',
                px: { xs: 2, md: 0 }
              }}
            >
              Подготовка специалистов в сфере веб-дизайна и разработки
            </Typography>
            <Box sx={{ 
              mt: 4,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 2 },
              justifyContent: 'center',
              px: { xs: 2, md: 0 }
            }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/courses')}
                sx={{ 
                  width: { xs: '100%', sm: 'auto' },
                  px: { xs: 2, md: 4 },
                  py: { xs: 1.5, md: 1.5 },
                  fontWeight: 700,
                  fontSize: { xs: '1rem', md: '1.1rem' },
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
                Начать обучение
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/profile')}
                sx={{ 
                  width: { xs: '100%', sm: 'auto' },
                  px: { xs: 2, md: 4 },
                  py: { xs: 1.5, md: 1.5 },
                  fontWeight: 700,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  borderRadius: '2rem',
                  color: '#fff',
                  borderColor: '#fff',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.08)',
                    borderColor: '#7c3aed',
                    color: '#7c3aed',
                  },
                }}
              >
                Личный кабинет
              </Button>
            </Box>
          </Box>

          {/* Features Section */}
          <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: { xs: 4, md: 8 } }}>
            {[
              {
                title: 'Современные технологии',
                description: 'Изучайте актуальные инструменты и технологии веб-дизайна',
                color: '#7c3aed',
              },
              {
                title: 'Практические занятия',
                description: 'Реальные проекты и задачи от ведущих компаний',
                color: '#2196f3',
              },
              {
                title: 'Карьерная поддержка',
                description: 'Помощь в трудоустройстве и развитие карьеры',
                color: '#ff3c6e',
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    background: 'rgba(20,20,30,0.85)',
                    borderRadius: { xs: '1rem', md: '2rem' },
                    boxShadow: `0 4px 32px ${feature.color}33`,
                    border: `1.5px solid ${feature.color}55`,
                    color: '#fff',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: { xs: 'none', md: 'translateY(-8px) scale(1.03)' },
                      boxShadow: `0 8px 48px ${feature.color}77`,
                    },
                  }}
                >
                  <CardContent>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      gutterBottom 
                      sx={{ 
                        color: feature.color, 
                        fontWeight: 700,
                        fontSize: { xs: '1.2rem', md: '1.5rem' }
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Testimonials Section */}
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              mb: { xs: 2, md: 4 },
              color: '#fff',
              textAlign: 'center',
              fontWeight: 800,
              textShadow: '0 2px 24px #7c3aed55',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Отзывы наших студентов
          </Typography>
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    background: 'rgba(20,20,30,0.85)',
                    borderRadius: { xs: '1rem', md: '1.5rem' },
                    boxShadow: '0 2px 24px #2196f355',
                    border: '1.5px solid #2196f355',
                    color: '#fff',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          mr: 2,
                          background: 'linear-gradient(135deg, #7c3aed 0%, #2196f3 100%)',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: { xs: '1.1rem', md: '1.3rem' },
                          width: { xs: 40, md: 48 },
                          height: { xs: 40, md: 48 }
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#fff', 
                            fontWeight: 700,
                            fontSize: { xs: '1rem', md: '1.2rem' }
                          }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography sx={{ 
                          color: '#7c3aed', 
                          fontWeight: 500,
                          fontSize: { xs: '0.8rem', md: '0.9rem' }
                        }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }}
                    >
                      {testimonial.text}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Home; 