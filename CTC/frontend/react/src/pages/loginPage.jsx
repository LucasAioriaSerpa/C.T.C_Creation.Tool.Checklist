import '../css/loginPage.css'
import { PageHeader } from '../components/PageHeader'
import { BackBtn } from '../components/backBtn'

export default function LoginPage() {
    return (
        <>
            <PageHeader title="Login" subtitle="Faça o login!" />
            <div className="btns-loginPage-container">
                ...
                <BackBtn to="/" />
            </div>
        </>
    )
}
