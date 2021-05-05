import { config } from "polaris-api/config";

export const keyCloakConfig = {
  clientId: config.get("keycloak").clientID,
  bearerOnly: true,
  "auth-server-url": config.get("keycloak").authServerURL,
  "confidential-port": 8080,
  realm: config.get("keycloak").realm,
  resource: config.get("keycloak").clientID,
  "ssl-required": "false",
  credentials: {
    secret: config.get("keycloak").clientSecret,
  },
};
