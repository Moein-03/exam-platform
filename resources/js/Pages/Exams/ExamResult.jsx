import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
     Box, Paper, Typography, Grid, Chip, Table, Button,
     TableBody, TableCell, TableContainer, TableHead,
     TableRow, Divider, Alert, useMediaQuery, useTheme
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ExamResult = ({ auth, exam, answers, isTeacher, score }) => {
     const theme = useTheme();
     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

     const toPersianNumber = num => {
          if (num === null || num === undefined) return '-';
          const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
          return num.toString().replace(/\d/g, d => persianDigits[parseInt(d)]);
     };

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

     const buttonSize = isMobile ? 'small' : 'medium';

     return (
          <AuthenticatedLayout user={auth.user} header={`نتیجه آزمون: ${exam.title}`} isTeacher={isTeacher}>
               <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, direction: 'rtl' }}>
                    <Paper sx={{ p: { xs: 1.5, sm: 2, md: 3 }, mb: 3 }}>
                         <Grid container spacing={2}>
                              <Grid item xs={12}>
                                   <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
                                        {exam.title}
                                   </Typography>
                                   <Chip label={exam.status} color="info" size={isMobile ? 'small' : 'medium'} />
                              </Grid>
                              {!isTeacher && (
                                   <Grid item xs={12}>
                                        <Alert severity="success">
                                             نمره شما: <strong>{toPersianNumber(score)}</strong> از {toPersianNumber(exam.total_score)}
                                        </Alert>
                                   </Grid>
                              )}
                              <Grid item xs={12}>
                                   <Typography variant="body2" color="textSecondary">
                                        تاریخ برگزاری: {toPersianDateTime(exam.exam_date, exam.start_time)}
                                   </Typography>
                              </Grid>
                         </Grid>
                    </Paper>

                    

                    <Paper sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                         <Typography variant="h6" gutterBottom>
                         پاسخ‌ها
                         </Typography>
                         <Divider sx={{ mb: 2 }} />

                         <TableContainer>
                         <Table size={isMobile ? 'small' : 'medium'}>
                              <TableHead>
                                   <TableRow>
                                        <TableCell>سوال</TableCell>
                                        <TableCell>پاسخ شما</TableCell>
                                        <TableCell>پاسخ صحیح</TableCell>
                                        <TableCell>وضعیت</TableCell>
                                        {isTeacher && <TableCell>دانشجو</TableCell>}
                                   </TableRow>
                              </TableHead>
                              <TableBody>
                                   {answers.map((answer) => (
                                        <TableRow key={answer.id}>
                                             <TableCell sx={{ maxWidth: { xs: 100, sm: 200 }, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                             {answer.question?.text}
                                             </TableCell>
                                             <TableCell>{answer.selected_answer}</TableCell>
                                             <TableCell>{answer.question?.correct_answer}</TableCell>
                                             <TableCell>
                                             {answer.is_correct ? (
                                                  <Chip icon={<CheckCircleIcon />} label="صحیح" color="success" size={isMobile ? 'small' : 'medium'} />
                                             ) : (
                                                  <Chip icon={<CancelIcon />} label="غلط" color="error" size={isMobile ? 'small' : 'medium'} />
                                             )}
                                             </TableCell>
                                             {isTeacher && (
                                             <TableCell>{answer.user?.name}</TableCell>
                                             )}
                                        </TableRow>
                                   ))}
                              </TableBody>
                         </Table>
                         </TableContainer>
                    </Paper>
                    {isTeacher ? (
                         <Button
                              variant="outlined"
                              href="/results"
                              sx={{ 
                                   width: { xs: '100%', sm: '140px' }, 
                                   height: { xs: '40px', sm: '50px' }, 
                                   marginTop: '20px' 
                              }}
                              size={buttonSize}
                         >
                              بازگشت به نتایج
                         </Button>
                    ): (
                         <Button
                              variant="outlined"
                              href="/my-results"
                              sx={{ 
                                   width: { xs: '100%', sm: '140px' }, 
                                   height: { xs: '40px', sm: '50px' }, 
                                   marginTop: '20px' 
                              }}
                              size={buttonSize}
                         >
                              بازگشت به نتایج من
                         </Button>
                    )}
                    
               </Box>
          </AuthenticatedLayout>
     );
};

export default ExamResult;