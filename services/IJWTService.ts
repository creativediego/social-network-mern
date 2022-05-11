export default interface IJWTService {
  verifyToken(token: string): any;
  signToken(payload: any): any;
}
