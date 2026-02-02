const data = [2, 10, 29, 70, 90];
const labels = [
  "Me",
  "Dolphin",
  "World Record Human",
  "Weddell Seal",
  "Sperm Whale",
];

const svg = document.getElementById("barChart");

const width = 600;
const height = 400;
const barWidth = width / data.length;
const maxVal = Math.max(...data);

// Asked Copilot how to make bars gradually change red to green:
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function blend(c1, c2, t) {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ];
}

function valueToColor(value, max) {
  const ratio = value / max;

  const stops = [
    [255, 0, 0], // red
    [255, 165, 0], // orange
    [255, 255, 0], // yellow
    [0, 255, 0], // green
  ];

  if (ratio <= 0.33) {
    const t = ratio / 0.33;
    return `rgb(${blend(stops[0], stops[1], t).join(",")})`;
  }

  if (ratio <= 0.66) {
    const t = (ratio - 0.33) / 0.33;
    return `rgb(${blend(stops[1], stops[2], t).join(",")})`;
  }

  const t = (ratio - 0.66) / 0.34;
  return `rgb(${blend(stops[2], stops[3], t).join(",")})`;
} // End of Copilot's suggestion

// Bar chart water background
const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
const gradient = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "linearGradient",
);
gradient.setAttribute("id", "barBackground");
gradient.setAttribute("x1", "0%");
gradient.setAttribute("y1", "0%");
gradient.setAttribute("x2", "0%");
gradient.setAttribute("y2", "100%");
const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
stop1.setAttribute("offset", "0%");
stop1.setAttribute("stop-color", "#6ec6ff");
const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
stop2.setAttribute("offset", "100%");
stop2.setAttribute("stop-color", "#1b2a38");
gradient.appendChild(stop1);
gradient.appendChild(stop2);
defs.appendChild(gradient);
svg.appendChild(defs);
// Background rectangle
const bgY = height * 0.2;
const bgHeight = height - bgY;
const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
bgRect.setAttribute("x", 0);
bgRect.setAttribute("y", bgY);
bgRect.setAttribute("width", width);
bgRect.setAttribute("height", bgHeight);
bgRect.setAttribute("fill", "url(#barBackground)");
svg.appendChild(bgRect);

// Boat SVG I made on Figma
const boatGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
boatGroup.setAttribute("transform", `translate(0, ${bgY - 54})`);
const boatPath1 = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "path",
);
boatPath1.setAttribute(
  "d",
  "M10.6826 52.4729L0.21875 25.544L84.8526 18.9271L78.6974 3.53916L62.54 3.07752V0.153809H122.553L130.247 14.1569L176.719 11.0793L153.945 52.4729H10.6826Z",
);
boatPath1.setAttribute("fill", "#ffffff");
boatPath1.setAttribute("stroke-width", "0.307759");
const boatPath2 = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "path",
);
boatPath2.setAttribute(
  "d",
  "M99.3169 17.3884L91.9307 4.15479H119.321L124.861 14.6186L99.3169 17.3884Z",
);
boatPath2.setAttribute("fill", "#A2D2FF");
boatPath2.setAttribute("stroke-width", "0.307759");
boatGroup.appendChild(boatPath1);
boatGroup.appendChild(boatPath2);
svg.appendChild(boatGroup);

// Animate boat
boatGroup.setAttribute("transform", `translate(0, ${bgY - 54})`);

let boatX = -200; // start off-screen to the left
const boatSpeed = 0.1; // pixels per frame (adjust to taste)
function animateBoat() {
  boatX += boatSpeed;
  // When the boat moves past the right edge, reset to left
  if (boatX > width + 200) {
    boatX = -200;
  }
  boatGroup.setAttribute("transform", `translate(${boatX}, ${bgY - 54})`);
  requestAnimationFrame(animateBoat);
}
requestAnimationFrame(animateBoat);

// Draw bars and labels
data.forEach((d, i) => {
  const barHeight = (d / maxVal) * (height * 0.7);

  // Drawing SVG from: https://www.w3schools.com/graphics/svg_rect.asp
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", i * barWidth + barWidth * 0.2);
  rect.setAttribute("y", height * 0.2);
  rect.setAttribute("width", barWidth * 0.6);
  rect.setAttribute("height", barHeight);
  rect.setAttribute("fill", valueToColor(d, maxVal));

  svg.appendChild(rect);

  // Top label (animal/human)
  const topLabel = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text",
  );
  topLabel.setAttribute("x", i * barWidth + barWidth / 2);
  topLabel.setAttribute("y", height * 0.18);
  topLabel.setAttribute("text-anchor", "middle");
  topLabel.setAttribute("font-weight", "bold");
  topLabel.setAttribute("font-size", "12px");
  topLabel.textContent = labels[i];
  svg.appendChild(topLabel);

  const bottomLabel = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text",
  );
  bottomLabel.setAttribute("x", i * barWidth + barWidth / 2);
  bottomLabel.setAttribute("y", height * 0.2 + barHeight + 15);
  bottomLabel.setAttribute("text-anchor", "middle");
  bottomLabel.setAttribute("font-size", "12px");
  bottomLabel.setAttribute("fill", "#ffffff");
  bottomLabel.textContent = d + " min";
  svg.appendChild(bottomLabel);
});

const art = document.getElementById("svgArt");

for (let i = 0; i < 25; i++) {
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );

  circle.setAttribute("cx", Math.random() * 600);
  circle.setAttribute("cy", Math.random() * 200);
  circle.setAttribute("r", Math.random() * 30 + 5);
  circle.setAttribute("fill", `hsl(${Math.random() * 360}, 70%, 60%)`);
  circle.setAttribute("opacity", 0.7);

  art.appendChild(circle);
}
