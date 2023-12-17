import React from 'react'
import { useState, useEffect, useRef } from "react";
import { utilService } from '../services/util.service';

export function EmailCompose({ composedEmail, onClose, onAutoSave, onSend, onDelete }) {
    const [header, setHeader] = useState(composedEmail && composedEmail.subject ? composedEmail.subject : "New Message")
    const [recipients, setRecipients] = useState(composedEmail ? composedEmail.to : '');
    const [subject, setSubject] = useState(composedEmail ? composedEmail.subject : '');
    const [body, setBody] = useState(composedEmail ? composedEmail.body : '');
    const [draftEmail, setDraftEmail] = useState(composedEmail);
    const [lastDraftEmail, setLastDraftEmail] = useState(null);
    const [autoSaveInterval, setAutoSaveInterval] = useState(null);
    const [resize, setResize] = useState('maximize');
    const [fullscreen, setFullscreen] = useState('not-fullscreen');
    
    const AUTO_SAVE_TIME = 5 * 1000;    // 5 seconds in milliseconds

    // new draft email
    useEffect(() => {
        setDraftEmail((prevDraftEmail) => {
            if (prevDraftEmail.id !== composedEmail.id) {
                setHeader(composedEmail.subject === "" ? "New Message" : composedEmail.subject)
                setRecipients(composedEmail.recipients);
                setSubject(composedEmail.subject);
                setBody(composedEmail.body);
            }

            return { ...prevDraftEmail, ...composedEmail }; 
        });

        //setDraftEmail(prevDraftEmail => ({ ...prevDraftEmail, ...composedEmail }))
        setLastDraftEmail(composedEmail);
    }, [composedEmail]);

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
                    if (prevDraftEmail !== null && prevDraftEmail !== undefined) {
                        if (!utilService.areObjectsEqual(prevDraftEmail, prevLastDraftEmail)) {
                            onAutoSave(prevDraftEmail);
                            setHeader("Draft saved");
                            setTimeout(() => {
                                setHeader(prevDraftEmail.subject);
                            }, 5000);
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

    // resize
    function windowResize() {
        setResize((prevResize) => {
            return prevResize == "minimize"
                    ? "maximize" 
                    : "minimize";
        }); 
    }

    const resizeClass = `fa-solid fa-window-${resize == 'minimize' ? 'maximize' : 'minimize'} fa-xs`;

    // fullscreen
    function windowFullscreen() {
        setFullscreen((prevFullscreen) => {
            if (prevFullscreen == "fullscreen") {
                return "not-fullscreen";
            }
            else {
                setResize("maximize");
                return "fullscreen";
            }
        }); 
    }

    const fullscreenClass = `fa-solid ${fullscreen == 'fullscreen' ?  'fa-solid fa-down-left-and-up-right-to-center' : 'fa-up-right-and-down-left-from-center'} fa-xs`;

    return (
        <article className={`email-compose ${resize} ${fullscreen}`}>
            <header className="web">
                <h2>{header}</h2>
                <div>
                    <i className={resizeClass} onClick={windowResize}></i>
                    <i className={fullscreenClass} onClick={windowFullscreen}></i>
                    <i className="fa-solid fa-xmark" onClick={onClose}></i>
                </div>
            </header>
            <header className="mobile">
                <h2><i className="fa-solid fa-arrow-left" onClick={onClose}></i></h2>
                <div>
                    <i className="fa-regular fa-paper-plane" onClick={handleSend}></i>
                    <i className="fa-regular fa-trash-can" onClick={handleOnDelete}></i>
                </div>
            </header>
            <div className="new-message">
                <div className='recipients'>
                    <input
                        type="text"
                        placeholder="Recipients"
                        value={recipients ?? ''}
                        id="recipients"
                        name="recipients"
                        onChange={handleFieldChanged}
                    />
                </div>
                <div className='subject'>
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject ?? ''}
                        id="subject"
                        name="subject"
                        onChange={handleFieldChanged}
                    />
                </div>
                <textarea className='body' 
                        id="body"
                        name="body"
                        value={body ?? ''}
                        onChange={handleFieldChanged} />
                <div className='actions'>
                    <button className='send' onClick={handleSend}>Send</button>
                    <i className="fa-regular fa-trash-can" onClick={handleOnDelete}></i>
                </div>
            </div>
        </article>
    )
}
