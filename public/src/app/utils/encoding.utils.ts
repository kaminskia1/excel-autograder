import { Buffer } from 'buffer';

/**
 * Encodes a Blob to a base64 data URL string.
 */
export function encodeBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Decodes a base64 data URL string to a File.
 */
export function decodeBase64ToFile(base64String: string, fileName = 'file.xlsx'): File {
  const byteCharacters = atob(base64String.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], fileName, { type: 'application/xlsx' });
}

/**
 * Encodes a string to base64.
 */
export function encodeString(str: string): string {
  return Buffer.from(str, 'binary').toString('base64');
}

/**
 * Decodes a base64 string.
 */
export function decodeString(str: string): string {
  return Buffer.from(str, 'base64').toString('binary');
}
