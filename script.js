var timeLeft = 0;
var timerId = setInterval(countdown, 1000);
var spotArray = [];
var HASH_SECRET = "a1f9296dfb46c852d811743cadd9fc657aa0a32b9c8cfa77856efd1833528479";
var RELOAD_INTERVAL = 30;
var workedEntities = [];

function loadPage() {
	//console.log("Fired Page Load Function");
    var x = document.getElementById('ErrorPIN');
    x.style.display = 'none';
	var y = document.getElementById('NoLog');
    y.style.display = 'Block';
	var z = document.getElementById('InputPIN');
    z.style.display = 'none';
}

function showPinField() {
	var x = document.getElementById('InputPIN');
	x.style.display = 'Block';
}

function loadLog() {
	var sha256 = new jsSHA('SHA-256', "TEXT");
	sha256.update(HASH_SECRET + document.getElementById('txtPIN').value.trim());
	var hash = sha256.getHash("HEX");
	$.get( "logs/" + hash, function( data ) {
		workedEntities = JSON.parse(data);
		updateTable();
		
		var w = document.getElementById('ErrorPIN');
		w.style.display = 'none';
		var x = document.getElementById('hrline');
		x.style.display = 'none';
		var y = document.getElementById('NoLog');
		y.style.display = 'none';
		var z = document.getElementById('InputPIN');
		z.style.display = 'none';
	}).fail( function() {
		var w = document.getElementById('ErrorPIN');
		w.style.display = 'Block';
		
	});
}

function countdown() {
	if (timeLeft == 0) {		
		$.get( "http://www.dxsummit.fi/api/v1/spots", function( data ) {
			updateSpotArray(data);
			updateTable();
		});
		
		timeLeft = RELOAD_INTERVAL;
	}
	document.getElementById("lblCountdown").innerHTML = timeLeft;
	timeLeft--;
}

function updateSpotArray(json_data) {
	for (i = 0; i < json_data.length; i++) {
		if (!(isIDinSpotArray(json_data[i].id))) {
			if (json_data[i].frequency.toString().includes(".") == false) {
				json_data[i].frequency = json_data[i].frequency.toString() + ".0";
			}
			json_data[i].band = getBandFromFreq(json_data[i].frequency);
			json_data[i].mode = getModeFromFreq(json_data[i].frequency);
			json_data[i].datetime = parseInt(json_data[i].time.replace("T", "").replace("-","").replace("-","").replace(":","").replace(":",""));
			json_data[i].time = json_data[i].time.substring(11);
			if (json_data[i].info == null) {
				json_data[i].info = "";
			}
			json_data[i].country = getCountryFromCall(json_data[i].dx_call);
			spotArray.push(json_data[i]);
		}
	}
	spotArray.sort(sortByDateTime);
	
	for (i = spotArray.length - 1; i > -1; i--) {
		var date_spot = new Date(spotArray[i].datetime + "Z");
		if (Date.now() - date_spot.getTime() > 1800000) 
			spotArray.splice(i, 1);
		}
	}
}

function updateTable() {
	//console.log("LENGTH: " + spotArray.length);
	var result = "";
	result += "<table>";
	result += "<tr>";
	result += "<th>Spotter</th>";
	result += "<th>Frequency</th>";
	result += "<th>Band</th>";
	result += "<th>DX</th>";
	result += "<th>Country</th>";
	result += "<th>Mode</th>";
	result += "<th>Time</th>";
	result += "<th>Info</th>";
	result += "</tr>";
	for (i = 0; i < spotArray.length; i++) {
		if (document.getElementById("10Mcb").checked && spotArray[i].band == "10M" || 
			document.getElementById("12Mcb").checked && spotArray[i].band == "12M" || 
			document.getElementById("15Mcb").checked && spotArray[i].band == "15M" || 
			document.getElementById("17Mcb").checked && spotArray[i].band == "17M" || 
			document.getElementById("20Mcb").checked && spotArray[i].band == "20M" || 
			document.getElementById("30Mcb").checked && spotArray[i].band == "30M" || 
			document.getElementById("40Mcb").checked && spotArray[i].band == "40M" || 
			document.getElementById("80Mcb").checked && spotArray[i].band == "80M"|| 
			document.getElementById("160Mcb").checked && spotArray[i].band == "160M") {
			if (typeof workedEntities[spotArray[i].country] == "undefined") {
				result += "<tr class='lightgreen'>";
				result += "<td>" + spotArray[i].de_call + "</td>";
				result += "<td>" + spotArray[i].frequency + "</td>";
				result += "<td>" + spotArray[i].band + "</td>";
				result += "<td><a href='https://www.qrz.com/db/" + spotArray[i].dx_call + "'>" + spotArray[i].dx_call + "<a/></td>";
				result += "<td>" + spotArray[i].country + "</td>";
				result += "<td>" + spotArray[i].mode + "</td>";
				result += "<td>" + spotArray[i].time; + "</td>";
				result += "<td>" + spotArray[i].info + "</td>";
				result += "</tr>";
			}
			else if (typeof workedEntities[spotArray[i].country + "_" + spotArray[i].mode] == "undefined") {
				result += "<tr class='orange'>";
				result += "<td>" + spotArray[i].de_call + "</td>";
				result += "<td>" + spotArray[i].frequency + "</td>";
				result += "<td>" + spotArray[i].band + "</td>";
				result += "<td><a href='https://www.qrz.com/db/" + spotArray[i].dx_call + "'>" + spotArray[i].dx_call + "<a/></td>";
				result += "<td>" + spotArray[i].country + "</td>";
				result += "<td>" + spotArray[i].mode + "</td>";
				result += "<td>" + spotArray[i].time; + "</td>";
				result += "<td>" + spotArray[i].info + "</td>";
				result += "</tr>";
			}
			else if (typeof workedEntities[spotArray[i].country + "_" + spotArray[i].band] == "undefined") {
				result += "<tr class='yellow'>";
				result += "<td>" + spotArray[i].de_call + "</td>";
				result += "<td>" + spotArray[i].frequency + "</td>";
				result += "<td>" + spotArray[i].band + "</td>";
				result += "<td><a href='https://www.qrz.com/db/" + spotArray[i].dx_call + "'>" + spotArray[i].dx_call + "<a/></td>";
				result += "<td>" + spotArray[i].country + "</td>";
				result += "<td>" + spotArray[i].mode + "</td>";
				result += "<td>" + spotArray[i].time; + "</td>";
				result += "<td>" + spotArray[i].info + "</td>";
				result += "</tr>";
			}
		}
	}
	result += "</table>";
	document.getElementById("divSpots").innerHTML = result;
}

function isComboInWorkedEntities(combo) {
	for (j = 0; j < workedEntities.length; j++) {
		if (workedEntities[j].id == id) {
			return true;
		}
	}
	return false;
}

function isIDinSpotArray(id) {
	for (j = 0; j < spotArray.length; j++) {
		if (spotArray[j].id == id) {
			return true;
		}
	}
	return false;
}

function sortByDateTime(a, b) {
	return b.datetime - a.datetime;
}

function getBandFromFreq(freq) {
	//console.log("Band Check: " + $freq);
	var re10m = new RegExp('^2[8-9]...[.].$');
	if (re10m.test(freq) == true) { return "10M"; }
	var re12m = new RegExp('^24[8-9]..[.].$');
	if (re12m.test(freq) == true) { return "12M"; }
	var re15m = new RegExp('^21[0-4]..[.].$');
	if (re15m.test(freq) == true) { return "15M"; }
	var re17m = new RegExp('^18[0-1]..[.].$');
	if (re17m.test(freq) == true) { return "17M"; }
	var re20m = new RegExp('^14[0-3]..[.].$');
	if (re20m.test(freq) == true) { return "20M"; }
	var re30m = new RegExp('^101[0-5].[.].$');
	if (re30m.test(freq) == true) { return "30M"; }
	var re40m = new RegExp('^7[0-3]..[.].$');
	if (re40m.test(freq) == true) { return "40M"; }
	var re80m = new RegExp('^3[5-9]..[.].$');
	if (re80m.test(freq) == true) { return "80M"; }
	var re160m = new RegExp('^1[8-9]..[.].$');
	if (re160m.test(freq) == true) { return "160M"; }
	return "OOB";
}

function getModeFromFreq(freq) {
	//console.log("Mode Check: " + freq);
	var re10m_1 = new RegExp('^280[0-6].[.].$');
	if (re10m_1.test(freq) == true) { return "CW"; }
	var re10m_2 = new RegExp('^280[7-9].[.].$');
	if (re10m_2.test(freq) == true) { return "DIGI"; }
	var re10m_3 = new RegExp('^282..[.].$');
	if (re10m_3.test(freq) == true) { return "DIGI"; }
	var re10m_4 = new RegExp('^28[3-9]..[.].$');
	if (re10m_4.test(freq) == true) { return "PHONE"; }
	var re10m_5 = new RegExp('^29...[.].$');
	if (re10m_5.test(freq) == true) { return "PHONE"; }
	var re12m_1 = new RegExp('^248..[.].$');
	if (re12m_1.test(freq) == true) { return "CW"; }
	var re12m_2 = new RegExp('^249[0-1].[.].$');
	if (re12m_2.test(freq) == true) { return "CW"; }
	var re12m_3 = new RegExp('^2492.[.].$');
	if (re12m_3.test(freq) == true) { return "DIGI"; }
	var re12m_4 = new RegExp('^249[3-8].[.].$');
	if (re12m_4.test(freq) == true) { return "PHONE"; }
	var re15m_1 = new RegExp('^210[0-6].[.].$');
	if (re15m_1.test(freq) == true) { return "CW"; }
	var re15m_2 = new RegExp('^210[7-9].[.].$');
	if (re15m_2.test(freq) == true) { return "DIGI"; }
	var re15m_3 = new RegExp('^21[2-4]..[.].$');
	if (re15m_3.test(freq) == true) { return "PHONE"; }
	var re17m_1 = new RegExp('^180..[.].$');
	if (re17m_1.test(freq) == true) { return "CW"; }
	var re17m_2 = new RegExp('^1810.[.].$');
	if (re17m_2.test(freq) == true) { return "DIGI"; }
	var re17m_3 = new RegExp('^181[1-6].[.].$');
	if (re17m_3.test(freq) == true) { return "PHONE"; }
	var re20m_1 = new RegExp('^140[0-6].[.].$');
	if (re20m_1.test(freq) == true) { return "CW"; }
	var re20m_2 = new RegExp('^140[7-9].[.].$');
	if (re20m_2.test(freq) == true) { return "DIGI"; }
	var re20m_3 = new RegExp('^141[0-4].[.].$');
	if (re20m_3.test(freq) == true) { return "DIGI"; }
	var re20m_4 = new RegExp('^141[5-9].[.].$');
	if (re20m_4.test(freq) == true) { return "PHONE"; }
	var re20m_5 = new RegExp('^14[2-3]..[.].$');
	if (re20m_5.test(freq) == true) { return "PHONE"; }
	var re30m_1 = new RegExp('^101[0-2].[.].$');
	if (re30m_1.test(freq) == true) { return "CW"; }
	var re30m_2 = new RegExp('^101[3-5].[.].$');
	if (re30m_2.test(freq) == true) { return "DIGI"; }
	var re40m_1 = new RegExp('^70[0-6].[.].$');
	if (re40m_1.test(freq) == true) { return "CW"; }
	var re40m_2 = new RegExp('^70[7-9].[.].$');
	if (re40m_2.test(freq) == true) { return "DIGI"; }
	var re40m_3 = new RegExp('^71[0-1].[.].$');
	if (re40m_3.test(freq) == true) { return "DIGI"; }
	var re40m_4 = new RegExp('^712[0-4][.].$');
	if (re40m_4.test(freq) == true) { return "DIGI"; }
	var re40m_5 = new RegExp('^712[5-9][.].$');
	if (re40m_5.test(freq) == true) { return "PHONE"; }
	var re40m_6 = new RegExp('^71[3-9].[.].$');
	if (re40m_6.test(freq) == true) { return "PHONE"; }
	var re40m_7 = new RegExp('^7[2-3]..[.].$');
	if (re40m_7.test(freq) == true) { return "PHONE"; }
	var re80m_1 = new RegExp('^35[0-6].[.].$');
	if (re80m_1.test(freq) == true) { return "CW"; }
	var re80m_2 = new RegExp('^357[0-5][.].$');
	if (re80m_2.test(freq) == true) { return "CW"; }
	var re80m_3 = new RegExp('^357[6-9][.].$');
	if (re80m_3.test(freq) == true) { return "DIGI"; }
	var re80m_4 = new RegExp('^35[8-9].[.].$');
	if (re80m_4.test(freq) == true) { return "DIGI"; }
	var re80m_5 = new RegExp('^3[6-9]..[.].$');
	if (re80m_5.test(freq) == true) { return "PHONE"; }
	return "N/A";
}

function toggleBand(cb) {
	updateTable();
}
