
import * as Tesseract from 'tesseract.js';
import type { IOcrProvider } from './IOcrProvider';

export class TesseractOcrProvider implements IOcrProvider {
  /**
   * Recognize text from an image using Tesseract.js
   * @param imagePath Path to the image file
   * @returns Extracted text
   */
  async recognizeText(imagePath: string): Promise<string> {
    const result = await Tesseract.recognize(imagePath, 'eng', {
      logger: (m: any) => console.log(m), 
    });
    return result.data.text;
  }
}
