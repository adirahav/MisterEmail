import React from 'react'
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { EmailFolderList } from "../cmps/EmailFolderList";
import { EmailFilter } from '../cmps/EmailFilter';
import { EmailList } from '../cmps/EmailList';
import { EmailDetails } from '../cmps/EmailDetails';
import { EmailCompose } from '../cmps/EmailCompose';
import { EmailComposeButton } from "../cmps/EmailComposeButton";
import { emailService } from '../services/email.service';
import { utilService } from '../services/util.service';
import { Overlay } from '../cmps/Overlay';

export function EmailIndex() {

    const [emails, setEmails] = useState(emailService.getDefaultEmails());
    const [showOverlay, setshowOverlay] = useState(!utilService.isMobile());
    const [folderList, setFolderList] = useState({});
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter());
    const [sortBy, setSortBy] = useState(emailService.getDefaultSort());
    const [composedEmail, setComposedEmail] = useState(null);
    const [detailsEmail, setDetailsEmail] = useState(null);
    const [showFolderList, setShowFolderList] = useState(!utilService.isMobile());
    const [showFloatingComposeButton, setShowFloatingComposeButton] = useState(utilService.isMobile());
    
    const { emailId } = useParams();
    
    const navigate = useNavigate();

    // fetch emails
    const fetchEmails = async () => {
        try {
            const result = await emailService.query(filterBy, sortBy);
            setEmails(result);

            orgenizeFolderList(result);

            // load details on refresh
            setDetailsEmail(
                window.location.hash.includes('/details/') 
                    ? result.list.find((email) => email.id === emailId)  
                    : null
            );

            // load compose on refresh
            setComposedEmail(
                window.location.hash.includes('/compose/') 
                    ? result.list.find((email) => email.id === emailId)  
                    : null
            );

            // floating compose button
            setShowFloatingComposeButton(
                !utilService.isMobile() 
                    ? false 
                    : window.location.hash.includes('/compose/') || window.location.hash.includes('/details/')
                        ? false
                        : true
            );


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    useEffect(() => {
        fetchEmails();
    }, [filterBy, sortBy]);

    // inner pages
    useEffect(() => {
        const handleHashChange = async () => {
            const currentPath = window.location.pathname;
            if (currentPath.includes('/details/')) {
                setDetailsEmail((prevDetailsEmails) => {
                    return prevDetailsEmails ? prevDetailsEmails : null;
                });
            }
            else {
                setDetailsEmail(null);
            }
    
            if (currentPath.includes('/compose/')) {
                const result = await emailService.query(filterBy, sortBy);
                setEmails(result);
    
                orgenizeFolderList(result);

                setComposedEmail((prevDetailsEmails) => {
                    return prevDetailsEmails ? prevDetailsEmails : null;
                });
            }
            else {
                setComposedEmail(null);
            }
        };
      
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
      
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [navigate]);
    
    // folder list 
    function orgenizeFolderList(result) {
        setFolderList({
                inbox: { 
                    label: "Inbox", 
                    count: result.newInboxCount,
                    icon: "fa-solid fa-inbox"
                },
                starred: { 
                    label: "Starred", 
                    count: result.starredCount,
                    icon: "fa-regular fa-star"
                },
                sent: { 
                    label: "Sent", 
                    count: result.sentCount,
                    icon: "fa-regular fa-paper-plane"
                },
                draft: { 
                    label: "Draft", 
                    count: result.draftCount,
                    icon: "fa-brands fa-firstdraft"
                },
                trash: { 
                    label: "Trash", 
                    count: result.trashCount,
                    icon: "fa-regular fa-trash-can"
                },
            }
        )
    }

    function updateFolderList(beforeChangeEmail, afterChangeEmail) {
        setFolderList((prevFolderList) => {
            const inboxDiff =   afterChangeEmail
                             && beforeChangeEmail.to === emailService.loggedinUser.email 
                             && !beforeChangeEmail.isDraft  
                             && !beforeChangeEmail.isDeleted && !afterChangeEmail.isDeleted
                             && beforeChangeEmail.isRead !== afterChangeEmail.isRead
                                    ? (beforeChangeEmail.isRead ? 1 : -1)
                                    :      afterChangeEmail
                                        && beforeChangeEmail.to === emailService.loggedinUser.email 
                                        && !beforeChangeEmail.isDraft  
                                        && !beforeChangeEmail.isDeleted && afterChangeEmail.isDeleted
                                        && !beforeChangeEmail.isRead
                                            ? -1
                                            : 0;

            const draftDiff =   !afterChangeEmail && beforeChangeEmail.isDraft 
                                    ? 1
                                    : afterChangeEmail && beforeChangeEmail.isDraft && afterChangeEmail.isDeleted
                                        ? -1
                                        : afterChangeEmail && beforeChangeEmail.isDraft && !afterChangeEmail.isDraft
                                            ? 1
                                            : 0;

            return {
                ...prevFolderList,
                inbox:      { ...prevFolderList.inbox, count: prevFolderList.inbox.count + inboxDiff },
                starred:    { ...prevFolderList.starred },
                sent:       { ...prevFolderList.sent },
                draft:      { ...prevFolderList.draft, count: prevFolderList.draft.count + draftDiff },
                trash:      { ...prevFolderList.trash },
            };
        });

    }
    
    function onToggleFolderList() {  
        setShowFolderList(!showFolderList)
        setshowOverlay(!showOverlay)
    }

    // details page
    async function onEmailPress(pressedEmail) {
        if (!pressedEmail.isRead) {
            const originPressedEmail = JSON.parse(JSON.stringify(pressedEmail));
            
            pressedEmail.isRead = true;
            await emailService.save(pressedEmail);
            
            updateFolderList(originPressedEmail, pressedEmail);
        }

        if (pressedEmail.isDraft) {
            setComposedEmail(pressedEmail);
            navigate(`/email/compose/${pressedEmail.id}`);
        }
        else {
            setDetailsEmail(pressedEmail);
            navigate(`/email/details/${pressedEmail.id}`);
        }    
    }

    // star / unstar
    async function onEmailStar(pressedEmail) {
        const originPressedEmail = JSON.parse(JSON.stringify(pressedEmail));

        pressedEmail.isStarred = !pressedEmail.isStarred;
        await emailService.save(pressedEmail);

        updateFolderList(originPressedEmail, pressedEmail);
    }

    // delete
    async function onEmailDelete(pressedEmail, navigateBack) {
        const originPressedEmail = JSON.parse(JSON.stringify(pressedEmail));

        if (!pressedEmail.isDeleted) {
            pressedEmail.isDeleted = true;
            pressedEmail.removedAt = new Date().getTime();
            await emailService.save(pressedEmail);
        }
        else {
            await emailService.remove(pressedEmail.id);
        }

        setEmails((prevEmails) => {
            return {
                ...prevEmails, 
                list: prevEmails.list.filter(email => email.id !== pressedEmail.id)
            };
        });

        updateFolderList(originPressedEmail, pressedEmail);
        
        if (navigateBack) {
            navigate(`/email`);
        }
    }

    // read / unread
    async function onEmailUnread(pressedEmail) {
        const originPressedEmail = JSON.parse(JSON.stringify(pressedEmail));
        
        pressedEmail.isRead = !pressedEmail.isRead;
        await emailService.save(pressedEmail);

        updateFolderList(originPressedEmail, pressedEmail);
    }


    // filter
    function onSetFilter(filterBy) {
        if (utilService.isMobile() && showFolderList) {
            onToggleFolderList();
        }

        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    const { status: filterStatus, txt: filterText, read: filterRead } = filterBy

    // sort
    const { by: sortField, direction: sortDirection } = sortBy;

    function onSetSort(oredrBy) {
        setSortBy(prevSort => ({ ...prevSort, ...oredrBy }))
    }

    // compose
    useEffect(() => {
        if (composedEmail !== null && composedEmail !== undefined) {
          navigate(`/email/compose/${composedEmail.id}`);
        }
    }, [composedEmail]);

    async function onShowComposeEmail(email) {
        if (!email) {
            await onComposeEmail();
        }
        else {
            setComposedEmail(email);
        }
    }

    async function onComposeEmail() {
        const newEmail = await emailService.createEmail();
        setComposedEmail(newEmail);

        updateFolderList(newEmail);
    }

    async function onEmailSave(email) {
        await emailService.save(email);  
        const result = await emailService.query(filterBy, sortBy); // TODO: local update
        setEmails(result);
    }
    
    async function onEmailSend(email) {
        const originPressedEmail = JSON.parse(JSON.stringify(email));
        
        email.isDraft = false;
        email.sentAt = new Date().getTime();
        email.from = emailService.loggedinUser.email;

        await emailService.send(email); 
        
        updateFolderList(originPressedEmail, email);
    }

    const onComposeClose = () => {
        setComposedEmail(null);
        navigate(-1);
    };
    
    return ( <>
        {showOverlay && <Overlay onPress={onToggleFolderList} />}

        <aside>
            <EmailFolderList selecedFolder={filterStatus} folderList={folderList} onSelectFolder={onSetFilter} onShowComposeEmail={onShowComposeEmail} showFolderList={showFolderList} />
        </aside>
        <main>
            <EmailFilter displaySort={!detailsEmail} filterBy={filterBy} onSetFilter={onSetFilter} sortBy={{sortField, sortDirection}} onSetSort={onSetSort} onToggleFolderList={onToggleFolderList} />        
            {!detailsEmail && <EmailList selecedFolder={filterStatus} emails={emails.list} onPress={onEmailPress} onStar={onEmailStar} onDelete={onEmailDelete} onUnread={onEmailUnread} />}  
            {detailsEmail && <EmailDetails email={detailsEmail} onDelete={onEmailDelete} />}  
        </main> 
        {composedEmail && (
            <EmailCompose
                composedEmail={composedEmail}
                onClose={() => { onComposeClose() }}
                onAutoSave={onEmailSave}
                onSend={onEmailSend}
                onDelete={() => onEmailDelete(composedEmail, false)}
            />)}
        {showFloatingComposeButton && <EmailComposeButton onShowComposeEmail={onShowComposeEmail} />}
    </>)
}
