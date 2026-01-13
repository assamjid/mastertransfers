

const DEFAULT_REVIEWS = [
 {name:"Sarah", stars:5, msg:"Chauffeur très ponctuel, voiture propre, service parfait.", country:"fr"},
 {name:"John", stars:5, msg:"Excursion Paradise Valley incroyable. Organisation top !", country:"gb"},
 {name:"Fatima", stars:5, msg:"Très bonne communication WhatsApp, je recommande.", country:"ma"}
];

  
const LANG = {

FR:{
  service_choose:"Choisir service",
  transfer_choose:"Choisir transfert",
  intercity_choose:"Choisir Trajet",
  excursion_choose:"Choisir Excursion",
  pickup:"Lieu de prise en charge",
  dropoff:"Destination",
  flight:"Numéro de vol",
  date:"Date",
  time:"Heure de prise en charge",
  fixedtime:"Choisir l’horaire",
  name:"Nom et Prénom",
  email:"Email",
  phone:"Téléphone",
  note:"Demandes spéciales",
  reserve:"Réserver maintenant",
  pay:"💳 Payer par carte",
  subtitle_transfer:"Détails de votre transfert",
  subtitle_intercity:"Détails du transport interville",
  subtitle_excursion:"Détails de votre excursion",
  places: "Nombre de places",
  upto5: "Moins de 5"
},

EN:{
  service_choose:"Choose Service",
  transfer_choose:"Choose Transfer",
  intercity_choose:"Choose Route",
  excursion_choose:"Choose Excursion",
  pickup:"Pickup location",
  dropoff:"Drop-off location",
  flight:"Flight number",
  date:"Date",
  time:"Pickup time",
  fixedtime:"Select time",
  name:"Full name",
  email:"Email",
  phone:"Phone number",
  note:"Special requests",
  reserve:"Book Now",
  pay:"💳 Pay by Card",
  subtitle_transfer:"Transfer details",
  subtitle_intercity:"Intercity transfer details",
  subtitle_excursion:"Excursion details",
  places: "Number of people",
  upto5: "Up to 5"
}

};

  let lang = localStorage.getItem("lang");
if(!lang){
  lang = "EN";
  localStorage.setItem("lang","EN");
      }
  
/* =====================================================
   VARIABLES GLOBALES
===================================================== */


/* =====================================================
   RÉFÉRENCES DOM
===================================================== */
const bookingForm = document.getElementById("bookingForm");

const service = document.getElementById("service");
const bookingSubtitle = document.getElementById("bookingSubtitle");

const transferFields = document.getElementById("transferFields");
const intervillesFields = document.getElementById("intervillesFields");
const circuitsFields = document.getElementById("circuitsFields");

const transferType = document.getElementById("transferType");
const depart = document.getElementById("depart");
const arrivee = document.getElementById("arrivee");
const transferPlaces = document.getElementById("transferPlaces");
const transferPrix = document.getElementById("transferPrix");
const flightNumber = document.getElementById("flightNumber");
const flightField = document.getElementById("flightField");
flightField.style.display = "none";   // caché par défaut

const trajet = document.getElementById("trajet");
const places = document.getElementById("places");
const prix = document.getElementById("prix");

const circuit = document.getElementById("circuit");
const circuitPlaces = document.getElementById("circuitPlaces");
const circuitPrix = document.getElementById("circuitPrix");

const nom = document.getElementById("nom");
const tel = document.getElementById("tel");
const email = document.getElementById("email");
const countryCode = document.getElementById("countryCode");

const dateInput = document.getElementById("date");
const heure = document.getElementById("heure");
const message = document.getElementById("message");

const quadTypeField = document.getElementById("quadTypeField");
const quadType = document.getElementById("quadType");

const camelTypeField = document.getElementById("camelTypeField");
const camelType = document.getElementById("camelType");

const fixedTimeField = document.getElementById("fixedTimeField");
const fixedTime = document.getElementById("fixedTime");

const heureField = document.getElementById("heureField");

  

  

/* =====================================================
   DATE & TÉLÉPHONE
===================================================== */
const today = new Date().toISOString().split("T")[0];
dateInput.value = today;
dateInput.min = today;
heure.value = "07:00";

tel.addEventListener("input", () => {
  tel.value = tel.value
    .replace(/\D/g, "")
    .slice(0, 15);
});

/* =====================================================
   RESET GLOBAL
===================================================== */
function resetAll() {
  transferFields.style.display = "none";
  intervillesFields.style.display = "none";
  circuitsFields.style.display = "none";

  bookingSubtitle.textContent = "";

  [
    transferType, depart, arrivee, transferPlaces,
    trajet, places, circuit, circuitPlaces
  ].forEach(el => {
    el.value = "";
    el.required = false;
    el.disabled = false;   // ⬅️ IMPORTANT
  });

  flightNumber.value = "";
  flightNumber.required = false;
  flightNumber.disabled = false;

  transferPrix.value = "";
  prix.value = "";
  circuitPrix.value = "";

  quadType.value = "";
  camelType.value = "";
  quadTypeField.style.display = "none";
  camelTypeField.style.display = "none";

  depart.readOnly = false;
  arrivee.readOnly = false;

  quadType.required = false;
camelType.required = false;
fixedTime.required = false;

  setHeureMode("hidden");
}


/* =====================================================
   CHOIX SERVICE
===================================================== */

    service.addEventListener("change", () => {
  resetAll();

  if (service.value === "airport") {
    bookingSubtitle.textContent = LANG[lang].subtitle_transfer;
    transferFields.style.display = "flex";

    transferType.required = true;
    depart.required = true;
    arrivee.required = true;
    transferPlaces.required = true;

    setHeureMode("free");   // 🔥 REMET L’HEURE
  }

  if (service.value === "intercity") {
    bookingSubtitle.textContent = LANG[lang].subtitle_intercity;
    intervillesFields.style.display = "flex";

    trajet.required = true;
    places.required = true;

    setHeureMode("free");   // 🔥 REMET L’HEURE
  }

  if (service.value === "excursion") {
    bookingSubtitle.textContent = LANG[lang].subtitle_excursion;
    circuitsFields.style.display = "flex";

    circuit.required = true;
    circuitPlaces.required = true;

    updateCircuitPlaces();
    updateExcursionTimes(); // gère heure / horaires fixes
  }
});

/* =====================================================
   TRANSFERT – LOGIQUE
===================================================== */
transferType.addEventListener("change", () => {

  /* ===============================
     RESET
  =============================== */
  flightField.style.display = "none";
  flightNumber.required = false;
  flightNumber.value = "";

  depart.readOnly = false;
  arrivee.readOnly = false;

  /* ===============================
     TRANSFERT PRIVÉ PERSONNALISÉ
  =============================== */
  if (
    transferType.value === "Transfert Privé Personnalisé" ||
    transferType.value === "Customized Private Transfer"
  ) {
    transferPrix.value = lang === "EN" ? "On request" : "Sur devis";
    return;
  }

  /* ===============================
     TRANSFERT AÉROPORT / AIRPORT
  =============================== */
  if (
    transferType.value.includes("Aéroport") ||
    transferType.value.includes("Airport")
  ) {
    flightField.style.display = "block";
    }

  /* ===============================
     AUTO-REMPLISSAGE AÉROPORT AGADIR
  =============================== */
  const v = transferType.value.toLowerCase();

  // Départ depuis l'aéroport
  if (
    v.startsWith("aéroport d'agadir") ||
    v.startsWith("agadir airport")
  ) {
    depart.value = "Agadir Al Massira Airport";
    depart.readOnly = true;
  }

  // Arrivée à l'aéroport
  if (
    v.endsWith("aéroport d'agadir") ||
    v.endsWith("agadir airport")
  ) {
    arrivee.value = "Agadir Al Massira Airport";
    arrivee.readOnly = true;
  }

  /* ===============================
     RECALCUL DU PRIX
  =============================== */
  if (transferPlaces.value) {
    calculPrixTransfert();
  }
});


/* =====================================================
   PRIX TRANSFERT
===================================================== */

function calculPrixTransfert() {
  if (!transferPlaces.value || transferType.value === "Transfert Privé Personnalisé") return;

  const nb = parseInt(transferPlaces.value, 10);
  let base = 0, extra = 0;

  if (transferType.value.includes("Agadir ville")) {
    base = 30; extra = 2;
  }

  if (transferType.value.includes("Taghazout Bay")) {
    base = 40; extra = 2.5;
  }

  transferPrix.value = (base + Math.max(0, nb - 4) * extra) + " €";
}
transferPlaces.addEventListener("change", calculPrixTransfert);



/* =====================================================
   PRIX INTERVILLES
===================================================== */
const intervillesPrices = {
  "Agadir / Taghazout vers Marrakech": { base: 125, extra: 25 },
  "Marrakech vers Agadir / Taghazout": { base: 125, extra: 25 },

  "Agadir / Taghazout vers Essaouira": { base: 110, extra: 18 },
  "Essaouira vers Agadir / Taghazout": { base: 110, extra: 18 },

  "Agadir / Taghazout vers Taroudant": { base: 90, extra: 15 },
  "Taroudant vers Agadir / Taghazout": { base: 90, extra: 15 },

  "Agadir / Taghazout vers Casablanca": { base: 350, extra: 30 },
  "Casablanca vers Agadir / Taghazout": { base: 350, extra: 30 },

  "Agadir / Taghazout vers Rabat": { base: 400, extra: 30 },
  "Rabat vers Agadir / Taghazout": { base: 400, extra: 30 },

  "Agadir / Taghazout vers Fès": { base: 650, extra: 35 },
  "Fès vers Agadir / Taghazout": { base: 650, extra: 35 },

  "Agadir / Taghazout vers Tanger": { base: 750, extra: 40 },
  "Tanger vers Agadir / Taghazout": { base: 750, extra: 40 },

  "Agadir / Taghazout vers Imsouane": { base: 70, extra: 10 },
  "Imsouane vers Agadir / Taghazout": { base: 70, extra: 10 }
};

function calculPrixIntervilles() {
  if (!trajet.value || !places.value) {
    prix.value = "";
    return;
  }

  const data = intervillesPrices[trajet.value];
  if (!data) {
    prix.value = "";
    return;
  }

  const nb = parseInt(places.value, 10);
  prix.value = (data.base + Math.max(0, nb - 5) * data.extra) + " €";
}


trajet.addEventListener("change", calculPrixIntervilles);
places.addEventListener("change", calculPrixIntervilles);



/* =====================================================
   PRIX CIRCUITS
===================================================== */
const circuitPrices = {
  "Excursion Paradise Valley": { base: 70, extra: 5 },
  "Tour de la ville de Agadir": { base: 60, extra: 5 },
  "Souk El Had – Circuit Shopping": { base: 40, extra: 5 },
  "Visite du Crocoparc": { base: 60, extra: 5 },
  "Téléphérique et visite de la Kasbah": { base: 30, extra: 4 },
  "Dunes de Timlaline – Expérience Désert": { base: 70, extra: 5 },
  "Safari Quad / Buggy": { base: 100, extra: 10 },   // adapte si besoin
  "Chameau": { base: 40, extra: 5 }   
};

/* =====================================================
   PRIX PAR PERSONNE
===================================================== */

const PERSON_PRICE = {
  "Quad simple": 25,
  "Buggy": 70,
  "Promenade seule": 15,
  "Promenade + dîner": 25
};


/* =====================================================
   CALCUL PRIX CIRCUIT
===================================================== */
function calculPrixCircuit() {

  if (!circuit.value || !circuitPlaces.value) {
    circuitPrix.value = "";
    return;
  }

  const nb = parseInt(circuitPlaces.value, 10);

  // 🏜️ Quad / Buggy
  if (circuit.value === "Safari Quad / Buggy") {

    if (!quadType.value) {
      circuitPrix.value = "";
      return;
    }

    const pricePerPerson = PERSON_PRICE[quadType.value];
    const total = pricePerPerson * nb;

    circuitPrix.value = `${total} €`;
    return;
  }

    // 🐪 Chameau
   if (circuit.value === "Chameau") {

  if (!camelType.value) {
    circuitPrix.value = "";
    return;
  }

  const pricePerPerson = PERSON_PRICE[camelType.value];
  const total = pricePerPerson * nb;

  circuitPrix.value = `${total} €`;
  return;
}


  // 🌴 Autres excursions (prix groupe)
  const data = circuitPrices[circuit.value];
  if (!data) return;

  circuitPrix.value =
    (data.base + Math.max(0, nb - 5) * data.extra) + " €";
}

function updateCircuitPlaces() {

  circuitPlaces.innerHTML = "";

  // OPTION PAR DÉFAUT (TOUJOURS)
  const base = document.createElement("option");
  base.value = "";
  base.dataset.fr = "Nombre de places";
  base.dataset.en = "Number of people";
  base.textContent = LANG[lang].places;
  circuitPlaces.appendChild(base);

  // Quad & Chameau = 1 → 15
  if (circuit.value === "Safari Quad / Buggy" || circuit.value === "Chameau") {

    for (let i = 1; i <= 15; i++) {
      const o = document.createElement("option");
      o.value = i;
      o.dataset.fr = i;
      o.dataset.en = i;
      o.textContent = i;
      circuitPlaces.appendChild(o);
    }

    translateSelects(lang);
    return;
  }

  // Autres excursions = Moins de 5, puis 6 → 15
  const less = document.createElement("option");
  less.value = "5";
  less.dataset.fr = "Moins de 5";
  less.dataset.en = "Up to 5";
  less.textContent = LANG[lang].upto5;
  circuitPlaces.appendChild(less);

  for (let i = 6; i <= 15; i++) {
    const o = document.createElement("option");
    o.value = i;
    o.dataset.fr = i;
    o.dataset.en = i;
    o.textContent = i;
    circuitPlaces.appendChild(o);
  }

  translateSelects(lang);
  circuitPlaces.value = "";
  circuitPlaces.selectedIndex = 0;
}


function updateExcursionTimes(){

  fixedTime.innerHTML = "";
  fixedTime.required = false;

  // mode par défaut
  setHeureMode("hidden");

  /* ===== CHAMEAU ===== */
  if (circuit.value === "Chameau") {

    // tant que le type n’est pas choisi, on ne montre rien
    if (!camelType.value) {
      setHeureMode("hidden");
      return;
    }

    setHeureMode("fixed");
    fixedTime.required = true;

    if (camelType.value === "Promenade seule") {
      ["10:00", "15:00", "17:00"].forEach(h =>
        fixedTime.add(new Option(h, h))
      );
    }

    if (camelType.value === "Promenade + dîner") {
      fixedTime.add(new Option("17:00", "17:00"));
    }

    return;
  }

  /* ===== QUAD / BUGGY ===== */
  if (circuit.value === "Safari Quad / Buggy") {

    // tant que le type n’est pas choisi, on ne montre rien
    if (!quadType.value) {
      setHeureMode("hidden");
      return;
    }

    setHeureMode("fixed");
    fixedTime.required = true;

    ["09:00", "12:00", "14:00", "17:30"].forEach(h =>
      fixedTime.add(new Option(h, h))
    );

    return;
  }

  /* ===== AUTRES EXCURSIONS ===== */

  setHeureMode("normal");

  if (circuit.value === "Excursion Paradise Valley") {
    ["09:00"].forEach(h => fixedTime.add(new Option(h,h)));
  }

  if (circuit.value === "Tour de la ville de Agadir") {
    ["09:30", "14:30"].forEach(h => fixedTime.add(new Option(h,h)));
  }

  if (circuit.value === "Souk El Had – Circuit Shopping") {
    ["09:30", "14:30"].forEach(h => fixedTime.add(new Option(h,h)));
  }

  if (circuit.value === "Visite du Crocoparc") {
    ["09:30", "14:30"].forEach(h => fixedTime.add(new Option(h,h)));
  }

  if (circuit.value === "Téléphérique et visite de la Kasbah") {
    ["10:00", "16:00"].forEach(h => fixedTime.add(new Option(h,h)));
  }

  if (circuit.value === "Dunes de Timlaline – Expérience Désert") {
    ["15:00"].forEach(h => fixedTime.add(new Option(h,h)));
  }

  fixedTime.required = true;
}



circuit.addEventListener("change", () => {

  // RESET
  quadTypeField.style.display = "none";
  camelTypeField.style.display = "none";
  quadType.value = "";
  camelType.value = "";
  quadType.required = false;
  camelType.required = false;

  // 🏜️ Quad / Buggy
  if (circuit.value === "Safari Quad / Buggy") {
    quadTypeField.style.display = "block";
    quadType.required = true;   // ⬅️ OBLIGATOIRE
  }

  // 🐪 Chameau
  if (circuit.value === "Chameau") {
    camelTypeField.style.display = "block";
    camelType.required = true;  // ⬅️ OBLIGATOIRE
  }

  updateCircuitPlaces();
  calculPrixCircuit();
  updateExcursionTimes();
});

  
quadType.addEventListener("change", calculPrixCircuit);
circuitPlaces.addEventListener("change", calculPrixCircuit);
camelType.addEventListener("change", calculPrixCircuit);
camelType.addEventListener("change", updateExcursionTimes);
quadType.addEventListener("change", updateExcursionTimes);

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


/* =====================================================
   SOUMISSION – RÉSUMÉ & WHATSAPP (FINAL PRO)
===================================================== */
  
  bookingForm.addEventListener("submit", function(e){
  e.preventDefault();

  if (!bookingForm.checkValidity()) return;

  let price = "";
  if(service.value === "airport")   price = transferPrix.value;
  if(service.value === "intercity") price = prix.value;
  if(service.value === "excursion") price = circuitPrix.value;

  document.getElementById("finalPrice").value = price || "Sur devis";

  const timeValue = fixedTimeField.style.display === "block" ? fixedTime.value : heure.value;

  let type="-", choix="", departTxt="-", destTxt="-", placesTxt="-";

  if(service.value==="airport"){ type=transferType.value; departTxt=depart.value; destTxt=arrivee.value; placesTxt=transferPlaces.value; }
  if(service.value==="intercity"){ type=trajet.value; placesTxt=places.value; }
  if(service.value==="excursion"){ type=circuit.value; choix=quadType.value||camelType.value||"-"; placesTxt=circuitPlaces.value; }

  let msg = `📩 *NOUVELLE RÉSERVATION MASTERTRIPTRANSFERS*\n\n`;
  if(nom.value) msg+=`👤 *Nom* : ${nom.value}\n`;
  if(tel.value) msg+=`📞 *Téléphone* : +${countryCode.value}${tel.value}\n`;
  if(email.value) msg+=`📧 *Email* : ${email.value}\n\n`;
  if(service.value) msg+=`🛎️ *Service* : ${service.options[service.selectedIndex].text}\n`;
  if(type!=="-") msg+=`🚘 *Type* : ${type}\n`;
  if(service.value==="excursion" && choix!=="-") msg+=`🎯 *Choix* : ${choix}\n`;
  if(depart.value) msg+=`📍 *Départ* : ${depart.value}\n`;
  if(arrivee.value) msg+=`🏁 *Destination* : ${arrivee.value}\n`;
  if(placesTxt!=="-") msg+=`👥 *Places* : ${placesTxt}\n`;
  if(flightNumber.value) msg+=`✈️ *Vol* : ${flightNumber.value}\n`;
  if(dateInput.value) msg+=`📅 *Date* : ${dateInput.value}\n`;
  if(timeValue) msg+=`⏰ *Heure* : ${timeValue}\n`;
  if(message.value) msg+=`\n📝 *Message* : ${message.value}\n`;
  if(price) msg+=`\n💰 *Prix* : ${price}\n`;

  document.getElementById("emailMessage").value = msg;

  let recap = "";
  if(nom.value) recap+=`<p><b>👤 Nom :</b> ${nom.value}</p>`;
  if(tel.value) recap+=`<p><b>📞 Téléphone :</b> +${countryCode.value}${tel.value}</p>`;
  if(email.value) recap+=`<p><b>📧 Email :</b> ${email.value}</p><hr>`;
  if(service.value) recap+=`<p><b>🛎️ Service :</b> ${service.options[service.selectedIndex].text}</p>`;
  if(type!=="-") recap+=`<p><b>🚘 Type :</b> ${type}</p>`;
  if(choix!=="-") recap+=`<p><b>🎯 Choix :</b> ${choix}</p>`;
  if(depart.value) recap+=`<p><b>📍 Départ :</b> ${depart.value}</p>`;
  if(arrivee.value) recap+=`<p><b>🏁 Destination :</b> ${arrivee.value}</p>`;
  if(placesTxt!=="-") recap+=`<p><b>👥 Places :</b> ${placesTxt}</p>`;
  if(flightNumber.value) recap+=`<p><b>✈️ Vol :</b> ${flightNumber.value}</p>`;
  if(dateInput.value) recap+=`<p><b>📅 Date :</b> ${dateInput.value}</p>`;
  if(timeValue) recap+=`<p><b>⏰ Heure :</b> ${timeValue}</p>`;
  if(message.value) recap+=`<p><b>📝 Message :</b> ${message.value}</p>`;
  if(price) recap+=`<p><b>💰 Prix :</b> ${price}</p>`;

  openResume(recap, msg);
});

  
  
/* =====================================================
   OVERLAY ANIMÉ
===================================================== */
function openResume(html, text) {
  
  const overlay = document.getElementById("resumeOverlay");
  document.getElementById("resumeContent").innerHTML = html;
  overlay.style.display = "flex";
  overlay.offsetHeight;
  overlay.classList.add("active");
}

function closeResume() {
  const overlay = document.getElementById("resumeOverlay");
  overlay.classList.remove("active");
  setTimeout(() => overlay.style.display = "none", 250);
}

/* =====================================================
   BOUTONS RÉSUMÉ
===================================================== */

const btnCancel = document.getElementById("resumeCancel");
const btnConfirm = document.getElementById("resumeConfirm");

if (btnCancel && btnConfirm) {

  btnCancel.addEventListener("click", closeResume);

  btnConfirm.addEventListener("click", function(e){
  e.preventDefault();

  

  const msg = document.getElementById("emailMessage").value;

  // WhatsApp avec message PRÉ-REMPLI (OBLIGATOIRE)
  location.href = "https://wa.me/212691059759?text=" + encodeURIComponent(msg);

  // Envoi email juste après
  setTimeout(() => bookingForm.submit(), 500);

  setTimeout(() => {

  // Reset HTML natif
  bookingForm.reset();

  // Reset JS complet
  resetAll();

  // Vide tous les champs cachés
  ["emailMessage","finalPrice"].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.value = "";
  });

  // Remet la langue
  setLang(lang);

  // Force la remise à zéro des selects
  document.querySelectorAll("#bookingForm select").forEach(s=>{
    s.selectedIndex = 0;
  });

  // Remet date/heure par défaut
  dateInput.value = today;
  heure.value = "07:00";

  // Nettoie le sous-titre
  bookingSubtitle.textContent = "";

    // 🔥 Retour sur "Choisir service"
service.value = "";
service.dispatchEvent(new Event("change"));
    // Reset DATE
dateInput.value = today;
dateInput.dispatchEvent(new Event("change"));

// Reset HEURE
heure.value = "07:00";
heure.dispatchEvent(new Event("change"));

// Reset MESSAGE
message.value = "";
message.dispatchEvent(new Event("input"));

heure.closest(".floating-field").style.display = "block";

  // Ferme le popup
  closeResume();

}, 1200);
});
  
  }




/* =====================================================
   FERMETURE OVERLAY AU CLIC EXTÉRIEUR
===================================================== */

const resumeOverlay = document.getElementById("resumeOverlay");

if (resumeOverlay) {
  resumeOverlay.addEventListener("click", e => {
    if (e.target === resumeOverlay) {
      closeResume();
    }
  });
}


// Vitesse photos. SLIDERS RAPIDES (cartes excursions)
document.querySelectorAll(".exc-slider.auto.fast").forEach(slider=>{
  let i = 0;
  setInterval(()=>{
    i++;
    if(i >= slider.children.length) i = 0;
    slider.scrollTo(slider.clientWidth * i, 0);
  }, 5000);   // 5 secondes
});

// SLIDERS LENTS (fiches détaillées)
document.querySelectorAll(".exc-slider.auto.slow").forEach(slider=>{
  let i = 0;
  setInterval(()=>{
    i++;
    if(i >= slider.children.length) i = 0;
    slider.scrollTo(slider.clientWidth * i, 0);
  }, 8000);   // 8 secondes
});

function fixBookingScroll(){
  const header = document.getElementById("mainHeader");
  const section = document.getElementById("booking");

  const y = section.getBoundingClientRect().top + window.pageYOffset - header.offsetHeight + 5;

  window.scrollTo(0, y);
}




function openService(serviceValue) {

  // Scroll propre vers la réservation
  fixBookingScroll();

  // Attendre que le scroll + DOM soient prêts
  setTimeout(() => {
    const serviceSelect = document.getElementById("service");
    if (!serviceSelect) return;

    serviceSelect.value = serviceValue;
    serviceSelect.dispatchEvent(new Event("change"));
  }, 200);
             }

function openExcursion(excursionValue) {

  // Scroll vers la réservation
  fixBookingScroll();

  // Forcer le service "excursion"
  service.value = "excursion";
  service.dispatchEvent(new Event("change"));

  // Attendre l’ouverture des champs excursions
  setTimeout(() => {
    const circuitSelect = document.getElementById("circuit");
    if (!circuitSelect) return;

    circuitSelect.value = excursionValue;
    circuitSelect.dispatchEvent(new Event("change"));
  }, 250);
}


function goExcursions(){
  const header = document.getElementById("mainHeader");
  const exc = document.getElementById("excursions");
  const y = exc.offsetTop - header.offsetHeight - 15;

  window.scrollTo(0, y);
}
  




function setHeureMode(mode, defaultValue = "") {
  if (mode === "free") {
    heureField.style.display = "block";
    heure.required = true;
    if (defaultValue) heure.value = defaultValue;

    fixedTimeField.style.display = "none";
    fixedTime.required = false;
    fixedTime.value = "";
  }

  if (mode === "fixed") {
    heureField.style.display = "none";
    heure.required = false;

    fixedTimeField.style.display = "block";
    fixedTime.required = true;
  }

  if (mode === "hidden") {
    heureField.style.display = "none";
    heure.required = false;

    fixedTimeField.style.display = "none";
    fixedTime.required = false;
    fixedTime.value = "";
  }
}

function openInterville(trajetValue) {

  // Scroll vers la réservation
  fixBookingScroll();

  // Forcer le service "intercity"
  setTimeout(() => {
    service.value = "intercity";
    service.dispatchEvent(new Event("change"));

    // Attendre l’ouverture des champs inter-villes
    setTimeout(() => {
      const trajetSelect = document.getElementById("trajet");
      if (!trajetSelect) return;

      trajetSelect.value = trajetValue;
      trajetSelect.dispatchEvent(new Event("change"));
    }, 200);
  }, 200);
}

 function scrollToExcursionDetail(name){
  const details = document.querySelectorAll("#excursionDetails .exc-detail");
  details.forEach(d=>{
    const h = d.querySelector("h3");
    if(h && h.textContent.trim() === name){
      const header = document.getElementById("mainHeader");
      const y = d.getBoundingClientRect().top + window.pageYOffset - header.offsetHeight - 15;
      window.scrollTo(0, y);
    }
  });
}

  function goInterville(){
  const header = document.getElementById("mainHeader");
  const sec = document.getElementById("popularDestinations");
  const y = sec.getBoundingClientRect().top + window.pageYOffset - header.offsetHeight - 15;
  window.scrollTo(0, y);
  }

  function payByCard(){
  window.open("https://buy.stripe.com/xxxxxxxxx","_blank");
  }

  /* =====================================================
   MOTEUR MULTI-LANGUE MASTERTRIP (FR / EN)
===================================================== */


  
  
  function translateTexts(lang){
  document.querySelectorAll("[data-fr]").forEach(el=>{
    el.textContent = (lang === "EN" && el.dataset.en)
      ? el.dataset.en
      : el.dataset.fr;
  });
    // 🔒 Protège le sous-titre excursion
if(service.value === "excursion"){
  bookingSubtitle.textContent = LANG[lang].subtitle_excursion;
}
}

  function translateSelects(lang){
  document.querySelectorAll("select").forEach(select=>{
    select.querySelectorAll("option").forEach(option=>{
      if(lang === "EN" && option.dataset.en){
        option.textContent = option.dataset.en;
      }
      if(lang === "FR" && option.dataset.fr){
        option.textContent = option.dataset.fr;
      }
    });
  });
    // 🔒 Protège le sous-titre excursion
if(service.value === "excursion"){
  bookingSubtitle.textContent = LANG[lang].subtitle_excursion;
}
  }
  function setPlaceholders(lang){

  const PH = {
    FR:{
      depart:"Adresse, aéroport, hôtel...",
      arrivee:"Adresse, aéroport, hôtel...",
      flight:"Ex : FR456",
      price:"0,00€",
      message:"Bagages, siège bébé...",
      phone:"Téléphone",
      email:"Exemple@gmail.com"
    },
    EN:{
      depart:"Address, airport, hotel...",
      arrivee:"Address, airport, hotel...",
      flight:"Eg: FR456",
      price:"0.00€",
      message:"Luggage, baby seat...",
      phone:"Phone number",
      email:"Exemple@gmail.com"
    }
    
  };

  if(depart) depart.placeholder = PH[lang].depart;
  if(arrivee) arrivee.placeholder = PH[lang].arrivee;
  if(flightNumber) flightNumber.placeholder = PH[lang].flight;
  if(transferPrix) transferPrix.placeholder = PH[lang].price;
  if(prix) prix.placeholder = PH[lang].price;
  if(circuitPrix) circuitPrix.placeholder = PH[lang].price;
  if(message) message.placeholder = PH[lang].message;
  if(tel) tel.placeholder = PH[lang].phone;
  if(email) email.placeholder = PH[lang].email;
        }

/* =====================================================
   APPLIQUER LANGUE
===================================================== */
function setLang(langParam) {

  // 🌍 Sauvegarde + variable globale
  lang = langParam;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang === "EN" ? "en" : "fr";

  /* ===============================
     TEXTES SIMPLES (data-fr / data-en)
  =============================== */
  translateTexts(lang);

  /* ===============================
     OPTIONS DES SELECT
  =============================== */
  translateSelects(lang);

  /* ===============================
     PLACEHOLDERS
  =============================== */
  setPlaceholders(lang);

  /* ===============================
     BOUTONS
  =============================== */
  document.getElementById("btnReserve").innerText = LANG[lang].reserve;
  document.getElementById("btnPay").innerText = LANG[lang].pay;

  /* ===============================
     SOUS-TITRE FORMULAIRE
  =============================== */
  if (service.value === "airport") {
    bookingSubtitle.textContent = LANG[lang].subtitle_transfer;
  }

  if (service.value === "intercity") {
    bookingSubtitle.textContent = LANG[lang].subtitle_intercity;
  }

  if (service.value === "excursion") {
    bookingSubtitle.textContent = LANG[lang].subtitle_excursion;
  }

  /* ===============================
     LABELS PRIX (€)
  =============================== */
  document.querySelectorAll("input[readonly] + label").forEach(label => {
    label.textContent = lang === "EN" ? "Price (€)" : "Prix (€)";
  });
  
  if(service.value === "excursion"){
  updateCircuitPlaces();
  }

}
  
 
 
  function toggleLang(){
  const current = localStorage.getItem("lang") || "EN";
  setLang(current === "FR" ? "EN" : "FR");
  updateLangFlag();
}

function updateLangFlag(){
  const current = localStorage.getItem("lang") || "EN";
  const flag = document.getElementById("langFlagBtn");

  if(current === "FR"){
    flag.src = "https://flagcdn.com/w40/gb.png";
    flag.title = "English";
  } else {
    flag.src = "https://flagcdn.com/w40/fr.png";
    flag.title = "Français";
  }
}

  
  function sendReview(){
  const name  = document.getElementById("reviewName").value.trim();
  const msg   = document.getElementById("reviewMessage").value.trim();
  const stars = document.getElementById("reviewStars").value;
  const countryCode = document.getElementById("reviewCountry").value;

  if(!name || !msg || !stars) return alert("Veuillez remplir tous les champs.");

  let all = JSON.parse(localStorage.getItem("reviews")) || [];
  all.unshift({name, msg, stars, country:countryCode});
  localStorage.setItem("reviews", JSON.stringify(all));

  loadReviews();

  document.getElementById("reviewName").value = "";
  document.getElementById("reviewMessage").value = "";
  document.getElementById("reviewStars").value = "";
  }
  
  
function saveReview(name, stars, msg, country){
  const all = JSON.parse(localStorage.getItem("reviews") || "[]");
  all.unshift({name, stars, msg, country});
  localStorage.setItem("reviews", JSON.stringify(all));
}

function loadReviews(){
  let all = JSON.parse(localStorage.getItem("reviews"));

  if(!all || all.length === 0){
    localStorage.setItem("reviews", JSON.stringify(DEFAULT_REVIEWS));
    all = DEFAULT_REVIEWS;
  }

  const wrap = document.getElementById("liveReviews");
  wrap.innerHTML="";

  all.forEach((r,i)=>{
    const box = document.createElement("div");
    box.className="review-card";

    const starsDiv = document.createElement("div");
    starsDiv.className="review-stars";
    starsDiv.textContent="⭐".repeat(r.stars);

    const msgDiv = document.createElement("div");
    msgDiv.className="review-msg";
    msgDiv.textContent="“"+r.msg+"”";

    const nameDiv = document.createElement("div");
    nameDiv.className="review-name";
    nameDiv.innerHTML = `<span>${r.name}</span>`;

    box.appendChild(starsDiv);
    box.appendChild(msgDiv);
    box.appendChild(nameDiv);

    box.addEventListener("contextmenu", e=>{
      e.preventDefault();
      if(confirm("Supprimer cet avis ?")){
        let all = JSON.parse(localStorage.getItem("reviews"));
        all.splice(i,1);
        localStorage.setItem("reviews", JSON.stringify(all));
        box.remove();
      }
    });

    wrap.appendChild(box);
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  setLang(lang);
  updateLangFlag();
  loadReviews();   // système reviews sécurisé
});


  setInterval(()=>{
  document.querySelectorAll("#mainHeader nav a").forEach(btn=>{
    btn.classList.add("menu-shake");
    setTimeout(()=>btn.classList.remove("menu-shake"),600);
  });
},4000);

  function enableAdminDelete(){

  const container = document.getElementById("liveReviews");
  if (!container) return alert("Reviews not ready yet");

  const password = "1590";
  const p = prompt("Code admin ?");
  if(p !== password) return;

  let all = JSON.parse(localStorage.getItem("reviews") || "[]");

  const cards = container.querySelectorAll(".review-card");

  cards.forEach((card)=>{
    const btn = document.createElement("span");
    btn.innerHTML = "🗑️";
    btn.style.cssText = `
      position:absolute;
      top:8px;
      right:10px;
      cursor:pointer;
      font-size:20px;
      z-index:10;
    `;

    btn.onclick = ()=>{
      const msg = card.querySelector(".review-msg").innerText;
      all = all.filter(r => r.msg !== msg);
      localStorage.setItem("reviews", JSON.stringify(all));
      card.remove();
    };

    card.style.position = "relative";
    card.appendChild(btn);
  });
}



