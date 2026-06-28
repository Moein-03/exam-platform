import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ExamForm from '@/Components/ExamForm';

const CreateExam = ({auth}) => {
     return (
          <AuthenticatedLayout user={auth.user} header="ایجاد آزمون جدید">
               <ExamForm/>
          </AuthenticatedLayout>
     );
}

export default CreateExam;