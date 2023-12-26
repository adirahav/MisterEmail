import { useEffect, useState } from 'react';
import { EmailPreview } from '../cmps/EmailPreview';

export function EmailList({selectedFolder, emails, onPress, onCheck, onStar, onDelete, onUnread}) {
    const [emailList, setEmailList] = useState(emails);

    useEffect(() => {
        setEmailList(emails);
    }, [emails]);

    return (
        <>
            <section className="email-list">
                {emailList.map((email, index) => (
                    <EmailPreview key={index} selectedFolder={selectedFolder} email={email} onPress={onPress} onCheck={onCheck} onStar={onStar} onDelete={onDelete} onUnread={onUnread} />
                ))}
            </section>
            <div className="email-list-footer"></div>
        </>
    )
}
