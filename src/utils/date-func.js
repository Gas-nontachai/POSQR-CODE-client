import moment from 'moment';

const padZero = (value) => value.toString().padStart(2, '0');

export const formatDate = (value, format = 'dd/MM/yyyy') => {
  if (value === null || value === undefined) return '';

  const date = typeof value === 'string' ? new Date(value) : value;

  if (date.toString() === 'Invalid Date') return '';

  const formatTokens = {
    'yyyy': () => date.getFullYear().toString(),
    'MM': () => padZero(date.getMonth() + 1),
    'dd': () => padZero(date.getDate()),
    'HH': () => padZero(date.getHours()),
    'mm': () => padZero(date.getMinutes()),
    'ss': () => padZero(date.getSeconds()),
  };

  let formattedDate = format;

  for (const key in formatTokens) {
    if (format.includes(key)) {
      formattedDate = formattedDate.replace(key, formatTokens[key]());
    }
  }

  return formattedDate;
};

export const diffDate = (start, end) => moment.duration(moment(end).diff(moment(start))).asDays();

export const diffMinute = (start, end) => moment.duration(moment(end).diff(moment(start))).asMinutes();

export const addDays = (value, day) => {
  const date = new Date(value);
  date.setDate(date.getDate() + day);
  return date;
};

export const genTimeAgo = (date) => {
  if (!date) return '-';
  if (typeof date === 'string') date = new Date(date);
  return getTimeAgo(date.getTime());
};

export const getTimeAgo = (timestamp) => {
  const currentTime = Date.now();
  const timeDifference = currentTime - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  const elapsedYears = Math.floor(timeDifference / year);
  const elapsedMonths = Math.floor(timeDifference / month);
  const elapsedDays = Math.floor(timeDifference / day);
  const elapsedHours = Math.floor(timeDifference / hour);
  const elapsedMinutes = Math.floor(timeDifference / minute);

  if (elapsedYears > 0) return `${elapsedYears} year${elapsedYears > 1 ? 's' : ''} ago`;
  if (elapsedMonths > 0) return `${elapsedMonths} month${elapsedMonths > 1 ? 's' : ''} ago`;
  if (elapsedDays > 0) return `${elapsedDays} day${elapsedDays > 1 ? 's' : ''} ago`;
  if (elapsedHours > 0) return `${elapsedHours} hour${elapsedHours > 1 ? 's' : ''} ago`;
  if (elapsedMinutes > 0) return `${elapsedMinutes} minute${elapsedMinutes > 1 ? 's' : ''} ago`;

  return 'Just now';
};

export const sumPeriodTime = (start, end) => {
  if (!start || !end) return '';

  const [hours1, minutes1] = end.split(':').map(Number);
  const [hours2, minutes2] = start.split(':').map(Number);

  let totalMinutes = minutes1 - minutes2;
  let totalHours = hours1 - hours2;

  if (totalMinutes < 0) {
    totalMinutes += 60;
    totalHours--;
  }

  return `${totalHours.toString()}.${totalMinutes.toString().padStart(2, '0')}`;
};

export const countYear = (date) => {
  const currentDate = new Date();
  const targetDate = new Date(date);

  const diffInMilliseconds = currentDate.getTime() - targetDate.getTime();
  const diffInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

  return Math.floor(diffInYears);
};

export const getFirstDateOfWeek = (weekNumber, year) => {
  const firstDate = addDays(new Date(year, 0, 1), (weekNumber - 1) * 7);

  const firstDayOfWeek = firstDate.getDay();

  if (firstDayOfWeek) firstDate.setDate(firstDate.getDate() - firstDayOfWeek);

  return firstDate;
};
