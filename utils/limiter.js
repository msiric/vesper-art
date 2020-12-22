import rateLimit from "express-rate-limit";

const window = 60; // 60 seconds
const max = 50;

export const rateLimiter = rateLimit({
  windowMs: window * 1000, // 24 hrs in milliseconds
  max: max,
  message: `You have exceeded the ${max} requests in ${window} seconds!`,
  headers: true,
});
