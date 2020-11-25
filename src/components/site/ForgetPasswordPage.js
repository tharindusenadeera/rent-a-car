import React, {Component} from 'react'
import {connect} from 'react-redux'
import ForgetPassword from './ForgetPassword'

class ForgetPasswordPage extends Component {
    render(){
        return (
            <div className="login-page-wrap">
            <div className="container">
                <ForgetPassword forgotUserPassword={this.props.forgotUserPassword} />
            </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        forgotUserPassword : state.user.forgotUserPassword
    }
}

export default connect(mapStateToProps)(ForgetPasswordPage)