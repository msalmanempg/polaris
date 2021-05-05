import session from "express-session";
import KeyCloak from "keycloak-connect";
import { config } from "polaris-api/config";
import { logger } from "polaris-api/utils";
import { keyCloakConfig } from "./config";

let _keycloak: KeyCloak.Keycloak;
let appSession: any;

const initKeyCloak = (): KeyCloak.Keycloak => {
  if (_keycloak) {
    logger.warn("⚠️ KeyCloak already initialized");
    return _keycloak;
  } else {
    logger.info("🔐 Initialzing KeyCloak");
    const memoryStore = new session.MemoryStore();
    appSession = session({
      secret: config.get("secret"),
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    });

    _keycloak = new KeyCloak({ store: memoryStore }, keyCloakConfig);

    return _keycloak;
  }
};

const getKeyCloak = (): KeyCloak.Keycloak => {
  if (!_keycloak) {
    logger.error("KeyCloak not initialized");
    initKeyCloak();
  }
  return _keycloak;
};

export { initKeyCloak, getKeyCloak, appSession };
