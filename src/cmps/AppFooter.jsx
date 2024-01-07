import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { utilService } from '../services/util.service';
import { Link } from "react-router-dom";
import { IconSizes, HelpIcon, CloseIcon } from '../assets/Icons';
import { Button } from "@mui/material";
import { Tooltip } from 'react-tooltip';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

export function AppFooter() {

    const [showHelpButton, setShowHelpButton] = useState(true);
    const [showHelpForm, setShowHelpForm] = useState(false);

    const refHelpButton = useRef();
    const refHelpForm = useRef();

    const navigate = useNavigate();

    // help
    const HelpFormSchema = Yup.object().shape({
        mailto: Yup.string()
          .min(2, 'Email is too Short.')
          .email('Invalid email.')
          .max(50, 'Email is too Long.')
          .required('Email is required.'),
        subject: Yup.string()
          .min(2, 'Subject is too Short.')
          .max(50, 'Subject is too Long.')
          .required('Subject is Required')
    });

    const handleDisplayHelp = async () => {
        if (showHelpForm) {
            utilService.animateCSS(refHelpForm.current, 'backOutDown');
            setTimeout(() => {
                setShowHelpForm(false);
                setShowHelpButton(true);
            }, 500);  
        }
        else {
            setShowHelpButton(false);
            setShowHelpForm(true);
        }
    } 

    const buttpmClass = `help-button ${showHelpButton ? '' : 'hide-content'}`
    const formClass = `help-form ${showHelpForm ? '' : 'hide-content'}`

    function EmailInput(props) {
        return <input type="email" {...props} />
    }

    return (
        <footer className="app-footer">
            <p>&copy; 2023 Mister Email. All rights reserved.</p>
            {/*<Link className="help-button" to={{ pathname: '/email/inbox/compose', search: ',?to=help@gmail.com&subject=Help' }}><HelpIcon sx={ IconSizes.Medium } /> Help</Link>*/}
            <Link className={buttpmClass} onClick={handleDisplayHelp} ref={refHelpButton}><HelpIcon sx={ IconSizes.Medium } /> Help</Link>
            <div className={formClass} ref={refHelpForm}>
                <header>
                    <HelpIcon sx={ IconSizes.Medium } />
                    <CloseIcon sx={ IconSizes.Medium } onClick={handleDisplayHelp} data-tooltip-id="tooltip-close" data-tooltip-content="Close" /><Tooltip id="tooltip-close" place="bottom" />
                </header>
                
                <Formik
                    initialValues={{
                        mailto: 'help@gmail.com',
                        subject: 'Help',
                    }}
                    validationSchema={HelpFormSchema}
                    onSubmit={values => {
                        navigate(`/email/inbox/compose?to=${values.mailto}&subject=${values.subject}`);
                    }}
                    >
                    {({ errors, touched }) => (
                        <Form>
                            
                            <span>Email:</span>
                            <Field name="mailto" as={EmailInput} />
                            {touched.mailto && errors.mailto && <div>{errors.mailto}</div>}

                            <span>Subject:</span>
                            <Field name="subject" />
                            {touched.subject && errors.subject && <div>{errors.subject}</div>}

                            <Button type="submit" variant="contained">Send</Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </footer>
    );
}
