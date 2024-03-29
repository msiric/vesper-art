import { isObjectEmpty } from "../common/helpers";
import { Order } from "../entities/Order";
import { Review } from "../entities/Review";
import {
  ARTWORK_SELECTION,
  AVATAR_SELECTION,
  COVER_SELECTION,
  DISCOUNT_SELECTION,
  LICENSE_SELECTION,
  MEDIA_SELECTION,
  ORDER_SELECTION,
  resolveSubQuery,
  REVIEW_SELECTION,
  USER_SELECTION,
  VERSION_SELECTION,
} from "../utils/database";
import { calculateRating, resolveDateRange } from "../utils/helpers";

export const fetchOrderByVersion = async ({
  artworkId,
  versionId,
  connection,
}) => {
  const foundOrder = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .select([...ORDER_SELECTION["ESSENTIAL_INFO"]()])
    .where("order.artworkId = :artworkId AND order.versionId = :versionId", {
      artworkId,
      versionId,
    })
    .getOne();
  return foundOrder;
};

export const fetchOrderDetails = async ({ userId, orderId, connection }) => {
  const foundOrder = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.buyer", "buyer")
    .leftJoinAndMapMany(
      "buyer.reviews",
      Review,
      "buyerReview",
      "buyerReview.revieweeId = buyer.id"
    )
    .leftJoinAndSelect("buyer.avatar", "buyerAvatar")
    .leftJoinAndSelect("order.seller", "seller")
    .leftJoinAndMapMany(
      "seller.reviews",
      Review,
      "sellerReview",
      "sellerReview.revieweeId = seller.id"
    )
    .leftJoinAndSelect("seller.avatar", "sellerAvatar")
    .leftJoinAndSelect("order.discount", "discount")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("order.artwork", "artwork")
    .leftJoinAndSelect("order.review", "review")
    .leftJoinAndSelect("order.license", "license")
    .select([
      ...ORDER_SELECTION["ESSENTIAL_INFO"](),
      ...ORDER_SELECTION["DETAILED_INFO"](),
      ...LICENSE_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["USAGE_INFO"](),
      ...LICENSE_SELECTION["ASSIGNEE_INFO"](),
      ...LICENSE_SELECTION["ASSIGNOR_INFO"](),
      ...DISCOUNT_SELECTION["ESSENTIAL_INFO"](),
      ...REVIEW_SELECTION["ESSENTIAL_INFO"](),
      ...REVIEW_SELECTION["ESSENTIAL_INFO"]("buyerReview"),
      ...REVIEW_SELECTION["ESSENTIAL_INFO"]("sellerReview"),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["ESSENTIAL_INFO"]("buyer"),
      ...USER_SELECTION["ESSENTIAL_INFO"]("seller"),
      ...AVATAR_SELECTION["ESSENTIAL_INFO"]("buyerAvatar"),
      ...AVATAR_SELECTION["ESSENTIAL_INFO"]("sellerAvatar"),
    ])
    .where(
      "(order.buyerId = :userId AND order.id = :orderId) OR (order.sellerId = :userId AND order.id = :orderId)",
      {
        userId,
        orderId,
      }
    )
    .getOne();
  if (!isObjectEmpty(foundOrder)) {
    if (foundOrder.seller.id === userId) {
      delete foundOrder.spent;
      delete foundOrder.fee;
      delete foundOrder.license.assignee;
      delete foundOrder.license.company;
      delete foundOrder.license.usage;
      delete foundOrder.license.assigneeIdentifier;
    }
    if (foundOrder.buyer.id === userId) {
      delete foundOrder.earned;
      delete foundOrder.license.assignor;
      delete foundOrder.license.assignorIdentifier;
    }
    if (foundOrder.seller) {
      foundOrder.seller.rating = calculateRating({
        active: foundOrder.seller.active,
        reviews: foundOrder.seller.reviews,
      });
    }
    if (foundOrder.buyer) {
      foundOrder.buyer.rating = calculateRating({
        active: foundOrder.buyer.active,
        reviews: foundOrder.buyer.reviews,
      });
    }
  }
  return foundOrder;
};

export const fetchUserPurchase = async ({ orderId, userId, connection }) => {
  const foundOrder = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.review", "review")
    .select([
      ...ORDER_SELECTION["ESSENTIAL_INFO"](),
      ...ORDER_SELECTION["ARTWORK_INFO"](),
      ...ORDER_SELECTION["SELLER_INFO"](),
      ...REVIEW_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where("order.buyerId = :userId AND order.id = :orderId", {
      userId,
      orderId,
    })
    .getOne();
  return foundOrder;
};

export const fetchOrdersByBuyer = async ({
  userId,
  start,
  end,
  connection,
}) => {
  const { startDate, endDate } = resolveDateRange({ start, end });
  const foundOrders = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.seller", "seller")
    .leftJoinAndSelect("order.review", "review")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("order.license", "license")
    .select([
      ...ORDER_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["STRIPPED_INFO"]("seller"),
      ...REVIEW_SELECTION["ESSENTIAL_INFO"](),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      "order.buyerId = :userId AND order.created >= :startDate AND order.created <= :endDate",
      {
        userId,
        startDate,
        endDate,
      }
    )
    .getMany();
  return foundOrders;
};

export const fetchOrdersBySeller = async ({
  userId,
  start,
  end,
  connection,
}) => {
  const { startDate, endDate } = resolveDateRange({ start, end });
  const foundOrders = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.buyer", "buyer")
    .leftJoinAndSelect("order.review", "review")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("order.license", "license")
    .select([
      ...ORDER_SELECTION["ESSENTIAL_INFO"](),
      ...USER_SELECTION["STRIPPED_INFO"]("buyer"),
      ...REVIEW_SELECTION["ESSENTIAL_INFO"](),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      "order.sellerId = :userId AND order.created >= :startDate AND order.created <= :endDate",
      {
        userId,
        startDate,
        endDate,
      }
    )
    .getMany();
  return foundOrders;
};

export const fetchOrderMedia = async ({ userId, orderId, connection }) => {
  const foundOrder = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("version.media", "media")
    .select([
      ...ORDER_SELECTION["ESSENTIAL_INFO"](),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...MEDIA_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      "order.id = :orderId AND order.status = :status AND (order.buyerId = :userId OR order.sellerId = :userId)",
      {
        orderId,
        status: ORDER_SELECTION.COMPLETED_STATUS,
        userId,
      }
    )
    .getOne();
  return foundOrder && foundOrder.version ? foundOrder.version.media : {};
};

export const fetchOrdersByArtwork = async ({
  userId,
  artworkId,
  connection,
}) => {
  const foundOrders = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .select([
      ...ORDER_SELECTION["ESSENTIAL_INFO"](),
      ...ORDER_SELECTION["VERSION_INFO"](),
    ])
    .where("order.sellerId = :userId AND order.artworkId = :artworkId", {
      userId,
      artworkId,
    })
    .getMany();
  return foundOrders;
};

export const addOrderReview = async ({
  orderId,
  userId,
  reviewId,
  connection,
}) => {
  const updatedOrder = await connection
    .createQueryBuilder()
    .update(Order)
    .set({ reviewId: reviewId })
    .where('id = :orderId AND "buyerId" = :userId', {
      orderId,
      userId,
    })
    .execute();
  return updatedOrder;
};

export const addNewOrder = async ({ orderId, orderData, connection }) => {
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
        type: orderData.type,
        status: orderData.status,
      },
    ])
    .execute();
  return savedOrder;
};

export const fetchUserReviews = async ({ userId, connection }) => {
  const foundReviews = await connection
    .getRepository(Review)
    .createQueryBuilder("review")
    .select([...REVIEW_SELECTION["ESSENTIAL_INFO"]()])
    .where("review.revieweeId = :userId", {
      userId,
    })
    .getMany();
  return foundReviews;
};

// $Needs testing (mongo -> postgres)
// $TODO Remove @AfterLoad for earned, spent and fee
export const fetchUserPurchases = async ({
  userId,
  cursor,
  limit,
  connection,
}) => {
  // return await Order.find({
  //   where: [{ buyerId: userId }],
  //   relations: ["seller", "version", "review"],
  //   skip: cursor,
  //   take: limit,
  // });
  const queryBuilder = await connection
    .getRepository(Order)
    .createQueryBuilder("order");
  const foundPurchases = await queryBuilder
    .leftJoinAndSelect("order.seller", "seller")
    .leftJoinAndSelect("order.license", "license")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("order.artwork", "artwork")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("order.review", "review")
    .select([
      ...ORDER_SELECTION["ESSENTIAL_INFO"](),
      ...ORDER_SELECTION["BUYER_SPENT"](),
      ...USER_SELECTION["STRIPPED_INFO"]("seller"),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
      ...REVIEW_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["ASSIGNOR_INFO"](),
      ...LICENSE_SELECTION["USAGE_INFO"](),
    ])
    .where(
      `order.buyerId = :userId AND order.serial > 
      ${resolveSubQuery(queryBuilder, "order", Order, cursor, -1)}`,
      { userId }
    )
    .orderBy("order.serial", "ASC")
    .limit(limit)
    .getMany();
  return foundPurchases;
};

export const fetchArtworkOrders = async ({ userId, artworkId, connection }) => {
  const foundPurchases = await connection
    .getRepository(Order)
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.license", "license")
    .select([
      ...ORDER_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["USAGE_INFO"](),
      ...LICENSE_SELECTION["ASSIGNOR_INFO"](),
    ])
    .where("order.buyerId = :userId AND order.artworkId = :artworkId", {
      userId,
      artworkId,
    })
    .getMany();
  return foundPurchases;
};
// $Needs testing (mongo -> postgres)

export const fetchUserSales = async ({ userId, cursor, limit, connection }) => {
  // return await Order.find({
  //   where: [{ sellerId: userId }],
  //   relations: ["buyer", "version", "review"],
  //   skip: cursor,
  //   take: limit,
  // });
  const queryBuilder = await connection
    .getRepository(Order)
    .createQueryBuilder("order");
  const foundSales = await queryBuilder
    .leftJoinAndSelect("order.buyer", "buyer")
    .leftJoinAndSelect("order.license", "license")
    .leftJoinAndSelect("order.version", "version")
    .leftJoinAndSelect("order.artwork", "artwork")
    .leftJoinAndSelect("version.cover", "cover")
    .leftJoinAndSelect("order.review", "review")
    .select([
      ...ORDER_SELECTION["ESSENTIAL_INFO"](),
      ...ORDER_SELECTION["SELLER_EARNED"](),
      ...USER_SELECTION["STRIPPED_INFO"]("buyer"),
      ...VERSION_SELECTION["ESSENTIAL_INFO"](),
      ...ARTWORK_SELECTION["ESSENTIAL_INFO"](),
      ...COVER_SELECTION["ESSENTIAL_INFO"](),
      ...REVIEW_SELECTION["ESSENTIAL_INFO"](),
      ...LICENSE_SELECTION["ESSENTIAL_INFO"](),
    ])
    .where(
      `order.sellerId = :userId AND order.serial > 
      ${resolveSubQuery(queryBuilder, "order", Order, cursor, -1)}`,
      { userId }
    )
    .orderBy("order.serial", "ASC")
    .limit(limit)
    .getMany();
  return foundSales;
};

export const addNewReview = async ({
  reviewId,
  orderData,
  reviewRating,
  reviewerId,
  revieweeId,
  connection,
}) => {
  const savedReview = await connection
    .createQueryBuilder()
    .insert()
    .into(Review)
    .values([
      {
        id: reviewId,
        orderId: orderData.id,
        artworkId: orderData.artworkId,
        reviewerId: reviewerId,
        revieweeId: revieweeId,
        rating: reviewRating,
      },
    ])
    .execute();
  return savedReview;
};
