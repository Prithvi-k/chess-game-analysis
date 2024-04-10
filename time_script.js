import {
    plot_width, plot_height, margin, brilliancyColors
} from './constants.js';

var HIDDEN_BAR_COLOUR = '#f0f0f0';

// Data loading and visualization for white players
d3.csv("chess_data_3.csv").then(function (data) {
    // Create SVG for white players
    const svgWhite = createSVG("#plot-white");

    // Create bars for white players
    createBars(svgWhite, data, "grey");

    // Create SVG for black 
    const svgBlack = createSVG("#plot-black");

    // Create bars for black players
    createBars(svgBlack, data, "black");
});

function createSVG(container) {
    return d3.select(container)
        .append("svg")
        .attr("width", plot_width + margin.left + margin.right)
        .attr("height", plot_height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
}

function createBars(svg, data, color) {

    data.forEach(function (d) {
        d.Player = d.Player;
        d.Move = d.Move;
        d.Brilliancy = d.Brilliancy;
        color === "black" ? (d.TimeTaken = -d["Time Taken"]) : (d.TimeTaken = d["Time Taken"]);
    });

    // Create sequential array for x-axis labels
    const moves = d3.range(1, data.length + 1);

    // Determine the maximum absolute value for y-axis
    const maxYValue = Math.max(
        Math.abs(d3.max(data, (d) => Math.abs(d.TimeTaken))),
        Math.abs(d3.min(data, (d) => Math.abs(d.TimeTaken)))
    ) * 1.1;

    // Create scales
    const xScale = d3
        .scaleBand()
        .domain(data.map((d, i) => `${i + 1}. ${d.Move}`))
        .range([0, plot_width])
        .padding(0);

    const yScale = d3.scaleLinear()
        .domain(color === "black" ? [-maxYValue, 0] : [0, maxYValue])
        .range([plot_height, 0]);

    // Create axes
    const xAxis = color === "black" ? d3.axisTop(xScale) : d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d => Math.abs(d));

    // Add axes to the SVG
    var x_axis_elems = svg
        .append("g")
        .attr("transform", `translate(0, ${yScale(0)})`)
        .call(xAxis)
        .selectAll("text") // Select all x-axis labels
        .attr("transform", "rotate(-90)") // Rotate each label by -90 degrees
        .style("fill", "black") // Set the fill color of the labels
        .attr("y", 0) // Reset the y-coordinate
        .attr("x", -10) // Adjust the x-coordinate to ensure the labels stay within the plot area
        .attr("dy", ".35em") // Fine-tune the vertical positioning if needed
        .style("text-anchor", "end")
        .selectAll("path, line")
        .attr("stroke", "black");

    if (color === "grey") {
        x_axis_elems.attr("y", -10); // Move labels above the axis line
    }


    // x_axis_elems.selectAll("text").remove();

    svg.append("g").call(yAxis).selectAll("path, line")
        .attr("stroke", "black");

    svg.selectAll(".tick text")
        .style("fill", "black");

    // Create bars
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(`${i + 1}. ${d.Move}`))
        .attr("y", (d) =>
            d.TimeTaken >= 0 ? yScale(d.TimeTaken) : yScale(0)
        )
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => Math.abs(yScale(0) - yScale(d.TimeTaken)))
        .attr("fill", (d) => (color === "black" ? d.Player === "Black" ? brilliancyColors[d.Brilliancy] : HIDDEN_BAR_COLOUR : d.Player === "White" ? brilliancyColors[d.Brilliancy] : HIDDEN_BAR_COLOUR))
}
