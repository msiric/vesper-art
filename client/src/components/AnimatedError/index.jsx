import React from "react";
import animatedErrorStyles from "./styles";

const AnimatedError = ({ styles }) => {
  const classes = animatedErrorStyles();

  return (
    <div className={`${classes.error} ${styles}`}>
      <svg
        className={classes.icon}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 90.27 90.27"
      >
        <circle className={classes.circle} cx="45.14" cy="45.14" r="45.14" />
        <g>
          <rect
            className={classes.line}
            x="21.77"
            y="43.49"
            width="46.74"
            height="3.36"
            transform="translate(-18.72 45.15) rotate(-45)"
          />
          <rect
            className={classes.line}
            x="43.47"
            y="21.81"
            width="3.36"
            height="46.74"
            transform="translate(-18.72 45.16) rotate(-45)"
          />
        </g>
      </svg>
    </div>
  );
};

export default AnimatedError;
