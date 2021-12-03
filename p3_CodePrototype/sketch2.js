let video;
let poseNet;
let poses = [];


var grid; //create a variable for the grid
var w = 20; //the width of the grid
var cols; //variable for the amount of columns
var rows; //variable for the amount of rows



function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady); //posenent code referenced from ml5
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();


  //Code for making a grid referenced from Light up dox with nose points by Xinjiapang, https://editor.p5js.org/Xinjiapang/sketches/AeJFtNHB
  cols = floor(width / w); //set the column depending on the "w" and devided as a whold numbernumber
  rows = floor(height / w); // set the rows depending on the "w" and devided as a whold number
  grid = make2DArray(cols, rows);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i * w, j * w, w); //the size of colume and rows are times by "w"
    }
  }
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, windowWidth, windowHeight);
  //background covering the video feed
  background(000);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }
  drawsquare();
}
//this function makes the rows and columns of the grid and recognizes when the posenet keypoints are near a box on the grid, when keypoints are near the boxes then turn orange
function drawsquare() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      for (let a = 0; a < poses.length; a++) {
        let pose = poses[a].pose;
        for (let b = 0; b < pose.keypoints.length; b++) {
          let keypoint = pose.keypoints[b];
          if (keypoint.score > 0.2) {
            if (grid[i][j].contains(keypoint.position.x, keypoint.position.y)) {
              grid[i][j].reveal();
              this.revealed = true;
            } else {
              this.revealed = false;
            }
          }
        }
      }
    }
  }
}

function make2DArray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}
//this code makes the cells
function Cell(x, y, w) {
  this.x = x;
  this.y = y;
  this.w = w;
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      for (let a = 0; a < poses.length; a++) {
        let pose = poses[a].pose;
        for (let b = 0; b < pose.keypoints.length; b++) {
          let keypoint = pose.keypoints[b];
          if (keypoint.score > 0.2) {
            if (grid[i][j].contains(keypoint.position.x, keypoint.position.y)) {
              grid[i][j].reveal();
              this.revealed = true;
            } else {
              this.revealed = false;
            }
          }
        }
      }
    }
  }
}

Cell.prototype.show = function() {
  stroke(0);
  noFill();
  rect(this.x, this.y, this.w, this.w);
  if (this.revealed) {
    fill(255, 120, 000);
    noStroke();
    rect(this.x, this.y, this.w, this.w)
  } else {
    
  }
}

Cell.prototype.contains = function(x, y) {
  return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
}

Cell.prototype.reveal = function() {
  this.revealed = true;
}