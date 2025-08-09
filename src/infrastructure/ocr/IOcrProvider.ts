// src/infrastructure/ocr/IOcrProvider.ts

export interface IOcrProvider {
  recognizeText(imagePath: string): Promise<string>;
}
