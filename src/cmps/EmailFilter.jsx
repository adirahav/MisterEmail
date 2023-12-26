import React from 'react'
import { useEffect, useState } from "react";
import { utilService } from '../services/util.service';
import { emailService } from '../services/email.service';

export function EmailFilter({
    showSearchOnly,
    sortBy, onSetSort,
    filterBy, onSetFilter, 
    multyCheckedBy, onSetMultyChecked, 
    onMobileToggleFolderList }) {
    const [displayReadFilterDropDown, setDisplayReadFilterDropdown] = useState('none')
    const [displayMultyFilterDropdown, setDisplayMultyFilterDropdown] = useState("none")

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
        setDisplayReadFilterDropdown(displayReadFilterDropDown === "none" ? "block" : "none")
    }

    useEffect(() => {
        setDisplayReadFilterDropdown(displayReadFilterDropDown)
    }, [displayReadFilterDropDown])

    
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

    const handleMultyActionChange = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        let { multyActionField } = ev.target.dataset;
        
        setDisplayMultyFilterDropdown("none");
        onSetMultyChecked({ ...multyCheckedBy, action: multyActionField }); 
    }

    function toggleMultyFilterDropdown() {
        setDisplayMultyFilterDropdown(displayMultyFilterDropdown === "none" ? "block" : "none")
    }

    const handleMultyCheckboxChange = (ev) => {
        const filter = ev.target.checked
                        ? 'all' 
                        : 'none';

        setDisplayMultyFilterDropdown("none");
        onSetMultyChecked({ ...multyCheckedBy, filter: filter }); 
    }

    useEffect(() => {
        setDisplayMultyFilterDropdown(displayMultyFilterDropdown)
    }, [displayMultyFilterDropdown])

    
    // render content
    const { txt } = filterBy

    const dateSort = {
        liSelected: sortBy.sortField === "sentAt" ? "selected" : "",
        icon: "fa-solid fa-chevron-" + (sortBy.sortField === "sentAt" && sortBy.sortDirection === "asc" ? "up" : "down") + " fa-xs"
    }
    
    const subjectSort = {
        liSelected: sortBy.sortField === "subject" ? "selected" : "",
        icon: "fa-solid fa-chevron-" + (sortBy.sortField === "subject" && sortBy.sortDirection === "asc" ? "up" : "down") + " fa-xs"    
    }
    
    const readFilter =  {
        liClass: "drop-down" + (filterBy.read !== null ? " selected" : ""),
        icon: "fa-solid fa-chevron-down fa-xs",
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
        icon: "fa-solid fa-chevron-down fa-xs",
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
    

    return (
        <article className="email-filter">
            <form>
                <i className="fa-solid fa-magnifying-glass web"></i>
                <i className="fa-solid fa-bars mobile" onClick={onMobileToggleFolderList}></i>
                <input type="text" placeholder="Search" onChange={handleSearchChange} id="search" value={txt} name="subject" />
                <span className="avatar mobile" style={{ background: avatar.color }}>{avatar.letter}</span>
            </form>
            {!showSearchOnly && <ul>
                <li className={multySelect.liClass}><i className={multySelect.icon} onClick={toggleMultyFilterDropdown} ></i><input checked={multySelect.checked} type="checkbox" onChange={handleMultyCheckboxChange} />
                    <ul style={multySelect.displayUL}>
                        <li className={multySelect.all} onClick={handleMultyFilterChange} data-multy-filter-field="all">All</li>
                        <li className={multySelect.none} onClick={handleMultyFilterChange} data-multy-filter-field="none">None</li>
                        <li className={multySelect.read} onClick={handleMultyFilterChange} data-multy-filter-field="read">Read</li>
                        <li className={multySelect.unread} onClick={handleMultyFilterChange} data-multy-filter-field="unread">Unread</li>
                        <li className={multySelect.starred} onClick={handleMultyFilterChange} data-multy-filter-field="starred">Starred</li>
                        <li className={multySelect.unstarred} onClick={handleMultyFilterChange} data-multy-filter-field="unstarred">Unstarred</li>
                    </ul>
                </li>
                {multyCheckedBy.showActions && <li className="multy-select-actions">
                    <i className="fa-regular fa-trash-can" onClick={handleMultyActionChange} data-multy-action-field="delete"></i>
                    <i className="fa-regular fa-envelope-open" onClick={handleMultyActionChange} data-multy-action-field="read"></i>
                    <i className="fa-solid fa-envelope-circle-check" onClick={handleMultyActionChange} data-multy-action-field="unread"></i>
                    <i className="fa-regular fa-star star" onClick={handleMultyActionChange} data-multy-action-field="starred"></i>
                    <i className="fa-regular fa-star" onClick={handleMultyActionChange} data-multy-action-field="unstarred"></i>
                </li>}
                
                {!showSearchOnly && <li className={dateSort.liSelected} onClick={handleSortBy} data-sort-field="sentAt"><i className={dateSort.icon}></i>Date</li>}
                {!showSearchOnly && <li className={subjectSort.liSelected} onClick={handleSortBy} data-sort-field="subject"><i className={subjectSort.icon}></i>Subject</li>}
                {!showSearchOnly && <li className={readFilter.liClass}><i className={readFilter.icon} onClick={toggleRead} ></i>{readFilter.text}
                    <ul style={readFilter.displayUL}>
                        <li className={readFilter.all} onClick={handleFilterChange} data-read-field="null">All</li>
                        <li className={readFilter.read} onClick={handleFilterChange} data-read-field="true">Read</li>
                        <li className={readFilter.unread} onClick={handleFilterChange} data-read-field="false">Unread</li>
                    </ul>
                </li>}
            </ul>}    
        </article>
    )
}
