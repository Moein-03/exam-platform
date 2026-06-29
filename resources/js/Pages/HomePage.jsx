import { Box, Container, Typography, Grid, Card, CardContent, CardActions, Button, Paper, Avatar } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { toast } from 'react-toastify';

const HomePage = ({ isTeacher, auth }) => {
    const user = auth?.user;
   
    const handleLogout = async () => {
        try {
            await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
            
            await axios.post('/logout', {}, {
                withCredentials: true,
                headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                }
            });

            toast.success('با موفقیت خارج شدید');
            setTimeout(() => {
                window.location.href = '/';
            }, 800);
        } catch (err) {
            console.error(err);
            toast.error('خطا در خروج از حساب');
        }
    };

    const cards = [
        {
            title: 'آزمون‌ها',
            description: isTeacher ? 'مدیریت آزمون‌های خود، ایجاد آزمون جدید و نظارت بر نتایج' : 'شرکت در آزمون‌های فعال و مشاهده نتایج',
            icon: <QuizIcon fontSize="large" color="primary" />,
            link: '/exams',
            linkText: isTeacher ? 'مدیریت آزمون‌ها' : 'مشاهده آزمون‌ها',
        },
        {
            title: 'سوالات',
            description: isTeacher ? 'بانک سوالات خود را مدیریت کنید، سوال جدید بسازید یا ویرایش کنید' : 'سوالات نمونه را مشاهده کنید',
            icon: <QuestionAnswerIcon fontSize="large" color="secondary" />,
            link: '/questions',
            linkText: isTeacher ? 'مدیریت سوالات' : 'مشاهده سوالات',
        },
        {
            title: 'داشبورد',
            description: isTeacher ? 'آمار و گزارشات پیشرفت دانشجویان و تحلیل آزمون‌ها' : 'مشاهده عملکرد خود و پیشرفت در آزمون‌ها',
            icon: <DashboardIcon fontSize="large" color="success" />,
            link: '/dashboard',
            linkText: 'رفتن به داشبورد',
        },
    ];

    if (user) {
        if (!isTeacher) {
            cards.push({
                title: 'نتایج من',
                description: 'مشاهده نمرات و بازخورد آزمون‌های شرکت کرده',
                icon: <AssignmentIcon fontSize="large" color="warning" />,
                link: '/my-results',
                linkText: 'مشاهده نتایج',
            });
        }

        if (isTeacher) {
            cards.push({
                title: 'تحلیل و گزارش',
                description: 'مشاهده آمار دقیق هر آزمون، سوالات پرخطا و میانگین نمرات',
                icon: <AssignmentIcon fontSize="large" color="info" />,
                link: '/reports',
                linkText: 'مشاهده گزارش‌ها',
            });
        }
    }

    return (
        <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh' }}>
            <Box
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    pt: 8,
                    pb: 6,
                    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '0 0 20px 20px',
                    mb: 6,
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                        پلتفرم آزمون آنلاین
                    </Typography>
                    <Typography variant="h5" paragraph>
                        تجربه‌ای نوین در برگزاری و شرکت در آزمون‌های آنلاین با بازخورد هوشمند
                    </Typography>

                    {user ? (
                        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar sx={{ width: 56, height: 56, bgcolor: 'white', color: 'primary.main' }}>
                                {user?.name?.[0] || '?'}
                            </Avatar>
                            <Box>
                                <Typography variant="h5">خوش آمدید {isTeacher ? 'استاد گرامی' : 'دانشجوی عزیز'}، {user?.name}</Typography>
                                <Typography variant="body1">
                                    • {user?.email}
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<LogoutIcon sx={{ marginLeft: '5px' }}/>}
                                onClick={handleLogout}
                                sx={{ ml: 'auto', borderColor: 'white', color: 'white' }}
                            >
                                خروج
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ mt: 4 }}>
                            <Button
                              variant="contained"
                              color="secondary"
                              size="large"
                              startIcon={<LoginIcon sx={{ marginLeft: '7px' }} />}
                              href="/login"
                              sx={{ ml: 2 }}
                            >
                              ورود
                            </Button>
                            <Button
                              variant="outlined"
                              color="inherit"
                              size="large"
                              startIcon={<AppRegistrationIcon sx={{ marginLeft: '7px' }} />}
                              href="/register"
                            >
                              ثبت‌ نام
                            </Button>
                        </Box>
                    )}
                </Container>
            </Box>

            <Container maxWidth="lg">
                <Typography variant="h4" align="center" gutterBottom>
                    خدمات ما
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary" paragraph sx={{ mb: 6 }}>
                    ابزارهای جامع برای برگزاری آزمون‌های آنلاین، تحلیل عملکرد و بازخورد دقیق
                </Typography>

                <Grid container spacing={4}>
                    {cards.map((card, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: '0.3s',
                                    '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                    <Avatar sx={{ m: '0 auto 16px', bgcolor: 'transparent', width: 60, height: 60 }}>
                                        {card.icon}
                                    </Avatar>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {card.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                    <Button size="medium" variant="contained" component="a" href={card.link}>
                                        {card.linkText}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ my: 8 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        چرا پلتفرم ما؟
                    </Typography>
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: '#f0f4ff' }}>
                                <SchoolIcon fontSize="large" color="primary" />
                                <Typography variant="h6" sx={{ mt: 1 }}>بازخورد دقیق</Typography>
                                <Typography variant="body2">ارائه بازخورد تشریحی برای هر سوال به دانشجویان</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: '#f0f4ff' }}>
                                <QuizIcon fontSize="large" color="secondary" />
                                <Typography variant="h6" sx={{ mt: 1 }}>بانک سوالات پویا</Typography>
                                <Typography variant="body2">ایجاد سوالات چند گزینه‌ای، تشریحی و تصادفی</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: '#f0f4ff' }}>
                                <DashboardIcon fontSize="large" color="success" />
                                <Typography variant="h6" sx={{ mt: 1 }}>گزارش‌های پیشرفته</Typography>
                                <Typography variant="body2">تحلیل سوالات پرخطا و میانگین نمرات هر آزمون</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            <Box sx={{ bgcolor: 'primary.dark', color: 'white', py: 4, mt: 8, textAlign: 'center' }}>
                <Typography variant="body2"> {new Date().getFullYear()} پلتفرم آزمون آنلاین. معین خسروی.</Typography>
            </Box>
        </Box>
    );
};

export default HomePage;