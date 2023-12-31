import React from 'react';
import { useEffect, useState, useRef } from "react";
import { utilService } from '../services/util.service';
import { emailService } from '../services/email.service';
import { useEffectOnChange } from '../customHooks/useEffectOnChange';
import { useForm } from '../customHooks/useForm'
import { IconSizes, SearchIcon, MenuIcon, TrashIcon, ReadIcon, UnreadIcon, StarIcon, ArrowDownIcon, ArrowUpIcon } from '../assets/Icons';

export function EmailFilter({
    showSearchOnly,
    sortBy, onSetSort,
    filterBy, onSetFilter, 
    multyCheckedBy, onSetMultyChecked, 
    onMobileToggleFolderList }) {
    
    const [displayReadFilterDropDown, setDisplayReadFilterDropdown] = useState('none');
    const [displayMultyFilterDropdown, setDisplayMultyFilterDropdown] = useState("none");
    const [displayMultySelectActions, setDisplayMultySelectActions] = useState(multyCheckedBy.showActions ? 'flex' : 'none');
    const [displayFilterActions, setDisplayFilterActions] = useState(!multyCheckedBy.showActions ? 'flex' : 'none');
    
    const refMultySelectActions = useRef();
    const refFilterActions = useRef();

    // filter - search
    const handleSearchChange = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        let { value } = ev.target;    
        onSetFilter({ ...filterBy, txt: value });
    }

    // filter - read
    const handleFilterChange = (ev) => {
        
        ev.preventDefault();
        ev.stopPropagation();

        let { readField } = ev.target.dataset;
        
        const value = readField !== 'null' 
                        ? readField === 'true' 
                        : null;

        setDisplayReadFilterDropdown("none");
        onSetFilter({ ...filterBy, read: value });
    }

    function toggleRead() {
        setDisplayReadFilterDropdown(displayReadFilterDropDown === "none" ? "block" : "none");
    }

    useEffect(() => {
        setDisplayReadFilterDropdown(displayReadFilterDropDown);
    }, [displayReadFilterDropDown]);

    
    // sort
    const handleSortBy = (ev) => {
        let { sortField: field } = ev.currentTarget.dataset;
        const newSortDirection = sortBy.sortDirection === "asc" ? "desc" : "asc";
        onSetSort({ ...sortBy, by: field, direction: newSortDirection });
    }

    // multy
    const handleMultyFilterChange = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        let { multyFilterField } = ev.target.dataset;
        
        setDisplayMultyFilterDropdown("none");
        onSetMultyChecked({ ...multyCheckedBy, filter: multyFilterField }); 
    }

    const handleMultyActionPress = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        let { multyActionField } = ev.target.dataset;
        
        setDisplayMultyFilterDropdown("none");
        onSetMultyChecked({ ...multyCheckedBy, action: multyActionField }); 
    }

    function toggleMultyFilterDropdown() {
        setDisplayMultyFilterDropdown(displayMultyFilterDropdown === "none" ? "block" : "none");
    }

    const handleMultyCheckboxChange = (ev) => {
        const filter = ev.target.checked
                        ? 'all' 
                        : 'none';

        setDisplayMultyFilterDropdown("none");
        onSetMultyChecked({ ...multyCheckedBy, filter: filter }); 
    }

    useEffect(() => {
        setDisplayMultyFilterDropdown(displayMultyFilterDropdown);
    }, [displayMultyFilterDropdown]);

    
    // render content
    const { txt } = filterBy;

    const dateSort = {
        liSelected: sortBy.sortField === "sentAt" ? "selected" : "",
        direction: sortBy.sortField === "sentAt" && sortBy.sortDirection === "asc" ? "up" : "down"
    }
    
    const subjectSort = {
        liSelected: sortBy.sortField === "subject" ? "selected" : "",
        direction: sortBy.sortField === "subject" && sortBy.sortDirection === "asc" ? "up" : "down"    
    }
    
    const readFilter =  {
        liClass: "drop-down" + (filterBy.read !== null ? " selected" : ""),
        text: filterBy.read === null 
                ? "All" 
                : filterBy.read === true 
                    ? "Read"
                    : "Unread",
        displayUL: { display: displayReadFilterDropDown },
        all: filterBy.read === null ? "selected" : "",
        read: filterBy.read === true ? "selected" : "",
        unread: filterBy.read === false ? "selected" : "", 
    }
    
    const multySelect = {
        liClass: "drop-down " + multyCheckedBy.checked,
        checked: multyCheckedBy.checked == "checked" ? multyCheckedBy.checked : "",
        displayUL: { display: displayMultyFilterDropdown },
        all: multyCheckedBy.filter === "all" ? "selected" : "", 
        none: multyCheckedBy.filter === "none" ? "selected" : "", 
        read: multyCheckedBy.filter === "read" ? "selected" : "", 
        unread: multyCheckedBy.filter === "unread" ? "selected" : "", 
        starred: multyCheckedBy.filter === "starred" ? "selected" : "", 
        unstarred: multyCheckedBy.filter === "unstarred" ? "selected" : "", 
    } 

    const avatar = {
        letter: emailService.loggedinUser.email.charAt(0).toUpperCase(),
        color: utilService.getDummyColor()
    }
    
    // multy-actions/filter-actions animation
    useEffectOnChange(async () => {
        if (multyCheckedBy.showActions) {
            setDisplayMultySelectActions('flex');
            await utilService.animateCSS(refMultySelectActions.current, 'fadeInLeft');
            utilService.animateCSS(refFilterActions.current, 'backOutRight');
            setTimeout(() => {
                setDisplayFilterActions('none');
            }, 500);  
        }
        else {
            utilService.animateCSS(refMultySelectActions.current, 'fadeOutLeft');
            setTimeout(() => {
                setDisplayMultySelectActions('none');
                setDisplayFilterActions('flex');
                utilService.animateCSS(refFilterActions.current, 'fadeIn');
            }, 500);
        }
    }, [multyCheckedBy.showActions]); 

    function DynamicArrowIcon(props) {
        switch (props.direction) {
            case 'up':
                return <ArrowUpIcon {...props} />
            case 'down':
                return <ArrowDownIcon {...props} />
            default:
                return <></>
        }
    }

    return (
        <article className="email-filter">
            <form>
                <SearchIcon className="web" fontSize="medium" />
                <MenuIcon className="mobile" onClick={onMobileToggleFolderList} fontSize="medium" />
                <input type="text" placeholder="Search" onChange={handleSearchChange} id="search" value={txt} name="subject" />
                <span className="avatar mobile" style={{ background: avatar.color }}>{avatar.letter}</span>
            </form>
            {!showSearchOnly && <ul>
                <li className={multySelect.liClass} onClick={toggleMultyFilterDropdown}><ArrowDownIcon fontSize="small" /><input checked={multySelect.checked} type="checkbox" onChange={handleMultyCheckboxChange} />
                    <ul style={multySelect.displayUL}>
                        <li className={multySelect.all} onClick={handleMultyFilterChange} data-multy-filter-field="all">All</li>
                        <li className={multySelect.none} onClick={handleMultyFilterChange} data-multy-filter-field="none">None</li>
                        <li className={multySelect.read} onClick={handleMultyFilterChange} data-multy-filter-field="read">Read</li>
                        <li className={multySelect.unread} onClick={handleMultyFilterChange} data-multy-filter-field="unread">Unread</li>
                        <li className={multySelect.starred} onClick={handleMultyFilterChange} data-multy-filter-field="starred">Starred</li>
                        <li className={multySelect.unstarred} onClick={handleMultyFilterChange} data-multy-filter-field="unstarred">Unstarred</li>
                    </ul>
                </li>
                <li style={{display: displayMultySelectActions}} className="multy-select-actions" ref={refMultySelectActions}>
                    <TrashIcon onClick={handleMultyActionPress} data-multy-action-field="delete" sx={ IconSizes.Large } />
                    <ReadIcon onClick={handleMultyActionPress} data-multy-action-field="read" sx={ IconSizes.Large } />
                    <UnreadIcon onClick={handleMultyActionPress} data-multy-action-field="unread" sx={ IconSizes.Large } />
                    <StarIcon onClick={handleMultyActionPress} data-multy-action-field="starred" sx={ IconSizes.Large } className="star" />
                    <StarIcon onClick={handleMultyActionPress} data-multy-action-field="unstarred" sx={ IconSizes.Large } />
                </li>
                
                <li style={{display: displayFilterActions}} className="filter-actions" ref={refFilterActions}>
                    <ul>
                        <li className={dateSort.liSelected} onClick={handleSortBy} data-sort-field="sentAt"><DynamicArrowIcon direction={dateSort.direction} fontSize="small" /><span>Date</span></li>
                        <li className={subjectSort.liSelected} onClick={handleSortBy} data-sort-field="subject"><DynamicArrowIcon direction={subjectSort.direction} fontSize="small" /><span>Subject</span></li>
                        <li className={readFilter.liClass} onClick={toggleRead}><ArrowDownIcon fontSize="small" /><span>{readFilter.text}</span>
                            <ul style={readFilter.displayUL}>
                                <li className={readFilter.all} onClick={handleFilterChange} data-read-field="null">All</li>
                                <li className={readFilter.read} onClick={handleFilterChange} data-read-field="true">Read</li>
                                <li className={readFilter.unread} onClick={handleFilterChange} data-read-field="false">Unread</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>}    
        </article>
    );
}
