import React from 'react'
import { Field, reduxForm } from 'redux-form'
import Modal from 'react-modal'
import ReactTelephoneInput from 'react-telephone-input/lib/withStyles'
import {verifyPhoneLoginAction, resendCode} from '../../actions/UserActions'
import { modalStyles } from '../../consts/consts'

const validate = values => {
    const errors = {}
    if (!values.password) {
        errors.password = 'Required'
    }
    if(!values.email){
        errors.email = 'Required'
    }
    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        errors.email = 'Invalid email address'
    }
    return errors
}

const handleInputChange = (telNumber, selectedCountry) => {
    localStorage.setItem('phoneNumber',telNumber)
}

const VerifyPhoneLogin = (props) => {
    const { handleSubmit, pristine, error, submitting, isOpen, phoneCodeValidity } = props

    return (
        <div className="container">
			<Modal isOpen={isOpen} contentLabel="Modal" style={modalStyles} >
            <div className="sign-up-container">
                <div className="row">
                    <h3>Enter Verification Code</h3>
					<p> Please Enter your verification code to complete registration </p>
                    <form onSubmit={handleSubmit(verifyPhoneLoginAction)}>
						              <div className="row">
                            <div className="col-md-12">
                                <label>Enter Phone Code</label>
                                <div>
                                    <Field name="verifyCode" component='input' type="text"/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <label>Email</label>
                                <div>
                                    <input className="disabled" type="email" name="email" value={localStorage.email} disabled={true} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <label>Password</label>
                                <div>
                                    <Field name="password" component='input' type="password"/>
                                </div>
                            </div>
                        </div>
                        <br/>
                        {error && <p className="error-summary">{error}</p>}
                        <br/>
                        <div className="row">
                            <div className="col-md-12">
                                <button type="submit" disabled={pristine || submitting} className="btn btn-primary sign-up-btn">Submit</button>
                            </div>
                        </div>
					</form>
                    <form className="form-inline">
                        <div className="form-group">
                            <ReactTelephoneInput autoFormat={true} defaultCountry="us"  initialValue={localStorage.phoneNumber} onChange={handleInputChange} />
                        </div>
                        <button type="button" onClick={resendCode} className="btn resend-code-btn btn-success">Resend Code</button>
                    </form>
				</div>
			</div>
		</Modal>
    </div>
    )
}

export default reduxForm({
    form: 'verifyPhoneLoginForm',
    validate,
})(VerifyPhoneLogin)