/* =========================================================
   1. HTML ELEMENTS
   ========================================================= */
const startBtn = document.getElementById("start-btn");
const homeScreen = document.getElementById("home-screen");
const explorerScreen = document.getElementById("explorer-screen");
const scrapbookScreen = document.getElementById("scrapbook-screen");
const favoritesScreen = document.getElementById("favorites-screen"); 
const galleryContainer = document.getElementById("gallery-container");
const scrapbookBtn = document.getElementById("scrapbook-btn");
const favoritesBtn = document.getElementById("favorites-btn"); 
const backBtn = document.getElementById("back-btn");
const backFromFavBtn = document.getElementById("back-from-fav-btn"); 

/* =========================================================
   2. API CONFIG & GLOBAL STATE
   ========================================================= */
const API_URL = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/bruxelles_parcours_bd/records?limit=30";

let visitedMurals = JSON.parse(localStorage.getItem("visitedMurals")) || [];
let favoriteMurals = JSON.parse(localStorage.getItem("favoriteMurals")) || []; 
let muralNotes = JSON.parse(localStorage.getItem("muralNotes")) || {};

let muralsData = []; 

/* =========================================================
   3. NAVIGATION ROUTING
   ========================================================= */
startBtn.addEventListener("click", () => {
    homeScreen.classList.replace("active-section", "hidden-section");
    explorerScreen.classList.replace("hidden-section", "active-section");
    fetchMurals();
});

scrapbookBtn.addEventListener("click", () => {
    explorerScreen.classList.replace("active-section", "hidden-section");
    scrapbookScreen.classList.replace("hidden-section", "active-section");
    renderScrapbook(); 
});


favoritesBtn.addEventListener("click", () => {
    explorerScreen.classList.replace("active-section", "hidden-section");
    favoritesScreen.classList.replace("hidden-section", "active-section");
    renderFavorites(); 
});


document.querySelectorAll("#back-btn").forEach(btn => {
    btn.addEventListener("click", () => {
       
        scrapbookScreen.classList.replace("active-section", "hidden-section");
        favoritesScreen.classList.replace("active-section", "hidden-section");
        
        
        explorerScreen.classList.replace("hidden-section", "active-section");
    });
});

/* =========================================================
   4. DATA FETCHING
   ========================================================= */
async function fetchMurals() {
    galleryContainer.innerHTML = "<p>Loading the comic streets...</p>";
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        const murals = data.results || [];
        if (murals.length === 0) {
            galleryContainer.innerHTML = "<p>No murals found.</p>";
            return;
        }
        muralsData = murals; 
        renderMurals(murals);
    } catch (error) {
        console.error("Fetch error:", error);
        galleryContainer.innerHTML = `<p style="color:red;">Communication error.</p>`;
    }
}

/* =========================================================
   5. EXPLORER: RENDER CARDS
   ========================================================= */
function renderMurals(murals) {
    galleryContainer.innerHTML = "";
    murals.forEach((mural) => {
        const card = createMuralCard(mural);
        galleryContainer.appendChild(card);
    });
}

function createMuralCard(mural) {
    const card = document.createElement("article");
    card.classList.add("mural-card");

    const title = getMuralTitle(mural);
    const image = getMuralImage(mural);
    const location = getMuralLocation(mural);
    const description = getMuralDescription(mural);
    const mapLink = getMuralMapLink(mural);

    card.innerHTML = `
        <img src="${image}" alt="${title}" class="mural-image" onerror="this.src='img/bd-cover.png'">
        <div class="mural-info">
            <h3 class="mural-title">${title}</h3>
            <p class="mural-location">${location}</p>
        </div>
        <div class="mural-actions">
            <button class="favorite-btn" title="Add to favorites">❤️</button>
            <button class="note-btn" title="Open case file">✏️</button>
            <a href="${mapLink}" target="_blank" class="map-btn" title="Show on map">📍</a>
            <button class="visited-btn" title="Mark as found">✔️</button>
        </div>
    `;

    const muralImage = card.querySelector(".mural-image");
    const noteBtn = card.querySelector(".note-btn");
    const visitedBtn = card.querySelector(".visited-btn");
    const favoriteBtn = card.querySelector(".favorite-btn"); 

    muralImage.addEventListener("click", () => openImageModal(title, image, description, location));
    noteBtn.addEventListener("click", () => openImageModal(title, image, description, location));

    //  Visited
    updateVisitedStyle(visitedBtn, title);
    visitedBtn.addEventListener("click", () => {
        toggleVisited(title);
        updateVisitedStyle(visitedBtn, title);
    });

    // Gestion Favoris
    updateFavoriteStyle(favoriteBtn, title);
    favoriteBtn.addEventListener("click", () => {
        toggleFavorite(mural);
        updateFavoriteStyle(favoriteBtn, title);
    });

    return card;
}

/* =========================================================
   6. SCRAPBOOK & FAVORITES: RENDER
   ========================================================= */
function renderScrapbook() {
    const container = document.getElementById("scrapbook-container");
    container.innerHTML = "";
    muralsData.forEach(mural => {
        const title = getMuralTitle(mural);
        const image = getMuralImage(mural);
        const hasVisited = isVisited(title);
        const card = document.createElement("div");
        card.classList.add("scrap-card");
        card.innerHTML = `
            <div class="scrap-polaroid ${hasVisited ? "unlocked" : "locked"}">
                <div class="tape"></div>
                <img src="${image}" alt="${title}" onerror="this.src='img/bd-cover.png'">
                ${!hasVisited 
                    ? `<div class="lock-overlay"><span class="lock-text">🔒 MYSTERY</span></div>` 
                    : `<div class="comic-badge">BAM!</div>`
                }
                <p class="scrap-title">${title}</p>
            </div>
        `;
        container.appendChild(card);
    });
}


function renderFavorites() {
    const container = document.getElementById("favorites-container");
    container.innerHTML = "";
    if (favoriteMurals.length === 0) {
        container.innerHTML = "<p class='empty-msg'>Your heart is empty... Add some favorites! ❤️</p>";
        return;
    }
    favoriteMurals.forEach(mural => {
        const card = createMuralCard(mural);
        container.appendChild(card);
    });
}

/* =========================================================
   7. MODAL LOGIC (Gardé tel quel)
   ========================================================= */
function openImageModal(title, image, description, location) {
    const existingModal = document.querySelector(".image-modal");
    if (existingModal) existingModal.remove();
    const savedNote = getNote(title);
    const modal = document.createElement("div");
    modal.classList.add("image-modal");
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="close-modal-btn">✖</button>
            <img src="${image}" alt="${title}" class="modal-image" onerror="this.src='img/bd-cover.png'">
            <div class="modal-text">
                <h2>${title}</h2>
                <p><strong>Location:</strong> ${location}</p>
                <p>${description}</p>
                <div class="note-panel">
                    <h3>Detective Notes</h3>
                    <textarea class="note-textarea" placeholder="Add clues here...">${savedNote}</textarea>
                    <button class="save-note-btn">SAVE ENTRY</button>
                    <p class="save-note-message"></p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const closeBtn = modal.querySelector(".close-modal-btn");
    const overlay = modal.querySelector(".modal-overlay");
    const textarea = modal.querySelector(".note-textarea");
    const saveBtn = modal.querySelector(".save-note-btn");
    const saveMessage = modal.querySelector(".save-note-message");
    closeBtn.addEventListener("click", () => modal.remove());
    overlay.addEventListener("click", () => modal.remove());
    saveBtn.addEventListener("click", () => {
        saveNote(title, textarea.value.trim());
        saveMessage.textContent = "Entry saved.";
        setTimeout(() => saveMessage.textContent = "", 2000);
    });
}

/* =========================================================
   8. DATA HELPERS
   ========================================================= */
function getMuralTitle(mural) { return mural.nom_de_la_fresque || "Unknown Comic"; }
function getMuralImage(mural) { return mural.image?.url || "img/bd-cover.png"; }
function getMuralMapLink(mural) { return mural.google_maps || "#"; }
function getMuralLocation(mural) {
    const address = mural.adresse_fr || "Unknown street";
    const city = mural.commune || "Brussels";
    return `${address}, ${city}`;
}
function getMuralDescription(mural) {
    const artist = mural.dessinateur || "Unknown artist";
    const year = mural.date || "an unknown year";
    return `This mural is based on the work of ${artist}, created in ${year}. It is part of the Brussels Comic Book Route.`;
}

/* =========================================================
   9. LOCAL STORAGE & STATE LOGIC
   ========================================================= */
function saveVisitedMurals() { localStorage.setItem("visitedMurals", JSON.stringify(visitedMurals)); }
function isVisited(title) { return visitedMurals.includes(title); }

function toggleVisited(title) {
    if (isVisited(title)) {
        visitedMurals = visitedMurals.filter((item) => item !== title);
    } else {
        visitedMurals.push(title);
    }
    saveVisitedMurals();
}

function updateVisitedStyle(button, title) {
    button.classList.toggle("visited-active", isVisited(title));
}


function toggleFavorite(mural) {
    const title = getMuralTitle(mural);
    const isFav = favoriteMurals.some(m => getMuralTitle(m) === title);
    if (isFav) {
        favoriteMurals = favoriteMurals.filter(m => getMuralTitle(m) !== title);
    } else {
        favoriteMurals.push(mural);
    }
    localStorage.setItem("favoriteMurals", JSON.stringify(favoriteMurals));
}

function updateFavoriteStyle(button, title) {
    const isFav = favoriteMurals.some(m => getMuralTitle(m) === title);
    button.classList.toggle("favorite-active", isFav);
}

function saveMuralNotes() { localStorage.setItem("muralNotes", JSON.stringify(muralNotes)); }
function getNote(title) { return muralNotes[title] || ""; }
function saveNote(title, text) {
    muralNotes[title] = text;
    saveMuralNotes();
}
/* =========================================================
   10. FILTERING LOGIC
   ========================================================= */

const searchInput = document.getElementById("search-input");
const communeSelect = document.getElementById("commune-select");

function applyFilters() {
    
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCommune = communeSelect.value.toLowerCase();

     const filteredMurals = muralsData.filter(mural => {
        const title = getMuralTitle(mural).toLowerCase();
        const commune = (mural.commune || "").toLowerCase();
        
        const matchesSearch = title.includes(searchTerm);
        const matchesCommune = selectedCommune === "" || commune.includes(selectedCommune);
        
        return matchesSearch && matchesCommune;
    });

    
    renderMurals(filteredMurals);
}


searchInput.addEventListener("input", applyFilters);
communeSelect.addEventListener("change", applyFilters);

/* =========================================================
   11. THEME TOGGLE
   ========================================================= */

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌑';
    }
});
/* =========================================================
   12. LANGUAGE TOGGLE
   ========================================================= */
const translations = {
    en: {
        title: "BRUSSELS EXPLORER",
        search: "Search title...",
        favorites: "❤️ MY FAVORITES",
        scrapbook: "SCRAPBOOK"
    },
    fr: {
        title: "BRUXELLES EXPLORER",
        search: "Chercher...",
        favorites: "❤️ MES FAVORIS",
        scrapbook: "ALBUM"
    }
};

document.getElementById('language-select').addEventListener('change', (e) => {
    const lang = e.target.value;
    
   
    document.querySelector('.header-title-box h1').textContent = translations[lang].title;
    document.getElementById('search-input').placeholder = translations[lang].search;
    document.getElementById('favorites-btn').textContent = translations[lang].favorites;
    document.getElementById('scrapbook-btn').textContent = translations[lang].scrapbook;
});