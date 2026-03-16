import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let svg;
let shapes = [];
let circleCount = 0;

const width = 800;
const height = 600;

const repelDistance = 80; // how close mouse must be
const repelStrength = 25; // how strongly shapes move

async function prepareVis() {
  svg = d3
    .select("#vis")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px solid black");
  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "white");

  svg.on("click", function (event) {
    const [x, y] = d3.pointer(event);

    if (shapes.length >= 20) return;

    const newShape = svg
      .append("circle")
      .attr("cx", x)
      .attr("cy", y)
      .attr("r", 15)
      // get random colours
      .attr("fill", d3.schemeCategory10[Math.floor(Math.random() * 10)]);

    shapes.push(newShape);

    // update circle counter
    circleCount++;
    updateCounter();
  });

  // mouse movement interaction
  svg.on("mousemove", function (event) {
    const [mouseX, mouseY] = d3.pointer(event);

    shapes.forEach((shape) => {
      let cx = +shape.attr("cx");
      let cy = +shape.attr("cy");

      let dx = cx - mouseX;
      let dy = cy - mouseY;

      // handle case of clicking on top of circle + division by zero in (dx / distance)
      let distance = Math.sqrt(dx * dx + dy * dy) || 1;

      if (distance < repelDistance) {
        let moveX = (dx / distance) * repelStrength;
        let moveY = (dy / distance) * repelStrength;

        let newX = cx + moveX;
        let newY = cy + moveY;

        // check if circle outside borders
        if (newX < 0 || newX > width || newY < 0 || newY > height) {
          // remove from SVG and array
          shape.remove();
          shapes = shapes.filter((s) => s !== shape);

          circleCount--;
          updateCounter();
        } else {
          shape.transition().duration(100).attr("cx", newX).attr("cy", newY);
        }
      }
    });
  });
}

function updateCounter() {
  document.getElementById("circleCount").textContent = circleCount;
}

async function runApp() {
  await prepareVis();
}

runApp();
