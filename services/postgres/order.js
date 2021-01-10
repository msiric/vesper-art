import { Order } from "../../entities/Order";

// $Needs testing (mongo -> postgres)
export const addNewOrder = async ({ orderId, orderData, connection }) => {
  /*   const newOrder = new Order();
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
  return await Order.save(newOrder); */

  const savedOrder = await connection
    .createQueryBuilder()
    .insert()
    .into(Order)
    .values([
      {
        id: orderId,
        buyerId: orderData.buyerId,
        sellerId: orderData.sellerId,
        artworkId: orderData.artworkId,
        versionId: orderData.versionId,
        licenseId: orderData.licenseId,
        discountId: orderData.discountId,
        reviewId: orderData.reviewId,
        intentId: orderData.intentId,
        spent: orderData.spent,
        earned: orderData.earned,
        fee: orderData.fee,
        type: orderData.type ? "commercial" : "free",
        status: orderData.status,
      },
    ])
    .execute();
  console.log(savedOrder);
  return savedOrder;
};

// $Needs testing (mongo -> postgres)
export const fetchOrderByVersion = async ({
  artworkId,
  versionId,
  connection,
}) => {
  // return await Order.findOne({
  //   where: [{ artwork: artworkId, version: versionId }],
  // });

  const foundOrder = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.buyer", "buyer")
    .leftJoinAndSelect("buyer.avatar", "buyerAvatar")
    .leftJoinAndSelect("order.seller", "seller")
    .leftJoinAndSelect("seller.avatar", "sellerAvatar")
    .leftJoinAndSelect("order.discount", "discount")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("order.artwork", "artwork")
    .leftJoinAndSelect("order.review", "review")
    .leftJoinAndSelect("order.license", "license")
    .leftJoinAndSelect("order.license", "license")
    .where("order.artworkId = :artworkId AND order.versionId = :versionId", {
      artworkId,
      versionId,
    })
    .getOne();
  console.log(foundOrder);
  return foundOrder;
};

// $Needs testing (mongo -> postgres)
export const fetchOrderDetails = async ({ userId, orderId, connection }) => {
  // return await Order.findOne({
  //   where: [
  //     { buyer: userId, id: orderId },
  //     { seller: userId, id: orderId },
  //   ],
  //   relations: [
  //     "buyer",
  //     "seller",
  //     "discount",
  //     "version",
  //     "artwork",
  //     "review",
  //     "license",
  //     "license.artwork",
  //   ],
  // });

  const foundOrder = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.buyer", "buyer")
    .leftJoinAndSelect("buyer.avatar", "buyerAvatar")
    .leftJoinAndSelect("order.seller", "seller")
    .leftJoinAndSelect("seller.avatar", "sellerAvatar")
    .leftJoinAndSelect("order.discount", "discount")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("order.artwork", "artwork")
    .leftJoinAndSelect("order.review", "review")
    .leftJoinAndSelect("order.license", "license")
    .where(
      "(order.buyerId = :userId AND order.id = :orderId) OR (order.sellerId = :userId AND order.id = :orderId)",
      {
        userId,
        orderId,
      }
    )
    .getOne();
  console.log(foundOrder);
  return foundOrder;
};

// $Needs testing (mongo -> postgres)
export const fetchUserPurchase = async ({ orderId, userId, connection }) => {
  // return await Order.findOne({
  //   where: [{ buyer: userId, id: orderId }],
  //   relations: ["buyer", "seller", "artwork", "artwork.review"],
  // });

  const foundOrder = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.seller", "seller")
    .leftJoinAndSelect("order.review", "review")
    .where("order.buyerId = :userId AND order.id = :orderId", {
      userId,
      orderId,
    })
    .getOne();
  console.log(foundOrder);
  return foundOrder;
};

// $Needs testing (mongo -> postgres)
export const addOrderReview = async ({
  orderId,
  userId,
  reviewId,
  connection,
}) => {
  /*   const foundOrder = await Order.findOne({
    where: [{ buyer: userId, id: orderId }],
  });
  foundOrder.review = savedReview;
  return await Order.save(foundOrder); */

  const updatedOrder = await connection
    .createQueryBuilder()
    .update(Order)
    .set({ reviewId: reviewId })
    .where("id = :orderId AND buyerId = :userId", {
      orderId,
      userId,
    })
    .execute();
  console.log(updatedOrder);
  return updatedOrder;
};

// $Needs testing (mongo -> postgres)
// $TODO does created get filtered correctly?
export const fetchOrdersBySeller = async ({
  userId,
  rangeFrom,
  rangeTo,
  connection,
}) => {
  // return rangeFrom && rangeTo
  //   ? await Order.find({
  //       where: [
  //         {
  //           seller: userId,
  //           created:
  //             MoreThanOrEqual(new Date(rangeFrom)) &&
  //             LessThan(new Date(rangeTo)),
  //         },
  //       ],
  //       relations: ["review", "version", "license"],
  //     })
  //   : await Order.find({
  //       where: [
  //         {
  //           seller: userId,
  //         },
  //       ],
  //       relations: ["review", "version", "license"],
  //     });

  const foundOrders = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.buyer", "buyer")
    .leftJoinAndSelect("order.review", "review")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("order.license", "license")
    .where("order.sellerId = :userId", {
      userId,
    })
    .getMany();
  console.log(foundOrders);
  return foundOrders;
};

// $Needs testing (mongo -> postgres)
export const fetchOrdersByBuyer = async ({
  userId,
  rangeFrom,
  rangeTo,
  connection,
}) => {
  // return rangeFrom && rangeTo
  //   ? await Order.find({
  //       where: [
  //         {
  //           buyer: userId,
  //           created:
  //             MoreThanOrEqual(new Date(rangeFrom)) &&
  //             LessThan(new Date(rangeTo)),
  //         },
  //       ],
  //       relations: ["review", "version", "license"],
  //     })
  //   : await Order.find({
  //       where: [
  //         {
  //           buyer: userId,
  //         },
  //       ],
  //       relations: ["review", "version", "license"],
  //     });

  const foundOrders = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.seller", "seller")
    .leftJoinAndSelect("order.review", "review")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("order.license", "license")
    .where("order.buyerId = :userId", {
      userId,
    })
    .getMany();
  console.log(foundOrders);
  return foundOrders;
};

export const fetchBuyerMedia = async ({ userId, orderId, connection }) => {
  const foundOrder = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("version.media", "media")
    .where(
      "order.id = :orderId AND order.status = :status AND order.buyerId = :userId",
      {
        orderId,
        // $TODO to const
        status: "completed",
        userId,
      }
    )
    .getOne();
  console.log(foundOrder.version.media);
  return foundOrder.version.media;
};
