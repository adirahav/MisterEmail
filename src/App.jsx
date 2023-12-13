
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { useEffect, useState } from "react";
import { AppHeader } from './cmps/AppHeader';
import { AppFooter } from './cmps/AppFooter';
import { HomePage } from './pages/HomePage';
import { AboutUs } from './pages/AboutUs';
import { EmailIndex } from './pages/EmailIndex';
import { EmailDetails } from './cmps/EmailDetails';

export function App() {

    const [hasHeaderAndFooter, setHeaderAndFooter] = useState([])

    const showHeaderAndFooter = async () => {
        const currentPath = window.location.hash;
        setHeaderAndFooter(currentPath !== '#/email' && currentPath !== '#/email/');
    };

    useEffect(() => {
        showHeaderAndFooter();
    }, []);

    return (
        <Router>
            <section className='main-app'>
                {hasHeaderAndFooter && <AppHeader />}

                <main className='container'>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutUs />}  />
                        <Route path="/email" element={<EmailIndex />}>
                            <Route path='/email/details/:emailId' element={<EmailDetails />} />
                        </Route>
                    </Routes>
                </main>

                {hasHeaderAndFooter && <AppFooter />}
            </section>
        </Router>
        


    )
}

