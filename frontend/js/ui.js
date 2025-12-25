/**
 * Handles all UI transitions, event listeners, and rendering
 */
const UI = {
    // Views
    scanView: document.getElementById('view-scan'),
    archiveView: document.getElementById('view-archive'),

    // Components
    dropZone: document.getElementById('drop-zone'),
    fileInput: document.getElementById('file-input'),
    processingState: document.getElementById('processing-state'),
    resultView: document.getElementById('result-view'),
    archiveList: document.getElementById('archive-list'),
    emptyArchive: document.getElementById('empty-archive'),
    imagePreview: document.getElementById('image-preview'),
    extractForm: document.getElementById('extract-form'),
    searchInput: document.getElementById('search-input'),

    // Navigation
    navScan: document.getElementById('nav-scan'),
    navArchive: document.getElementById('nav-archive'),

    init() {
        this.setupEventListeners();
        this.renderArchive();
    },

    setupEventListeners() {
        // Navigation
        this.navScan.addEventListener('click', () => this.switchView('scan'));
        this.navArchive.addEventListener('click', () => this.switchView('archive'));

        // Upload
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('drag-over');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.handleFileUpload(file);
            }
        });

        this.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this.handleFileUpload(file);
        });

        // Search
        this.searchInput.addEventListener('input', (e) => {
            this.renderArchive(e.target.value);
        });

        // Form Submit
        this.extractForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Modal Close
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('modal').classList.add('hidden');
        });
    },

    switchView(viewName) {
        if (viewName === 'scan') {
            this.scanView.classList.remove('hidden');
            this.archiveView.classList.add('hidden');
            this.navScan.classList.add('active');
            this.navArchive.classList.remove('active');
        } else {
            this.scanView.classList.add('hidden');
            this.archiveView.classList.remove('hidden');
            this.navScan.classList.remove('active');
            this.navArchive.classList.add('active');
            this.renderArchive();
        }
    },

    async handleFileUpload(file) {
        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Transition to processing
        this.dropZone.classList.add('hidden');
        this.processingState.classList.remove('hidden');

        try {
            // function from api.js
            const data = await extractDataFromImage(file);
            this.displayResults(data);
        } catch (error) {
            console.error(error);
            alert("Erreur d'extraction : " + error.message);
            this.resetUpload();
        }
    },

    displayResults(data) {
        this.processingState.classList.add('hidden');
        this.resultView.classList.remove('hidden');

        // Fill form
        const form = this.extractForm;
        form.senderService.value = data.senderService || '';
        form.receiverService.value = data.receiverService || '';
        form.date.value = data.date || '';
        form.letterNumber.value = data.letterNumber || '';
        form.subject.value = data.subject || '';
        form.importance.value = data.importance || 'Normal';
        form.body.value = data.body || '';
    },

    handleFormSubmit() {
        const formData = new FormData(this.extractForm);
        const letterData = {
            senderService: formData.get('senderService'),
            receiverService: formData.get('receiverService'),
            date: formData.get('date'),
            letterNumber: formData.get('letterNumber'),
            subject: formData.get('subject'),
            importance: formData.get('importance'),
            body: formData.get('body'),
            imageData: this.imagePreview.src
        };

        // function from storage.js
        saveLetter(letterData);
        alert("Lettre enregistrée !");
        this.resetUpload();
        this.switchView('archive');
    },

    resetUpload() {
        this.dropZone.classList.remove('hidden');
        this.processingState.classList.add('hidden');
        this.resultView.classList.add('hidden');
        this.extractForm.reset();
        this.imagePreview.src = '';
    },

    renderArchive(query = '') {
        // function from storage.js
        const letters = searchLetters(query);
        this.archiveList.innerHTML = '';

        if (letters.length === 0) {
            this.emptyArchive.classList.remove('hidden');
            return;
        }

        this.emptyArchive.classList.add('hidden');
        letters.forEach(letter => {
            const card = document.createElement('div');
            card.className = 'letter-card glass';

            const importanceClass = (letter.importance || '').toLowerCase().includes('urgent') ? 'tag-urgent' : 'tag-normal';

            card.innerHTML = `
                <span class="card-tag ${importanceClass}">${letter.importance}</span>
                <div class="card-title">${letter.subject}</div>
                <div class="card-info">
                    <div><strong>De:</strong> ${letter.senderService}</div>
                    <div><strong>N°:</strong> ${letter.letterNumber} | <strong>Le:</strong> ${letter.date}</div>
                </div>
                <div class="card-actions">
                    <button class="action-btn view-btn" data-id="${letter.id}">Voir</button>
                    <button class="action-btn delete-btn" data-id="${letter.id}">Supprimer</button>
                </div>
            `;

            card.querySelector('.view-btn').onclick = () => this.showDetails(letter);

            card.querySelector('.delete-btn').onclick = (e) => {
                e.stopPropagation();
                if (confirm("Supprimer cette lettre ?")) {
                    // function from storage.js
                    deleteLetter(letter.id);
                    this.renderArchive(this.searchInput.value);
                }
            };

            this.archiveList.appendChild(card);
        });
    },

    showDetails(letter) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');

        modalBody.innerHTML = `
            <h2>${letter.subject}</h2>
            <div class="detail-grid">
                <div class="detail-item"><strong>Expéditeur:</strong> ${letter.senderService}</div>
                <div class="detail-item"><strong>Destinataire:</strong> ${letter.receiverService}</div>
                <div class="detail-item"><strong>Date:</strong> ${letter.date}</div>
                <div class="detail-item"><strong>N° Lettre:</strong> ${letter.letterNumber}</div>
                <div class="detail-item"><strong>Importance:</strong> ${letter.importance}</div>
            </div>
            <div class="detail-body">
                <h3>Corps de la lettre</h3>
                <pre style="white-space: pre-wrap; font-family: inherit;">${letter.body}</pre>
            </div>
            ${letter.imageData ? `<div class="detail-img"><img src="${letter.imageData}" style="max-width: 100%; border-radius: 8px; margin-top: 1rem;"></div>` : ''}
        `;

        modal.classList.remove('hidden');
    }
};
