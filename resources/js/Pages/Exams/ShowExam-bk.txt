import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Box, Paper, Typography, Grid, Chip, Button,
    Divider, CircularProgress, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Settings } from '@mui/icons-material';
//import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { toast } from 'react-toastify';

const ShowExam = ({ auth, exam: initialExam }) => {
    const [exam, setExam] = useState(initialExam || null);
    const [loading, setLoading] = useState(!initialExam);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!initialExam) {
            // اگر exam از props نیامده، از آدرس بگیر
            const slug = window.location.pathname.split('/').pop();
            axios.get(`/exams/${slug}`)
                .then(res => {
                    setExam(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('آزمون پیدا نشد');
                    setLoading(false);
                });
        }
    }, [initialExam]);

    const handleDelete = async () => {
        if (!confirm('آیا از حذف این آزمون اطمینان دارید؟')) return;
        try {
            await axios.delete(`/exams/${exam.slug}`);
            toast.success('آزمون حذف شد');
            window.location.href = '/exams';
        } catch (error) {
            toast.error('خطا در حذف آزمون');
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout user={auth.user} header="بارگذاری...">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            </AuthenticatedLayout>
        );
    }

    if (error || !exam) {
        return (
            <AuthenticatedLayout user={auth.user} header="خطا">
                <Alert severity="error">{error || 'آزمون یافت نشد'}</Alert>
            </AuthenticatedLayout>
        );
    }

    const isOwner = exam.created_by === auth.user.id;

    return (
        <AuthenticatedLayout user={auth.user} header={`نمایش آزمون: ${exam.title}`}>
            <Box sx={{ p: 3, direction: 'rtl' }}>
                <Paper sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4" gutterBottom>
                                {exam.title}
                            </Typography>
                            <Chip
                                label={exam.status}
                                color={exam.status === 'فعال' ? 'success' : 'warning'}
                                sx={{ mb: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                <strong>توضیحات:</strong> {exam.description || 'ندارد'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body1">
                                <strong>دسته‌بندی:</strong> {exam.category || 'عمومی'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="body1">
                                <strong>تاریخ برگزاری:</strong> {exam.exam_date}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="body1" sx={{direction: "ltr"}}>
                                <strong>زمان شروع:</strong> {exam.start_time}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="body1">
                                <strong>مدت زمان:</strong> {exam.duration_min} دقیقه
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="body1">
                                <strong>تعداد سوالات:</strong> {exam.question_count}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="body1">
                                <strong>نمره کل:</strong> {exam.total_score}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="body1">
                                <strong>نحوه انتخاب سوالات:</strong>
                                {exam.question_selection_type === 'manual' ? ' دستی' : ' تصادفی'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                {isOwner && (
                                    <>
                                        {exam.status === 'پیش‌نویس' && <Button variant="contained" startIcon={<EditIcon sx={{marginLeft: '5px'}}/>} href={`/exams/${exam.slug}/edit`}>
                                            ویرایش آزمون
                                        </Button>}
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            startIcon={<Settings sx={{marginLeft: '5px'}}/>}
                                            href={`/exams/${exam.slug}/manage-exam`}
                                        >
                                            مدیریت آزمون
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={<DeleteIcon sx={{marginLeft: '5px'}}/>}
                                            onClick={handleDelete}
                                        >
                                            حذف آزمون
                                        </Button>
                                    </>
                                )}
                                {!auth.user.isTeacher && exam.status === 'فعال' && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        href={`/exams/${exam.slug}/start`}
                                    >
                                        شروع آزمون
                                    </Button>
                                )}
                                <Button
                                    variant="outlined"
                                    href="/exams"
                                    sx={{ width: '130px', height: '50px' }}
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

export default ShowExam;