import { useState, useEffect } from "react";
import { EmailCompose } from '../cmps/EmailCompose';

export function EmailFolderList({selecedFolder, inboxNewCount, starredCount, sentCount, draftCount, trashCount, onSelectFolder, onComposeEmail, onDeleteDraft, newDraftEmail, onAutoSaveDraft, onSendDraft}) {
    const liInboxClass = selecedFolder === "inbox" ? 'selected' : '';
    const liStarredClass = selecedFolder === "starred" ? 'selected' : '';
    const liSentClass = selecedFolder === "sent" ? 'selected' : '';
    const liDraftClass = selecedFolder === "draft" ? 'selected' : '';
    const liTrashClass = selecedFolder === "trash" ? 'selected' : '';

    const [showComposeEmail, setShowComposeEmail] = useState(false);
    const [composeEmail, setComposeEmail] = useState(null);

    const handleComposeEmail = () => {
        onComposeEmail();
        setShowComposeEmail(true);
        
    };

    useEffect(() => {
        setComposeEmail(newDraftEmail);
    }, [newDraftEmail]);

    return (
        <section className="email-folder-list">
            <ul className="thin1">
                <li className="compose"><button onClick={handleComposeEmail}><i className="fa-solid fa-pen"></i><div>Compose</div></button></li>
                <hr />
                <li className={liInboxClass} onClick={() => onSelectFolder({status: "inbox"})}><i className="fa-solid fa-inbox"></i><div>Inbox</div><div className="new-count">{inboxNewCount}</div></li>
                <li className={liStarredClass} onClick={() => onSelectFolder({status: "starred"})}><i className="fa-regular fa-star"></i><div>Starred</div><div className="new-count">{starredCount}</div></li>
                <li className={liSentClass} onClick={() => onSelectFolder({status: "sent"})}><i className="fa-regular fa-paper-plane"></i><div>Sent</div><div className="new-count">{sentCount}</div></li>
                <li className={liDraftClass} onClick={() => onSelectFolder({status: "draft"})}><i className="fa-brands fa-firstdraft"></i><div>Draft</div><div className="new-count">{draftCount}</div></li>
                <li className={liTrashClass} onClick={() => onSelectFolder({status: "trash"})}><i className="fa-regular fa-trash-can"></i><div>Trash</div><div className="new-count">{trashCount}</div></li>
            </ul>
            {showComposeEmail && (
                <EmailCompose
                    newDraftEmail={composeEmail}
                    onClose={() => setShowComposeEmail(false)}
                    onAutoSave={onAutoSaveDraft}
                    onSend={onSendDraft}
                    onDelete={() => onDeleteDraft(composeEmail)}
                />
            )}
        </section>
    )
}

