import { Response } from "supertest";
import { testExpressApp } from "./support/requestFactory";

const customerCreds = {
  login: process.env.KEYCLOAK_TEST_USER,
  password: process.env.KEYCLOAK_TEST_PASSWORD,
};

const tokens = { access_token: "", refresh_token: "" };

const isValidToken = (response: Response) => {
  tokens.access_token = response.body?.access_token;
  tokens.refresh_token = response.body?.refresh_token;
  expect(response.body).toHaveProperty("access_token", expect.any(String));
  expect(response.body).toHaveProperty("refresh_token", expect.any(String));
};

describe("Authentication", () => {
  it("Should provide token", async () => {
    await testExpressApp()
      .post("/api/auth/login")
      .send(customerCreds)
      .expect(200)
      .expect(isValidToken);
  });

  // Placing single chore test here later this can be moved out.
  it("Should Migrate all DB Changes", async () => {
    await testExpressApp()
      .get("/api/chore/migrate")
      .set("Authorization", `Bearer ${tokens.access_token}`)
      .expect(200);
  }, 60000);

  it("Should logout loggedIn User", async () => {
    await testExpressApp()
      .get("/api/auth/logout")
      .set("Authorization", `Bearer ${tokens.access_token}`)
      .set("Refresh-Token", tokens.refresh_token)
      .expect(204);
  });
});
