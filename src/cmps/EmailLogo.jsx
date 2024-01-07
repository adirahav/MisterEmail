import React from 'react';
import { IconSizes, MenuIcon } from '../assets/Icons';

export function EmailLogo({onToggleMenu}) {
    
    return (
        <article className="email-logo">
            <MenuIcon onClick={onToggleMenu} sx={ IconSizes.Medium } />
            <img src="/MisterEmail/src/assets/imgs/icon.png" />
            <h1>Mister Email</h1> 
        </article>
    );
}
