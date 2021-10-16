import supertest from "supertest";

export const request = (app, token = null, cookie = null) => {
  const config = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(cookie && { Cookie: [`jid=${cookie}`] }),
  };

  const hook =
    (method = "post") =>
    (args) =>
      supertest(app)[method](args).set(config);

  return {
    post: hook("post"),
    get: hook("get"),
    put: hook("put"),
    delete: hook("delete"),
  };
};
