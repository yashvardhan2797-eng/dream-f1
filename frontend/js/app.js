const API_URL = "http://127.0.0.1:5000/dashboard";

async function loadDashboard() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        console.log(data);

        updateDashboard(data);

    } catch (error) {
        console.error(error);
    }
}

loadDashboard();

function updateDashboard(data) {

    const meeting = data.meeting;
    const session = data.session;
    const drivers = data.drivers;

    console.log("Meeting:", meeting.meeting_name);
    console.log("Session:", session.session_name);
    console.log("Drivers:", drivers.length);

}