import axios from "axios";
import qs from "qs";
import { Request, RequestHandler, Response } from "express";
import { config } from "polaris-api/config";

const login: RequestHandler = async (request: Request, response: Response): Promise<void> => {
  const keyCloakConfig = config.get("keycloak");
  const formBody = qs.stringify({
    grant_type: "password",
    username: request.body.login,
    password: request.body.password,
    client_id: keyCloakConfig.clientID,
    client_secret: keyCloakConfig.clientSecret,
  });
  const tokenUrl = `${keyCloakConfig.authServerURL}/realms/${keyCloakConfig.realm}/protocol/openid-connect/token`;
  const authenticationRequest = await axios.post(tokenUrl, formBody, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  response.status(200);
  response.send(authenticationRequest.data);
  response.end();
};

export { login };
