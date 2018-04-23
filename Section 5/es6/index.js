// Adding libraries as dependencies in HTML file
<script src="../libs/d3-selection.v1.js"></script>
<script src="../libs/d3-scale-chromatic.v1.min.js"></script>
<script src="../libs/d3-geo-projection.v1.min.js"></script>

// Javascript code to use them
d3.select('.chart');
d3.geoGringortenQuincuncial();

// ES6 code to add libraries
import {scaleOrdinal} from "d3-scale";
import {select} from "d3-selection";

// Standard way to use d3 functions
var svg = d3.select(".chart")
var color = d3.scaleOrdinal()...
// Using d3 functions with ES6
var svg = select(".chart")
var color = scaleOrdinal()

// Importing completeD3 library
import * as d3 from "d3";
import * as d3scale from "d3-scale"


// Arrow functions and method shorthand
// With Javascript
symbolGroups.append("path")
    .attr("fill", function (d) {
        return color(d.name)
    })
    .attr("d", function (d) {
        return d3.symbol()
            .size(2400)
            .type(d.symbol)();
    });

//With ES6 using arrows
symbolGroups.append("path")
    .attr("fill", d => color(d.name))
    .attr("d", d => {
        return d3.symbol()
            .size(2400)
            .type(d.symbol)()
    });

symbolGroups.append("path")
     .attr("fill", d => color(d.name))
     .attr("attr1", d => { console.log(this); return "attr1"})
     .attr("attr2", function(d) { console.log(this); return "attr1" })
     .attr("d", d => {
          return d3.symbol()
              .size(2400)
              .type(d.symbol)()
     });

var obj = {
    doSomething(name = 'd3') {
    },
    doSomethingElse(count = 100) {
    }
}

// Block-scoped binding constructs
// Standard
function varTest() {
  for (i = 10 ; i < 20 ; i++) {
      console.log(i)
  }
  if (i < 10) { var i; }
}

// With ES6
const margin = {top: 20, bottom: 20, right: 20, left: 30};
const width = 600 - margin.left - margin.right;
const height = 200 - margin.top - margin.bottom;
let svg = select(".chart")

// String interpolation
// Standard
let svg = select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Using Arrow
var symbolGroups = svg.selectAll(".symbol").data(symbols)
    .enter()
    .append("g")
    .attr("class", "symbol")
    .attr("transform", d => "translate(" + xBand(d.name) + " 40)")

// Avoiding + to concatenate
.attr("transform", `translate(${margin.left}, ${margin.top})`);
.attr("transform", d => `translate(${xBand(d.name)} 40)`)
