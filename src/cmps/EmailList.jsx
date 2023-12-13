import { EmailPreview } from '../cmps/EmailPreview';

export function EmailList({selecedFolder, emails, onPress, onStar, onDelete, onUnread}) {
    return (
        <section className="email-list">
            <table cellSpacing="0" rowspacing="0" border="0">
                <tbody>
                    {emails.map((email, index) => (
                        <EmailPreview key={index} selecedFolder={selecedFolder} email={email} onPress={onPress} onStar={onStar} onDelete={onDelete} onUnread={onUnread} />
                    ))}
                </tbody>
            </table>
        </section>
    )
}
