// Declare dependencies
var d3 = require('d3')
var leaflet = require('leaflet')

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

var zoom = map.getZoom(zoom)

/* We simply pick up the SVG from the map object */
var svg = d3.select("#map").select("svg");
var cases_cont = svg.append("g");
var tasa_cont = svg.append("g");


var radiusScale = d3.scale.linear()
	.domain([0, 1883])
	.range([5,40])

var radiusScaleTasa = d3.scale.linear()
	.domain([0, 9500])
	.range([5,20])


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

	var cases = cases_cont.selectAll("circle")
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
			tooltip.html("<p><strong>Location: </strong>" + d.canton + "</p><br/>" +
						"<p><strong>Cases: </strong>" + d.casos + "</p><br/>" +
						"<p><strong>Rate: </strong>" + d.tasa.toFixed(2)+"%" + "</p>")
				
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

	var tasas = tasa_cont.selectAll("circle")
		.data(collection)
		.enter().append("circle")
		.attr("class", "circle_tasas") //g.selectAll(".circle_cases")
		// .style("stroke", "black")
		.style("opacity", .2)
		.style("fill", "red")
		// .attr("r", 1)
		// .transition().duration(2000).delay(function(d, i) {return i*30})
		.attr("r", function(d) {return radiusScaleTasa(d.tasa)})
		.on("mouseover", function(d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", .9)
			tooltip.html("<p><strong>Location: </strong>" + d.canton + "</p><br/>" +
						"<p><strong>Cases: </strong>" + d.casos + "</p><br/>" +
						"<p><strong>Rate: </strong>" + d.tasa.toFixed(2)+"%" + "</p>")
				
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

	// active all checkbox inputs
	d3.selectAll('input').attr('checked','true');

	// select input from html by className
	var cases_input = d3.selectAll('.cases_input');
	// define D3 event change
	cases_input.on('change',function () {
		// define display based on 'checked' (true or false). 
		var display = this.checked ? "inline" : "none";
		// slect circles
		svg.selectAll(".circle_cases")
			// apply dislay to display
			.attr("display", display);
	})

	// same ^^^
	var tasa_input = d3.selectAll('.tasa_input');
	tasa_input.on('change',function () {
		var display = this.checked ? "inline" : "none";
		svg.selectAll(".circle_tasas")
			.attr("display", display);
	})

	function update() {
		cases
			.attr("transform",
				function(d) {
					return "translate("+
					  map.latLngToLayerPoint(d.LatLng).x +","+
					  map.latLngToLayerPoint(d.LatLng).y +")";
				})
			.attr("r",function(d) { return radiusScale(d.casos)/200*Math.pow(2,map.getZoom())})
		tasas
			.attr("transform",
				function(d) {
					return "translate("+
					  map.latLngToLayerPoint(d.LatLng).x +","+
					  map.latLngToLayerPoint(d.LatLng).y +")";
				})
			.attr("r",function(d) { return radiusScaleTasa(d.tasa)/200*Math.pow(2,map.getZoom())})
	}
})
