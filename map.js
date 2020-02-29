"use strict";

const m = {
  width: 800,
  height: 600
};

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", m.width)
  .attr("height", m.height);

const g = svg.append("g");

d3.json("./nygeo.json").then(function(data) {
  let albersProj = d3
    .geoAlbers()
    .scale(80000)
    .rotate([74.006, 0])
    .center([0, 40.7128])
    .translate([m.width / 2, m.height / 2]);

  const geoPath = d3.geoPath().projection(albersProj);

  g.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("fill", "#ddd")
    .attr("d", geoPath);

  d3.csv("data.csv").then(function(pointData) {
    let airbnbs = svg.append("g");

    airbnbs
      .selectAll("circle")
      .data(pointData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => {
        return albersProj([d.longitude, d.latitude])[0];
      })
      .attr("cy", d => {
        return albersProj([d.longitude, d.latitude])[1];
      })
      .attr("fill", "#FF5A5F")
      .attr("r", 1.5)
      .attr("opacity", 0.2)
      .on("click", function() {
        d3.select(this)
          .attr("opacity", 1)
          .transition()
          .duration(500)
          .attr("x", 800 * Math.round(Math.random()))
          .attr("y", 600 * Math.round(Math.random()))
          .attr("opacity", 0)
          .on("end", () => {
            d3.select(this).remove();
          });
      });
  });
});
