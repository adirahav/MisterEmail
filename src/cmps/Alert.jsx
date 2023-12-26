import { useEffect, useState } from "react"
import { eventBusService } from "../services/event-bus.service"

window.showSuccessAlert = showSuccessAlert
window.showWarningAlert = showWarningAlert
window.showErrorAlert = showErrorAlert
window.showMessageAlert = showMessageAlert

export function Alert() {

    const [displayAlert, setDisplayAlert] = useState(false);    
    const [type, setType] = useState('message');    // error | warning | success | message
    const [message, setMessage] = useState('');
    const [positiveButton, setPositiveButton] = useState({show: true, text: "", onPress: null, closeAfterPress: true});
    const [negativeButton, setNegativeButton] = useState({show: true, text: "", onPress: null, closeAfterPress: true});
    const [closeButton, setCloseButton] = useState({show: true, autoClose: true, autoCloseSeconds: 3});
    
    useEffect(() => {
        const unsubscribe = eventBusService.on('show-alert', (data) => {
            setType(data.type ?? type);
            setMessage(data.message);
            setPositiveButton({ ...positiveButton, ...data.positiveButton });
            setNegativeButton({ ...negativeButton, ...data.negativeButton });
            
            setCloseButton((prevCloseButton) => {
                const _closeButton = { ...closeButton, ...data.closeButton };
                
                if (_closeButton && _closeButton.autoClose) {
                    setTimeout(() => {
                        onClose()
                    }, _closeButton.autoCloseSeconds * 1000);
                }
    
                return _closeButton; 
            }); 

            setDisplayAlert(true);
        })

        return unsubscribe
    }, [type, message, positiveButton, negativeButton, closeButton])

    function onClose() {
        setType(null)
        setMessage(null)
        setPositiveButton(null)
        setNegativeButton(null)
        setCloseButton(null)
        setDisplayAlert(false)
    }

    function handleButton(button) {
        if (button === null) {
            return;
        }

        if (button.onPress !== null) {
            button.onPress();
        }
        
        if (button.closeAfterPress) {
            onClose();
        }
    }

    if (!displayAlert) return <></>;

    function getHeader() {  
        switch (type) {
            case "error":     return <><div><i className="fa-solid fa-triangle-exclamation"></i><h2>Error</h2></div></>;
            case "warning":   return <><div><i className="fa-solid fa-bell"></i><h2>Warning</h2></div></>;
            case "success":   return <><div><i className="fa-solid fa-circle-check"></i><h2>Success</h2></div></>;
            case "message":   return <><div><i className="fa-solid fa-comment-dots"></i><h2>Message</h2></div></>;
            default: <></>
        }
    }

    return (
        <div className={"alert " + type}>
            <header>
                {getHeader()}
                {closeButton.show && <i className="fa-solid fa-xmark" onClick={onClose}></i>}
            </header>
            <section className="message">
                <p>{message}</p>
            </section>
            <section className="buttons">
                {positiveButton.show && <button className='positive' onClick={() => handleButton(positiveButton)}>{positiveButton.text}</button>}
                {negativeButton.show && <button className='negative' onClick={() => handleButton(negativeButton)}>{negativeButton.text}</button>}
            </section>
        </div>
    )
}

function showAlert(data) {
    eventBusService.emit('show-alert', data);
}

export function showErrorAlert(data) {
    showAlert({ ...data, type: 'error' });
}

export function showWarningAlert(data) {
    showAlert({ ...data, type: 'warning' });
}

export function showSuccessAlert(data) {
    showAlert({ ...data, type: 'success' });
}

export function showMessageAlert(data) {
    showAlert({ ...data, type: 'message' });
}