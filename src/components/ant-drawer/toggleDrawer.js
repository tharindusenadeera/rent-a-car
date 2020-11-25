import React, { Component } from 'react'
import { connect } from 'react-redux';
import { toggleDrawer } from '../../actions/CommenActions';

class ToggleDrawer extends Component {

    constructor(props){
        super(props);
    }

    _toggleDrawer = () => {
        try {
            const { dispatch,isDrawerOpen,onPress } = this.props;
            if(onPress) {
                onPress();
            }
            dispatch(toggleDrawer(!isDrawerOpen));
        } catch (error) {
            console.log('error',error);
        }
    }

    render() {
        const { children } = this.props
        return(
            <div onClick={ () => this._toggleDrawer() }>
                { children }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isDrawerOpen : state.common.isDrawerOpen
    }
}

export default connect(mapStateToProps)(ToggleDrawer);