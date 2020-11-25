import React, { Component } from 'react'
import { Link } from 'react-router'
import Rating from 'react-rating';
import moment from 'moment-timezone';

class CarWidget extends Component {
    constructor() {
        super()
        this.loadFeaturesSection = this.loadFeaturesSection.bind(this)
    }
    loadFeaturesSection(car) {
        return [];
        const array = []
        array.push(
            {
                div: (car.free_miles_delivery === 1 ||
                    car.per_mile_charge_delivery === 1 ||
                    car.offer_free_delivery ||
                    car.offer_free_delivery_to_airport
                ) ? 'Door step delivery' : 0
            },
            {
                div: (car.transmission === 1) ? 'Auto' : 'Manual',
            },
            {
                div: 0
            },
            {
                div: 0
            },
            {
                div:
                    (car.miles_allowed_per_day === 'Unlimited' ||
                        car.miles_allowed_per_week === 'Unlimited' ||
                        car.miles_allowed_per_month === 'Unlimited'
                    ) ?
                        'Unlimited miles' : 0
            },
            {
                div: 0
            }
        )
        var j = 0
        for (var i = 0; i < array.length; i++) {
            if (array[i].div === 0) {
                if (j <= car.features.length) {
                    if (car.features[j]) {
                        array[i].div = car.features[j].name
                    }
                }
                j++
            }
        }
        return array
    }
    render() {
        const { car, from, fromTime, to, toTime, handleRydeFormSubmit } = this.props
        //  const featureArray = this.loadFeaturesSection(car)
        //  console.log('car',car);

        return (
            <div>
                <div className="col-md-4 col-sm-6 car-widget">
                    <div className="thumbnail">
                        <div className="thumbnail-image">
                            {/*<a>  <img src={ (car.car_photos.data) ? car.car_photos.data.image_thumb : "https://cdn4.iconfinder.com/data/icons/car-silhouettes/1000/sedan-512.png" } className="car_thumb" /> </a>*/}
                            <Link target="_blank" to={`/car/${car.id}/${moment(from).format('MM-DD-YYYY')}/${moment(from).format('HH:mm')}/${moment(to).format('MM-DD-YYYY')}/${moment(to).format('HH:mm')}`}>
                                <img src={(car.car_photos.data) ? car.car_photos.data.image_thumb : "https://cdn4.iconfinder.com/data/icons/car-silhouettes/1000/sedan-512.png"} className="car_thumb" />
                            </Link>
                        </div>
                        <div className="thumbnail-content">
                            <div className="row">
                                <div className="col-md-7">
                                    { /*<div className="car_name" onClick={()=> handleRydeFormSubmit(car.id) }>{car.name }</div> */}
                                    <div className="car_name">
                                        <Link target="_blank" to={`/car/${car.id}/${moment(from).format('MM-DD-YYYY')}/${moment(from).format('HH:mm')}/${moment(to).format('MM-DD-YYYY')}/${moment(to).format('HH:mm')}`}>
                                            {car.name}
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    {/*<div className="car_price" onClick={()=> handleRydeFormSubmit(car.id) }>$ {car.daily_rate}</div>*/}
                                    <div className="car_price">
                                        <Link target="_blank" to={`/car/${car.id}/${moment(from).format('MM-DD-YYYY')}/${moment(from).format('HH:mm')}/${moment(to).format('MM-DD-YYYY')}/${moment(to).format('HH:mm')}`}>
                                            $ {car.daily_rate}
                                        </Link>
                                    </div>

                                </div>
                            </div>
                            <div className="row caption-row">
                                <div className="col-md-5">
                                    <div className="pull-left image">
                                        <Link to={`/profile/${car.user.data.id}`}><img width={25} height={25} src={(car.user.data.profile_image) ? car.user.data.profile_image : '/images/defaultprofile.jpg'} className="img-circle" alt="User Image" /></Link>
                                        <Link to={`/profile/${car.user.data.id}`}><small className="car_owner_name"> By {car.user.data.first_name}</small></Link>
                                    </div>
                                </div>

                                <div className="col-md-7">
                                    {/*<span className="label-sm label-location"><span className="glyphicon glyphicon-map-marker car_location"></span>{car.address}</span>*/}
                                    {(car && car.car_rating != 0) ?
                                        <div className="car-info rating-align">
                                            <Rating
                                                emptySymbol="fa fa-star-o"
                                                fullSymbol="fa fa-star"
                                                fractions={2}
                                                initialRating={parseInt(car.car_rating)}
                                                readonly
                                            />
                                        </div> : null}
                                </div>
                            </div>
                            {/* <div className="row caption-row">
                                    {
                                        featureArray.map(function (i,key) {
                                            if(i.div != 0){
                                                return (
                                                    <div key={key} className="col-md-12 car-info">
                                                        {(i.div === 0) ? <div>&nbsp;</div> : i.div}
                                                    </div>
                                                )
                                            }else{
                                                return null
                                            }

                                        })
                                    }
                                    </div> */}
                            <div className="row caption-row caption-row-sep">
                                <div className="col-md-6">
                                    <p className="pull-left trips-wrapper"><b>{(car.trip_status)}</b></p>
                                </div>
                                <div className="col-md-6">
                                    {/*<a onClick={()=> handleRydeFormSubmit(car.id) } className="pull-right view_car_detail">Detail view</a>*/}
                                    {/* <Link to={`/car/${car.id}/${from}/${fromTime}/${to}/${toTime}`} className="pull-right view_car_detail">Detail view</Link> */}
                                    <Link className="pull-right view_car_detail" target="_blank" to={`/car/${car.id}/${moment(from).format('MM-DD-YYYY')}/${moment(from).format('HH:mm')}/${moment(to).format('MM-DD-YYYY')}/${moment(to).format('HH:mm')}`}>
                                        Detail view
                                            </Link>

                                </div>
                            </div>
                        </div>
                        <div className="thumbnail-footer">
                            {/*<button className="btn btn-success btn-block" onClick={()=> handleRydeFormSubmit(car.id) } role="button">RYDE</button>*/}
                            <Link activeClassName="pull-right view_car_detail" target="_blank" to={`/car/${car.id}/${moment(from).format('MM-DD-YYYY')}/${moment(from).format('HH:mm')}/${moment(to).format('MM-DD-YYYY')}/${moment(to).format('HH:mm')}`}>
                                <button className="btn btn-success btn-block" role="button">
                                    RYDE
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default CarWidget
