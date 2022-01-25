// D3 Homework challenge - Data Journalism 
makeResponsive();

// Chart setup
// Automatic resize of the chart
function makeResponsive() {

    // Loads, remove & replace browser with a resized version of chart [condition: SVG Area is not empty]
    var svgArea = d3.select("body").select("svg");

    // Clear SVG [if condition not met]
    if(!svgArea.empty()) {
        svgArea.remove();
    }

    // SVG parameter setup
    var svgWidth = 980;
    var svgHeight = 600;

    // SVG margin setup
    var margin = {
        top: 20,
        right: 40,
        bottom: 100,
        left: 100,
    };

    // Width and height using margins and parameters
    var width = svgWidth - margin.right - margin.left;
    var height = svgHeight - margin.top - margin.bottom;

    // Append division class chart to scatter element
    var chart = d3.select("#scatter").append("div").classed("chart", true);

    // Append SVG element to the chart with appropriate height and width
    var svg = chart.append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    
    // Append SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Initial parameters
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";

    // Function for updating xScale
    function xScale(demoData, chosenXAxis) {

        // Create Scale Function for Chart (chosenXAxis)
        var xLinearScale = d3.scaleLinear()
          .domain([d3.min(demoData, d => d[chosenXAxis]) * 0.8,
            d3.max(demoData, d => d[chosenXAxis]) * 1.2
          ])
          .range([0, width]);
        return xLinearScale;
      };

    // Function for updating yScale
    function yScale(demoData, chosenYAxis) {

        // Create Scale Functions for Chart (chosenYAxis)
        var yLinearScale = d3.scaleLinear()
          .domain([d3.min(demoData, d => d[chosenYAxis]) * 0.8,
            d3.max(demoData, d => d[chosenYAxis]) * 1.2
          ])
          .range([height, 0]);
        return yLinearScale;
      };

    // Function for Updating xAxis
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
            xAxis.transition()
             .duration(1000)
             .call(bottomAxis);
        return xAxis;
    };

    // Function for Updating yAxis
    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
            yAxis.transition()
             .duration(1000)
             .call(leftAxis);
        return yAxis;
    };

    // For Change in x or y axis
    // Function for updating circles group with a transition to new circles
    function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
    };

    // Function for updating text group with a transition to new text
    function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]))
      .attr("text-anchor", "middle");
    return textGroup;
    };

    // Function to stylize x-axis values for tooltips
    function styleX(value, chosenXAxis) {

        // Stylize based on chosen variable
        // Poverty percentage of sample population
        if (chosenXAxis === 'poverty') {
            return `${value}%`;
        }
        // Household income in dollars
        else if (chosenXAxis === 'income') {
            return `$${value}`;
        }
        // age (number)
        else {
            return `${value}`;
        }
    };

    // Function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

        // Select x label
        // Poverty percentage of sample population
        if (chosenXAxis === 'poverty') {
            var xLabel = "Poverty (%)";
        }
        // Household income in dollars
        else if (chosenXAxis === 'income') {
            var xLabel = "Median Income:";
        }
        // Age (number)
        else {
            var xLabel = "Age (Median)";
        };

        // Select y label
        // Percentage of population sample lacking healthcare
        if (chosenYAxis === 'healthcare') {
            var yLabel = "Lack of Healthcare (%)"
        }
        // Percentage obese population sample
        else if (chosenYAxis === 'obesity') {
            var yLabel = "Obesity (%):"
        }
        // Smoking percentage of sample population
        else {
            var yLabel = "Smokers (%)"
        };

         // Initialize tooltip
        var toolTip = d3.tip()
        .attr("class", "tooltip d3-tip")
        .offset([90, 90])
        .html(function(d) {
            return (`<strong>${d.abbr}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
        });

        // Add Events
        // Create circles tooltip in chart
        circlesGroup.call(toolTip);

        // Create event listeners displaying and hiding circles tooltip
        circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
        })
            // Onmouseout event
            .on("mouseout", function(data) {
                toolTip.hide(data);
            });

        // Create text tooltip in chart
        textGroup.call(toolTip)

        // Create event listeners displaying and hiding text tooltip
        textGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
            // Onmouseout event
            .on("mouseout", function(data) {
                toolTip.hide(data);
            })
        return circlesGroup;
    };

    // Initalize data from file and execute below code
    d3.csv("assets/data/data.csv").then(function(demoData) {
        
        // Parse data
        demoData.forEach(function(data) {
            data.poverty = + data.poverty;
            data.age = + data.age;
            data.income = + data.income;
            data.healthcare = + data.healthcare;
            data.obesity = + data.obesity;
            data.smokes = + data.smokes;
        });

        console.log(demoData);

        // Create x and y linear scale function for chart
        var xLinearScale = xScale(demoData, chosenXAxis);
        var yLinearScale = yScale(demoData, chosenYAxis);

         // Create Axis Functions for the Chart
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append xAxis to chart
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // Append yAxis to chart
        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

        // Create and append initial circles
        var circlesGroup = chartGroup.selectAll(".stateCircle")
            .data(demoData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("class", "stateCircle")
            .attr("r", 15)
            .attr("opacity", ".75");

        // Append text to circles
        var textGroup = chartGroup.selectAll(".stateText")
            .data(demoData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]*.98))
            .text(d => (d.abbr))
            .attr("class", "stateText")
            .attr("font-size", "12px")
            .attr("text-anchor", "middle")
            .attr("fill", "white");

        // Create group for 3 x-axis labels
        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);
        
        // Append label for poverty
        var povertyLabel = xLabelsGroup.append("text")
            .classed("aText", true)
            .classed("active", true)
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .text("In Poverty (%)");

        // Append label for age
        var ageLabel = xLabelsGroup.append("text")
            .classed("aText", true)
            .classed("inactive", true)
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age")
            .text("Age (Median)");

        // Append label for income
        var incomeLabel = xLabelsGroup.append("text")
            .classed("aText", true)
            .classed("inactive", true)
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income")
            .text("Household Income (Median)");

        // Create group for 3 y-axis labels
        var yLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);

        // Append label for health care
        var healthcareLabel = yLabelsGroup.append("text")
            .classed("aText", true)
            .classed("active", true)
            .attr("x", 0)
            .attr("y", 0 - 20)
            .attr("dy", "1em")
            .attr("transform", "rotate(-90)")
            .attr("value", "healthcare")
            .text("Lacks Healthcare (%)");
        
        // Append label for smoke
        var smokesLabel = yLabelsGroup.append("text")
            .classed("aText", true)
            .classed("inactive", true)
            .attr("x", 0)
            .attr("y", 0 - 40)
            .attr("dy", "1em")
            .attr("transform", "rotate(-90)")
            .attr("value", "smokes")
            .text("Smokes (%)");

        // Append label for obesity
        var obesityLabel = yLabelsGroup.append("text")
            .classed("aText", true)
            .classed("inactive", true)
            .attr("x", 0)
            .attr("y", 0 - 60)
            .attr("dy", "1em")
            .attr("transform", "rotate(-90)")
            .attr("value", "obesity")
            .text("Obese (%)");
        
        // Update toolTip function
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

        // xAxis labels event listener
        xLabelsGroup.selectAll("text")
            .on("click", function() {
            
            // Get value of selection
            var value = d3.select(this).attr("value");
                console.log(value)
            if (value !== chosenXAxis); {
            
            // Replace chosenXAxis with value
            chosenXAxis = value;

            // Update xScale with new data
            xLinearScale = xScale(demoData, chosenXAxis);

            // Update xAxis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // Update circle with new values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // Update text with new values
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            // Update tooltips with new details
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

            // Change class to bold text
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else if (chosenXAxis === "age") {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }   
        };
      
        // y axis labels event listener
        yLabelsGroup.selectAll("text")
            .on("click", function() {
        
        // Get value of select detail
        var value = d3.select(this).attr("value");
            console.log(value)

            // Check if value is same as current axis
            if (value !== chosenYAxis) {

                // Replace chosenYAxis with value
                chosenYAxis = value;

                // Update y scale with new data
                yLinearScale = yScale(demoData, chosenYAxis);

                // Update x axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);

                // Update circle with new y values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // Update text with new y values
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                // Update tooltips with new detail
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);

                // Change classes to change bold text
                if (chosenYAxis === "obesity") {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenYAxis === "smokes") {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else {
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    }
                };
            });
        });
    });
}