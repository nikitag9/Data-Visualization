// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of cereal
    updateChart(category);
}

// recall that when data is loaded into memory, numbers are loaded as strings
// this function helps convert numbers into string during data preprocessing
function dataPreprocessor(row) {
    return {
        cerealName: row['Cereal Name'],
        manufacturer: row['Manufacturer'],
        sugar: +row['Sugars']
    };
}

var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = { t: 60, r: 20, b: 80, l: 60 };

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Variable for the spacing of bar charts
var barBand;
var barWidth;

var sugarScale;
var xBandScale;
// scales
// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', `translate(${padding.l}, ${padding.t})`);

var data;

d3.csv('cereals.csv', dataPreprocessor).then(function (dataset) {
    // Create global variables here and intialize the chart
    data = dataset;
    let cerealNames = data.map(d => d.cerealName)

    sugarScale = d3.scaleLinear().domain([0,15]).range([chartHeight,0]); // y axis
    xBandScale = d3.scaleBand().domain(cerealNames).range([0, chartWidth]); // x axis
  
    cutoff = 0;
    // Compute the spacing for bar bands based on number of cereals
    barBand = chartWidth / data.length;
    barWidth = 0.7 * barBand;

    // **** Your JavaScript code goes here ****
    d3.select('#main')
        .append('p')
        .append('button')
        .style("border", "1px solid black")
        .text('Filter Data')
        .on('click', function() {
            cutoff = document.getElementById('cutoff').value;
            onCategoryChanged();
        });
    // Add axes to chart
    addAxes();
    // Update the chart for All cereals to initialize
    updateChart('All');
});

function addAxes() {
    // **** Draw the axes here ****
    var group = d3.select('svg');
    group.append('g').attr('class', 'x-axis')
        .attr('transform', 'translate(55,250)')
        .call(d3.axisBottom(xBandScale))
        .attr("stroke-opacity", 0)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "translate(-10,0)rotate(-45)");

    group.append('g').attr('class', 'y-axis')
        .attr('transform', 'translate(55,60)')
        .call(d3.axisLeft(sugarScale).ticks(8));

    group.append('text')
        .attr('class', 'title')
        .attr('transform', 'translate(250, 30)')
        .text('Sugars In Cereals');
}

function updateChart(manufacturer) {
    //  Create a filtered array of cereals based on the manufacturer
    var cereals;
    if (manufacturer === 'All')
        cereals = data.filter(d => d.manufacturer !== manufacturer);
    else cereals = data.filter(d => d.manufacturer === manufacturer);

    // //**** Draw and Update your chart here ****
    cereals = cereals.filter(d => d.sugar >= cutoff);

    cerealNames = cereals.map(d => d.cerealName)
    xBandScale = d3.scaleBand().domain(cerealNames).range([0, barBand * cereals.length]);

    d3.select("svg").select("g.x-axis")
    .attr('transform', 'translate(55, 250)')
    .call(d3.axisBottom(xBandScale))
    .attr("stroke-opacity", 0)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("transform", "translate(-10,0) rotate(-45)");


    var cereal = chartG.selectAll('.bar')
        .data(cereals);

    var cerealEnter = cereal.enter()
        .append('rect')
        .attr('class', 'bar');

    cerealEnter.merge(cereal)
        .attr('transform', function(d,i) {
            return 'translate('+[i * barBand, sugarScale(d.sugar)]+')';
        })
        .attr("height", function(d, i) {
            return chartHeight - sugarScale(d.sugar);
        })
        .attr("width", barWidth)
        .attr("fill", "blue")
        .attr("padding", barBand);

    cereal.exit().remove();
    chartG.selectAll("text").remove();
}
// Remember code outside of the data callback function will run before the data loads

