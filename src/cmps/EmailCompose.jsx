import React from 'react';
import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { utilService } from '../services/util.service';
import { emailService } from "../services/email.service";
import { Button } from "@mui/material";
import { IconSizes, ArrowLeftIcon, SendIcon, FullscreenIcon, FullscreenExitIcon, MinimizeIcon, MaximizeIcon, CloseIcon, TrashIcon, MapMarkerIcon, AddLocationIcon } from '../assets/Icons';

export function EmailCompose() {
    const urlLocation = useLocation();

    const { onAutoSave, onSend, onDelete } = useOutletContext();
    const [draftEmail, setDraftEmail] = useState(null);
    const [header, setHeader] = useState('');
    const [lastDraftEmail, setLastDraftEmail] = useState(null);
    const [autoSaveInterval, setAutoSaveInterval] = useState(null);
    const [isMaximize, setIsMaximize] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    const refBody = useRef();

    const urlParams = useParams();
    const navigate = useNavigate();
    const AUTO_SAVE_TIME = 5 * 1000;    // 5 seconds in milliseconds

    const urlSearchParams = useRef(new URLSearchParams(urlLocation.search))

    // load email
    useEffect(() => {
        loadEmail();
    }, [urlParams.emailId])

    async function loadEmail() {
        
        try {
            const email = urlParams.emailId
                            ? await emailService.getById(urlParams.emailId)
                            : await getParamsFromURL();
            
            setDraftEmail(email);
        } catch (err) {
            navigate('/email');
            console.log('Had issues loading email', err);
        }
    }

    async function getParamsFromURL() {
        const email = await emailService.createEmail();
        
        for (const field in email) {
            email[field] = urlSearchParams.current.get(field) || email[field];
        }
        
        return email;
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
    const handleSend = (ev) => {
        function sendEmail() {
            onSend(draftEmail);
            handleClose();
        }
        
        ev.preventDefault();
        ev.stopPropagation();

        if (utilService.hasValidEmail(draftEmail.to)) {
            
            if (!subject.subject && !subject.body) {
                showWarningAlert({
                    message: 'Send this message without a subject or text in the body?',
                    closeButton: { show: true, autoClose: false }, 
                    positiveButton: { show: true, text: "OK", onPress: () => { sendEmail() }, closeAfterPress: true }, 
                    negativeButton: { show: true, text: "Cancel", onPress: null, closeAfterPress: true }, 
                });
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
        setIsMaximize(!isMaximize); 
    }

    const resizeClass = isMaximize ? 'maximize' : 'minimize';

    function DynamicResizeIcon(props) {    
        return props.maximize == "true"
            ? <MaximizeIcon {...props} />
            : <MinimizeIcon {...props} />;
    }

    // fullscreen
    function windowFullscreen() {
        setIsFullscreen((prevIsFullscreen) => {
            if (!isFullscreen && !isMaximize) {
                setIsMaximize(true)
            }
            return !prevIsFullscreen;
        }); 
    }

    const fullscreenClass = isFullscreen ? 'fullscreen' : '';

    function DynamicFullscreenIcon(props) {    
        return props.fullscreen == "true"
            ? <FullscreenIcon {...props} />
            : <FullscreenExitIcon {...props} />;
    }

    // map
    const handleAddUsertLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const coords = `{ lat: ${latitude}, lng: ${longitude} }`;
                
                const cursorPos = refBody.current.selectionStart;
                const currentValue = refBody.current.value;
                const newValue = currentValue.substring(0, cursorPos) 
                                + coords.toString() 
                                + currentValue.substring(cursorPos);
                refBody.current.value = newValue;
                refBody.current.setSelectionRange(cursorPos + coords.length, cursorPos + coords.length);
                
                setDraftEmail({...draftEmail, body: newValue});
            },
            (error) => {
                showErrorAlert({
                    message: `Error getting user location: <br /> ${error.message}`,
                    closeButton: { show: false, autoClose: false }, 
                    positiveButton: { show: true, text: "OK", onPress: null, closeAfterPress: true }, 
                    negativeButton: { show: false } 
                });
            }
            );
        } 
        else {
            showWarningAlert({
                message: `Geolocation is not supported by this browser.`,
                closeButton: { show: false, autoClose: false }, 
                positiveButton: { show: true, text: "OK", onPress: null, closeAfterPress: true }, 
                negativeButton: { show: false } 
            });
        }
    };

    if (!draftEmail) return <></>;
    
    return (
        <section className={`email-compose ${resizeClass} ${fullscreenClass}`}>
            <header className="web">
                <h2>{header}</h2>
                <div>
                    <DynamicResizeIcon maximize={isMaximize.toString()} onClick={windowResize} sx={ IconSizes.Large } />
                    <DynamicFullscreenIcon fullscreen={isFullscreen.toString()} onClick={windowFullscreen} sx={ IconSizes.Large } />
                    <CloseIcon onClick={handleClose} sx={ IconSizes.Large } />
                </div>
            </header>
            <header className="mobile">
                <h2><ArrowLeftIcon onClick={handleClose} sx={ IconSizes.Large } /></h2>
                <div>
                    <SendIcon onClick={handleSend} sx={ IconSizes.Large } />
                    <AddLocationIcon onClick={handleAddUsertLocation} sx={ IconSizes.Large } />
                    <TrashIcon onClick={handleDelete} sx={ IconSizes.Large } />
                </div>
            </header>
            <form className="new-message" onSubmit={handleSend}>
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
                        onChange={handleFieldChanged}
                        ref={refBody}>
                </textarea>

                
                <div className='actions'>
                    <Button type="submit" variant="contained" className='send'>Send</Button>
                    <article>
                        <AddLocationIcon onClick={handleAddUsertLocation} sx={ IconSizes.Large } />
                        <TrashIcon onClick={handleDelete} sx={ IconSizes.Large } />
                    </article>
                </div>
            </form>
        </section>
        
    );
}
