import React,{ Component } from 'react';
import {connect} from "react-redux";
import {Grid} from 'semantic-ui-react';
import {push} from "redux-little-router";



class FileUpload extends Component {

    constructor(props){
        super(props);
        this.Send = this.Send.bind(this);
    }

    Send(event){
        let self=this;
        var input = event.target;
        var reader = new FileReader();
        reader.readAsText(input.files[0]);
        reader.onload = function(){
            var text = reader.result;
            Meteor.call('send_to_cayley',text,function (err,res) {
                console.log(err,res);
                if(res){
                    console.log("cayley send completed");
                    self.props.redirect('/AppPage');
                }
            });
        };
        //this.props.draw(true);
    }

    render(){
        return(
            <Grid.Row>
                <Grid.Column width={6}>
                    <input type="file" onChange={this.Send}/>
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



export default connect(null, mapDispatchToProps)(FileUpload);