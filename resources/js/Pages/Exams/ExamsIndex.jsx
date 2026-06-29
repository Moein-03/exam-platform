import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Box, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    Chip, Pagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ExamsIndex = ({ isTeacher, exams, auth }) => {
    const [page, setPage] = useState(exams.current_page);

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

    return (
        <AuthenticatedLayout user={auth.user} header="مدیریت آزمون‌ها" isTeacher={isTeacher}>
            <Box sx={{ mb: 2, direction: "rtl" }}>
                {isTeacher && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        href="/exams/create"
                        component="a"
                    >
                        آزمون جدید
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ direction: 'rtl' }}>
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
                                        color={exam.status === 'فعال' ? 'success' : 'warning'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        startIcon={<VisibilityIcon />}
                                        href={`/exams/${exam.slug}`}
                                        component="a"
                                    >
                                        مشاهده
                                    </Button>

                                    {isTeacher && exam.created_by === auth.user.id && (
                                        <>
                                            <Button
                                                size="small"
                                                startIcon={<EditIcon />}
                                                href={`/exams/${exam.slug}/edit`}
                                                component="a"
                                            >
                                                ویرایش
                                            </Button>
                                            <Button
                                                size="small"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDelete(exam.slug)}
                                            >
                                                حذف
                                            </Button>
                                        </>
                                    )}

                                    {!isTeacher && exam.status === 'فعال' && (
                                        <Button
                                            size="small"
                                            color="success"
                                            href={`/exams/${exam.slug}/start`}
                                            component="a"
                                        >
                                            شروع آزمون
                                        </Button>
                                    )}
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
                />
            </Box>
        </AuthenticatedLayout>
    );
};

export default ExamsIndex;