import supertest from "supertest";
import { cookieKeys } from "../../common/constants";

export const request = (app, token = null, cookie = null) => {
  const config = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(cookie && { Cookie: [`${cookieKeys.jid}=${cookie}`] }),
  };

  const hook =
    (method = "post") =>
    (args) =>
      supertest(app)[method](args).set(config);

  return {
    post: hook("post"),
    patch: hook("patch"),
    get: hook("get"),
    put: hook("put"),
    delete: hook("delete"),
  };
};
