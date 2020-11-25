import React, {Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import {forgetPassword } from '../../actions/UserActions'

const validate = values => {
    const errors = {}
    if(!values.email){
        errors.email = 'Required'
    }
    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        errors.email = 'Invalid email address'
    }
    return errors
}

const renderField = ({ input, label, type, meta: { touched, error } }) => (
    <div>
        <label>{label}</label>
        <div>
            <input {...input} type={type} placeholder={label}/>
            {touched && error && <span style={{color:'red',fontSize:10}}>{error}</span>}
        </div>
    </div>
)

class ForgetPassword extends Component {

	render() {
    const { handleSubmit, pristine, reset, error, submitting, submitSucceeded, forgotUserPassword, popUp } = this.props
    return (
        <div className="row">
            <div className="sign-up-container">
                <div className="row">
                    <h3>Forgot password</h3>
                    <form onSubmit={handleSubmit(forgetPassword)}>
                        <div className="row">
                            <div className="col-md-12 error">
                                {
                                    ( forgotUserPassword.error ) ? forgotUserPassword.message : null 
                                }
                            </div>
                            <div className="col-md-12 success">
                                {
                                    ( !forgotUserPassword.error && forgotUserPassword.error != null ) ? forgotUserPassword.message : null 
                                }
                            </div>
                            <div className="col-md-12">
                                <label>Email</label>
                                <div>
                                    <Field name="email" component={renderField} type="email" placeholder="sample@ryde.com"/>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col-md-12">
                                <button type="submit" disabled={pristine || submitting} className="btn btn-primary sign-up-btn">Submit</button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                {error && <strong className="b_error">{error}</strong>}
                            </div>
                        </div>					
                    </form>
                </div>
            </div>
        </div>
    )
	}
}

ForgetPassword = reduxForm({
    form: 'forget-password',
    validate
})(ForgetPassword)

export default ForgetPassword

