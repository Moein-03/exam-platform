import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Container, Paper, TextField, Button, Typography, IconButton, InputAdornment, Alert, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const validationSchema = yup.object({
     email: yup.string().email('ایمیل نامعتبر است').required('ایمیل الزامی است'),
     password: yup.string().required('رمز عبور الزامی است'),
});

const Login = () => {
     const [showPassword, setShowPassword] = useState(false);
     const [error, setError] = useState('');

     const formik = useFormik({
          initialValues: { email: '', password: '' },
          validationSchema,
          onSubmit: async (values, { setSubmitting }) => {
               setError('');
               try {
                    await axios.get('/sanctum/csrf-cookie');
                    const response = await axios.post('/login', values, {
                         headers: { 'Content-Type': 'application/json' },
                         withCredentials: true,
                    });
                    toast.success('ورود موفقیت‌آمیز! در حال انتقال به صفحه اصلی...');
                    setTimeout(() => {
                         window.location.href = '/';
                    }, 1000);
               } catch (err) {
                    if (err.response?.status === 422) {
                         setError('ایمیل یا رمز عبور اشتباه است.');
                    } else {
                         setError('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
                    }
                    toast.error('ورود ناموفق');
               } finally {
                    setSubmitting(false);
               }
          },
     });

     return (
          <Box
               sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    py: 4,
               }}
          >
               <Container maxWidth="sm">
                    <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                         <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
                              ورود به پلتفرم
                         </Typography>
                         <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
                              خوش آمدید! لطفاً اطلاعات خود را وارد کنید.
                         </Typography>

                         {error && (
                              <Alert severity="error" sx={{ mb: 2 }}>
                         {error}
                              </Alert>
                         )}

                         <form onSubmit={formik.handleSubmit}>
                              <TextField
                                   fullWidth
                                   id="email"
                                   name="email"
                                   label="ایمیل"
                                   variant="outlined"
                                   margin="normal"
                                   value={formik.values.email}
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                                   error={formik.touched.email && Boolean(formik.errors.email)}
                                   helperText={formik.touched.email && formik.errors.email}
                                   autoComplete="email"
                                   dir="ltr"
                              />
                              <TextField
                                   fullWidth
                                   id="password"
                                   name="password"
                                   label="رمز عبور"
                                   type={showPassword ? 'text' : 'password'}
                                   variant="outlined"
                                   margin="normal"
                                   value={formik.values.password}
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                                   error={formik.touched.password && Boolean(formik.errors.password)}
                                   helperText={formik.touched.password && formik.errors.password}
                                   autoComplete="current-password"
                                   dir="ltr"
                                   slotProps={{
                                        input: {
                                             endAdornment: (
                                                  <InputAdornment position="end">
                                                       <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                       </IconButton>
                                                  </InputAdornment>
                                             )
                                        }
                                   }}
                              />
                              <Button
                                   type="submit"
                                   fullWidth
                                   variant="contained"
                                   color="primary"
                                   size="large"
                                   disabled={formik.isSubmitting}
                                   sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
                              >
                                   {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'ورود'}
                              </Button>
                              <Typography align="center" variant="body2">
                                   حساب کاربری ندارید؟{' '}
                                   <Button href="/register" color="secondary" sx={{ textTransform: 'none' }}>
                                        ثبت‌نام کنید
                                   </Button>
                              </Typography>
                         </form>
                    </Paper>
               </Container>
          </Box>
     );
}

export default Login;