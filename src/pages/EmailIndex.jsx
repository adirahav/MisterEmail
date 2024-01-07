import React from 'react';
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { EmailFolderList } from "../cmps/EmailFolderList";
import { EmailLogo } from '../cmps/EmailLogo';
import { EmailSearch } from '../cmps/EmailSearch';
import { EmailFilter } from '../cmps/EmailFilter';
import { EmailList } from '../cmps/EmailList';
import { EmailComposeButton } from "../cmps/EmailComposeButton";
import { Overlay } from '../cmps/Overlay';
import { useEffectOnChangeURL } from '../customHooks/useEffectOnChangeURL';
import { emailService } from '../services/email.service';
import { utilService } from '../services/util.service';

export function EmailIndex({ onToggleMenu }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const [emails, setEmails] = useState(emailService.getDefaultEmails());
    const [showOverlay, setshowOverlay] = useState(!utilService.isMobile());
    const [folderList, setFolderList] = useState({});
    
    const [filterBy, setFilterBy] = useState(emailService.getFilterFromParams(searchParams));
    const [sortBy, setSortBy] = useState(emailService.getDefaultSort());
    const [multyCheckedBy, setMultyCheckedBy] = useState(emailService.getDefaultMultyChecked());
    
    const [showEmailList, setShowEmailList] = useState(true);
    const [showFolderList, setShowFolderList] = useState(!utilService.isMobile());
    const [showFloatingComposeButton, setShowFloatingComposeButton] = useState(utilService.isMobile());
    const [showFilter, setShowFilter] = useState(utilService.isMobile());
    
    const navigate = useNavigate();
    const urlLocation = useLocation();
    const urlParams = useParams();
    const urlSearchParams = useRef(new URLSearchParams(urlLocation.search))

    // fetch emails
    const fetchEmails = async () => {
        try {
            const result = await emailService.query(filterBy, sortBy);
            setEmails(result);

            orgenizeFolderList(result);

            setMultyCheckedBy(emailService.getDefaultMultyChecked());

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
    
    const buildSearchParams = () => ({
        ...(filterBy.txt && { txt: filterBy.txt }),
        ...(filterBy.read !== null && { read: filterBy.read }),
        ...(urlSearchParams.current.get("to") !== null && { to: urlSearchParams.current.get("to") }),
        ...(urlSearchParams.current.get("subject") !== null && { subject: urlSearchParams.current.get("subject") }),
    });
    
    useEffect(() => {
        setSearchParams(buildSearchParams());
        fetchEmails();
    }, [filterBy, sortBy]);

    useEffect(() => {
        if (urlParams.folder) {
            filterBy.status = urlParams.folder;
        }
        fetchEmails();
    }, [urlParams.folder]);

    useEffectOnChangeURL(() => {
        setShowFloatingComposeButton(
            utilService.isMobile() && !(window.location.hash.includes('/compose/') || window.location.hash.includes('/details/')) 
        );

        setShowFilter(
            !window.location.hash.includes('/details/')
        );

        setShowEmailList(
            !window.location.hash.includes('/details/')
        );
    }, []);
    
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
    
    function onToggleMenu() {
        if (utilService.isMobile()) {
            setShowFolderList(!showFolderList);
            setshowOverlay(!showOverlay);
        }  
        
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
            navigate(`/email/${filterStatus}/compose/${pressedEmail.id}`);
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
        if (!utilService.isMobile()) {
            const checkedCheckboxes = document.querySelectorAll('.email-list input[type="checkbox"]:checked');
            const showActions = checkedCheckboxes.length > 0;
            return showActions;
        }
        else {
            const checkedRows = document.querySelectorAll('.email-list .selected');
            const showActions = checkedRows.length > 0;

            setMultyCheckedBy((prevMultyCheckedBy) => {
                return {
                    ...prevMultyCheckedBy, 
                    showActions: showActions,
                    counter: checkedRows.length
                };
            });
            
            return showActions;
        }
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
            onToggleMenu();
        }
        
        if (urlSearchParams.size === 0) {
            navigate(`/email/${filterBy.status}`);
        }
    }

    const { status: filterStatus, txt: filterText, read: filterRead } = filterBy;

    // sort
    function onSetSort(oredrBy) {
        setSortBy(prevSort => ({ ...prevSort, ...oredrBy }));
    }

    // compose
    async function onShowComposeEmail(email) {
        if (!email) {
            email = await emailService.createEmail();
        }
        
        navigate(`/email/${filterStatus}/compose/${email.id}`);
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
        {showOverlay && <Overlay onPress={onToggleMenu} />}

        <header>
            <EmailLogo onToggleMenu={onToggleMenu} />           
            <EmailSearch filterBy={filterBy} onSetFilter={onSetFilter} multyCheckedBy={multyCheckedBy} onSetMultyChecked={onSetMultyChecked} onToggleMenu={onToggleMenu} />          
        </header>
        <aside>
            <EmailFolderList selectedFolder={filterStatus} folderList={folderList} onShowComposeEmail={onShowComposeEmail} showFolderList={showFolderList} />
        </aside>
        <main>
            {showFilter && <EmailFilter filterBy={filterBy} onSetFilter={onSetFilter} sortBy={sortBy} onSetSort={onSetSort} multyCheckedBy={multyCheckedBy} onSetMultyChecked={onSetMultyChecked} />}        
            {showEmailList && <EmailList selectedFolder={filterStatus} emails={emails.list} onPress={onEmailPress} onCheck={onEmailCheck} onStar={onEmailStar} onDelete={onEmailDelete} onUnread={onEmailUnread} /> }  
            <Outlet context={{ onDelete: onEmailDelete, onAutoSave: onEmailSave, onSend: onEmailSend}} />
        </main> 
        {showFloatingComposeButton && <EmailComposeButton onShowComposeEmail={onShowComposeEmail} />}
    </>);
}
