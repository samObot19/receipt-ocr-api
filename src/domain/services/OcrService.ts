
import type { IOcrProvider } from '../../infrastructure/ocr/IOcrProvider';
import Receipt from '../entities/Receipt';
import Item from '../entities/Item';
import OpenAI from 'openai';

const token = process.env["API_TOKEN"];
const endpoint = process.env["OPENAI_ENDPOINT"];
const model = "openai/gpt-4o";


export class OcrService {
  private ocrProvider: IOcrProvider;
  private openai: OpenAI;

  constructor(ocrProvider: IOcrProvider) {
    this.ocrProvider = ocrProvider;
    this.openai = new OpenAI({ baseURL: endpoint, apiKey: token });
  }

  async extractReceiptData(imagePath: string): Promise<Receipt> {
    const rawText = await this.ocrProvider.recognizeText(imagePath);
    console.log(rawText)

  const prompt = `\nYou are an expert at extracting structured data from receipts. Given the following OCR text, extract:\n- storeName (string)\n- purchaseDate (string, must be a valid ISO 8601 date in the format YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss, and must be a real calendar date)\n- totalAmount (number)\n- items (array of { name: string, quantity: number, price: number })\n\nIf you cannot find a valid purchase date in the text, respond with \\"purchaseDate\\": null.\n\nOCR TEXT:\n${rawText}\n\nRespond ONLY with a valid JSON object matching this structure:\n{\n  "storeName": "...",\n  "purchaseDate": "...",\n  "totalAmount": ...,\n  "items": [\n    { "name": "...", "quantity": ..., "price": ... }\n  ]\n}`;

    const response = await this.openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant for receipt data extraction." },
        { role: "user", content: prompt }
      ],
      model: model
    });

    const content = response.choices?.[0]?.message?.content ?? '{}';
    console.log("OCR Result:", content.slice(7, -3));
    const data = JSON.parse(content.slice(7, -3));

    const items = (data.items || []).map((i: any, idx: number) =>
      new Item({
        id: (idx + 1).toString(),
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        receiptId: '',
        createdAt: new Date(data.purchaseDate),
      })
    );

    return new Receipt({
      id: '',
      storeName: data.storeName,
      purchaseDate: new Date(data.purchaseDate),
      totalAmount: data.totalAmount,
      items,
      imageUrl: '',
      createdAt: new Date(),
    });
  }
}
