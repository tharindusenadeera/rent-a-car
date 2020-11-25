import React from 'react'

const SignUpPage = props => {
    const initialValues = {
        referral : (props.params.referral) ? props.params.referral : '' 
    }
    return (
        <div>
            {
                // <SignUp initialValues={initialValues} />
            }
            
        </div>
     )
}

export default SignUpPage