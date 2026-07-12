import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Box, Paper, Typography, Grid, Chip, Button,
    Divider, CircularProgress, Alert, useMediaQuery, useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Settings, PlayArrow } from '@mui/icons-material';
import { toast } from 'react-toastify';

const ShowExam = ({ isTeacher, auth, exam }) => {
    const [loading, setLoading] = useState(!exam);
    const [error, setError] = useState(null);
    const [isConducting, setIsConducting] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // تبدیل تاریخ میلادی به شمسی
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

    // تبدیل اعداد انگلیسی به فارسی
    const toPersianNumber = num => {
        if (num === null || num === undefined) return '-';
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return num.toString().replace(/\d/g, d => persianDigits[parseInt(d)]);
    };

    const isOwner = exam?.created_by === auth.user.id;

    const canConduct = () => {
        return isOwner && exam?.status === 'فعال';
    };

    const formatDate = dateStr => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        return `${parts[0]}/${parts[1]}/${parts[2]}`;
    };

    const formatTime = timeStr => {
        if (!timeStr) return '';
        return timeStr.substring(0, 5);
    };

    const handleConduct = async () => {
        if (!confirm('آیا از برگزاری آزمون اطمینان دارید؟')) return;
        
        setIsConducting(true);
        try {
            const response = await axios.post(`/exams/${exam.slug}/conduct`);
            toast.success(response.data.message || 'آزمون با موفقیت برگزار شد.');
            exam.status = 'درحال برگزاری';
            window.location.reload();
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

    const getStatusColor = status => {
        const colors = {
            'پیش‌نویس': 'warning',
            'فعال': 'info',
            'درحال برگزاری': 'success',
            'اتمام آزمون': 'error'
        };
        return colors[status] || 'default';
    };

    const buttonSize = isMobile ? 'small' : 'medium';

    return (
        <AuthenticatedLayout user={auth?.user} header={`نمایش آزمون: ${exam.title}`} isTeacher={isTeacher}>
            <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, direction: 'rtl' }}>
                <Paper sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                        <Grid item xs={12}>
                            <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>
                                {exam.title}
                            </Typography>
                            <Chip
                                label={exam.status}
                                color={getStatusColor(exam.status)}
                                sx={{ mb: 2 }}
                                size={isMobile ? 'small' : 'medium'}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">
                                <strong>توضیحات:</strong> {exam.description || 'ندارد'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body1">
                                <strong>دسته‌بندی:</strong> {exam.category || 'عمومی'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body1">
                                <strong>تاریخ و زمان برگزاری:</strong> {toPersianDateTime(exam.exam_date, exam.start_time)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body1">
                                <strong>مدت زمان:</strong> {toPersianNumber(exam.duration_min)} دقیقه
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body1">
                                <strong>تعداد سوالات:</strong> {toPersianNumber(exam.question_count)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body1">
                                <strong>نمره کل:</strong> {toPersianNumber(exam.total_score)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="body1">
                                <strong>نحوه انتخاب سوالات:</strong>
                                {exam.question_selection_type === 'manual' ? ' دستی' : ' تصادفی'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
                                {isOwner && (
                                    <>
                                        {exam.status === 'پیش‌نویس' && (
                                            <Button 
                                                variant="contained" 
                                                startIcon={<EditIcon sx={{marginLeft: '5px'}}/>} 
                                                href={`/exams/${exam.slug}/edit`}
                                                size={buttonSize}
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
                                                size={buttonSize}
                                            >
                                                {isConducting ? 'در حال برگزاری...' : 'برگزاری آزمون'}
                                            </Button>
                                        )}

                                        <Button
                                            variant="contained"
                                            color="warning"
                                            startIcon={<Settings sx={{marginLeft: '5px'}}/>}
                                            href={`/exams/${exam.slug}/manage-exam`}
                                            size={buttonSize}
                                        >
                                            مدیریت آزمون
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="error"
                                            startIcon={<DeleteIcon sx={{marginLeft: '5px'}}/>}
                                            onClick={handleDelete}
                                            size={buttonSize}
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

                                        {exam.status === 'فعال' && (
                                            <Alert severity="info" sx={{ width: '100%', mt: 1 }}>
                                                زمان برگزاری: {toPersianDateTime(exam.exam_date, exam.start_time)}
                                            </Alert>
                                        )}
                                    </>
                                )}

                                {auth?.user.role === "student" && exam.status === 'درحال برگزاری' && (
                                    <Button
                                        size={buttonSize}
                                        color="success"
                                        href={`/exams/${exam.slug}/start`}
                                        component="a"
                                    >
                                        شروع آزمون
                                    </Button>
                                )}
                                {auth?.user.role === "student" && exam.status === 'اتمام آزمون' && (
                                    <Button
                                        size={buttonSize}
                                        color="success"
                                        href={`/exams/${exam.slug}/result`}
                                        component="a"
                                    >
                                        مشاهده نتیجه
                                    </Button>
                                )}
                                <Button
                                    variant="outlined"
                                    href="/exams"
                                    sx={{ width: { xs: '100%', sm: '130px' }, height: { xs: '40px', sm: '50px' } }}
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

export default ShowExam;