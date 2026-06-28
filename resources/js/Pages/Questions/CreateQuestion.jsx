import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QuestionForm from '../../Components/QuestionForm';

const CreateQuestion = ({ isTeacher, auth }) => {
    return (
        <AuthenticatedLayout user={auth.user} header="ایجاد سوال جدید" isTeacher={isTeacher}>
            <QuestionForm />
        </AuthenticatedLayout>
    );
};

export default CreateQuestion;