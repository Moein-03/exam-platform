import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';

const ReportsIndex = ({ exams, totalExams, totalStudents, avgScore, difficultQuestions, user }) => {
     return (
          <AuthenticatedLayout user={user} header="گزارش‌ها و تحلیل‌ها">
               <Box sx={{ padding: '30px', direction: 'rtl' }}>
                    <Typography variant="h4" gutterBottom align="center" sx={{ mb: 5 }}>
                         گزارش عملکرد و تحلیل آزمون‌ها
                    </Typography>

                    {/* آمار کلی */}
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                         <Grid item xs={12} md={3}>
                         <Card>
                              <CardContent>
                                   <Typography color="textSecondary">تعداد آزمون‌ها</Typography>
                                   <Typography variant="h4">{totalExams}</Typography>
                              </CardContent>
                         </Card>
                         </Grid>
                         <Grid item xs={12} md={3}>
                         <Card>
                              <CardContent>
                                   <Typography color="textSecondary">تعداد شرکت‌کنندگان</Typography>
                                   <Typography variant="h4">{totalStudents}</Typography>
                              </CardContent>
                         </Card>
                         </Grid>
                         <Grid item xs={12} md={3}>
                         <Card>
                              <CardContent>
                                   <Typography color="textSecondary">میانگین نمرات</Typography>
                                   <Typography variant="h4">{avgScore ? avgScore.toFixed(2) : 0}</Typography>
                              </CardContent>
                         </Card>
                         </Grid>
                    </Grid>

                    {/* لیست آزمون‌ها */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                         آزمون‌های برگزار شده
                    </Typography>
                    <TableContainer component={Paper} sx={{ mb: 6 }}>
                         <Table>
                         <TableHead>
                              <TableRow>
                                   <TableCell>عنوان آزمون</TableCell>
                                   <TableCell>تاریخ برگزاری</TableCell>
                                   <TableCell>تعداد سوالات</TableCell>
                                   <TableCell>وضعیت</TableCell>
                              </TableRow>
                         </TableHead>
                         <TableBody>
                              {exams.map((exam) => (
                                   <TableRow key={exam.id}>
                                        <TableCell>{exam.title}</TableCell>
                                        <TableCell>{new Date(exam.exam_date).toLocaleDateString('fa-IR')}</TableCell>
                                        <TableCell>{exam.question_count}</TableCell>
                                        <TableCell>{exam.status}</TableCell>
                                   </TableRow>
                              ))}
                         </TableBody>
                         </Table>
                    </TableContainer>

                    {/* سوالات پرخطا */}
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                         سوالات پرخطا (۵ سوال برتر)
                    </Typography>
                    <TableContainer component={Paper}>
                         <Table>
                         <TableHead>
                              <TableRow>
                                   <TableCell>شماره سوال</TableCell>
                                   <TableCell>تعداد پاسخ غلط</TableCell>
                              </TableRow>
                         </TableHead>
                         <TableBody>
                              {difficultQuestions.map((q, index) => (
                                   <TableRow key={index}>
                                        <TableCell>سوال {index + 1}</TableCell>
                                        <TableCell>{q.wrong_answers}</TableCell>
                                   </TableRow>
                              ))}
                         </TableBody>
                         </Table>
                    </TableContainer>
               </Box>
          </AuthenticatedLayout>
     );
};

export default ReportsIndex;