import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
     Box, Paper, Typography, Grid, Card, CardContent,
     Table, TableBody, TableCell, TableContainer,
     TableHead, TableRow, Chip, Button, Pagination,
     useMediaQuery, useTheme
} from '@mui/material';

const MyResults = ({ isTeacher, auth, exams }) => {
     const [page, setPage] = useState(exams.current_page);
     const theme = useTheme();
     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
     const isTablet = useMediaQuery(theme.breakpoints.down('md'));

     const handlePageChange = (event, value) => {
          setPage(value);
          window.location.href = `/my-results?page=${value}`;
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

     // تبدیل اعداد لاتین به فارسی
     const toPersianNumber = num => {
          if (num === null || num === undefined) return '-';
          const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
          return num.toString().replace(/\d/g, d => persianDigits[parseInt(d)]);
     };

     const buttonSize = isMobile ? 'small' : 'medium';
     const tableCellSize = isMobile ? 'small' : 'medium';

     return (
          <AuthenticatedLayout user={auth.user} header="نتایج آزمون‌های من" isTeacher={isTeacher}>
               <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, direction: 'rtl' }}>
                    <Paper sx={{ p: { xs: 1.5, sm: 2, md: 3 }, mb: 3 }}>
                         <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
                              لیست آزمون‌های شرکت‌کرده
                         </Typography>
                         <Typography variant="body2" color="textSecondary">
                              در این بخش می‌توانید نتایج تمام آزمون‌هایی که در آنها شرکت کرده‌اید را مشاهده کنید.
                         </Typography>
                    </Paper>

                    {exams.data.length === 0 ? (
                         <Paper sx={{ p: 4, textAlign: 'center' }}>
                              <Typography variant="body1" color="textSecondary">
                                   شما هنوز در هیچ آزمونی شرکت نکرده‌اید.
                              </Typography>
                         </Paper>
                    ) : (
                         <>
                              <TableContainer component={Paper} sx={{ overflowX: 'auto', display: 'block', width: '100%' }}>
                                   <Table size={tableCellSize} sx={{ minWidth: { xs: '600px', sm: '100%' } }}>
                                        <TableHead>
                                             <TableRow>
                                                  <TableCell>عنوان آزمون</TableCell>
                                                  <TableCell>تاریخ و زمان برگزاری</TableCell>
                                                  <TableCell>نمره</TableCell>
                                                  <TableCell>وضعیت</TableCell>
                                                  <TableCell>عملیات</TableCell>
                                             </TableRow>
                                        </TableHead>
                                        <TableBody>
                                             {exams.data.map((exam) => (
                                                  <TableRow key={exam.id} hover>
                                                       <TableCell sx={{ maxWidth: { xs: 100, sm: 200 }, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                                            {exam.title}
                                                       </TableCell>
                                                       <TableCell>{toPersianDateTime(exam.exam_date, exam.start_time)}</TableCell>
                                                       <TableCell>
                                                            <strong>
                                                                 {toPersianNumber(exam.pivot.score ?? 0)} از {toPersianNumber(exam.total_score)}
                                                            </strong>
                                                       </TableCell>
                                                       <TableCell>
                                                            <Chip
                                                                 label="اتمام"
                                                                 color="success"
                                                                 size={isMobile ? 'small' : 'medium'}
                                                            />
                                                       </TableCell>
                                                       <TableCell>
                                                            <Button
                                                                 size={buttonSize}
                                                                 variant="outlined"
                                                                 href={`/exams/${exam.slug}/result`}
                                                                 fullWidth={isMobile}
                                                            >
                                                                 مشاهده نتیجه
                                                            </Button>
                                                       </TableCell>
                                                  </TableRow>
                                             ))}
                                        </TableBody>
                                   </Table>
                              </TableContainer>

                              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                   <Pagination
                                        count={exams.last_page}
                                        page={page}
                                        onChange={handlePageChange}
                                        size={isMobile ? 'small' : 'medium'}
                                   />
                              </Box>
                         </>
                    )}
               </Box>
          </AuthenticatedLayout>
     );
};

export default MyResults;