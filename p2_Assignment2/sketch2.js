// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Second Sprint for Colin
Trying to draw images in a grid using the right wrist from posenet base on code from ml5 and code by monicagwen https://editor.p5js.org/monicawen/sketches/HJyPp-J1E
=== */

let video;
let poseNet;
let poses = [];
let positionsLeft = [];
let positionsRight = [];
var img;
let gridX = 10;
let gridY = 10;
let grid = [];
let flowers = [];

function preload() {
  img = loadImage("images/face.svg"); //load an image of the clown face
}

function setup() {
  createCanvas(600, 600);
  video = createCapture(VIDEO);
  video.size(width, height);

    //Introducing poseNet
    poseNet = ml5.poseNet(video, {
      flipHorizontal: true
    }, modelReady);
    poseNet.on('pose', function(results) {
      poses = results;
      console.log(poses);
    });

  // Hide the video element, and just show the canvas
  video.hide();

 //making the grid
 for (let i = 0; i < gridX; i++) {
  let thisRow = [];
  for (let j = 0; j < gridY; j++) {
    thisRow.push(0);
  }
  grid.push(thisRow);
}
console.log(grid);

}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);

  // background(220);
  //get position of right and left hand
  if (poses.length > 0) {
    let rightWrist = poses[0].pose.keypoints[9].position;
    fill(255, 64);
    ellipseMode(CENTER);
    noStroke();
   

    //Draw the grid
    let rectSizeX = width / gridX;
    let rectSizeY = height / gridY;
    for (let i = 0; i < gridX; i++) {
      for (let j = 0; j < gridY; j++) {

        rect(i * rectSizeX, j * rectSizeY,
          rectSizeX, rectSizeY);
        if (rightWrist.x > i * rectSizeX && //use the right wrist to detect when it is over a grid
          rightWrist.x < (i * rectSizeX) + rectSizeX &&
          rightWrist.y > j * rectSizeY &&
          rightWrist.y < (j * rectSizeY) + rectSizeY) {
          grid[i][j] = 255;
        }
        if (grid[i][j] === 255) {
          
          //Draw the clown faces in the grid
          image(img, i * width/10, j * width/10, width/15, width/15);
        }
      }
    }
}
}
