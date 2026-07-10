import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
     Box, Paper, Typography, Grid, Chip, Table,
     TableBody, TableCell, TableContainer, TableHead,
     TableRow, Divider, Alert, Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ExamResult = ({ isTeacher, auth, exam, answers, score }) => {
    return (
          <AuthenticatedLayout user={auth.user} header={`نتیجه آزمون: ${exam.title}`} isTeacher={isTeacher}>
               <Box sx={{ p: 3, direction: 'rtl' }}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                         <Grid container spacing={2}>
                         <Grid item xs={12}>
                              <Typography variant="h5" gutterBottom>
                                   {exam.title}
                              </Typography>
                              <Chip label={exam.status} color="error" />
                         </Grid>
                         {!isTeacher && (
                              <Grid item xs={12}>
                                   <Alert severity="success">
                                        نمره شما: <strong>{score}</strong> از {exam.total_score}
                                   </Alert>
                              </Grid>
                         )}
                         </Grid>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                         <Typography variant="h6" gutterBottom>
                         پاسخ‌ها
                         </Typography>
                         <Divider sx={{ mb: 2 }} />

                         <TableContainer>
                         <Table>
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
                                             <TableCell>{answer.question?.text}</TableCell>
                                             <TableCell>{answer.selected_answer}</TableCell>
                                             <TableCell>{answer.question?.correct_answer}</TableCell>
                                             <TableCell>
                                                  {answer.is_correct ? (
                                                       <Chip icon={<CheckCircleIcon/>} label="صحیح" color="success" size="small"/>
                                                  ) : (
                                                       <Chip icon={<CancelIcon/>} label="غلط" color="error" size="small"/>
                                                  )}
                                             </TableCell>
                                             {isTeacher && (
                                                  <TableCell sx={{ marginLeft: '10px' }}>{answer.user?.name}</TableCell>
                                             )}
                                        </TableRow>
                                   ))}
                              </TableBody>
                         </Table>
                         </TableContainer>
                    </Paper>
                    <Button
                         variant="outlined"
                         href="/exams"
                         sx={{ width: '130px', height: '50px', marginTop: '10px' }}
                    >
                         بازگشت به لیست
                    </Button>
               </Box>
          </AuthenticatedLayout>
    );
};

export default ExamResult;