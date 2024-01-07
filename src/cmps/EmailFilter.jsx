import React from 'react';
import { useEffect, useState, useRef } from "react";
import { IconSizes, TrashIcon, ReadIcon, UnreadIcon, StarIcon, ArrowDownIcon, ArrowUpIcon } from '../assets/Icons';
import { Tooltip } from 'react-tooltip';

export function EmailFilter({
    sortBy, onSetSort,
    filterBy, onSetFilter, 
    multyCheckedBy, onSetMultyChecked }) {
    
    const [displayReadFilterDropDown, setDisplayReadFilterDropdown] = useState('none');
    const [displayMultyFilterDropdown, setDisplayMultyFilterDropdown] = useState("none");
    
    const refMultySelectActions = useRef();
    const refFilterActions = useRef();

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
        const newSortDirection = sortBy.direction === "asc" ? "desc" : "asc";
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
            <ul>
                <li className={multySelect.liClass} onClick={toggleMultyFilterDropdown}><ArrowDownIcon sx={ IconSizes.Small } />
                    <input checked={multySelect.checked} type="checkbox" onChange={handleMultyCheckboxChange} data-tooltip-id="tooltip-select" data-tooltip-content="Select" /><Tooltip id="tooltip-select" />
                    <ul style={multySelect.displayUL}>
                        <li className={multySelect.all} onClick={handleMultyFilterChange} data-multy-filter-field="all">All</li>
                        <li className={multySelect.none} onClick={handleMultyFilterChange} data-multy-filter-field="none">None</li>
                        <li className={multySelect.read} onClick={handleMultyFilterChange} data-multy-filter-field="read">Read</li>
                        <li className={multySelect.unread} onClick={handleMultyFilterChange} data-multy-filter-field="unread">Unread</li>
                        <li className={multySelect.starred} onClick={handleMultyFilterChange} data-multy-filter-field="starred">Starred</li>
                        <li className={multySelect.unstarred} onClick={handleMultyFilterChange} data-multy-filter-field="unstarred">Unstarred</li>
                    </ul>
                </li>
                {multyCheckedBy.showActions && <li className="multy-select-actions" ref={refMultySelectActions}>
                    <TrashIcon onClick={handleMultyActionPress} data-multy-action-field="delete" sx={ IconSizes.Large } data-tooltip-id="tooltip-delete" data-tooltip-content="Delete" /><Tooltip id="tooltip-delete" />
                    <ReadIcon onClick={handleMultyActionPress} data-multy-action-field="read" sx={ IconSizes.Large } data-tooltip-id="tooltip-read" data-tooltip-content="Mark as read" /><Tooltip id="tooltip-read" />
                    <UnreadIcon onClick={handleMultyActionPress} data-multy-action-field="unread" sx={ IconSizes.Large } data-tooltip-id="tooltip-unread" data-tooltip-content="Mark as unread" /><Tooltip id="tooltip-unread" />
                    <StarIcon onClick={handleMultyActionPress} data-multy-action-field="starred" sx={ IconSizes.Large } className="star" data-tooltip-id="tooltip-starred" data-tooltip-content="Starred" /><Tooltip id="tooltip-starred" />
                    <StarIcon onClick={handleMultyActionPress} data-multy-action-field="unstarred" sx={ IconSizes.Large } data-tooltip-id="tooltip-unstarred" data-tooltip-content="Unstarred" /><Tooltip id="tooltip-unstarred" />
                </li>}
                
                {!multyCheckedBy.showActions && <li className="filter-actions" ref={refFilterActions}>
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
                </li>}
            </ul>    
        </article>
    );
}
