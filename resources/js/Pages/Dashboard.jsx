import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = ({ role, examsCount, questionsCount, avgScore, examsTaken }) => {
     const { auth } = usePage().props;
     /* const [stats, setStats] = useState(null);
     const [loading, setLoading] = useState(true); */

     /* useEffect(() => {
          axios.get('/api/dashboard-stats').then(response => {
                    setStats(response.data);
                    setLoading(false);
          }).catch(error => {
               toast.error(error + 'خطا در دریافت اطلاعات:');
               setLoading(false);
          });
     }, []); */

     const stats = {
          examsCount: examsCount || 0,
          questionsCount: questionsCount || 0,
          avgScore: avgScore || 0,
          examsTaken: examsTaken || 0,
     };

     if (loading) return <CircularProgress />;

     return (
          <AuthenticatedLayout user={auth.user} header="داشبورد">
               <Grid container spacing={3}>
                    {auth.user.role === 'teacher' ? (
                         <>
                              <Grid item xs={12} md={4}>
                                   <Card>
                                        <CardContent>
                                             <Typography color="textSecondary" gutterBottom>تعداد آزمون‌ها</Typography>
                                             <Typography variant="h4">{stats?.examsCount || 0}</Typography>
                                        </CardContent>
                                   </Card>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                   <Card>
                                        <CardContent>
                                             <Typography color="textSecondary" gutterBottom>تعداد سوالات</Typography>
                                             <Typography variant="h4">{stats?.questionsCount || 0}</Typography>
                                        </CardContent>
                                   </Card>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                   <Card>
                                        <CardContent>
                                             <Typography color="textSecondary" gutterBottom>میانگین نمرات</Typography>
                                             <Typography variant="h4">{stats?.avgScore || 0}</Typography>
                                        </CardContent>
                                   </Card>
                              </Grid>
                              <Grid item xs={12}>
                                   <Card>
                                        <CardContent>
                                        <Typography variant="h6">سوالات پرخطا</Typography>
                                        {/* بعدا با chart.js یا recharts نمودار ساخته شود */}
                                        </CardContent>
                                   </Card>
                              </Grid>
                         </>
                    ) : (
                         <Grid item xs={12}>
                              <Card>
                                   <CardContent>
                                        <Typography variant="h5">به پنل دانشجویی خوش آمدید</Typography>
                                        <Typography>برای شرکت در آزمون‌ها، به بخش آزمون‌ها بروید.</Typography>
                                   </CardContent>
                              </Card>
                         </Grid>
                    )}
               </Grid>
          </AuthenticatedLayout>
     );
}

export default Dashboard;