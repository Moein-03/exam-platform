import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Box, Paper, Typography, Divider, Button, Grid } from '@mui/material';
import { Link } from '@inertiajs/react';
// import Timer from '@/Components/Timer';

const ShowExam = ({ exam, auth }) => {
     const isOwner = auth.user.role === 'teacher' && exam.created_by === auth.user.id;
     const canTake = auth.user.role === 'student' && exam.status === 'فعال';

     return (
          <AuthenticatedLayout user={auth.user} header={exam.title}>
               <Paper sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom>{exam.title}</Typography>
                    <Typography variant="body1" paragraph>{exam.description}</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                         <Grid item xs={6}><strong>تاریخ برگزاری:</strong> {exam.exam_date}</Grid>
                         <Grid item xs={6}><strong>زمان شروع:</strong> {exam.start_time}</Grid>
                         <Grid item xs={6}><strong>مدت:</strong> {exam.duration_min} دقیقه</Grid>
                         <Grid item xs={6}><strong>تعداد سوالات:</strong> {exam.question_count}</Grid>
                         <Grid item xs={6}><strong>نمره کل:</strong> {exam.total_score}</Grid>
                         <Grid item xs={6}><strong>وضعیت:</strong> {exam.status}</Grid>
                    </Grid>
                    <Box sx={{ mt: 3 }}>
                         {isOwner && (
                              <>
                                   <Button component={Link} href={route('exams.edit', exam.id)} variant="outlined" sx={{ ml: 2 }}>ویرایش</Button>
                                   <Button component={Link} href={route('exams.manage_questions', exam.slug)} variant="outlined">مدیریت سوالات</Button>
                              </>
                         )}
                         {canTake && (
                              <Button component={Link} href={route('exams.start', exam.slug)} variant="contained" color="success">شروع آزمون</Button>
                         )}
                    </Box>
               </Paper>
          </AuthenticatedLayout>
     );
}

export default ShowExam;