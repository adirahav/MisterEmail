import React from 'react'

export function AboutUs() {

    return (
        <main className='container about'>t
            <div>
                <article className="team">
                    <h2>Our Team</h2>
                    <p>We are a dedicated team of professionals passionate about improving the email experience. Meet the individuals behind Mister Email:</p>
                    <ul>
                        <li><strong>John Doe</strong> - Founder & CEO</li>
                        <li><strong>Jane Smith</strong> - Chief Technology Officer</li>
                        <li><strong>Chris Johnson</strong> - Head of Design</li>
                    </ul>
                </article>

                <article className="contact">
                    <h2>Contact Us</h2>
                    <p>Have questions or feedback? We'd love to hear from you!</p>
                    <p>Email: info@misteremail.com</p>
                    <p>Phone: (123) 456-7890</p>
                </article>    
            </div>   
        </main>
    )
}
