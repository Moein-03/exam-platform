import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
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
          <AuthenticatedLayout user={user}>
               <div style={{ padding: '20px' }}>
                    <Grid container spacing={3}>
                         {isTeacher ? (
                         <>
                              <Grid item xs={12} md={4}>
                                   <Card sx={{ textAlign: 'center' }}>
                                        <CardContent>
                                             <Typography color="textSecondary" gutterBottom>تعداد آزمون‌ها</Typography>
                                             <Typography variant="h4" color="primary">{stats?.examsCount || 0}</Typography>
                                        </CardContent>
                                   </Card>
                              </Grid>

                              <Grid item xs={12} md={4}>
                                   <Card sx={{ textAlign: 'center' }}>
                                        <CardContent>
                                             <Typography color="textSecondary" gutterBottom>تعداد سوالات</Typography>
                                             <Typography variant="h4" color="primary">{stats?.questionsCount || 0}</Typography>
                                        </CardContent>
                                   </Card>
                              </Grid>

                              <Grid item xs={12} md={4}>
                                   <Card sx={{ textAlign: 'center' }}>
                                        <CardContent>
                                             <Typography color="textSecondary" gutterBottom>میانگین نمرات</Typography>
                                             <Typography variant="h4" color="primary">{stats?.avgScore || 0}</Typography>
                                        </CardContent>
                                   </Card>
                              </Grid>
                         </>
                         ) : (
                         <Grid item xs={12}>
                              <Card>
                                   <CardContent>
                                        <Typography variant="h5" gutterBottom>به پنل دانشجویی خوش آمدید</Typography>
                                        <Typography variant="h6">
                                             تعداد آزمون‌های شرکت کرده: <strong>{examsTaken || 0}</strong>
                                        </Typography>
                                        <Typography variant="h6">
                                             میانگین نمرات: <strong>{avgScore || 0}</strong>
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