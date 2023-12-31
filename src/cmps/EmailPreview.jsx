import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { utilService } from '../services/util.service';
import { emailService } from '../services/email.service';
import { IconSizes, TrashIcon, ReadIcon, UnreadIcon, StarIcon, ArchiveIcon } from '../assets/Icons';


export function EmailPreview({selectedFolder, email, onPress, onCheck, onStar, onDelete, onUnread}) {

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
    
    const trClass = `email-preview id-${email.id}${email.isRead ? '' : ' unread'}${email.isStarred ? ' starred' : ''}${email.isDraft ? ' draft' : ''}`;
    const iconDisabledClass = selectedFolder === "trash" 
                    ? "disabled" 
                    : "";

    const avatar = email.to === emailService.loggedinUser.email
                    ? email.from && email.from.length > 0 ? email.from.charAt(0).toUpperCase() : '' 
                    : email.to && email.to.length > 0 ? email.to.charAt(0).toUpperCase() : '' ;

    const avatarColor = utilService.getDummyColor();

    const subject = (email.subject === null || email.subject === '' 
                     ? '(no subject)' 
                     : email.subject);

    const subjectBodySeperator = (email.body === null || email.body === '' 
                     ? 'hide-content' 
                     : '');

    const date = email.isDraft
                    ? email.createAt
                    : email.sentAt;

    const handleCheck = (ev) => {
        ev.stopPropagation();    
        onCheck();
    }

    const handleStar = (ev) => {
        ev.stopPropagation();
        onStar(email);
    }

    function DynamicReadIcon(props) {
        return props.read == "true"
            ? <UnreadIcon {...props} />
            : <ReadIcon {...props} />;
    }

    return (
        <div className={trClass} onClick={() => onPress(email)}>
            <span className="checkbox"><input type="checkbox" onClick={handleCheck} /></span>
            <span className="star"><StarIcon onClick={handleStar} sx={ IconSizes.Large } /></span>
            <span className="avatar" style={{ background: avatarColor }}>{avatar}</span>
            <span className="email">{email.from}</span>
            <span className="draft">Draft</span>
            <span className="subject">{subject}</span>
            <span className={`subject-body-seprerator ${subjectBodySeperator}`}>-</span>
            <span className="body">{email.body}</span>
            <span className="date">{utilService.formatListDate(date)}</span>
            <span className="actions">
                <ArchiveIcon className={iconDisabledClass} sx={ IconSizes.Large } />
                <TrashIcon onClick={handleDelete} sx={ IconSizes.Large } />
                <DynamicReadIcon read={email.isRead.toString()} onClick={handleUnread} sx={ IconSizes.Large } />
            </span>
        </div> 
    );
}