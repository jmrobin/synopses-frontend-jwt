// /src/components/Versions.jsx

import React from 'react';
import { Table, Button, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';

import auth from '../services/authService';
import versionService from '../services/versionService';

class Versions extends React.Component {
    constructor() {
        super();
        this.state = {
            versions: []
        }
        this.getNumberOfChildren = this.getNumberOfChildren.bind(this);
    }

    async componentDidMount() {
        const { data: versions } = await versionService.getPublishedVersions();
        this.setState({ versions });
    }

    getNumberOfChildren(id) {
        const versions = [...this.state.versions];
        let numberOfChildren = 0;
        versions.map(v => {
            if (v.parentVersionId === id) {
                numberOfChildren += 1;
            }
            return v;
        })
        return numberOfChildren;
    }

    render() {
        const { versions } = this.state;
        return (
            <div>
                <h3>List of Versions</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Fork</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            versions.map((version) => {
                                return (
                                    <tr key={version.id}>
                                        <td>{version.id}</td>
                                        <td>{version.title.name}</td>
                                        <td>{version.author.username}</td>
                                        <td>
                                            <Badge pill color="info">
                                                {this.getNumberOfChildren(version.id)}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                color="info"
                                                size="sm"
                                                title={version.description}
                                                tag={Link}
                                                to={'/read-version/' + version.id}
                                            >Read</Button>
                                        </td>
                                        <td>
                                            <Button
                                                color="primary"
                                                size="sm"
                                                title="Create a New Version from this Version"
                                                tag={Link}
                                                to={'forked-version-form/' + version.id}
                                                disabled={!auth.getCurrentUser()}
                                            >Fork</Button>
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

export default Versions;