import React, { Component} from 'react';
import { Card, Accordion, Icon} from 'semantic-ui-react';
import { connect } from 'react-redux';

import { Random } from 'meteor/random'

class CytoscapeInfo extends Component {

    constructor(props){
        super(props);
        this.state = {
            triples : null,
            activeIndex : 0
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillReceiveProps(nextProps){
        self= this;
        Meteor.call('find_attributes',nextProps.SelectedNode,function (err,res) {
            if(err)
                console.log(err);
            else
                self.setState({triples : res})
        })
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state.activeIndex;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex })
    };

    render(){
        const activeIndex  = this.state.activeIndex;
        if(this.state.triples===null){
            return(
                <Card>
                    <Card.Content>
                        <Card.Header>
                            Predicates
                        </Card.Header>
                    </Card.Content>
                </Card>
            );
        }
        else{
            return(<Card>
                    <Card.Content>
                        <Card.Header>
                            Predicates - {this.state.triples[0].subject}
                        </Card.Header>
                    </Card.Content>
                        {this.state.triples.map((data,index) => {
                              return(
                                  <Accordion styled key={Random.id()}>
                                  <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleClick}>
                                      <Icon name='dropdown' />
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
                </Card>
            );
        }
    }
}

const mapStateToProps = state => {
  return {
    SelectedNode: state.RootReducer.select
  }
};

export default connect(mapStateToProps)(CytoscapeInfo);