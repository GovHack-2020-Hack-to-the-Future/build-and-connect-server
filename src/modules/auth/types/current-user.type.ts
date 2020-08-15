export type CurrentUser = {
  aud: string[];
  azp: string;
  exp: number;
  iat: number;
  iss: string;
  permissions?: string[];
  scope: string;
  sub: string;
};
