import React from 'react'
import moment from 'moment'

const ProfileSnippet = ({receiver,car,bookingId, selectThread, active ,booking}) => {
    const carName = car.car_make.name+' '+car.car_model.name;
    const fromDate = (booking.from_date)? moment(booking.from_date,'YYYY-MM-DD h:mm a') : moment()
    const toDate = (booking.to_date)? moment(booking.to_date,'YYYY-MM-DD h:mm a') : moment()

    return (
    <div className={active} >
    <div className="profile-snippet" onClick={ () => {selectThread(bookingId)}}>
        <div className="row">
            <div className="col-md-3 col-sm-2 col-xs-2">
                <img className="img-circle user-profile-pic-midium img-responsive" src={(receiver.profile_image_thumb)? receiver.profile_image_thumb : "./images/default-profile.png"} />
            </div>
            <div className="col-md-9 col-sm-10 col-xs-10 msgcnt_content">
                <big className="profile-snippet-name">{receiver.first_name} {receiver.last_name}</big><br/>
                <small>{booking.number}</small><br/>
                <span> { carName } </span><br/> <small> {fromDate.format('MMM D h:mm a')} &nbsp;- &nbsp;{toDate.format(' MMM D h:mm a')} </small>
            </div>
        </div>
    </div>
    </div>
    )
}

export default ProfileSnippet
