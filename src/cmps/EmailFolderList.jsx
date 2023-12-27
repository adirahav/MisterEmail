import { useNavigate } from 'react-router-dom';
import { EmailComposeButton } from "./EmailComposeButton";

export function EmailFolderList({selectedFolder, folderList, onSelectFolder, onShowComposeEmail, showFolderList}) {
    
    const navigate = useNavigate();

    var sectionClass = `email-folder-list${showFolderList? '' : '-hidden'}`;
    
    const handleSelectFolder = (ev, key) => {
        navigate(`/email/${key}`);
    }

    if (!folderList) return <></>;

    return (
        <section className={sectionClass}>
            <ul className="thin1">
                <li className="compose"><EmailComposeButton onShowComposeEmail={onShowComposeEmail} /></li>
                {Object.keys(folderList).map(key => {
                    const folder = folderList[key];
                    const liClass = selectedFolder === key ? 'selected' : '';
                    
                    return (
                        <li key={key} className={liClass} onClick={(ev) => handleSelectFolder(ev, key)}>
                            <i className={`fa-solid ${folder.icon}`}></i>
                            <div>{folder.label}</div>
                            <div className="new-count">{folder.count > 0 ? folder.count : ''}</div>
                        </li>
                    );
                })}
            </ul>   
        </section>
    );
}

