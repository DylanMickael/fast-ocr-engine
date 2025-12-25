import os
import shutil
from typing import Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from llama_cloud_services import LlamaExtract
from llama_cloud import ExtractConfig
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Key from environment or hardcoded as per user request (though environment is better)
API_KEY = os.getenv("LLAMA_CLOUD_API_KEY")

extractor = LlamaExtract()

# Data Schema matching the 7 fields
DATA_SCHEMA = {
    "type": "object",
    "properties": {
        "senderService": { "type": "string", "description": "Le nom du service qui envoie la lettre" },
        "receiverService": { "type": "string", "description": "Le nom du service à qui la lettre est adressée" },
        "date": { "type": "string", "description": "La date de la lettre" },
        "letterNumber": { "type": "string", "description": "Le numéro de référence de la lettre" },
        "subject": { "type": "string", "description": "L'objet de la lettre" },
        "importance": { 
            "type": "string", 
            "enum": ["Normal", "Urgent", "Très Urgent"]
        },
        "body": { "type": "string", "description": "Le corps(les paragraphes) de la lettre" }
    },
    "required": ["senderService", "receiverService", "date", "letterNumber", "subject", "importance", "body"],
    "additionalProperties": False
}

EXTRACTION_CONFIG = {
        "priority": None,
        "extraction_target": "PER_DOC",
        "extraction_mode": "PREMIUM",
        "parse_model": None,
        "extract_model": None,
        "multimodal_fast_mode": False,
        "system_prompt": None,
        "use_reasoning": False,
        "cite_sources": False,
        "citation_bbox": False,
        "confidence_scores": False,
        "chunk_mode": "PAGE",
        "high_resolution_mode": False,
        "invalidate_cache": False,
        "num_pages_context": None,
        "page_range": None
}

@app.post("/extract")
async def extract_letters(file: UploadFile = File(...)):
    # Create a temporary file to save the upload
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, file.filename)
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        config = ExtractConfig(**EXTRACTION_CONFIG)
        result = extractor.extract(DATA_SCHEMA, config, temp_path)
        
        # Cleanup
        os.remove(temp_path)
        
        return {"data": result.data}
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
