import axios from "axios";
import qs from "qs";
import { Request, RequestHandler, Response } from "express";
import { config } from "polaris-api/config";

const logout: RequestHandler = async (request: Request, response: Response): Promise<void> => {
  const keyCloakConfig = config.get("keycloak");
  const refreshToken =
    request.body.refresh_token || request.query.refresh_token || request.headers["refresh-token"];
  const formData = qs.stringify({
    client_id: keyCloakConfig.clientID,
    client_secret: keyCloakConfig.clientSecret,
    refresh_token: refreshToken,
  });
  const logoutUrl = `${keyCloakConfig.authServerURL}/realms/${keyCloakConfig.realm}/protocol/openid-connect/logout`;

  const logoutRequest = await axios.post(logoutUrl, formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  response.status(204);
  response.send(logoutRequest.data);
  response.end();
};

export { logout };
