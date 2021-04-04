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

    
    // create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.extent(state_poverty, d => d)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.extent(state_lackHealth, d => d)])
      .range([height, 0]);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);



});

// console.log(state_names)
// console.log(state_obesity)
// console.log(state_smoking)
// console.log(state_lackHealth)
// console.log(state_poverty)
// console.log(state_age)
// console.log(state_houseIncome)