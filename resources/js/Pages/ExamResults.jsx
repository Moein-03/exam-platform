import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
     Box, Paper, Typography, Grid, Card, CardContent,
     Table, TableBody, TableCell, TableContainer,
     TableHead, TableRow, Chip, Button
} from '@mui/material';

const ExamResults = ({ isTeacher, auth, exams }) => {

     const getStatusColor = (status) => {
          const colors = {
               'پیش‌نویس': 'warning',
               'فعال': 'info',
               'درحال برگزاری': 'success',
               'اتمام آزمون': 'error'
          };
          return colors[status] || 'default';
     };

     return (
          <AuthenticatedLayout user={auth.user} header="همه نتایج آزمون‌ها" isTeacher={isTeacher}>
               <Box sx={{ p: 3, direction: 'rtl' }}>
                    <Grid container spacing={3}>
                         {exams.map((exam) => (
                         <Grid item xs={12} key={exam.id}>
                              <Card>
                                   <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                             {exam.title}
                                             <Chip label={exam.status} color={getStatusColor(exam.status)} size="small" sx={{ mr: 1 }} />
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                             تاریخ و ساعت برگزاری: {exam.exam_date}: {exam.start_time} | تعداد شرکت‌کنندگان: {exam.students?.length || 0} | نمره کل آزمون: {exam?.total_score || 0}
                                        </Typography>
                                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                                             <Table size="small">
                                             <TableHead>
                                                  <TableRow>
                                                       <TableCell>دانشجو</TableCell>
                                                       <TableCell>نمره</TableCell>
                                                       <TableCell>وضعیت</TableCell>
                                                       <TableCell>عملیات</TableCell>
                                                  </TableRow>
                                             </TableHead>
                                             <TableBody>
                                                  {exam.students?.map((student) => (
                                                       <TableRow key={student.id}>
                                                            <TableCell>{student.name}</TableCell>
                                                            <TableCell>{student.pivot.score ?? 'نامشخص'}</TableCell>
                                                            <TableCell>
                                                                 <Chip
                                                                      label={student.pivot.status === 'finished' ? 'اتمام' : 'ناتمام'}
                                                                      color={student.pivot.status === 'finished' ? 'success' : 'warning'}
                                                                      size="small"
                                                                 />
                                                            </TableCell>
                                                            <TableCell>
                                                                 <Button
                                                                      size="small"
                                                                      href={`/exams/${exam.slug}/result`}
                                                                      variant="outlined"
                                                                 >
                                                                 مشاهده نتیجه
                                                                 </Button>
                                                            </TableCell>
                                                       </TableRow>
                                                  ))}
                                             </TableBody>
                                             </Table>
                                        </TableContainer>
                                   </CardContent>
                              </Card>
                         </Grid>
                         ))}
                    </Grid>
                    <Button
                         variant="outlined"
                         href="/dashboard"
                         sx={{ width: '140px', height: '50px', marginTop: '20px' }}
                    >
                         بازگشت به داشبورد
                    </Button>
               </Box>
          </AuthenticatedLayout>
     );
};

export default ExamResults;