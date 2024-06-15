/**
 * Interface for JWT service to sign and verify tokens.
 */
export interface IJWTService {
  verifyToken(token: string): any;
  signToken(payload: any): any;
}
