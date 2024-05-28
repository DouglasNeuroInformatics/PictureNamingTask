#### timing-accuracy

- how accurate does the timing measurement have to be?
- current implementation aronud 17-33 ms to display image
- Response time measurements in jsPsych (and JavaScript in general) are comparable to those taken in standard lab software like Psychophysics Toolbox and E-Prime. Response times measured in JavaScript tend to be a little bit longer (10-40ms), but have similar variance.
- more info https://www.jspsych.org/7.3/overview/timing-accuracy/

#### data

- is downloading the data at the end of each experiment enough or is persistant data storage needed (eg a db like mySQL)

#### browsers

- will computers have latest version of chrome/firefox?

#### accessing

- how is this accessed?
- deploying a server?
- running a server on a local machine?

#### for two screen set up

##### potential implementations

- http/2 server push
- websockets
- shared worker (no server)
- Window: open() method https://developer.mozilla.org/en-US/docs/Web/API/Window/open
