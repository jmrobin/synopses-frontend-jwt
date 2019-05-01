// /src/components/LoginForm.jsx

import React from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Form, FormGroup, FormFeedback, Button, Label, Input } from 'reactstrap';

import auth from '../services/authService';

class LoginForm extends React.Component {
    constructor() {
        super();
        this.state = {
            account: {
                username: '',
                password: ''
            },
            errors: {
                username: '',
                password: ''
            },
            isValidForm: false
        }
        this.validateProperty = this.validateProperty.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateProperty(name, value) {
        if (name === 'username') {
            if (value.trim().length < 3) {
                return 'Username is required and should have 3 characters at least';
            }
            return 'ok';
        }
        if (name === 'password') {
            if (value.trim().length < 3) {
                return 'Password is required ans should have 4 characters at least';
            }
            return 'ok';
        }
    }

    handleChange({ currentTarget }) {
        const name = currentTarget.name;
        const value = currentTarget.value;

        const errors = { ...this.state.errors };
        errors[name] = this.validateProperty(name, value);

        const account = { ...this.state.account };
        account[name] = value;

        const isValidForm = errors.username === 'ok' && errors.password === 'ok';

        this.setState({ account, errors, isValidForm });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { account } = this.state;
        try {
            await auth.login(account.username, account.password);
            // this.props.history.replace('/');
            window.location = "/";
        }
        catch (ex) {
            console.log(ex);
        }
    }
    render() {
        if (auth.getCurrentUser()) {
            return <Redirect to="/" />;
        }
        const { account, errors } = this.state;
        return (
            <Container>
                <h1>Login</h1>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input
                            autoFocus
                            type="text"
                            name="username"
                            id="username"
                            value={account.username}
                            onChange={this.handleChange}
                            valid={errors.username === 'ok'}
                            invalid={errors.username.length > 0 && errors.username !== 'ok'}
                        />
                        <FormFeedback>
                            {errors.username}</FormFeedback>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            value={account.password}
                            onChange={this.handleChange}
                            valid={errors.password === 'ok'}
                            invalid={errors.password.length > 0 && errors.password !== 'ok'}
                        />
                        <FormFeedback
                        >{errors.password}</FormFeedback>
                    </FormGroup>
                    <Button
                        color="primary"
                        type="submit"
                        disabled={!this.state.isValidForm}
                    >Submit</Button>
                </Form>
            </Container>
        );
    }
}

export default LoginForm;