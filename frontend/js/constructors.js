async function loadConstructors() {

    try {

        const response = await fetch("http://127.0.0.1:5000/constructors");

        if (!response.ok) {
            throw new Error("Failed to fetch constructor standings");
        }

       const constructors = await response.json();

        console.log("Constructors API:", constructors);

        updateConstructors(constructors);

    } catch (error) {

        console.error("Constructor Error:", error);

        const list = document.getElementById("constructors-list");

        if (list) {
            list.innerHTML = `
                <div style="color:#ff5555;">
                    Failed to load standings
                </div>
            `;
        }

    }

}

function getTeamColor(team) {

    const colors = {

        "Mercedes": "#00D2BE",
        "Ferrari": "#DC0000",
        "McLaren": "#FF8700",
        "Red Bull": "#3671C6",
        "Alpine F1 Team": "#0090FF",
        "RB F1 Team": "#6692FF",
        "Williams": "#005AFF",
        "Haas F1 Team": "#B6BABD",
        "Aston Martin": "#006F62",
        "Audi": "#C0C0C0",
        "Cadillac F1 Team": "#004C97"

    };

    return colors[team] || "#00E5FF";

}

function updateConstructors(constructors) {

    const list = document.getElementById("constructors-list");

        console.log("Constructors list element:", list);
    console.log("Constructors received:", constructors);

    if (!list) {
        console.error("constructors-list element not found");
        return;
    }

    list.innerHTML = "";

    constructors.forEach(team => {

        const color = getTeamColor(team.Constructor.name);

        list.innerHTML += `
            <div class="constructor-row">

                <span class="position">
                    ${team.position}
                </span>

                <span class="team-name" style="color:${color}; font-weight:600;">
                    ${team.Constructor.name}
                </span>

                <span class="points">
                    ${team.points} pts
                </span>

            </div>
        `;

    });

}

document.addEventListener("DOMContentLoaded", () => {
    loadConstructors();
});