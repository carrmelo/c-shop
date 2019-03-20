import { sign } from 'jsonwebtoken';

// Sign a jwt token with an hour expiration time, an array with numbers can extend
// the life of the token
// tslint:disable-next-line: prefer-array-literal
export const signToken = (id: string, expiration: Array<any> = []) => {
  return sign(
    {
      id,
      exp:
        Math.floor(Date.now() / 1000) +
        60 * 60 * expiration.reduce((a, b) => a * b, 1),
    },
    process.env.APP_SECRET,
  );
};
