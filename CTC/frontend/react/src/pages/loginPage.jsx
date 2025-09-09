import '../css/form.css'
import { PageHeader } from '../components/PageHeader'
import { LoginForm } from '../components/loginForm'
import { BackBtn } from '../components/backBtn'

export default function LoginPage() {
    return (
        <div className='page-container'>
            <PageHeader title="Login" subtitle="Faça o login!" />
            <div className="page-btn-container">
                <LoginForm />
                <BackBtn to="/"/>
            </div>
        </div>
    )
}
