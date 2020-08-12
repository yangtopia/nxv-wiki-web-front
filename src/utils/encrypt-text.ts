import CryptoJS from 'crypto-js';

class NxvTextEncyptor {
  encrypt = (rawText: string): string => {
    return CryptoJS.AES.encrypt(
      rawText,
      process.env.NXV_ENV.CRYPTO_KEY,
    ).toString();
  };

  decrypt = (encryptedText: string): string => {
    return CryptoJS.AES.decrypt(
      encryptedText,
      process.env.NXV_ENV.CRYPTO_KEY,
    ).toString(CryptoJS.enc.Utf8);
  };
}

export default new NxvTextEncyptor();
