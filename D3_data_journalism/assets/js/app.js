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
  .select("#scatter")
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
        data.obesity = +data.obesity;
        data.smoking = +data.smoking;
        data.healthcare = +data.healthcare
        data.poverty = +data.poverty
        data.age = +data.age
        data.income = +data.income






    //    var name =  data.state
    //    var obesity = data.obesity
    //    var smoking = data.smokes
    //    var lackHealth = data.healthcare
    //    var poverty = data.poverty
    //    var age = data.age
    //    var houseIncome = data.income
       


    //    state_names.push(name)
    //    state_obesity.push(obesity)
    //    state_smoking.push(smoking)
    //    state_lackHealth.push(lackHealth)
    //    state_poverty.push(poverty)
    //    state_age.push(age)
    //    state_houseIncome.push(houseIncome)
    });

    
    // create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.extent(censusData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.extent(censusData, d => d.healthcare)])
      .range([height, 0]);

    // Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);


    // adding the axes
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    // creating the circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".75");


    // creating tootip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty %: ${d.poverty}<br>No Healthcare %: ${d.healthcare}`);
      });

    // place tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // event listener for showing/hiding tooltip
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
    .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

    // creating axes labels
    

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty Rate (%)");

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lack of Healthcare (%)");

  }).catch(function(error) {
    console.log(error);
});

console.log(state_names)
console.log(state_obesity)
console.log(state_smoking)
console.log(state_lackHealth)
console.log(state_poverty)
console.log(state_age)
console.log(state_houseIncome)