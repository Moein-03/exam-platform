import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ExamForm from '@/Components/ExamForm';

const CreateExam = ({isTeacher, auth}) => {
     return (
          <AuthenticatedLayout user={auth.user} header="ایجاد آزمون جدید" isTeacher={isTeacher}>
               <ExamForm/>
          </AuthenticatedLayout>
     );
}

export default CreateExam;