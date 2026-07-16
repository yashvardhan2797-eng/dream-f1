const DRIVER_API = "http://127.0.0.1:5000/driver-standings";

async function loadDriverStandings() {

    try {

        const response = await fetch(DRIVER_API);

        if (!response.ok) {
            throw new Error("Failed to fetch driver standings");
        }

        const data = await response.json();

     console.log(data);

        const drivers = data.drivers || data.DriverStandings || data;

        updateDriverStandings(drivers);

    } catch (error) {

        console.error("Driver Standings:", error);

        document.getElementById("driver-standings-list").innerHTML = `
            <div style="color:#ff5555;">
                Failed to load driver standings
            </div>
        `;
    }

}

function getTeamColor(team) {

    const colors = {

        "Mercedes": "#00D2BE",
        "Ferrari": "#DC0000",
        "McLaren": "#FF8700",
        "Red Bull": "#3671C6",
        "Red Bull Racing": "#3671C6",
        "Williams": "#005AFF",
        "Aston Martin": "#006F62",
        "Alpine": "#0090FF",
        "RB": "#6692FF",
        "Kick Sauber": "#52E252",
        "Sauber": "#52E252",
        "Haas F1 Team": "#B6BABD",
        "Audi": "#C0C0C0",
        "Cadillac": "#004C97"
    };

    return colors[team] || "#00E5FF";

}

function updateDriverStandings(drivers) {

    console.log(Array.isArray(drivers), drivers);

    const list = document.getElementById("driver-standings-list");

    console.log("List =", list);

    list.innerHTML = "";

   drivers.forEach(driver => {

        console.log(driver);

        const team = driver.Constructors[0].name;

        const color = getTeamColor(team);

        const fullName =
            driver.Driver.givenName +
            " " +
            driver.Driver.familyName;

        list.innerHTML += `

        <div class="driver-standing-row">

            <span class="driver-position">

                ${driver.position}

            </span>

            <div class="driver-info">

                <div class="driver-name" style="color:${color}">

                    ${fullName}

                </div>

                <div class="driver-team">

                    ${team}

                </div>

            </div>

            <span class="driver-points">

                ${driver.points} pts

            </span>

        </div>

        `;

    });

}

loadDriverStandings();