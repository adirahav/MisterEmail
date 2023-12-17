import React from 'react'

export function HomePage() {

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
            </div>
        </main>
        
    )
}
