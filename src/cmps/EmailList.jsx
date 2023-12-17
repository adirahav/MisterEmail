import { EmailPreview } from '../cmps/EmailPreview';

export function EmailList({selecedFolder, emails, onPress, onStar, onDelete, onUnread}) {
    return (
        <>
            <section className="email-list">
                {emails.map((email, index) => (
                    <EmailPreview key={index} selecedFolder={selecedFolder} email={email} onPress={onPress} onStar={onStar} onDelete={onDelete} onUnread={onUnread} />
                ))}
            </section>
            <div className="email-list-footer"></div>
        </>
    )
}
