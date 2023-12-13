import React from 'react'
import { useEffect, useState } from "react";

export function EmailFilter({displaySort, filterBy, onSetFilter, sortBy, onSetSort }) {
    const [filter, setFilterBy] = useState(filterBy)
    const [sort, setSortBy] = useState(filterBy)
    const [displayRead, setDisplayRead] = useState('none')

    function handleFilterChange(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        let { readField, name, value } = ev.target.dataset || ev.target;
      
        if (name) {
          if (name === 'subject') {
            name = "txt";
          }
        } 
        else {
            name = "read";
      
            value = readField !== 'null' 
                    ? readField === 'true' 
                    : null;

            setDisplayRead("none");
        }

        setFilterBy((prevFilter) => ({ ...prevFilter, [name]: value }));
      }
      

    function handleSortBy(ev) {
        let { sortField: field } = ev.target.dataset;
        const newSortDirection = sortBy.sortDirection === "asc" ? "desc" : "asc";
        setSortBy(prevSort => ({ ...prevSort, by: field, direction: newSortDirection }));
    }

    function toggleRead() {
        setDisplayRead(displayRead === "none" ? "block" : "none")
    }

    useEffect(() => {
        onSetFilter(filter)
    }, [filter])

    useEffect(() => {
        onSetSort(sort)
    }, [sort])

    useEffect(() => {
        setDisplayRead(displayRead)
    }, [displayRead])

    const { txt } = filter

    const dateSortLI = sortBy.sortField === "sentAt" ? "selected" : "";
    const dateSortIcon = "fa-solid fa-chevron-" + (sortBy.sortField === "sentAt" && sortBy.sortDirection === "asc" ? "up" : "down") + " fa-xs";
    
    const subjectSortLI = sortBy.sortField === "subject" ? "selected" : "";
    const subjectSortIcon = "fa-solid fa-chevron-" + (sortBy.sortField === "subject" && sortBy.sortDirection === "asc" ? "up" : "down") + " fa-xs";
    
    const readLI = "read" + (filterBy.read !== null ? " selected" : ""); 
    const readFilterIcon = "fa-solid fa-chevron-down fa-xs"; 
    const readFilterText = filterBy.read === null 
                                ? "All" 
                                : filterBy.read === true 
                                    ? "Read"
                                    : "Unread"; 
    const readFilterDisplayUL = { display: displayRead }; 
    const readFilterAll = filterBy.read === null ? "selected" : ""; 
    const readFilterRead = filterBy.read === true ? "selected" : ""; 
    const readFilterUnread = filterBy.read === false ? "selected" : ""; 

    return (
        <article className="email-filter">
            <form>
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Search" onChange={handleFilterChange} id="subject" value={txt} name="subject" />
            </form>
            {displaySort && <ul>
                <li className={dateSortLI} onClick={handleSortBy} data-sort-field="sentAt"><i className={dateSortIcon}></i>Date</li>
                <li className={subjectSortLI} onClick={handleSortBy} data-sort-field="subject"><i className={subjectSortIcon}></i>Subject</li>
                <li className={readLI}><i className={readFilterIcon} onClick={toggleRead} ></i>{readFilterText}
                    <ul style={readFilterDisplayUL}>
                        <li className={readFilterAll} onClick={handleFilterChange} data-read-field="null">All</li>
                        <li className={readFilterRead} onClick={handleFilterChange} data-read-field="true">Read</li>
                        <li className={readFilterUnread} onClick={handleFilterChange} data-read-field="false">Unread</li>
                    </ul>
                </li>
            </ul>}    
        </article>
    )
}
