// /src/components/EditRootVersion.jsx

import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, FormGroup, FormText, Input, Button, Label } from 'reactstrap';

import auth from '../services/authService';
import versionService from '../services/versionService';

class EditRootVersion extends React.Component {
    constructor() {
        super();
        this.state = {
            id: -1,
            description: '',
            contents: '',
            author: null,
            title: null,
            sentences: [],
            isValidForm: true
        }
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleContentsChange = this.handleContentsChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handlePublish = this.handlePublish.bind(this);
        this.checkIfValidForm = this.checkIfValidForm.bind(this);

    }

    async componentDidMount() {
        const { key } = this.props.match.params;
        const { data: version } = await versionService.getVersion(key);

        const { id, description, author, title } = version;

        const sentences = version.sentences.map(s => {
            delete s.id;
            return s;
        });
        
        this.setState({ id, description, author, title, sentences });

        let contents = '';
        version.sentences.map((s, i) => {
            if (i !== 0) {
                contents += ' ';
            }
            contents += s.contents;
            return s;
        });
        this.setState({ contents });
    }

    handleDescriptionChange(event) {
        this.setState({ description: event.target.value });
        this.setState({ isValidForm: this.checkIfValidForm() });
    }

    handleContentsChange(event) {
        this.setState({ contents: event.target.value });

        const arraySplit = event.target.value.split('.');
        const arrayTrim = arraySplit.map(s => s.trim());
        const arrayNotEmpty = arrayTrim.filter(s => s.length > 0);
        const arrayWithPeriod = arrayNotEmpty.map(s => s + '.');
        const sentences = arrayWithPeriod.map(s => {
            let json = {
                contents: '',
                authorId: auth.getCurrentUser().id,
                isDraft: true                
            }
            json['contents'] = s;
            return json;
        });

        this.setState({ sentences });
        this.setState({ isValidForm: this.checkIfValidForm() });
    }

    checkIfValidForm() {
        const isInvalidForm =
            this.state.description.length === 0 ||
            this.state.sentences.length === 0;
        console.log({ isInvalidForm: isInvalidForm });
        return !isInvalidForm;
    }

    async handleSave(event) {
        event.preventDefault();
        const version = {
            id: this.state.id,
            titleId: this.state.title.id,
            authorId: this.state.author.id,
            parentVersionId: 0,
            isDraft: true,
            sentences: this.state.sentences,
            description: this.state.description
        }
        console.log({ version: version });
        await versionService.deleteVersion(version.id);
        delete version.id;
        await versionService.saveVersion(version);
        this.props.history.replace('/profile');
    }

    async handlePublish(event) {
        event.preventDefault();
        const sentences = this.state.sentences.map(sentence => {
            sentence.isDraft = false;
            return sentence;
        }
        );
        const version = {
            id: this.state.id,
            titleId: this.state.title.id,
            authorId: this.state.author.id,
            parentVersionId: 0,
            isDraft: false,
            sentences: sentences,
            description: this.state.description
        }
        await versionService.deleteVersion(version.id);
        delete version.id;
        await versionService.saveVersion(version);

        this.props.history.replace('/profile');
    }

    render () {
        if (!auth.getCurrentUser()) {
            return <Redirect to="/" />
        }
        if(!this.state.title) {
            return null;
        }
        return (
            <div>
                <h3>Editing a Root Version</h3>
                <h4>{this.state.title.name}</h4>
                <Form>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input
                            type="text"
                            name="description"
                            id="description"
                            value={this.state.description}
                            onChange={this.handleDescriptionChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="contents">Synopsis</Label>
                        <Input
                            type="textarea"
                            name="contents"
                            id="contents"
                            placeholder="Synopsis"
                            value={this.state.contents}
                            onChange={this.handleContentsChange}
                        />
                        <FormText>
                            The Synopsis is a collection of sentences, each ending with a period.
                        </FormText>
                    </FormGroup>
                    <br />
                    <Button
                        color="primary"
                        onClick={this.handleSave}
                        disabled={!this.state.isValidForm}
                    >
                        Save As Draft
                    </Button>
                    {' '}
                    <Button
                        color="warning"
                        onClick={this.handlePublish}
                        disabled={!this.state.isValidForm}
                    >Publish</Button>
                </Form>
            </div>
        );
    }
}

export default EditRootVersion;