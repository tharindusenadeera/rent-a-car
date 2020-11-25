import {
  FREE_DELIVERY_LOCATIONS,
  CAR_PHOTO_UPLOAD,
  CAR_PHOTO_DELETE,
  CAR_PROTECTION_LEVELS,
  CAR_COVERAGES,
  DELIVERY_OPTIONS,
  GALLERY_CARS,
  UNAVAILABLE_ERROR,
  CAR_REGISTRATION_PAGE,
  UNAVAILABLE_LIST,
  CAR_DISCOUNT,
  CAR_DELIVARY_PRICE,
  CAR_DELIVARY_STATUS,
  SELECTED_CAR_PRICE,
  SEARCH_DATA,
  CAR_MAKES,
  US_STATES,
  CAR_AVAILABILITY,
  GET_CAR_TRIMS,
  FETCHING,
  YEARS,
  GET_MAKES,
  GET_CAR,
  GET_CAR_MODELS,
  GET_CAR_MODELS_FOR_MAKE,
  GET_FEATURES,
  REGISTERED_CAR,
  FILTERED_CAR_LIST,
  USERS_CARS,
  USER_LAST_INCOMPLETE_CAR,
  COACHELLA_GALLERY_CARS,
  SIMILAR_CARS,
  CAR_V2,
  ADVANCE_CAR_PRICE,
  FREE_DELIVERY_LOCATIONS_CAR_LISTING,
  RESET_USER,
  REGISTERED_CAR_FOR_EDIT
} from "../actions/ActionTypes";

const initialState = {
  galleryCars: [],
  coachellaGalleryCars: [],
  carMakes: [],
  makes: [],
  carModels: [],
  trims: [],
  features: [],
  filteredCar: [],
  carModelsForMake: [],
  years: [],
  usStates: [],
  carPhotoUpload: [],
  pageId: 1,
  car: {
    car_photo: [],
    year: "",
    features: [],
    car_owner: {
      profile_image_thumb: ""
    },
    car_make: {
      name: ""
    },
    car_model: {
      name: ""
    }
  },
  carProtectionLevels: [],
  carCoverageLevels: [],
  delivery_options: [],
  free_delivery_loations: [],
  unavailableList: [],
  unavailableError: "",
  selectedCarPrice: 0,
  carDelivaryPrice: 0,
  carDiscount: 0,
  carDelivaryStatus: null,
  usersCars: [],
  registeredCar: {},
  search: {
    location: "",
    from: "",
    to: ""
  },
  fetching: false,
  car_availability: true,
  userLastIncompleteCar: {},
  similarCars: null,
  car_v2: null,
  freeDeliveryLocations: [],
  advane_prices: [],
  registeredCarForEdit: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_MAKES:
      return { ...state, makes: action.payload };
    case GET_CAR_MODELS:
      return { ...state, carModels: action.payload };
    case GET_CAR_TRIMS:
      return { ...state, trims: action.payload };
    case GET_CAR:
      return { ...state, car: action.payload };
    case CAR_V2:
      return { ...state, car_v2: action.payload };
    case SEARCH_DATA:
      return { ...state, search: action.payload };
    case GET_CAR_MODELS_FOR_MAKE:
      return { ...state, carModelsForMake: action.payload };
    case GET_FEATURES:
      return { ...state, features: action.payload };
    case REGISTERED_CAR:
      return {
        ...state,
        registeredCar: { ...state.car.registeredCar, ...action.payload }
      };
    case FILTERED_CAR_LIST:
      return { ...state, filteredCar: action.payload };
    case FETCHING:
      return { ...state, fetching: action.payload };
    case CAR_AVAILABILITY:
      return { ...state, car_availability: action.payload };
    case YEARS:
      return { ...state, years: action.payload };
    case US_STATES:
      return { ...state, usStates: action.payload };
    case GALLERY_CARS:
      return { ...state, galleryCars: action.payload };
    case COACHELLA_GALLERY_CARS:
      return { ...state, coachellaGalleryCars: action.payload };
    case CAR_MAKES:
      return { ...state, carMakes: action.payload };
    case USERS_CARS:
      return { ...state, usersCars: action.payload };
    case SELECTED_CAR_PRICE:
      return { ...state, selectedCarPrice: action.payload };
    case CAR_DELIVARY_PRICE:
      return { ...state, carDelivaryPrice: action.payload };
    case CAR_DISCOUNT:
      return { ...state, carDiscount: action.payload };
    case CAR_DELIVARY_STATUS:
      return { ...state, carDelivaryStatus: action.payload };
    case CAR_COVERAGES:
      return { ...state, carCoverageLevels: action.payload };
    case UNAVAILABLE_LIST:
      return { ...state, unavailableList: action.payload };
    case UNAVAILABLE_ERROR:
      return { ...state, unavailableError: action.payload };
    case CAR_PROTECTION_LEVELS:
      return { ...state, carProtectionLevels: action.payload };
    case DELIVERY_OPTIONS:
      return { ...state, delivery_options: action.payload };
    case CAR_REGISTRATION_PAGE:
      return { ...state, pageId: action.payload };
    case FREE_DELIVERY_LOCATIONS:
      return { ...state, free_delivery_loations: action.payload };
    case USER_LAST_INCOMPLETE_CAR:
      return { ...state, userLastIncompleteCar: action.payload };
    case CAR_PHOTO_UPLOAD:
      let carPhotoProgresses = [];
      // check if photo key exists
      const carPhotoUploadExist = state.carPhotoUpload.filter(carPhoto => {
        return carPhoto.photoKey == action.payload.photoKey;
      });
      // if key exists update the current array with the incoming value
      if (carPhotoUploadExist.length) {
        carPhotoProgresses = state.carPhotoUpload.map(carPhoto => {
          if (carPhoto.photoKey == action.payload.photoKey) {
            return action.payload;
          }
          return carPhoto;
        });
      } else {
        carPhotoProgresses = [...state.carPhotoUpload, action.payload];
      }
      return { ...state, carPhotoUpload: carPhotoProgresses };
    case CAR_PHOTO_DELETE:
      // generate new car photo array
      const carPhotos = state.registeredCar.car_photo;
      const updatedCarPhotos = carPhotos.filter(carPhoto => {
        return carPhoto.id != action.payload;
      });
      return {
        ...state,
        registeredCar: {
          ...state.registeredCar,
          car_photo: updatedCarPhotos
        }
      };
    case SIMILAR_CARS:
      return { ...state, similarCars: action.payload };
    case ADVANCE_CAR_PRICE:
      return Object.assign(
        {},
        {
          ...state,
          car_v2: {
            ...state.car_v2,
            advane_prices: action.payload
          }
        }
      );

    case FREE_DELIVERY_LOCATIONS_CAR_LISTING:
      return { ...state, freeDeliveryLocations: action.payload };
    case RESET_USER:
      return { ...state, userLastIncompleteCar: {}, registeredCar: {} };
    case REGISTERED_CAR_FOR_EDIT:
      return { ...state, registeredCarForEdit: action.payload };
    default:
      return state;
  }
}
