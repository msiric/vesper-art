import React from "react";
import animatedSuccessStyles from "./styles";

const AnimatedSuccess = (props) => {
  const classes = animatedSuccessStyles();

  return (
    <div className={classes.success} {...props}>
      <svg
        className={classes.icon}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 90.27 90.27"
      >
        <circle className={classes.circle} cx="45.14" cy="45.14" r="45.14" />
        <polyline
          className={classes.check}
          points="63.4 28.8 37.93 63.47 24.87 50.52"
        />
      </svg>
    </div>
  );
};

export default AnimatedSuccess;
