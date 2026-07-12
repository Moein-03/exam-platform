import { useState } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import {
    Box, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    Chip, Pagination, Typography, useMediaQuery, useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

const QuestionsIndex = ({ isTeacher, auth, questions: initialQuestions }) => {
    const [questions, setQuestions] = useState(initialQuestions);
    const [page, setPage] = useState(initialQuestions.current_page);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
            multiple_choice: 'چند گزینه‌ای',
            true_false: 'صحیح/غلط',
            essay: 'تشریحی'
        };
        return types[type] || type;
    };

    // تبدیل اعداد انگلیسی به فارسی
    const toPersianNumber = num => {
        if (num === null || num === undefined) return '-';
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return num.toString().replace(/\d/g, d => persianDigits[parseInt(d)]);
    };

    const buttonSize = isMobile ? 'small' : 'medium';

    return (
        <AuthenticatedLayout user={auth.user} header="مدیریت سوالات" isTeacher={isTeacher}>
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1100,
                    backgroundColor: 'background.paper',
                    py: 1,
                    mb: 2,
                    direction: 'rtl',
                    boxShadow: isMobile ? 2 : 0,
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    href="/questions/create"
                    component="a"
                    size={buttonSize}
                    fullWidth={isMobile}
                >
                    سوال جدید
                </Button>
            </Box>

            <TableContainer
                component={Paper}
                sx={{
                    overflowX: 'auto',
                    display: 'block',
                    width: '100%',
                    direction: 'rtl',
                }}
            >
                <Table
                    sx={{
                        minWidth: { xs: '700px', sm: '100%' },
                        direction: 'rtl',
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ textAlign: 'center' }}>متن سوال</TableCell>
                            <TableCell sx={{ paddingLeft: '35px' }}>نوع</TableCell>
                            <TableCell>نمره</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>عملیات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.data.map((q) => (
                            <TableRow key={q.id}>
                                <TableCell sx={{ maxWidth: 300 }}>
                                    <Typography noWrap>{q.text}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={getTypeLabel(q.type)} size={isMobile ? 'small' : 'medium'} />
                                </TableCell>
                                <TableCell>{toPersianNumber(q.score)}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        <Button
                                            size={buttonSize}
                                            startIcon={<VisibilityIcon sx={{ marginLeft: '5px' }} />}
                                            href={`/questions/${q.id}`}
                                            component="a"
                                        >
                                            مشاهده
                                        </Button>
                                        <Button
                                            size={buttonSize}
                                            startIcon={<EditIcon sx={{ marginLeft: '5px' }} />}
                                            href={`/questions/${q.id}/edit`}
                                            component="a"
                                        >
                                            ویرایش
                                        </Button>
                                        <Button
                                            size={buttonSize}
                                            startIcon={<DeleteIcon sx={{ marginLeft: '5px' }} />}
                                            onClick={() => handleDelete(q.id)}
                                            color="error"
                                        >
                                            حذف
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mr: 25 }}>
                <Pagination
                    count={questions.last_page}
                    page={page}
                    onChange={handlePageChange}
                    size={isMobile ? 'small' : 'medium'}
                />
            </Box>
        </AuthenticatedLayout>
    );
};

export default QuestionsIndex;