import '../css/homePage.css'
import { Link } from 'react-router-dom'

export default function HomePage() {
    return (
        <div className='homepage-container'>
            <h1>Bem vindo á C.T.C</h1>
            <h3>Creation.Tool.Checklist</h3>
            <p>Ferramenta para criação de checklists</p>
            <div className="btn-mainMenu-container">
                <Link to="/login"><button className='primary-btn'>Login</button></Link>
                <Link to="/signup"><button className='primary-btn'>Sign-Up</button></Link>
            </div>
        </div>
    )
}
