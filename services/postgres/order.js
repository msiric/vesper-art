import { LessThan, MoreThanOrEqual } from "typeorm";
import { Order } from "../../entities/Order";

// $Needs testing (mongo -> postgres)
export const addNewOrder = async ({ orderData }) => {
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
  newOrder.commercial = orderData.commercial;
  newOrder.status = orderData.status;
  newOrder.intent = orderData.intentId;
  return await newOrder.save();
};

// $Needs testing (mongo -> postgres)
export const fetchOrderByVersion = async ({ artworkId, versionId }) => {
  return await Order.findOne({
    where: [{ artwork: artworkId, version: versionId }],
  });
};

// $Needs testing (mongo -> postgres)
export const fetchOrderDetails = async ({ userId, orderId }) => {
  return await Order.findOne({
    where: [
      { buyer: userId, id: orderId },
      { seller: userId, id: orderId },
    ],
    relations: [
      "buyer",
      "seller",
      "discount",
      "version",
      "artwork",
      "review",
      "license",
      "license.artwork",
    ],
  });
};

// $Needs testing (mongo -> postgres)
export const fetchUserOrder = async ({ orderId, userId }) => {
  return await Order.findOne({
    where: [{ buyer: userId, id: orderId }],
    relations: ["buyer", "seller", "artwork", "artwork.review"],
  });
};

// $Needs testing (mongo -> postgres)
export const addOrderReview = async ({ orderId, userId, reviewId }) => {
  const foundOrder = await Order.findOne({
    where: [{ buyer: userId, id: orderId }],
  });
  foundOrder.review = reviewId;
  return await Order.save({ foundOrder });
};

// $Needs testing (mongo -> postgres)
// $TODO does created get filtered correctly?
export const fetchOrdersBySeller = async ({ userId, rangeFrom, rangeTo }) => {
  return rangeFrom && rangeTo
    ? await Order.find({
        where: [
          {
            seller: userId,
            created:
              MoreThanOrEqual(new Date(rangeFrom)) &&
              LessThan(new Date(rangeTo)),
          },
        ],
        relations: ["review", "version", "license", "sales", "sales.review"],
      })
    : await Order.find({
        where: [
          {
            seller: userId,
          },
        ],
        relations: ["review", "version", "license", "sales", "sales.review"],
      });
};

// $Needs testing (mongo -> postgres)
export const fetchOrdersByBuyer = async ({ userId, rangeFrom, rangeTo }) => {
  return rangeFrom && rangeTo
    ? await Order.find({
        where: [
          {
            buyer: userId,
            created:
              MoreThanOrEqual(new Date(rangeFrom)) &&
              LessThan(new Date(rangeTo)),
          },
        ],
        relations: ["review", "version", "license", "sales", "sales.review"],
      })
    : await Order.find({
        where: [
          {
            buyer: userId,
          },
        ],
        relations: ["review", "version", "license", "sales", "sales.review"],
      });
};
