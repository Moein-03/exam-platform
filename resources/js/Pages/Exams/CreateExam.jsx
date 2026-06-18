import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ExamForm from '@/Components/ExamForm';

const CreateExam = () => {
     return (
          <AuthenticatedLayout header="ایجاد آزمون جدید">
               <ExamForm />
          </AuthenticatedLayout>
     );
}

export default CreateExam;