import React from 'react';
import { Button } from "@mui/material";
import { IconSizes, PenIcon } from '../assets/Icons';

export function EmailComposeButton({ onShowComposeEmail }) {
    return (
        <Button variant="contained" className="compose-button" onClick={() => onShowComposeEmail(null)}><PenIcon sx={ IconSizes.Large } /><div>Compose</div></Button>
    );
}
