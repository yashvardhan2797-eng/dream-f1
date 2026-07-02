async function loadSession() {

    try {

        const response = await fetch("http://127.0.0.1:5000/session");

        const session = await response.json();

        console.log(session);

    }

    catch (error) {

        console.error(error);

    }

}

loadSession();