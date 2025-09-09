import '../css/homePage.css'
import { Link } from 'react-router-dom'

export default function HomePage() {
    return (
        <>
            <h1>Bem vindo á C.T.C</h1>
            <h3>Creation.Tool.Checklist</h3>
            <p>Ferramenta para criação de checklists</p>
            <div className="btn-mainMenu-container">
                <Link to="/login"><button>Login</button></Link>
                <Link to="/signup"><button>Sign-Up</button></Link>
                <Link to="/dashboardChecklist"><button>Checklist</button></Link>
            </div>
        </>
    )
}
