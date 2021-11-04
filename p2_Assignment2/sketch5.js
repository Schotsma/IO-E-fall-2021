// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
This code uses p5js example code and the leftWrist and rightWrist to draw on the screen
=== */

let video;
let poseNet;
let poses = [];
let graphics;
let modelLoaded = false;

function setup() {
    pixelDensity(1);
    //    createCanvas(640, 480);
    //    graphics = createGraphics(640, 480);
    createCanvas(windowWidth, windowHeight);
    graphics = createGraphics(windowWidth, windowHeight);
    graphics.clear();

    graphics.colorMode(HSB);

    video = createCapture(VIDEO);
    video.size(width, height);

    let options = {
        maxPoseDetections: 5,
    }
    poseNet = ml5.poseNet(video, modelReady, options);
    poseNet.on('pose', function (results) {
        poses = results;
    });
    video.hide();
}

function modelReady() {
    select('#status').html('Model Loaded');
    modelLoaded = true;
}

function draw() {
    image(video, 0, 0, width, height);
    drawKeypoints();
    image(graphics, 0, 0);
}

function drawKeypoints() {

    if (poses.length > 0) { //create pose recognition for the right wrist and for the 
        let pose = poses[0].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            let rightWrist = pose.keypoints.find(keypoint => keypoint.part === 'rightWrist');
            let leftWrist = pose.keypoints.find(keypoint => keypoint.part === 'leftWrist');

            let keypoint = pose.keypoints[j];
            let handHue = (rightWrist.position.x / width) * 360;

            if (keypoint.score > 0.5 && keypoint.part == "rightWrist") { //create an ellipse at the right wrist
                graphics.fill(handHue, 100, 100);
                graphics.noStroke();
                graphics.ellipse(keypoint.position.x, keypoint.position.y, 200);
            }

            if (keypoint.score > 0.5 && keypoint.part == "leftWrist") { //create an ellipse at the left wrist position
                graphics.fill(handHue, 100, 100);
                graphics.noStroke();
                graphics.ellipse(keypoint.position.x, keypoint.position.y, height - rightWrist.position.y);
            }
        }
    }
}

// A function to draw the skeletons
function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
        let skeleton = poses[i].skeleton;
        // For every skeleton, loop through all body connections
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            stroke(255, 0, 0);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}
