import React from "react";
import ProfileCard from "../../components/ProfileCard/index";
import { useUserStore } from "../../contexts/global/user";
import { useOrderDetails } from "../../contexts/local/orderDetails";

const UserSection = () => {
  const userId = useUserStore((state) => state.id);

  const buyer = useOrderDetails((state) => state.order.data.buyer);
  const seller = useOrderDetails((state) => state.order.data.seller);
  const loading = useOrderDetails((state) => state.order.loading);

  const user = buyer.id === userId ? seller : buyer;

  return <ProfileCard user={user} loading={loading} />;
};

export default UserSection;
