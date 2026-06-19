document.addEventListener('DOMContentLoaded', async () => {
    const map = L.map('map').setView([-24.8, -51.5], 7);

    const tileLayers = {
        light: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }),
        dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO'
        }),
        simepar: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; Simepar | OpenStreetMap contributors'
        })
    };

    let currentTileLayer = tileLayers.simepar;
    currentTileLayer.addTo(map);

    let geoJsonData;
    let weatherData;
    let geojsonLayer;

    // Load GeoJSON
    try {
        const response = await fetch('pr_municipios.json');
        geoJsonData = await response.json();
        weatherData = window.WeatherData.generateData(geoJsonData);
    } catch (error) {
        console.error('Error loading data:', error);
        return;
    }

    function getColor(d) {
        return d > 30 ? '#800026' :
               d > 25 ? '#BD0026' :
               d > 20 ? '#E31A1C' :
               d > 15 ? '#FC4E2A' :
               d > 10 ? '#FD8D3C' :
               d > 5  ? '#FEB24C' :
               d > 0  ? '#FED976' :
                        '#FFEDA0';
    }

    function style(feature) {
        const type = document.getElementById('temp-select').value;
        const temp = weatherData[feature.properties.id][type];
        return {
            fillColor: getColor(temp),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
    }

    function highlightFeature(e) {
        const layer = e.target;
        layer.setStyle({
            weight: 3,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        layer.bringToFront();
        info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        geojsonLayer.resetStyle(e.target);
        info.update();
    }

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    geojsonLayer = L.geoJson(geoJsonData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);

    // Custom info control
    const info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (props) {
        const type = document.getElementById('temp-select').value;
        const typeLabel = {
            current: 'Atual',
            max: 'Máxima',
            min: 'Mínima'
        }[type];

        this._div.innerHTML = '<h4>Temperatura ' + typeLabel + '</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + weatherData[props.id][type] + ' &deg;C'
            : 'Passe o mouse sobre uma cidade');
    };

    info.addTo(map);

    // Legend control
    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 5, 10, 15, 20, 25, 30],
            labels = [];

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);

    // Event listeners for controls
    document.getElementById('theme-select').addEventListener('change', (e) => {
        const theme = e.target.value;
        document.body.className = 'theme-' + theme;

        map.removeLayer(currentTileLayer);
        currentTileLayer = tileLayers[theme];
        currentTileLayer.addTo(map);
    });

    document.getElementById('temp-select').addEventListener('change', () => {
        geojsonLayer.setStyle(style);
        info.update();
    });
});
