import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'emails'
const DEFAULT_FOLDER = 'inbox'
const DEFAULT_SORT_BY = 'sentAt'
const DEFAULT_SORT_DIRECTION = 'desc'

const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}

export const emailService = {
    query,
    save,
    send,
    remove,
    getById,
    createEmail,
    getDefaultEmails,
    getDefaultFilter,
    getDefaultSort,
    loggedinUser
}

_createEmails()

async function query(filterBy, sortBy) {
    // get all
    let emails = await storageService.query(STORAGE_KEY)
    
    const { status: filterStatus, txt: filterText, read: filterRead } = filterBy
    const { by: sortField, direction: sortDirection } = sortBy;

    // filter by folder
    const filteredEmails = {
        inbox: [],
        starred: [],
        sent: [],
        draft: [],
        deleted: [],
    };

    emails.forEach(email => {
        if (email.to === emailService.loggedinUser.email && !email.isDeleted && !email.isDraft) {
            filteredEmails.inbox.push(email);
        }
        if (email.isStarred && !email.isDeleted && !email.isDraft) {
            filteredEmails.starred.push(email);
        }
        if (email.from === emailService.loggedinUser.email && !email.isDeleted && !email.isDraft) {
            filteredEmails.sent.push(email);
        }
        if (!email.isDeleted && email.isDraft) {
            filteredEmails.draft.push(email);
        }
        if (email.isDeleted) {
            filteredEmails.deleted.push(email);
        }
    });

    const _inboxEmails = filteredEmails.inbox;
    const _starredEmails = filteredEmails.starred;
    const _sentEmails = filteredEmails.sent;
    const _draftEmails = filteredEmails.draft;
    const _deletedEmails = filteredEmails.deleted;
    
    switch (filterStatus) {
        case "inbox":
            emails = _inboxEmails;
            break;
        case "starred":
            emails = _starredEmails;
            break;
        case "sent":
            emails = _sentEmails;
            break;    
        case "draft":
            emails = _draftEmails;
            break;       
        case "trash":
            emails = _deletedEmails;
            break;         
    }

    // filter by search in subject
    if (filterText) {
        emails = emails.filter(email => email.subject.includes(filterText))
    }
    
    // filter by read / unread
    if (filterRead !== null) {
        emails = emails.filter(email => email.isRead === filterRead)
    }

    // sort by date / txt
    let _sortField = sortField;
    if (_sortField === "sentAt" && filterStatus === "draft") {
        _sortField = "createAt";
    }

    if (sortDirection === "asc") {
        emails = emails.sort((a, b) => {
            if (typeof a[_sortField] === 'string') {
                return a[_sortField].localeCompare(b[_sortField]);
            } else {
                return a[_sortField] - b[_sortField];
            }
        });
    } else {
        emails = emails.sort((a, b) => {
            
            if (typeof a[_sortField] === 'string') {
                return b[_sortField].localeCompare(a[_sortField]);
            } else {
                return b[_sortField] - a[_sortField];
            }
        });
    }
    
    return {
        list: emails,
        newInboxCount: _inboxEmails.filter(email => email.isRead === false).length,
        starredCount: _starredEmails.length,
        sentCount: _sentEmails.length,
        draftCount: _draftEmails.length,
        trashCount: _deletedEmails.length,
    }
}

function getById(id) {
    return storageService.get(STORAGE_KEY, id)
}

function remove(id) {
    return storageService.remove(STORAGE_KEY, id)
}

function save(emailToSave) {
    if (emailToSave.id) {
        return storageService.put(STORAGE_KEY, emailToSave);
    } 
    else {
        return storageService.post(STORAGE_KEY, emailToSave);
    }
}

function send(emailToSend) {
    return storageService.put(STORAGE_KEY, emailToSend);
}

function getDefaultEmails() {
    return {
        list: [],
        newInboxCount: 0,
        starredCount: 0,
        sentCount: 0,
        draftCount: 0,  
        trashCount: 0,
    }
}

async function createEmail() {
    var email = { 
        subject: '', 
        body: '', 
        isRead: false, 
        isStarred: false, 
        isDeleted: false, 
        isDraft: true, 
        createAt: new Date().getTime(), 
        sentAt: null, 
        removedAt : null, 
        from: null, 
        to: null 
    };
    
    const newEmail = await storageService.post(STORAGE_KEY, email);
    return newEmail;
}

function getDefaultFilter() {
    return {
        status: DEFAULT_FOLDER,
        txt: '',
        read: null
    }
}

function getDefaultSort() {
    return {
        by: DEFAULT_SORT_BY,
        direction: DEFAULT_SORT_DIRECTION,
    }
}

function _createEmails() {
    let emails = utilService.loadFromStorage(STORAGE_KEY)
    if (!emails || !emails.length) {
        emails = [
            { id: 'e101', subject: 'ccc inbox unread not-starred', body: 'unread not-starred', isRead: false, isStarred: false, isDeleted: false, isDraft: false, createAt : 1702064110594, sentAt : 1702064110594, removedAt : null, from: 'momo@momo.com', to: 'user@appsus.com' },
            { id: 'e102', subject: 'inbox read not-starred draft', body: 'read not-starred', isRead: true, isStarred: false, isDeleted: false, isDraft: true, createAt : 1702064110594, sentAt : 1701924110594, removedAt : null, from: 'momo@momo.com', to: 'user@appsus.com' },
            { id: 'e103', subject: 'ddd inbox unread starred', body: 'unread starred', isRead: false, isStarred: true, isDeleted: false, isDraft: false, createAt : 1702064110594, sentAt : 1551133930594, removedAt : null, from: 'momo@momo.com', to: 'user@appsus.com' },
            { id: 'e104', subject: 'bbb inbox read starred', body: 'read starred', isRead: true, isStarred: true, isDeleted: false, isDraft: false, createAt : 1702064110594, sentAt : 1551133930594, removedAt : null, from: 'momo@momo.com', to: 'user@appsus.com' },
            { id: 'e105', subject: 'sent unread not-starred', body: 'unread not-starred', isRead: false, isStarred: false, isDeleted: false, isDraft: false, createAt : 1702064110594, sentAt : 1551133930594, removedAt : null, from: 'user@appsus.com', to: 'momo@momo.com' },
            { id: 'e106', subject: 'sent read not-starred', body: 'read not-starred', isRead: true, isStarred: false, isDeleted: false, isDraft: false, createAt : 1702064110594, sentAt : 1551133930594, removedAt : null, from: 'user@appsus.com', to: 'momo@momo.com' },
            { id: 'e107', subject: 'sent unread starred', body: 'unread starred', isRead: false, isStarred: true, isDeleted: false, isDraft: false, createAt : 1702064110594, sentAt : 1551133930594, removedAt : null, from: 'user@appsus.com', to: 'momo@momo.com' },
            { id: 'e108', subject: 'sent read starred', body: 'read starred', isRead: true, isStarred: true, isDeleted: false, isDraft: false, createAt : 1702064110594, sentAt : 1551133930594, removedAt : null, from: 'user@appsus.com', to: 'momo@momo.com' },
            { id: 'e109', subject: 'aaa inbox read starred', body: 'read starred', isRead: true, isStarred: true, isDeleted: false, isDraft: false, createAt : 1702064110594, sentAt : 1702126431000, removedAt : null, from: 'momo@momo.com', to: 'user@appsus.com' },
            { id: 'e110', subject: 'trash read starred', body: 'read starred', isRead: true, isStarred: true, isDeleted: true, isDraft: false, createAt : 1702064110594, sentAt : 1702126431000, removedAt : null, from: 'momo@momo.com', to: 'user@appsus.com' },
        ]
        utilService.saveToStorage(STORAGE_KEY, emails)
    }
}




