import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Box, Paper, Typography, Grid, Chip, Button,
    Divider, CircularProgress, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Settings, PlayArrow } from '@mui/icons-material';
import { toast } from 'react-toastify';

const ShowExam = ({ auth, exam: initialExam }) => {
    const [exam, setExam] = useState(initialExam || null);
    const [loading, setLoading] = useState(!initialExam);
    const [error, setError] = useState(null);
    const [isConducting, setIsConducting] = useState(false);

    useEffect(() => {
        if (!initialExam) {
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

    const isOwner = auth?.user && exam?.created_by === auth.user.id;

    // بررسی امکان برگزاری آزمون (با دقت دقیقه و در نظر گرفتن منطقه زمانی محلی)
    const canConduct = () => {
        if (!isOwner) return false;
        if (exam?.status !== 'فعال') return false;

        // ساخت تاریخ و ساعت آزمون به صورت محلی
        const examDateParts = exam.exam_date.split('-'); // ['2026', '07', '09']
        const examTimeParts = exam.start_time.split(':'); // ['14', '25', '00']
        
        const examDateTime = new Date(
            parseInt(examDateParts[0]),          // سال
            parseInt(examDateParts[1]) - 1,      // ماه (۰-۱۱)
            parseInt(examDateParts[2]),          // روز
            parseInt(examTimeParts[0]),          // ساعت
            parseInt(examTimeParts[1])           // دقیقه
        );

        const now = new Date();

        // مقایسه با دقت دقیقه (در نظر گرفتن منطقه زمانی محلی)
        return examDateTime.getFullYear() === now.getFullYear() &&
               examDateTime.getMonth() === now.getMonth() &&
               examDateTime.getDate() === now.getDate() &&
               examDateTime.getHours() === now.getHours() &&
               examDateTime.getMinutes() === now.getMinutes();
    };

    // نمایش تاریخ به صورت خوانا
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[0]}/${parts[1]}/${parts[2]}`;
        }
        return dateStr;
    };

    // نمایش زمان به صورت خوانا (بدون ثانیه)
    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const parts = timeStr.split(':');
        if (parts.length >= 2) {
            return `${parts[0]}:${parts[1]}`;
        }
        return timeStr;
    };

    const handleConduct = async () => {
        if (!confirm('آیا از برگزاری آزمون اطمینان دارید؟')) return;
        
        setIsConducting(true);
        try {
            const response = await axios.post(`/exams/${exam.slug}/conduct`);
            toast.success(response.data.message || 'آزمون با موفقیت برگزار شد.');
            setExam(prev => ({ ...prev, status: 'درحال برگزاری' }));
        } catch (error) {
            const msg = error.response?.data?.error || 'خطا در برگزاری آزمون';
            toast.error(msg);
        } finally {
            setIsConducting(false);
        }
    };

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
            <AuthenticatedLayout user={auth?.user} header="بارگذاری...">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            </AuthenticatedLayout>
        );
    }

    if (error || !exam) {
        return (
            <AuthenticatedLayout user={auth?.user} header="خطا">
                <Alert severity="error">{error || 'آزمون یافت نشد'}</Alert>
            </AuthenticatedLayout>
        );
    }

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
        <AuthenticatedLayout user={auth?.user} header={`نمایش آزمون: ${exam.title}`}>
            <Box sx={{ p: 3, direction: 'rtl' }}>
                <Paper sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4" gutterBottom>
                                {exam.title}
                            </Typography>
                            <Chip
                                label={exam.status}
                                color={getStatusColor(exam.status)}
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
                                <strong>تاریخ برگزاری:</strong> {formatDate(exam.exam_date)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="body1" sx={{direction: "ltr"}}>
                                <strong>زمان شروع:</strong> {formatTime(exam.start_time)}
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
                                        {exam.status === 'پیش‌نویس' && (
                                            <Button 
                                                variant="contained" 
                                                startIcon={<EditIcon sx={{marginLeft: '5px'}}/>} 
                                                href={`/exams/${exam.slug}/edit`}
                                            >
                                                ویرایش آزمون
                                            </Button>
                                        )}

                                        {canConduct() && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<PlayArrow sx={{marginLeft: '5px'}}/>}
                                                onClick={handleConduct}
                                                disabled={isConducting}
                                            >
                                                {isConducting ? 'در حال برگزاری...' : 'برگزاری آزمون'}
                                            </Button>
                                        )}

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

                                        {exam.status === 'درحال برگزاری' && (
                                            <Alert severity="success" sx={{ width: '100%', mt: 1 }}>
                                                آزمون در حال برگزاری است. دانشجویان می‌توانند وارد شوند.
                                            </Alert>
                                        )}
                                        
                                        {exam.status === 'اتمام آزمون' && (
                                            <Alert severity="error" sx={{ width: '100%', mt: 1 }}>
                                                آزمون به پایان رسیده است.
                                            </Alert>
                                        )}

                                        {exam.status === 'فعال' && !canConduct() && (
                                            <Alert severity="info" sx={{ width: '100%', mt: 1 }}>
                                                زمان برگزاری آزمون: {formatDate(exam.exam_date)} ساعت {formatTime(exam.start_time)}
                                            </Alert>
                                        )}
                                    </>
                                )}

                                {auth?.user && !auth.user.isTeacher && (
                                    <>
                                        {exam.status === 'درحال برگزاری' && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                href={`/exams/${exam.slug}/start`}
                                            >
                                                شروع آزمون
                                            </Button>
                                        )}
                                        
                                        {exam.status === 'اتمام آزمون' && (
                                            <Alert severity="info" sx={{ width: '100%' }}>
                                                این آزمون به پایان رسیده است و امکان شرکت وجود ندارد.
                                            </Alert>
                                        )}

                                        {exam.status === 'فعال' && (
                                            <Alert severity="warning" sx={{ width: '100%' }}>
                                                آزمون هنوز برگزار نشده است. منتظر شروع آزمون باشید.
                                            </Alert>
                                        )}
                                    </>
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