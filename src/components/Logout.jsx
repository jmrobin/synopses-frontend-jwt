// /src/components/Logout.jsx

import React from 'react';

import auth from '../services/authService';

class Logout extends React.Component {

    componentDidMount () {
        auth.logout();
        // this.props.history.replace('/');
        window.location = "/";
    }

    render () {
        return null;
    }
}

export default Logout;