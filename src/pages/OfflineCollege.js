import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

const teachers = [
  {
    name: 'Соколов Дмитрий Александрович',
    position: 'UI/UX Дизайн',
    avatar: 'С',
    credentials: 'Кандидат технических наук, арт-директор студии Artflow',
    description: 'Эксперт в области пользовательского интерфейса с 12-летним опытом. Автор курсов по UI/UX дизайну.',
  },
  {
    name: 'Морозова Екатерина Владимировна',
    position: 'Веб-дизайн и композиция',
    avatar: 'М',
    credentials: 'Магистр искусств, член Союза дизайнеров России',
    description: 'Специалист по визуальным коммуникациям и брендингу. Опыт работы с международными проектами.',
  },
  {
    name: 'Васильев Андрей Петрович',
    position: 'Графический дизайн',
    avatar: 'В',
    credentials: 'Adobe Certified Expert, руководитель дизайн-студии PixelPerfect',
    description: 'Профессионал в области графического дизайна и типографики. Создатель авторских шрифтов.',
  },
  {
    name: 'Кузнецова Мария Сергеевна',
    position: 'Анимация и моушн-дизайн',
    avatar: 'К',
    credentials: 'After Effects Certified Professional, режиссер анимации',
    description: 'Специалист по моушн-дизайну и анимации интерфейсов. Опыт работы в рекламных агентствах.',
  },
  {
    name: 'Новиков Игорь Валентинович',
    position: 'Веб-разработка',
    avatar: 'Н',
    credentials: 'Full-stack разработчик, PhD в области компьютерных наук',
    description: 'Эксперт по современным веб-технологиям. Участник международных конференций по веб-разработке.',
  },
  {
    name: 'Белова Анна Михайловна',
    position: 'Дизайн-мышление',
    avatar: 'Б',
    credentials: 'Сертифицированный фасилитатор Design Thinking, MBA',
    description: 'Специалист по методологии дизайн-мышления и проектированию пользовательского опыта.',
  },
  {
    name: 'Козлов Сергей Дмитриевич',
    position: '3D-моделирование',
    avatar: 'К',
    credentials: 'Autodesk Certified Professional, технический директор 3D-студии',
    description: 'Эксперт по 3D-графике и визуализации. Опыт работы в игровой индустрии.',
  },
  {
    name: 'Романова Ольга Александровна',
    position: 'Проектный менеджмент',
    avatar: 'Р',
    credentials: 'PMP, Agile Certified Practitioner',
    description: 'Специалист по управлению творческими проектами. Опыт ведения международных дизайн-проектов.',
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

function OfflineCollege() {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', pb: 8 }}>
      <Box sx={backgroundStyle}>
        <Box sx={gradient1} />
        <Box sx={gradient2} />
        <Box sx={gradient3} />
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pt: { xs: 4, md: 8 } }}>
        {/* Hero Section */}
        <Box sx={{ mb: { xs: 6, md: 10 }, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              color: '#fff',
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              mb: 3,
              textShadow: '0 0 40px #7c3aed55',
            }}
          >
            Офлайн Колледж
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.85)',
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
              maxWidth: '800px',
              mx: 'auto',
              mb: 4,
            }}
          >
            Получите качественное образование в сфере дизайна и веб-разработки в нашем современном кампусе
          </Typography>
        </Box>

        {/* Info Cards */}
        <Grid container spacing={3} sx={{ mb: { xs: 6, md: 10 } }}>
          {[
            {
              icon: <SchoolIcon sx={{ fontSize: '2.5rem', color: '#7c3aed' }} />,
              title: 'Обучение',
              description: 'Очная форма обучения с возможностью совмещения с онлайн-курсами',
            },
            {
              icon: <LocationOnIcon sx={{ fontSize: '2.5rem', color: '#2196f3' }} />,
              title: 'Расположение',
              description: 'Современный кампус в центре города с удобной транспортной доступностью',
            },
            {
              icon: <AccessTimeIcon sx={{ fontSize: '2.5rem', color: '#ff3c6e' }} />,
              title: 'Длительность',
              description: 'Программы обучения от 1 года до 4 лет с гибким расписанием',
            },
            {
              icon: <GroupsIcon sx={{ fontSize: '2.5rem', color: '#7c3aed' }} />,
              title: 'Группы',
              description: 'Небольшие группы до 15 человек для эффективного обучения',
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  background: 'rgba(20,20,30,0.85)',
                  borderRadius: { xs: '1rem', md: '1.5rem' },
                  boxShadow: '0 4px 32px rgba(124,58,237,0.2)',
                  border: '1.5px solid rgba(124,58,237,0.2)',
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  {item.icon}
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#fff',
                      fontWeight: 700,
                      my: 2,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Teachers Section */}
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#fff',
              fontWeight: 800,
              textAlign: 'center',
              mb: { xs: 4, md: 6 },
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              textShadow: '0 0 40px #7c3aed55',
            }}
          >
            Преподавательский состав
          </Typography>
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {teachers.map((teacher, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    background: 'rgba(20,20,30,0.85)',
                    borderRadius: { xs: '1rem', md: '1.5rem' },
                    boxShadow: '0 4px 32px #2196f333',
                    border: '1.5px solid #2196f355',
                    color: '#fff',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: { xs: 'none', md: 'translateY(-8px)' },
                      boxShadow: '0 8px 48px #7c3aed44',
                      borderColor: '#7c3aed55',
                    },
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: '#7c3aed',
                          width: { xs: 48, md: 56 },
                          height: { xs: 48, md: 56 },
                          fontSize: { xs: '1.2rem', md: '1.5rem' },
                          fontWeight: 600,
                        }}
                      >
                        {teacher.avatar}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            lineHeight: 1.2,
                            mb: 0.5
                          }}
                        >
                          {teacher.name}
                        </Typography>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            color: '#7c3aed',
                            fontSize: { xs: '0.8rem', md: '0.9rem' },
                            fontWeight: 600
                          }}
                        >
                          {teacher.position}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography 
                      sx={{ 
                        color: '#2196f3',
                        fontSize: { xs: '0.8rem', md: '0.9rem' },
                        fontWeight: 500,
                        lineHeight: 1.4
                      }}
                    >
                      {teacher.credentials}
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: { xs: '0.8rem', md: '0.9rem' },
                        lineHeight: 1.5
                      }}
                    >
                      {teacher.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Map Section */}
        <Box sx={{ mt: { xs: 6, md: 10 } }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#fff',
              fontWeight: 800,
              textAlign: 'center',
              mb: { xs: 4, md: 6 },
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              textShadow: '0 0 40px #7c3aed55',
            }}
          >
            Как нас найти
          </Typography>
          <Card 
            sx={{ 
              background: 'rgba(20,20,30,0.85)',
              borderRadius: { xs: '1rem', md: '1.5rem' },
              boxShadow: '0 4px 32px rgba(124,58,237,0.2)',
              border: '1.5px solid rgba(124,58,237,0.2)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ height: { xs: '50vh', md: '60vh' } }}>
                <YMaps query={{ apikey: '4e8fde6a-8f9b-4b1a-9fc3-a51d7605b357' }}>
                  <Map 
                    defaultState={{ 
                      center: [59.964350, 30.304918], 
                      zoom: 15,
                      controls: ['zoomControl', 'fullscreenControl']
                    }}
                    width="100%"
                    height="100%"
                    modules={['control.ZoomControl', 'control.FullscreenControl']}
                    options={{
                      suppressMapOpenBlock: true,
                    }}
                  >
                    <Placemark 
                      geometry={[59.964350, 30.304918]}
                      options={{
                        preset: 'islands#educationIcon',
                        iconColor: '#7c3aed',
                      }}
                      properties={{
                        balloonContentHeader: 'IT College',
                        balloonContentBody: 'Санкт-Петербург, ул. Бармалеева, 14',
                        hintContent: 'IT College'
                      }}
                      modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                    />
                  </Map>
                </YMaps>
              </Box>
            </CardContent>
          </Card>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#fff',
              textAlign: 'center',
              mt: 3,
              fontWeight: 600,
              fontSize: { xs: '1rem', md: '1.2rem' },
            }}
          >
            Санкт-Петербург, ул. Бармалеева, 14
          </Typography>
        </Box>

        {/* Contacts Section */}
        <Box sx={{ mt: { xs: 6, md: 10 } }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#fff',
              fontWeight: 800,
              textAlign: 'center',
              mb: { xs: 4, md: 6 },
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              textShadow: '0 0 40px #7c3aed55',
            }}
          >
            Контакты для абитуриентов
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  background: 'rgba(20,20,30,0.85)',
                  borderRadius: { xs: '1rem', md: '1.5rem' },
                  boxShadow: '0 4px 32px rgba(124,58,237,0.2)',
                  border: '1.5px solid rgba(124,58,237,0.2)',
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: { xs: 'none', md: 'translateY(-8px)' },
                    boxShadow: '0 8px 48px #7c3aed44',
                    borderColor: '#7c3aed55',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#fff',
                      fontWeight: 700,
                      mb: 3,
                      textAlign: 'center'
                    }}
                  >
                    Приемная комиссия
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box 
                        sx={{ 
                          width: 48, 
                          height: 48, 
                          borderRadius: '1rem',
                          background: 'linear-gradient(135deg, #7c3aed33 0%, #2196f333 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Typography sx={{ color: '#fff', fontSize: '1.5rem' }}>📞</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', mb: 0.5 }}>
                          Телефон
                        </Typography>
                        <Typography 
                          component="a" 
                          href="tel:+78005553535"
                          sx={{ 
                            color: '#fff', 
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            '&:hover': { color: '#7c3aed' }
                          }}
                        >
                          +7 (800) 555-35-35
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box 
                        sx={{ 
                          width: 48, 
                          height: 48, 
                          borderRadius: '1rem',
                          background: 'linear-gradient(135deg, #2196f333 0%, #ff3c6e33 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Typography sx={{ color: '#fff', fontSize: '1.5rem' }}>✉️</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', mb: 0.5 }}>
                          Email
                        </Typography>
                        <Typography 
                          component="a"
                          href="mailto:itcollege-fictional-email@fictional.com"
                          sx={{ 
                            color: '#fff', 
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            '&:hover': { color: '#2196f3' }
                          }}
                        >
                          itcollege-fictional-email@fictional.com
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)', 
                      fontSize: '0.9rem',
                      mt: 3,
                      textAlign: 'center',
                      fontStyle: 'italic'
                    }}
                  >
                    Ждем ваших заявок! Наши специалисты ответят на все ваши вопросы и помогут с поступлением.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default OfflineCollege; 