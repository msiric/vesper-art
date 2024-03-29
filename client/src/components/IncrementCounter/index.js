import abbreviate from "number-abbreviate";
import React, { useCallback, useEffect, useState } from "react";
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

const IncrementCounter = ({ newValue = null, size = "medium" }) => {
  const [value, setValue] = useState(null);
  const [animationValue, setAnimationValue] = useState("initial");

  const classes = incrementCounterStyles({
    fontSize: SIZE_OPTIONS[size],
    minWidth: WIDTH_OPTIONS[size],
  });

  const handleIncrement = useCallback(() => {
    setTimeout(() => setAnimationValue("goUp"), 0);
    setTimeout(() => setValue(value + 1), 100);
    setTimeout(() => setAnimationValue("waitDown"), 100);
    setTimeout(() => setAnimationValue("initial"), 200);
  }, [value]);

  const handleDecrement = useCallback(() => {
    setTimeout(() => setAnimationValue("waitDown"), 0);
    setTimeout(() => setValue(value - 1), 100);
    setTimeout(() => setAnimationValue("goUp"), 100);
    setTimeout(() => setAnimationValue("initial"), 200);
  }, [value]);

  useEffect(() => {
    if (value === null && newValue !== null) setValue(newValue);
    else if (newValue < value) handleDecrement();
    else if (newValue > value) handleIncrement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newValue, value]);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <span className={classes[animationValue]}>
          <Typography className={classes.value}>
            {abbreviate(value ?? 0, 2)}
          </Typography>
        </span>
      </div>
    </div>
  );
};

export default IncrementCounter;
