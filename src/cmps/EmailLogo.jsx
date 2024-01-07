import React from 'react';
import { IconSizes, MenuIcon } from '../assets/Icons';
import imgIcon from '../assets/imgs/icon.png';

export function EmailLogo({onToggleMenu}) {
    
    return (
        <article className="email-logo">
            <MenuIcon onClick={onToggleMenu} sx={ IconSizes.Medium } />
            <img src={imgIcon} />
            <h1>Mister Email</h1> 
        </article>
    );
}
