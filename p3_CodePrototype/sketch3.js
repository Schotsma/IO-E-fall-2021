let cam;

function setup() {
  createCanvas(400, 400);

  pixelDensity(1);

  cam = createCapture(VIDEO);
  cam.hide();
  noStroke();
}
//This code simply uses the pixels of the webcam video to make a black and white image appear
//These pixels could be used to activate certain LED lights on a display when the pixels are white and keep the LED dark when the pixels are dark

function draw() {
  background(220);
  image(cam, 0, 0);
  cam.loadPixels();
  for (let x = 0; x < cam.width; x += 10) {

    for (let y = 0; y < cam.height; y += 10) {

      let colorFromVideo = cam.get(x, y);
      let b = brightness(colorFromVideo);
      if (b > 20) fill('white')
      else fill('black');
      rect(x, y, 10, 10);
    }
  }
}