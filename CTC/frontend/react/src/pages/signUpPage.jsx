import '../css/loginSignUpForm.css'
import { PageHeader } from '../components/PageHeader'
import { SignUpForm } from '../components/signUpForm'
import { BackBtn } from '../components/backBtn'

export default function SignUpPage() {
    return (
        <div className='page-container'>
            <PageHeader title="Sign-Up" subtitle="Cadastra-se" />
            <div className="page-btn-container">
                <SignUpForm/>
                <BackBtn to="/" />
            </div>
        </div>
    )
}
