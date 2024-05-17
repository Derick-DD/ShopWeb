export function convertTime(utcTime) {
  const date = new Date(utcTime);
  const options = {
    timeZone: 'Asia/Hong_Kong',
    hour12: false,
  };
  return date.toLocaleString('en-US', options);
}
