import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Timer from '../../Components/Timer';
import {
    Box, Paper, Typography, Grid, Button,
    Radio, RadioGroup, FormControlLabel,
    FormControl, TextField, Alert, CircularProgress,
    Divider
} from '@mui/material';
import { toast } from 'react-toastify';

const TakeExam = ({ isTeacher, auth, exam: initialExam, questions: initialQuestions }) => {
    const [exam, setExam] = useState(initialExam || null);
    const [questions, setQuestions] = useState(initialQuestions || []);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(!initialExam);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!initialExam) {
            const slug = window.location.pathname.split('/').slice(-2, -1)[0];
            axios.get(`/exams/${slug}/start`)
                .then(res => {
                    setExam(res.data.exam);
                    setQuestions(res.data.questions);
                    setLoading(false);
                })
                .catch(err => {
                    toast.error('خطا در بارگذاری آزمون');
                    setLoading(false);
                });
        }
    }, [initialExam]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);

        const totalQuestions = questions.length;
        const answeredCount = Object.keys(answers).length;
        if (answeredCount < totalQuestions) {
            const confirmSubmit = confirm(
                `شما به ${answeredCount} از ${totalQuestions} سوال پاسخ داده‌اید. آیا مطمئن هستید؟`
            );
            if (!confirmSubmit) {
                setSubmitting(false);
                return;
            }
        }

        try {
            await axios.post(`/exams/${exam.slug}/submit`, { answers });
            toast.success('پاسخ‌ها با موفقیت ثبت شد');
            window.location.href = `/exams/${exam.slug}/results`;
        } catch (error) {
            toast.error('خطا در ثبت پاسخ‌ها');
            console.error(error);
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout user={auth.user} header="بارگذاری..." isTeacher={isTeacher}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            </AuthenticatedLayout>
        );
    }

    if (!exam || !questions.length) {
        return (
            <AuthenticatedLayout user={auth.user} header="خطا">
                <Alert severity="error">آزمون یافت نشد یا سوالی ندارد</Alert>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout user={auth.user} header={`شرکت در آزمون: ${exam.title}`}>
            <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Typography variant="h5">{exam.title}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {exam.description}
                            </Typography>
                            <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 1 }}>
                                تعداد سوالات: {questions.length} | نمره کل: {exam.total_score}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Timer
                                initialSeconds={exam.duration_min * 60}
                                onTimeout={handleSubmit}
                                autoSubmit={true}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ p: 3 }}>
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        {questions.map((q, index) => (
                            <Box key={q.id} sx={{ mb: 4 }}>
                                <Typography variant="h6">
                                    سوال {index + 1}: {q.text}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    نمره: {q.score}
                                </Typography>

                                <Box sx={{ mt: 2 }}>
                                    {q.type === 'multiple_choice' && (
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                value={answers[q.id] || ''}
                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            >
                                                {q.options?.map((opt, i) => (
                                                    <FormControlLabel
                                                        key={i}
                                                        value={String.fromCharCode(65 + i)}
                                                        control={<Radio />}
                                                        label={opt}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    )}

                                    {q.type === 'true_false' && (
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                value={answers[q.id] || ''}
                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            >
                                                <FormControlLabel value="true" control={<Radio />} label="درست" />
                                                <FormControlLabel value="false" control={<Radio />} label="نادرست" />
                                            </RadioGroup>
                                        </FormControl>
                                    )}

                                    {q.type === 'essay' && (
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={answers[q.id] || ''}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            placeholder="پاسخ خود را بنویسید..."
                                        />
                                    )}
                                </Box>
                                <Divider sx={{ mt: 2 }} />
                            </Box>
                        ))}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                disabled={submitting}
                                size="large"
                            >
                                {submitting ? 'در حال ارسال...' : 'ثبت پاسخ‌ها'}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </AuthenticatedLayout>
    );
};

export default TakeExam;