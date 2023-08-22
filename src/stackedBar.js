import * as d3 from "d3";

// Example Data Input

/**
 * A function to create a stacked horizontal bar chart.
 *
 * See example for typical data input format (array of objects). Assumes first property in each object represent the Y axis categories.
 * All other properties should describe counts of each subcategory.
 *
 * @typedef {Object} StackedBarHorizontal
 * @property {function} data - Sets the data for the chart.
 * @property {function} pixelGapBetweenStacks - Sets the gap between stacked bars in pixels.
 * @property {function} positionTopLeft - Sets the top left position of the chart relative to the top of the y-axis line.
 * @property {function} positionBottomRight - Sets the bottom right position of the chart relative to the right of the x-axis line.
 * @property {function} yScale - Sets a pre-computed yScale for the chart.
 * @property {function} hideAxisX - Hides the x-axis of the chart.
 * @property {function} showAxisX - Shows the x-axis of the chart.
 * @property {function} hideAxisY - Hides the y-axis of the chart.
 * @property {function} showAxisY - Shows the y-axis of the chart.
 * @property {function} yTickSize - Sets the tick size for the y-axis.
 * @returns {function} The main function for creating the chart.
 *
 * @example
 *
 * // Example dataset where category is 'gene' and subCategories are the mutation types ('missense' and 'nonsense')
 * const data = [
 *   {"gene": "BRCA1", "missense": 2, "nonsense": 2 },
 *   {"gene": "TP53",  "missense": 2, "nonsense": 1 }
 * ]
 *
 *
 * const chart = stackedBarHorizontal()
 *   .data(data) // Set the data
 *   .positionTopLeft([50, 50]) // Set the top left position relative to the top of y-axis line
 *   .positionBottomRight([800, 700]) // Set the bottom right position relative to the right of x-axis line
 *   //.yScale(yScale) // Set a pre-computed yScale
 *
 * const svg = d3
 *   .select("body")
 *   .append("svg")
 *   .attr("width", window.innerWidth)
 *   .attr("height", window.innerHeight)
 *   .call(chart) // Render the chart
 */
export const stackedBarHorizontal = () => {
  //! Properties
  let data;
  let yScale = null;
  let hideAxisX = false;
  let hideAxisY = false;
  let yTickSize = 0;
  let ypadding = 0.2;
  let positionTopLeft = [50, 50]; //Top left position (based on top left of y Axis line)
  let positionBottomRight = [800, 700]; //bottom right position (based on bottom right of x axis line)
  let pixelGapBetweenStacks = 2;

  const my = (selection) => {
    //! Figure Out Categories
    const categoryName = Object.keys(data[0])[0]; // Assume first column values should represent y axis bandscale values
    const subCategoryNames = Object.keys(data[0]).slice(1); // Assume all but first column value represent categories to colour by

    //! Calculate Domains and Ranges for Scales
    const totals = calculateTotals(data);
    const maxTotal = Math.max(...totals.map((d) => d.total));

    const yAccessor = (d) => d[categoryName];
    const yDomain = data.map(yAccessor);

    const yRange = [positionTopLeft[1], positionBottomRight[1]];
    const xRange = [positionTopLeft[0], positionBottomRight[0]];

    //! Create Scales
    const xScale = d3.scaleLinear().domain([0, maxTotal]).range(xRange);

    const colorScale = d3
      .scaleOrdinal()
      .domain(subCategoryNames)
      .range([
        "#66c2a5",
        "#fc8d62",
        "#8da0cb",
        "#e78ac3",
        "#a6d854",
        "#ffd92f",
        "#e5c494",
        "#b3b3b3",
      ]);

    //? Allow user to supply a pre-computed yScale. If none supplied create one
    let yScaleComputed;
    if (yScale === null) {
      yScaleComputed = d3
        .scaleBand()
        .domain(yDomain)
        .range(yRange)
        .padding(ypadding);
    } else {
      yScaleComputed = yScale;
    }

    //! Create Stack
    const stackGenerator = d3.stack().keys(subCategoryNames);
    const stackedSeries = stackGenerator(data);

    //! Reorder Stack
    // Not Implemented Yet

    //! Create Marks Array
    const marks = [];
    stackedSeries.map((d) => {
      d.map((dInner) =>
        marks.push({
          x: dInner[0],
          width: dInner[1] - dInner[0],
          y: dInner.data[categoryName],
          xPixels: xScale(dInner[0]),
          widthPixels:
            xScale(dInner[1]) - xScale(dInner[0]) - pixelGapBetweenStacks,
          yPixels: yScaleComputed(dInner.data[categoryName]),
          heightPixels: yScaleComputed.bandwidth(),
          tooltip: categoryName + "<br>" + "width: " + (dInner[1] - dInner[0]),
          subCategory: d.key,
          color: colorScale(d.key),
        })
      );
    });

    //! Create Parent Group
    const chartGroup = selection
      .selectAll(".stacked-bar")
      .data([null])
      .join("g")
      .attr("class", "stacked-bar");

    //! Render Stacked Bars
    chartGroup
      .selectAll(".stacked-bar-rect-group")
      .data([0])
      .join("g")
      .attr("class", "stacked-bar-rect-group")
      .selectAll(".stacked-rect")
      .data(marks)
      .join("rect")
      .attr("class", "stacked-rect")
      .attr("fill", "grey")
      .attr("stroke", "black")
      .attr("x", (d) => d.xPixels)
      .attr("y", (d) => d.yPixels)
      .attr("width", (d) => d.widthPixels)
      .attr("height", (d) => d.heightPixels)
      .attr("fill", (d) => d.color)
      .attr("stroke-width", 0);

    //! Rendering Axes
    const yAxis = d3
      .axisLeft(yScaleComputed)
      .tickSizeOuter(0)
      .tickSize(yTickSize);
    const xAxis = d3.axisBottom(xScale);

    if (!hideAxisY) {
      chartGroup
        .selectAll(".y-axis")
        .data([null])
        .join("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${positionTopLeft[0]}, 0)`)
        .call(yAxis);
    }

    if (!hideAxisX) {
      chartGroup
        .selectAll(".x-axis")
        .data([null])
        .join("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${positionBottomRight[1]})`)
        .call(xAxis);
    }

    return chartGroup;
  };

  //! Getters / Setters
  my.data = function (_) {
    return arguments.length ? ((data = _), my) : data;
  };

  my.pixelGapBetweenStacks = function (_) {
    return arguments.length
      ? ((pixelGapBetweenStacks = _), my)
      : pixelGapBetweenStacks;
  };

  my.positionBottomRight = function (_) {
    return arguments.length
      ? ((positionBottomRight = _), my)
      : positionBottomRight;
  };

  my.positionTopLeft = function (_) {
    return arguments.length ? ((positionTopLeft = _), my) : positionTopLeft;
  };

  my.positionBottomRight = function (_) {
    return arguments.length
      ? ((positionBottomRight = _), my)
      : positionBottomRight;
  };

  my.yScale = function (_) {
    if (!arguments.length) return yScale;
    yScale = _;
    console.log("Premade yScale supplied to stackedBarHorizontal");
    return my;
  };

  my.hideAxisX = function () {
    hideAxisX = true;
    return my;
  };

  my.showAxisX = function () {
    hideAxisX = false;
    return my;
  };

  my.hideAxisY = function () {
    hideAxisY = true;
    return my;
  };

  my.showAxisY = function () {
    hideAxisY = false;
    return my;
  };

  my.yTickSize = function (_) {
    return arguments.length ? ((yTickSize = _), my) : yTickSize;
  };
  //return function for method chaining
  return my;
};

function calculateTotals(data) {
  return data.map((obj) => {
    // Calculate the sum of all properties except the first
    const total = Object.values(obj).reduce((sum, value, index) => {
      if (index !== 0) {
        // Skip the first column
        return sum + value;
      }
      return sum;
    }, 0);

    // Create an array with the 'y' and 'total' properties
    return { y: obj[Object.keys(data[0])[0]], total };
  });
}
