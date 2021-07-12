import supertest from "supertest";
import { createAccessToken } from "../../utils/auth";

export const fakeUser = {
  id: "649fc409-cc16-4d66-accf-c63e5e87a9fa",
  name: "testuser",
  onboarded: false,
  jwtVersion: 0,
  active: true,
  verified: true,
};

export const token = "test";
export const token = createAccessToken({ userData: fakeUser });

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
