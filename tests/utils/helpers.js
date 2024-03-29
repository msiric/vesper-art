import { createAccessToken, createRefreshToken } from "../../utils/auth";
import { formatTokenData } from "../../utils/helpers";

export const unusedUuid = "340a2423-eb66-48f0-9372-4a31f781d022";

export const accessTokens = {
  expiredBuyer:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFhMWM2ODU5LWJiNzMtNDE5Zi04YjI5LWNkNzgxN2VkZTJmMiIsIm5hbWUiOiJ2YWxpZHVzZXIyIiwiand0VmVyc2lvbiI6MCwib25ib2FyZGVkIjpmYWxzZSwiYWN0aXZlIjp0cnVlLCJ2ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNjQxMDc2MzEwLCJleHAiOjE2NDEwNzcyMTB9.qBYA6mSP8U1IHfb9v3E2hKLZ_cLlxqlVQb_a4KxkN3s",
  expiredSeller:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhmNTIwZWQzLWYyMTEtNDc3Ni04ZDI1LTIxOGU4YTJlNTkzZCIsIm5hbWUiOiJ2YWxpZHVzZXIxIiwiand0VmVyc2lvbiI6MCwib25ib2FyZGVkIjpmYWxzZSwiYWN0aXZlIjp0cnVlLCJ2ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNjQxMTY3MzgwLCJleHAiOjE2NDExNjgyODB9.p1YmxJZMAjQnryyGYK2XcrlN9ti437FzADC605MlcFQ",
};

export const unusedCookie =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNDBhMjQyMy1lYjY2LTQ4ZjAtOTM3Mi00YTMxZjc4MWQwMjIiLCJqd3RWZXJzaW9uIjowLCJpYXQiOjE2Mzk2ODI1NDQsImV4cCI6NTAwMDAwMDAwMDB9.d9h7t-qnqrFcSed3H2vL2ZgdRx29BJRm0f9wvKlpESw";

export const unusedFingerprint = "0277eaabf6f62c5608ceee13f4e526ab4eef267c";

export const fileTooLargeError = "File too large";

export const findSingleOrderedArtwork = (orders) =>
  orders.filter(
    (item) =>
      orders.filter((element) => item.artworkId === element.artworkId).length <
      2
  );

export const findMultiOrderedArtwork = (orders) =>
  orders.filter(
    (item) =>
      orders.filter((element) => item.artworkId === element.artworkId).length >
      1
  );

export const findUnorderedArtwork = (artworks, orders) =>
  artworks.filter(
    (artwork) => !orders.find((order) => artwork.id === order.artworkId)
  );

export const findUniqueOrders = (orders) =>
  [...orders]
    .reverse()
    .filter(
      (item, index, self) =>
        self.findIndex((value) => value.artworkId === item.artworkId) === index
    )
    .reverse();

export const logUserIn = (user) => {
  const { tokenPayload: payload } = formatTokenData({ user });
  const cookie = createRefreshToken({ userData: payload });
  const token = createAccessToken({ userData: payload });
  return { cookie, token };
};
