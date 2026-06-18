import { useState } from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Pagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

const ExamIndex = ({ exams, auth }) => {
     const [page, setPage] = useState(exams.current_page);

     const handleDelete = (id) => {
          if (confirm('آیا از حذف این آزمون اطمینان دارید؟')) {
                    router.delete(route('exams.destroy', id), {
                    onSuccess: () => toast.success('آزمون حذف شد'),
               });
          }
     };

     return (
          <AuthenticatedLayout user={auth.user} header="مدیریت آزمون‌ها">
               <Box sx={{ mb: 2 }}>
                    {auth.user.role === 'teacher' && (
                         <Button variant="contained" startIcon={<AddIcon />} component={Link} href={route('exams.create')}>
                         آزمون جدید
                         </Button>
                    )}
               </Box>
               <TableContainer component={Paper}>
                    <Table>
                         <TableHead>
                              <TableRow>
                                   <TableCell>عنوان</TableCell>
                                   <TableCell>تاریخ</TableCell>
                                   <TableCell>مدت (دقیقه)</TableCell>
                                   <TableCell>وضعیت</TableCell>
                                   <TableCell>عملیات</TableCell>
                              </TableRow>
                         </TableHead>
                         <TableBody>
                              {exams.data.map((exam) => (
                                   <TableRow key={exam.id}>
                                        <TableCell>{exam.title}</TableCell>
                                        <TableCell>{exam.exam_date}</TableCell>
                                        <TableCell>{exam.duration_min}</TableCell>
                                        <TableCell>
                                             <Chip label={exam.status} color={exam.status === 'فعال' ? 'success' : 'warning'} />
                                        </TableCell>
                                        <TableCell>
                                             <Button size="small" startIcon={<VisibilityIcon />} component={Link} href={route('exams.show', exam.slug)}>مشاهده</Button>
                                             {auth.user.role === 'teacher' && exam.created_by === auth.user.id && (
                                                  <>
                                                       <Button size="small" startIcon={<EditIcon />} component={Link} href={route('exams.edit', exam.id)}>ویرایش</Button>
                                                       <Button size="small" startIcon={<DeleteIcon />} onClick={() => handleDelete(exam.id)}>حذف</Button>
                                                  </>
                                             )}
                                             {auth.user.role === 'student' && exam.status === 'فعال' && (
                                                  <Button size="small" color="success" component={Link} href={route('exams.start', exam.slug)}>شروع آزمون</Button>
                                             )}
                                        </TableCell>
                                   </TableRow>
                              ))}
                         </TableBody>
                    </Table>
               </TableContainer>
               <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination count={exams.last_page} page={page} onChange={(e, val) => router.visit(route('exams.index', { page: val }))} />
               </Box>
          </AuthenticatedLayout>
     );
}

export default ExamIndex;