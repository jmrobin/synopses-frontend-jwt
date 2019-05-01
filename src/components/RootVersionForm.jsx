// /src/components/RootVersionForm.jsx

import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, FormGroup, FormText, Label, Input, Button } from 'reactstrap';

import auth from '../services/authService';
import titleService from '../services/titleService';
import versionService from '../services/versionService';

class RootVersionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titles: [],
            titleId: '0',
            author: null,
            description: '',
            contents: '',
            sentences: [],
            isValidForm: false
        }
        this.onChange = this.onChange.bind(this);
        this.onContentsChange = this.onContentsChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.checkIfValidForm = this.checkIfValidForm.bind(this);
    }

    async componentDidMount() {
        if (auth.getCurrentUser()) {
            const { data: titles } = await titleService.getTitles();
            const author = {
                id: auth.getCurrentUser().id,
                username: auth.getCurrentUser().username
            }
            this.setState({ titles, author });
        }

    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
        this.setState({ isValidForm: this.checkIfValidForm() });
    }

    onContentsChange(event) {
        this.setState({ contents: event.target.value });

        const arraySplit = event.target.value.split('.');
        const arrayTrim = arraySplit.map(s => s.trim());
        const arrayNotEmpty = arrayTrim.filter(s => s.length > 0);
        const arrayWithPeriod = arrayNotEmpty.map(s => s + '.');
        const sentences = arrayWithPeriod.map(s => {
            let json = {
                contents: '',
                authorId: this.state.author.id,
                isDraft: true                
            }
            json['contents'] = s;
            return json;
        });
        console.log({ sentences: sentences });
        this.setState({ sentences });
        this.setState({ isValidForm: this.checkIfValidForm() });
    }

    checkIfValidForm() {
        const isInvalidForm =
            this.state.titleId === '0' ||
            this.state.description.length === 0 ||
            this.state.sentences.length === 0;
        console.log({ isInvalidForm: isInvalidForm });
        return !isInvalidForm;
    }


    async onSubmit(event) {
        event.preventDefault();
        const titleId = Number.parseInt(this.state.titleId);        
        const authorId = this.state.author.id;

        const newVersion = {
            description: this.state.description,
            titleId: titleId,
            authorId: authorId,
            parentVersionId: 0,
            isDraft: true,
            sentences: this.state.sentences
        }
        console.log({ newVersion: newVersion });
        await versionService.saveVersion(newVersion);
        this.props.history.replace('/profile');
    }

    render() {
        if (!auth.getCurrentUser()) {
            return <Redirect to="/" />
        }
        if (!this.state.author || !this.state.titles) {
            return null;
        }
        const titles = [{ 'id': 0, 'name': 'Select a Title' }, ...this.state.titles];
        const titleOptions = titles.map((title, index) => {
            return (
                <option key={index} value={title.id}>{title.name}</option>
            );
        });
        return (
            <div>
                <h4>Create a Root Version</h4>
                <h4>By {this.state.author.username}</h4>
                <Form>
                    <FormGroup>
                        <Label for="titleId">Title</Label>
                        <Input
                            type="select"
                            name="titleId"
                            id="titleId"
                            onChange={this.onChange}
                        >
                            {titleOptions}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input
                            type="text"
                            name="description"
                            id="description"
                            placeholder="Short Description"
                            value={this.state.description}
                            onChange={this.onChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="contents">Contents</Label>
                        <Input
                            type="textarea"
                            name="contents"
                            id="contents"
                            placeholder="Synopsis"
                            value={this.state.contents}
                            onChange={this.onContentsChange}
                        />
                        <FormText>
                            The Synopsis is a collection of sentences, each ending with a period.
                        </FormText>
                    </FormGroup>
                    <br />
                    <Button
                        color="primary"
                        onClick={this.onSubmit}
                        disabled={!this.state.isValidForm}
                    >
                        Create
                    </Button>
                </Form>
            </div>
        );
    }
}

export default RootVersionForm;