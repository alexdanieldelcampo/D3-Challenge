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




// var state_names = []
// var state_obesity = []
// var state_smoking = []
// var state_lackHealth = []
// var state_poverty = []
// var state_age = []
// var state_houseIncome = []


// setting the starting x-axis scale
var chosenXAxis = "poverty"

function xScale(censusData, chosenXAxis) {
var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenXAxis] * 0.95), d3.max(censusData, d => d[chosenXAxis] * 1.02)])
      .range([0, width]);

    return xLinearScale
};

// setting the starting y-axis scale
var chosenYAxis = "healthcare"

function yScale(censusData, chosenYAxis) {
var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenYAxis]* 0.8)  , d3.max(censusData, d => d[chosenYAxis] * 1.2)])
      .range([height, 0]);

    return yLinearScale
};
// allowing axes to adapt to new Scales
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
// allowing circles to adapt to new scales
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, abbrGroup) {

  var xlabel;
  var ylabel;

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty (%)";
  }
  else if (chosenXAxis === "age") {
    xlabel = "Age (Median)";
  }
  else {
    xlabel = "Household Income (Median)"
  }

  if (chosenYAxis === "healthcare") {
    ylabel = "Lack of Healthcare (%)";
  }
  else if (chosenYAxis === "smokes") {
    ylabel = "Smokes (%)";
  }
  else {
    ylabel = "Obese (%)"
  }
  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
  });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this)
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // This is so the tooltip does not go away when the cursor hits the State text in circle
    abbrGroup.on("mouseover", function(data) {
      toolTip.show(data, this)
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  return circlesGroup;
}

function updateAbbr(abbrGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis){
  abbrGroup.transition()
  .duration(1000)
  .attr("x", d => xLinearScale(d[chosenXAxis]))
  .attr("y", d => yLinearScale(d[chosenYAxis] -.4));

return abbrGroup;
     
}

d3.csv("assets/data/data.csv").then(function(censusData, err){
  if (err) throw err;

    console.log(censusData)

// turning data into numericals
    censusData.forEach(function(data){
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare
        data.poverty = +data.poverty
        data.age = +data.age
        data.income = +data.income
        data.abbr = data.abbr
      console.log(data.abbr)
      });
 
// console.log(state_obesity)
// console.log(state_smoking)
// console.log(state_lackHealth)
// console.log(state_poverty)
// console.log(state_age)
// console.log(state_houseIncome)

// xLinearScale function above csv import
var xLinearScale = xScale(censusData, chosenXAxis);
// yLinearScale function above csv import
var yLinearScale = yScale(censusData, chosenYAxis);

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);



 // adding the axes
 var xAxis = chartGroup.append("g")
 .classed("x-axis", true)
 .attr("transform", `translate(0, ${height})`)
 .call(bottomAxis);

 var yAxis = chartGroup.append("g")
 .call(leftAxis);



 // creating the circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", "15")
    // .attr("fill", "#2ca25f")
    // .attr("opacity", "0.8")
    .classed("stateCircle", true);

    //  adding state abbr to circles
    
    var abbrGroup = chartGroup.selectAll("text")
      .exit()
      .data(censusData)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis] ) )
      .attr("y", d => yLinearScale(d[chosenYAxis] ) )
      .text(function(d) { return d.abbr })
      // .attr("font-size", "15px")
      // .attr("fill", 'black')
      .classed("stateText", true);
          
  
      

   // creating x-axis labels for clicking
   var xlabelsGroup = chartGroup.append("g")
   .attr("transform", `translate(${width / 2}, ${height + 20})`);


   var PovertyLabel = xlabelsGroup.append("text")
   .attr("x", 0)
   .attr("y", 20)
   .attr("class", "axisText")
   .attr("value", "poverty") // value to grab for event listener
   .classed("active", true)
   .text("Poverty Rate (%)");

 var AgeLabel = xlabelsGroup.append("text")
   .attr("x", 0)
   .attr("y", 40)
   .attr("class", "axisText")
   .attr("value", "age") // value to grab for event listener
   .classed("inactive", true)
   .text("Age (Median)");


   var HouseholdLabel = xlabelsGroup.append("text")
   .attr("x", 0)
   .attr("y", 60)
   .attr("class", "axisText")
   .attr("value", "income") // value to grab for event listener
   .classed("inactive", true)
   .text("Household Income (Median)");


// creating y-axis labels for clicking
   var ylabelsGroup = chartGroup.append("g")
   .attr("transform", `translate(${0 - margin.left + 45}, ${height/2})`);

   var HealthcareLabel = ylabelsGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("x", 0)
   .attr("y", 0)
   .attr("dy", "1em")
   .attr("class", "axisText")
   .attr("value", "healthcare") // value to grab for event listener
   .classed("active", true)
   .text("Lack of Healthcare (%)");

   var SmokingLabel = ylabelsGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("x", 0)
   .attr("y", -20)
   .attr("dy", "1em")
   .attr("class", "axisText")
   .attr("value", "smokes") // value to grab for event listener
   .classed("inactive", true)
   .text("Smokes (%)");

   var ObeseLabel = ylabelsGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("x", 0)
   .attr("y", -40)
   .attr("dy", "1em")
   .attr("class", "axisText")
   .attr("value", "obesity") // value to grab for event listener
   .classed("inactive", true)
   .text("Obese (%)");



  

   var circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
   
   var abbrGroup = updateAbbr(abbrGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis)

   var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, abbrGroup);
    


  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxis(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, abbrGroup);

        //update abbr locations
        abbrGroup = updateAbbr(abbrGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis)

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          PovertyLabel
            .classed("active", true)
            .classed("inactive", false);
          AgeLabel
            .classed("active", false)
            .classed("inactive", true);
          HouseholdLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
          PovertyLabel
            .classed("active", false)
            .classed("inactive", true);
          AgeLabel
            .classed("active", true)
            .classed("inactive", false);
          HouseholdLabel
          .classed("active", false)
            .classed("inactive", true);
        }
        else {
          PovertyLabel
            .classed("active", false)
            .classed("inactive", true);
          AgeLabel
            .classed("active", false)
            .classed("inactive", true);
          HouseholdLabel
          .classed("active", true)
            .classed("inactive", false);
        }
      }
    });



// x axis labels event listener
ylabelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenYAxis) {

    // replaces chosenXAxis with value
    chosenYAxis = value;

    // console.log(chosenXAxis)

    // functions here found above csv import
    // updates x scale for new data
    yLinearScale = yScale(censusData, chosenYAxis);

    // updates x axis with transition
    yAxis = renderYAxis(yLinearScale, yAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, abbrGroup);

    //update abbr locations
    abbrGroup = updateAbbr(abbrGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis)

    // changes classes to change bold text
    if (chosenYAxis === "healthcare") {
      HealthcareLabel
        .classed("active", true)
        .classed("inactive", false);
      SmokingLabel
        .classed("active", false)
        .classed("inactive", true);
      ObeseLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else if (chosenYAxis === "smokes") {
      HealthcareLabel
        .classed("active", false)
        .classed("inactive", true);
      SmokingLabel
        .classed("active", true)
        .classed("inactive", false);
      ObeseLabel
      .classed("active", false)
        .classed("inactive", true);
    }
    else {
      HealthcareLabel
        .classed("active", false)
        .classed("inactive", true);
      SmokingLabel
        .classed("active", false)
        .classed("inactive", true);
      ObeseLabel
      .classed("active", true)
      .classed("inactive", false);
    }
  }
});



}).catch(function(error) {
    console.log(error);
});

