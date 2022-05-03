
// SIGNL4 holiday importer.
// This sample is provided as is with no guarantees, please use with care. 

const axios = require('axios');

const ical = require('node-ical');
const { exit } = require('process');

const strAPIKey = 'Your-SIGNL4-API-Key';
const strTeamName = 'Super SIGNL4';

// Command line arguments
const args = process.argv;

// Check for the .csv path argument 
if (args.length < 3) {
  console.log('Please specify a .ics file as argument. Alternatively you can use the \"CLEAR\" argument to clear all holidays of the current and the following year.');

  exit();
}

const striCalPath = args[2];

// Run
importHolidays();

var strTeamId =  getTeamId(strTeamName);
console.log("Team ID: " + strTeamId);

// Main function
async function importHolidays() {

  // Get the team ID from the team name
  var strTeamId = await getTeamId(strTeamName);
  console.log("Team ID: " + strTeamId);

  if (striCalPath != "CLEAR") {
    // schedules
    readHolidays(strTeamId);
  } else {
    // clear all
    clearHolidays(strTeamId);
  }
}

// Read the duty schedules from the .csv file and import (or delete) them
async function readHolidays(strTeamId) {
  // Read iCal file
  var holidayData = [];
  var nCurrentYear = -1;
  
  console.log('Reading iCal file: ' + striCalPath);

  const events = ical.sync.parseFile(striCalPath);
  // Loop through events and log them
  for (const event of Object.values(events)) {

    var holiday = new Date(event.start);

    // Check for valid date
    if (holiday instanceof Date && !isNaN(holiday)) {

      //console.log('Summary: ' + event.summary + '\nDescription: ' + event.description + '\nDate: ' + holiday + '\nYear: ' + holiday.getFullYear() + '\nMonth: ' + (holiday.getMonth() + 1) + '\nDay: ' + holiday.getDate() + '\n');

      // Get first year from iCal file
      if (nCurrentYear == -1) {
        nCurrentYear = holiday.getFullYear();

        console.log("First year: " + nCurrentYear);
      }

      if (nCurrentYear != holiday.getFullYear()) {
        // Next year found

        // Add holidays for the previous year
        console.log(holidayData);
        await addHolidays(strTeamId, holidayData, nCurrentYear);

        nCurrentYear = holiday.getFullYear();

        console.log("Next year: " + nCurrentYear);

        // Reset
        holidayData = [];
      }

      // Add holiday
      var day = {
        "month": holiday.getMonth() + 1,
        "day": holiday.getDate()
      }
      holidayData.push(day);

    }
  };

  // Add holidays
  console.log(holidayData);
  await addHolidays(strTeamId, holidayData, nCurrentYear);

  // Delete holidays
  //addHolidays(strTeamId, [], 2022);

}

// Clear all holidays of the current and the following year
async function clearHolidays(strTeamId) {

  console.log('Clear all holidays of the current and the following year.');

  // Get current year
  var nCurrentYear = new Date().getFullYear();
  
  await addHolidays(strTeamId, [], nCurrentYear);
  await addHolidays(strTeamId, [], nCurrentYear + 1);
}

// Get the team ID from the team name
async function getTeamId(strTeamName) {
  var teamId = "";
  const res = await axios.get('https://connect.signl4.com/api/v2/teams',
          {headers: { 'X-S4-Api-Key': strAPIKey }
      });

      const json = res.data;
      
      //console.log(json);

      // Get team id from team name
      json.forEach(function (item) {
        if (strTeamName == item.name) {
          console.log(item.name + ': ' + item.id);
          teamId = item.id;
        }
      });

    return teamId;
  }

// Add holidays
async function addHolidays(teamId, holidays, year) {

  const res = await axios.put('https://connect.signl4.com/api/v2/teams/' + teamId + '/holidays/years/' + year,
          holidays,
          {
            headers: {
            'X-S4-Api-Key': strAPIKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json' }
          });

      const json = res.data;

      console.log(JSON.stringify(json));
  }

