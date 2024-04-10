import {
    plot_width, plot_height, margin, brilliancyColors
} from './constants.js';

// Data loading and visualization for white players
d3.csv("chess_data.csv").then(function (data) {
    // Create SVG for white players
    const svgWhite = createSVG("#score-plot");

    // Create bars for white players
    createBars(svgWhite, data);
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
        d.Score = +d.Score;
    });

    // Determine the maximum absolute value for y-axis
    const maxYValue = Math.max(
        Math.abs(d3.max(data, (d) => Math.abs(d.Score))),
        Math.abs(d3.min(data, (d) => Math.abs(d.Score)))
    ) * 1.1;

    // Create scales
    const xScale = d3
        .scaleBand()
        .domain(data.map((d, i) => `${i + 1}. ${d.Move}`))
        .range([0, plot_width])
        .padding(0);

    const yScale = d3.scaleLinear()
        .domain([-maxYValue, maxYValue])
        .range([plot_height, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d => Math.abs(d));

    // Add axes to the SVG
    var x_axis_elems = svg
        .append("g")
        .attr("transform", `translate(0, ${yScale(0)})`)
        .call(xAxis)
        .selectAll("text") // Select all x-axis labels
        .remove();

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
            d.Score >= 0 ? yScale(d.Score) : yScale(0)
        )
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => Math.abs(yScale(0) - yScale(d.Score)))
        .attr("fill", (d) => (d.Player === "White" ? "white" : "black"))
}
