import { getConnection } from "typeorm";
import { Artwork } from "../../entities/Artwork";
import { Avatar } from "../../entities/Avatar";
import { Comment } from "../../entities/Comment";
import { Discount } from "../../entities/Discount";
import { Intent } from "../../entities/Intent";
import { License } from "../../entities/License";
import { Media } from "../../entities/Media";
import { Notification } from "../../entities/Notification";
import { Order } from "../../entities/Order";
import { Review } from "../../entities/Review";
import { Tag } from "../../entities/Tag";
import { Ticket } from "../../entities/Ticket";
import { User } from "../../entities/User";
import { Version } from "../../entities/Version";

export const artworkRepository = (async () =>
  await getConnection().getRepository(Artwork))();
export const avatarRepository = (async () =>
  await getConnection().getRepository(Avatar))();
export const commentRepository = (async () =>
  await getConnection().getRepository(Comment))();
export const coverRepository = (async () =>
  await getConnection().getRepository(Cover))();
export const discountRepository = (async () =>
  await getConnection().getRepository(Discount))();
export const favoriteRepository = (async () =>
  await getConnection().getRepository(Favorite))();
export const intentRepository = (async () =>
  await getConnection().getRepository(Intent))();
export const licenseRepository = (async () =>
  await getConnection().getRepository(License))();
export const mediaRepository = (async () =>
  await getConnection().getRepository(Media))();
export const notificationRepository = (async () =>
  await getConnection().getRepository(Notification))();
export const orderRepository = (async () =>
  await getConnection().getRepository(Order))();
export const reviewRepository = (async () =>
  await getConnection().getRepository(Review))();
export const tagRepository = (async () =>
  await getConnection().getRepository(Tag))();
export const ticketRepository = (async () =>
  await getConnection().getRepository(Ticket))();
export const userRepository = (async () =>
  await getConnection().getRepository(User))();
export const versionRepository = (async () =>
  await getConnection().getRepository(Version))();
