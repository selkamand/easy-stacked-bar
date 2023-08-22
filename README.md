
# easy-stacked-bar

A simple package for generating D3 horizontal stacked barplots

![Alt text](img/image.png)

## Installation

Install the latest release from npm

`npm install easy-stacked-bar`


## Quick Start

```{javascript}
import * as d3 from "d3";
import { stackedBarHorizontal, count, dputJS } from "easy-stacked-bar";

const data = [
    {
      gene: "BRCA2",
      missense: 5,
      nonsense: 0,
      multiple: 0,
    },
    {
      gene: "BRCA1",
      missense: 2,
      nonsense: 2,
      multiple: 1,
    },
    {
      gene: "RAD51",
      missense: 8,
      nonsense: 0,
      multiple: 0,
    },
    {
      gene: "TP53",
      missense: 9,
      nonsense: 0,
      multiple: 0,
    }
  ];


const chart = stackedBarHorizontal()
    .data(data) // Set the data
    .positionTopLeft([50, 50]) // Set the top left position
    .positionBottomRight([800, 700]) // Set the bottom right position
   //.yScale(yScale) // Optionally use a pre-computed yScale

// Create SVG
const svg = d3
   .select("body")
   .append("svg")
   .attr("width", window.innerWidth)
   .attr("height", window.innerHeight)

// Create Chart
const stackedBarChart = chart(svg) // Render the chart

```


## Counting Long Data

Sometimes your data is not summarised in the wide 'count' format `stackedBarChart()` expects. 
If your data is in a long-form, use `count()` to produce the required wide-count format.

How count works is easiest to understand using an example:


```{javascript}
// Input Data
const longData = [
   { x: "Patient1", gene: "BRCA1", type: "missense" },
   { x: "Patient2", gene: "BRCA1", type: "missense" },
   { x: "Patient3", gene: "BRCA1", type: "nonsense" },
   { x: "Patient4", gene: "BRCA1", type: "nonsense" },
   { x: "Patient5", gene: "TP53", type: "missense" },
   { x: "Patient6", gene: "TP53", type: "missense" },
   { x: "Patient6", gene: "TP53", type: "nonsense" }
 ];
 const dataCounts = count(longData, 'gene', 'type');

 console.log(dataCounts);

 // Output:
 // [
 //   {"gene": "BRCA1", "missense": 2, "nonsense": 2 },
 //   {"gene": "TP53",  "missense": 2, "nonsense": 1 }
 // ]
```