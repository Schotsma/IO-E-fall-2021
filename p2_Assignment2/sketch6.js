
// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

//This code may be used to change face filters on a person's face, They can change the face to three different moods
//code referenced from ml5 Example
//This code uses p5js example code

let cam;
let poseNet;
let btn1, btn2, btn3; //declare the different buttons and their sections
let controller = " "; //leave the controller empty until you activate one of the controllers
let nose; //declare the nose

let img; //the first image
let img2; //second image
let img3; //third image

function preload() {
	img = loadImage('images/face1.svg') //the first image on the left
	img2 = loadImage('images/face3.svg') //the second image in the middle
	img3 = loadImage('images/face2.svg') //the third image on the right
  }

setup = () => {
    createCanvas(windowWidth, windowHeight);//make the video take up the whole window width and height
    cam = createCapture(VIDEO);
    cam.hide();
    cam.size(windowWidth, windowHeight);
    poseNet = ml5.poseNet(cam, {
        flipHorizontal: true //flips the video feed
    }, modelReady);
    poseNet.on('pose', gotPoses);

    nose = createVector(width / 2, height / 2);

    noStroke();
    btn1 = new HButton((width / 3) - 300, (height/2), "Face 1"); //button for the first face
    btn2 = new HButton((width / 2), (height/2), "Face 2"); //button for the second face
    btn3 = new HButton((width / 1.5) + 300, (height/2), "Face 3"); //button for the third face
}

let gotPoses = (poses) => {
    //console.log(poses);
    //only detect if there is a person
    if (poses.length > 0) {
        nose.x = lerp(poses[0].pose.keypoints[0].position.x, nose.x, 0.5);
        nose.y = lerp(poses[0].pose.keypoints[0].position.y, nose.y, 0.5);
		
    }
}

let modelReady = () => {
    console.log('model ready');
}

draw = () => {
    //flip the video to match interaction
    push();
    translate(windowWidth, 0);
    scale(-1.0, 1.0);
    image(cam, 0, 0, windowWidth, windowHeight);
    scale(1.0, 1.0);
    pop();
	  

    //Fade background
    fill(250, 250, 250, 20);
    rect(0, 0, width, height);

    //draw buttons, pass in the nose positions to check if the nose is in a section
    btn1.update(nose.x, nose.y);
    btn2.update(nose.x, nose.y);
    btn3.update(nose.x, nose.y);

    //draw content
    fill(50);
    textAlign(CENTER);
    textSize(48);
    if (controller == "Face 1") {
        //content for maybe intro section goes here
        
        fill(255, 0, 0, 100);
        image(img, nose.x/2, nose.y/2, 500, 500); //change image to face image number 1
    }
    if (controller == "Face 2") {
        //main interaction section - probably won't need a button
        
        fill(0, 200, 0, 100);
        image(img2, nose.x/2, nose.y/2, 500, 500); //change image to face image number 2
    }
    if (controller == "Face 3") {
        //some kind of end section 
        
        fill(0, 0, 200, 100);
        image(img3, nose.x/2, nose.y/2, 500, 500); // change image to face image number 3
    }

}

class HButton {
    constructor(posX, posY, label) { //constructor for the buttons
        this.x = posX;
        this.y = posY;
        this.label = label;
        this.hover = 0;
    }

    update(lx, ly) { //update and expand buttons on hover
        rectMode(CENTER);
        fill(0, 200, 0, 0);
        rect(this.x, this.y, width/3, windowHeight);

        let ld = dist(this.x, this.y, lx, ly);
        if (ld < width/6 ) {
            this.hover += 2;
            if (this.hover > width/3) {
                controller = this.label;
                this.hover -= 6;
            }
        } else {
            if (this.hover > 0) this.hover -= 6;
            if (this.hover < 0) this.hover = 0;
        }
        fill(0, 255, 120, 50);
        rect(this.x, this.y, windowWidth/3, this.hover);
        
        rectMode(CORNERS);
        fill(255);
        textAlign(CENTER);
        textSize(24);
        text(this.label, this.x, this.y + 9);

    }
}

