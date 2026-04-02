# Project: The Painted Heart - Brussels Comic Explorer

## Projectbeschrijving
**The Painted Heart** is een interactieve webapplicatie die de Brusselse striproute transformeert in een digitale ontdekkingstocht. Dit project integreert gamificatie-elementen om de gebruikersbetrokkenheid te verhogen via:

* **Exploratie:** Dynamische verkenning van de stad op basis van reële data.
* **Progressie:** Een "Scrapbook" (plakboek) dat visueel ontgrendeld wordt naarmate de gebruiker murals bezoekt.
* **Personalisatie:** Een systeem voor favorieten en persoonlijke "detective notities" per locatie.

---

## Gebruikte API
De applicatie is gebouwd op de officiële **Open Data API van Brussel**.
* **Dataset:** Bruxelles Parcours BD
* **Endpoint:** `https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/bruxelles_parcours_bd/records?limit=30`

---

## Technische Implementatie (JavaScript)
Hieronder volgt een overzicht van de integratie van de vereiste technische concepten in `script.js`:

### 1. DOM Manipulatie & Events
* **Selectie & Manipulatie:** Gebruik van `document.getElementById` en `querySelector` voor het dynamisch bijwerken van de interface (o.a. de galerij en modal-vensters) **[Lijn ...]**.
* **Events:** Interactiebeheer via `addEventListener` voor navigatie, filters en de thema-switcher **[Lijn ...]**.

### 2. Modern JavaScript (ES6+)
* **Data-structuren:** Gebruik van `const` en `let` voor een voorspelbare variabele-scope.
* **Template Literals:** Dynamische HTML-generatie voor kaarten en het Scrapbook middels backticks **[Lijn ...]**.
* **Array Methodes:** Toepassing van `.forEach()`, `.filter()`, `.map()` en `.sort()` voor zoekfunctionaliteiten en sortering (A-Z) **[Lijn ...]**.
* **Arrow Functions & Ternary Operators:** Gebruikt voor beknopte logica, specifiek voor de statuscontrole ("unlocked") in het Scrapbook **[Lijn ...]**.

### 3. Asynchrone Code & API
* **Async/Await & Fetch:** De functie `fetchMurals` voert asynchrone verzoeken uit en verwerkt JSON-responses op een robuuste wijze **[Lijn ...]**.
* **Intersection Observer API:** Geïmplementeerd om de visuele belasting te optimaliseren en vloeiende overgangen te creëren bij het scrollen **[Lijn ...]**.

### 4. Opslag & Validatie
* **Formulier Validatie:** Strikte logica in de modal; notities worden uitsluitend opgeslagen indien ze voldoen aan de minimale lengte van 5 tekens **[Lijn ...]**.
* **LocalStorage:** Volledige persistentie van de gebruikerssessie (favorieten, bezochte murals en notities) via `JSON.parse` en `JSON.stringify` **[Lijn ...]**.

---

## Styling & Layout
* **CSS Grid:** Een responsieve galerij die zich automatisch aanpast aan verschillende schermformaten zonder overbodige media queries.
* **Flexbox:** Toegepast voor de navigatiebalk en de uitlijning van de modal-inhoud.
* **Design System:** Gebruik van CSS-variabelen voor een consistente implementatie van de **Dark Mode**.

---

## Installatie
1. Download of clone de GitHub repository.
2. Zorg dat de mappenstructuur behouden blijft (`index.html`, `style.css`, `script.js` en de `/img` map).
3. Open `index.html` via een lokale server (zoals de **Live Server** extensie in VSCode) voor optimale werking van de API-verzoeken.

---

## Team & Taakverdeling
Dit project is het resultaat van een gelijkwaardige samenwerking (50/50) met een focus op code-kwaliteit:

* **Yassmine:** Verantwoordelijk voor UI-modules, zoekfunctionaliteit, favorietensysteem en de logica van de dark mode.
* **Selma:** Verantwoordelijk voor de architectuur, API-integratie (fetch/async), LocalStorage-persistentie en debugging.

---

## Gebruik van AI
We hebben AI-tools (Gemini en ChatGPT) ingezet als ondersteuning voor code-optimalisatie, architecturaal advies en probleemoplossing (debugging).

* **AI Chatlog Selma (Gemini):** [https://gemini.google.com/share/c907342c542e](https://gemini.google.com/share/c907342c542e)
  *Focus op architectuur, API fetch, LocalStorage en debugging.*
* **AI Chatlog Yassmine (Gemini):** [Link invoegen]
  *Focus op UI-componenten. Aanvullende zoekopdrachten via ChatGPT zijn helaas niet opgeslagen door gebruik zonder account.*
