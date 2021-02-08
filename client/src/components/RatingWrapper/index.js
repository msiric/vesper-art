import React from "react";
import RatingModal from "../../components/RatingModal/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useOrderDetails } from "../../contexts/local/orderDetails";

const RatingWrapper = ({paramId}) => {
  const userId = useUserStore((state) => state.id);

  const modal = useOrderDetails((state) => state.modal);
  const submitRating = useOrderDetails((state) => state.submitRating);
  const toggleModal = useOrderDetails((state) => state.toggleModal);

  return (
    <RatingModal
      open={modal.open}
      handleConfirm={(values) => submitRating({orderId: paramId, userId, values})}
      handleClose={toggleModal}
      ariaLabel="Artist rating"
      promptTitle="Rate artist"
      promptConfirm="Submit"
      promptCancel="Cancel"
    />
  );
};

export default RatingWrapper;
