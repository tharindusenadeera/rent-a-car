import React from 'react'
import {sendMessage} from '../../actions/UserActions'
import { Field, reduxForm } from 'redux-form'


const ChatComposer = props => {
    const { handleSubmit,submitting } = props
    return (
        <div>
            <form onSubmit={handleSubmit(sendMessage)}>
                <Field name="message" className="message-text" component="textarea"/>
                <button type="submit" className="btn btn-success message-send">Send</button>
            </form>
        </div>
    )
}

export default reduxForm({
  form: 'chat-box' 
})(ChatComposer)