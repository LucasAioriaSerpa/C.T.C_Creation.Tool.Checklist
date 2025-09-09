import React from 'react'
import { Link } from 'react-router-dom'
import '../css/backBtn.css'

export function BackBtn({ to }) {
    return (
        <div className='back-btn-container'>
            <Link to={ to }>
                <button>Voltar</button>
            </Link>
        </div>
    )
}
