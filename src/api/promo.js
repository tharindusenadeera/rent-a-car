import Axios from "axios";

export const fetchPromoFeaturedRydes = params => {
  return Axios.get(`${process.env.REACT_APP_API_URL}cro/gallery-cars`, {
    params: { ...params }
  });
};

export const fetchRestimonialReviews = (params = {}) => {
  return Axios.get(`${process.env.REACT_APP_API_URL}cro/testimonial-reviews`, {
    params: { ...params }
  });
};
