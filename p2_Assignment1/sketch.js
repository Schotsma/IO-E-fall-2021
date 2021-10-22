
let song;//song we are going to play
let playing = false;
let serial;
let latestData = "waiting for data";  // you'll use this to write incoming data to the canvas
let splitter;
let diameter0 = 0, diameter1 = 0, diameter2 = 0;

let fft;

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  song = loadSound('assets/assets_audio_Basquiat.mp3'); //song chosen from the assets folder
  
  // Instantiate our SerialPort object
  serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results
  serial.list();
  console.log("serial.list()   ", serial.list());

  serial.open("/dev/tty.usbmodem14301");

  serial.on('connected', serverConnected);

  // When we get a list of serial ports that are available
  serial.on('list', gotList);
  // OR
  //serial.onList(gotList);

  // When we some data from the serial port
  serial.on('data', gotData);
  // OR
  //serial.onData(gotData);

  // When or if we get an error
  serial.on('error', gotError);
  // OR
  //serial.onError(gotError);

  // When our serial port is opened and ready for read/write
  serial.on('open', gotOpen);
  // OR
  //serial.onOpen(gotOpen);


 
}

// We are connected and ready to go
function serverConnected() {
  console.log("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
  console.log("List of Serial Ports:");
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  console.log("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  console.log(theerror);
}



// There is data available to work with from the serial port
function gotData() {
  var currentString = serial.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  if (!currentString) return;             // if the string is empty, do no more
  console.log("currentString  ", currentString);             // println the string
  latestData = currentString;            // save it for the draw method
  console.log("latestData" + latestData);   //check to see if data is coming in
  splitter = split(latestData, ',');       // split each number using the comma as a delimiter
  //console.log("splitter[0]" + splitter[0]); 
  diameter0 = splitter[0]; // variable for the button sensor               
  diameter1 = splitter[1]; //variable for the potentiometer
  diameter2 = splitter[2]; //variable for the light sensor



}

// We got raw data from the serial port
function gotRawData(thedata) {
  println("gotRawData" + thedata);
}

function draw() {

  if (diameter0 == 0) { //if the button is pressed than play song, uses numbers to track off and on
    // .isPlaying() returns a boolean
    song.stop();
    background(255, 0, 0);
  } else {
    song.loop();
    background (0, 255, 0);
  }
  
  text(latestData, 10,10);

  let volume = map(diameter2, 0, width, 0, 1); //volume code from Sound: Manipulate Sound by P5
  volume = constrain(volume, 0, 1);
  song.amp(volume);

  let speed = map(diameter1, 0.1, height, 0, 2); //speed code from Sound: Manipulate Sound by P5
  speed = constrain(speed, 1, 2);
  song.rate(speed);

  ellipseMode(RADIUS);    
  fill(200, diameter1, 0);
  noStroke();
  ellipse(200, 100, diameter1, diameter1); 

  fill(0, 255, 40*diameter2);
  rect(0, 880, windowWidth, -diameter2*6); //rectangle which acts as the "ocean", referenced from p5

}


