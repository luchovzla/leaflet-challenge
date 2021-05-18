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
    console.log("createFeatures");

    // Creates cirle marker function
    function createCircleMarker( feature, latlng ){
        // Change the values of these options to change the symbol's appearance
        let options = {
          radius: feature.properties.mag * 3,
          fillColor: "lightgreen",
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }
        return L.circleMarker( latlng, options );
      }
    
    function onEachFeature(feature, layer) {
        layer.bindPopup(
            `<h3>Magnitude: ${feature.properties.mag}</h3>
             <h3>Place: ${feature.properties.place}</h3>
             <h3>Time of earthquake: ${Date(feature.properties.time)}</h3>
            `);
    }

    // Create a GeoJSON layer containing the features array
    // Run the onEachFeature function for each piece of the array

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircleMarker
    });

    // Now we send this layer to our createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {
    console.log("createMap");
    console.log(earthquakes);
    // Define outdoorsmap and terrain layers
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
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
        "Satellite Map": satellitemap,
        "Light Map": lightmap
    }

    // Overlay to hold earthquake data
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, passing along the outdoors layer and earthquake layer to display as default
    var myMap = L.map("map", {
        center: [
            45, -55
        ],
        zoom: 2.5,
        layers: [satellitemap, earthquakes]
    });

    // layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}
