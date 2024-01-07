import { EmailPreview } from '../cmps/EmailPreview';

export function EmailList({selectedFolder, emails, onPress, onCheck, onStar, onDelete, onUnread}) {
    return (
        <section className="email-list">
            {emails.map((email, index) => (
                <EmailPreview key={index} selectedFolder={selectedFolder} email={email} onPress={onPress} onCheck={onCheck} onStar={onStar} onDelete={onDelete} onUnread={onUnread} />
            ))}
            <div className="email-list-footer"></div>
        </section>
    );
}
