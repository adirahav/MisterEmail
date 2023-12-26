import { Link } from "react-router-dom";

export function AppFooter() {
    return (
        <footer className="app-footer">
            <p>&copy; 2023 Mister Email. All rights reserved.</p>
            <Link to={{ pathname: '/email/compose', search: '?to=help@gmail.com&subject=Help' }}><i className="fa-solid fa-circle-question"></i> Help</Link>
        </footer>
    )
}
