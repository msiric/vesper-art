export const breakpointsFullWidth = {
  default: 5,
  1300: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export const breakpointsFixedWidth = {
  default: 4,
  1200: 3,
  800: 2,
  600: 1,
};

export const datatableRowsPerPage = 10;

export const socialLinks = {
  facebook: "https://www.facebook.com/vesperartco/",
  instagram: "https://www.instagram.com/vesperartco/",
  twitter: "https://twitter.com/vesperartco/",
  reddit: "https://www.reddit.com/r/vesperart/",
};

// $TODO Set node_env to production appropriately when deploying
export const stripePublishableKey =
  process.env.NODE_ENV === "production"
    ? ""
    : "pk_test_xi0qpLTPs3WI8YPUfTyeeyzt00tNwou20z";
