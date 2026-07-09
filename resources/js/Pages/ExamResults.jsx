import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
     Box, Paper, Typography, Grid, Card, CardContent,
     Table, TableBody, TableCell, TableContainer,
     TableHead, TableRow, Chip, Button
} from '@mui/material';
//import { Link } from 'react-router-dom';

const ExamResults = ({ auth, exams }) => {
     return (
          <AuthenticatedLayout user={auth.user} header="همه نتایج آزمون‌ها">
               <Box sx={{ p: 3, direction: 'rtl' }}>
                    <Grid container spacing={3}>
                         {exams.map((exam) => (
                         <Grid item xs={12} key={exam.id}>
                              <Card>
                                   <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                             {exam.title}
                                             <Chip label={exam.status} color="info" size="small" sx={{ mr: 1 }} />
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                             تاریخ برگزاری: {exam.exam_date} | تعداد شرکت‌کنندگان: {exam.students?.length || 0}
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
                                                                      label={student.pivot.status === 'finished' ? 'اتمام' : 'در حال'}
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
               </Box>
          </AuthenticatedLayout>
     );
};

export default ExamResults;