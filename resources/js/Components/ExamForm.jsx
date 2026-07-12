import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { TextField, Button, FormControlLabel, Switch, MenuItem, Grid, Paper, Typography, Alert } from '@mui/material';
import { toast } from 'react-toastify';

const validationSchema = yup.object({
    title: yup.string().required('عنوان الزامی است'),
    exam_date: yup.date().required('تاریخ الزامی است'),
    start_time: yup.string().required('زمان شروع الزامی است'),
    duration_min: yup.number().min(1, 'حداقل 1 دقیقه').required(),
    question_count: yup.number().min(1).required(),
    total_score: yup.number().min(0).required(),
    category: yup.string(),
    question_selection_type: yup.string().oneOf(['manual', 'random']),
    allow_download: yup.boolean(),
    detailed_feedback: yup.boolean()
});

const ExamForm = ({ exam }) => {
    const isEditing = !!exam;
    const isDraft = exam?.status === 'پیش‌نویس';

    const formik = useFormik({
        initialValues: {
            title: exam?.title || '',
            description: exam?.description || '',
            exam_date: exam?.exam_date || '',
            start_time: exam?.start_time || '',
            duration_min: exam?.duration_min || '',
            question_count: exam?.question_count || '',
            total_score: exam?.total_score || '',
            category: exam?.category || '',
            question_selection_type: exam?.question_selection_type || 'manual',
            allow_download: exam?.allow_download || false,
            detailed_feedback: exam?.detailed_feedback ?? true
        },
        validationSchema,
        onSubmit: async (values) => {
            if (isEditing && !isDraft) {
                toast.error('فقط آزمون‌های با وضعیت پیش‌نویس قابل ویرایش هستند.');
                return;
            }

            try {
                const url = isEditing ? `/exams/${exam.slug}` : '/exams';
                const method = isEditing ? 'put' : 'post';
                
                const response = await axios[method](url, values);
                
                // اگر پاسخ موفق بود
                if (response.data) {
                    toast.success(response.data.message || (isEditing ? 'آزمون با موفقیت ویرایش شد' : 'آزمون با موفقیت ایجاد شد'));
                    
                    // ریدایرکت به صفحه نمایش آزمون
                    const slug = response.data.slug || exam?.slug;
                    if (slug) {
                        window.location.href = `/exams/${slug}`;
                    } else {
                        window.location.href = '/exams';
                    }
                }
            } catch (error) {
                // مدیریت خطاهای مختلف
                let errorMessage = 'خطا در ذخیره آزمون';
                
                if (error.response) {
                    // سرور با خطا پاسخ داده 
                    if (error.response.status === 404) {
                        errorMessage = 'آزمون مورد نظر یافت نشد. ممکن است حذف شده باشد.';
                    } else if (error.response.status === 403) {
                        errorMessage = 'شما اجازه ویرایش این آزمون را ندارید.';
                    } else if (error.response.data?.error) {
                        errorMessage = error.response.data.error;
                    } else if (error.response.status === 422) {
                        const errors = error.response.data.errors;
                        if (errors) {
                            const firstError = Object.values(errors)[0]?.[0];
                            errorMessage = firstError || 'خطا در اعتبارسنجی اطلاعات';
                        }
                    }
                } else if (error.request) {
                    errorMessage = 'ارتباط با سرور برقرار نشد.';
                }
                
                toast.error(errorMessage);
                console.error('Error details:', error);
            }
        }
    });

    // اگر درحال ویرایش است و وضعیت پیش‌نویس نیست، هشدار بده
    if (isEditing && !isDraft) {
        return (
            <Paper sx={{ p: 3, direction: 'rtl' }}>
                <Alert severity="warning">
                    این آزمون در وضعیت <strong>{exam.status}</strong> است و قابل ویرایش نمی‌باشد.
                </Alert>
                <Button variant="outlined" href={`/exams/${exam.slug}`} sx={{ mt: 2 }}>
                    بازگشت به صفحه آزمون
                </Button>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, direction: 'rtl' }}>
            <Typography variant="h5" gutterBottom>
                {isEditing ? 'ویرایش آزمون' : 'آزمون جدید'}
            </Typography>
            {isEditing && isDraft && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    این آزمون در وضعیت پیش‌نویس است و قابل ویرایش می‌باشد.
                </Alert>
            )}
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="title"
                            label="عنوان آزمون"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            name="description"
                            label="توضیحات"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type="date"
                            name="exam_date"
                            label="تاریخ برگزاری"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.exam_date}
                            onChange={formik.handleChange}
                            error={formik.touched.exam_date && Boolean(formik.errors.exam_date)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type="time"
                            name="start_time"
                            label="زمان شروع"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.start_time}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            type="number"
                            name="duration_min"
                            label="مدت (دقیقه)"
                            value={formik.values.duration_min}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            type="number"
                            name="question_count"
                            label="تعداد سوالات"
                            value={formik.values.question_count}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            type="number"
                            name="total_score"
                            label="نمره کل"
                            value={formik.values.total_score}
                            onChange={formik.handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            select
                            fullWidth
                            name="question_selection_type"
                            label="نحوه انتخاب سوالات"
                            value={formik.values.question_selection_type}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value="manual">دستی</MenuItem>
                            <MenuItem value="random">تصادفی</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth name="category" label="دسته‌بندی" value={formik.values.category} onChange={formik.handleChange} />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={<Switch name="allow_download" checked={formik.values.allow_download} onChange={formik.handleChange} />}
                            label="اجازه دانلود سوالات"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControlLabel
                            control={<Switch name="detailed_feedback" checked={formik.values.detailed_feedback} onChange={formik.handleChange} />}
                            label="نمایش بازخورد دقیق به دانشجو"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            {isEditing ? 'به‌روزرسانی' : 'ایجاد آزمون'}
                        </Button>
                    </Grid>
                    <Button
                        variant="outlined"
                        href="/exams"
                        sx={{ width: '130px', height: '50px' }}
                    >
                        بازگشت به لیست
                    </Button>
                </Grid>
            </form>
        </Paper>
    );
};

export default ExamForm;