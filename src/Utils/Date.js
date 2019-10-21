import {
  DAYS_PER_MONTH,
  FIRST_DAY_OF_YEAR,
  MILLISECONDS_IN_WEEK,
  STARTS_OF_WEEK,
  WEEK_STARTS_ON
} from "../Constants";

const getDate = date => {
  return new Date(date.getTime());
};

export const getEndOfWeek = (_date, weekStartsOn = WEEK_STARTS_ON) => {
  const date = getDate(_date);
  const day = date.getDay();
  const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);

  date.setDate(date.getDate() + diff);
  date.setHours(23, 59, 59, 999);
  return date;
};

export const getStartOfWeek = (_date, weekStartsOn = WEEK_STARTS_ON) => {
  const date = getDate(_date);
  const day = date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;

  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);

  return date;
};

export const getStartOfFirstWeekOfTheYear = (
  _date,
  weekStartsOn = WEEK_STARTS_ON
) => {
  const date = getDate(_date);
  date.setMonth(0, FIRST_DAY_OF_YEAR[weekStartsOn]);

  return getStartOfWeek(date, weekStartsOn);
};

/**
 * Locale determines the first day of week (0 - Sunday, 1 - Monday, ..., 6 - Saturday).
 * Three settings for the first day of week are most used around the world:
 * - ISO-8601: Europe uses Monday (1)
 * - US, Canada uses Sunday (0)
 * - Most of Arab countries use Saturday (6)
 *
 * @param {String} locale The currently active locale.
 * @returns {Number}      The week day number
 */
export const getFirstDayOfWeek = locale => {
  const [, country] = locale.split("-");

  return STARTS_OF_WEEK[country] || WEEK_STARTS_ON;
};

/**
 * Returns the beginning and end date of the given week number.
 *
 * @param {Number} weekNumber     The week number of a year (0 - 53)
 * @param {Number} year           Full year in which the week occurs.
 * @param {Number} weekStartsOn   Weeks starting on (1) Monday - ISO-8601, (0) Sunday - US, Canada
 *                                or (6) Saturday - Islamic countries
 * @returns {Date[]}              The beginning and the end of given week.
 */
export const getDateRangeOfWeek = (
  weekNumber,
  year,
  weekStartsOn = WEEK_STARTS_ON
) => {
  const date = new Date();
  date.setFullYear(year);

  const startDate = getStartOfFirstWeekOfTheYear(date, weekStartsOn);
  startDate.setDate(startDate.getDate() + 7 * (weekNumber - 1));

  const endDate = new Date(startDate.getTime());
  endDate.setDate(endDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return [startDate, endDate];
};

export const getWeekNumber = (_date, weekStartsOn = WEEK_STARTS_ON) => {
  const date = getDate(_date);

  const startOfWeek = getStartOfWeek(date, weekStartsOn);
  let startOfFirstWeekOfTheYear = getStartOfFirstWeekOfTheYear(
    date,
    weekStartsOn
  );

  if (startOfWeek.getTime() < startOfFirstWeekOfTheYear.getTime()) {
    date.setDate(date.getDate() - 7);
    startOfFirstWeekOfTheYear = getStartOfFirstWeekOfTheYear(
      date,
      weekStartsOn
    );
  }

  const diff = startOfWeek.getTime() - startOfFirstWeekOfTheYear.getTime();

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
};

export const getWeekDays = locale => {
  const now = new Date();
  const SHORT_DAYS = [];
  const date = getStartOfWeek(now, getFirstDayOfWeek(locale));
  const endOfWeek = getEndOfWeek(now, getFirstDayOfWeek(locale));
  while (date.getTime() < endOfWeek) {
    SHORT_DAYS.push(date.toLocaleString(locale, { weekday: "short" }));
    date.setDate(date.getDate() + 1);
  }

  return SHORT_DAYS;
};

export const getMonthName = (month, locale) => {
  const date = new Date();
  date.setMonth(month);

  return date.toLocaleString(locale, { month: "long" });
};

/**
 * Returns the number of days in a given month.
 */
export const numDaysInMonth = _date => {
  const date = getDate(_date);

  if (
    date.getMonth() === 1 &&
    date.getFullYear() % 4 === 0 &&
    (date.getFullYear() % 100 || date.getFullYear() % 400 === 0)
  ) {
    return 29;
  }
  return DAYS_PER_MONTH[date.getMonth()];
};

export const isAfterDate = (date, day, month, year) => {
  if (!date) return false;
  return (
    year > date.getFullYear() ||
    (year === date.getFullYear() &&
      (month > date.getMonth() ||
        (month === date.getMonth() && day > date.getDate())))
  );
};

export const isBeforeDate = (date, day, month, year) => {
  if (!date) return false;
  return (
    year < date.getFullYear() ||
    (year === date.getFullYear() &&
      (month < date.getMonth() ||
        (month === date.getMonth() && day < date.getDate())))
  );
};

export const isSameDay = (date, day, month, year) => {
  if (!date) return false;
  return (
    day === date.getDate() &&
    month === date.getMonth() &&
    year === date.getFullYear()
  );
};
