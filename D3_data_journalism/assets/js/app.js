// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// creating svg wrapper for the chart to go in.
var svg = d3
  .select(".scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // appending the chartGroup
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);


// initital graph data/parameters
var chosenXAxis = "hair_length";

// function used for updating x-scale var upon click on axis label
function xScale(Data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8,
      d3.max(Data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}



var state_names = []
var state_obesity = []
var state_smoking = []
var state_lackHealth = []
var state_poverty = []
var state_age = []
var state_houseIncome = []

d3.csv("assets/data/data.csv").then(function(censusData){


    console.log(censusData)

// placing all needed info in organized lists
    censusData.forEach(function(data){
       var name =  data.state
       var obesity = data.obesity
       var smoking = data.smokes
       var lackHealth = data.healthcare
       var poverty = data.poverty
       var age = data.age
       var houseIncome = data.income
       


       state_names.push(name)
       state_obesity.push(obesity)
       state_smoking.push(smoking)
       state_lackHealth.push(lackHealth)
       state_poverty.push(poverty)
       state_age.push(age)
       state_houseIncome.push(houseIncome)
    })

    

});

// console.log(state_names)
// console.log(state_obesity)
// console.log(state_smoking)
// console.log(state_lackHealth)
// console.log(state_poverty)
// console.log(state_age)
// console.log(state_houseIncome)