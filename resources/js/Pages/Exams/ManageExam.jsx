import { useState, useMemo } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
     Box, Paper, Typography, Grid, Checkbox, FormControlLabel,
     Button, Divider, Alert, Chip, CircularProgress,
     Card, CardContent, TextField, InputAdornment,
     Stack, Tooltip, IconButton, Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { toast } from 'react-toastify';

const ManageExam = ({ isTeacher, auth, exam, students, selectedStudents, allQuestions, selectedQuestions }) => {
     const [selectedStudentIds, setSelectedStudentIds] = useState(selectedStudents || []);
     const [selectedQuestionIds, setSelectedQuestionIds] = useState(selectedQuestions || []);
     const [loading, setLoading] = useState(false);

     // جستجو
     const [searchStudent, setSearchStudent] = useState('');
     const [searchQuestion, setSearchQuestion] = useState('');

     // فیلتر دانشجوها بر اساس جستجو
     const filteredStudents = useMemo(() => {
          if (!searchStudent.trim()) return students;
          return students.filter(s =>
               s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
               s.email.toLowerCase().includes(searchStudent.toLowerCase())
          );
     }, [students, searchStudent]);

     // فیلتر سوالات بر اساس جستجو
     const filteredQuestions = useMemo(() => {
          if (!searchQuestion.trim()) return allQuestions;
          return allQuestions.filter(q =>
               q.text.toLowerCase().includes(searchQuestion.toLowerCase())
          );
     }, [allQuestions, searchQuestion]);

     // تغییر وضعیت انتخاب دانشجو
     const handleStudentToggle = (studentId) => {
          setSelectedStudentIds(prev =>
               prev.includes(studentId)
                    ? prev.filter(id => id !== studentId)
                    : [...prev, studentId]
          );
     };

     // تغییر وضعیت انتخاب سوال
     const handleQuestionToggle = (questionId) => {
          setSelectedQuestionIds(prev =>
               prev.includes(questionId)
                    ? prev.filter(id => id !== questionId)
                    : [...prev, questionId]
          );
     };

     // انتخاب/لغو همه دانشجوها
     const handleSelectAllStudents = () => {
          if (selectedStudentIds.length === students.length) {
               setSelectedStudentIds([]);
          } else {
               setSelectedStudentIds(students.map(s => s.id));
          }
     };

     // انتخاب/لغو همه سوالات
     const handleSelectAllQuestions = () => {
          if (selectedQuestionIds.length === allQuestions.length) {
               setSelectedQuestionIds([]);
          } else {
               setSelectedQuestionIds(allQuestions.map(q => q.id));
          }
     };

     // ذخیره تغییرات
     const handleSubmit = async () => {
          if (selectedStudentIds.length === 0) {
               toast.warning('حداقل یک دانشجو را انتخاب کنید');
               return;
          }
          if (selectedQuestionIds.length === 0) {
               toast.warning('حداقل یک سوال را انتخاب کنید');
               return;
          }

          setLoading(true);
          try {
               await axios.post(`/exams/${exam.slug}/manage-exam`, {
                    students: selectedStudentIds,
                    questions: selectedQuestionIds
               });
               toast.success('آزمون با موفقیت فعال شد');
               window.location.href = `/exams/${exam.slug}`;
          } catch (error) {
               toast.error('خطا در ذخیره تغییرات');
               console.error(error);
               setLoading(false);
          }
     };

     // نوع سوال به فارسی
     const getTypeLabel = (type) => {
          const types = {
               multiple_choice: 'چهار گزینه‌ای',
               true_false: 'صحیح/غلط',
               essay: 'تشریحی'
          };
          return types[type] || type;
     };

     return (
          <AuthenticatedLayout user={auth.user} header={`مدیریت آزمون: ${exam.title}`} isTeacher={isTeacher}>
               <Box sx={{ p: { xs: 2, md: 3 }, direction: 'rtl' }}>
                    {/* وضعیت فعلی */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                         <Grid container spacing={2} alignItems="center">
                         <Grid item xs={12} md={6}>
                              <Typography variant="h6" gutterBottom>
                                   وضعیت فعلی:
                                   <Chip
                                        label={exam.status}
                                        color={exam.status === 'فعال' ? 'success' : 'warning'}
                                        sx={{ mr: 1 }}
                                   />
                              </Typography>
                         </Grid>
                         <Grid item xs={12} md={6}>
                              <Alert severity="info" sx={{ '& .MuiAlert-message': { width: '100%' } }}>
                                   با انتخاب دانشجوها و سوالات، وضعیت آزمون به <strong>فعال</strong> تغییر خواهد کرد.
                              </Alert>
                         </Grid>
                         </Grid>
                    </Paper>

                    <Grid container spacing={3}>
                         {/* بخش دانشجوها */}
                         <Grid item xs={12} lg={6}>
                         <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                             دانشجوها
                                             <Badge badgeContent={selectedStudentIds.length} color="primary" showZero>
                                             <Chip
                                                  label={students.length}
                                                  size="small"
                                                  variant="outlined"
                                             />
                                             </Badge>
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                             <Button
                                                  size="small"
                                                  variant="outlined"
                                                  onClick={handleSelectAllStudents}
                                             >
                                                  {selectedStudentIds.length === students.length ? 'لغو همه' : 'انتخاب همه'}
                                             </Button>
                                        </Box>
                                   </Box>

                                   {/* جستجوی دانشجو */}
                                   <TextField
                                        size="small"
                                        placeholder="جستجوی دانشجو..."
                                        value={searchStudent}
                                        onChange={(e) => setSearchStudent(e.target.value)}
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                             startAdornment: (
                                             <InputAdornment position="start">
                                                  <SearchIcon />
                                             </InputAdornment>
                                             ),
                                             endAdornment: searchStudent && (
                                             <InputAdornment position="end">
                                                  <IconButton size="small" onClick={() => setSearchStudent('')}>
                                                       <ClearIcon />
                                                  </IconButton>
                                             </InputAdornment>
                                             )
                                        }}
                                   />

                                   <Divider sx={{ mb: 2 }} />

                                   {/* لیست دانشجوها */}
                                   <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 400 }}>
                                        {filteredStudents.length === 0 ? (
                                             <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                                             {searchStudent ? 'دانشجویی با این مشخصات یافت نشد' : 'هیچ دانشجویی یافت نشد'}
                                             </Typography>
                                        ) : (
                                             <Grid container spacing={1}>
                                             {filteredStudents.map(student => (
                                                       <Grid item xs={12} key={student.id}>
                                                            <Paper
                                                                 variant="outlined"
                                                                 sx={{
                                                                      p: 1.5,
                                                                      display: 'flex',
                                                                      alignItems: 'center',
                                                                      justifyContent: 'space-between',
                                                                      bgcolor: selectedStudentIds.includes(student.id) ? 'action.selected' : 'transparent',
                                                                      transition: 'all 0.2s',
                                                                      '&:hover': {
                                                                           bgcolor: selectedStudentIds.includes(student.id) ? 'action.selected' : 'action.hover',
                                                                      },
                                                                      flexWrap: 'wrap',
                                                                      gap: 1
                                                                 }}
                                                            >
                                                                 <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                      <Tooltip title={student.name} arrow>
                                                                      <Typography variant="body1" sx={{ fontWeight: selectedStudentIds.includes(student.id) ? 'bold' : 'normal' }}>
                                                                           {student.name}
                                                                      </Typography>
                                                                      </Tooltip>
                                                                      <Tooltip title={student.email} arrow>
                                                                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                                           {student.email}
                                                                      </Typography>
                                                                      </Tooltip>
                                                                 </Box>
                                                                 <Checkbox
                                                                      checked={selectedStudentIds.includes(student.id)}
                                                                      onChange={() => handleStudentToggle(student.id)}
                                                                      color="primary"
                                                                      size="medium"
                                                                 />
                                                            </Paper>
                                                       </Grid>
                                                  ))}
                                             </Grid>
                                        )}
                                   </Box>
                              </CardContent>
                         </Card>
                         </Grid>

                         {/* بخش سوالات */}
                         <Grid item xs={12} lg={6}>
                         <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                                        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                             سوالات
                                             <Badge badgeContent={selectedQuestionIds.length} color="primary" showZero>
                                             <Chip
                                                  label={allQuestions.length}
                                                  size="small"
                                                  variant="outlined"
                                             />
                                             </Badge>
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                             <Button
                                                  size="small"
                                                  variant="outlined"
                                                  onClick={handleSelectAllQuestions}
                                             >
                                                  {selectedQuestionIds.length === allQuestions.length ? 'لغو همه' : 'انتخاب همه'}
                                             </Button>
                                        </Box>
                                   </Box>

                                   {/* جستجوی سوالات */}
                                   <TextField
                                        size="small"
                                        placeholder="جستجوی سوال..."
                                        value={searchQuestion}
                                        onChange={(e) => setSearchQuestion(e.target.value)}
                                        sx={{ mb: 2 }}
                                        InputProps={{
                                             startAdornment: (
                                                  <InputAdornment position="start">
                                                       <SearchIcon />
                                                  </InputAdornment>
                                             ),
                                             endAdornment: searchQuestion && (
                                                  <InputAdornment position="end">
                                                       <IconButton size="small" onClick={() => setSearchQuestion('')}>
                                                            <ClearIcon />
                                                       </IconButton>
                                                  </InputAdornment>
                                             )
                                        }}
                                   />

                                   <Divider sx={{ mb: 2 }} />

                                   {/* لیست سوالات */}
                                   <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 400 }}>
                                        {filteredQuestions.length === 0 ? (
                                             <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                                                  {searchQuestion ? 'سوالی با این مشخصات یافت نشد' : 'هیچ سوالی ایجاد نکرده‌اید'}
                                             </Typography>
                                        ) : (
                                             <Grid container spacing={1}>
                                             {filteredQuestions.map(question => (
                                                  <Grid item xs={12} key={question.id}>
                                                       <Paper
                                                            variant="outlined"
                                                            sx={{
                                                                 p: 1.5,
                                                                 display: 'flex',
                                                                 alignItems: 'center',
                                                                 justifyContent: 'space-between',
                                                                 bgcolor: selectedQuestionIds.includes(question.id) ? 'action.selected' : 'transparent',
                                                                 transition: 'all 0.2s',
                                                                 '&:hover': {
                                                                      bgcolor: selectedQuestionIds.includes(question.id) ? 'action.selected' : 'action.hover',
                                                                 },
                                                                 flexWrap: 'wrap',
                                                                 gap: 1
                                                            }}
                                                       >
                                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                 <Tooltip title={question.text} arrow>
                                                                 <Typography
                                                                      variant="body1"
                                                                      sx={{
                                                                           fontWeight: selectedQuestionIds.includes(question.id) ? 'bold' : 'normal',
                                                                           display: '-webkit-box',
                                                                           WebkitLineClamp: 2,
                                                                           WebkitBoxOrient: 'vertical',
                                                                           overflow: 'hidden',
                                                                           textOverflow: 'ellipsis'
                                                                      }}
                                                                 >
                                                                      {question.text}
                                                                 </Typography>
                                                                 </Tooltip>
                                                                 <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                                                                 <Chip
                                                                      label={getTypeLabel(question.type)}
                                                                      size="small"
                                                                      variant="outlined"
                                                                 />
                                                                 <Chip
                                                                      label={`نمره: ${question.score}`}
                                                                      size="small"
                                                                      variant="outlined"
                                                                      color="secondary"
                                                                 />
                                                                 </Stack>
                                                            </Box>
                                                            <Checkbox
                                                                 checked={selectedQuestionIds.includes(question.id)}
                                                                 onChange={() => handleQuestionToggle(question.id)}
                                                                 color="primary"
                                                                 size="medium"
                                                            />
                                                       </Paper>
                                                  </Grid>
                                             ))}
                                             </Grid>
                                        )}
                                   </Box>
                              </CardContent>
                         </Card>
                         </Grid>
                    </Grid>

                    {/* دکمه‌های عملیات */}
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
                         <Button
                              variant="outlined"
                              href={`/exams/${exam.slug}`}
                         >
                         بازگشت
                         </Button>
                         <Button
                              variant="contained"
                              color="success"
                              onClick={handleSubmit}
                              disabled={loading}
                              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                              sx={{ minWidth: 150 }}
                         >
                              {loading ? 'در حال ذخیره...' : 'فعال‌سازی آزمون'}
                         </Button>
                    </Box>
               </Box>
          </AuthenticatedLayout>
     );
};

export default ManageExam;