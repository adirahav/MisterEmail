import React from 'react'
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { utilService } from '../services/util.service';
import { emailService } from "../services/email.service";

export function EmailCompose() {
    const location = useLocation();

    const { onAutoSave, onSend, onDelete } = useOutletContext()
    const [draftEmail, setDraftEmail] = useState(null);
    const [header, setHeader] = useState('')
    const [lastDraftEmail, setLastDraftEmail] = useState(null);
    const [autoSaveInterval, setAutoSaveInterval] = useState(null);
    const [resize, setResize] = useState('maximize');
    const [fullscreen, setFullscreen] = useState('not-fullscreen');
    const [urlParams, setURLParams] = useSearchParams(new URLSearchParams(location.search))
    
    const params = useParams();
    const navigate = useNavigate();
    const AUTO_SAVE_TIME = 5 * 1000;    // 5 seconds in milliseconds

    // load email
    useEffect(() => {
        loadEmail();
    }, [params.emailId])

    async function loadEmail() {
        try {   
            const email = params.emailId
                            ? await emailService.getById(params.emailId)
                            : await getParamsFromURL();
            
            setDraftEmail(email)
        } catch (err) {
            navigate('/email')
            console.log('Had issues loading email', err);
        }
    }

    async function getParamsFromURL() {
        const email = await emailService.createEmail();
        
        for (const field in email) {
            email[field] = urlParams.get(field) || email[field];
        }
        
        return email
    }

    // header
    useEffect(() => {
        setHeader(draftEmail && draftEmail.subject !== '' ? draftEmail.subject : "New Message");
    }, [draftEmail])

    // field change action
    const handleFieldChanged = (ev) => {
        const { name, value } = ev.target;
    
        switch (name) {
            case "to":
                setDraftEmail({...draftEmail, to: value});
                break;
            case "subject":
                setDraftEmail({...draftEmail, subject: value});
                break;
            case "body":
                setDraftEmail({...draftEmail, body: value});
                break;
        }
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
                                setHeader(prevDraftEmail && prevDraftEmail.subject !== '' ? prevDraftEmail.subject : "New Message");
                            }, AUTO_SAVE_TIME);
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
    
    // close
    const handleClose = () => {
        //navigate(-1);
        navigate(`/email`);
    }
    
    // send
    const handleSend = () => {
        function sendEmail() {
            onSend(draftEmail);
            handleClose();
        }

        if (utilService.hasValidEmail(draftEmail.to)) {
            if (!subject && !body) {
                const result = window.confirm("`Send this message without a subject or text in the body?`");
                if (result) {
                    sendEmail();
                }
            }
            else {
                sendEmail();
            }
        } 
        else {
            showErrorAlert({
                message: 'Please specify at least one recipient.',
                closeButton: { show: false, autoClose: false }, 
                positiveButton: { show: true, text: "OK", onPress: null, closeAfterPress: true }, 
                negativeButton: { show: false } 
            });
        }
    };

    // delete
    const handleDelete = () => {
        onDelete(draftEmail);
        handleClose();
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

    if (!draftEmail) return <></>;

    return (
        <article className={`email-compose ${resize} ${fullscreen}`}>
            <header className="web">
                <h2>{header}</h2>
                <div>
                    <i className={resizeClass} onClick={windowResize}></i>
                    <i className={fullscreenClass} onClick={windowFullscreen}></i>
                    <i className="fa-solid fa-xmark" onClick={handleClose}></i>
                </div>
            </header>
            <header className="mobile">
                <h2><i className="fa-solid fa-arrow-left" onClick={handleClose}></i></h2>
                <div>
                    <i className="fa-regular fa-paper-plane" onClick={handleSend}></i>
                    <i className="fa-regular fa-trash-can" onClick={handleDelete}></i>
                </div>
            </header>
            <div className="new-message">
                <div className='recipients'>
                    <input
                        type="text"
                        placeholder="Recipients"
                        value={draftEmail.to ?? ''}
                        id="to"
                        name="to"
                        onChange={handleFieldChanged}
                    />
                </div>
                <div className='subject'>
                    <input
                        type="text"
                        placeholder="Subject"
                        value={draftEmail.subject ?? ''}
                        id="subject"
                        name="subject"
                        onChange={handleFieldChanged}
                    />
                </div>
                <textarea className='body' 
                        id="body"
                        name="body"
                        value={draftEmail.body ?? ''}
                        onChange={handleFieldChanged} />
                <div className='actions'>
                    <button className='send' onClick={handleSend}>Send</button>
                    <i className="fa-regular fa-trash-can" onClick={handleDelete}></i>
                </div>
            </div>
        </article>
    )
}
