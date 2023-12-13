import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { utilService } from '../services/util.service';

export function EmailPreview({selecedFolder, email, onPress, onStar, onDelete, onUnread}) {

    const navigate = useNavigate();

    useEffect(() => {
        const handlePopstate = () => {
            navigate(`/email`);
        };

        window.addEventListener('popstate', handlePopstate);

        return () => {
            window.removeEventListener('popstate', handlePopstate);
        };
    }, []);

    function handleDelete(ev) {
        ev.stopPropagation();
        onDelete(email);    
    }

    function handleUnread(ev) {
        ev.stopPropagation();
        onUnread(email);    
    }

    const trClass = `email-preview${email.isRead ? '' : ' unread'}${email.isStarred ? ' starred' : ''}${email.isDraft ? ' draft' : ''}`;
    const iconDisabledClass = selecedFolder === "trash" 
                    ? "disabled" 
                    : "";
    const subject = email.subject === null || email.subject === '' 
                    ? '(no subject)' 
                    : email.subject;
    const date = email.isDraft
                    ? email.createAt
                    : email.sentAt;
    const iconRead = email.isRead 
                    ? 'fa-solid fa-envelope-circle-check' 
                    : 'fa-regular fa-envelope-open';

    return (
        <tr className={trClass} onClick={() => onPress(email)}>
            <td className="star"><i className="fa-regular fa-star" onClick={(event) => {
                    event.stopPropagation();
                    onStar(email);}}></i></td>
            <td className="email">{email.from}</td>
            <td className="draft">Draft</td>
            <td className="subject">{subject}</td>
            <td className="date">{utilService.formatListDate(date)}</td>
            <td className="actions">
            <i className={`fa-solid fa-arrow-up-from-bracket ${iconDisabledClass}`}></i>
            <i className="fa-regular fa-trash-can" onClick={handleDelete}></i>
            <i className={`${iconRead}`} onClick={handleUnread}></i>
            </td>
        </tr>
    )
}
