import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Box, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    Chip, Pagination, useMediaQuery, useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ExamsIndex = ({ isTeacher, exams, auth }) => {
    const [page, setPage] = useState(exams.current_page);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDelete = async (slug) => {
        if (!confirm('آیا از حذف این آزمون اطمینان دارید؟')) return;

        try {
            await axios.delete(`/exams/${slug}`);
            toast.success('آزمون حذف شد');
            window.location.reload();
        } catch (error) {
            toast.error('خطا در حذف آزمون');
            console.error(error);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        window.location.href = `/exams?page=${value}`;
    };

    const getStatusColor = (status) => {
        const colors = {
            'پیش‌نویس': 'warning',
            'فعال': 'info',
            'درحال برگزاری': 'success',
            'اتمام آزمون': 'error'
        };
        return colors[status] || 'default';
    };

    // اندازه دکمه‌ها بر اساس دستگاه
    const buttonSize = isMobile ? 'small' : 'medium';

    return (
        <AuthenticatedLayout user={auth.user} header="مدیریت آزمون‌ها" isTeacher={isTeacher}>
            <Box sx={{ mb: 2, direction: "rtl" }}>
                {isTeacher && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        href="/exams/create"
                        component="a"
                        size={buttonSize}
                    >
                        آزمون جدید
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: { xs: 600, sm: '100%' }, direction: 'rtl' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>عنوان</TableCell>
                            <TableCell>تاریخ</TableCell>
                            <TableCell>مدت (دقیقه)</TableCell>
                            <TableCell>وضعیت</TableCell>
                            <TableCell>عملیات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {exams.data.map(exam => (
                            <TableRow key={exam.id}>
                                <TableCell>{exam.title}</TableCell>
                                <TableCell>{exam.exam_date}</TableCell>
                                <TableCell>{exam.duration_min}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={exam.status}
                                        color={getStatusColor(exam.status)}
                                        size={isMobile ? 'small' : 'medium'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        <Button
                                            size={buttonSize}
                                            startIcon={<VisibilityIcon sx={{marginLeft: '5px'}}/>}
                                            href={`/exams/${exam.slug}`}
                                            component="a"
                                        >
                                            مشاهده
                                        </Button>

                                        {isTeacher && exam.created_by === auth.user.id && (
                                            <>
                                                <Button
                                                    size={buttonSize}
                                                    startIcon={<EditIcon sx={{marginLeft: '5px'}}/>}
                                                    href={`/exams/${exam.slug}/edit`}
                                                    component="a"
                                                >
                                                    ویرایش
                                                </Button>
                                                <Button
                                                    size={buttonSize}
                                                    startIcon={<DeleteIcon sx={{marginLeft: '5px'}}/>}
                                                    onClick={() => handleDelete(exam.slug)}
                                                    color="error"
                                                >
                                                    حذف
                                                </Button>
                                            </>
                                        )}

                                        {!isTeacher && exam.status === 'درحال برگزاری' && (
                                            <Button
                                                size={buttonSize}
                                                color="success"
                                                href={`/exams/${exam.slug}/start`}
                                                component="a"
                                            >
                                                شروع آزمون
                                            </Button>
                                        )}

                                        {!isTeacher && exam.status === 'اتمام آزمون' && (
                                            <Button
                                                size={buttonSize}
                                                color="success"
                                                href={`/exams/${exam.slug}/result`}
                                                component="a"
                                            >
                                                مشاهده نتیجه
                                            </Button>
                                        )}
                                    </Box>
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
        </AuthenticatedLayout>
    );
};

export default ExamsIndex;