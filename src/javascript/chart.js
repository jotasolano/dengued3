var d3 = require('d3');
var $ = require('jquery');


var variableWidthSTR = d3.select("#chart").style("width");
var variableWidth = parseInt(variableWidthSTR.substring(0, variableWidthSTR.length - 2));

// Heatmap
var margin = { top: 50, right: 20, bottom: 100, left: 20 },
  width = variableWidth - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom,
  gridSize = Math.floor(width / 52),
  legendElementWidth = gridSize*2,
  buckets = 9,
  colors = ['#fff5f0','#fee0d2','#fcbba1','#fc9272','#fb6a4a','#ef3b2c','#cb181d','#a50f15','#67000d'], // alternatively colorbrewer.YlGnBu[9]
  regiones=["Brunca","Central Este","Central Norte","Central Sur","Chorotega","Huetar Caribe","Huetar Norte","Occidente","Pacifico Central","Total"]
  weeks = [];


var weekScale = d3.scale.linear()
  .domain([1, 52])
  .range([0,width])

var regionScale = d3.scale.linear()
  .domain([1, 9])
  .range([0,height])

var casosScale = d3.scale.linear()
  .domain([0, 520])
  .range([0, colors.length])

var xAxis = d3.svg.axis()
    .scale(weekScale)
    .orient("top")
    .ticks(30)

var yAxis = d3.svg.axis()
    .scale(regionScale)
    .orient("left")

var svg = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("class", "x axis")
  .call(xAxis)
  .attr("class", "y axis")
  .call(yAxis)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var tooltip = d3.select(".tooltip")

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
        .attr("class", "rect" )
        .attr("x", currentX )
        .attr("y", function(d){ return regionScale(t) } )
        .attr("width", gridSize)
        .attr("height", gridSize + 5)
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













