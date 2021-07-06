import supertest from "supertest";

export const fakeUser = {
  id: "649fc409-cc16-4d66-accf-c63e5e87a9fa",
  name: "testuser",
  onboarded: false,
  jwtVersion: 0,
  active: true,
};

export const token = "test";

export const request = (app, token = null) => {
  const config = {
    ...(token && { Authorization: `Bearer ${token}` }),
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
