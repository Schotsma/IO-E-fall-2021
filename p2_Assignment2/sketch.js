// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
First Sprint done by Colin Schotsman
based on ml5 example code and webcam pixel array code by enickles https://editor.p5js.org/enickles/sketches/-5G_xggEe
=== */

let cam;
let poseNet;
let poses = [];
let img;
let x = 0; 
var l = -2; //variable for the left side of the screen
var r = 8; //variable for the right side of the screen


function setup() {
  createCanvas(windowWidth, windowHeight);
  cam = createCapture(VIDEO);
  cam.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(cam, {outputStride:8, quantBytes:4}, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  cam.hide();
  pixelDensity(1);
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function mousePressed(){
  console.log(JSON.stringify(poses))
}

function draw() {

  loadPixels();

  cam.loadPixels();

  strokeWeight(2);

   // For one pose only (use a for loop for multiple poses!)
   if (poses.length > 0) {
    const pose = poses[0].pose;
      console.log(pose);

     
    // Create a pink ellipse for the nose
    fill(213, 0, 143);
    const nose = pose.nose;
    // image(img, nose.x/2, nose.y/2, 200, 200);

    r = map(nose.x, 0, 640, 8, -2); //initially tried to map numbers to the nose X position and adde them to the pixel array
    l = map(nose.x, 0, windowWidth, -2, 8);
    s = map(nose.y, 0, windowHeight, 0, 255); //created variable to use for saturation

    console.log(l);
 

  for (let x = 0; x < width; x++) { //this code is for the x width of the screen 
    for (let y = 0; y < height; y++) { //line for the y height
      
      let index = (x + y * width) * 4;
      
      let revIndex = (width - x - 1 + y * width) * 4
      
      if (l > 6 ) { //made a bunch of if statements to call different combinitions of the pixels
      pixels[index + 0] = cam.pixels[index + 0 ];
      pixels[index + 1] = cam.pixels[revIndex + 1];
      pixels[index + 2] = cam.pixels[index + 3];//blue colour
      pixels[index + 3] = s;

      } else if (l < 6 && l > 4) {
      pixels[index + 0] = cam.pixels[index + 2 ];//more of a purple colour
      pixels[index + 1] = cam.pixels[revIndex + 2];
      pixels[index + 2] = cam.pixels[index + 3]; 
      pixels[index + 3] = s;

      } else if (l < 4 && l > 2) {
      pixels[index + 0] = cam.pixels[index + 0 ];
      pixels[index + 1] = cam.pixels[revIndex + 2]; //more of a green
      pixels[index + 2] = cam.pixels[index + 1];
      pixels[index + 3] = s;

    } else if ( l < 2 && l > 1) {
      pixels[index + 0] = cam.pixels[index + 2 ]; //slightly yellow
      pixels[index + 1] = cam.pixels[revIndex + 1]; 
      pixels[index + 2] = cam.pixels[index + 0];
      pixels[index + 3] = s;

    } else if ( l < 1 && l > -1) {
      pixels[index + 0] = cam.pixels[index + 3 ]; //yellow/orange
      pixels[index + 1] = cam.pixels[revIndex + 2];
      pixels[index + 2] = cam.pixels[index + 0];
      pixels[index + 3] = s;

    } else if (l < -1) {
      pixels[index + 0] = cam.pixels[index + 3 ]; //orange/blue
      pixels[index + 1] = cam.pixels[revIndex + 2];
      pixels[index + 2] = cam.pixels[index + 2];
      pixels[index + 3] = s; //this controls the variety of colours on screen
    }
  }

}
updatePixels();
}
}