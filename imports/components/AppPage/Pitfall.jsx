import React, {Component} from 'react';
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import CytoscapeCanvas from "./Canvas";
import CytoscapeInfo from "./CanvasInfo";
import response from "../../api/oops-test-response";

export default class Pitfall extends Component{

    constructor(props){
        super(props);
    }


/*    handleClick = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state.activeIndex;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex})
    };

            let x;
        Meteor.call('rdf_translator', null, response, function (err, res) {
            if (res) {
                x = JSON.parse(res);
                self.setState({pitfall_res: x["@graph"]});
                console.log(x["@graph"]);
            }
            else
                console.log(err);
        });


    */


    render(){
        return(  <Modal trigger={<Button>Show Modal</Button>}>
            <Modal.Header>Select a Photo</Modal.Header>
            <Modal.Content image>
                <Image wrapped size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
                <Modal.Description>
                    <Header>Default Profile Image</Header>
                    <p>We've found the following gravatar image associated with your e-mail address.</p>
                    <p>Is it okay to use this photo?</p>
                </Modal.Description>
            </Modal.Content>
        </Modal>);
    }


}

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