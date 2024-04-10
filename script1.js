import {
   plot_width, plot_height, margin
} from './constants.js';

var plot_height_adj = 2 * plot_height; // 500

// Load the data from the CSV file
d3.csv("data.csv").then(function (data) {
   // Convert Score values to integers
   data.forEach(function (d) {
      d.Score = +d.Score;
      console.log("test", d.Score);
   });

   // Create SVG element
   var svg = d3.select("#score-plot") // Attached to the same div as other plots
      .append("svg")
      .attr("width", plot_width + margin.left + margin.right)
      .attr("height", plot_height_adj)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

   // Scale functions
   var x = d3.scaleBand()
      .domain(data.map(function (d, i) { return i; }))
      .range([0, plot_width]) // Adjusted the range for x-axis

   var y = d3.scaleLinear()
      .domain([d3.min(data, function (d) { return Math.min(d.Score, 0); }), d3.max(data, function (d) { return Math.max(d.Score, 0); })])
      .nice()
      .range([plot_height, 0]); // Adjusted the range for y-axis

   // Create bars
   svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", function (d) { return "bar " + (d.Score >= 0 ? "positive" : "negative"); })
      .attr("x", function (d, i) { return x(i); })
      .attr("y", function (d) { return d.Score >= 0 ? y(d.Score) : 0; }) // Adjusted y-positioning
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return Math.abs(y(d.Score) - y(0)); });

   // Add x-axis line
   svg.append("line")
      .attr("x1", 0)
      .attr("y1", plot_height)
      .attr("x2", plot_width)
      .attr("y2", plot_height)
      .style("stroke", "black");

   // Add y-axis line
   svg.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", plot_height)
      .style("stroke", "black");

   // Add y-axis ticks and labels
   var yAxis = d3.axisLeft(y);
   svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

   // Add a title
   svg.append("text")
      .attr("x", plot_width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Score After Each Move");
});
