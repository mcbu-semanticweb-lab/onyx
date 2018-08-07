import React, {Component} from "react";
import {Grid, Form from 'semantic-ui-react';
import {connect} from "react-redux";
import {push} from "redux-little-router";

class UriUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.SetURI = this.SetURI.bind(this);
        this.Send = this.Send.bind(this);
    }

    SetURI(event) {
        this.setState({url: event.target.value})
        console.log(this.state.url);
    }


    Send() {
        let url = this.state.url;
        self = this;
        Meteor.call('parse_and_send_to_cayley', url, function (err, res) {
            if (res) {
                console.log(res);
                self.props.redirect('/AppPage');
            }
        });

        /*Meteor.call('class_instance'); //callback yavaş kalabiliyor

        Meteor.call('class_number', function (err, res) {
            if (res)
                console.log('Class Number is  ' + res);
            else
                console.log(err);
        });
        Meteor.call('class_utilization', function (err, res) {
            if (res)
                console.log('Class Utilization  ' + res);
            else
                console.log(err);
        });
        Meteor.call('instance_number', function (err, res) {
            if (res)
                console.log('Total number of instances   ' + res);
            else
                console.log(err);
        });
        Meteor.call('property_number', function (err, res) {
            if (res)
                console.log('Total number of properties   ' + res);
            else
                console.log(err);
        });
*/
        // Meteor.call('pitfall_scanner',url,function (err,res) {
        //     if(res){

        //     }
        // });


        //


    }

    render() {
        return (
            <Grid.Row>
                <Grid.Column width={6}>
                    <Form onSubmit={this.Send}>
                        <Form.Field>
                            <Form.Input type="text" placeholder='Ontology URI' name='ontolgy_uri'
                                        onChange={this.SetURI}/>
                            <Form.Button type="submit"> Visualize the Ontology </Form.Button>
                        </Form.Field>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        );

    }
}


const mapDispatchToProps = dispatch => {
    return {
        redirect: function (href) {
            return dispatch(push(href))
        },
    };
};


export default connect(null, mapDispatchToProps)(UriUpload);