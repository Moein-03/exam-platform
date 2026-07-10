import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Grid, Card, CardContent, Typography, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = ({ 
     isTeacher, 
     examsCount, 
     questionsCount, 
     avgScore, 
     examsTaken,
     user 
}) => {
     const [stats, setStats] = useState(null);
     const [loading, setLoading] = useState(true);
     const theme = useTheme();
     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

     const toPersianNumber = (num) => {
          if (num === null || num === undefined) return '-';
          const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
          return num.toString().replace(/\d/g, d => persianDigits[parseInt(d)]);
     };

     useEffect(() => {
          setStats({
               examsCount,
               questionsCount,
               avgScore
          });
          setLoading(false);
     }, [examsCount, questionsCount, avgScore]);

     if (loading) {
          return (
               <AuthenticatedLayout user={user}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
                         <CircularProgress />
                    </div>
               </AuthenticatedLayout>
          );
     }

     return (
          <AuthenticatedLayout user={user} isTeacher={isTeacher}>
               <div style={{ padding: isMobile ? '10px' : '20px', direction: 'rtl' }}>
                    <Grid container spacing={isMobile ? 1 : 3}>
                         {isTeacher ? (
                         <>
                              <Grid item xs={12} sm={6} md={4}>
                                   <Card sx={{ textAlign: 'center' }}>
                                        <CardContent>
                                             <Typography color="textSecondary" gutterBottom variant={isMobile ? 'body2' : 'body1'}>
                                                  تعداد آزمون‌ها
                                             </Typography>
                                             <Typography variant={isMobile ? 'h5' : 'h4'} color="primary">
                                                  {toPersianNumber(stats?.examsCount || 0)}
                                             </Typography>
                                        </CardContent>
                                   </Card>
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
                                   <Card sx={{ textAlign: 'center' }}>
                                        <CardContent>
                                             <Typography color="textSecondary" gutterBottom variant={isMobile ? 'body2' : 'body1'}>
                                                  تعداد سوالات
                                             </Typography>
                                             <Typography variant={isMobile ? 'h5' : 'h4'} color="primary">
                                                  {toPersianNumber(stats?.questionsCount || 0)}
                                             </Typography>
                                        </CardContent>
                                   </Card>
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
                                   <Card sx={{ textAlign: 'center' }}>
                                        <CardContent>
                                             <Typography color="textSecondary" gutterBottom variant={isMobile ? 'body2' : 'body1'}>
                                                  میانگین نمرات
                                             </Typography>
                                             <Typography variant={isMobile ? 'h5' : 'h4'} color="primary">
                                                  {toPersianNumber(stats?.avgScore || 0)}
                                             </Typography>
                                        </CardContent>
                                   </Card>
                              </Grid>
                         </>
                         ) : (
                         <Grid item xs={12}>
                              <Card>
                                   <CardContent>
                                        <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
                                             به پنل دانشجویی خوش آمدید
                                        </Typography>
                                        <Typography variant="h6">
                                             تعداد آزمون‌های شرکت کرده: <strong>{toPersianNumber(examsTaken || 0)}</strong>
                                        </Typography>
                                        <Typography variant="h6">
                                             میانگین نمرات: <strong>{toPersianNumber(avgScore || 0)}</strong>
                                        </Typography>
                                   </CardContent>
                              </Card>
                         </Grid>
                         )}
                    </Grid>
               </div>
          </AuthenticatedLayout>
     );
}

export default Dashboard;