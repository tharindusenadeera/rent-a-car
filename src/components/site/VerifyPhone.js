import React,{Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import ReactTelephoneInput from 'react-telephone-input/lib/withStyles'
import {verifyPhoneAction, resendCode} from '../../actions/UserActions'
import { modalStyles } from '../../consts/consts'

const validate = values => {
    const errors = {}
    if (!values.verifyCode) {
        errors.verifyCode = 'Required'
    }
    return errors
}

const handleInputChange = (telNumber, selectedCountry) => {
    localStorage.setItem('phoneNumber',telNumber)
}

class VerifyPhone extends Component {
    render(){
        const { error, submitting,pristine, verifyPhone, phoneCodeValidity, handleSubmit, resendCodeSuccess, dispatch } = this.props
        return (
            <div className="container">
                <Modal isOpen={verifyPhone} contentLabel="Modal" style={modalStyles} >
                <div className="sign-up-container">
                    <div className="row">
                        <h3>Enter Verification Code</h3>
                        <p> Please Enter your verification code</p>
                        <form onSubmit={handleSubmit(verifyPhoneAction)} >
                            <div className="row">
                                <div className="col-md-12">
                                    <label>Enter Phone Code</label>
                                    <div>
                                        <Field name="verifyCode" component='input' type="text"/>
                                    </div>
                                </div>
                            </div>
                            {error && <p className="error-summary">{error}</p>}
                            <br/>
                            <div className="row">
                                <div className="col-md-12">
                                    <button type="submit" className="btn btn-primary sign-up-btn">Submit</button>
                                </div>
                            </div>
                        </form>
                        <div>
                            {(resendCodeSuccess)?                        
                          <div className="alert alert-success" role="alert">
                            <p>{resendCodeSuccess && resendCodeSuccess}</p>
                          </div>
                        :null}
                        </div>
                        <form className="form-inline">
                            <div className="form-group">
                                <ReactTelephoneInput autoFormat={true} defaultCountry="us"  initialValue={localStorage.phoneNumber} onChange={handleInputChange} />
                            </div>
                            <button type="button" onClick={() => { resendCode(dispatch) } } className="btn resend-code-btn btn-success">Resend Code</button>
                        </form>
            
                    </div>
                </div>
                </Modal>
            </div>
        )
    }
}

VerifyPhone = reduxForm({
    form: 'verify-phone',
    validate
})(VerifyPhone)

VerifyPhone = connect( state => {
    return {
    verifyPhone: state.user.verifyPhone,
    user: state.user.user,
    resendCodeSuccess: state.user.resendCodeSuccess
  }
},
)(VerifyPhone)

export default VerifyPhone
