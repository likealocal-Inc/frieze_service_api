import { createHash } from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

const key = 'thisislikeallodkf';

/**
 * 암호화
 */
export const SecurityUtils = {
  encryptText: (originalText: string) => {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(originalText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  },

  decryptText: (encryptedText: string) => {
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  },

  /**
   * 랜덤키 만들기
   */
  makeKey: async (data: string, size = 38): Promise<string> => {
    const key = await createHash('sha256')
      .update(String(data))
      .digest('base64')
      .substr(0, size);
    return key.replace(/\//g, '');
  },
};
