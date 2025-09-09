import '../css/signUpPage.css'
import { PageHeader } from '../components/PageHeader'
import { SignUpForm } from '../components/signUpForm'
import { BackBtn } from '../components/backBtn'

export default function SignUpPage() {
    return (
        <>
            <PageHeader title="Sign-Up" subtitle="Cadastra-se" />
            <div className="btns-signUpPage-container">
                <SignUpForm/>
                <BackBtn to="/" />
            </div>
        </>
    )
}
