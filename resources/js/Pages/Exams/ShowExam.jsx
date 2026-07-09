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

const ShowExam = ({ auth, exam }) => {
    const [loading, setLoading] = useState(!exam);
    const [error, setError] = useState(null);
    const [isConducting, setIsConducting] = useState(false);

    const isOwner = exam?.created_by === auth.user.id;

    // اصلاح شده: فقط بررسی وضعیت کافی است، زمان را بک‌اند چک کند
    const canConduct = () => {
        return isOwner && exam?.status === 'فعال';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        return `${parts[0]}/${parts[1]}/${parts[2]}`;
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        return timeStr.substring(0, 5); // HH:mm
    };

    const handleConduct = async () => {
        if (!confirm('آیا از برگزاری آزمون اطمینان دارید؟')) return;
        
        setIsConducting(true);
        try {
            const response = await axios.post(`/exams/${exam.slug}/conduct`);
            toast.success(response.data.message || 'آزمون با موفقیت برگزار شد.');
            
            // به‌روزرسانی وضعیت در فرانت‌اند
            exam.status = 'درحال برگزاری'; // mutate مستقیم (برای سادگی)
            // یا اگر از state استفاده می‌کنید: setExam(prev => ({...prev, status: 'درحال برگزاری'}))
            
            window.location.reload(); // بهترین راه برای سادگی در حال حاضر
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

                        {/* بقیه اطلاعات آزمون بدون تغییر ... */}

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

                                        {/* دکمه برگزاری همیشه برای وضعیت فعال نمایش داده شود */}
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

                                        {exam.status === 'فعال' && (
                                            <Alert severity="info" sx={{ width: '100%', mt: 1 }}>
                                                زمان برگزاری: {formatDate(exam.exam_date)} ساعت {formatTime(exam.start_time)}
                                            </Alert>
                                        )}
                                    </>
                                )}

                                {/* بقیه دکمه‌های دانشجو ... */}

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