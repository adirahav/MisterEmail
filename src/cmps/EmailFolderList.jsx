import { EmailComposeButton } from "./EmailComposeButton";

export function EmailFolderList({selecedFolder, folderList, onSelectFolder, onShowComposeEmail, showFolderList}) {
    
    var sectionClass = `email-folder-list${showFolderList? '' : '-hidden'}`;
    
    return (
        <section className={sectionClass}>
            <ul className="thin1">
                <li className="compose"><EmailComposeButton onShowComposeEmail={onShowComposeEmail} /></li>
                <hr />
                {Object.keys(folderList).map(key => {
                    const folder = folderList[key];
                    const liClass = selecedFolder === key ? 'selected' : '';
                    
                    return (
                        <li key={key} className={liClass} onClick={() => onSelectFolder({ status: key })}>
                            <i className={`fa-solid ${folder.icon}`}></i>
                            <div>{folder.label}</div>
                            <div className="new-count">{folder.count > 0 ? folder.count : ''}</div>
                        </li>
                    );
                })}
            </ul>   
        </section>
    )
}

