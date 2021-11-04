// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Fourth Sprint done by Colin Schotsman
based on ml5 example code and Spiral Mirror code by enickles https://editor.p5js.org/enickles/sketches/tQZhSIcyG
=== */


let poseNet;
let poses = [];
let renderer, ctx, canvas, img, centerX, centerY;

function preload() {
    // img = loadImage("1.jpeg");
    img = createCapture(VIDEO)
      // img = loadImage("1.jpeg");
    // img.resize(400,400);
    img.hide()
  }

function setup() {
  // img.resize(400,400);
	renderer = createCanvas(400, 400);
	ctx = renderer.drawingContext;
	
	centerX = width/2;
	centerY = height/2;
	
	canvas = createGraphics(width, height);
	canvas.noStroke();
	canvas.translate(centerX, centerY);
	canvas.scale(1, -1);
	canvas.translate(-centerX, -centerY);
	canvas.image(img, 0, 0);
    // canvas.background(0)
 
     // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(img, {outputStride:8, quantBytes:4}, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });

}

function modelReady() {
  select('#status').html('Model Loaded');
}

function mousePressed(){
  console.log(JSON.stringify(poses))
}

function draw() {

 // For one pose only (use a for loop for multiple poses!)
 if (poses.length > 0) {
    const pose = poses[0].pose;
      console.log(pose);

     
    // 
    fill(213, 0, 143);
    const nose = pose.nose; //use the nose position


  background(255);
  canvas.image(img, 0, 0);
  let angle = nose.x/width*TWO_PI; //use the nose x position to change the angle
  let space = nose.y/height*30+15; //use the nose y position to change the amount of circles on screen
  
  //build mask //The code below is referenced from the mirror code by enickles
  const start = 100;
  let maskImage = createGraphics(width,height);
  maskImage.ellipse(centerX, centerY, start, start);
  maskImage.noFill();
  maskImage.strokeWeight(space);
  for(let i = start+space; i < width; i += space*4){
      maskImage.ellipse(centerX, centerY, i, i);
  }
  
  ctx.save();
  //background
  ctx.globalCompositeOperation="source-in";
  translate(centerX, centerY);
  rotate(angle);
  translate(-centerX, -centerY);
  image(maskImage, 0, 0);
  image(canvas, 0, 0);
  
  //overlay
  ctx.globalCompositeOperation="destination-atop";
  translate(centerX, centerY);
  rotate(-angle*2);
  translate(-centerX, -centerY);
  image(img, 0, 0);
  ctx.restore();
}
}
