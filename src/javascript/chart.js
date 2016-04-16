var d3 = require('d3');


var variableWidthSTR = d3.select("#chart").style("width");
var variableWidth = parseInt(variableWidthSTR.substring(0, variableWidthSTR.length - 2));

// Heatmap
var margin = { top: 50, right: 0, bottom: 100, left: 0 },
  width = variableWidth - margin.left - margin.right,
  height = 430 - margin.top - margin.bottom,
  gridSize = Math.floor(width / 52),
  legendElementWidth = gridSize*2,
  buckets = 9,
  colors = ['#fff5f0','#fee0d2','#fcbba1','#fc9272','#fb6a4a','#ef3b2c','#cb181d','#a50f15','#67000d'], // alternatively colorbrewer.YlGnBu[9]
  regiones=["Brunca","Central Este","Central Norte","Central Sur","Chorotega","Huetar Caribe","Huetar Norte","Occidente","Pacifico Central","Total"]
  weeks = [];


var weekScale = d3.scale.linear()
  .domain([1, 53])
  .range([0,width])

var regionScale = d3.scale.linear()
  .domain([0, 10])
  .range([0,height])

var casosScale = d3.scale.linear()
  .domain([0, 520])
  .range([0, colors.length])

var svg = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data/heatmap.json", function(heatmap) {
/* Add a LatLng object to each item in the dataset */

	heatmap.forEach(function(d) {
		weeks.push(d.Semana);
	});

  var data = []

  for (var i = 0; i < heatmap.length; i++) {
    var newObj = {
      Semana:heatmap[i].Semana,
      Regiones:[]
    }
    for (var t = 0; t < regiones.length; t++) {
      var newReg = {
        region:regiones[t],
        casos:heatmap[i][regiones[t]]
      }
      newObj.Regiones.push(newReg);
    }
    data.push(newObj)
  }

  for (var i = 0; i < data.length; i++) {

    var currentX = weekScale(data[i].Semana);

    for (var t = 0; t < data[i].Regiones.length -1 ; t++) {
      var currentVal = data[i].Regiones[t];

      svg.append("rect")
        .attr("x", currentX )
        .attr("y", function(d){ return regionScale(t) } )
        .attr("width", gridSize)
        .attr("height", gridSize + 5)
        .attr("casos", currentVal.casos)
        .attr("region", currentVal.region)
        .attr("fill",function(){ return colors[ Math.round(casosScale(currentVal.casos)) ] })
        .on("mouseover",function(d){
          console.log(d)
        })
    }

  }


})













