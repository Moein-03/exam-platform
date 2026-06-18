import { useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import useExamStore from '@/stores/useExamStore';
import { Box, Paper, Typography, RadioGroup, FormControlLabel, Radio, Button, LinearProgress, Alert } from '@mui/material';
import { toast } from 'react-toastify';

const TakeExam = ({ exam, questions }) => {
     const {
          currentIndex,
          answers,
          setAnswer,
          nextQuestion,
          prevQuestion,
          timeLeft,
          decrementTime,
          initExam,
          resetExam
     } = useExamStore();

     useEffect(() => {
          // مقداردهی اولیه استور آزموی
          initExam(exam.id, questions, exam.duration_min);
          const timer = setInterval(() => {
               decrementTime();
          }, 1000);
          return () => {
               clearInterval(timer);
               resetExam();
          };
     }, []);

     const currentQuestion = questions[currentIndex];
     const currentAnswer = answers.find(a => a.question_id === currentQuestion.id)?.answer || '';

     const handleAnswer = (e) => {
          setAnswer(currentQuestion.id, e.target.value);
     };

     const handleFinish = async () => {
          if (window.confirm('آیا از پایان آزمون اطمینان دارید؟')) {
               router.post(route('exams.submit', exam.slug), { answers: useExamStore.getState().answers }, {
                    onSuccess: () => {
                         toast.success('پاسخ‌های شما با موفقیت ثبت شد');
                         resetExam();
                    },
                    onError: () => toast.error('خطا در ثبت پاسخ')
               });
          }
     };

     const minutes = Math.floor(timeLeft / 60);
     const seconds = timeLeft % 60;

     if (timeLeft <= 0) {
          return (
               <Box sx={{ p: 3 }}>
                    <Alert severity="warning">زمان شما به پایان رسید. به زودی به صفحه نتایج هدایت می‌شوید.</Alert>
                    {handleFinish()}
               </Box>
          );
     }

     return (
          <Box sx={{ p: 3 }}>
               <Paper sx={{ p: 2, mb: 2 }}>
                    <Box display="flex" justifyContent="space-between">
                         <Typography variant="h6">زمان باقی‌مانده: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Typography>
                         <Typography variant="h6">سوال {currentIndex + 1} از {questions.length}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={(currentIndex + 1) / questions.length * 100} sx={{ mt: 1 }} />
               </Paper>
               <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>{currentQuestion.text}</Typography>
                    {currentQuestion.type === 'multiple_choice' && (
                         <RadioGroup value={currentAnswer} onChange={handleAnswer}>
                              {JSON.parse(currentQuestion.options).map((opt, idx) => (
                                   <FormControlLabel key={idx} value={opt} control={<Radio />} label={opt} />
                              ))}
                         </RadioGroup>
                    )}
                    {currentQuestion.type === 'true_false' && (
                         <RadioGroup value={currentAnswer} onChange={handleAnswer}>
                              <FormControlLabel value="true" control={<Radio />} label="صحیح" />
                              <FormControlLabel value="false" control={<Radio />} label="غلط" />
                         </RadioGroup>
                    )}
                    {currentQuestion.type === 'essay' && (
                         <textarea
                              value={currentAnswer}
                              onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                              rows={5}
                              style={{ width: '100%', padding: '8px' }}
                         />
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                         <Button variant="outlined" onClick={prevQuestion} disabled={currentIndex === 0}>قبلی</Button>
                         {currentIndex < questions.length - 1 ? (
                              <Button variant="contained" onClick={nextQuestion}>بعدی</Button>
                         ) : (
                              <Button variant="contained" color="success" onClick={handleFinish}>پایان آزمون</Button>
                         )}
                    </Box>
               </Paper>
          </Box>
     );
}

export default TakeExam;