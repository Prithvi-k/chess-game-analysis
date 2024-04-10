import {
    plot_width,
    plot_height,
    margin
} from './constants.js';

// Define color constants
const BAR_COLOR = "#5c3e2f";
const DOT_COLOR_YES = "red";
const DOT_COLOR_NO = "green";
const BANDWIDTH_LINE_COLOR = "grey";
const AXIS_LINE_COLOR = "blue";

var plot_height_adj = 2 * plot_height; // 500

d3.csv("chess_data_3.csv").then(function (data) {
    console.log(data)

    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", plot_width + margin.left + margin.right)
        .attr("height", plot_height_adj)
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`);

    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", plot_width)
        .attr("height", plot_height_adj)
        .attr("fill", "white");

    var allMoves = data.map(d => d["Move"]);
    console.log(allMoves)
    var xScale = d3.scaleBand()
        .domain(data.map(d => d["Move"]))
        .range([0, plot_width])
    // .paddingInner(0.01);
    console.log(xScale.domain)
    var yScale = d3.scaleLinear()
        .domain([100, 0])
        .range([plot_height_adj - 3, 3]);

    svg.append("g")
        .attr("transform", `translate(0,0)`)
        .call(d3.axisTop(xScale))
        .selectAll("text")
        .remove();

    svg.append("g")
        .attr("transform", `translate(0,${plot_height_adj})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .remove();

    svg.append("g")
        .attr("transform", `translate(0, 0)`)
        .call(d3.axisLeft(yScale))
        .selectAll("path, line")
        .attr("stroke", "black");

    svg.selectAll(".tick text")
        .style("fill", "black");

    svg.selectAll(".bar")
        .data(data)
        .enter(console.log(data))
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d["Move"]))
        .attr("y", d => yScale(d["Win"]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => plot_height_adj - yScale(d["Win"]))
        .attr("fill", BAR_COLOR);

    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d["Move"]) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d["Win"]))
        .attr("r", 5) // Radius of the dot
        .attr("fill", d => d["Kill Moves"] === "No" ? DOT_COLOR_NO : DOT_COLOR_YES);

    svg.selectAll(".bandwidth-line")
        .data(data)
        .enter()
        .append("line")
        .attr("class", "bandwidth-line")
        .attr("x1", d => xScale(d["Move"]) + xScale.bandwidth())
        .attr("y1", 0)
        .attr("x2", d => xScale(d["Move"]) + xScale.bandwidth())
        .attr("y2", plot_height_adj)
        .attr("stroke", BANDWIDTH_LINE_COLOR)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");

    svg.append("line")
        .attr("x1", 0)
        .attr("y1", yScale(50))
        .attr("x2", plot_width)
        .attr("y2", yScale(50))
        .attr("stroke", AXIS_LINE_COLOR)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "5,5");
});
