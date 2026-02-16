/* 
  Assignment 3 Github example: https://github.com/SIAT-IAT-355/A3-Intro-to-vegalite
  Mehdi's tutorial: https://www.youtube.com/watch?v=V3FuV_h46wM
*/

async function fetchData() {
  // Ensure years appear as numbers, not strings (e.g. "NaN")
  const data = await d3.csv("./dataset/videogames_wide.csv", d3.autoType);
  return data;
}

fetchData().then(async (data) => {

  // QUESTION 1
  const q1Vis1 = vl
    .markRect()
    .data(data)
    .encode(
      vl.y().fieldN("Genre").sort("x").title("Genre"),
      vl.x().fieldN("Platform").sort("-color").title("Platform"),
      vl
        .color()
        .fieldQ("Global_Sales")
        .aggregate("sum")
        .title("Total Global Sales (millions)"),
      vl.tooltip([
        { field: "Genre", type: "nominal" },
        { field: "Platform", type: "nominal" },
        {
          field: "Global_Sales",
          type: "quantitative",
          aggregate: "sum",
          title: "Total Sales (millions)",
        },
      ]),
    )
    .width("container")
    .height(400)
    .toSpec();

  // QUESTION 2
  const q2Vis1 = vl
    .markArea({ line: true })
    .data(data)
    .transform([
      // remove invalid years
      vl.filter("datum.Year != null && !isNaN(datum.Year)"),
      {
        aggregate: [
          { op: "sum", field: "Global_Sales", as: "Total_Global_Sales" },
        ],
        groupby: ["Year", "Genre"],
      },
    ])
    .encode(
      vl.x().fieldO("Year").title("Year"),
      vl.y().fieldQ("Total_Global_Sales").title("Global Sales (millions)"),
      vl.color().fieldN("Genre").title("Genre"),
      vl.tooltip([
        { field: "Year", type: "ordinal" },
        { field: "Genre", type: "nominal" },
        {
          field: "Total_Global_Sales",
          type: "quantitative",
          aggregate: "sum",
          title: "Global Sales",
        },
      ]),
    )
    .width("container")
    .height(400)
    .toSpec();

  const q2Vis2 = vl
    .markLine({ point: true })
    .data(data)
    .transform([
      vl.filter("datum.Year != null && !isNaN(datum.Year)"),
      {
        aggregate: [
          { op: "sum", field: "Global_Sales", as: "Total_Global_Sales" },
        ],
        groupby: ["Year", "Platform"],
      },
      // Filter out global sales below threshold because consoles lose popularity over time and there's too many data points aa the grpah goes on
      vl.filter("datum.Total_Global_Sales >= 2"),
    ])
    .encode(
      vl.x().fieldO("Year").title("Year"),
      vl.y().fieldQ("Total_Global_Sales").title("Global Sales (millions)"),
      vl.color().fieldN("Platform").title("Platform"),
      vl.tooltip([
        { field: "Year", type: "ordinal" },
        { field: "Platform", type: "nominal" },
        {
          field: "Total_Global_Sales",
          type: "quantitative",
          aggregate: "sum",
          title: "Global Sales",
        },
      ]),
    )
    .width("container")
    .height(400)
    .toSpec();

  // QUESTION 3
  const q3Vis1 = vl
    .markCircle({ opacity: 1 })
    .data(data)
    .transform(
      // Create regional sales category because NA, JP, EU, Other are all separate columns
      // I had to ask AI where to start with this question because I couldn't get my graphs to work but I read Fold doc afterwards: https://vega.github.io/vega-lite/docs/fold.html
      vl
        .fold(["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"])
        .as(["Region", "Sales"]),
      // Combine total sales per platform per region
      vl
        .aggregate([{ op: "sum", field: "Sales", as: "Total_Sales" }])
        .groupby(["Platform", "Region"]),
    )
    .encode(
      vl.x().fieldN("Platform").sort("-size").title("Platform"),
      vl.y().fieldN("Region").title("Region"),
      vl.size().fieldQ("Total_Sales").title("Total Sales (millions)"),
      vl.color().fieldN("Region"),
      vl.tooltip(["Platform", "Region", "Total_Sales"]),
    )
    .width("container")
    .height(400)
    .toSpec();

  const q3Vis2 = vl
    .markBar()
    .data(data)
    .transform(
      vl
        .fold(["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"])
        .as(["Region", "Sales"]),
      vl
        .aggregate([{ op: "sum", field: "Sales", as: "Total_Sales" }])
        .groupby(["Platform", "Region"]),
    )
    .encode(
      vl.x().fieldN("Platform").title("Platform"),
      vl
        .y()
        .fieldQ("Total_Sales")
        .stack("normalize")
        .title("Share of Total Platform Sales"),
      vl.color().fieldN("Region").title("Region"),
      vl.tooltip(["Platform", "Region", "Total_Sales"]),
    )
    .width("container")
    .height(400)
    .toSpec();

  // QUESTION 4
  const q4Vis1 = vl
    .markLine({ point: true })
    .data(data)
    .transform(
      vl.filter("datum.Year >= 2000 && datum.Year <= 2020"),
      // Categorizing data from dataset -> VL doc - Population Pyramid: https://observablehq.com/@vega/vega-lite-api-v5
      // Exclude PC from Microsoft
      vl
        .calculate(
          `
    datum.Platform == 'PS2' || 
    datum.Platform == 'PS3' || 
    datum.Platform == 'PS4' || 
    datum.Platform == 'PSP' || 
    datum.Platform == 'PSV' 
      ? 'Sony' :
    datum.Platform == 'XB' || 
    datum.Platform == 'X360' || 
    datum.Platform == 'XOne'
      ? 'Microsoft' :
    datum.Platform == 'GC' || 
    datum.Platform == 'Wii' || 
    datum.Platform == 'WiiU' || 
    datum.Platform == 'DS' || 
    datum.Platform == '3DS'
      ? 'Nintendo' :
    null
  `,
        )
        .as("Company"),
      // Remove non-Nintendo/Sony/Microsoft platforms
      vl.filter("datum.Company != null"),
    )
    .encode(
      // not sure why fieldT doesn't work here afetr filtering the year
      vl.x().fieldO("Year").title("Year"),
      vl
        .y()
        .fieldQ("Global_Sales")
        .aggregate("sum")
        .title("Total Global Sales (Millions)"),
      vl.color().fieldN("Company").title("Company"),
      vl.tooltip([
        { field: "Year", type: "quantitative" },
        { field: "Company", type: "nominal" },
        {
          field: "Global_Sales",
          type: "quantitative",
          aggregate: "sum",
          title: "Total Sales",
        },
      ]),
    )
    .width("container")
    .height(400)
    .toSpec();

  const q4Vis2 = vl
    .markBar()
    .data(data)
    .transform(
      vl.filter("datum.Year >= 2000 && datum.Year <= 2020"),
      vl
        .calculate(
          `
    datum.Platform == 'PS2' || 
    datum.Platform == 'PS3' || 
    datum.Platform == 'PS4' || 
    datum.Platform == 'PSP' || 
    datum.Platform == 'PSV'
      ? 'Sony' :
    datum.Platform == 'XB' || 
    datum.Platform == 'X360' || 
    datum.Platform == 'XOne'
      ? 'Microsoft' :
    datum.Platform == 'GC' || 
    datum.Platform == 'Wii' || 
    datum.Platform == 'WiiU' || 
    datum.Platform == 'DS' || 
    datum.Platform == '3DS'
      ? 'Nintendo' :
    null
  `,
        )
        .as("Company"),
      vl.filter("datum.Company != null"),
    )
    .encode(
      vl.x().fieldN("Genre").sort("-y").title("Genre"),
      vl
        .y()
        .fieldQ("Global_Sales")
        .aggregate("sum")
        .title("Total Global Sales (Millions)"),
      vl.xOffset().fieldN("Company"),
      vl.color().fieldN("Company").title("Company"),
      vl.tooltip([
        { field: "Genre", type: "nominal" },
        { field: "Company", type: "nominal" },
        {
          field: "Global_Sales",
          type: "quantitative",
          aggregate: "sum",
          title: "Total Sales",
        },
      ]),
    )
    .width("container")
    .height(400)
    .toSpec();

  // QUESTION 1
  render("#q1-vis1", q1Vis1);
  // QUESTION 2
  render("#q2-vis1", q2Vis1);
  render("#q2-vis2", q2Vis2);
  // QUESTION 3
  render("#q3-vis1", q3Vis1);
  render("#q3-vis2", q3Vis2);
  // QUESTION 4
  render("#q4-vis1", q4Vis1);
  render("#q4-vis2", q4Vis2);
});

async function render(viewID, spec) {
  // Change tooltip theme: https://github.com/vega/vega-tooltip/
  const result = await vegaEmbed(viewID, spec, {
    tooltip: { theme: "dark" },
  });
  result.view.run();
}
