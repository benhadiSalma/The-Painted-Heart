/* =========================================================
   1. HTML ELEMENTS
   ========================================================= */
const startBtn = document.getElementById("start-btn");
const homeScreen = document.getElementById("home-screen");
const explorerScreen = document.getElementById("explorer-screen");
const scrapbookScreen = document.getElementById("scrapbook-screen");
const galleryContainer = document.getElementById("gallery-container");
const scrapbookBtn = document.getElementById("scrapbook-btn");
const backBtn = document.getElementById("back-btn");

const searchInput = document.getElementById("search-input");
const communeSelect = document.getElementById("commune-select");
const sortSelect = document.getElementById("sort-select"); // NOUVEAU: Le select pour le tri
const favoritesBtn = document.getElementById("favorites-btn");

const globalThemeToggle = document.getElementById("global-theme-toggle");
const langSelect = document.getElementById("lang-select");
const explorerTitle = document.getElementById("explorer-title");

/* =========================================================
   1.B OBSERVER API (Animation au scroll)
   ========================================================= */
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const muralObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

/* =========================================================
   2. API CONFIG & GLOBAL STATE
   ========================================================= */
const API_URL = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/bruxelles_parcours_bd/records?limit=30";

let visitedMurals = JSON.parse(localStorage.getItem("visitedMurals")) || [];
let favoriteMurals = JSON.parse(localStorage.getItem("favoriteMurals")) || []; 
let muralNotes = JSON.parse(localStorage.getItem("muralNotes")) || {};
let muralsData = []; 

let currentSearch = "";
let currentCommune = "";
let showOnlyFavorites = false;
let currentLang = "en"; 

/* =========================================================
   3. TRANSLATIONS (i18n)
   ========================================================= */
const translations = {
    en: {
        homeTitle: "THE PAINTED HEART",
        homeSub: "Explore the streets of Brussels and play your part",
        startBtn: "START EXPLORING",
        explorerTitle: "Brussels Explorer",
        searchPlaceholder: "Search for a comic...",
        allCommunes: "All municipalities",
        favBtn: "❤️ Favorites",
        scrapBtn: "📖 Scrapbook",
        scrapTitle: "MY SCRAPBOOK 💥",
        backBtn: "← Back",
        loading: "Loading the comic streets...",
        noMurals: "No murals found matching criteria.",
        modalNotesTitle: "Detective Notes",
        modalSaveBtn: "SAVE ENTRY",
        modalPlaceholder: "Add clues here...",
        modalSavedMsg: "Entry saved.",
        modalLocation: "Location: ",
        errorEmpty: "Error: Note cannot be empty!",
        errorShort: "Error: Note is too short (min 5 characters)."
    },
    fr: {
        homeTitle: "LE CŒUR PEINT",
        homeSub: "Explorez les rues de Bruxelles et jouez votre rôle",
        startBtn: "COMMENCER L'EXPLORATION",
        explorerTitle: "Explorateur Bruxellois",
        searchPlaceholder: "Chercher une BD...",
        allCommunes: "Toutes les communes",
        favBtn: "❤️ Favoris",
        scrapBtn: "📖 Scrapbook",
        scrapTitle: "MON SCRAPBOOK 💥",
        backBtn: "← Retour",
        loading: "Chargement des rues BD...",
        noMurals: "Aucune fresque ne correspond aux critères.",
        modalNotesTitle: "Notes de Détective",
        modalSaveBtn: "SAUVEGARDER",
        modalPlaceholder: "Ajoutez des indices ici...",
        modalSavedMsg: "Note sauvegardée.",
        modalLocation: "Adresse : ",
        errorEmpty: "Erreur : La note ne peut pas être vide !",
        errorShort: "Erreur : Trop court (min 5 caractères)."
    },
    nl: {
        homeTitle: "HET GESCHILDERDE HART",
        homeSub: "Verken de straten van Brussel en speel je rol",
        startBtn: "BEGIN MET VERKENNEN",
        explorerTitle: "Brussel Verkenner",
        searchPlaceholder: "Zoek een strip...",
        allCommunes: "Alle gemeenten",
        favBtn: "❤️ Favorieten",
        scrapBtn: "📖 Plakboek",
        scrapTitle: "MIJN PLAKBOEK 💥",
        backBtn: "← Terug",
        loading: "Stripstraten laden...",
        noMurals: "Geen muurschilderingen gevonden.",
        modalNotesTitle: "Detective Notities",
        modalSaveBtn: "OPSLAAN",
        modalPlaceholder: "Voeg hier aanwijzingen toe...",
        modalSavedMsg: "Notitie opgeslagen.",
        modalLocation: "Locatie: ",
        errorEmpty: "Fout: Notitie mag niet leeg zijn!",
        errorShort: "Fout: Te kort (min 5 tekens)."
    }
};

function updateUILanguage() {
    const t = translations[currentLang];
    
    document.getElementById("main-title").textContent = t.homeTitle;
    document.getElementById("sub-title").textContent = t.homeSub;
    document.getElementById("start-btn").textContent = t.startBtn;
    explorerTitle.textContent = t.explorerTitle;
    
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
    if (document.querySelector("#commune-select option[value='']")) {
        document.querySelector("#commune-select option[value='']").textContent = t.allCommunes;
    }
    
    if (favoritesBtn) favoritesBtn.innerHTML = t.favBtn;
    if (scrapbookBtn) scrapbookBtn.innerHTML = t.scrapBtn;
    
    const scrapMainTitle = document.getElementById("scrap-main-title");
    if (scrapMainTitle) scrapMainTitle.textContent = t.scrapTitle;
    if (backBtn) backBtn.textContent = t.backBtn;

    if (muralsData.length > 0) {
        renderFilteredGallery();
        if (!scrapbookScreen.classList.contains("hidden-section")) {
            renderScrapbook();
        }
    }
}

/* =========================================================
   4. NAVIGATION ROUTING & GLOBAL THEME
   ========================================================= */
startBtn.addEventListener("click", () => {
    homeScreen.classList.replace("active-section", "hidden-section");
    explorerScreen.classList.replace("hidden-section", "active-section");
    if (muralsData.length === 0) fetchMurals();
});

scrapbookBtn.addEventListener("click", () => {
    explorerScreen.classList.replace("active-section", "hidden-section");
    scrapbookScreen.classList.replace("hidden-section", "active-section");
    renderScrapbook(); 
});

backBtn.addEventListener("click", () => {
    scrapbookScreen.classList.replace("active-section", "hidden-section");
    explorerScreen.classList.replace("hidden-section", "active-section");
});

explorerTitle.style.cursor = "pointer";
explorerTitle.addEventListener("click", () => {
    currentSearch = "";
    currentCommune = "";
    showOnlyFavorites = false;

    if (searchInput) searchInput.value = "";
    if (communeSelect) communeSelect.value = "";
    if (sortSelect) sortSelect.value = "";
    
    if (favoritesBtn) {
        favoritesBtn.style.background = "";
        favoritesBtn.style.color = "";
    }

    renderFilteredGallery();
});

const themeToggles = document.querySelectorAll("#global-theme-toggle, .theme-toggle, #scrap-theme-toggle");

themeToggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        themeToggles.forEach(btn => {
            btn.textContent = isDark ? "☀️" : "🌑";
        });
    });
});

/* =========================================================
   5. DATA FETCHING & FILTERING
   ========================================================= */
async function fetchMurals() {
    galleryContainer.innerHTML = `<p>${translations[currentLang].loading}</p>`;
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        const murals = data.results || [];

        if (murals.length === 0) {
            galleryContainer.innerHTML = `<p>${translations[currentLang].noMurals}</p>`;
            return;
        }

        muralsData = murals; 
        populateCommuneFilter(murals);
        renderFilteredGallery();
    } catch (error) {
        console.error("Fetch error:", error);
        galleryContainer.innerHTML = `<p style="color:red;">Communication error. Cannot reach the server.</p>`;
    }
}

function populateCommuneFilter(murals) {
    if (!communeSelect) return;
    const communes = [...new Set(murals.map(m => m.commune).filter(Boolean))].sort();
    
    communeSelect.innerHTML = `<option value="">${translations[currentLang].allCommunes}</option>`;
    communes.forEach(c => {
        communeSelect.innerHTML += `<option value="${c}">${c}</option>`;
    });
}

function renderFilteredGallery() {
    let filtered = muralsData.filter(mural => {
        const title = getMuralTitle(mural).toLowerCase();
        const commune = mural.commune || "";
        
        const matchesSearch = title.includes(currentSearch.toLowerCase());
        const matchesCommune = currentCommune === "" || commune === currentCommune;
        const matchesFavorite = !showOnlyFavorites || isFavorite(getMuralTitle(mural));
        
        return matchesSearch && matchesCommune && matchesFavorite;
    });

    // LOGIQUE DE TRI (A-Z / Z-A)
    if (sortSelect && sortSelect.value) {
        filtered.sort((a, b) => {
            const titleA = getMuralTitle(a).toLowerCase();
            const titleB = getMuralTitle(b).toLowerCase();
            if (sortSelect.value === "asc") return titleA.localeCompare(titleB);
            if (sortSelect.value === "desc") return titleB.localeCompare(titleA);
            return 0;
        });
    }

    renderMurals(filtered);
}

// Event Listeners pour les filtres
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        currentSearch = e.target.value;
        renderFilteredGallery();
    });
}

if (communeSelect) {
    communeSelect.addEventListener("change", (e) => {
        currentCommune = e.target.value;
        renderFilteredGallery();
    });
}

if (sortSelect) {
    sortSelect.addEventListener("change", () => {
        renderFilteredGallery();
    });
}

if (favoritesBtn) {
    favoritesBtn.addEventListener("click", () => {
        showOnlyFavorites = !showOnlyFavorites;
        if (showOnlyFavorites) {
            favoritesBtn.style.background = "var(--bd-red, #ff4b2b)";
            favoritesBtn.style.color = "white";
        } else {
            favoritesBtn.style.background = "";
            favoritesBtn.style.color = "";
        }
        renderFilteredGallery();
    });
}

if (langSelect) {
    langSelect.addEventListener("change", (e) => {
        currentLang = e.target.value;
        updateUILanguage();
    });
}

/* =========================================================
   6. EXPLORER: RENDER CARDS
   ========================================================= */
function renderMurals(murals) {
    galleryContainer.innerHTML = "";
    if (murals.length === 0) {
        galleryContainer.innerHTML = `<p>${translations[currentLang].noMurals}</p>`;
        return;
    }
    murals.forEach((mural) => {
        galleryContainer.appendChild(createMuralCard(mural));
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
            <button class="favorite-btn" title="Favorites">❤️</button>
            <button class="note-btn" title="Notes">✏️</button>
            <a href="${mapLink}" target="_blank" class="map-btn" title="Map">📍</a>
            <button class="visited-btn" title="Visited">✔️</button>
        </div>
    `;

    const muralImage = card.querySelector(".mural-image");
    const noteBtn = card.querySelector(".note-btn");
    const visitedBtn = card.querySelector(".visited-btn");
    const favoriteBtn = card.querySelector(".favorite-btn");

    muralImage.addEventListener("click", () => openImageModal(title, image, description, location));
    noteBtn.addEventListener("click", () => openImageModal(title, image, description, location));

    updateVisitedStyle(visitedBtn, title);
    visitedBtn.addEventListener("click", () => {
        toggleVisited(title);
        updateVisitedStyle(visitedBtn, title);
    });

    updateFavoriteStyle(favoriteBtn, title);
    favoriteBtn.addEventListener("click", () => {
        toggleFavorite(title);
        updateFavoriteStyle(favoriteBtn, title);
        if (showOnlyFavorites) renderFilteredGallery();
    });

    // Ajout de l'Observer sur cette carte générée
    muralObserver.observe(card);

    return card;
}

/* =========================================================
   7. SCRAPBOOK: RENDER BOARD
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

/* =========================================================
   8. MODAL LOGIC (Avec Validation de Formulaire)
   ========================================================= */
function openImageModal(title, image, description, location) {
    const existingModal = document.querySelector(".image-modal");
    if (existingModal) existingModal.remove();

    const t = translations[currentLang];
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
                <p><strong>${t.modalLocation}</strong> ${location}</p>
                <p>${description}</p>
                <div class="note-panel">
                    <h3>${t.modalNotesTitle}</h3>
                    <textarea class="note-textarea" placeholder="${t.modalPlaceholder}">${savedNote}</textarea>
                    <button class="save-note-btn">${t.modalSaveBtn}</button>
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
        const noteText = textarea.value.trim();
        
        // Logique de validation stricte
        if (noteText.length === 0) {
            saveMessage.style.color = "var(--bd-red, #E63946)";
            saveMessage.textContent = t.errorEmpty;
            return; 
        }
        
        if (noteText.length < 5) {
            saveMessage.style.color = "var(--bd-red, #E63946)";
            saveMessage.textContent = t.errorShort;
            return;
        }

        saveNote(title, noteText);
        saveMessage.style.color = "#1d6f42"; 
        saveMessage.textContent = t.modalSavedMsg;
        setTimeout(() => saveMessage.textContent = "", 2000);
    });
}

const scrapThemeToggle = document.getElementById("scrap-theme-toggle");

/* =========================================================
   9. DATA HELPERS & DYNAMIC LANGUAGE LOGIC
   ========================================================= */
function getMuralTitle(mural) { 
    return mural.nom_de_la_fresque || "Unknown Comic"; 
}
function getMuralImage(mural) { 
    return mural.image?.url || "img/bd-cover.png"; 
}
function getMuralMapLink(mural) { 
    return mural.google_maps || "#"; 
}
function getMuralLocation(mural) {
    let address = "";
    if (currentLang === "nl") {
        address = mural.adresse_nl || mural.adresse_fr || "Unknown street";
    } else {
        address = mural.adresse_fr || mural.adresse_nl || "Unknown street";
    }
    const city = mural.commune || "Brussels";
    return `${address}, ${city}`;
}
function getMuralDescription(mural) {
    const title = mural.nom_de_la_fresque || "This mural";
    const artist = mural.dessinateur || "Unknown artist";
    const year = mural.date || "an unknown year";
    
    if (currentLang === "fr") {
        return `${title} est une fresque basée sur l'œuvre de ${artist}, créée en ${year}. Elle fait partie du parcours BD de Bruxelles.`;
    } else if (currentLang === "nl") {
        return `${title} is een stripmuur gebaseerd op het werk van ${artist}, gemaakt in ${year}. Het maakt deel uit van de Brusselse Striproute.`;
    }
    return `${title} is a comic mural based on the work of ${artist}, created in ${year}. It is part of the Brussels Comic Book Route.`;
}

/* =========================================================
   10. LOCAL STORAGE & STATE LOGIC
   ========================================================= */
function saveVisitedMurals() { localStorage.setItem("visitedMurals", JSON.stringify(visitedMurals)); }
function isVisited(title) { return visitedMurals.includes(title); }
function toggleVisited(title) {
    if (isVisited(title)) visitedMurals = visitedMurals.filter((item) => item !== title);
    else visitedMurals.push(title);
    saveVisitedMurals();
}
function updateVisitedStyle(button, title) {
    if (isVisited(title)) button.classList.add("visited-active");
    else button.classList.remove("visited-active");
}

function saveFavoriteMurals() { localStorage.setItem("favoriteMurals", JSON.stringify(favoriteMurals)); }
function isFavorite(title) { return favoriteMurals.includes(title); }
function toggleFavorite(title) {
    if (isFavorite(title)) favoriteMurals = favoriteMurals.filter((item) => item !== title);
    else favoriteMurals.push(title);
    saveFavoriteMurals();
}
function updateFavoriteStyle(button, title) {
    if (isFavorite(title)) button.classList.add("favorite-active");
    else button.classList.remove("favorite-active");
}

function saveMuralNotes() { localStorage.setItem("muralNotes", JSON.stringify(muralNotes)); }
function getNote(title) { return muralNotes[title] || ""; }
function saveNote(title, text) {
    muralNotes[title] = text;
    saveMuralNotes();
}