import { updateBotMetatags } from "@utils/bot";
import express from "express";
import path from "path";
import { getConnection } from "typeorm";
import { getUserProfile } from "../../../controllers/user";

const dirname = path.resolve();

const router = express.Router();

router.route("/user/:userUsername").get(async (req, res, next) => {
  try {
    const connection = getConnection();
    const result = await getUserProfile({
      userUsername: req.params.userUsername,
      connection,
    });
    await updateBotMetatags(result, req, res);
    return res.sendFile(path.join(dirname, "client/build", "generated.html"));
  } catch (err) {
    // do nothing
  }
});

export default router;
