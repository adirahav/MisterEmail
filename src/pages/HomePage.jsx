    import React from 'react';
    import { useEffect, useState } from "react";
    import { ChartPie } from '../cmps/ChartPie';
    import { emailService } from '../services/email.service';

    export function HomePage() {
        const [statisticsData, setStatisticsData] = useState(null);
        const [statisticsChartInfo, setStatisticsChartInfo] = useState(null);

        // statistics
        const fetchStatisticsEmails = async () => {
            try {
                setStatisticsData(await emailService.getStatistics());
            } catch (error) {
                console.error('Error fetching data:', error);
                showErrorAlert({
                    message: 'An error occurred. Please try again later.',
                    closeButton: { show: false, autoClose: false }, 
                    positiveButton: { show: true, text: "OK", onPress: null, closeAfterPress: true }, 
                    negativeButton: { show: false } 
                });
            }
        };
        
        useEffect(() => {
            setStatisticsChartInfo(statisticsData ? {
                labels: statisticsData.map(item => item.key.charAt(0).toUpperCase() + item.key.slice(1) ),
                label: '# of emails',
                data: statisticsData.map(item => item.value)
            } : null);
        }, [statisticsData]);

        useEffect(() => {
            fetchStatisticsEmails();
        }, []);

        return (
            <main className="container home">
                <div>
                    <article className="title">
                        <h1>Welcome to Mister Email</h1>
                        <p>Your go-to platform for efficient and organized email management!</p>
                    </article>
                    
                    <article className="features">
                        <h2>Key Features</h2>
                        <ul>
                            <li>Organize your emails with ease</li>
                            <li>Stay on top of important messages</li>
                            <li>Customize your email experience</li>
                            <li>Effortlessly manage your inbox</li>
                        </ul>
                    </article>

                    <article className="get-started">
                        <h2>Get Started</h2>
                        <p>Start enjoying the benefits of Mister Email today. Sign up for a free account!</p>
                        <a href="/signup" className="button">Sign Up</a>
                    </article>

                    {statisticsChartInfo && <article className="statistics">
                        <h2>Email Statistics</h2>
                        <ChartPie info={statisticsChartInfo} />
                    </article>}
                </div>
            </main>
            
        );
    }
