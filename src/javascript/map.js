var leaflet = require('leaflet');

var map = leaflet.map('map').setView([10, -84], 8);

mapLink =
    '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
leaflet.tileLayer(
    'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
    }).addTo(map);

/* Initialize the SVG layer */
map._initPathRoot()

/* We simply pick up the SVG from the map object */
var svg = d3.select("#map").select("svg"),
g = svg.append("g");

module.exports = g