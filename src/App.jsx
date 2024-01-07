import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { useState } from "react";
import { AppHeader } from './cmps/AppHeader';
import { AppFooter } from './cmps/AppFooter';
import { useEffectOnChangeURL } from './customHooks/useEffectOnChangeURL';
import { utilService } from './services/util.service';
import { HomePage } from './pages/HomePage';
import { AboutUs } from './pages/AboutUs';
import { EmailIndex } from './pages/EmailIndex';
import { EmailDetails } from './cmps/EmailDetails';
import { EmailCompose } from './cmps/EmailCompose';
import { Alert } from './cmps/Alert';
import 'animate.css';

export function App() {

    const [hasHeaderAndFooter, setHeaderAndFooter] = useState([true]);
    const [hasAside, setAdside] = useState([false]);
    const [pageClass, setPageClass] = useState(["home-index"]);
    const [thinFolderList, setThinFolderList] = useState(false);

    const setLayout = async () => {
        const currentPath = window.location.hash;
        setHeaderAndFooter(!currentPath.includes('#/email'));
        setAdside(currentPath.includes('#/email'));
        setPageClass(currentPath.includes('#/email') 
                    ? "email-index"
                    : currentPath.includes('#/about') 
                        ? "about-index"
                        : "home-index");
    };

    const mainSectionClass = `main-app ${pageClass}${hasAside ? ' has-aside' : ''}${thinFolderList ? ' thin-aside' : ''}`;

    useEffectOnChangeURL(() => {
        setLayout();
    }, [thinFolderList]);

    function onToggleMenu() {  
        if (!utilService.isMobile()) {
            //setThinFolderList(!thinFolderList);
        }
    }

    return (     
        <section className={mainSectionClass}>
            {hasHeaderAndFooter && <AppHeader />}

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutUs />}  />
                <Route path="/email" element={<EmailIndex onToggleMenu={onToggleMenu} />} ></Route>
                <Route path="/email/:folder" element={<EmailIndex onToggleMenu={onToggleMenu} />} >
                    <Route path='/email/:folder/compose' element={<EmailCompose />} />
                    <Route path='/email/:folder/details/:emailId' element={<EmailDetails />} />
                    <Route path='/email/:folder/compose/:emailId' element={<EmailCompose />} />
                </Route>
            </Routes>
            <Alert />
            {hasHeaderAndFooter && <AppFooter />}
        </section>
    );
}

