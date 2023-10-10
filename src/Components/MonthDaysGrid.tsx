import React from "react";

import styles from "./MonthDaysGrid.module.scss";

import {
  getFirstDayOfWeek,
  getEndOfWeek,
  getStartOfWeek,
  getWeekNumber,
  isSameDay,
  isAfterDate,
  isBeforeDate,
  numDaysInMonth,
} from "../Utils/Date";

import classNames from "../Utils/ClassNames";
import findClosestElementWithClass from "../Utils/Dom";

interface MonthDaysGridProps {
  hoverWeek: string | null;
  locale: string;
  max: Date | null;
  isPreview: boolean;
  min: Date | null;
  month: number;
  multi: boolean;
  onChange?: (number: number, start: Date | null, end: Date | null) => void;
  rangeEnd: Date | null;
  rangeStart: Date | null;
  setHoverWeek: (week: string | null) => void;
  setRange: (start: Date, end: Date) => void;
  setRangeEnd: (date: Date | null) => void;
  setRangeStart: (date: Date) => void;
  weeksSelector: boolean;
  year: number;
}

const MonthDaysGrid = ({
  hoverWeek = null,
  locale = "en-US",
  max,
  min,
  month = new Date().getMonth(),
  multi,
  onChange,
  rangeEnd,
  isPreview,
  rangeStart,
  setHoverWeek,
  setRange,
  setRangeEnd,
  setRangeStart,
  weeksSelector = false,
  year = new Date().getFullYear(),
}: MonthDaysGridProps) => {
  const rows = [];

  let columns = [];
  let dayNum = 0;

  const onClick = (
    event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => {
    const target = findClosestElementWithClass(
      event.target as HTMLElement,
      styles.Day
    );

    if (target.hasAttribute("data-day")) {
      const dayValue = parseInt(target.dataset.day ?? "0", 10);
      const monthValue = parseInt(target.dataset.month ?? "0", 10);
      const yearValue = parseInt(target.dataset.year ?? "0", 10);
      const date = new Date(yearValue, monthValue, dayValue);
      date.setHours(0, 0, 0, 0);

      const firstDayOfWeek = getFirstDayOfWeek(locale);
      const number = getWeekNumber(date, firstDayOfWeek);
      if (weeksSelector) {
        const startOfWeek = getStartOfWeek(date, firstDayOfWeek);
        const endOfWeek = getEndOfWeek(date, firstDayOfWeek);

        if (
          min &&
          isBeforeDate(
            min,
            startOfWeek.getDate(),
            startOfWeek.getMonth(),
            startOfWeek.getFullYear(),
            startOfWeek.getHours(),
            startOfWeek.getMinutes(),
            startOfWeek.getSeconds()
          )
        ) {
          return;
        }

        if (
          max &&
          isAfterDate(
            max,
            endOfWeek.getDate(),
            endOfWeek.getMonth(),
            endOfWeek.getFullYear(),
            endOfWeek.getHours(),
            endOfWeek.getMinutes(),
            endOfWeek.getSeconds()
          )
        ) {
          return;
        }

        setRange(startOfWeek, endOfWeek);
        onChange && onChange(number, startOfWeek, endOfWeek);
      } else {
        if (min && isBeforeDate(min, dayValue, monthValue, yearValue)) {
          return;
        }
        if (max && isAfterDate(max, dayValue, monthValue, yearValue)) {
          return;
        }

        if (rangeStart && rangeEnd) {
          setRangeStart(date);
          setRangeEnd(null);
        } else if (
          !rangeStart ||
          isBeforeDate(rangeStart, dayValue, monthValue, yearValue)
        ) {
          setRangeStart(date);
        } else if (!rangeEnd) {
          date.setHours(23, 59, 59, 999);
          setRangeEnd(date);
        }

        // if only the start date is specified, or the start date is equal to the end date -
        // a single value is returned, otherwise the start and end values of the time interval.
        if (
          !rangeEnd ||
          isSameDay(
            rangeStart,
            rangeEnd.getDate(),
            rangeEnd.getMonth(),
            rangeEnd.getFullYear()
          )
        ) {
          onChange && onChange(number, rangeStart, null);
        } else {
          onChange && onChange(number, rangeStart, rangeEnd);
        }
      }
    }
  };

  const renderDay = (
    dayValue: number,
    monthValue: number,
    yearValue: number,
    rangeStartValue: Date | null,
    rangeEndValue: Date | null,
    today: Date,
    currentMonth?: boolean
  ) => {
    const isRangeStart = () =>
      rangeStartValue &&
      isSameDay(rangeStartValue, dayValue, monthValue, yearValue);

    const isRangeEnd = () =>
      (rangeStartValue &&
        rangeEndValue &&
        isSameDay(rangeEndValue, dayValue, monthValue, yearValue)) ||
      (!rangeEndValue && isRangeStart());

    return (
      <div
        className={classNames(
          styles.Day,
          !currentMonth && styles[multi ? "NoShowMonth" : "OtherMonth"],
          (max && isAfterDate(max, dayValue, monthValue, yearValue)) ||
            (min &&
              isBeforeDate(min, dayValue, monthValue, yearValue) &&
              styles.Disabled),
          isSameDay(today, dayValue, monthValue, yearValue) &&
            !isRangeEnd() &&
            !isRangeStart() &&
            styles.Today,
          rangeStartValue &&
            rangeEndValue &&
            isAfterDate(rangeStartValue, dayValue, monthValue, yearValue) &&
            isBeforeDate(rangeEndValue, dayValue, monthValue, yearValue) &&
            (isPreview ? styles.RangePreview : styles.Range),
          isRangeEnd() &&
            (isPreview ? styles.RangeEndPreview : styles.RangeEnd),
          isRangeStart() &&
            (isPreview ? styles.RangeStartPreview : styles.RangeStart)
        )}
        data-month={monthValue}
        data-day={dayValue}
        data-year={yearValue}
        data-testid={
          isSameDay(today, dayValue, monthValue, yearValue) ? "today" : ""
        }
        key={`${dayValue}-${monthValue}`}
      >
        {dayValue}
      </div>
    );
  };

  const today = new Date();

  const firstDate = new Date(year, month, 1).getDay();

  const firstOfMonth =
    ((firstDate < getFirstDayOfWeek(locale) ? 7 : 0) +
      firstDate -
      getFirstDayOfWeek(locale)) %
    7;

  const prevMonth = new Date(year, month, 1);
  prevMonth.setMonth(prevMonth.getMonth() - 1);

  for (
    let numDays = numDaysInMonth(prevMonth), i = numDays - firstOfMonth;
    i < numDays;
    i += 1
  ) {
    columns.push(
      renderDay(
        i + 1,
        prevMonth.getMonth(),
        prevMonth.getFullYear(),
        rangeStart,
        rangeEnd,
        today
      )
    );
    dayNum += 1;
  }

  for (
    let i = 0, numDays = numDaysInMonth(new Date(year, month, 1));
    i < numDays;
    i += 1
  ) {
    // if we have reached the end of a week, wrap to the next row
    const index = rows.length;

    if (dayNum === 7) {
      rows.push(
        <div
          className={classNames(
            styles.WeekRow,
            hoverWeek === `${month}_${rows.length}` && styles.Hover
          )}
          key={rows.length}
          onFocus={() => weeksSelector && setHoverWeek(`${month}_${index}`)}
          onMouseOver={() => weeksSelector && setHoverWeek(`${month}_${index}`)}
          onMouseLeave={() => setHoverWeek(null)}
        >
          {columns}
        </div>
      );
      columns = [];
      dayNum = 0;
    }

    columns.push(
      renderDay(i + 1, month, year, rangeStart, rangeEnd, today, true)
    );

    dayNum += 1;
  }

  // insert padding past the end of the month
  const nextMonth = new Date(year, month, 1);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  for (let i = 0; i < 7 - dayNum; i += 1) {
    columns.push(
      renderDay(
        i + 1,
        nextMonth.getMonth(),
        nextMonth.getFullYear(),
        rangeStart,
        rangeEnd,
        today
      )
    );
  }

  rows.push(
    <div
      className={classNames(
        styles.WeekRow,
        hoverWeek === `${month}_${rows.length}` && styles.Hover
      )}
      key={rows.length}
      onFocus={() =>
        weeksSelector && setHoverWeek(`${month}_${rows.length - 1}`)
      }
      onMouseOver={() =>
        weeksSelector && setHoverWeek(`${month}_${rows.length - 1}`)
      }
      onMouseLeave={() => setHoverWeek(null)}
    >
      {columns}
    </div>
  );

  return (
    <div
      className={classNames(weeksSelector && styles.WeekRowHover)}
      data-testid="month-days"
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
    >
      {rows}
    </div>
  );
};

export default MonthDaysGrid;
