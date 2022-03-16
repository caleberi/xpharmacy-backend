import * as bcrypt from 'bcrypt';

export const encrypt = (
  password: string,
  saltRounds = 10,
): Promise<string | Error> => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function (err: Error, salt: string) {
      if (err) return reject(err);
      return bcrypt.hash(password, salt, function (err: Error, hash: string) {
        if (err) return reject(err);
        return resolve(hash);
      });
    });
  });
};
