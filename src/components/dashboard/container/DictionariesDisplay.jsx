import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import '../styles/index.css';
import { fetchDictionaries } from '../../../redux/actions/dictionaries/dictionaryActionCreators'
import SideBar from '../components/SideNavigation';
import ListDictionaries from '../components/dictionary/ListDictionaries';

export class DictionaryDisplay extends Component {
    static propTypes = {
        fetchDictionaries: propTypes.func.isRequired,
        dictionaries: propTypes.arrayOf(propTypes.shape({
            dictionaryName: propTypes.string,
        })).isRequired,
        isFetching: propTypes.bool.isRequired,
    };
    componentDidMount(){
        this.props.fetchDictionaries();
    }
    render (){
        return(
        <div className="dashboard-wrapper">
            <SideBar />
            <div className="row justify-content-center">
                <div className="offset-sm-1 col-10">
                    <ListDictionaries dictionaries={this.props.dictionaries} fetching={this.props.isFetching} />
                </div>
            </div>
        </div>

    )
}
}

export const mapStateToProps = state => ({
    dictionaries: state.dictionaries.dictionaries,
    isFetching: state.dictionaries.loading,
})
export default connect(mapStateToProps, { fetchDictionaries })(DictionaryDisplay);
