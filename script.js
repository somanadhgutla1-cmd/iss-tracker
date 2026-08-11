// 1.Initialize the Leaflet Map Centered on coordinated [0,0]
const map = L.map('map').setView([0,0], 2);

//Add OpenStreetMap title layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

//Standard default pin marker (avoids syntax errors with custom icon objects)
const marker = L.marker([0,0]).addTo(map);
// 2. Function to fetch live ISS position
async function getISSPosition() {
    try {
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await response.json();

        const latitude = data.latitude.toFixed(4);
        const longitude = data.longitude.toFixed(4);

        //Update HTML values
        document.getElementById('lat').textContent = latitude;
        document.getElementById('lon').textContent = longitude;
    } catch (error) {
        console.error('Error fetching ISS Position:',error);
    }
}

//3.Function to fetch Astronauts currently in space
async function getAstronauts(){
    try {
        const response = await fetch('https://corroborate.jonas-keil.workers.dev/?url=http://api.open-notify.org/astros.json');
        const data = await response.json();

        document.getElementById('astro-count').textContent = data.number;
        const astroList = document.getElementById('astro-list');
        astroList.innerHTML = ''; // Clear default text

        data.people.forEach(person => {
            if (person.craft === 'ISS') {
                const li = document.createElement(li);
                li.textContent = '👨‍🚀 ${person.name}';
                astroList.appendChild(li);
            }
        });
    } catch (error) {
        document.getElementById('astro-list').innerHTML = '<li>Unable to load astronaut data</li>';
    }
}

// Wxwcute functions
getISSPosition();
getAstronauts();

// Refresh the ISS position every 5 seconds (5000 ms)
setInterval(getISSPosition, 5000);
