# Llama OCR - Intelligent Archiving System

An intelligent OCR system designed to digitize and archive administrative letters. This project features a **FastAPI** backend that extracts structured data using **LlamaIndex (LlamaExtract)** and serves a premium **Vanilla JS** frontend.

## 🚀 Key Features

- **Intelligent Extraction**: Uses LlamaExtract with a strict JSON schema to capture:
  - **Sender**: Entity sending the letter.
  - **Receiver**: Intended recipient.
  - **Date**: Document date.
  - **Letter Number**: Official reference number.
  - **Subject**: Main topic of the letter.
  - **Importance**: Categorized as Normal, Urgent, or Very Urgent.
  - **Body**: Full text paragraphs of the letter.
- **Premium UI**: Modern dark-themed interface with glassmorphism and smooth animations.
- **Integrated CRUD**: Save, view, search, and delete archived letters (stored in browser's local storage).
- **Single Server Architecture**: Fast development and deployment with FastAPI serving both the API and the static frontend.

## 🛠️ Project Structure

```text
ocr-js/
├── backend/            # FastAPI Microservice (Python)
│   ├── main.py         # Main server (API + Static File Hosting)
│   ├── .env            # Environment variables (LLAMA_CLOUD_API_KEY)
│   └── requirements.txt # Python dependencies
├── frontend/           # Web Interface (HTML/CSS/JS)
│   ├── index.html      # Main UI
│   ├── css/            # Stylesheets
│   └── js/             # Application logic (Vanilla JS)
├── README.md           # Documentation
└── .gitignore          # Git exclusion rules
```

## ⚙️ Setup Instructions

### 1. Prerequisites
- Python 3.9+
- A LlamaCloud API Key from [LlamaIndex](https://cloud.llamaindex.ai/)

### 2. Backend Installation
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   virtualenv venv
   .\venv\Scripts\activate
   ```
3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend` folder and add your key:
   ```env
   LLAMA_CLOUD_API_KEY=your_llama_cloud_api_key_here
   ```

### 3. Launching the Application
Run the FastAPI server from the `backend` folder:
```bash
uvicorn main:app --reload
```
Navigate to **`http://localhost:8000`** in your browser to use the app.

## 📖 How to Use

1. **Upload**: Drag and drop a letter image into the upload card.
2. **Process**: Wait for the AI analysis (**PREMIUM** mode enabled for maximum accuracy).
3. **Review**: The extracted data will populate the form automatically.
4. **Archive**: Click "Enregistrer" to save the letter to your local archive.
5. **Manage**: Use the "Archive" tab to search through your documents or delete entries.

---
*Powered by LlamaIndex & FastAPI*
