import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import QuestionForm from '../../Components/QuestionForm';

const EditQuestion = ({ isTeacher, auth, question }) => {
    return (
        <AuthenticatedLayout user={auth.user} header="ویرایش سوال" isTeacher={isTeacher}>
            <QuestionForm question={question} />
        </AuthenticatedLayout>
    );
};

export default EditQuestion;