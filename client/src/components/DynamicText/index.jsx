import SyncButton from "@components/SyncButton";
import Box from "@domain/Box";
import Typography from "@domain/Typography";
import React, { useEffect, useState } from "react";
import dynamicTextStyles from "./styles";

const MAX_LINES = 30;
const MAX_HEIGHT = 170;

const DynamicText = ({
  children,
  loading,
  maxLines = MAX_LINES,
  maxHeight = MAX_HEIGHT,
  ...props
}) => {
  const [state, setState] = useState({
    allowedHeight: maxHeight,
    isExpanded: false,
    isOverflow: false,
  });

  const classes = dynamicTextStyles({ loading, height: state.allowedHeight });

  useEffect(() => {
    const lines = children.split("\n").length;
    if (lines > maxLines) {
      setState((prevState) => ({ ...prevState, isOverflow: true }));
    }
  }, [maxHeight, maxLines, children]);

  const handleClick = () => {
    setState((prevState) => ({
      ...prevState,
      allowedHeight: prevState.isExpanded ? maxHeight : "100%",
      isExpanded: !prevState.isExpanded,
    }));
  };

  return (
    <Box
      className={`${classes.wrapper} ${
        state.isOverflow && !state.isExpanded && classes.restricted
      } ${state.isOverflow && classes.overflow}`}
    >
      <Typography loading={loading} {...props}>
        {children}
      </Typography>
      {state.isOverflow && (
        <SyncButton
          onClick={handleClick}
          variant="text"
          size="small"
          color={state.isExpanded ? "primary" : "secondary"}
        >
          {state.isExpanded ? "Show Less" : "Show More"}
        </SyncButton>
      )}
    </Box>
  );
};

export default DynamicText;
