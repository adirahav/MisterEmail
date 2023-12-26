import React from 'react'
import { useEffect, useState } from "react";
import { useParams, useNavigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { EmailFolderList } from "../cmps/EmailFolderList";
import { EmailFilter } from '../cmps/EmailFilter';
import { EmailList } from '../cmps/EmailList';
import { EmailComposeButton } from "../cmps/EmailComposeButton";
import { Overlay } from '../cmps/Overlay';
import { emailService } from '../services/email.service';
import { utilService } from '../services/util.service';

export function EmailIndex() {

    const [emails, setEmails] = useState(emailService.getDefaultEmails());
    const [showOverlay, setshowOverlay] = useState(!utilService.isMobile());
    const [folderList, setFolderList] = useState({});

    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter());
    const [sortBy, setSortBy] = useState(emailService.getDefaultSort());
    const [multyCheckedBy, setMultyCheckedBy] = useState(emailService.getDefaultMultyChecked());
    
    const [showEmailList, setShowEmailList] = useState(true);
    const [showFolderList, setShowFolderList] = useState(!utilService.isMobile());
    const [showFloatingComposeButton, setShowFloatingComposeButton] = useState(utilService.isMobile());
    const [showSearchOnly, setShowSearchOnly] = useState(utilService.isMobile());
    
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    // fetch emails
    const fetchEmails = async () => {
        try {
            const result = await emailService.query(filterBy, sortBy);
            setEmails(result);

            orgenizeFolderList(result);

            setMultyCheckedBy(emailService.getDefaultMultyChecked());

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    useEffect(() => {
        fetchEmails();
    }, [filterBy, sortBy]);

    useEffect(() => {
        if (params.folder) {
            filterBy.status = params.folder;
        }
        fetchEmails();
    }, [params.folder]);

    useEffect(() => {
        setShowFloatingComposeButton(
            !utilService.isMobile() 
                ? false 
                : window.location.hash.includes('/compose/') || window.location.hash.includes('/details/')
                    ? false
                    : true
        );

        setShowSearchOnly(window.location.hash.includes('/details/'));

        setShowEmailList(
            !window.location.hash.includes('/details/')
        );
    }, [location]);
    
    // folder list 
    function orgenizeFolderList(result) {
        setFolderList({
                inbox:  { label: "Inbox",   count: result.newInboxCount,    icon: "fa-solid fa-inbox"},
                starred:{ label: "Starred", count: result.starredCount,     icon: "fa-regular fa-star"},
                sent:   { label: "Sent",    count: result.sentCount,        icon: "fa-regular fa-paper-plane"},
                draft:  { label: "Draft",   count: result.draftCount,       icon: "fa-brands fa-firstdraft"},
                trash:  { label: "Trash",   count: result.trashCount,       icon: "fa-regular fa-trash-can"},
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
            navigate(`/email/compose/${pressedEmail.id}`);
        }
        else {          
            navigate(`/email/${filterStatus}/details/${pressedEmail.id}`);       
        }     
    }

    // multy check / uncheck
    function onEmailCheck() {

        setMultyCheckedBy((prevMultyChecked) => {
            return { ...prevMultyChecked, 
                filter: null, 
            };
        });

        setMultyCheckedBy((prevMultyChecked) => {
            return { ...prevMultyChecked, 
                showActions: shouldShowMultyActions(),
                checked: shouldCheckMultyCheckbox()
            };
        });
    }

    async function onSetMultyChecked(multyChecked) {
        if (multyCheckedBy.filter !== multyChecked.filter) {
            const allCheckboxes = document.querySelectorAll('.email-list input[type="checkbox"]');
            allCheckboxes.forEach((checkbox) => {
                switch (multyChecked.filter) {
                    case "all": checkbox.checked = true; break;
                    case "none": checkbox.checked = false; break;
                    case "read": checkbox.checked = !checkbox.parentNode.parentNode.className.includes("unread"); break;
                    case "unread": checkbox.checked = checkbox.parentNode.parentNode.className.includes("unread"); break;
                    case "starred": checkbox.checked = checkbox.parentNode.parentNode.className.includes("starred"); break;
                    case "unstarred": checkbox.checked = !checkbox.parentNode.parentNode.className.includes("starred"); break;
                }
            });

            setMultyCheckedBy((prevMultyChecked) => {
                return { ...prevMultyChecked, 
                    filter: multyChecked.filter, 
                    showActions: shouldShowMultyActions(),
                    checked: shouldCheckMultyCheckbox()
                };
            });
        }
        
        if (multyCheckedBy.action !== multyChecked.action) {
            var checkedIDs = [];
            const checkedCheckboxes = document.querySelectorAll('.email-list input[type="checkbox"]:checked');
            checkedCheckboxes.forEach((checkbox) => { 
                checkedIDs.push(
                    Array.from(checkbox.parentNode.parentNode.classList)
                        .filter((className) => className.startsWith('id-'))[0]
                        .replace("id-", "")
                );
                checkbox.checked = false;
            });

            const results = await emailService.actionByIds(checkedIDs, multyChecked.action);
            
            fetchEmails(() => {
                setEmails((prevEmails) => {
                    return {
                        ...prevEmails, 
                        list: results
                    };
                });
            });

            setMultyCheckedBy((prevMultyChecked) => {
                return { ...prevMultyChecked, 
                    action: null, 
                    showActions: "none",
                    checked: false
                };
            });
        }
    }

    function shouldShowMultyActions() {
        const checkedCheckboxes = document.querySelectorAll('.email-list input[type="checkbox"]:checked');
        const showActions = checkedCheckboxes.length > 0;
        return showActions;
    }

    function shouldCheckMultyCheckbox() {
        const allCheckboxes = document.querySelectorAll('.email-list input[type="checkbox"]');
        const checkedCheckboxes = document.querySelectorAll('.email-list input[type="checkbox"]:checked');

        const checked = allCheckboxes.length === 0 || checkedCheckboxes.length === 0
                            ? "unchecked"
                            : allCheckboxes.length === checkedCheckboxes.length
                                ? "checked" 
                                : "partial";
        return checked;
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
        setFilterBy(filterBy);

        if (utilService.isMobile() && showFolderList) {
            onToggleFolderList();
        }
    
        const urlParams = new URLSearchParams(location.search)
        if (urlParams.size === 0) {
            navigate(`/email/${filterBy.status}`);
        }
    }

    const { status: filterStatus, txt: filterText, read: filterRead } = filterBy

    // sort
    const { by: sortField, direction: sortDirection } = sortBy;

    function onSetSort(oredrBy) {
        setSortBy(prevSort => ({ ...prevSort, ...oredrBy }))
    }

    // compose
    async function onShowComposeEmail(email) {
        if (!email) {
            email = await emailService.createEmail();
        }
        
        navigate(`/email/compose/${email.id}`);
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

    return ( <>
        {showOverlay && <Overlay onPress={onToggleFolderList} />}

        <aside>
            <EmailFolderList selectedFolder={filterStatus} folderList={folderList} onSelectFolder={onSetFilter} onShowComposeEmail={onShowComposeEmail} showFolderList={showFolderList} />
        </aside>
        <main>
            <EmailFilter showSearchOnly={showSearchOnly} filterBy={filterBy} onSetFilter={onSetFilter} sortBy={{sortField, sortDirection}} onSetSort={onSetSort} multyCheckedBy={multyCheckedBy} onSetMultyChecked={onSetMultyChecked} onMobileToggleFolderList={onToggleFolderList} />        
            {showEmailList && <EmailList selectedFolder={filterStatus} emails={emails.list} onPress={onEmailPress} onCheck={onEmailCheck} onStar={onEmailStar} onDelete={onEmailDelete} onUnread={onEmailUnread} />}  
            <Outlet context={{ onDelete: onEmailDelete, onAutoSave: onEmailSave, onSend: onEmailSend}} />
        </main> 
        {showFloatingComposeButton && <EmailComposeButton onShowComposeEmail={onShowComposeEmail} />}
    </>)
}
