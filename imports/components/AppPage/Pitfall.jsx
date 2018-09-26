import React, {Component} from 'react';
import { Button, Header, Image, Modal, Table, Label, Menu,Icon } from 'semantic-ui-react'
import CytoscapeCanvas from "./Canvas";
import CytoscapeInfo from "./CanvasInfo";
import response from "../../api/oops-test-response";

export default class Pitfall extends Component{

    constructor(props){
        super(props);
        this.state = {
            pitfall_res: null
        };
    }


    componentDidMount(){
        let self = this;
        Meteor.call('pitfall_scanner',"http://xmlns.com/foaf/spec/",function (err,res) {
            if(res){
                Meteor.call('rdf_translator',null,res,function (err,res) {
                    if(res){
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

/*    handleClick = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state.activeIndex;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex})
    };

            let x;
        Meteor.call('rdf_translator', null, response, function (err, res) {
            if (res)
            else
                console.log(err);
        });


    */

    render(){
        let style= {
            "overflow" : "scroll" //should be temp. solution, should investigate
        };
        return(  <Modal trigger={<Button>Show Pitfalls</Button>} className="scrolling" style = { style }>
            <Modal.Header>Select a Photo</Modal.Header>
            <Modal.Content image>
                { table }
            </Modal.Content>
        </Modal>);
    }
}


let table =   <Table celled>
    <Table.Header>
        <Table.Row>
            <Table.HeaderCell>Header</Table.HeaderCell>
            <Table.HeaderCell>Header</Table.HeaderCell>
            <Table.HeaderCell>Header</Table.HeaderCell>
        </Table.Row>
    </Table.Header>

    <Table.Body>
        <Table.Row>
            <Table.Cell>
                <Label ribbon>First</Label>
            </Table.Cell>
            <Table.Cell>Cell</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
        </Table.Row>
        <Table.Row>
            <Table.Cell>Cell</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
        </Table.Row>
        <Table.Row>
            <Table.Cell>Cell</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
        </Table.Row>
        <Table.Row>
            <Table.Cell>Cell</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
            <Table.Cell>Cell</Table.Cell>
        </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>        <Table.Row>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
        <Table.Cell>Cell</Table.Cell>
    </Table.Row>
    </Table.Body>

    <Table.Footer>
        <Table.Row>
            <Table.HeaderCell colSpan='3'>
                <Menu floated='right' pagination>
                    <Menu.Item as='a' icon>
                        <Icon name='chevron left' />
                    </Menu.Item>
                    <Menu.Item as='a'>1</Menu.Item>
                    <Menu.Item as='a'>2</Menu.Item>
                    <Menu.Item as='a'>3</Menu.Item>
                    <Menu.Item as='a'>4</Menu.Item>
                    <Menu.Item as='a' icon>
                        <Icon name='chevron right' />
                    </Menu.Item>
                </Menu>
            </Table.HeaderCell>
        </Table.Row>
    </Table.Footer>
</Table>;

/*

        let content;
        const activeIndex = this.state.activeIndex;
        console.log(this.state.pitfall_res);
        if (this.state.pitfall_res !== null && this.state.pitfall_res !== undefined) { //pitfall render eden component
            content = this.state.pitfall_res.map((data, index) => {
                if(data["@type"]==="oops:pitfall"&&data["oops:hasAffectedElement"]&&data["oops:hasAffectedElement"].length!==undefined){
                   console.log(data);
                    return (
                        <Accordion styled fluid key={Random.id()} >
                            <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleClick}>
                                <Icon name='dropdown'/>
                                {data["oops:hasName"]}
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === index}>
                                <p>
                                    {data["oops:hasDescription"]} <Button type={"submit"} onClick={(e) => this.setAffectedElement(e, data["oops:hasAffectedElement"])}> Show </Button>
                                </p>
                                <br/>
                                {
                                    data["oops:hasAffectedElement"].map((data,index) => {
                                        return (<div key={index}><br/>{data["@value"]}</div>);
                                })
                                }
                            </Accordion.Content>
                        </Accordion>);
                }
            })
        }

 */