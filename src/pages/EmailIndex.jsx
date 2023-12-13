import React from 'react'
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { EmailFolderList } from "../cmps/EmailFolderList";
import { EmailFilter } from '../cmps/EmailFilter';
import { EmailList } from '../cmps/EmailList';
import { EmailDetails } from '../cmps/EmailDetails';
import { emailService } from '../services/email.service';

export function EmailIndex() {

    const [emails, setEmails] = useState(emailService.getDefaultEmails());
    const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter());
    const [sortBy, setSortBy] = useState(emailService.getDefaultSort());
    const [newEmail, setNewEmail] = useState(null);

    const { emailId } = useParams();
    
    const navigate = useNavigate();

    const fetchEmails = async () => {
        try {
            const result = await emailService.query(filterBy, sortBy);
            setEmails(result);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    useEffect(() => {
        fetchEmails();
    }, [filterBy, sortBy]);

    // details page
    const detailsEmail = emailId 
        ? emails.list.find(email => email.id === emailId) 
        : null;
    
    async function onEmailPress(pressedEmail) {
        if (!pressedEmail.isRead) {
            pressedEmail.isRead = true;
            await emailService.save(pressedEmail);
            /*setEmails((prevEmails) => {
                const updatedEmailsList = prevEmails.list.map((email) =>
                    email.id === pressedEmail.id ? { ...email, isRead: true } : email
                );
    
                const updatedEmails = {
                    list: updatedEmailsList.filter((email) => email.to === emailService.loggedinUser.email),
                    newInboxCount: filterBy.status === "inbox" ? prevEmails.newInboxCount - 1 : prevEmails.newInboxCount, 
                    starredCount: filterBy.status === "starred" ? prevEmails.starredCount - 1 : prevEmails.starredCount,
                    sentCount: filterBy.status === "sent" ? prevEmails.sentCount - 1 : prevEmails.sentCount,
                };
    
                return updatedEmails;
            });*/
            const result = await emailService.query(filterBy, sortBy);  // TODO: local update
            setEmails(result);
        }

        navigate(`/email/details/${pressedEmail.id}`);
    }

    // star
    async function onEmailStar(pressedEmail) {
        pressedEmail.isStarred = !pressedEmail.isStarred;
        await emailService.save(pressedEmail);

        const result = await emailService.query(filterBy, sortBy)   // TODO: local update
        setEmails(result);
    }

    // delete
    async function onEmailDelete(pressedEmail, navigateBack) {
        if (!pressedEmail.isDeleted) {
            pressedEmail.isDeleted = true;
            pressedEmail.removedAt = new Date().getTime();
            await emailService.save(pressedEmail);
        }
        else {
            await emailService.remove(pressedEmail.id);
        }

        const result = await emailService.query(filterBy, sortBy);  // TODO: local update
        setEmails(result);

        if (navigateBack) {
            navigate(`/email`);
        }
    }

    // star
    async function onEmailUnread(pressedEmail) {
        pressedEmail.isRead = !pressedEmail.isRead;
        await emailService.save(pressedEmail);

        const result = await emailService.query(filterBy, sortBy)   // TODO: local update
        setEmails(result);
    }


    // filter
    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    const { status: filterStatus, txt: filterText, read: filterRead } = filterBy

    const newInboxCount = emails.newInboxCount > 0 ? emails.newInboxCount : null;
    const starredCount = emails.starredCount > 0 ? emails.starredCount : null;
    const sentCount = emails.sentCount > 0 ? emails.sentCount : null;
    const draftCount = emails.draftCount > 0 ? emails.draftCount : null;
    const trashCount = emails.trashCount > 0 ? emails.trashCount : null;

    // sort
    const { by: sortField, direction: sortDirection } = sortBy;

    function onSetSort(oredrBy) {
        setSortBy(prevSort => ({ ...prevSort, ...oredrBy }))
    }

    // compose
    async function onComposeEmail() {
        const email = await emailService.createEmail();
        setNewEmail(email);

        const result = await emailService.query(filterBy, sortBy);  // TODO: local update
        setEmails(result);
    }

    async function onEmailSave(email) {
        await emailService.save(email);  
        const result = await emailService.query(filterBy, sortBy); // TODO: local update
        setEmails(result);
    }
    
    async function onEmailSend(email) {
        
        email.isDraft = false;
        email.sentAt = new Date().getTime();
        email.from = emailService.loggedinUser.email;

        await emailService.send(email); 
        const result = await emailService.query(filterBy, sortBy);  // TODO: local update
        setEmails(result);
    }

    return (
        <section className="email-index">
            <section className="email-index-left">
                <EmailFolderList selecedFolder={filterStatus} inboxNewCount={newInboxCount} starredCount={starredCount} sentCount={sentCount} draftCount={draftCount} trashCount={trashCount} onSelectFolder={onSetFilter} onComposeEmail={onComposeEmail} onDeleteDraft={onEmailDelete} newDraftEmail={newEmail} onAutoSaveDraft={onEmailSave} onSendDraft={onEmailSend} />      
            </section>
            <section className="email-index-right">
                <EmailFilter displaySort={!emailId} filterBy={filterBy} onSetFilter={onSetFilter} sortBy={{sortField, sortDirection}} onSetSort={onSetSort} />        
                {!emailId && <EmailList selecedFolder={filterStatus} emails={emails.list} onPress={onEmailPress} onStar={onEmailStar} onDelete={onEmailDelete} onUnread={onEmailUnread} />}  
                {emailId && <EmailDetails email={detailsEmail} onDelete={onEmailDelete} />}  
            </section>  
        </section>
    )
}
