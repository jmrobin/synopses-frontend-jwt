// /src/components/Profile.jsx

import React from 'react';
import { Table, Button, Badge } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import auth from '../services/authService';
import versionService from '../services/versionService';

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            author: null,
            versions: []
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.deleteVersion = this.deleteVersion.bind(this);
    }

    async componentDidMount() {
        if (auth.getCurrentUser()) {
            const user = auth.getCurrentUser();
            const author = {
                id: user.id,
                username: user.username
            }
            const { data: versions } = await versionService.getVersionsByAuthorId(user.id);
            this.setState({ author, versions });
        }
    }

    handleDelete(version) {
        confirmAlert({
            title: 'Delete a Version',
            message: 'Delete this version?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.deleteVersion(version)
                },
                {
                    label: 'No'
                }
            ]
        });
    }

    async deleteVersion(version) {
        const originalVersions = [...this.state.versions];
        const versions = originalVersions.filter(v => v.id !== version.id);
        this.setState({ versions });
        try {
            await versionService.deleteVersion(version.id);
        }
        catch (ex) {
            this.setState({ versions: originalVersions });
        }

    }

    render () {
        if (!auth.getCurrentUser()) {
            return <Redirect to="/" />
        }
        const { author, versions } = this.state;
        if (!author || !versions) {
            return null;
        }
        const publishedVersions = versions.filter(v => v.isDraft === false);
        const draftRootVersions = versions.filter(v => v.isDraft && v.parentVersionId === 0);
        const draftForkedVersions = versions.filter(v => v.isDraft && v.parentVersionId !== 0);
        return (
            <div>
                <h3>Profile of {author.username}</h3>
                <h4>Published Versions</h4>
                <Table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            publishedVersions.map(version => {
                                return (
                                    <tr key={version.id}>
                                        <td>
                                            {version.title.name}
                                        </td>
                                        <td>
                                            <Badge
                                                color="info"
                                                pill
                                            >
                                                {(version.parentVersionId === 0) &&
                                                    <span>Root</span>
                                                }
                                                {!(version.parentVersionId === 0) &&
                                                    <span>Forked</span>
                                                }
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button
                                                color="info"
                                                size="sm"
                                                tag={Link}
                                                to={'/read-version/' + version.id}
                                            >Read</Button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
                <h4>Draft Root Versions</h4>
                <Table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            draftRootVersions.map(version => {
                                return (
                                    <tr key={version.id}>
                                        <td>{version.title.name}</td>
                                        <td>
                                            <Button
                                                color="primary"
                                                size="sm"
                                                tag={Link}
                                                to={'/edit-root-version/' + version.id}
                                            >Edit</Button>
                                        </td>
                                        <td>
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => this.handleDelete(version)}
                                            >Delete</Button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
                <h4>Draft Forked Versions</h4>
                <Table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            draftForkedVersions.map(version => {
                                return (
                                    <tr key={version.id}>
                                        <td>{version.title.name}</td>
                                        <td>
                                            <Button
                                                color="primary"
                                                size="sm"
                                                tag={Link}
                                                to={'/edit-forked-version/' + version.id}
                                            >Edit</Button>
                                        </td>
                                        <td>
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => this.handleDelete(version)}
                                            >Delete</Button>
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

export default Profile;