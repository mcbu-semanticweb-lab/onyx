import React, {Component} from 'react';
import { Button, Search, Image, Modal } from 'semantic-ui-react';
import _ from 'lodash'
import {searchAC, select} from "../../redux/actions/actioncreators";
import {connect} from "react-redux";

class SearchBar extends Component{

    constructor(props){
        super(props);
        this.state = {
            isLoading : false,
            results : [],
            value : '',
        }
    }

    componentWillMount() {
        let self = this;
        this.resetComponent();
        Meteor.call('get_nodes',function (err,res) {
            if(res){
                console.log(res);
                self.setState({source : res})
            }
        })
    }

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' });

    handleResultSelect = (e, { result }) => {
        this.setState({ value: result.title });
        this.props.select(result.id)
    };

    handleSearchChange = (e, { value }) => {
        console.log(value);
        this.setState({ isLoading: true, value });


        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent();

            this.props.search(value);
            let source = this.props.source;
            console.log(source);

            this.setState({
                isLoading: false,
                results: source,
            })
        }, 300)
    };

    render(){
        return(
            <Search
                loading={this.state.isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                results={this.state.results}
                value={this.state.value}
            />
        );
    }
}


const mapStateToProps = state => {
    return {
        source: state.RootReducer.SearchReducer.result,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        search: function (text,result) {
            return (dispatch(searchAC(text,result)));
        },
        select: function (id) {
            return (dispatch(select(id)));
        },

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);



