import supertest from "supertest";

export const token = "test";

export const request = (app, token = null) => {
  const config = {
    ...(token && { authorization: { Authorization: `Bearer ${token}` } }),
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
