import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ExamForm from '@/Components/ExamForm';

const EditExam = ({ isTeacher, auth, exam }) => {
    return (
        <AuthenticatedLayout user={auth.user} header="ویرایش آزمون" isTeacher={isTeacher}>
            <ExamForm exam={exam} />
        </AuthenticatedLayout>
    );
};

export default EditExam;