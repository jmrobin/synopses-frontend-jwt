// /src/services/titleService.js

import Axios from 'axios';

import authService from './authService';

const apiUrl = 'https://synopses.net/api/titles';

export function getTitles () {
    return Axios.get(apiUrl);
}

export function getTitle (id) {
    return Axios.get(apiUrl + '/' + id);
}

export function deleteTitle (id) {
    return Axios.delete(apiUrl + '/' + id, {
        headers: {'x-access-token': authService.getJwt()}
    });
}

export function saveTitle (title) {
    const body = { ...title };
    delete body.id;
    if(title.id) {
        return Axios.patch(apiUrl + '/' + title.id, body, {
            headers: {'x-access-token': authService.getJwt()}
        });
    }
    else {
        return Axios.post(apiUrl, body, {
            headers: {'x-access-token': authService.getJwt()}
        });
    }
}

export default {
    getTitles,
    getTitle,
    deleteTitle,
    saveTitle
}