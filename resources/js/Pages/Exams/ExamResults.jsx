import { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';

const ExamResults = ({ isTeacher, auth, exam, answers, score }) => {
     const chartRef = useRef(null);
     const correctCount = answers.filter(a => a.is_correct).length;
     const incorrectCount = answers.length - correctCount;
     const total = correctCount + incorrectCount;
     const correctPercent = total ? (correctCount / total) * 100 : 0;

     useEffect(() => {
          if (!chartRef.current) return;

          const pieData = [
               { name: 'صحیح', value: correctCount, color: '#4caf50', start: 0, end: (correctCount / total) * 2 * Math.PI },
               { name: 'غلط', value: incorrectCount, color: '#f44336', start: (correctCount / total) * 2 * Math.PI, end: 2 * Math.PI },
          ];

          const plot = Plot.plot({
               width: 300,
               height: 200,
               margin: 10,
               marks: [
                    Plot.arc(pieData.filter(d => d.name === 'صحیح'), {
                         x: 0,
                         y: 0,
                         r: 80,
                         startAngle: d => d.start,
                         endAngle: d => d.end,
                         fill: d => d.color,
                         stroke: 'white',
                    }),

                    Plot.arc(pieData.filter(d => d.name === 'غلط'), {
                         x: 0,
                         y: 0,
                         r: 80,
                         startAngle: d => d.start,
                         endAngle: d => d.end,
                         fill: d => d.color,
                         stroke: 'white',
                    }),

                    Plot.text([{ x: 0, y: 0, text: `${Math.round(correctPercent)}%` }], {
                         x: 'x',
                         y: 'y',
                         text: 'text',
                         textAnchor: 'middle',
                         fill: '#333',
                         fontSize: 18,
                         fontWeight: 'bold',
                    })
               ]
          });

          chartRef.current.appendChild(plot);
          return () => plot.remove();
     }, [correctCount, incorrectCount, total, correctPercent]);

     return (
          <AuthenticatedLayout user={auth.user} header={`نتیجه آزمون ${exam.title}`} isTeacher={isTeacher}>
               <Paper sx={{ p: 3, direction: 'rtl' }}>
                    <Typography variant="h5" gutterBottom>
                         نمره شما: {score} از {exam.total_score}
                    </Typography>

                    <Box display="flex" justifyContent="center" sx={{ my: 3 }}>
                         <div ref={chartRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
                    </Box>

                    <Box display="flex" justifyContent="center" gap={3} sx={{ mb: 3 }}>
                         <Box display="flex" alignItems="center" gap={1}>
                              <Box sx={{ width: 16, height: 16, bgcolor: '#4caf50', borderRadius: '50%' }} />
                              <Typography variant="body2">صحیح: {correctCount}</Typography>
                         </Box>
                         <Box display="flex" alignItems="center" gap={1}>
                              <Box sx={{ width: 16, height: 16, bgcolor: '#f44336', borderRadius: '50%' }} />
                              <Typography variant="body2">غلط: {incorrectCount}</Typography>
                         </Box>
                    </Box>

                    <TableContainer component={Paper}>
                         <Table>
                              <TableHead>
                                   <TableRow>
                                        <TableCell>سوال</TableCell>
                                        <TableCell>پاسخ شما</TableCell>
                                        <TableCell>پاسخ صحیح</TableCell>
                                        <TableCell>نتیجه</TableCell>
                                   </TableRow>
                              </TableHead>
                              <TableBody>
                                   {answers.map(answer => (
                                        <TableRow key={answer.id}>
                                             <TableCell>{answer.question.text}</TableCell>
                                             <TableCell>{answer.selected_answer}</TableCell>
                                             <TableCell>{answer.question.correct_answer}</TableCell>
                                             <TableCell>
                                                  <Chip
                                                  label={answer.is_correct ? 'صحیح' : 'غلط'}
                                                  color={answer.is_correct ? 'success' : 'error'}
                                                  />
                                             </TableCell>
                                        </TableRow>
                                   ))}
                              </TableBody>
                         </Table>
                    </TableContainer>

                    {exam.detailed_feedback && (
                         <Box mt={3}>
                              <Typography variant="h6">بازخورد سوالات</Typography>
                              {answers.map(
                                   answer => {
                                        answer.question.explanation && (
                                             <Paper key={answer.id} sx={{ p: 2, mt: 1 }}>
                                                  <Typography>
                                                       <strong>{answer.question.text}</strong>
                                                  </Typography>
                                                  <Typography>{answer.question.explanation}</Typography>
                                             </Paper>
                                        )
                                   }    
                              )}
                         </Box>
                    )}
               </Paper>
          </AuthenticatedLayout>
     );
}

export default ExamResults;