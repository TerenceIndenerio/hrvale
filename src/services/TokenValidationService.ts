import jwt_decode from 'jwt-decode';

export default class TokenValidationService {
  constructor() {}

  // Function to check if a token is expired
  isTokenExpired(token: string|null): boolean {
    if (token === null || 
        token === undefined || 
        token === '') {
        return true;
    }

    try {
      const decodedToken: { [key: string]: any } = jwt_decode(token);
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      if (!decodedToken.exp || decodedToken.exp < currentTimeInSeconds) {
        // Token is expired
        return true;
      }

      // Token is not expired
      return false;
    } catch (error) {
      // Token decoding failed, consider it as expired
      return true;
    }
  }
}
