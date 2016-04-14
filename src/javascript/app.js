// Declare dependencies
var d3 = require('d3')
var leaflet = require('leaflet')
window.d3 = d3

// Require stuff
// var map = require('./map.js')


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


// // control that shows state info on hover
// var info = leaflet.control();


// // Disable dragging when user's cursor enters the element
// info.getContainer().addEventListener('mouseover', function () {
//     map.dragging.disable();
// });

// // Re-enable dragging when user's cursor leaves the element
// info.getContainer().addEventListener('mouseout', function () {
//     map.dragging.enable();
// });


/* We simply pick up the SVG from the map object */
var svg = d3.select("#map").select("svg"),
g = svg.append("g");


var radiusScale = d3.scale.linear()
	.domain([0, 1883])
	.range([5,30])


var tooltip = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);


var variableWidthSTR = d3.select("body").style("width");
var variableWidth = parseInt(variableWidthSTR.substring(0, variableWidthSTR.length - 2));


d3.json("data/locations.json", function(collection) {
/* Add a LatLng object to each item in the dataset */

	collection.forEach(function(d) {
		d.LatLng = new leaflet.LatLng(d.lat, d.lng)
	});

	var feature = g.selectAll("circle")
		.data(collection)
		.enter().append("circle")
		.attr("class", "circle_cases") //g.selectAll(".circle_cases")
		// .style("stroke", "black")
		.style("opacity", .2)
		.style("fill", "blue")
		// .attr("r", 1)
		// .transition().duration(2000).delay(function(d, i) {return i*30})
		.attr("r", function(d) {return radiusScale(d.casos)})
		.on("mouseover", function(d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", .9)
			tooltip.html("<p>" + d.casos + "</p><br/>" + d.tasa.toFixed(2)+"%")
				.style("left", function(){
                  if (d3.event.pageX > variableWidth /2) {
                    return (d3.event.pageX - 170) + "px";
                  }else{
                    return (d3.event.pageX) + "px";
                  }
                })
                .style("top", (d3.event.pageY - 90) + "px")
		})

		.on("mouseout", function(d) {
			tooltip.transition()
			.duration(200)
			.style("opacity", 0)
		});


	map.on("viewreset", update);
	update();

	function update() {
		feature
		// .transition().duration(2000).delay(function(d, i) {return i*2})
		.attr("transform",
		function(d) {
			return "translate("+
			  map.latLngToLayerPoint(d.LatLng).x +","+
			  map.latLngToLayerPoint(d.LatLng).y +")";
		})
	}
})
