import * as bcrypt from 'bcrypt';

export class BcryptHash {
  static makeHash(plainText: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainText, salt);
  }

  static compare(plainText: string, hash: string) {
    return bcrypt.compareSync(plainText, hash);
  }
}
