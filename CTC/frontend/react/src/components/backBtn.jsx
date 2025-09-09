import React from 'react'
import { Link } from 'react-router-dom'

export function BackBtn({ to }) {
    return (
        <Link to={ to }>
            <button>Volter</button>
        </Link>
    )
}
