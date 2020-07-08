import React from "react";

const ProductsTable = ({ text }) => {
  return (
    <Typography className="hidden sm:flex mx-0 sm:mx-12" variant="h6">
      {text}
    </Typography>
  );
};

export default ProductsTable;
