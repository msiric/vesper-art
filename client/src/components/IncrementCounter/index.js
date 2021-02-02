import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import incrementCounterStyles from "./styles";

const IncrementCounter = ({ newValue = 0 }) => {
  const [value, setValue] = useState(newValue);
  const [animationValue, setAnimationValue] = useState("initial");

  const classes = incrementCounterStyles();

  const handleInitialization = () => {
    setAnimationValue("hide");
    setTimeout(() => setAnimationValue("waitDown"), 70);
    setTimeout(() => setAnimationValue("initial"), 150);
  };

  const handleIncrement = () => {
    setTimeout(() => setAnimationValue("goUp"), 0);
    setTimeout(() => setValue(value + 1), 100);
    setTimeout(() => setAnimationValue("waitDown"), 100);
    setTimeout(() => setAnimationValue("initial"), 200);
  };

  const handleDecrement = () => {
    setTimeout(() => setAnimationValue("waitDown"), 0);
    setTimeout(() => setValue(value - 1), 100);
    setTimeout(() => setAnimationValue("goUp"), 100);
    setTimeout(() => setAnimationValue("initial"), 200);
  };

  useEffect(() => {
    handleInitialization();
  }, []);

  useEffect(() => {
    if (newValue < value) handleDecrement();
    if (newValue > value) handleIncrement();
  }, [newValue]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <span className={classes[animationValue]}>
          <Typography style={{ fontSize: 34 }}>{value}</Typography>
        </span>
      </div>
    </div>
  );
};

export default IncrementCounter;
