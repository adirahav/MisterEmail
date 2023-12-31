import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Overlay } from '../cmps/Overlay';
import { useEffectOnChangeURL } from '../customHooks/useEffectOnChangeURL';
import { utilService } from '../services/util.service';

export function AppHeader() {
  const [showOverlay, setshowOverlay] = useState(!utilService.isMobile());
  const [showMenu, setShowMenu] = useState(!utilService.isMobile()); 

  useEffectOnChangeURL(() => {
    setShowMenu(false);
    setshowOverlay(false);
  }, []);

  function onToggleMenu(ev) {  
    ev.preventDefault();
    ev.stopPropagation();

    setShowMenu(!showMenu);
    setshowOverlay(!showOverlay);
  }

  const displayNav = utilService.isMobile()
                        ? showMenu 
                            ? "inline"
                            : "none"
                        : "";

  return ( <>
      {showOverlay && <Overlay onPress={onToggleMenu} />}

      <header>
        <section>
          <i className="fa-solid fa-bars mobile" onClick={onToggleMenu}></i>
            <div>
            <img src="src/assets/imgs/icon.png" />
            <h1>Mister Email</h1>
          </div>
          <nav style={{display:`${displayNav}`}}>
            <ul>
              <li className="mobile">
                <img src="src/assets/imgs/icon.png" />
                <h1>Mister Email</h1>
              </li>
              <hr className="mobile" />
              <li><NavLink className="nav" to="/">Home</NavLink></li>
              <li><NavLink className="nav" to="/about">About</NavLink></li>
              <li><NavLink className="nav" to="/email">Email</NavLink></li>
            </ul>
          </nav>
        </section>
      </header>  
    </>
      
  );
}
