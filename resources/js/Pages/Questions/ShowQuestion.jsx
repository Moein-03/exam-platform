import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
     Box, Paper, Typography, Grid, Chip, Button,
     Divider, Alert, useMediaQuery, useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';

const ShowQuestion = ({ isTeacher, auth, question }) => {
     const theme = useTheme();
     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

     // تبدیل اعداد انگلیسی به فارسی
     const toPersianNumber = (num) => {
          if (num === null || num === undefined) return '-';
          const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
          return num.toString().replace(/\d/g, d => persianDigits[parseInt(d)]);
     };

     const getTypeLabel = (type) => {
          const types = {
               multiple_choice: 'چند گزینه‌ای',
               true_false: 'صحیح/غلط',
               essay: 'تشریحی'
          };
          return types[type] || type;
     };

     const handleDelete = async () => {
          if (!confirm('آیا از حذف این سوال اطمینان دارید؟')) return;
          try {
               await axios.delete(`/questions/${question.id}`);
               toast.success('سوال حذف شد');
               window.location.href = '/questions';
          } catch (error) {
               toast.error('خطا در حذف سوال');
               console.error(error);
          }
     };

     const buttonSize = isMobile ? 'small' : 'medium';

     if (!question) {
          return (
               <AuthenticatedLayout user={auth?.user} header="خطا">
                    <Alert severity="error">سوال یافت نشد</Alert>
               </AuthenticatedLayout>
          );
     }

     return (
          <AuthenticatedLayout user={auth.user} header={`نمایش سوال`} isTeacher={isTeacher}>
               <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, direction: 'rtl' }}>
                    <Paper sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                         <Grid container spacing={{ xs: 1, sm: 2 }}>
                         <Grid item xs={12}>
                              <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
                                   {question.text}
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                   <Chip label={getTypeLabel(question.type)} color="primary" size={isMobile ? 'small' : 'medium'} />
                                   <Chip label={`نمره: ${toPersianNumber(question.score)}`} color="secondary" size={isMobile ? 'small' : 'medium'} />
                              </Box>
                         </Grid>

                         <Grid item xs={12}>
                              <Divider />
                         </Grid>

                         {question.type === 'multiple_choice' && question.options && (
                              <Grid item xs={12}>
                                   <Typography variant="subtitle1" gutterBottom>
                                        گزینه‌ها:
                                   </Typography>
                                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {question.options.map((opt, index) => {
                                             const letter = String.fromCharCode(65 + index);
                                             const isCorrect = question.correct_answer === letter;
                                             return (
                                             <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                  <Chip label={letter} size="small" />
                                                  <Typography>{opt}</Typography>
                                                  {isCorrect && (
                                                       <Chip label="پاسخ صحیح" color="success" size="small" />
                                                  )}
                                             </Box>
                                             );
                                        })}
                                   </Box>
                              </Grid>
                         )}

                         {question.type !== 'multiple_choice' && (
                              <Grid item xs={12}>
                                   <Typography variant="subtitle1">
                                        <strong>پاسخ صحیح:</strong> {question.correct_answer}
                                   </Typography>
                              </Grid>
                         )}

                         {question.explanation && (
                              <Grid item xs={12}>
                                   <Typography variant="subtitle1">
                                        <strong>توضیح (بازخورد):</strong>
                                   </Typography>
                                   <Alert severity="info" sx={{ mt: 1 }}>
                                        {question.explanation}
                                   </Alert>
                              </Grid>
                         )}

                         <Grid item xs={12}>
                              <Divider />
                         </Grid>

                         <Grid item xs={12}>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
                                   <Button
                                        variant="contained"
                                        startIcon={<EditIcon sx={{ marginLeft: '5px' }} />}
                                        href={`/questions/${question.id}/edit`}
                                        size={buttonSize}
                                   >
                                        ویرایش سوال
                                   </Button>
                                   <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<DeleteIcon sx={{ marginLeft: '5px' }} />}
                                        onClick={handleDelete}
                                        size={buttonSize}
                                   >
                                        حذف سوال
                                   </Button>
                                   <Button
                                        variant="outlined"
                                        startIcon={<ArrowBackIcon sx={{ marginLeft: '5px' }} />}
                                        href="/questions"
                                        size={buttonSize}
                                   >
                                        بازگشت به لیست
                                   </Button>
                              </Box>
                         </Grid>
                         </Grid>
                    </Paper>
               </Box>
          </AuthenticatedLayout>
     );
};

export default ShowQuestion;