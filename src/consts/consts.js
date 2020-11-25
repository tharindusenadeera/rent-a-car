import axios from "axios";

export const confirmTimeArray = [
  { value: "3 hours" },
  { value: "6 Hours" },
  { value: "12 Hours" },
  { value: "1 Day" },
  { value: "2 Days" },
  { value: "1 Week" }
];

export const carRentShortest = [
  { value: "Any" },
  { value: "2 Days" },
  { value: "3 Days" },
  { value: "4 Days" }
];

export const carRentLongest = [
  { value: "Any" },
  { value: "1 Week" },
  { value: "2 Weeks" },
  { value: "1 Month" }
];

export const milesPerDay = [
  { value: "Unlimited" },
  { value: "100 Miles" },
  { value: "150 Miles" },
  { value: "200 Miles" },
  { value: "250 Miles" }
];

export const milesPerWeek = [
  { value: "Unlimited" },
  { value: "500 Miles" },
  { value: "750 Miles" },
  { value: "1000 Miles" },
  { value: "1250 Miles" }
];

export const milesPerMonth = [
  { value: "Unlimited" },
  { value: "1000 Miles" },
  { value: "1200 Miles" },
  { value: "1500 Miles" },
  { value: "1750 Miles" },
  { value: "2000 Miles" },
  { value: "2750 Miles" }
];

export const offerFreeDeliveryOptions = [
  { key: "any", value: "Any" },
  { key: "offer-3-Days", value: "3 Days" },
  { key: "offer-1-Week", value: "1 Week" },
  { key: "offer-1-Month", value: "1 Month" }
];

export const offerFreeDeliveryToAirport = [
  { key: "airport-1", value: "LAX Airport" },
  { key: "airport-2", value: "Burbank Airport" },
  { key: "airport-3", value: "Long Beach Airport" },
  { key: "airport-4", value: "Downtown Los Angeles" },
  { key: "airport-5", value: "Santa Monica" },
  { key: "airport-6", value: "Beverly Hills" }
];

export const discountConditions = [
  { key: 1, value: "3 Days" },
  { key: 2, value: "Weekly" },
  { key: 3, value: "Monthly" }
];

export const carTypes = [
  { key: 1, value: "Sedan" },
  { key: 2, value: "Convertible" },
  { key: 3, value: "SUV" },
  { key: 4, value: "Trucks" },
  { key: 5, value: "Vans" },
  { key: 6, value: "Coupe" }
];

export const creditCardType = [
  { key: "Visa", value: "Visa" },
  { key: "Mastercard", value: "Mastercard" },
  { key: "American Express", value: "American Express" },
  { key: "Discover", value: "Discover" },
  { key: "JCB", value: "JCB" },
  { key: "Diners Club", value: "Diners Club" }
];

export const creditCardYears = [
  { key: "2018", value: "2018" },
  { key: "2019", value: "2019" },
  { key: "2020", value: "2020" },
  { key: "2021", value: "2021" },
  { key: "2022", value: "2022" },
  { key: "2023", value: "2023" },
  { key: "2024", value: "2024" },
  { key: "2025", value: "2025" },
  { key: "2026", value: "2026" },
  { key: "2027", value: "2027" },
  { key: "2028", value: "2028" },
  { key: "2029", value: "2029" },
  { key: "2030", value: "2030" },
  { key: "2031", value: "2031" },
  { key: "2032", value: "2032" },
  { key: "2033", value: "2033" }
];

export const months = [
  { value: "01" },
  { value: "02" },
  { value: "03" },
  { value: "04" },
  { value: "05" },
  { value: "06" },
  { value: "07" },
  { value: "08" },
  { value: "09" },
  { value: "10" },
  { value: "11" },
  { value: "12" }
];

export const timeList = [
  ["00:00", "midnight"],
  ["00:30", "12:30 AM"],
  ["01:00", "1:00 AM"],
  ["01:30", "1:30 AM"],
  ["02:00", "2:00 AM"],
  ["02:30", "2:30 AM"],
  ["03:00", "3:00 AM"],
  ["03:30", "3:30 AM"],
  ["04:00", "4:00 AM"],
  ["04:30", "4:30 AM"],
  ["05:00", "5:00 AM"],
  ["05:30", "5:30 AM"],
  ["06:00", "6:00 AM"],
  ["06:30", "6:30 AM"],
  ["07:00", "7:00 AM"],
  ["07:30", "7:30 AM"],
  ["08:00", "8:00 AM"],
  ["08:30", "8:30 AM"],
  ["09:00", "9:00 AM"],
  ["09:30", "9:30 AM"],
  ["10:00", "10:00 AM"],
  ["10:30", "10:30 AM"],
  ["11:00", "11:00 AM"],
  ["11:30", "11:30 AM"],
  ["12:00", "Noon"],
  ["12:30", "12:30 PM"],
  ["13:00", "1:00 PM"],
  ["13:30", "1:30 PM"],
  ["14:00", "2:00 PM"],
  ["14:30", "2:30 PM"],
  ["15:00", "3:00 PM"],
  ["15:30", "3:30 PM"],
  ["16:00", "4:00 PM"],
  ["16:30", "4:30 PM"],
  ["17:00", "5:00 PM"],
  ["17:30", "5:30 PM"],
  ["18:00", "6:00 PM"],
  ["18:30", "6:30 PM"],
  ["19:00", "7:00 PM"],
  ["19:30", "7:30 PM"],
  ["20:00", "8:00 PM"],
  ["20:30", "8:30 PM"],
  ["21:00", "9:00 PM"],
  ["21:30", "9:30 PM"],
  ["22:00", "10:00 PM"],
  ["22:30", "10:30 PM"],
  ["23:00", "11:00 PM"],
  ["23:30", "11:30 PM"]
];

export const countryList = [
  { name: "Afghanistan", code: "AF" },
  { name: "land Islands", code: "AX" },
  { name: "Albania", code: "AL" },
  { name: "Algeria", code: "DZ" },
  { name: "American Samoa", code: "AS" },
  { name: "AndorrA", code: "AD" },
  { name: "Angola", code: "AO" },
  { name: "Anguilla", code: "AI" },
  { name: "Antarctica", code: "AQ" },
  { name: "Antigua and Barbuda", code: "AG" },
  { name: "Argentina", code: "AR" },
  { name: "Armenia", code: "AM" },
  { name: "Aruba", code: "AW" },
  { name: "Australia", code: "AU" },
  { name: "Austria", code: "AT" },
  { name: "Azerbaijan", code: "AZ" },
  { name: "Bahamas", code: "BS" },
  { name: "Bahrain", code: "BH" },
  { name: "Bangladesh", code: "BD" },
  { name: "Barbados", code: "BB" },
  { name: "Belarus", code: "BY" },
  { name: "Belgium", code: "BE" },
  { name: "Belize", code: "BZ" },
  { name: "Benin", code: "BJ" },
  { name: "Bermuda", code: "BM" },
  { name: "Bhutan", code: "BT" },
  { name: "Bolivia", code: "BO" },
  { name: "Bosnia and Herzegovina", code: "BA" },
  { name: "Botswana", code: "BW" },
  { name: "Bouvet Island", code: "BV" },
  { name: "Brazil", code: "BR" },
  { name: "British Indian Ocean Territory", code: "IO" },
  { name: "Brunei Darussalam", code: "BN" },
  { name: "Bulgaria", code: "BG" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Burundi", code: "BI" },
  { name: "Cambodia", code: "KH" },
  { name: "Cameroon", code: "CM" },
  { name: "Canada", code: "CA" },
  { name: "Cape Verde", code: "CV" },
  { name: "Cayman Islands", code: "KY" },
  { name: "Central African Republic", code: "CF" },
  { name: "Chad", code: "TD" },
  { name: "Chile", code: "CL" },
  { name: "China", code: "CN" },
  { name: "Christmas Island", code: "CX" },
  { name: "Cocos (Keeling) Islands", code: "CC" },
  { name: "Colombia", code: "CO" },
  { name: "Comoros", code: "KM" },
  { name: "Congo", code: "CG" },
  { name: "Congo, The Democratic Republic of the", code: "CD" },
  { name: "Cook Islands", code: "CK" },
  { name: "Costa Rica", code: "CR" },
  { name: "Cote D'Ivoire", code: "CI" },
  { name: "Croatia", code: "HR" },
  { name: "Cuba", code: "CU" },
  { name: "Cyprus", code: "CY" },
  { name: "Czech Republic", code: "CZ" },
  { name: "Denmark", code: "DK" },
  { name: "Djibouti", code: "DJ" },
  { name: "Dominica", code: "DM" },
  { name: "Dominican Republic", code: "DO" },
  { name: "Ecuador", code: "EC" },
  { name: "Egypt", code: "EG" },
  { name: "El Salvador", code: "SV" },
  { name: "Equatorial Guinea", code: "GQ" },
  { name: "Eritrea", code: "ER" },
  { name: "Estonia", code: "EE" },
  { name: "Ethiopia", code: "ET" },
  { name: "Falkland Islands (Malvinas)", code: "FK" },
  { name: "Faroe Islands", code: "FO" },
  { name: "Fiji", code: "FJ" },
  { name: "Finland", code: "FI" },
  { name: "France", code: "FR" },
  { name: "French Guiana", code: "GF" },
  { name: "French Polynesia", code: "PF" },
  { name: "French Southern Territories", code: "TF" },
  { name: "Gabon", code: "GA" },
  { name: "Gambia", code: "GM" },
  { name: "Georgia", code: "GE" },
  { name: "Germany", code: "DE" },
  { name: "Ghana", code: "GH" },
  { name: "Gibraltar", code: "GI" },
  { name: "Greece", code: "GR" },
  { name: "Greenland", code: "GL" },
  { name: "Grenada", code: "GD" },
  { name: "Guadeloupe", code: "GP" },
  { name: "Guam", code: "GU" },
  { name: "Guatemala", code: "GT" },
  { name: "Guernsey", code: "GG" },
  { name: "Guinea", code: "GN" },
  { name: "Guinea-Bissau", code: "GW" },
  { name: "Guyana", code: "GY" },
  { name: "Haiti", code: "HT" },
  { name: "Heard Island and Mcdonald Islands", code: "HM" },
  { name: "Holy See (Vatican City State)", code: "VA" },
  { name: "Honduras", code: "HN" },
  { name: "Hong Kong", code: "HK" },
  { name: "Hungary", code: "HU" },
  { name: "Iceland", code: "IS" },
  { name: "India", code: "IN" },
  { name: "Indonesia", code: "ID" },
  { name: "Iran, Islamic Republic Of", code: "IR" },
  { name: "Iraq", code: "IQ" },
  { name: "Ireland", code: "IE" },
  { name: "Isle of Man", code: "IM" },
  { name: "Israel", code: "IL" },
  { name: "Italy", code: "IT" },
  { name: "Jamaica", code: "JM" },
  { name: "Japan", code: "JP" },
  { name: "Jersey", code: "JE" },
  { name: "Jordan", code: "JO" },
  { name: "Kazakhstan", code: "KZ" },
  { name: "Kenya", code: "KE" },
  { name: "Kiribati", code: "KI" },
  { name: "Korea, Democratic People'S Republic of", code: "KP" },
  { name: "Korea, Republic of", code: "KR" },
  { name: "Kuwait", code: "KW" },
  { name: "Kyrgyzstan", code: "KG" },
  { name: "Lao People'S Democratic Republic", code: "LA" },
  { name: "Latvia", code: "LV" },
  { name: "Lebanon", code: "LB" },
  { name: "Lesotho", code: "LS" },
  { name: "Liberia", code: "LR" },
  { name: "Libyan Arab Jamahiriya", code: "LY" },
  { name: "Liechtenstein", code: "LI" },
  { name: "Lithuania", code: "LT" },
  { name: "Luxembourg", code: "LU" },
  { name: "Macao", code: "MO" },
  { name: "Macedonia, The Former Yugoslav Republic of", code: "MK" },
  { name: "Madagascar", code: "MG" },
  { name: "Malawi", code: "MW" },
  { name: "Malaysia", code: "MY" },
  { name: "Maldives", code: "MV" },
  { name: "Mali", code: "ML" },
  { name: "Malta", code: "MT" },
  { name: "Marshall Islands", code: "MH" },
  { name: "Martinique", code: "MQ" },
  { name: "Mauritania", code: "MR" },
  { name: "Mauritius", code: "MU" },
  { name: "Mayotte", code: "YT" },
  { name: "Mexico", code: "MX" },
  { name: "Micronesia, Federated States of", code: "FM" },
  { name: "Moldova, Republic of", code: "MD" },
  { name: "Monaco", code: "MC" },
  { name: "Mongolia", code: "MN" },
  { name: "Montenegro", code: "ME" },
  { name: "Montserrat", code: "MS" },
  { name: "Morocco", code: "MA" },
  { name: "Mozambique", code: "MZ" },
  { name: "Myanmar", code: "MM" },
  { name: "Namibia", code: "NA" },
  { name: "Nauru", code: "NR" },
  { name: "Nepal", code: "NP" },
  { name: "Netherlands", code: "NL" },
  { name: "Netherlands Antilles", code: "AN" },
  { name: "New Caledonia", code: "NC" },
  { name: "New Zealand", code: "NZ" },
  { name: "Nicaragua", code: "NI" },
  { name: "Niger", code: "NE" },
  { name: "Nigeria", code: "NG" },
  { name: "Niue", code: "NU" },
  { name: "Norfolk Island", code: "NF" },
  { name: "Northern Mariana Islands", code: "MP" },
  { name: "Norway", code: "NO" },
  { name: "Oman", code: "OM" },
  { name: "Pakistan", code: "PK" },
  { name: "Palau", code: "PW" },
  { name: "Palestinian Territory, Occupied", code: "PS" },
  { name: "Panama", code: "PA" },
  { name: "Papua New Guinea", code: "PG" },
  { name: "Paraguay", code: "PY" },
  { name: "Peru", code: "PE" },
  { name: "Philippines", code: "PH" },
  { name: "Pitcairn", code: "PN" },
  { name: "Poland", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "Puerto Rico", code: "PR" },
  { name: "Qatar", code: "QA" },
  { name: "Reunion", code: "RE" },
  { name: "Romania", code: "RO" },
  { name: "Russian Federation", code: "RU" },
  { name: "RWANDA", code: "RW" },
  { name: "Saint Helena", code: "SH" },
  { name: "Saint Kitts and Nevis", code: "KN" },
  { name: "Saint Lucia", code: "LC" },
  { name: "Saint Pierre and Miquelon", code: "PM" },
  { name: "Saint Vincent and the Grenadines", code: "VC" },
  { name: "Samoa", code: "WS" },
  { name: "San Marino", code: "SM" },
  { name: "Sao Tome and Principe", code: "ST" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Senegal", code: "SN" },
  { name: "Serbia", code: "RS" },
  { name: "Seychelles", code: "SC" },
  { name: "Sierra Leone", code: "SL" },
  { name: "Singapore", code: "SG" },
  { name: "Slovakia", code: "SK" },
  { name: "Slovenia", code: "SI" },
  { name: "Solomon Islands", code: "SB" },
  { name: "Somalia", code: "SO" },
  { name: "South Africa", code: "ZA" },
  { name: "South Georgia and the South Sandwich Islands", code: "GS" },
  { name: "Spain", code: "ES" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Sudan", code: "SD" },
  { name: "Suriname", code: "SR" },
  { name: "Svalbard and Jan Mayen", code: "SJ" },
  { name: "Swaziland", code: "SZ" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Syrian Arab Republic", code: "SY" },
  { name: "Taiwan, Province of China", code: "TW" },
  { name: "Tajikistan", code: "TJ" },
  { name: "Tanzania, United Republic of", code: "TZ" },
  { name: "Thailand", code: "TH" },
  { name: "Timor-Leste", code: "TL" },
  { name: "Togo", code: "TG" },
  { name: "Tokelau", code: "TK" },
  { name: "Tonga", code: "TO" },
  { name: "Trinidad and Tobago", code: "TT" },
  { name: "Tunisia", code: "TN" },
  { name: "Turkey", code: "TR" },
  { name: "Turkmenistan", code: "TM" },
  { name: "Turks and Caicos Islands", code: "TC" },
  { name: "Tuvalu", code: "TV" },
  { name: "Uganda", code: "UG" },
  { name: "Ukraine", code: "UA" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "United Kingdom", code: "GB" },
  { name: "United States", code: "US" },
  { name: "United States Minor Outlying Islands", code: "UM" },
  { name: "Uruguay", code: "UY" },
  { name: "Uzbekistan", code: "UZ" },
  { name: "Vanuatu", code: "VU" },
  { name: "Venezuela", code: "VE" },
  { name: "Viet Nam", code: "VN" },
  { name: "Virgin Islands, British", code: "VG" },
  { name: "Virgin Islands, U.S.", code: "VI" },
  { name: "Wallis and Futuna", code: "WF" },
  { name: "Western Sahara", code: "EH" },
  { name: "Yemen", code: "YE" },
  { name: "Zambia", code: "ZM" },
  { name: "Zimbabwe", code: "ZW" }
];

// export const REACT_APP_API_URL = 'http://staging-be.rydecars.com/api/'
// export const REACT_APP_API_URL_AUTH = 'http://staging-be.rydecars.com/'

// export const API_URL = 'https://be.rydecars.com/api/'
// export const API_URL_AUTH = 'https://be.rydecars.com/'

// export const REACT_APP_API_URL = 'http://localhost/api/'
// export const REACT_APP_API_URL_AUTH = 'http://localhost/'

// export const REACT_APP_API_URL = 'http://localhost:8888/ryde-api/public/api/'
// export const REACT_APP_API_URL_AUTH = 'http://localhost:8888/ryde-api/public/'

// // STAGING
// export const CLIENT_ID = 2
// export const CLIENT_SECRET = "OBW5nPA7oqTL78J4BgOYZgfh5XG8Nc6SYHZOxMng"

// // PRODUCTION
// export const CLIENT_ID = 4
// export const CLIENT_SECRET = 'ccpAYpKhqM2AWieKNwpspcpZfzAqMZronxCk512C'

export const bucketUrl =
  "https://s3-us-west-2.amazonaws.com/ryde-bucket-oregon/";

export const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9
  },
  content: {
    border: "0",
    borderRadius: "4px",
    bottom: "auto",
    minHeight: "10rem",
    left: "50%",
    padding: "2rem",
    position: "fixed",
    right: "auto",
    top: "50%",
    transform: "translate(-50%,-50%)",
    minWidth: "20rem",
    width: "80%",
    maxWidth: "60rem",
    background: "#fff",
    WebkitOverflowScrolling: "touch",
    maxHeight: "100%",
    overflow: "auto"
  }
};

export const modalStylesBooking = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9
  },
  content: {
    border: "0px",
    borderRadius: "4px",
    bottom: "auto",
    minHeight: "10rem",
    left: "50%",
    padding: "2rem",
    position: "absolute",
    right: "auto",
    top: "50%",
    transform: "translate(-50%, -50%)",
    minWidth: "20rem",
    width: "80%",
    maxWidth: "60rem",
    overflow: "visible"
  }
};

export const modalStylesBookingLarge = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9
  },
  content: {
    position: "absolute",
    top: "100px",
    width: "70%",
    height: "auto",
    margin: "0 auto",
    border: "1px solid #ccc",
    background: "#fff",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "4px",
    outline: "none",
    padding: "20px",
    zIndex: "10"
  }
};

export const modalStylesBookingReciptLarge = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9
  },
  content: {
    position: "absolute",
    top: "100px",
    width: "50%",
    height: "auto",
    margin: "0 auto",
    border: "1px solid #ccc",
    background: "#fff",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    borderRadius: "4px",
    outline: "none",
    padding: "20px",
    zIndex: "10"
  }
};

export const modalChangeTrip = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9,
    overflow: "scroll"
  },
  // content: {
  // 	border: '0px',
  // 	borderRadius: '10px',
  // 	bottom: 'auto',
  // 	minHeight: '10rem',
  // 	left: '50%',
  // 	padding: '0',
  // 	position: 'absolute',
  // 	right: 'auto',
  // 	top: '50%',
  // 	transform: 'translate(-50%, -50%)',
  // 	minWidth: '20rem',
  // 	width: '100%',
  // 	maxWidth: '90rem',
  // 	overflow: 'visible'
  // },
  content: {
    border: "0px",
    borderRadius: "6px",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    height: "auto",
    padding: "0",
    position: "absolute",
    // transform: 'translate(-50%, -50%)',
    minWidth: "20rem",
    width: "100%",
    maxWidth: "90rem",
    overflow: "scroll",
    margin: "auto"
  }
};

export const defaultModel = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9,
    overflow: "scroll"
  },
  content: {
    left: 0,
    right: 0,
    border: "0px",
    borderRadius: "6px",
    padding: "0",
    position: "relative",
    width: "auto",
    // transform: 'translate(-50%, -50%)',
    minWidth: "20rem",
    //width: '100%',
    maxWidth: "50rem",
    overflow: "hidden",
    margin: "auto"
  }
};

export const loginModel = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9,
    overflow: "scroll"
  },
  content: {
    left: 0,
    right: 0,
    border: "0px",
    borderRadius: "6px",
    padding: "0",
    position: "relative",
    width: "auto",
    // transform: 'translate(-50%, -50%)',
    minWidth: "20rem",
    //width: '100%',
    maxWidth: "60rem",
    padding: "2rem",
    overflow: "scroll",
    margin: "auto"
  }
};

export const smallModel = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9
  },
  content: {
    width: "500px",
    left: 0,
    right: 0,
    top: "35%",
    overlfow: "scroll",
    marginLeft: "auto",
    marginRight: "auto",
    position: "relative",
    padding: 25
  }
};

export const tripChangeModel = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9
  },
  content: {
    width: "800px",
    left: 0,
    right: 0,
    //overlfow: 'scroll',
    marginLeft: "auto",
    marginRight: "auto",
    position: "relative",
    padding: 25
  }
};

export const imageModel = {
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9
  },
  content: {
    border: "0",
    borderRadius: "4px",
    bottom: "auto",
    minHeight: "10rem",
    left: "50%",
    padding: "0",
    position: "fixed",
    right: "auto",
    top: "50%",
    transform: "translate(-50%,-50%)",
    minWidth: "30rem",
    width: "100%",
    maxWidth: "80rem"
  }
};

{
  /* Auto width modal */
}
export const defaultModelPopup = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9
    // transition:  'opacity 250ms',
    // opacity:  1,
  },
  content: {
    position: "fixed",
    top: "50%",
    bottom: "auto",
    left: "50%",
    right: "auto",
    transform: "translate(-50%,-50%)",
    borderRadius: "8px",
    border: "0",
    padding: "0",
    minWidth: "450px",
    width: "auto",
    maxWidth: "100%"
  }
};

{
  /* Auto width modal for Mobile */
}
export const defaultMobileModelPopup = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9
  },
  content: {
    position: "fixed",
    top: "50%",
    bottom: "auto",
    left: "50%",
    right: "auto",
    transform: "translate(-50%,-50%)",
    borderRadius: "0",
    border: "0",
    padding: "0",
    minWidth: "100%",
    width: "100%",
    maxWidth: "100%",
    height: "100%"
  }
};

export const sharexModelPopup = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 9
    // transition:  'opacity 250ms',
    // opacity:  1,
  },
  content: {
    position: "fixed",
    top: "50%",
    bottom: "auto",
    left: "50%",
    right: "auto",
    transform: "translate(-50%,-50%)",
    borderRadius: "8px",
    border: "0",
    padding: "0",
    minWidth: "550px",
    width: "auto",
    maxWidth: "100%"
  }
};

export const TICKET_STATUS = [
  {
    key: 0,
    value: "Waiting for Review",
    icon_src: "/images/support-center/status_waiting_icon.svg"
  },
  {
    key: 2,
    value: "Under Review",
    icon_src: "/images/support-center/status_undereview_icon.svg"
  },
  {
    key: 1,
    value: "Resolved",
    icon_src: "/images/support-center/status_resolved_icon.svg"
  },
  {
    key: -1,
    value: "Withdrawn",
    icon_src: "/images/support-center/status_withdraw_icon.svg"
  }
  // {
  //   key: 3,
  //   value: "View All",
  // }
];

export const TICKET_TYPES = [
  {
    key: "general",
    value: "General",
    icon_src: "/images/support-center/gen-icon.svg"
  },
  {
    key: "urgent_matter",
    value: "Urgent",
    icon_src: "/images/support-center/urgent-icon.svg"
  },
  {
    key: "damage_report",
    value: "Damage",
    icon_src: "/images/support-center/damage-icon.svg"
  }
  // {
  //   key: "view_all",
  //   value: "View All",
  // }
];

export const PAYMENT_STATUS = [
  {
    key: "in_transit",
    value: "Pending",
    icon_src: "/images/support-center/status_waiting_icon.svg"
  },
  {
    key: "paid",
    value: "Paid",
    icon_src: "/images/support-center/status_undereview_icon.svg"
  },
  {
    key: "failed",
    value: "Reviewed",
    icon_src: "/images/support-center/status_withdraw_icon.svg"
  },
  {
    key: "canceled",
    value: "Canceled",
    icon_src: "/images/support-center/status_withdraw_icon.svg"
  }
];

export const BUCKET_OPTIONS = {
  keyPrefix: process.env.REACT_APP_S3_SUPPORTCENTER_KEY_PREFIX,
  bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
  region: process.env.REACT_APP_S3_REGION,
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
  successActionStatus: process.env.REACT_APP_S3_SUCCESS_ACTION_STATUS
};

export const OWLCAROSEL_RESPONSIVE_OPTIONS = {
  0: {
    items: 1,
    nav: true
  },
  480: {
    items: 2,
    nav: true
  },
  900: {
    items: 3,
    nav: true
  },
  1200: {
    items: 4,
    nav: true
  }
};

export const POPULAR_VEHICLE_BRANDS = [
  { id: 6, name: "BMW" },
  { id: 28, name: "JEEP" },
  { id: 46, name: "Porsche" },
  { id: 57, name: "Toyota" },
  { id: 32, name: "Lexus" },
  { id: 33, name: "Lincoln" },
  { id: 16, name: "Fiat" },
  { id: 18, name: "Ford" },
  { id: 5, name: "Audi" },
  { id: 39, name: "Mercedes" },
  { id: 61, name: "Land Rover" },
  { id: 10, name: "Chevorlet" },
  { id: 25, name: "Infiniti" },
  { id: 36, name: "Maserati" },
  { id: 56, name: "Tesla" },
  { id: 13, name: "Dodge" },
  { id: 35, name: "MINI" },
  { id: 62, name: "Aston Martin" },
  { id: 7, name: "Bentley" },
  { id: 9, name: "Cadillac" }
];

export const TRIP_IS_PENDING = 0;
export const TRIP_IS_PROCESSING = -2;
export const TRIP_IS_CONFIRM = 1;
export const TRIP_IS_CANCELED = -1;
export const TRIP_IS_ONTRIP = 2;
export const TRIP_IS_END = 3;

export const DOCUMENT_TYPES = [
  "pdf",
  "doc",
  "rtf",
  "tex",
  "txt",
  "wks",
  "wpd",
  "xls",
  "xlsx",
  "docx"
];

export const BANK_ACCOUNT_TYPES = [
  { id: "saving", value: "Savings" },
  { id: "checking", value: "Checking" },
  { id: "business_saving", value: "Business Savings" },
  { id: "business_checking", value: "Business Checking" }
];

export const PRODUCT_CATALOG_ID = process.env.REACT_APP_PRODUCT_CATALOG_ID;
