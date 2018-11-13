import React, {Component} from 'react';
import {Card, Accordion, Icon} from 'semantic-ui-react';
import {connect} from 'react-redux';

import {Random} from 'meteor/random'
import {setNamespace} from "../../redux/actions/actioncreators";

class CytoscapeInfo extends Component {

    constructor(props) {
        super(props);
        this.state = { //TODO : state ler redux a aktarılacak
            triples: null,
            activeIndex: 0,
            class_number: null,
            class_utilization: null,
            instance_number: null,
            property_number: null,
            pitfall_res: null
        };
        this.handleClick = this.handleClick.bind(this);

    }

    componentDidMount() {

        let self = this;

        console.log("mount");
        //TODO : infoları redux ta tutup sürekli call cagırma
        Meteor.call('class_number', function (err, res) {
            if (res)
                self.setState({class_number: res});
            else
                console.log(err);
        });

        Meteor.call('class_utilization', function (err, res) {
            if (res)
                self.setState({class_utilization: res});
            else
                console.log(err);
        });

        Meteor.call('instance_number', function (err, res) {
            if (res)
                self.setState({instance_number: res});
            else
                console.log(err);
        });

        Meteor.call('property_number', function (err, res) {
            if (res)
                self.setState({property_number: res});
            else
                console.log(err);
        });
        Meteor.call('get_namespace', function (err, res) {
            if (res)
                self.props.setNamespace(res);
            else
                console.log(err);
        });
    }


    componentWillReceiveProps(nextProps) {
        self = this;
        Meteor.call('find_attributes', nextProps.selectedNode, "info", function (err, res) {
            if (err)
                console.log(err);
            else
                self.setState({triples: res})
        });

        Meteor.call('get_individual_num', nextProps.selectedNode, function (err,res) {
            console.log("ind number is " +res);
        })
    }

    handleClick = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state.activeIndex;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex})
    };

    render() {
        let content;
        const activeIndex = this.state.activeIndex;
        if (this.state.triples !== null) {
            content = this.state.triples.map((data, index) => {
                return (
                    <Accordion styled key={Random.id()}>
                        <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleClick}>
                            <Icon name='dropdown'/>
                            {data.predicate}
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === index}>
                            <p>
                                {data.object}
                            </p>
                        </Accordion.Content>
                    </Accordion>);
            })
        }
        return (
            <Card fluid>
                <Card.Content>
                    <Card.Header>
                        Ontology Metrics
                    </Card.Header><br/>
                    {console.log(this.state.class_number, this.state.class_utilization, this.state.instance_number, this.state.property_number)}
                    Class Number is {this.state.class_number} <br/><br/>
                    Class Utilization is {this.state.class_utilization} <br/><br/>
                    Instance number is {this.state.instance_number} <br/><br/>
                    Property number is {this.state.property_number}
                    <Card.Header><br/><br/><br/>
                        Node Info{this.props.selectedNode}
                    </Card.Header>

                    {content}
                </Card.Content>
            </Card>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setNamespace: function (ns) {
            return (dispatch(setNamespace(ns)));
        },
    }
};

const mapStateToProps = state => {
    return {
        selectedNode: state.RootReducer.selectedNode
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(CytoscapeInfo);