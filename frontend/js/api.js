const BACKEND_URL = "/api/extract";

/**
 * Calls the local FastAPI backend for structured extraction
 */
async function extractDataFromImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Backend error: ${response.statusText}`);
        }

        const result = await response.json();
        return result.data || {};
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error("Impossible de contacter le serveur backend. Assurez-vous que le serveur FastAPI (port 8000) est lancé.");
        }
        throw error;
    }
}
