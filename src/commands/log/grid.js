const moment = require('moment');
const load = require('./load');

function sumValue(arr) {
  return arr.reduce((acc, entry) => acc + entry.value, 0);
}

module.exports = function grid(projectDir, center = moment(), width = 52) {
  const log = load(projectDir);
  const arr = [];
  for (let i = 0; i < 7; i += 1) {
    arr[i] = new Array(width);
  }

  const centerTimestamp = center.startOf('day').unix();
  const dayOfWeek = center.day();
  const beforeDays = Math.floor(width / 2) * 7 + (dayOfWeek);
  const minimumDay = centerTimestamp - (86400 * beforeDays);
  const maximumDay = centerTimestamp + (86400 * (width * 7 - beforeDays));

  Object.keys(log).forEach((key) => {
    if (key > minimumDay && key < maximumDay) {
      const daysSinceMinimum = Math.floor((key - minimumDay) / 86400);
      arr[daysSinceMinimum % 7][Math.floor(daysSinceMinimum / 7)] = sumValue(log[key]);
    }
  });

  return arr;
};
