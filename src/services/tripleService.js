// /src/services/tripleService.js

import Axios from 'axios';

import authService from './authService';

const apiUrl = 'https://synopses.net/api/triples';

export function saveTriple(triple) {
    return Axios.post(apiUrl, triple, {
        headers: {'x-access-token': authService.getJwt()}
    });
}

export default {
    saveTriple
}