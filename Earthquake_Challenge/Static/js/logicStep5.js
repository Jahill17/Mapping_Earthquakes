// Add console log to check to see if our code is working
console.log("working");

// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  accessToken: API_KEY
})

// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
    // id: 'mapbox/streets-v11',
    // tileSize: 512,
    // zoomOffset: -1,
});

// Create a base layer that holds both maps
let baseMaps = {
  "Streets": streets,
  "Satellite": satelliteStreets
};

// Create the earthquake layer for our map
let earthquakes = new L.layerGroup();

// Define an object that contains the overlays. This overlay will be visible all the time
let overlays = {
  Earthquakes: earthquakes
};

// Create the map object with center and zoom level.
let map = L.map("mapid", {
  center: [39.5, -98.5],
  zoom: 3,
  layers: [streets]
});

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps, overlays).addTo(map);

// Accessing the past 7 days Earthquake GeoJSON URL.
let earthquakes7days = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// // Accessing the Toronto neighborhoods GeoJSON URL.
// let torontoHoods = "https://raw.githubusercontent.com/Jahill17/Mapping_Earthquakes/main/torontoNeighborhoods.json";

// // Accessing the Toronto airline routes GeoJSON URL.
// let torontoData = "https://raw.githubusercontent.com/Jahill17/Mapping_Earthquakes/main/torontoRoutes.json";

// // Accessing the airport GeoJSON URL
// let airportData = "https://raw.githubusercontent.com/Jahill17/Mapping_Earthquakes/main/majorAirports.json";

// // Create a style for the lines.
// let myStyle = {
//   color: "blue",
//   fillColor: "yellow",
//   weight: 1
// }

// This function returns the style data for each of the earthquakes we plot on the map. 
// We pass the magnitude of the earthquake into a function to calculate the radius.
function styleInfo(feature) {
  return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "black",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
  };
}

// Function to color code the magnitude of earthquakes (circles in the map)
function getColor(magnitude) {
  if (magnitude > 5) {
      return "#ea2c2c";
  }
  if (magnitude > 4) {
      return "#ea822c";
  }
  if (magnitude > 3) {
      return "#ee9c00";
  }
  if (magnitude > 2) {
      return "#eecc00";
  }
  if (magnitude > 1) {
      return "#d4ee00";
  }
  return "#98ee00";
}

// This function determines the radius of the earthquake marked based on its magnitude
// Earthquakes with a mag of 0 will be plotted with a radius of 1
function getRadius(magnitude){
  if (magnitude === 0) {
      return 1;
  }
  return magnitude * 4;

}

d3.json(earthquakes7days).then(data => {
  L.geoJSON(data, {
      onEachFeature: function(feature, layer) {
          layer.bindPopup("<b>Magnitude: </b>" + feature.properties.mag + "<br><b>Location: </b>" + feature.properties.place)
      },
      pointToLayer: function(feature, latlng) {
          console.log(data);
          return L.circleMarker(latlng);
      },
      style: styleInfo
  }).addTo(map);
});


// Create a legend control object.
var legend = L.control({position: 'bottomright'});

// Then add all the details for the legend.
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  const magnitudes = [0, 1, 2, 3, 4, 5];
  const colors = [
    "#98ee00",
    "#d4ee00",
    "#eecc00",
    "#ee9c00",
    "#ea822c",
    "#ea2c2c"
];

// Looping through our intervals to generate a label with a colored square for each interval.
  for (let i = 0; i < magnitudes.length; i++) {
    console.log(colors[i]);
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
  }
  return div;
  };

//Add legend to the map
legend.addTo(map);
;