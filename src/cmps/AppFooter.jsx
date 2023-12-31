import { Link } from "react-router-dom";
import { HelpIcon } from '../assets/Icons';

export function AppFooter() {
    return (
        <footer className="app-footer">
            <p>&copy; 2023 Mister Email. All rights reserved.</p>
            <Link to={{ pathname: '/email/inbox/compose', search: '?to=help@gmail.com&subject=Help' }}><HelpIcon fontSize="medium" /> Help</Link>
        </footer>
    );
}
