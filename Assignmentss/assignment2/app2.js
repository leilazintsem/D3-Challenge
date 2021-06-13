// I worked with Erin Wills (TA) and other classmates.

// let's define our functions for x and y axis 
// xscale function
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);  

  return xLinearScale;

}

// yscale function
function yScale(data, chosenYAxis){

var yLinearScale = d3.scaleLinear()
.domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
d3.max(data, d => d[chosenYAxis]) * 1.2
])
.range([height, 0 ]);
  return yLinearScale;
}


// render axes functions
// renderAxes function for x axis
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// renderAxes function for y axis
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// functions for the circles
// rendercircles for x function
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// rendercircles for y function
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}


// function which will contain the text for every circles
// x rendertextcircles
function rendertextCircles(textcirclesGroup, newXScale, chosenXAxis) {

    textcirclesGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
  
    return textcirclesGroup;
  }

  // y rendertextcircles
function renderYtextCircles(textcirclesGroup, newYScale, chosenYAxis) {

    textcirclesGroup.transition()
      .duration(1000)
      .attr("y", d => newYScale(d[chosenYAxis]));
  
    return textcirclesGroup;
  }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup){

  // if statement for xlabel
  var xlabel;

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty:";
  }
  else if(chosenXAxis === "age"){
    xlabel = "Age:"; // name that shows on pop up 
  }
  else {
    xlabel = "Income:";
  }

  //  if statement for y label
  var ylabel;
  if (chosenYAxis === "obesity") {
    ylabel = "obesity:";
  }
  else if (chosenYAxis === "healthcare"){
    ylabel = "healthcare:" // name that shows on pop up 
  }
  else {
    ylabel = "Smokes:" ;
  }


  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
    });
  
  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // create onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}





// SVG setup

var svgWidth = 960;
var svgHeight = 500;

var margin = {
top: 20,
right: 40,
bottom: 80,
left: 100
};

// Scaling 
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
.select(".chart")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);






// Get the data and add structure 

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";


// Retrieve data from the CSV file 
d3.csv("assets/data/data.csv").then(function(data, err) {
if (err) throw err;
 
// parse data - set values to numerical data types- add Y value extra
data.forEach(function(data) {
  data.poverty = +data.poverty; // x value
  data.healthcare = +data.healthcare;  // Y value
  data.age = +data.age; // extra x value (+ make sure it converts into a number)
  data.income = +data.income;
  data.obesity = +data.obesity;   // y value extra
  data.smokes = +data.smokes; // Y value extra
});

var xLinearScale = xScale(data, chosenXAxis);

// Create y scale function
var yLinearScale = yScale(data, chosenYAxis);

// Create initial axis functions; generates the scaled axis
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// append y axis
var yAxis = chartGroup.append("g")
  .call(leftAxis);

  // New by Erin - provide data first to grouped elements 
  // case is important - selectAll() works but SelectAll() would produce a type error - the capitalizaton makes a difference
  var circlesGroupAll = chartGroup.selectAll("circlesGroup").data(data).enter();

  // modfied by Erin - data is already bound to circlesGroupAll and now I am adding the 'circles' with one circle for each data
  // note that the attributes are "cx" and "cy"; the data is being scaled by the scaling functions defined above; see it is a function
  // the centers of the circles are also coming from the specific x data group 'chosenXAxis'
  // append initial circles
  var circlesGroup = circlesGroupAll
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  // added by Erin - I wanted to add text to the circles - probably several ways of doing this but here is one.
  // data is bound to ciclesGroupAll like above and now I add a text element at "x" and "y", not the difference from above.
  // added round function to make the numbers in the cirlces have no decimals; this is a random data selection; I just wanted something inside the circles. If you want to see why these values are like they are then you need to back-calculate what xScale and transpose is doing
  var textcirclesGroup = circlesGroupAll
    .append("text")
    .text((d) => d.abbr)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.healthcare))

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty Level");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age");

// add income 
var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income");

  // append y axis
  var labelsYGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

    var healthcareLabel = labelsYGroup.append("text")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare")
    .classed("active", true)
    .text("Healthcare"); 

    var obesityLabel = labelsYGroup.append("text")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "obesity")
    .classed("inactive", true)
    .text("Obesity"); 

    var smokesLabel = labelsYGroup.append("text")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "smokes")
    .classed("inactive", true)
    .text("Smokes"); 

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);





// #################### 5.  ADD updates upon clicking axis text  ###############//

  // x axis labels event listener
  // if you comment out the entire labelsGroup section then you can see that the plot populates but does not update when selecting the axis
  // note that above this section, only the updateToolTip and xScale functions are called of all the user created functions at the top of the script
  // the other functions at the top of the page are used to re-define the data applied to the xLinearScale function, xAxis object, circlesGroup elements, textcirclesGroup elements, circlesGroup elements
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
        
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        // New - updates text labels within circles
        textcirclesGroup = rendertextCircles(textcirclesGroup, xLinearScale, chosenXAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "poverty"){
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "income"){
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }

        else{
          console.log("it did not work");
        }
      }
    });


  labelsYGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(data, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);
        
        // updates circles with new x values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
        // New - updates text labels within circles
        textcirclesGroup = renderYtextCircles(textcirclesGroup, yLinearScale, chosenYAxis);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "obesity"){
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes"){
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
        }

        else{
          console.log("it did not work");
        }
      }
    });
  

}).catch(function(error) {
  console.log(error);
});
