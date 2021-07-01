const TRANSFORMED_WIDTH = 640;

export const appName = "Diagon";

export const featureFlags = {
  stripe: true,
  payment: true,
  discount: true,
};

export const upload = {
  artwork: {
    fileSize: 10 * 1024 * 1024,
    fileDimensions: { height: 1200, width: 1200 },
    fileTransform: {
      width: TRANSFORMED_WIDTH,
      height: (fileHeight, fileWidth) =>
        fileHeight / (fileWidth / TRANSFORMED_WIDTH),
    },
    mimeTypes: ["image/jpg", "image/jpeg", "image/gif", "image/png"],
  },
  user: {
    fileSize: 5 * 1024 * 1024,
    fileDimensions: { height: 150, width: 150 },
    fileTransform: { width: 150 },
    mimeTypes: ["image/jpg", "image/jpeg", "image/png"],
  },
};

export const pricing = featureFlags.stripe
  ? {
      minimumPrice: 10,
      maximumPrice: 100000,
    }
  : {};

export const payment = featureFlags.stripe
  ? {
      appFee: 0.15,
      buyerFee: {
        multiplier: 0.05,
        addend: 2.35,
      },
    }
  : {};

export const errors = {
  ok: 200,
  created: 201,
  noContent: 204,
  tempRedirect: 307,
  permRedirect: 308,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  notAllowed: 405,
  conflict: 409,
  gone: 410,
  unprocessable: 422,
  tooManyRequests: 429,
  internalError: 500,
};

export const countries = [
  { text: "Afghanistan", value: "AF", supported: false },
  { text: "Åland Islands", value: "AX", supported: false },
  { text: "Albania", value: "AL", supported: false },
  { text: "Algeria", value: "DZ", supported: false },
  { text: "American Samoa", value: "AS", supported: false },
  { text: "AndorrA", value: "AD", supported: false },
  { text: "Angola", value: "AO", supported: false },
  { text: "Anguilla", value: "AI", supported: false },
  { text: "Antarctica", value: "AQ", supported: false },
  { text: "Antigua and Barbuda", value: "AG", supported: false },
  { text: "Argentina", value: "AR", supported: true },
  { text: "Armenia", value: "AM", supported: false },
  { text: "Aruba", value: "AW", supported: false },
  { text: "Australia", value: "AU", supported: true },
  { text: "Austria", value: "AT", supported: true },
  { text: "Azerbaijan", value: "AZ", supported: false },
  { text: "Bahamas", value: "BS", supported: false },
  { text: "Bahrain", value: "BH", supported: false },
  { text: "Bangladesh", value: "BD", supported: false },
  { text: "Barbados", value: "BB", supported: false },
  { text: "Belarus", value: "BY", supported: false },
  { text: "Belgium", value: "BE", supported: true },
  { text: "Belize", value: "BZ", supported: false },
  { text: "Benin", value: "BJ", supported: false },
  { text: "Bermuda", value: "BM", supported: false },
  { text: "Bhutan", value: "BT", supported: false },
  { text: "Bolivia", value: "BO", supported: true },
  { text: "Bosnia and Herzegovina", value: "BA", supported: false },
  { text: "Botswana", value: "BW", supported: false },
  { text: "Bouvet Island", value: "BV", supported: false },
  { text: "Brazil", value: "BR", supported: false },
  { text: "British Indian Ocean Territory", value: "IO", supported: false },
  { text: "Brunei Darussalam", value: "BN", supported: false },
  { text: "Bulgaria", value: "BG", supported: true },
  { text: "Burkina Faso", value: "BF", supported: false },
  { text: "Burundi", value: "BI", supported: false },
  { text: "Cambodia", value: "KH", supported: false },
  { text: "Cameroon", value: "CM", supported: false },
  { text: "Canada", value: "CA", supported: true },
  { text: "Cape Verde", value: "CV", supported: false },
  { text: "Cayman Islands", value: "KY", supported: false },
  { text: "Central African Republic", value: "CF", supported: false },
  { text: "Chad", value: "TD", supported: false },
  { text: "Chile", value: "CL", supported: false },
  { text: "China", value: "CN", supported: false },
  { text: "Christmas Island", value: "CX", supported: false },
  { text: "Cocos (Keeling) Islands", value: "CC", supported: false },
  { text: "Colombia", value: "CO", supported: false },
  { text: "Comoros", value: "KM", supported: false },
  { text: "Congo", value: "CG", supported: false },
  {
    text: "Congo, The Democratic Republic of the",
    value: "CD",
    supported: false,
  },
  { text: "Cook Islands", value: "CK", supported: false },
  { text: "Costa Rica", value: "CR", supported: false },
  { text: "Cote D'Ivoire", value: "CI", supported: false },
  { text: "Croatia", value: "HR", supported: true },
  { text: "Cuba", value: "CU", supported: false },
  { text: "Cyprus", value: "CY", supported: true },
  { text: "Czech Republic", value: "CZ", supported: true },
  { text: "Denmark", value: "DK", supported: true },
  { text: "Djibouti", value: "DJ", supported: false },
  { text: "Dominica", value: "DM", supported: false },
  { text: "Dominican Republic", value: "DO", supported: true },
  { text: "Ecuador", value: "EC", supported: false },
  { text: "Egypt", value: "EG", supported: false },
  { text: "El Salvador", value: "SV", supported: false },
  { text: "Equatorial Guinea", value: "GQ", supported: false },
  { text: "Eritrea", value: "ER", supported: false },
  { text: "Estonia", value: "EE", supported: true },
  { text: "Ethiopia", value: "ET", supported: false },
  { text: "Falkland Islands (Malvinas)", value: "FK", supported: false },
  { text: "Faroe Islands", value: "FO", supported: false },
  { text: "Fiji", value: "FJ", supported: false },
  { text: "Finland", value: "FI", supported: true },
  { text: "France", value: "FR", supported: true },
  { text: "French Guiana", value: "GF", supported: false },
  { text: "French Polynesia", value: "PF", supported: false },
  { text: "French Southern Territories", value: "TF", supported: false },
  { text: "Gabon", value: "GA", supported: false },
  { text: "Gambia", value: "GM", supported: false },
  { text: "Georgia", value: "GE", supported: false },
  { text: "Germany", value: "DE", supported: true },
  { text: "Ghana", value: "GH", supported: false },
  { text: "Gibraltar", value: "GI", supported: false },
  { text: "Greece", value: "GR", supported: true },
  { text: "Greenland", value: "GL", supported: false },
  { text: "Grenada", value: "GD", supported: false },
  { text: "Guadeloupe", value: "GP", supported: false },
  { text: "Guam", value: "GU", supported: false },
  { text: "Guatemala", value: "GT", supported: false },
  { text: "Guernsey", value: "GG", supported: false },
  { text: "Guinea", value: "GN", supported: false },
  { text: "Guinea-Bissau", value: "GW", supported: false },
  { text: "Guyana", value: "GY", supported: false },
  { text: "Haiti", value: "HT", supported: false },
  { text: "Heard Island and Mcdonald Islands", value: "HM", supported: false },
  { text: "Holy See (Vatican City State)", value: "VA", supported: false },
  { text: "Honduras", value: "HN", supported: false },
  { text: "Hong Kong", value: "HK", supported: true },
  { text: "Hungary", value: "HU", supported: true },
  { text: "Iceland", value: "IS", supported: true },
  { text: "India", value: "IN", supported: true },
  { text: "Indonesia", value: "ID", supported: true },
  { text: "Iran, Islamic Republic Of", value: "IR", supported: false },
  { text: "Iraq", value: "IQ", supported: false },
  { text: "Ireland", value: "IE", supported: true },
  { text: "Isle of Man", value: "IM", supported: false },
  { text: "Israel", value: "IL", supported: true },
  { text: "Italy", value: "IT", supported: true },
  { text: "Jamaica", value: "JM", supported: false },
  { text: "Japan", value: "JP", supported: false },
  { text: "Jersey", value: "JE", supported: false },
  { text: "Jordan", value: "JO", supported: false },
  { text: "Kazakhstan", value: "KZ", supported: false },
  { text: "Kenya", value: "KE", supported: false },
  { text: "Kiribati", value: "KI", supported: false },
  {
    text: "Korea, Democratic People'S Republic of",
    value: "KP",
    supported: false,
  },
  { text: "Korea, Republic of", value: "KR", supported: false },
  { text: "Kuwait", value: "KW", supported: false },
  { text: "Kyrgyzstan", value: "KG", supported: false },
  { text: "Lao People'S Democratic Republic", value: "LA", supported: false },
  { text: "Latvia", value: "LV", supported: true },
  { text: "Lebanon", value: "LB", supported: false },
  { text: "Lesotho", value: "LS", supported: false },
  { text: "Liberia", value: "LR", supported: false },
  { text: "Libyan Arab Jamahiriya", value: "LY", supported: false },
  { text: "Liechtenstein", value: "LI", supported: true },
  { text: "Lithuania", value: "LT", supported: true },
  { text: "Luxembourg", value: "LU", supported: true },
  { text: "Macao", value: "MO", supported: false },
  {
    text: "Macedonia, The Former Yugoslav Republic of",
    value: "MK",
    supported: false,
  },
  { text: "Madagascar", value: "MG", supported: false },
  { text: "Malawi", value: "MW", supported: false },
  { text: "Malaysia", value: "MY", supported: false },
  { text: "Maldives", value: "MV", supported: false },
  { text: "Mali", value: "ML", supported: false },
  { text: "Malta", value: "MT", supported: true },
  { text: "Marshall Islands", value: "MH", supported: false },
  { text: "Martinique", value: "MQ", supported: false },
  { text: "Mauritania", value: "MR", supported: false },
  { text: "Mauritius", value: "MU", supported: false },
  { text: "Mayotte", value: "YT", supported: false },
  { text: "Mexico", value: "MX", supported: true },
  { text: "Micronesia, Federated States of", value: "FM", supported: false },
  { text: "Moldova, Republic of", value: "MD", supported: false },
  { text: "Monaco", value: "MC", supported: false },
  { text: "Mongolia", value: "MN", supported: false },
  { text: "Montserrat", value: "MS", supported: false },
  { text: "Morocco", value: "MA", supported: false },
  { text: "Mozambique", value: "MZ", supported: false },
  { text: "Myanmar", value: "MM", supported: false },
  { text: "Namibia", value: "NA", supported: false },
  { text: "Nauru", value: "NR", supported: false },
  { text: "Nepal", value: "NP", supported: false },
  { text: "Netherlands", value: "NL", supported: true },
  { text: "Netherlands Antilles", value: "AN", supported: false },
  { text: "New Caledonia", value: "NC", supported: false },
  { text: "New Zealand", value: "NZ", supported: true },
  { text: "Nicaragua", value: "NI", supported: false },
  { text: "Niger", value: "NE", supported: false },
  { text: "Nigeria", value: "NG", supported: false },
  { text: "Niue", value: "NU", supported: false },
  { text: "Norfolk Island", value: "NF", supported: false },
  { text: "Northern Mariana Islands", value: "MP", supported: false },
  { text: "Norway", value: "NO", supported: true },
  { text: "Oman", value: "OM", supported: false },
  { text: "Pakistan", value: "PK", supported: false },
  { text: "Palau", value: "PW", supported: false },
  { text: "Palestinian Territory, Occupied", value: "PS", supported: false },
  { text: "Panama", value: "PA", supported: false },
  { text: "Papua New Guinea", value: "PG", supported: false },
  { text: "Paraguay", value: "PY", supported: false },
  { text: "Peru", value: "PE", supported: true },
  { text: "Philippines", value: "PH", supported: false },
  { text: "Pitcairn", value: "PN", supported: false },
  { text: "Poland", value: "PL", supported: true },
  { text: "Portugal", value: "PT", supported: true },
  { text: "Puerto Rico", value: "PR", supported: false },
  { text: "Qatar", value: "QA", supported: false },
  { text: "Reunion", value: "RE", supported: false },
  { text: "Romania", value: "RO", supported: true },
  { text: "Russian Federation", value: "RU", supported: false },
  { text: "RWANDA", value: "RW", supported: false },
  { text: "Saint Helena", value: "SH", supported: false },
  { text: "Saint Kitts and Nevis", value: "KN", supported: false },
  { text: "Saint Lucia", value: "LC", supported: false },
  { text: "Saint Pierre and Miquelon", value: "PM", supported: false },
  { text: "Saint Vincent and the Grenadines", value: "VC", supported: false },
  { text: "Samoa", value: "WS", supported: false },
  { text: "San Marino", value: "SM", supported: false },
  { text: "Sao Tome and Principe", value: "ST", supported: false },
  { text: "Saudi Arabia", value: "SA", supported: false },
  { text: "Senegal", value: "SN", supported: false },
  { text: "Serbia and Montenegro", value: "CS", supported: false },
  { text: "Seychelles", value: "SC", supported: false },
  { text: "Sierra Leone", value: "SL", supported: false },
  { text: "Singapore", value: "SG", supported: true },
  { text: "Slovakia", value: "SK", supported: true },
  { text: "Slovenia", value: "SI", supported: true },
  { text: "Solomon Islands", value: "SB", supported: false },
  { text: "Somalia", value: "SO", supported: false },
  { text: "South Africa", value: "ZA", supported: false },
  {
    text: "South Georgia and the South Sandwich Islands",
    value: "GS",
    supported: false,
  },
  { text: "Spain", value: "ES", supported: true },
  { text: "Sri Lanka", value: "LK", supported: false },
  { text: "Sudan", value: "SD", supported: false },
  { text: "Suriname", value: "SR", supported: false },
  { text: "Svalbard and Jan Mayen", value: "SJ", supported: false },
  { text: "Swaziland", value: "SZ", supported: false },
  { text: "Sweden", value: "SE", supported: true },
  { text: "Switzerland", value: "CH", supported: true },
  { text: "Syrian Arab Republic", value: "SY", supported: false },
  { text: "Taiwan, Province of China", value: "TW", supported: false },
  { text: "Tajikistan", value: "TJ", supported: false },
  { text: "Tanzania, United Republic of", value: "TZ", supported: false },
  { text: "Thailand", value: "TH", supported: true },
  { text: "Timor-Leste", value: "TL", supported: false },
  { text: "Togo", value: "TG", supported: false },
  { text: "Tokelau", value: "TK", supported: false },
  { text: "Tonga", value: "TO", supported: false },
  { text: "Trinidad and Tobago", value: "TT", supported: true },
  { text: "Tunisia", value: "TN", supported: false },
  { text: "Turkey", value: "TR", supported: false },
  { text: "Turkmenistan", value: "TM", supported: false },
  { text: "Turks and Caicos Islands", value: "TC", supported: false },
  { text: "Tuvalu", value: "TV", supported: false },
  { text: "Uganda", value: "UG", supported: false },
  { text: "Ukraine", value: "UA", supported: false },
  { text: "United Arab Emirates", value: "AE", supported: false },
  { text: "United Kingdom", value: "GB", supported: true },
  { text: "United States", value: "US", supported: true },
  {
    text: "United States Minor Outlying Islands",
    value: "UM",
    supported: false,
  },
  { text: "Uruguay", value: "UY", supported: true },
  { text: "Uzbekistan", value: "UZ", supported: false },
  { text: "Vanuatu", value: "VU", supported: false },
  { text: "Venezuela", value: "VE", supported: false },
  { text: "Viet Nam", value: "VN", supported: false },
  { text: "Virgin Islands, British", value: "VG", supported: false },
  { text: "Virgin Islands, U.S.", value: "VI", supported: false },
  { text: "Wallis and Futuna", value: "WF", supported: false },
  { text: "Western Sahara", value: "EH", supported: false },
  { text: "Yemen", value: "YE", supported: false },
  { text: "Zambia", value: "ZM", supported: false },
  { text: "Zimbabwe", value: "ZW", supported: false },
];
