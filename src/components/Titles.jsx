// /src/components/Titles.jsx

import React from 'react';
import { Redirect } from 'react-router-dom';
import { Table, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import auth from '../services/authService';
import titleService from '../services/titleService';

class Titles extends React.Component {
    constructor() {
        super();
        this.state = {
            titles: []
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.deleteTitle = this.deleteTitle.bind(this);
    }

    async componentDidMount() {
        const { data: titles } = await titleService.getTitles();
        this.setState({ titles });
    }

    handleDelete(title) {
        confirmAlert({
            title: 'Delete a Title',
            message: 'Delete this title?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.deleteTitle(title)
                },
                {
                    label: 'No'
                }
            ]
        });
    }

    async deleteTitle(title) {
        const originalTitles = this.state.titles;
        const titles = originalTitles.filter(t => t.id !== title.id);
        this.setState({ titles });
        try {
            await titleService.deleteTitle(title.id);
        }
        catch (ex) {
            this.setState({ titles: originalTitles });
        }
    }
    render() {
        if (!auth.getCurrentUser() || !auth.getCurrentUser().isAdmin) {
            return <Redirect to="/" />
        }
        return (
            <div>
                <h3>List of Titles</h3>
                <br />
                <Button
                    color="primary"
                    tag={Link} to="/title-form/new"
                >Add</Button>
                <br />
                <br />
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.titles.map(title => {
                                return (
                                    <tr key={title.id}>
                                        <td>{title.id}</td>
                                        <td>{title.name}</td>
                                        <td>
                                            <Button
                                                color="info"
                                                size="sm"
                                                tag={Link} to={'/title-form/' + title.id}
                                            >Edit</Button>
                                        </td>
                                        <td>
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => this.handleDelete(title)}
                                            >
                                                Delete</Button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Titles;