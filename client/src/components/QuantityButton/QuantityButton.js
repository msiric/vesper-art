import React from 'react';
import { Button, ButtonGroup, IconButton } from '@material-ui/core';
import {
  AddRounded as PlusIcon,
  RemoveRounded as MinusIcon,
} from '@material-ui/icons';

const QuantityButton = ({ quantity, handleIncrement, handleDecrement }) => {
  return (
    <ButtonGroup size="small" aria-label="Quantity">
      <Button onClick={handleIncrement}>
        <PlusIcon />
      </Button>
      <Button style={{ border: '1px solid rgba(0, 0, 0, 0.23)' }} disabled>
        {quantity}
      </Button>
      <Button onClick={handleDecrement}>
        <MinusIcon />
      </Button>
    </ButtonGroup>
  );
};

export default QuantityButton;
