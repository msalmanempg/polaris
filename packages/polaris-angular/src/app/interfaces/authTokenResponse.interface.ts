import { TokenType } from "@app/types/tokenTypes.type";

export interface AuthTokenResponse {
  accessToken: string;
  expiresIn: number;
  "not-before-policy": number;
  refreshExpiresIn: number;
  refreshToken: string;
  tokenType: TokenType;
  sessionState: string;
  scope: string;
}
