// /src/components/TitleForm.jsx

import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, FormGroup, Button, Label, Input } from 'reactstrap';

import auth from '../services/authService';
import titleService from '../services/titleService';

class TitleForm extends React.Component {
    constructor() {
        super();
        this.state = {
            title: {
                id: '',
                name: ''
            },
            isValidForm: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    async componentDidMount() {
        const { key } = this.props.match.params;
        if (key === 'new') {
            this.setState({ title: { id: 'new', name: '' } });
            return;
        }
        const { data: title } = await titleService.getTitle(key);
        this.setState({ title });
    }

    handleChange(event) {
        const value = event.currentTarget.value;

        const title = { ...this.state.title };
        title['name'] = value;

        const isValidForm = value.length > 0;

        this.setState({ title, isValidForm });
    }

    async handleCreate(event) {
        event.preventDefault();
        const title = { ...this.state.title };
        delete title.id;
        try {
            await titleService.saveTitle(title);
            this.props.history.replace('/titles');
        }
        catch (ex) { }
    }

    async handleUpdate(event) {
        event.preventDefault();
        const title = { ...this.state.title };
        try {
            await titleService.saveTitle(title);
            this.props.history.replace('/titles');
        }
        catch (ex) { }
    }
    render() {
        if (!auth.getCurrentUser() || !auth.getCurrentUser().isAdmin) {
            return <Redirect to="/" />
        }
        const { title, isValidForm } = this.state;
        return (
            <div>
                <h3>Create or Update a Title</h3>
                <Form>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Title of the Movie"
                            value={title.name}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <Button
                        color="primary"
                        disabled={title.id !== 'new' || !isValidForm}
                        onClick={this.handleCreate}
                    >Create</Button>
                    {' '}
                    <Button
                        color="primary"
                        disabled={title.id === 'new' || !isValidForm}
                        onClick={this.handleUpdate}
                    >
                        Update</Button>
                </Form>
            </div>
        );
    }
}

export default TitleForm;