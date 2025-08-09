
# Receipt OCR & Data Extraction API

## 🚀 Full Stack Developer Challenge

A backend-focused system for uploading supermarket or restaurant receipt images, extracting structured data (total amount, date, items purchased), and exposing it via a GraphQL API. Minimal frontend included for testing and demonstration.

---

## 🗂️ Project Structure

```
receipt-ocr-api/
├── docker-compose.yml
├── eng.traineddata
├── package.json
├── README.md
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── config/
│   ├── delivery/
│   │   └── http/apollo-server.ts
│   ├── domain/
│   │   ├── entities/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── value-objects/
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma
│   │   │   │   └── migrations/
│   │   ├── repositories/
│   │   ├── file-storage/
│   │   ├── graphql/
│   │   │   ├── index.ts
│   │   │   ├── resolvers/
│   │   │   └── schemas/
│   │   └── ocr/
│   ├── usecases/
│   └── utils/
├── tests/
├── uploads/
└── web/
    ├── index.html
    ├── package.json
    ├── ...
    └── src/
        ├── App.tsx
        ├── pages/
        │   ├── HomePage.tsx
        │   ├── MinimalUploadTest.tsx
        │   ├── ReceiptDetailPage.tsx
        │   ├── ReceiptsPage.tsx
        │   └── UploadPage.tsx
        └── ...
```

- **src/domain/**: Business logic, entities, value objects, and service interfaces.
- **src/infrastructure/**: Database (Prisma), file storage (local/S3), OCR providers, GraphQL schemas/resolvers.
- **src/delivery/**: HTTP delivery (Apollo Server setup).
- **src/usecases/**: Application use cases (CRUD, filtering, upload, etc).
- **web/**: Minimal frontend (React/Next.js) for upload and result display.
- **uploads/**: Uploaded receipt images for testing.
- **tests/**: Unit and integration tests.

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Apollo GraphQL, Prisma ORM, PostgreSQL
- **OCR:** Tesseract.js (local) and/or Google Vision API (cloud)
- **Frontend:** Next.js (minimal, for upload & result display)
- **Other:** Docker (optional), BullMQ (optional for background OCR)

---

## 📦 Features
- Upload receipt images via GraphQL mutation
- Extracts:
  - Store name
  - Date of purchase
  - Total amount
  - List of purchased items (name & quantity)
- Saves structured data to PostgreSQL
- Query receipts and filter by date/store
- Minimal frontend for upload & result display

---

## 🗄️ Database Models (Prisma)
```prisma
model Receipt {
  id           String   @id @default(uuid())
  storeName    String
  purchaseDate DateTime
  totalAmount  Float
  items        Item[]
  imageUrl     String
  createdAt    DateTime @default(now())
}

model Item {
  id        String  @id @default(uuid())
  name      String
  quantity  Int?
  receiptId String
  receipt   Receipt @relation(fields: [receiptId], references: [id])
}
```

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/samObot19/receipt-ocr-api.git
cd receipt-ocr-api
npm install
```

### 2. Configure Environment
- Copy `.env.example` to `.env` and set your PostgreSQL connection string and any OCR API keys.

### 3. Run Database Migrations
```bash
npx prisma migrate dev --name init
```

### 4. Start the Backend
```bash
npm run dev
```

### 5. (Optional) Start the Frontend
```bash
cd web
npm install
npm run dev
```

---

## 🧪 Testing
- Use the provided minimal frontend (`web/`) or the included `index.html` for manual upload tests.
- Sample receipts and mocked OCR outputs are in the `uploads/` folder.

---

## 🧩 Extending the App
- **User Authentication:** Add user models and JWT-based auth to associate receipts with users.
- **Receipt Categorization:** Add a `category` field to receipts (e.g., groceries, dining, electronics).
- **Export Data:** Implement CSV/Excel export endpoints or GraphQL queries.
- **Background OCR:** Integrate BullMQ for async/background OCR processing.
- **More OCR Providers:** Add AWS Textract or other providers for improved accuracy.

---

## 📝 Documentation
- GraphQL schema and example queries/mutations are available in the `src/infrastructure/graphql/schemas/` folder.
- See code comments and folder structure for further details.

---


## 🐳 Docker Support

You can run the entire stack (PostgreSQL, backend, and frontend) using Docker Compose:

```bash
docker-compose up --build
```

This will:
- Start a PostgreSQL database (port 5432)
- Start the backend server (port 4000)
- Start the frontend (port 5173)

The backend will be available at http://localhost:4000/graphql
The frontend will be available at http://localhost:5173

To stop and remove containers, networks, and volumes:
```bash
docker-compose down -v
```

You can customize environment variables in the `docker-compose.yml` file as needed.

---

## 📚 License
MIT

---

## 🙋‍♂️ Questions?
Open an issue or contact the maintainer.
