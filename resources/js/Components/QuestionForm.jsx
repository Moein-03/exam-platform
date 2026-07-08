import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import {
    TextField, Button, MenuItem, Grid, Paper, Typography,
    FormControl, InputLabel, Select, FormHelperText,
    Chip, Box
} from '@mui/material';
import { toast } from 'react-toastify';

const validationSchema = yup.object({
    text: yup.string().required('متن سوال الزامی است'),
    type: yup.string().oneOf(['multiple_choice', 'true_false', 'essay']).required(),
    options: yup.array().when('type', {
        is: 'multiple_choice',
        then: () => yup.array().of(yup.string()).min(2, 'حداقل ۲ گزینه وارد کنید').required('گزینه‌ها الزامی هستند'),
        otherwise: () => yup.array().nullable()
    }),
    correct_answer: yup.string().required('پاسخ صحیح الزامی است'),
    score: yup.number().min(0, 'نمره نمی‌تواند منفی باشد').required('نمره الزامی است'),
    explanation: yup.string().nullable(),
});

const QuestionForm = ({ question }) => {
    const isEditing = !!question;

    const formik = useFormik({
        initialValues: {
            text: question?.text || '',
            type: question?.type || 'multiple_choice',
            options: question?.options || ['', ''],
            correct_answer: question?.correct_answer || '',
            score: question?.score || '',
            explanation: question?.explanation || '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const url = isEditing ? `/questions/${question.id}` : '/questions';
                const method = isEditing ? 'put' : 'post';
                
                const payload = { ...values };
                if (payload.type !== 'multiple_choice') {
                    payload.options = null;
                }

                await axios[method](url, payload);
                toast.success(isEditing ? 'سوال با موفقیت ویرایش شد' : 'سوال با موفقیت ایجاد شد');
                setTimeout(() => {
                    window.location.href = '/questions';
                }, 500);
            } catch (error) {
                toast.error('خطا در ذخیره سوال');
                console.error(error.response?.data || error);
            }
        }
    });

    const addOption = () => {
        formik.setFieldValue('options', [...formik.values.options, '']);
    };

    const removeOption = (index) => {
        const newOptions = formik.values.options.filter((_, i) => i !== index);
        formik.setFieldValue('options', newOptions);
        if (!newOptions.includes(formik.values.correct_answer)) {
            formik.setFieldValue('correct_answer', '');
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formik.values.options];
        newOptions[index] = value;
        formik.setFieldValue('options', newOptions);
    };

    return (
        <Paper sx={{ p: 3, direction: 'rtl' }}>
            <Typography variant="h5" gutterBottom>
                {isEditing ? 'ویرایش سوال' : 'سوال جدید'}
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            name="text"
                            label="متن سوال"
                            value={formik.values.text}
                            onChange={formik.handleChange}
                            error={formik.touched.text && Boolean(formik.errors.text)}
                            helperText={formik.touched.text && formik.errors.text}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={formik.touched.type && Boolean(formik.errors.type)}>
                            <InputLabel>نوع سوال</InputLabel>
                            <Select
                                name="type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                label="نوع سوال"
                            >
                                <MenuItem value="multiple_choice">گزینه‌ای</MenuItem>
                                <MenuItem value="true_false">صحیح / غلط</MenuItem>
                                <MenuItem value="essay">تشریحی</MenuItem>
                            </Select>
                            <FormHelperText>{formik.touched.type && formik.errors.type}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="number"
                            name="score"
                            label="نمره"
                            value={formik.values.score}
                            onChange={formik.handleChange}
                            error={formik.touched.score && Boolean(formik.errors.score)}
                            helperText={formik.touched.score && formik.errors.score}
                        />
                    </Grid>

                    {formik.values.type === 'multiple_choice' && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                گزینه‌ها
                            </Typography>
                            {formik.values.options.map((opt, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                    <TextField
                                        fullWidth
                                        label={`گزینه ${index + 1}`}
                                        value={opt}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        error={formik.touched.options && Boolean(formik.errors.options?.[index])}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => removeOption(index)}
                                        disabled={formik.values.options.length <= 2}
                                    >
                                        حذف
                                    </Button>
                                </Box>
                            ))}
                            <Button variant="outlined" onClick={addOption}>
                                افزودن گزینه
                            </Button>
                            {formik.touched.options && formik.errors.options && (
                                <Typography color="error" variant="caption">
                                    {formik.errors.options}
                                </Typography>
                            )}
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            name="correct_answer"
                            label="پاسخ صحیح"
                            value={formik.values.correct_answer}
                            onChange={formik.handleChange}
                            error={formik.touched.correct_answer && Boolean(formik.errors.correct_answer)}
                            helperText={formik.touched.correct_answer && formik.errors.correct_answer}
                            placeholder={
                                formik.values.type === 'multiple_choice' ? 'مثلاً: A' :
                                formik.values.type === 'true_false' ? 'true یا false' :
                                'پاسخ صحیح را وارد کنید'
                            }
                        />
                        {formik.values.type === 'multiple_choice' && (
                            <Chip
                                label="پاسخ صحیح باید یکی از گزینه‌ها باشد"
                                size="small"
                                color="info"
                                sx={{ mt: 1 }}
                            />
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            name="explanation"
                            label="توضیح (بازخورد)"
                            value={formik.values.explanation}
                            onChange={formik.handleChange}
                            helperText="این توضیح بعد از پاسخ‌دهی به دانشجو نمایش داده می‌شود (اختیاری)"
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            {isEditing ? 'به‌روزرسانی' : 'ایجاد سوال'}
                        </Button>
                    </Grid>
                    <Button
                        variant="outlined"
                        href="/questions"
                        sx={{ width: '130px', height: '50px' }}
                    >
                        بازگشت به لیست
                    </Button>
                </Grid>
            </form>
        </Paper>
    );
};

export default QuestionForm;