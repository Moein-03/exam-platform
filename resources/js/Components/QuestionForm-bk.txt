import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import {
    TextField, Button, MenuItem, Grid, Paper, Typography,
    FormControl, InputLabel, Select, FormHelperText,
    Chip, Box, Stack
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
        const letter = String.fromCharCode(65 + index);
        if (formik.values.correct_answer === letter) {
            formik.setFieldValue('correct_answer', '');
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formik.values.options];
        newOptions[index] = value;
        formik.setFieldValue('options', newOptions);
    };

    const getOptionLetter = (index) => String.fromCharCode(65 + index);

    return (
        <Paper sx={{ p: { xs: 2, sm: 3 }, direction: 'rtl', maxWidth: '100%', overflow: 'hidden' }}>
            <Typography variant="h5" gutterBottom>
                {isEditing ? 'ویرایش سوال' : 'سوال جدید'}
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    {/* متن سوال */}
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

                    {/* نوع سوال و نمره */}
                    <Grid item xs={12} sm={6}>
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

                    <Grid item xs={12} sm={6}>
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

                    {/* گزینه‌ها - فقط برای نوع گزینه‌ای */}
                    {formik.values.type === 'multiple_choice' && (
                        <Grid item xs={12} /* sx={{ marginRight: '50px' }} */>
                            <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                                گزینه‌ها
                            </Typography>
                            
                            <Stack spacing={1.5}>
                                {formik.values.options.map((opt, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                            gap: 1,
                                            '& .MuiTextField-root': {
                                                flex: '1 1 200px',
                                                minWidth: '120px',
                                            },
                                        }}
                                    >
                                        <Chip label={getOptionLetter(index)} size="small" sx={{ flexShrink: 0 }} />
                                        <TextField
                                            label={`گزینه ${index + 1}`}
                                            value={opt}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            error={formik.touched.options && Boolean(formik.errors.options?.[index])}
                                            size="small"
                                        />
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => removeOption(index)}
                                            disabled={formik.values.options.length <= 2}
                                            sx={{ flexShrink: 0, minWidth: '60px' }}
                                        >
                                            حذف
                                        </Button>
                                    </Box>
                                ))}
                            </Stack>
                            
                            <Button variant="outlined" onClick={addOption} sx={{ mt: 2 }}>
                                افزودن گزینه
                            </Button>
                            
                            {formik.touched.options && formik.errors.options && (
                                <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
                                    {formik.errors.options}
                                </Typography>
                            )}
                        </Grid>
                    )}

                    {/* انتخاب پاسخ صحیح - با ارتفاع ثابت */}
                    <Grid item xs={12} sx={{ display: 'block' }}>
                        <Box sx={{ minHeight: '90px' }}>
                            {formik.values.type === 'multiple_choice' ? (
                                <FormControl 
                                    fullWidth 
                                    error={formik.touched.correct_answer && Boolean(formik.errors.correct_answer)}
                                    disabled={formik.values.options.some(opt => opt.trim() === '')}
                                >
                                    <InputLabel>پاسخ صحیح</InputLabel>
                                    <Select
                                        name="correct_answer"
                                        value={formik.values.correct_answer}
                                        onChange={formik.handleChange}
                                        label="پاسخ صحیح"
                                        sx={{ minWidth: '150px' }}
                                    >
                                        {formik.values.options.map((opt, index) => {
                                            const letter = getOptionLetter(index);
                                            return (
                                                <MenuItem key={index} value={letter}>
                                                    {letter} - {opt || '(خالی)'}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                    <FormHelperText>
                                        {formik.touched.correct_answer && formik.errors.correct_answer}
                                        {formik.values.options.some(opt => opt.trim() === '') && ' • لطفاً ابتدا گزینه‌ها را تکمیل کنید'}
                                    </FormHelperText>
                                </FormControl>
                            ) : formik.values.type === 'true_false' ? (
                                <FormControl fullWidth error={formik.touched.correct_answer && Boolean(formik.errors.correct_answer)}>
                                    <InputLabel>پاسخ صحیح</InputLabel>
                                    <Select
                                        name="correct_answer"
                                        value={formik.values.correct_answer}
                                        onChange={formik.handleChange}
                                        label="پاسخ صحیح"
                                        sx={{ minWidth: '150px' }}
                                    >
                                        <MenuItem value="true">درست</MenuItem>
                                        <MenuItem value="false">نادرست</MenuItem>
                                    </Select>
                                    <FormHelperText>{formik.touched.correct_answer && formik.errors.correct_answer}</FormHelperText>
                                </FormControl>
                            ) : (
                                <TextField
                                    fullWidth
                                    name="correct_answer"
                                    label="پاسخ صحیح"
                                    value={formik.values.correct_answer}
                                    onChange={formik.handleChange}
                                    error={formik.touched.correct_answer && Boolean(formik.errors.correct_answer)}
                                    helperText={formik.touched.correct_answer && formik.errors.correct_answer}
                                    placeholder="پاسخ صحیح را وارد کنید"
                                />
                            )}
                        </Box>
                    </Grid>

                    {/* توضیحات (بازخورد) */}
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

                    {/* دکمه‌های عملیات */}
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 2,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                mt: 1,
                            }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ minWidth: '120px' }}
                            >
                                {isEditing ? 'به‌روزرسانی' : 'ایجاد سوال'}
                            </Button>
                            <Button
                                variant="outlined"
                                href="/questions"
                                sx={{ minWidth: '100px' }}
                            >
                                بازگشت به لیست
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default QuestionForm;