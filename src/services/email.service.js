import { storageService } from './async-storage.service.js';
import { utilService } from './util.service.js';

const STORAGE_KEY = 'emails';
const DEFAULT_FOLDER = 'inbox';
const DEFAULT_SORT_BY = 'sentAt';
const DEFAULT_SORT_DIRECTION = 'desc';
const DEFAULT_MULTY_CHECKED = 'unchecked';
const DEFAULT_MULTY_FILTER = 'none';

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
    actionByIds,
    createEmail,
    getDefaultEmails,
    getDefaultFilter,
    getFilterFromParams,
    getDefaultMultyChecked,
    getDefaultSort,
    getStatistics,
    loggedinUser
}

_createEmails();

async function query(filterBy, sortBy) {
    // get all
    let emails = await storageService.query(STORAGE_KEY);
    
    const { status: filterStatus, txt: filterText, read: filterRead } = filterBy;
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

    switch (filterStatus) {
        case "inbox":
            emails = filteredEmails.inbox;
            break;
        case "starred":
            emails = filteredEmails.starred;
            break;
        case "sent":
            emails = filteredEmails.sent;
            break;    
        case "draft":
            emails = filteredEmails.draft;
            break;       
        case "trash":
            emails = filteredEmails.deleted;
            break;         
    }

    // filter by search in subject
    if (filterText) {
        emails = emails.filter(email => email.subject.includes(filterText));
    }
    
    // filter by read / unread
    if (filterRead !== null) {
        emails = emails.filter(email => email.isRead === filterRead);
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
        newInboxCount: filteredEmails.inbox.filter(email => email.isRead === false).length,
        starredCount: 0,
        sentCount: 0,
        draftCount: filteredEmails.draft.length,
        trashCount: 0,
    }
}

async function actionByIds(IDs, action) {
    
    const emails = await storageService.query(STORAGE_KEY);
    const filteredEmails = emails.filter(email => IDs.includes(email.id));
    
    const updatedEmails = filteredEmails.map((email) => {
        if (IDs.includes(email.id)) {
            switch (action) {
                case "delete":
                    email.isDeleted = true;
                    break;
                case "read":
                    email.isRead = true;
                    break;
                case "unread":
                    email.isRead = false;
                    break;
                case "starred":
                    email.isStarred = true;
                    break;
                case "unstarred":
                    email.isStarred = false;
                    break;
            }
        }

        return email;
    });

    const results = await storageService.putList(STORAGE_KEY, updatedEmails);
    return results;
}

function getById(id) {
    return storageService.get(STORAGE_KEY, id);
}

function remove(id) {
    return storageService.remove(STORAGE_KEY, id);
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
    const email = { 
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
    
    const composedEmail = await storageService.post(STORAGE_KEY, email);
    return composedEmail;
}

function getDefaultFilter() {
    return {
        status: DEFAULT_FOLDER,
        txt: '',
        read: null
    };
}

function getFilterFromParams(searchParams) {
    const defaultFilter = getDefaultFilter();
    const filterBy = {};
    for (const field in defaultFilter) {
        const fieldValue = searchParams.get(field) || defaultFilter[field];
    
        filterBy[field] = fieldValue === 'true' || fieldValue === 'false' 
                            ? Boolean(fieldValue)
                            : fieldValue;
    }
    
    return filterBy;
}

function getDefaultMultyChecked() {
    return {
        checked: DEFAULT_MULTY_CHECKED,  // checked | unchecked | partial
        filter: DEFAULT_MULTY_FILTER,    // all | none | read | unread | starred | unstarred
        action: null,
        showActions: false,
        counter: 0
    };
}

function getDefaultSort() {
    return {
        by: DEFAULT_SORT_BY,
        direction: DEFAULT_SORT_DIRECTION,
    };
}

async function getStatistics() {
    // get all
    let emails = await storageService.query(STORAGE_KEY);
    
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

    return [
        {key: 'inbox', value: filteredEmails.inbox.length},
        {key: 'starred', value: filteredEmails.starred.length},
        {key: 'sent', value: filteredEmails.sent.length},
        {key: 'draft', value: filteredEmails.draft.length},
        {key: 'deleted', value: filteredEmails.deleted.length}
    ]
}

function _createEmails() {
    let emails = utilService.loadFromStorage(STORAGE_KEY);
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
        ];
        utilService.saveToStorage(STORAGE_KEY, emails);
    }
}




