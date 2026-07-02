/* ==========================================================
   Formula Fan

   File: drivers.js

   Purpose:
   Display Formula 1 drivers.

========================================================== */

async function loadDrivers() {

    try {

        const response = await fetch("http://127.0.0.1:5000/drivers");

        const drivers = await response.json();

        const container = document.getElementById("drivers-container");

        container.innerHTML = "";

        drivers.slice(0, 12).forEach(driver => {

            container.innerHTML += `

                <div class="driver-card">

                    <img
                        src="${driver.headshot_url}"
                        alt="${driver.full_name}"
                    >

                    <h3>${driver.full_name}</h3>

                    <p>${driver.team_name}</p>

                    <span>#${driver.driver_number}</span>

                </div>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}

loadDrivers();