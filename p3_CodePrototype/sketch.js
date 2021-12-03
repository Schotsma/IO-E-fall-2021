// Copyright (c) 2020 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
BodyPix
=== */

let bodypix;
let video; 
let segmentation; //declare the segmentation

const options = {
  outputStride: 8, // 8, 16, or 32, default is 16
  segmentationThreshold: 0.3, // 0 - 1, defaults to 0.5
};

function preload() {
  bodypix = ml5.bodyPix(options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // load up your video
  video = createCapture(VIDEO, videoReady);
  video.size(windowWidth, windowHeight);
  video.hide();
  
}

function videoReady() {
  bodypix.segment(video, gotResults);
  
}

function draw() {
  image(video, 0, 0);

  //code for the loadPixels referenced from a sketch by falsesugar called camera and pixels in black and white, https://editor.p5js.org/falsesugar/sketches/5bWPjg1VL
  video.loadPixels();
  for (let x = 0; x < video.width; x += 10) { //this controls the width of the pixels generated

    for (let y = 0; y < video.height; y += 10) { //this controls the height of the pixels generated

      let colorFromVideo = video.get(x, y);
      let b = brightness(colorFromVideo);
      if (b > 50) fill('white') //this decides what colour to fill the pixels generated in that are brighter
      else fill('white'); //this decides what colour to fill the pixels in that are darker
      rect(x, y, 10, 10);
    }
  }
  
  if (segmentation) { //then segmentation from bodypix is used to mask the user's body and draw white pixels where the body is. 
    image(segmentation.personMask, 0, 0, width, height); //if you change personMask to backgroundMask, it will mask the background
  }
}

function gotResults(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  segmentation = result;
  bodypix.segment(video, gotResults); //show the bodyPix segmentation on the screen
}
