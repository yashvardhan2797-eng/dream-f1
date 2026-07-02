const API_URL = "http://127.0.0.1:5000/dashboard";

const circuitImages = {

    "Albert Park Circuit": "australia.png",

    "Shanghai International Circuit": "shanghai.png",

    "Suzuka Circuit": "suzuka.png",

    "Bahrain International Circuit": "bahrain.png",

    "Jeddah Corniche Circuit": "jeddah.png",

    "Miami International Autodrome": "miami.png",

    "Autodromo Enzo e Dino Ferrari": "imola.png",

    "Circuit de Monaco": "monaco.png",

    "Circuit de Barcelona-Catalunya": "barcelona.png",

    "Circuit Gilles Villeneuve": "montreal.png",

    "Red Bull Ring": "austria.png",

    "Silverstone Circuit": "silverstone.png",

    "Circuit de Spa-Francorchamps": "spa.png",

    "Hungaroring": "hungary.png",

    "Circuit Zandvoort": "zandvoort.png",

    "Autodromo Nazionale Monza": "monza.png",

    "Baku City Circuit": "baku.png",

    "Marina Bay Street Circuit": "singapore.png",

    "Circuit of the Americas": "austin.png",

    "Autodromo Hermanos Rodriguez": "mexico.png",

    "Autodromo Jose Carlos Pace": "interlagos.png",

    "Las Vegas Strip Circuit": "las-vegas.png",

    "Lusail International Circuit": "qatar.png",

    "Yas Marina Circuit": "yas-marina.png",

    "Circuito de Madring": "madring.png"

};

async function loadDashboard() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        updateDashboard(data);

    } catch (error) {
        console.error(error);
    }
}

loadDashboard();

function updateDashboard(data) {

    const sessionInfo = document.getElementById("session-info");

    const circuitImage =
    circuitImages[data.meeting.circuit_short_name]
    || "yas-marina.png";

    sessionInfo.innerHTML = `
        <div class="live-badge">
            <span class="live-dot"></span>
            LIVE
        </div>

        <h3 class="gp-title">
            ${data.meeting.meeting_name}
        </h3>

        <img
    class="circuit-image"
    src="assets/images/circuits/${circuitImage}"
    alt="${data.meeting.circuit_short_name}">

        <div class="session-details">

            <div class="detail-item">
                🏁
                <span>${data.session.session_name}</span>
            </div>

            <div class="detail-item">
                📍
                <span>${data.meeting.location}</span>
            </div>

            <div class="detail-item">
                👨‍🏎️
                <span>${data.drivers.length} Drivers Connected</span>
            </div>

        </div>
    `;
}