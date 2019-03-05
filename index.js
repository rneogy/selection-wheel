let shiftDown = false;
let x = 0;
let y = 0;
let shiftX = 0;
let shiftY = 0;

const lineLength = 200;
const textRadius = 100;
const minRadius = 10;

const options = ["Select", "Multi-Select", "Range"];

const pointerTypeSpan = document.querySelector("#pointer-type");
const selectWheel = document.querySelector("#select-wheel");

const optionTexts = [];
const optionLines = []

for (let i = 0; i < options.length; i++) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  const a = ((2 * Math.PI) / options.length) * i - Math.PI;
  line.setAttribute("x1", 0);
  line.setAttribute("y1", 0);
  line.setAttribute("x2", Math.cos(a) * lineLength);
  line.setAttribute("y2", Math.sin(a) * lineLength);
  optionLines.push(line);
  selectWheel.appendChild(line);

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.innerHTML = options[i];
  const textA = a + Math.PI / options.length;
  text.setAttribute("x", Math.cos(textA) * textRadius);
  text.setAttribute("y", Math.sin(textA) * textRadius);
  text.setAttribute("text-anchor", "middle");
  optionTexts.push(text);
  selectWheel.appendChild(text);
}

document.addEventListener("mousemove", e => {
  x = e.clientX;
  y = e.clientY;
  if (e.shiftKey) {
    const index = indexFromPoints();
    optionTexts.forEach((v, i) => {
      if (i === index) {
        v.classList.add("highlighted");
      } else {
        v.classList.remove("highlighted");
      }
    });
    optionLines.forEach((v, i) => {
      if (index != null && (i === index || i === (index+1)%optionLines.length)) {
        v.classList.add("highlighted");
      } else {
        v.classList.remove("highlighted");
      }
    });
  }
});

document.addEventListener("keydown", e => {
  if (e.repeat) {
    return;
  }
  if (e.key === "Shift") {
    shiftX = x;
    shiftY = y;
    selectWheel.setAttribute("transform", `translate(${x},${y})`);
    selectWheel.classList.remove("hide");
  }
});

const indexFromPoints = () => {
  const dx = x - shiftX;
  const dy = y - shiftY;
  if (Math.sqrt(dx*dx + dy*dy) < minRadius) {
    return null;
  }
  const a = Math.atan2(dy, dx);
  return Math.floor(((a + Math.PI) / (2 * Math.PI)) * options.length);
};

document.addEventListener("keyup", e => {
  if (e.key === "Shift") {
    const i = indexFromPoints();
    if (i != null && options[i]) {
      pointerTypeSpan.innerText = options[i];
    }
    selectWheel.classList.add("hide");
  }
});
