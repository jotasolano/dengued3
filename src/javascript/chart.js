var d3 = require('d3');
var $ = require('jquery');


var variableWidthSTR = d3.select("#chart").style("width");
var variableWidth = parseInt(variableWidthSTR.substring(0, variableWidthSTR.length - 2));

var margin = { top: 30, right: 30, bottom: 30, left: 80 },
  width = variableWidth - margin.left - margin.right,
  height = 360 - margin.top - margin.bottom,
  gridSize = Math.floor(width / 52),
  buckets = 9,
//   colors = ["#E1B073",
// "#A6BEED",
// "#D7DE62",
// "#EAACD7",
// "#9BE381",
// "#F1A49E",
// "#76E2B4",
// "#ECBA56",
// "#7EDADC",
// "#C0D590",
// "#C5C9DA"]
  colors = ['#dde0a7','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58']
  // colors = ['#9e0142','#d53e4f','#f46d43','#fdae61','#fee08b','#ffffbf','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2']
  // colors = ['#fff5f0','#fee0d2','#fcbba1','#fc9272','#fb6a4a','#ef3b2c','#cb181d','#a50f15','#67000d'], // alternatively colorbrewer.YlGnBu[9]
  regiones=["Brunca","Central Este","Central Norte","Central Sur","Chorotega","Huetar Caribe","Huetar Norte","Occidente","Pacifico Central","Total"]
  weeks = [];


// Declare the scales
var weekScale = d3.scale.linear()
  .domain([1, 52])
  .range([0,width])

var regionScale = d3.scale.linear()
  .domain([0, 8])
  .range([0,height])

var casosScale = d3.scale.linear()
  .domain([0, 550])
  .range([0, colors.length])


// Declare the axes
var xAxis = d3.svg.axis()
    .scale(weekScale)
    .orient("top")
    .ticks(30)

var yAxis = d3.svg.axis()
    .scale(regionScale)
    .orient("left")
    .tickFormat( function(index) {
      var labels = ["Brunca", "Central E.", "Central N.", "Central S.", "Chorotega", "Huetar C.", "Huetar N.", "Occidente", "Pacífico C."];
      return labels[index];
    });

// Declare the chart bounding box
var svg = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append the axes
svg.append("g")
  .attr("class", "x axis")
  .call(xAxis)
  .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "1.1em")
    .style("fill", "#4d4d4d")

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dy", "1.5em")
    .style("fill", "#4d4d4d")

// Declare the tooltop
var tooltip = d3.select(".tooltip")


// Load the data
d3.json("data/heatmap.json", function(heatmap) {


// Format the data so that rect can consume it
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
        .attr("class", "rect" )
        .attr("x", currentX )
        .attr("y", function(d){ return regionScale(t) } )
        .attr("width", gridSize)
        .attr("height", gridSize + 8)
        .attr("casos", currentVal.casos)
        .attr("region", currentVal.region)
        .attr("fill",function(){ return colors[ Math.round(casosScale(currentVal.casos)) ] })
    }
  }

  function mouseoverRect(element,event) {
    var casos = $(element).attr("casos");
    var region = $(element).attr("region");
    tooltip.transition()
      .duration(200)
      .style("opacity", .9)
    tooltip.html("<p><strong>Casos: </strong>" + casos + "</p><br/>" +
          "<p><strong>Region: </strong>" + region + "</p><br/>")
      
      .style("left", function(){
                if (event.pageX > variableWidth /2) {
                  return (event.pageX - 170) + "px";
                }else{
                  return (event.pageX) + "px";
                }
              })
              .style("top", (event.pageY - 90) + "px")
  }

  function mouseoutRect(element) {
    tooltip.transition()
      .duration(200)
      .style("opacity", 0)
  }

  $('.rect').hover(
    function (e) {
      mouseoverRect(this,e)
    },
    function () {
      mouseoutRect(this)
    }
  )


})

