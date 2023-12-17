import { Link, NavLink } from "react-router-dom";

export function AppHeader() {
    return (
        <header>
          <nav>
            <ul>
              <li><NavLink className="nav" to="/">Home</NavLink></li>
              <li><NavLink className="nav" to="/about">About</NavLink></li>
              <li><NavLink className="nav" to="/email">Email</NavLink></li>
            </ul>
          </nav>
        </header>
    )
}
