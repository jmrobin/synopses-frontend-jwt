// /src/services/versionService.js

import Axios from 'axios';

import authService from './authService';

const apiUrl = 'https://synopses.net/api/versions';

export function getVersion (id) {
    return Axios.get(apiUrl + '/' + id);
}

export function deleteVersion (id) {
    return Axios.delete(apiUrl + '/' + id, {
        headers: {'x-access-token': authService.getJwt()}
    });
}

export function saveVersion (version) {
    const body = { ...version };
    delete body.id;
    if (version.id) {
        return Axios.patch(apiUrl + '/' + version.id, body, {
            headers: {'x-access-token': authService.getJwt()}
        });
    }
    else {
        return Axios.post(apiUrl, body, {
            headers: {'x-access-token': authService.getJwt()}
        });
    }
}

export function getPublishedVersions () {
    return Axios.get(apiUrl + 'published');
}

export function getVersionsByAuthorId (id) {
    return Axios.get(apiUrl + 'author/' +id);
}

export default {
    getVersion,
    deleteVersion,
    saveVersion,
    getPublishedVersions,
    getVersionsByAuthorId
}