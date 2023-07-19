import { createHash } from 'crypto';

/**
 * 암호화
 */
export const SecurityUtils = {
  xorEncryptDecrypt(input: any, key: any) {
    let output = '';
    for (let i = 0; i < input.length; i++) {
      output += String.fromCharCode(input.charCodeAt(i) ^ key);
    }
    return output;
  },

  encryptText: (originalText: string) => {
    return SecurityUtils.xorEncryptDecrypt(originalText, 45);
  },

  decryptText: (encryptedText: string) => {
    return SecurityUtils.xorEncryptDecrypt(encryptedText, 45);
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
