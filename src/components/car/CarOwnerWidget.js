import React  from 'react'
import { bucketUrl } from '../../consts/consts'
import moment from 'moment-timezone'
import {Link} from 'react-router'
import Rating from 'react-rating';

const CarOwnerWidget = (props) =>{
	const { user } = props;
	const { car_owner, owner_rating	} = user;
	return(
		<div className="panel panel-custom panel-owner">
		<Link className="cars-box-link" to={"profile/"+ car_owner.id}>
    		<div className="panel-heading">OWNER INFO</div>
		</Link>
      	<div className="panel-body">
			<div className="media">
				<div className="media-left">
					<Link to={`/profile/${car_owner.id}`}><img className="media-object img-circle img-thumbnail user-profile-pic-midium" src={car_owner.profile_image_thumb} /></Link>
				</div>
				<div className="media-body">
					<Link to={`/profile/${car_owner.id}`} >
						<h4 className="label-gray-lg">{car_owner.first_name}</h4>
					</Link>

					<div>
						{(car_owner.user_rating)?
						<div className="car-info">
							<Rating
							emptySymbol="fa fa-star-o"
							fullSymbol="fa fa-star"
							// fractions={2}
							initialRating={parseInt(car_owner.user_rating)}
							readonly
							/>
						</div> : null }
						<div className="">
							Member Since : <span className="">{moment(car_owner.created_at).format('MMMM - YYYY')}</span>
						</div>
					</div> 
				</div>
			</div>
       </div>
    </div>
    )
}
export default CarOwnerWidget
