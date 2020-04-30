import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import StripeInputStyles from './StripeInput.style';

const StripeInput = ({ component: Component, onFocus, onBlur, onChange }) => {
  const classes = StripeInputStyles();
  const theme = useTheme();

  return (
    <Component
      className={classes.root}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
      placeholder=""
      style={{
        base: {
          fontSize: `${theme.typography.fontSize}px`,
          fontFamily: theme.typography.fontFamily,
          color: '#000000de',
        },
      }}
    />
  );
};

export default StripeInput;
