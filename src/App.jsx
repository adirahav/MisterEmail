import { Route, HashRouter as Router, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import { AppHeader } from './cmps/AppHeader';
import { AppFooter } from './cmps/AppFooter';
import { HomePage } from './pages/HomePage';
import { AboutUs } from './pages/AboutUs';
import { EmailIndex } from './pages/EmailIndex';
import { EmailDetails } from './cmps/EmailDetails';
import { EmailCompose } from './cmps/EmailCompose';

export function App() {

    const [hasHeaderAndFooter, setHeaderAndFooter] = useState([true])
    const [hasAside, setAdside] = useState([false])
    const [pageClass, setPageClass] = useState(["home-index"])

    const navigate = useNavigate()

    const setLayout = async () => {
        const currentPath = window.location.pathname;
        setHeaderAndFooter(!currentPath.includes('/email'));
        setAdside(currentPath.includes('/email'));
        setPageClass(currentPath.includes('/email') 
                    ? "email-index"
                    : currentPath.includes('/about') 
                        ? "about-index"
                        : "home-index");
    };

    const mainSectionClass = `main-app ${pageClass}${hasAside ? ' has-aside' : ''}`

    useEffect(() => {
        setLayout();
    }, [navigate]);

    return (     
        <section className={mainSectionClass}>
            {hasHeaderAndFooter && <AppHeader />}

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutUs />}  />
                <Route path="/email" element={<EmailIndex />} >
                    <Route path='/email/details/:emailId' element={<EmailDetails />} />
                    <Route path='/email/compose/:emailId' element={<EmailCompose />} />
                </Route>
            </Routes>
                
            {hasHeaderAndFooter && <AppFooter />}
        </section>
    )
}

