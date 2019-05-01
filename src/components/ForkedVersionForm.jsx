// /src/components/ForkedVersionForm.jsx

import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, FormGroup, FormText, Input, Button, Label } from 'reactstrap';

import auth from '../services/authService';
import versionService from '../services/versionService';

class ForkedVersionForm extends React.Component {
    constructor() {
        super();
        this.state = {
            parentVersion: {},
            author: {},
            description: '',
            contents: '',
            sentences: [],
            entryPoint: {
                parentSentenceId: -1,
                childSentenceId: -1
            },
            isValidForm: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleContentsChange = this.handleContentsChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.checkIfValidForm = this.checkIfValidForm.bind(this);
        this.getEntryPoint = this.getEntryPoint.bind(this);
    }

    async componentDidMount() {
        if (auth.getCurrentUser()) {
            const user = auth.getCurrentUser();
            const author = {
                id: user.id,
                username: user.username
            }
            const { key: id } = this.props.match.params;
            const { data: parentVersion } = await versionService.getVersion(id);
            let contents = '';
            parentVersion.sentences.map((s, i) => {
                if (i !== 0) {
                    contents += ' ';
                }
                contents += s.contents;
                return s;
            })
            this.setState({ author, parentVersion, contents });
        }
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
        this.setState({ isValidForm: this.checkIfValidForm() });
    }

    handleContentsChange(event) {
        this.setState({ contents: event.target.value });

        const arraySplit = event.target.value.split('.');
        const arrayTrim = arraySplit.map(s => s.trim());
        const arrayNotEmpty = arrayTrim.filter(s => s.length > 0);
        const arrayWithPeriod = arrayNotEmpty.map(s => s + '.');
        const arraySentences = arrayWithPeriod.map(s => {
            let json = {
                contents: '',
                authorId: auth.getCurrentUser().id,
                isDraft: true
            }
            json['contents'] = s;
            return json;
        });
        console.log({ arraySentences: arraySentences });
        const entryPoint = this.getEntryPoint(arraySentences);
        const sentences = arraySentences.map((sentence, index) => {
            if (index < entryPoint.childSentenceId) {
                return this.state.parentVersion.sentences[index];
            }
            return sentence;
        });
        console.log({ sentences: sentences });
        this.setState({ sentences });
        this.setState({ isValidForm: this.checkIfValidForm() });
        this.setState({ entryPoint });
    }

    getEntryPoint(sentences) {
        const parentSentences = this.state.parentVersion.sentences;
        let entryPoint = {
            parentSentenceId: -1,
            childSentenceId: -1
        }
        for (let i = 1; i < sentences.length; i++) {
            for (let j = 0; j < parentSentences.length; j++) {
                const isChild = sentences[i - 1].contents === parentSentences[j].contents;
                const isNew = sentences[i].isDraft === true;
                if (isChild && isNew) {
                    if (j > entryPoint.parentSentenceId)
                        entryPoint.parentSentenceId = j;
                    entryPoint.childSentenceId = i;
                }
            }
        }
        return entryPoint;
    }

    checkIfValidForm() {
        const isInvalidForm =
            this.state.description.length === 0 ||
            this.state.sentences.length === 0 ||
            this.state.entryPoint.parentSentenceId === -1;
        console.log({ isInvalidForm: isInvalidForm });
        return !isInvalidForm;
    }

    async handleCreate(event) {
        event.preventDefault();
        console.log({ entryPoint: this.state.entryPoint });
        const version = {
            titleId: this.state.parentVersion.title.id,
            authorId: this.state.author.id,
            parentVersionId: this.state.parentVersion.id,
            isDraft: true,
            sentences: this.state.sentences,
            description: this.state.description
        }
        console.log({ version: version });
        await versionService.saveVersion(version);
        this.props.history.replace('/profile');
    }

    render() {
        if (!auth.getCurrentUser()) {
            return <Redirect to="/" />
        }
        const { parentVersion } = this.state;
        if (!parentVersion.title || !parentVersion.author) {
            return null;
        }
        return (
            <div>
                <h3>Create New Forked Version</h3>
                <h4>{parentVersion.title.name} (by {parentVersion.author.username})</h4>
                <Form>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input
                            type="text"
                            name="description"
                            id="description"
                            placeholder="Short Description"
                            value={this.state.description}
                            onChange={this.handleChange}
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
                        onClick={this.handleCreate}
                        disabled={!this.state.isValidForm}
                    >
                        Create
                    </Button>
                </Form>
            </div>
        );
    }
}

export default ForkedVersionForm;