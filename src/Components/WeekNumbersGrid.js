import React from "react";

import classNames from "../Utils/ClassNames";

import styles from "./WeekNumbersGrid.module.scss";

import {
  getFirstDayOfWeek,
  getEndOfWeek,
  getStartOfWeek,
  getWeekNumber,
  isAfterDate,
  isBeforeDate
} from "../Utils/Date";

const WeekNumbersGrid = ({
  hoverWeek,
  locale,
  max,
  min,
  month,
  onChange,
  rangeEnd,
  rangeStart,
  setHoverWeek,
  setRange,
  weeksSelector,
  year
}) => {
  const weekNumbersRangeInMonth = (
    monthValue,
    yearValue = new Date().getFullYear()
  ) => {
    const weeks = [];
    const date = new Date(yearValue, monthValue, 1, 0, 0, 0, 0);

    do {
      weeks.push({
        number: getWeekNumber(date, getFirstDayOfWeek(locale)),
        start: getStartOfWeek(date, getFirstDayOfWeek(locale)),
        end: getEndOfWeek(date, getFirstDayOfWeek(locale))
      });

      date.setDate(date.getDate() + 7);
    } while (
      getStartOfWeek(date, getFirstDayOfWeek(locale)).getMonth() === monthValue
    );

    return weeks;
  };

  const isSelected = (start, end) => {
    return (
      rangeStart &&
      rangeEnd &&
      start.getTime() === rangeStart.getTime() &&
      end.getTime() === rangeEnd.getTime()
    );
  };

  const onClick = (number, start, end) => {
    setRange(start, end);
    onChange(number, start, end);
  };

  // TODO: review role, tabIndex
  return weekNumbersRangeInMonth(month, year).map(
    ({ start, end, number }, index) => (
      <div
        className={classNames(
          styles.Number,
          weeksSelector && styles.ActiveNumber,
          ((max &&
            isAfterDate(
              max,
              end.getDate(),
              end.getMonth(),
              end.getFullYear()
            )) ||
            (min &&
              isBeforeDate(
                min,
                start.getDate(),
                start.getMonth(),
                start.getFullYear()
              ))) &&
            styles.Disabled,
          hoverWeek === `${month}_${index}` && styles.Hover,
          isSelected(start, end) && styles.Selected
        )}
        key={number}
        onFocus={() => setHoverWeek(`${month}_${index}`)}
        onMouseOver={() => setHoverWeek(`${month}_${index}`)}
        onMouseLeave={() => setHoverWeek(null)}
        onClick={() => onClick(number, start, end)}
        onKeyPress={() => onClick(number, start, end)}
        role="button"
        tabIndex="0"
      >
        {number}
      </div>
    )
  );
};

export default WeekNumbersGrid;
