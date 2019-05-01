// /src/services/authService.js

import Axios from 'axios';
import jwtDecode from 'jwt-decode';

const apiUrl = 'https://synopses.net/api/signin';

export async function login(username, password) {
    const { data: token } = await Axios.post(apiUrl, { username, password });
    const jwt = Object.values(token)[0];
    jwtDecode(jwt);
    sessionStorage.setItem('jwt', jwt);
}

export function logout () {
    sessionStorage.removeItem('jwt');
}

export function getJwt () {
    return sessionStorage.getItem('jwt');
}

export function getCurrentUser () {
    try{
        const jwt = sessionStorage.getItem('jwt');        
        const data = jwtDecode(jwt);        
        const user = {
            id: data.id,
            username: data.username,
            isAdmin: data.isAdmin
        }
        return user;

    }
    catch(ex) {
        return null;
    }    
}

export default {
    login,
    logout,
    getCurrentUser,
    getJwt
}