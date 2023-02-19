let max_iterations = 100;
let color = [255, 0, 0]; // RED

// Not changable until I say so

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let currentRow = 0;
let requestId = null;

function generateMandelbrot() {

  const numInput = document.getElementById("transparencyInput");

  max_iterations = transparencyInput.value;

  const hues = [];
  for (let i = 0; i < max_iterations; i++) {
    const hue = color.map((c) => Math.floor((c * i) / max_iterations));
    hues.push(hue);
  }

  const start = performance.now();
  console.log(color);
  while (currentRow < canvas.height) {
    for (let i = 0; i < canvas.width; i++) {
      let Z = new Complex(0, 0);
      const x = i * 0.004 - 2;
      const y = currentRow * -0.004 + 2;
      const C = new Complex(x, y);

      let maxPixelIteration = 0;
      for (let x = 0; x < max_iterations; x++) {
        Z = Z.square().add(C);

        maxPixelIteration += 1;
        if (Z.abs() > 2) {
          break;
        }
      }

      if (Z.abs() > 2) {
        const hueIndex = Math.max(maxPixelIteration - 1, 0);
        const [r, g, b] = hues[hueIndex];
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(i, currentRow, 1, 1);
      } else {
        // Part of set
        // Color Code BLACK
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(i, currentRow, 1, 1);
      }
    }

    currentRow++;

    if (performance.now() - start > 16) {
      // 60 fps
      // If the current frame took more than 16ms (60 fps), exit the loop and schedule the next frame
      requestId = requestAnimationFrame(generateMandelbrot);
      return;
    }
  }

  // If we reached the last row, cancel the animation frame request and reset the current row counter
  cancelAnimationFrame(requestId);
  currentRow = 0;
}

class Complex {
  constructor(real, imag) {
    this.real = real;
    this.imag = imag;
  }

  add(other) {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  square() {
    const real = this.real * this.real - this.imag * this.imag;
    const imag = 2 * this.real * this.imag;
    return new Complex(real, imag);
  }

  abs() {
    return Math.sqrt(this.real * this.real + this.imag * this.imag);
  }
}

const generateBtn = document.getElementById("generateBtn");
generateBtn.addEventListener("click", () => {
  if (requestId) {
    // If the generation is already in progress, cancel the previous animation frame request
    cancelAnimationFrame(requestId);
  }
  requestId = requestAnimationFrame(generateMandelbrot);
});

const square = document.getElementById("square");

square.addEventListener("click", () => {
  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.addEventListener("input", () => {
    square.style.backgroundColor = colorPicker.value;
    let s = hexToRgb(colorPicker.value);
    color[0] = s.r;
    color[1] = s.g;
    color[2] = s.b;
    console.log(color);
  });
  colorPicker.click();
});

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
