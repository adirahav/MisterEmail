import React from 'react';
import { utilService } from '../services/util.service';
import { emailService } from '../services/email.service';
import { IconSizes, SearchIcon, MenuIcon, ArrowLeftIcon, ArchiveIcon, TrashIcon, ReadIcon, MoreIcon } from '../assets/Icons';

export function EmailSearch({
    filterBy, onSetFilter, 
    multyCheckedBy, onSetMultyChecked,
    onToggleMenu }) {
    
    // search
    const handleSearchChange = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        let { value } = ev.target;    
        onSetFilter({ ...filterBy, txt: value });
    }
    
    // render content
    const { txt } = filterBy;

    const avatar = {
        letter: emailService.loggedinUser.email.charAt(0).toUpperCase(),
        color: utilService.getDummyColor()
    }

    // back
    const handleBackPress = () => {
        navigate(`/email`);
    };

    // archive
    const handleArchive = () => {
        // TODO
    };

    // delete
    const handleDelete = () => {
        onDelete(email, true);
    };
   
    // read
    const handleRead = () => {
        // TODO
    };
   
    // more actions
    const handleMoreActions = () => {
        // TODO
    };

    const handleCheck = () => {

    }

    return (<>
        {!multyCheckedBy.showActions && <article className="email-search">
            <form>
                <SearchIcon className="web" sx={ IconSizes.Medium } />
                <MenuIcon className="mobile" onClick={onToggleMenu} sx={ IconSizes.Medium } />
                <input type="text" placeholder="Search" onChange={handleSearchChange} id="search" value={txt} name="subject" />
                <span className="avatar mobile" style={{ background: avatar.color }}>{avatar.letter}</span>
            </form>   
        </article>}
        {multyCheckedBy.showActions && <section className="email-actions">
            <article>
                <div>
                    <ArrowLeftIcon onClick={handleBackPress} sx={ IconSizes.Small } />
                    <span>{multyCheckedBy.counter}</span>
                </div>
                <div>
                    <input type="checkbox" onClick={handleCheck} />Select all
                </div>
            </article>
            <article>
                <ArchiveIcon onClick={handleArchive} sx={ IconSizes.Small } />
                <TrashIcon onClick={handleDelete} sx={ IconSizes.Small } />
                <ReadIcon onClick={handleRead} sx={ IconSizes.Small } />
                <MoreIcon onClick={handleMoreActions} sx={ IconSizes.Small } />
            </article>
        </section>}
    </>);
}
