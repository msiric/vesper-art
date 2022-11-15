import abbreviate from "number-abbreviate";
import React, { useEffect, useState } from "react";
import Typography from "../../domain/Typography";
import incrementCounterStyles from "./styles";

const SIZE_OPTIONS = {
  small: 14,
  medium: 24,
  large: 34,
};

const WIDTH_OPTIONS = {
  small: 11,
  medium: 18,
  large: 25,
};

const IncrementCounter = ({ newValue = 0, size = "medium" }) => {
  const [value, setValue] = useState(newValue);
  const [animationValue, setAnimationValue] = useState("initial");

  const classes = incrementCounterStyles({
    fontSize: SIZE_OPTIONS[size],
    minWidth: WIDTH_OPTIONS[size],
  });

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
    if (newValue < value) handleDecrement();
    if (newValue > value) handleIncrement();
    if (newValue === value) handleInitialization();
  }, [newValue]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <span className={classes[animationValue]}>
          <Typography className={classes.value}>
            {abbreviate(value, 2)}
          </Typography>
        </span>
      </div>
    </div>
  );
};

export default IncrementCounter;
