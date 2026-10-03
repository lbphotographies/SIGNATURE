// --- GESTION DES ONGLETS ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`tab-${tabId}`).classList.add('active');
    event.target.classList.add('active');
}

// --- PAVÉ DE SIGNATURE (CANVAS) ---
const canvas = document.getElementById('signature-pad');
const ctx = canvas.getContext('2d');
let isDrawing = false;

ctx.strokeStyle = "#000000";
ctx.lineWidth = 2;

function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX || e.touches[0].clientX) - rect.left,
        y: (e.clientY || e.touches[0].clientY) - rect.top
    };
}

function startDrawing(e) {
    isDrawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveSignature() {
    const dataURL = canvas.toDataURL('image/png');
    alert("Signature enregistrée sous forme d'image PNG !");
    console.log("Signature Data URL:", dataURL);
}

// --- GESTION DE GOOGLE DOCS ---
function loadGDoc() {
    const url = document.getElementById('gdoc-url').value;
    if (!url.includes('docs.google.com/document/d/')) {
        alert("Veuillez entrer une URL Google Doc valide.");
        return;
    }
    // Conversion de l'URL Google Doc en lien de téléchargement PDF direct
    const docId = url.split('/d/')[1].split('/')[0];
    const pdfExportUrl = `https://docs.google.com/document/d/${docId}/export?format=pdf`;
    
    alert(`Document prêt à être exporté au format PDF : ${pdfExportUrl}`);
    window.open(pdfExportUrl, '_blank');
}

// --- GESTION DES CONTACTS ---
let contacts = [
    { name: "Jean Dupont", email: "jean.dupont@example.com" }
];

function renderContacts() {
    const list = document.getElementById('contacts-list');
    const select = document.getElementById('contact-select');
    
    list.innerHTML = '';
    select.innerHTML = '<option value="">-- Choisir un contact --</option>';

    contacts.forEach((contact, index) => {
        // Liste affichée
        const li = document.createElement('li');
        li.textContent = `${contact.name} (${contact.email})`;
        list.appendChild(li);

        // Select du formulaire de demande à distance
        const option = document.createElement('option');
        option.value = contact.email;
        option.textContent = `${contact.name} - ${contact.email}`;
        select.appendChild(option);
    });
}

function addContact(e) {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;

    contacts.push({ name, email });
    renderContacts();

    document.getElementById('add-contact-form').reset();
}

function importCSV() {
    const fileInput = document.getElementById('csv-input');
    const file = fileInput.files[0];

    if (!file) {
        alert("Sélectionnez un fichier CSV.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n');
        lines.forEach(line => {
            const [name, email] = line.split(',');
            if (name && email) {
                contacts.push({ name: name.trim(), email: email.trim() });
            }
        });
        renderContacts();
        alert("Contacts importés avec succès !");
    };
    reader.readAsText(file);
}

function sendRemoteRequest(e) {
    e.preventDefault();
    const recipient = document.getElementById('contact-select').value;
    alert(`Demande de signature envoyée avec succès à ${recipient} !`);
}

// Initialisation
renderContacts();