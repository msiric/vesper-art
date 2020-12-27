import Order from "../../models/order.js";

export const addNewOrder = async ({ orderData, session = null }) => {
  const newOrder = new Order();
  newOrder.buyer = orderData.buyerId;
  newOrder.seller = orderData.sellerId;
  newOrder.artwork = orderData.artworkId;
  newOrder.version = orderData.versionId;
  newOrder.discount = orderData.discountId;
  newOrder.license = orderData.licenseId;
  newOrder.review = orderData.review;
  newOrder.spent = orderData.spent;
  newOrder.earned = orderData.earned;
  newOrder.fee = orderData.fee;
  newOrder.type = orderData.commercial ? "commercial" : "free";
  newOrder.status = orderData.status;
  newOrder.intent = orderData.intentId;
  return await newOrder.save({ session });
};

export const fetchOrderByVersion = async ({
  artworkId,
  versionId,
  session = null,
}) => {
  return await Order.findOne({
    artwork: artworkId,
    version: versionId,
  }).session(session);
};

export const fetchOrderDetails = async ({
  userId,
  orderId,
  session = null,
}) => {
  return await Order.findOne({
    $and: [
      {
        $or: [{ buyer: userId }, { seller: userId }],
      },
      { _id: orderId },
    ],
  })
    .populate("buyer")
    .populate("seller")
    .populate("discount")
    .populate("version")
    .populate("artwork")
    .populate("review")
    .deepPopulate("license.artwork")
    .session(session);
};

export const fetchUserOrder = async ({ orderId, userId, session = null }) => {
  return await Order.findOne({
    $and: [{ _id: orderId }, { buyer: userId }],
  })
    .populate("buyer")
    .populate("seller")
    .deepPopulate("artwork.review")
    .session(session);
};

export const addOrderReview = async ({
  orderId,
  userId,
  reviewId,
  session = null,
}) => {
  return await Order.updateOne(
    {
      $and: [{ _id: orderId }, { buyer: userId }],
    },
    { review: reviewId }
  ).session(session);
};

export const fetchOrdersBySeller = async ({
  userId,
  rangeFrom,
  rangeTo,
  session = null,
}) => {
  return rangeFrom && rangeTo
    ? await Order.find({
        $and: [
          { seller: userId },
          { created: { $gte: new Date(rangeFrom), $lt: new Date(rangeTo) } },
        ],
      }).populate("review version license sales.review")
    : await Order.find({
        $and: [{ seller: userId }],
      }).populate("review version license sales.review");
};

export const fetchOrdersByBuyer = async ({
  userId,
  rangeFrom,
  rangeTo,
  session = null,
}) => {
  return rangeFrom && rangeTo
    ? await Order.find({
        $and: [
          { buyer: userId },
          { created: { $gte: new Date(rangeFrom), $lt: new Date(rangeTo) } },
        ],
      }).populate("review version license sales.review")
    : await Order.find({
        $and: [{ buyer: userId }],
      }).populate("review version license sales.review");
};
