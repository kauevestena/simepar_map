const WeatherData = {
    // Cache for generated data
    cache: null,

    generateData(geoJson) {
        if (this.cache) return this.cache;

        const data = {};
        geoJson.features.forEach(feature => {
            const id = feature.properties.id;
            // Generate a base temperature between 15 and 25
            const baseTemp = 15 + Math.random() * 10;

            data[id] = {
                current: parseFloat((baseTemp + (Math.random() * 4 - 2)).toFixed(1)),
                max: parseFloat((baseTemp + 5 + Math.random() * 3).toFixed(1)),
                min: parseFloat((baseTemp - 5 - Math.random() * 3).toFixed(1))
            };
        });

        this.cache = data;
        return data;
    }
};

window.WeatherData = WeatherData;
