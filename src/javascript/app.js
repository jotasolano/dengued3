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


/* We simply pick up the SVG from the map object */
var svg = d3.select("#map").select("svg"),
g = svg.append("g");


var radiusScale = d3.scale.linear()
	.domain([0, 1883])
	.range([5,40])


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


// Heatmap

var margin = { top: 50, right: 0, bottom: 100, left: 30 },
  width = 960 - margin.left - margin.right,
  height = 430 - margin.top - margin.bottom,
  gridSize = Math.floor(width / 24),
  legendElementWidth = gridSize*2,
  buckets = 9,
  colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
  days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
  datasets = ["data/data.tsv", "data/data2.tsv"],
  weeks = [];


d3.json("data/heatmap.json", function(heatmap) {
/* Add a LatLng object to each item in the dataset */

	heatmap.forEach(function(d) {
		weeks.push(d.Semana);
	});
	console.log(weeks)


})



var svg = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dayLabels = svg.selectAll(".dayLabel")
  .data(days)
  .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", 0)
    .attr("y", function (d, i) { return i * gridSize; })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
    .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

var timeLabels = svg.selectAll(".timeLabel")
  .data(times)
  .enter().append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return i * gridSize; })
    .attr("y", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

var heatmapChart = function(tsvFile) {
d3.tsv(tsvFile,
function(d) {
  return {
    day: +d.day,
    hour: +d.hour,
    value: +d.value
  };
},
function(error, data) {
  var colorScale = d3.scale.quantile()
      .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
      .range(colors);

  var cards = svg.selectAll(".hour")
      .data(data, function(d) {return d.day+':'+d.hour;});

  cards.append("title");

  cards.enter().append("rect")
      .attr("x", function(d) { return (d.hour - 1) * gridSize; })
      .attr("y", function(d) { return (d.day - 1) * gridSize; })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("class", "hour bordered")
      .attr("width", gridSize)
      .attr("height", gridSize)
      .style("fill", colors[0]);

  cards.transition().duration(1000)
      .style("fill", function(d) { return colorScale(d.value); });

  cards.select("title").text(function(d) { return d.value; });
  
  cards.exit().remove();

  var legend = svg.selectAll(".legend")
      .data([0].concat(colorScale.quantiles()), function(d) { return d; });

  legend.enter().append("g")
      .attr("class", "legend");

  legend.append("rect")
    .attr("x", function(d, i) { return legendElementWidth * i; })
    .attr("y", height)
    .attr("width", legendElementWidth)
    .attr("height", gridSize / 2)
    .style("fill", function(d, i) { return colors[i]; });

  legend.append("text")
    .attr("class", "mono")
    .text(function(d) { return "≥ " + Math.round(d); })
    .attr("x", function(d, i) { return legendElementWidth * i; })
    .attr("y", height + gridSize);

  legend.exit().remove();

});  
};

heatmapChart(datasets[0]);

var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
.data(datasets);

datasetpicker.enter()
.append("input")
.attr("value", function(d){ return "Dataset " + d })
.attr("type", "button")
.attr("class", "dataset-button")
.on("click", function(d) {
  heatmapChart(d);
});

