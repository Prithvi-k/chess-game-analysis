// Load the data from the CSV file
d3.csv("data.csv").then(function(data) {
    // Convert Score values to integers
    data.forEach(function(d) {
        d.Score = +d.Score;
    });

    // Set up dimensions for the SVG
    var margin = {top: 20, right: 0, bottom: 30, left: 40},
        width = 2250- margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Create SVG element
    var svg = d3.select("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + (margin.left + width / 2+220) + "," + (margin.top + height / 2) + ")"); // Center the SVG

    // Scale functions
    var x = d3.scaleBand()
              .domain(data.map(function(d, i) { return i; }))
              .range([-width / 2, width / 2]) // Adjusted the range for x-axis
              .padding(0.1);

    var y = d3.scaleLinear()
              .domain([d3.min(data, function(d) { return Math.min(d.Score, 0); }), d3.max(data, function(d) { return Math.max(d.Score, 0); })])
              .nice()
              .range([height / 2, -height / 2]); // Adjusted the range for y-axis

    // Create bars
    svg.selectAll(".bar")
       .data(data)
       .enter().append("rect")
       .attr("class", function(d) { return "bar " + (d.Score >= 0 ? "positive" : "negative"); })
       .attr("x", function(d, i) { return x(i); })
       .attr("y", function(d) { return d.Score >= 0 ? y(d.Score) : height / 2 - 150; }) // Adjusted y-positioning
       .attr("width", x.bandwidth())
       .attr("height", function(d) { return Math.abs(y(d.Score) - y(0)); });

    // Add x-axis line
    svg.append("line")
       .attr("x1", -width / 2)
       .attr("y1", 75)
       .attr("x2", width / 2)
       .attr("y2", 75)
       .style("stroke", "black");

    // Add y-axis line
    svg.append("line")
       .attr("x1", -width / 2)
       .attr("y1", height / 2)
       .attr("x2", -width / 2)
       .attr("y2", -height / 2)
       .style("stroke", "black");

    // Add y-axis ticks and labels
    var yAxis = d3.axisLeft(y);
    svg.append("g")
       .attr("class", "y axis")
       .call(yAxis)
       .attr("transform", "translate(" + (-width / 2) + ", 0)"); // Move y-axis to the left side

    // Add a title
    svg.append("text")
       .attr("x", 0)
       .attr("y", 75 - (margin.top / 2))
       .attr("text-anchor", "middle")
       .style("font-size", "16px")
       .text("Score After Each Move");
});
