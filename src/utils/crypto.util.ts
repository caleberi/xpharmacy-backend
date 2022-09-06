import * as bcrypt from 'bcrypt';

type BcryptEncryptionResult = Promise<string | Error>;

export class CryptoGraphicalHelper{
  static async encryptWithBcrypt(password: string, saltRounds = 10): BcryptEncryptionResult {
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
  
}
