var timeLeft = 0;
var timerId = setInterval(countdown, 1000);
var spotArray = [];
var RELOAD_INTERVAL = 1000;


function countdown() {
	//console.log("Timer Fired: " + timeLeft);
	if (timeLeft == 0) {		
		$.get( "http://www.dxsummit.fi/api/v1/spots", function( data ) {
			document.getElementById("divSpots").innerHTML = updateTable(data);
		});
		
		timeLeft = RELOAD_INTERVAL;
	}
	document.getElementById("lblCountdown").innerHTML = timeLeft;
	timeLeft--;
}
function updateTable(json_data) {
	//console.log("Parsing JSON");
	//console.log(json_data);
	var result = "";
	result += "<table>";
	result += "<tr>";
	result += "<th>Spotter</th>";
	result += "<th>Frequency</th>";
	result += "<th>Band</th>";
	result += "<th>DX</th>";
	//result += "<th>Country</th>";
	//result += "<th>Mode</th>";
	result += "<th>Time</th>";
	result += "<th>Info</th>";
	result += "</tr>";
	for (i = 0; i < json_data.length; i++) {
		if (!(json_data[i] in spotArray)) {
			//console.log("Adding " + json_data[i].id);
			if (json_data[i].frequency.toString().includes(".") == false) {
				json_data[i].frequency = json_data[i].frequency.toString() + ".0";
			}
			spotArray.push(json_data[i]);
			console.log("Added: " + json_data[i].id);
		}
		//console.log(json_data[i]);
	}
	spotArray.sort();
	for (i = 0; i < spotArray.length; i++) {
		band = getBandFromFreq(spotArray[i].frequency);
		//console.log(band);
		if (band != "OOB") {
			//console.log(spotArray[i]);
			//console.log(JSON.stringify(spotArray[i]));
			//console.log("Printing" + spotArray[i].id);
			result += "<tr>";
			result += "<td>" + spotArray[i].de_call + "</td>";
			result += "<td>" + spotArray[i].frequency + "</td>";
			result += "<td>" + band + "</td>";
			result += "<td>" + spotArray[i].dx_call + "</td>";
			//result += "<td>" + spotArray[i].country + "</td>";
			//result += "<td>" + spotArray[i].mode + "</td>";
			result += "<td>" + spotArray[i].time.substring(11); + "</td>";
			result += "<td>" + spotArray[i].info + "</td>";
			result += "</tr>";
		}
	}
	result += "</table>";
	//console.log(result);
	return result;
}

function sortSpotsByID(){
	newSpotArray = [];
	currentMaxID = 0;

	for (i = 0; i < spotArray.length; i++) {
		{
		}
	}
	
}


function zzz() {
	console.log("Checking localStorage");
	var localval = localStorage.getItem("10M_checked");
	console.log("Local Value for 10m: " + $localval);
	if (localval == false) {
		document.getElementById("10Mcb").checked = false;
		console.log(localStorage.getItem("Read: 10M_checked"));
	}
	if (localStorage.getItem("12M_checked") == false) {
		document.getElementById("12Mcb").checked = false;
		console.log(localStorage.getItem("Read: 12M_checked"));
	}
	if (localStorage.getItem("15M_checked") == "false") {
		document.getElementById("15Mcb").checked = false;
	}
	if (localStorage.getItem("17M_checked") == "false") {
		document.getElementById("17Mcb").checked = false;
	}
	if (localStorage.getItem("20M_checked") == "false") {
		document.getElementById("20Mcb").checked = false;
	}
	if (localStorage.getItem("30M_checked") == "false") {
		document.getElementById("30Mcb").checked = false;
	}
	if (localStorage.getItem("40M_checked") == "false") {
		document.getElementById("40Mcb").checked = false;
	}
	if (localStorage.getItem("80M_checked") == "false") {
		document.getElementById("80Mcb").checked = false;
	}
	if (localStorage.getItem("160M_checked") == "false") {
		document.getElementById("160Mcb").checked = false;
	}
}

function getBandFromFreq($freq) {
	//console.log("Band Check: " + $freq);
	var re10m = new RegExp('^2[8-9]...[.].$');
	if (re10m.test($freq) == true) { return "10M"; }
	var re12m = new RegExp('^24[8-9]..[.].$');
	if (re12m.test($freq) == true) { return "12M"; }
	var re15m = new RegExp('^21[0-4]..[.].$');
	if (re15m.test($freq) == true) { return "15M"; }
	var re17m = new RegExp('^18[0-1]..[.].$');
	if (re17m.test($freq) == true) { return "17M"; }
	var re20m = new RegExp('^14[0-3]..[.].$');
	if (re20m.test($freq) == true) { return "20M"; }
	var re30m = new RegExp('^101[0-5].[.].$');
	if (re30m.test($freq) == true) { return "30M"; }
	var re40m = new RegExp('^7[0-3]..[.].$');
	if (re40m.test($freq) == true) { return "40M"; }
	var re80m = new RegExp('^3[5-9]..[.].$');
	if (re80m.test($freq) == true) { return "80M"; }
	var re160m = new RegExp('^1[8-9]..[.].$');
	if (re160m.test($freq) == true) { return "160M"; }
	return "OOB";
}

function getModeFromFreq($freq) {
	
}

function toggleBand(cb) {
	localStorage.setItem(cb.checked, cb.name + "_checked");
	console.log("Event: " + cb.name + "_checked");
	//alert(cb.checked + "  /  " + cb.name + "_checked");
}
