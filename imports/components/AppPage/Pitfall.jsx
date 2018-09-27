import React, {Component} from 'react';
import {Button, Modal, Table} from 'semantic-ui-react'

export default class Pitfall extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pitfall_res: null
        };
    }


    componentDidMount() {
        let self = this;
        Meteor.call('pitfall_scanner', "http://xmlns.com/foaf/spec/", function (err, res) {
            if (res) {
                Meteor.call('rdf_translator', null, res, function (err, res) {
                    if (res) {
                        let x = JSON.parse(res);
                        self.setState({pitfall_res: x["@graph"]});
                    }
                    else
                        console.log(err);
                })
            }
            else
                console.log(err);
        })
    }

    render() {
        let style = {
            "overflow": "scroll" //should be temp. solution, should investigate
        };
        let content = [];
        if (this.state.pitfall_res !== null && this.state.pitfall_res !== undefined) {
            console.log(this.state.pitfall_res);
            this.state.pitfall_res.map((data, index) => {
                console.log(data["oops:hasName"], data["oops:hasDescription"]);
                content.push(
                    <Table.Row key={index}>
                        <Table.Cell> {data["@type"]} </Table.Cell>
                        <Table.Cell> {data["oops:hasName"]} </Table.Cell>
                        <Table.Cell> {data["oops:hasDescription"]} </Table.Cell>
                    </Table.Row>);
            })
        }
        return (<Modal trigger={<Button>Show Pitfalls</Button>} className="scrolling" style={style}>
            <Modal.Header>Select a Photo</Modal.Header>
            <Modal.Content>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {content}
                    </Table.Body>
                </Table>
            </Modal.Content>
        </Modal>);
    }
}