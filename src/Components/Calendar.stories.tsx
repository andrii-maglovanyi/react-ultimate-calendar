import Component from "./Calendar";

type RangesType = Record<string, [Date, Date]>;

const HOUR = 60; // 60 minutes
const DAY = HOUR * 24;
const RANGES = [5, 30, 2 * HOUR, 12 * HOUR, DAY, 2 * DAY, 7 * DAY];

const getMinutesRange =
  (date: Date) =>
  (config: RangesType, minutes: number): RangesType => {
    const _date = new Date(date);
    _date.setMinutes(date.getMinutes() - minutes);

    return { ...config, [`Last ${minutes} minutes`]: [_date, date] };
  };

const getRanges = () => RANGES.reduce(getMinutesRange(new Date()), {});

export default {
  component: Component,
  title: "Calendar",
};

/**
 * Default calendar
 */
export const Calendar = {
  args: {},
};

/**
 * Calendar with GB locale
 */
export const CalendarWithGBLocale = {
  args: {
    locale: "en-GB",
  },
};

/**
 * Calendar with weeks selector
 */
export const CalendarWithWeekSelector = {
  args: {
    weeksSelector: true,
  },
};

/**
 * Calendar with time selector
 */
export const CalendarWithTimeSelector = {
  args: {
    timeSelector: true,
  },
};

/**
 * Calendar with range presets
 */
export const CalendarWithRangePresets = {
  args: {
    rangePresets: getRanges(),
  },
};

/**
 * Calendar with week selector and week numbers
 */
export const CalendarWithWeekSelectorAndWeekNumbers = {
  args: {
    showWeekNumbers: true,
    weeksSelector: true,
  },
};

/**
 * Calendar with two months view
 */
export const CalendarWithTwoMonthsView = {
  args: {
    multi: true,
  },
};

/**
 * Calendar with two months view and weeks numbers
 */

export const CalendarWithTwoMonthsViewAndWeekSelector = {
  args: {
    multi: true,
    weeksSelector: true,
    showWeekNumbers: true,
  },
};

/**
 * Calendar with two months view and time selector
 */
export const CalendarWithTwoMonthsViewAndTimeSelector = {
  args: {
    multi: true,
    timeSelector: true,
  },
};

/**
 * Calendar with two months view and range presets
 */
export const CalendarWithTwoMonthsViewAndRangePresets = {
  args: {
    multi: true,
    rangePresets: getRanges(),
  },
};

const now = new Date();
const minusOneHour = new Date(now);
minusOneHour.setHours(now.getHours() - 1);

/**
 * Calendar with two months view,time selector and range presets
 */
export const CalendarWithTwoMonthsViewTimeSelectorAndRangePresets = {
  args: {
    multi: true,
    timeSelector: true,
    rangePresets: getRanges(),
    value: [now, minusOneHour],
  },
};
