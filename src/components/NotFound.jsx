// /src/components/NotFound.jsx

import React from 'react';
import { Jumbotron } from 'reactstrap';

class NotFound extends React.Component {
    render () {
        return (
            <Jumbotron>
                <p className="lead">Not Found</p>
            </Jumbotron>
        );
    }
}

export default NotFound;