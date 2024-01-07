import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { utilService } from '../services/util.service';
import { emailService } from '../services/email.service';
import { IconSizes, TrashIcon, ReadIcon, UnreadIcon, StarIcon, ArchiveIcon, CheckIcon } from '../assets/Icons';
import { Tooltip } from 'react-tooltip';

export function EmailPreview({selectedFolder, email, onPress, onCheck, onStar, onDelete, onUnread}) {

    const [isRowSelected, setRowSelected] = useState(false);
    const [isRowPressing, setRowPressing] = useState(false);

    const navigate = useNavigate();
    const refRow = useRef();
    const refAvatar = useRef();

    useEffect(() => {
         // long press
         if (utilService.isMobile()) {
            console.log('addEventListener');

            refRow.current.addEventListener('touchstart', startLongPress);
            refRow.current.addEventListener('touchend', cancelLongPress);
        }

        // back press
        const handleBackPress = (event) => {
            setRowSelected((prevRowSelected) => {
                if (utilService.isMobile() && prevRowSelected) {
                    return false;
                }
                /*else {
                    navigate(`/email`);
                }*/
            }); 
        };

        window.addEventListener('popstate', handleBackPress);
    
        return () => {
            window.removeEventListener('popstate', handleBackPress);
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
    
    const rowClass = `email-preview id-${email.id}${email.isRead ? '' : ' unread'}${email.isStarred ? ' starred' : ''}${email.isDraft ? ' draft' : ''}${isRowPressing ? ' pressing' : ''}${isRowSelected ? ' selected' : ''}`;
    const iconDisabledClass = selectedFolder === "trash" 
                    ? "disabled" 
                    : "";

    const frontAvatar = email.to === emailService.loggedinUser.email
                            ? email.from && email.from.length > 0 ? email.from.charAt(0).toUpperCase() : '' 
                            : email.to && email.to.length > 0 ? email.to.charAt(0).toUpperCase() : '' ;

    const backAvatar = <CheckIcon sx={ IconSizes.Medium } />

    const frontAvatarColor = isRowSelected || isRowPressing 
                                ? "#00678a" 
                                : utilService.getDummyColor();

    const backAvatarColor = isRowSelected || isRowPressing 
                                ? "#00678a" 
                                : utilService.getDummyColor();

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

    const tooltipRead = email.isRead ? "Mark as unread" : "Mark as read";
    //const tooltipStarred = email.isStarred ? "Starred" : "Unstarred";

    const handleRowClick = (ev) => {
        if (!isRowPressing && !isRowSelected) {
            onPress(email);
        }
    };


    // long press
    let longPressTimer;

    function startLongPress() {
        if (!isRowSelected) {
            setRowPressing(true);
        }
        
        longPressTimer = setTimeout(() => {
            setRowPressing(false);
        }, 500);
      }
      
      function cancelLongPress() {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
        }

        //setRowSelected(!isRowSelected)
      
        setRowSelected((prevRowSelected) => {
            onCheck();
            console.log(prevRowSelected);
            return !prevRowSelected;
        });    

      }

    // back press

    return (
        <div className={rowClass} onClick={handleRowClick} ref={refRow}>
        
            <span className="checkbox"><input type="checkbox" onClick={handleCheck} /></span>
            <span className="star"><StarIcon onClick={handleStar} sx={ IconSizes.Large } /></span>
            <span className={`avatar flipper ${isRowSelected || isRowPressing ? 'flipped' : ''}`} style={{ background: isRowSelected || isRowPressing ? backAvatarColor : frontAvatarColor}} ref={refAvatar}>
                <div className="flipper">
                    <div className="front">{frontAvatar}</div>
                    <div className="back">{backAvatar}</div>
                </div>
            </span>
            <span className="email">{email.from}</span>
            <span className="draft">Draft</span>
            <span className="subject">{subject}</span>
            <span className={`subject-body-seprerator ${subjectBodySeperator}`}>-</span>
            <span className="body">{email.body}</span>
            <span className="date">{utilService.formatListDate(date)}</span>
            <span className="actions">
                <ArchiveIcon className={iconDisabledClass} sx={ IconSizes.Large } data-tooltip-id="tooltip-archive" data-tooltip-content="Archive" /><Tooltip id="tooltip-archive" />
                <TrashIcon onClick={handleDelete} sx={ IconSizes.Large } data-tooltip-id="tooltip-delete" data-tooltip-content="Delete" /><Tooltip id="tooltip-delete" />
                <DynamicReadIcon read={email.isRead.toString()} onClick={handleUnread} sx={ IconSizes.Large } data-tooltip-id="tooltip-read" data-tooltip-content={tooltipRead} /><Tooltip id="tooltip-read" />
            </span>
        </div> 
    );
}
