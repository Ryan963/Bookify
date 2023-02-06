/**
 * function will convert the time from local format to 24 hour format
 * @param {string} time
 * @returns time in format '24:00:00'
 */
function convertTo24Hour(time) {
  // check if time is am or pm
  if (time[time.length - 2] === "a") {
    // get the hours
    let hours = time.substring(0, time.indexOf("a"));
    let minutes = "00";
    if (hours.indexOf(":") !== -1) {
      minutes = hours.substring(hours.indexOf(":") + 1);
      hours = hours.substring(0, hours.indexOf(":"));
    }
    hours = parseInt(hours);
    if (hours === 12) {
      hours = "00";
    }
    return `${hours}:${minutes}:00`;
  } else {
    let hours = time.substring(0, time.indexOf("p"));
    // add 12 hours to account for PM
    let minutes = "00";
    if (hours.indexOf(":") !== -1) {
      minutes = hours.substring(hours.indexOf(":") + 1);
      hours = hours.substring(0, hours.indexOf(":"));
    }
    hours = parseInt(hours);
    hours += 12;
    return `${hours}:${minutes}:00`;
  }
}

module.exports = { convertTo24Hour };
