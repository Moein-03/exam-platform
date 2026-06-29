import { useState } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import {
    Box, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    Chip, Pagination, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

const QuestionsIndex = ({ isTeacher, auth, questions: initialQuestions }) => {
    const [questions, setQuestions] = useState(initialQuestions);
    const [page, setPage] = useState(initialQuestions.current_page);

    const handleDelete = async (id) => {
        if (!confirm('آیا از حذف این سوال اطمینان دارید؟')) return;

        try {
            await axios.delete(`/questions/${id}`);
            toast.success('سوال حذف شد');
            
            setQuestions(prev => ({
                ...prev,
                data: prev.data.filter(q => q.id !== id),
                total: prev.total - 1,
                from: prev.from,
                to: prev.to - 1,
                current_page: prev.current_page,
                last_page: prev.last_page,
                per_page: prev.per_page,
                path: prev.path,
                first_page_url: prev.first_page_url,
                last_page_url: prev.last_page_url,
                next_page_url: prev.next_page_url,
                prev_page_url: prev.prev_page_url,
            }));
        } catch (error) {
            toast.error('خطا در حذف سوال');
            console.error(error);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        window.location.href = `/questions?page=${value}`;
    };

    const getTypeLabel = (type) => {
        const types = {
            multiple_choice: 'چهار گزینه‌ای',
            true_false: 'صحیح/غلط',
            essay: 'تشریحی'
        };
        return types[type] || type;
    };

    return (
        <AuthenticatedLayout user={auth.user} header="مدیریت سوالات" isTeacher={isTeacher}>
            <Box sx={{ mb: 2, direction: 'rtl' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    href="/questions/create"
                    component="a"
                >
                    سوال جدید
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{direction:'rtl'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>متن سوال</TableCell>
                            <TableCell>نوع</TableCell>
                            <TableCell>نمره</TableCell>
                            <TableCell>عملیات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.data.map((q) => (
                            <TableRow key={q.id}>
                                <TableCell sx={{ maxWidth: 300 }}>
                                    <Typography noWrap>
                                        {q.text}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={getTypeLabel(q.type)} size="small" />
                                </TableCell>
                                <TableCell>{q.score}</TableCell>
                                <TableCell>
                                    {/* <Button
                                        size="small"
                                        startIcon={<VisibilityIcon />}
                                        href={`/questions/${q.id}`}
                                        component="a"
                                    >
                                        مشاهده
                                    </Button> */}
                                    <Button
                                        size="small"
                                        startIcon={<EditIcon />}
                                        href={`/questions/${q.id}/edit`}
                                        component="a"
                                    >
                                        ویرایش
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDelete(q.id)}
                                        color="error"
                                    >
                                        حذف
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                    count={questions.last_page}
                    page={page}
                    onChange={handlePageChange}
                />
            </Box>
        </AuthenticatedLayout>
    );
};

export default QuestionsIndex;