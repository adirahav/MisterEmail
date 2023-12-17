

export const utilService = {
    makeId,
    saveToStorage,
    loadFromStorage,
    formatListDate,
    formatDetailsDate,
    areObjectsEqual,
    hasValidEmail,
    isMobile,
    getDummyColor
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeId(length = 5) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function saveToStorage(key, value) {
    localStorage[key] = JSON.stringify(value);
}

function loadFromStorage(key, defaultValue = null) {
    var value = localStorage[key] || defaultValue;
    return JSON.parse(value);
}

function formatListDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.getDate() === now.getDate() &&date.getMonth() === now.getMonth() &&date.getFullYear() === now.getFullYear()) {
      return date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
    }
  
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  
    return date.toLocaleString('en-US', {
      year: 'numeric',
    });
}

function formatDetailsDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();

    const options = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    const timeDifference = now - date;
    const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));

    const timeAgo = hoursAgo > 0 ? `(${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago)` : '';

    return `${formattedDate} ${timeAgo}`;
}

function areObjectsEqual(obj1, obj2) {
    if (obj1 === null && obj2 === null || obj1 === undefined && obj2 === undefined) {
        return true;
    }

    if (obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined) {
        return false;
    }
  
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    return keys1.every(key => obj1[key] === obj2[key]);
}

function hasValidEmail(emailsList) {
    if (!emailsList) {
        return false;
    }

    const emails = emailsList.split(';').map(email => email.trim());
    const isValidEmail = emails.some(email => EMAIL_REGEX.test(email));
    return isValidEmail;
}

function isMobile() {
    return window.innerWidth <= 991;
}

function getDummyColor() {
    const randomComponent = () => Math.floor(Math.random() * 128);
    const red = randomComponent();
    const green = randomComponent();
    const blue = randomComponent();
    return `rgb(${red},${green},${blue})`;
};