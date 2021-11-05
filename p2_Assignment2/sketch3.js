// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


//Third Sprint for Colin 
//This code allows the user to draw lines with their nose, they can also change the colour depending on the x and y position of their nose on the screen, the size of the stroke also
//also increases the size of the stroke weight depending on the y position of the user's nose

let video;
let poseNet; 
let poses = [];
let skeletons = [];

let pg;
let pg2;//line for the hands
let pg3;//line for other hand

let noseX;
let noseY;
// let leftWristX;
// let leftWristY;
// let rightWristX;
// let rightWristY;

// let pLeftWristX;
// let pLeftWristY;
// let pRightWristY;
// let pRightWristX;

let pNoseX;
let pNoseY;

var b = 255;
var r = 255;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);

  pixelDensity(1);
  pg = createGraphics(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);

  poseNet.on('pose', function(results) {
    poses = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function draw() {
  image(video, 0, 0, width, height);

  image(pg, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  b = map(noseX, 0, windowWidth, 0, 255); //map the nose x position to 0 and 255 for the blue colour value 
  r = map(noseY, 0, windowHeight, 0, 255); //map the nose y position to 0 and 255 for the red colour value

  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < min(poses.length, 1); i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        if (j == 0) { // position "0" in array poses[] is the nose, pos 1 = left eye, pos 2 =                       right eye, etc. 
          noseX = keypoint.position.x;
          noseY = keypoint.position.y;
        //   leftWristX = keypoint.position.x; tried to add drawing using the wrist positions
        //   leftWristY = keypoint.position.y;
        //   rightWristX = keypoint.position.x;
        //   rightWristY = keypoint.position.y;

          pg.stroke(r, 0, b);
        //   pg2.stroke(leftWristX, leftWristY, 0);
        //   pg3.stroke(rightWristX, rightWristY, 0);
          pg.strokeWeight(r);
        //   pg2.strokeWeight(10);
        //   pg3.strokeWeight(10);
          pg.line(noseX, noseY, pNoseX, pNoseY);
        //   pg2.line(leftWristX, leftWristY, pLeftWristX, pLeftWristY);
        //   pg3.line(rightWristX, rightWristY, pRightWristX, pRightWristY);

          pNoseX = noseX;
          pNoseY = noseY;
        //   pLeftWristX = leftWristX;
        //   pLeftWristY = leftWristY;
        //   pRightWristX = rightWristX;
        //   pRightWristY = rightWristY;
        }
      }
    }
  }
}

// The callback that gets called every time there's an update from the model
function gotPoses(results) {
  poses = results;
}

function keyPressed() { //clear the screen when the keys are pressed
  pg.clear();
}

function modelReady() {
  select('#status').html('model Loaded');
}
