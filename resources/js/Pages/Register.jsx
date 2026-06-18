import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Container, Paper, TextField, Button, Typography, IconButton, InputAdornment, Alert, CircularProgress, MenuItem, FormControl, InputLabel, Select, FormHelperText } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const validationSchema = yup.object({
     name: yup.string().required('نام کامل الزامی است').min(3, 'حداقل ۳ کاراکتر'),
     email: yup.string().email('ایمیل نامعتبر است').required('ایمیل الزامی است'),
     password: yup.string().required('رمز عبور الزامی است').min(6, 'حداقل ۶ کاراکتر'),
     password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'رمز عبور با تکرار آن مطابقت ندارد').required('تکرار رمز عبور الزامی است'),
     role: yup.string().oneOf(['student', 'teacher']).required('نقش خود را انتخاب کنید'),
     university_id: yup.string().nullable(),
});

const Register = () => {
     const [showPassword, setShowPassword] = useState(false);
     const [showConfirm, setShowConfirm] = useState(false);
     const [error, setError] = useState('');

     const formik = useFormik({
          initialValues: {
               name: '',
               email: '',
               password: '',
               password_confirmation: '',
               role: 'student',
               university_id: '',
          },
          validationSchema,
          onSubmit: async (values, { setSubmitting }) => {
               setError('');
               try {
                    await axios.get('/sanctum/csrf-cookie');
                    await axios.post('/register', values, {
                         headers: { 'Content-Type': 'application/json' },
                         withCredentials: true,
                    });
                    toast.success('ثبت‌نام موفق! در حال انتقال به صفحه ورود...');
                    setTimeout(() => {
                         window.location.href = '/login';
                    }, 1500);
               } catch (err) {
                    if (err.response?.status === 422) {
                         const errors = err.response.data.errors;
                         const firstError = Object.values(errors)[0]?.[0] || 'خطای اعتبارسنجی';
                         setError(firstError);
                    } else {
                         setError('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
                    }
                    toast.error('ثبت‌نام ناموفق');
               } finally {
                    setSubmitting(false);
               }
          }
     });

     return (
          <Box
               sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    py: 4
               }}
          >
               <Container maxWidth="sm">
                    <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                         <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
                              ثبت‌ نام در پلتفرم 
                         </Typography>
                         <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
                              همین حالا عضو شوید و از خدمات ما بهره‌مند شوید.
                         </Typography>

                         {error && (
                              <Alert severity="error" sx={{ mb: 2 }}>
                                   {error}
                              </Alert>
                         )}

                         <form onSubmit={formik.handleSubmit}>
                              <TextField
                                   fullWidth
                                   name="name"
                                   label="نام کامل"
                                   variant="outlined"
                                   margin="normal"
                                   value={formik.values.name}
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                                   error={formik.touched.name && Boolean(formik.errors.name)}
                                   helperText={formik.touched.name && formik.errors.name}
                                   autoComplete="name"
                              />
                              <TextField
                                   fullWidth
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
                                   autoComplete="new-password"
                                   dir="ltr"
                                   InputProps={{
                                        endAdornment: (
                                             <InputAdornment position="end">
                                                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                                  </IconButton>
                                             </InputAdornment>
                                        )
                                   }}
                              />
                              <TextField
                                   fullWidth
                                   name="password_confirmation"
                                   label="تکرار رمز عبور"
                                   type={showConfirm ? 'text' : 'password'}
                                   variant="outlined"
                                   margin="normal"
                                   value={formik.values.password_confirmation}
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                                   error={formik.touched.password_confirmation && Boolean(formik.errors.password_confirmation)}
                                   helperText={formik.touched.password_confirmation && formik.errors.password_confirmation}
                                   autoComplete="new-password"
                                   dir="ltr"
                                   InputProps={{
                                        endAdornment: (
                                             <InputAdornment position="end">
                                                  <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                                                       {showConfirm ? <VisibilityOff /> : <Visibility />}
                                                  </IconButton>
                                             </InputAdornment>
                                        )
                                   }}
                              />
                              <FormControl fullWidth margin="normal" error={formik.touched.role && Boolean(formik.errors.role)}>
                                   <InputLabel id="role-label">نقش شما</InputLabel>
                                   <Select
                                        labelId="role-label"
                                        name="role"
                                        value={formik.values.role}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        label="نقش شما"
                                   >
                                        <MenuItem value="student">دانشجو</MenuItem>
                                        <MenuItem value="teacher">استاد</MenuItem>
                                   </Select>
                                   <FormHelperText>{formik.touched.role && formik.errors.role}</FormHelperText>
                              </FormControl>
                              <TextField
                                   fullWidth
                                   name="university_id"
                                   label="شماره دانشجویی / کد استادی"
                                   variant="outlined"
                                   margin="normal"
                                   value={formik.values.university_id}
                                   onChange={formik.handleChange}
                                   onBlur={formik.handleBlur}
                                   error={formik.touched.university_id && Boolean(formik.errors.university_id)}
                                   helperText={formik.touched.university_id && formik.errors.university_id}
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
                                   {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'ثبت‌نام'}
                              </Button>
                              <Typography align="center" variant="body2">
                                   قبلاً ثبت‌ نام کرده‌اید؟{' '}
                                   <Button href="/login" color="secondary" sx={{ textTransform: 'none' }}>
                                        وارد شوید
                                   </Button>
                              </Typography>
                         </form>
                    </Paper>
               </Container>
          </Box>
     );
}

export default Register;