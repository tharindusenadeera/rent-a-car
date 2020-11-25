import React, {Component} from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { getCarCoverageLevels } from '../../actions/CarActions';
import { getBookingData } from '../../actions/BookingActions';

class CarCoverageWidget extends Component {
	constructor(props) {
		super(props);
		this.state = {
            selectedOption: props.currentCoverageLevel
        };
		this.getBookingData = this.getBookingData.bind(this);
	}

	componentWillMount() {
		const { dispatch } = this.props;
		dispatch(getCarCoverageLevels());
	}

	getBookingData(e) {
		const { dispatch, fromDate, toDate, car } = this.props;
		this.setState({selectedOption: parseInt(e.target.value)});
		localStorage.carCoverageLevel = parseInt(e.target.value);
		dispatch(getBookingData({
			from_date: fromDate,
			to_date: toDate,
			car_coverage_level: e.target.value,
			car_id: car.id
		}));
	}

	render() {
		const { carCoverageLevels, car, popUp, closeModal } = this.props;
		return (
			<div className="col-md-12">
			{ 	carCoverageLevels.map( carCoverage => {
					if ( (parseInt(car.car_value) > 80000 &&  carCoverage.id == 1) || parseInt(car.car_value) < 80000 ){
						return (<div key={carCoverage.id} data-tip data-for={carCoverage.title} className="radio radio-primary">
						<input 
							type="radio" 
							name="carCoverage" 
							value={carCoverage.id}
							checked={ this.state.selectedOption == carCoverage.id }
							onChange={this.getBookingData}
						/>
						<label htmlFor={carCoverage.id}>
							{carCoverage.title }
						</label>
							<div>
							{ (popUp) ? <p>{carCoverage.description}</p> : <ReactTooltip id={carCoverage.title} type='dark'>
								<span> {carCoverage.description} </span>
							</ReactTooltip> }
							</div>
						</div>
						)
					}
				})
			}
			{ popUp && <button className="btn btn-sm btn-success" onClick={closeModal}> Got it </button> }
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		carCoverageLevels: state.car.carCoverageLevels
	}
};

export default connect(mapStateToProps)(CarCoverageWidget);
