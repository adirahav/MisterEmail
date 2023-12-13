import React from 'react'
import { useState, useEffect, useRef } from "react";
import { utilService } from '../services/util.service';

export function EmailCompose({ newDraftEmail, onClose, onAutoSave, onSend, onDelete }) {
    const [recipients, setRecipients] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [draftEmail, setDraftEmail] = useState(newDraftEmail);
    const [lastDraftEmail, setLastDraftEmail] = useState(null);
    const [autoSaveInterval, setAutoSaveInterval] = useState(null);
    
    const AUTO_SAVE_TIME = 5 * 1000;    // 5 seconds in milliseconds

    // new draft email
    useEffect(() => {
        setDraftEmail(prevDraftEmail => ({ ...prevDraftEmail, ...newDraftEmail }))
        setLastDraftEmail(newDraftEmail);
    }, [newDraftEmail]);

    // field change action
    const handleFieldChanged = (ev) => {
        const { name, value } = ev.target;
    
        setDraftEmail((prevDraftEmail) => {
            const updatedDraft = { ...prevDraftEmail };
    
            switch (name) {
                case "recipients":
                    setRecipients(value);
                    updatedDraft.to = value;
                    break;
                case "subject":
                    setSubject(value);
                    updatedDraft.subject = value;
                    break;
                case "body":
                    setBody(value);
                    updatedDraft.body = value;
                    break;
            }
    
            return updatedDraft;
        });
    };
    

    // auto save
    useEffect(() => {
        startAutoSave();
        return () => {
          clearInterval(autoSaveInterval);
        };
    }, []);

    const startAutoSave = () => {
        const intervalId = setInterval(() => {
            setDraftEmail((prevDraftEmail) => {
                setLastDraftEmail((prevLastDraftEmail) => {
                    if (prevDraftEmail != null && prevDraftEmail != undefined) {
                        if (!utilService.areObjectsEqual(prevDraftEmail, prevLastDraftEmail)) {
                            onAutoSave(prevDraftEmail);
                            return prevDraftEmail; // return the changed state: setLastDraftEmail(prevDraftEmail)
                        }
                    }
        
                    return prevLastDraftEmail; // return the unchanged state: setLastDraftEmail(prevLastDraftEmail)
                });
    
                return prevDraftEmail; // return the unchanged state: setDraftEmail(prevDraftEmail)
            });
        }, AUTO_SAVE_TIME);
    
        setAutoSaveInterval(intervalId);
    };
    
    
    // send
    const handleSend = () => {
        function sendEmail() {
            draftEmail.to = recipients;
            draftEmail.subject = subject;
            draftEmail.body = body;
            onSend(draftEmail);
            onClose();
        }

        if (utilService.hasValidEmail(recipients)) {
            if (!subject && !body) {
                const result = window.confirm("`Send this message without a subject or text in the body?`");
                if (result) {
                    sendEmail()
                }
            }
            else {
                sendEmail()
            }
        } 
        else {
            alert(`Error\n
            Please specify at least one recipient.`);
        }
    };

    // delete
    const handleOnDelete = () => {
        onDelete(draftEmail);
        onClose();
    };

    return (
        <article className="email-compose">
            <header>
                <h2>New Message</h2>
                <div>
                    <i className="fa-solid fa-window-minimize fa-xs"></i>
                    <i className="fa-solid fa-up-right-and-down-left-from-center fa-xs"></i>
                    <i className="fa-solid fa-xmark" onClick={onClose}></i>
                </div>
            </header>
            <div className="new-message">
                <div className='recipients'>
                    <input
                        type="text"
                        placeholder="Recipients"
                        value={recipients}
                        id="recipients"
                        name="recipients"
                        onChange={handleFieldChanged}
                    />
                </div>
                <div className='subject'>
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        id="subject"
                        name="subject"
                        onChange={handleFieldChanged}
                    />
                </div>
                <textarea className='body' 
                        id="body"
                        name="body"
                        value={body}
                        onChange={handleFieldChanged} />
                <div className='actions'>
                    <button className='send' onClick={handleSend}>Send</button>
                    <i className="fa-regular fa-trash-can" onClick={handleOnDelete}></i>
                </div>
            </div>
        </article>
    )
}
