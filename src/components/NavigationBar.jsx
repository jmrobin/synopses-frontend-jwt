// /src/components/NavigationBar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import {
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Collapse,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

import auth from '../services/authService';

class NavigationBar extends React.Component {
    constructor() {
        super();
        this.state = {
            isOpen: false
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        const user = auth.getCurrentUser();
        const authorStyle = { color: 'White' };
        const authorName = user ? user.username : 'Guest';
        return (
            <Navbar color="dark" dark expand="md">
                <NavbarBrand href="/">Synopses</NavbarBrand>
                <div style={authorStyle}>{authorName}</div>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink tag={Link} to="/versions">Versions</NavLink>
                        </NavItem>
                        {user &&
                            <NavItem>
                                <NavLink tag={Link} to="/profile">Profile</NavLink>
                            </NavItem>
                        }
                        {user &&
                            <NavItem>
                                <NavLink tag={Link} to="/root-version-form">New Root</NavLink>
                            </NavItem>
                        }
                        {user && user.isAdmin &&
                            <NavItem>
                                <NavLink tag={Link} to="/titles">Titles</NavLink>
                            </NavItem>
                        }
                        {user && user.isAdmin &&
                            <NavItem>
                                <NavLink tag={Link} to="/authors">Authors</NavLink>
                            </NavItem>
                        }
                        {!user &&
                            <NavItem>
                                <NavLink tag={Link} to="/login" >Login</NavLink>
                            </NavItem>
                        }
                        {user &&
                            <NavItem>
                                <NavLink tag={Link} to="/logout" >Logout</NavLink>
                            </NavItem>
                        }
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}

export default NavigationBar;