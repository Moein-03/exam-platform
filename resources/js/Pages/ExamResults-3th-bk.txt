import { useMediaQuery, useTheme } from '@mui/material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
     Box, Paper, Typography, Grid, Card, CardContent,
     Table, TableBody, TableCell, TableContainer,
     TableHead, TableRow, Chip, Button
} from '@mui/material';

const ExamResults = ({ isTeacher, auth, exams }) => {
     const theme = useTheme();
     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

     // تبدیل اعداد لاتین به فارسی
     const toPersianNumber = (num) => {
          if (num === null || num === undefined) return '-';
          const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
          return num.toString().replace(/\d/g, d => persianDigits[parseInt(d)]);
     };

     // تبدیل تاریخ و زمان به شمسی با اعداد فارسی
     const toPersianDateTime = (dateStr, timeStr) => {
          if (!dateStr) return '-';
          const parts = dateStr.split('-');
          if (parts.length !== 3) return '-';
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1;
          const day = parseInt(parts[2]);
          let hours = 0, minutes = 0;
          if (timeStr) {
               const timeParts = timeStr.split(':');
               if (timeParts.length >= 2) {
                    hours = parseInt(timeParts[0]);
                    minutes = parseInt(timeParts[1]);
               }
          }
          const dateObj = new Date(year, month, day, hours, minutes);
          if (isNaN(dateObj.getTime())) return '-';
          return dateObj.toLocaleDateString('fa-IR', {
               year: 'numeric',
               month: '2-digit',
               day: '2-digit',
               hour: '2-digit',
               minute: '2-digit'
          });
     };

     const getStatusColor = (status) => {
          const colors = {
               'پیش‌نویس': 'warning',
               'فعال': 'info',
               'درحال برگزاری': 'success',
               'اتمام آزمون': 'error'
          };
          return colors[status] || 'default';
     };

     const buttonSize = isMobile ? 'small' : 'medium';
     const tableSize = isMobile ? 'small' : 'medium';

     return (
          <AuthenticatedLayout user={auth.user} header="همه نتایج آزمون‌ها" isTeacher={isTeacher}>
               <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, direction: 'rtl' }}>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                         {exams.map((exam) => (
                              <Grid item xs={12} key={exam.id}>
                                   <Card>
                                        <CardContent>
                                             <Typography variant={isMobile ? 'subtitle1' : 'h6'} gutterBottom>
                                                  {exam.title}
                                                  <Chip 
                                                       label={exam.status} 
                                                       color={getStatusColor(exam.status)} 
                                                       size={isMobile ? 'small' : 'small'} 
                                                       sx={{ mr: 1 }} 
                                                  />
                                             </Typography>
                                             <Typography variant="body2" color="textSecondary">
                                                  تاریخ و ساعت برگزاری: {toPersianDateTime(exam.exam_date, exam.start_time)} | 
                                                  تعداد شرکت‌کنندگان: {toPersianNumber(exam.students?.length || 0)} | 
                                                  نمره کل آزمون: {toPersianNumber(exam?.total_score || 0)}
                                             </Typography>
                                             <TableContainer component={Paper} sx={{ mt: 2, overflowX: 'auto' }}>
                                                  <Table size={tableSize}>
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
                                                                      <TableCell>{toPersianNumber(student.pivot.score ?? 'نامشخص')}</TableCell>
                                                                      <TableCell>
                                                                           <Chip
                                                                                label={student.pivot.status === 'finished' ? 'اتمام' : 'ناتمام'}
                                                                                color={student.pivot.status === 'finished' ? 'success' : 'warning'}
                                                                                size={isMobile ? 'small' : 'small'}
                                                                           />
                                                                      </TableCell>
                                                                      <TableCell>
                                                                           <Button
                                                                                size={buttonSize}
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
                         sx={{ 
                              width: { xs: '100%', sm: '140px' }, 
                              height: { xs: '40px', sm: '50px' }, 
                              marginTop: '20px' 
                         }}
                         size={buttonSize}
                    >
                         بازگشت به داشبورد
                    </Button>
               </Box>
          </AuthenticatedLayout>
     );
};

export default ExamResults;