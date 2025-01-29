// Define stations for each line
const lrt1Stations = [
    'Roosevelt', 'Balintawak', 'Monumento', '5th Avenue', 'R. Papa', 'Abad Santos', 
    'Blumentritt', 'Tayuman', 'Bambang', 'Doroteo Jose', 'Carriedo', 'Central Terminal', 
    'United Nations', 'Pedro Gil', 'Quirino', 'Vito Cruz', 'Gil Puyat', 'Libertad', 
    'EDSA', 'Baclaran'
];
const lrt2Stations = [
    'Antipolo', 'Marikina', 'Santolan', 'Katipunan', 'Anonas', 'Araneta Center Cubao - LRT 2',
    'Betty Go Belmonte', 'Gilmore', 'J. Ruiz', 'V. Mapa', 'Pureza', 'Legarda', 'Recto'
];
const mrtStations = [
    'North Avenue', 'Quezon Avenue', 'GMA Kamuning', 'Araneta Center Cubao - MRT 3',
    'Santolan Anapolis', 'Ortigas', 'Shaw Boulevard', 'Boni', 'Guadalupe', 'Buendia',
    'Ayala', 'Magallanes', 'Taft Avenue'
];

// Function to update station options based on selected train line
function updateStations(lineSelectorId, stationSelectorId) {
    const line = document.getElementById(lineSelectorId).value;
    let stations = [];
    
    // Update stations based on train line selected
    if (line === 'LRT 1') {
        stations = lrt1Stations;
    } else if (line === 'LRT 2') {
        stations = lrt2Stations;
    } else if (line === 'MRT') {
        stations = mrtStations;
    }

    const stationSelector = document.getElementById(stationSelectorId);
    stationSelector.innerHTML = '';  // Clear the previous options

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select a station';
    stationSelector.appendChild(defaultOption);

    // Add new options for the selected line
    stations.forEach(station => {
        const option = document.createElement('option');
        option.text = station;
        stationSelector.appendChild(option);
    });
}

// Function to toggle the visibility of the map image
function viewMap() {
    const mapContainer = document.getElementById('map-container');
    
    // Toggle visibility
    if (mapContainer.style.display === 'none') {
        mapContainer.style.display = 'block';
    } else {
        mapContainer.style.display = 'none';
    }
}