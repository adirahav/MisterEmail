import { useNavigate } from 'react-router-dom';
import { EmailComposeButton } from "./EmailComposeButton";
import { IconSizes, InboxIcon, StarIcon, SentIcon, DraftIcon, TrashIcon } from '../assets/Icons';

export function EmailFolderList({selectedFolder, folderList, onShowComposeEmail, showFolderList}) {
    
    const navigate = useNavigate();

    const sectionClass = `email-folder-list${showFolderList? '' : '-hidden'}`;
    
    const handleSelectFolder = (ev, key) => {
        navigate(`/email/${key}`);
    }

    if (!folderList) return <></>;

    function DynamicFolderIcon(props) {
        switch (props.folder) {
            case 'inbox':
                return <InboxIcon {...props} />
            case 'starred':
                return <StarIcon {...props} />
            case 'sent':
                return <SentIcon {...props} />
            case 'draft':
                return <DraftIcon {...props} />
            case 'trash':
                return <TrashIcon {...props} />
            default:
                return <></>
        }
    }

    return (
        <section className={sectionClass}>
            <ul className="thin1">
                <li className="compose"><EmailComposeButton onShowComposeEmail={onShowComposeEmail} /></li>
                {Object.keys(folderList).map(key => {
                    const folder = folderList[key];
                    const liClass = selectedFolder === key ? 'selected' : '';
                    
                    return (
                        <li key={key} className={liClass} onClick={(ev) => handleSelectFolder(ev, key)}>
                            <DynamicFolderIcon folder={key} sx={ IconSizes.Large } />
                            <div>{folder.label}</div>
                            <div className="new-count">{folder.count > 0 ? folder.count : ''}</div>
                        </li>
                    );
                })}
            </ul>   
        </section>
    );
}

