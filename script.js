/* =========================================================
   1. HTML ELEMENTS
   ========================================================= */
const startBtn = document.getElementById("start-btn");
const homeScreen = document.getElementById("home-screen");
const explorerScreen = document.getElementById("explorer-screen");
const galleryContainer = document.getElementById("gallery-container");

/* =========================================================
   2. API CONFIG & GLOBAL STATE
   ========================================================= */

const API_URL =
  "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/bruxelles_parcours_bd/records?limit=30";

/* =========================================================
   3) LOCAL STORAGE
   ========================================================= */

let visitedMurals = JSON.parse(localStorage.getItem("visitedMurals")) || [];
let favoriteMurals = JSON.parse(localStorage.getItem("favoriteMurals")) || []; 
let muralNotes = JSON.parse(localStorage.getItem("muralNotes")) || {};

/* =========================================================
   3. NAVIGATION ROUTING
   ========================================================= */

startBtn.addEventListener("click", () => {
    homeScreen.classList.replace("active-section", "hidden-section");
    explorerScreen.classList.replace("hidden-section", "active-section");
    fetchMurals();
});

/* =========================================================
   4. DATA FETCHING
   ========================================================= */
async function fetchMurals() {
  galleryContainer.innerHTML = "<p>Loading murals...</p>";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const murals = data.results || [];

    if (murals.length === 0) {
      galleryContainer.innerHTML = "<p>No murals found.</p>";
      return;
    }

    renderMurals(murals);
  } catch (error) {
    console.error("Fetch error:", error);
    galleryContainer.innerHTML =
      `<p style="color:red;">Unable to load murals right now.</p>`;
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

  muralImage.addEventListener("click", () => {
    openImageModal(title, image, description, location);
  });

  noteBtn.addEventListener("click", () => {
    openImageModal(title, image, description, location);
  });

  updateVisitedButton(visitedBtn, title);

  visitedBtn.addEventListener("click", () => {
    toggleVisited(title);
    updateVisitedButton(visitedBtn, title);
  });

    return card;
}

/* =========================================================
   11) UPDATE VISITED BUTTON STYLE
   ========================================================= */

function updateVisitedButton(button, title) {
  if (isVisited(title)) {
    button.classList.add("visited-active");
  } else {
    button.classList.remove("visited-active");
  }
}

/* =========================================================
   12) OPEN IMAGE MODAL
   ========================================================= */
function openImageModal(title, image, description, location) {
  const existingModal = document.querySelector(".image-modal");

  if (existingModal) {
    existingModal.remove();
  }

  const savedNote = getNote(title);

  const modal = document.createElement("div");
  modal.classList.add("image-modal");

  modal.innerHTML = `
    <div class="modal-overlay"></div>

    <div class="modal-content">
      <button class="close-modal-btn" aria-label="Close modal">✖</button>

      <img 
        src="${image}" 
        alt="${title}" 
        class="modal-image"
        onerror="this.src='img/bd-cover.png'"
      >

      <div class="modal-text">
        <h2>${title}</h2>

        <div class="modal-location-badge">
          ${location}
        </div>

        <div class="modal-description">
          <p>${description}</p>
        </div>

        <div class="note-panel">
          <h3 class="note-title">My personal note</h3>

          <textarea
            class="note-textarea"
            placeholder="Write your thoughts, impressions, or useful details here..."
          >${savedNote}</textarea>

          <button class="save-note-btn">Save note</button>

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

  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  overlay.addEventListener("click", () => {
    modal.remove();
  });

  saveBtn.addEventListener("click", () => {
    const noteText = textarea.value.trim();
    saveNote(title, noteText);

    saveMessage.textContent = "Note saved successfully.";
    setTimeout(() => {
      saveMessage.textContent = "";
    }, 1800);
  });
}