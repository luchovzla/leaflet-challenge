console.log("logic.js loaded successfully!");

// Store our query URL in a variable

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Get request from query URL
d3.json(queryUrl).then(function(data) {
    // Send the response to a createFeatures function
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    // Create the function that walks the features array
    // Creates a popup on each feature describing the time and place of earthquake

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3>`);
    }

    // Create a GeoJSON layer containing the features array
    // Run the onEachFeature function for each piece of the array

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    // Now we send this layer to our createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define outdoorsmap and lightmap layers
    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });
    
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    // Define baseMaps object to hold base layers
    var baseMaps = {
        "Outdoors Map": outdoorsmap,
        "Light Map": lightmap
    }

    // Overlay to hold earthquake data
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, passing along the outdoors layer and earthquake layer to display as default
    var myMap = L.map("map-id", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [outdoorsmap, earthquakes]
    });

    // layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}
