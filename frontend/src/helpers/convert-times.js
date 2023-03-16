import moment from "moment";

export function convertTo12HourTime(timeStr) {
  const time = moment(timeStr, "HH:mm:ss");
  return time.format("h:mm A");
}

export function convertTime(timeStr) {
  // Split the string into hours, minutes, and seconds
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);

  // Calculate the total number of minutes
  const totalMinutes = hours * 60 + minutes;

  // If the total number of minutes is 0, just return "0 minutes"
  if (totalMinutes === 0) {
    return "0 minutes";
  }

  // Determine the hour and minute strings to return
  const hourStr = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""} and ` : "";
  const minuteStr =
    minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : "";

  // Combine the hour and minute strings into the final output
  return hourStr + minuteStr;
}
