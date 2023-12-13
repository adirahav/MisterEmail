import { utilService } from "../services/util.service";
import { useNavigate } from 'react-router-dom';

export function EmailDetails({email, onDelete}) {
    function onBackPress() {
        const navigate = useNavigate();
        navigate(`/email`);
    }

    function handleDelete() {
        onDelete(email, true);
    }

    return (
        <section className="email-details">
            <article className="actions">
                <i className="fa-solid fa-arrow-left" onClick={onBackPress}></i>
                <i className="fa-regular fa-trash-can" onClick={handleDelete}></i>
            </article>
            <article className="subject"><h2>{email.subject}</h2></article>
            <article className="from-and-date"><div>{email.from}</div><div className="sent-at">{utilService.formatDetailsDate(email.sentAt)}</div></article>
            <article className="body">{email.body}</article>
        </section>
    )
}
