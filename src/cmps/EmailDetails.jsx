import { utilService } from "../services/util.service";
import { emailService } from "../services/email.service";
import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';

export function EmailDetails() {
    const { onDelete } = useOutletContext()
    const [email, setEmail] = useState(null)
    const params = useParams()

    const navigate = useNavigate();

    useEffect(() => {
        loadEmail()
    }, [params.emailId])

    async function loadEmail() {
        try {   
            const email = await emailService.getById(params.emailId)
            setEmail(email)
        } catch (err) {

            navigate('/email')
            console.log('Had issues loading email', err);
        }
    }

    const handleBackPress = () => {

        navigate(`/email`);
    };

    function handleDelete() {
        onDelete(email, true);
    }

    if (!email) return <div>Loading..</div>
    
    return (
        <section className="email-details">
            <article className="actions">
                <i className="fa-solid fa-arrow-left" onClick={handleBackPress}></i>
                <i className="fa-regular fa-trash-can" onClick={handleDelete}></i>
            </article>
            <article className="subject"><h2>{email.subject}</h2></article>
            <article className="from-and-date"><div>{email.from}</div><div className="sent-at">{utilService.formatDetailsDate(email.sentAt)}</div></article>
            <article className="body">{email.body}</article>
        </section>
    )
}
