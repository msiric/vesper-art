import express from "express";

const router = express.Router();

// Authenticated routes
// $TODO No automated tests
// $TODO Only for test (remove in prod)
router.route("/contact");
// $TODO Not tested
// .post(
//   [isAuthenticated],
//   handler(postTicket, true, (req, res, next) => ({
//     userEmail: res.locals.user ? res.locals.user.email : null,
//   }))
// );

export default router;
