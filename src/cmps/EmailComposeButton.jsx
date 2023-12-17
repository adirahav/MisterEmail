import React from 'react'

export function EmailComposeButton({ onShowComposeEmail }) {
    return (
        <button className="compose-button" onClick={() => onShowComposeEmail(null)}><i className="fa-solid fa-pen"></i><div>Compose</div></button>
    )
}
