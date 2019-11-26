import React, { useState } from "react";
import PropTypes from "prop-types";

import DateNavigation from "./DateNavigation";
import MonthDaysGrid from "./MonthDaysGrid";
import WeekNumbersGrid from "./WeekNumbersGrid";

import classNames from "../Utils/ClassNames";

import {
  getWeekDays,
  isAfterDate,
  isBeforeDate,
  getMonthName
} from "../Utils/Date";

import styles from "./Calendar.module.scss";

const Calendar = ({
  className,
  locale,
  max,
  min,
  month: monthParam,
  multi,
  onChange,
  showWeekNumbers,
  value,
  weeksSelector,
  year: yearParam
}) => {
  const [_rangeStart, _rangeEnd] = Array.isArray(value) ? value : [value, null];

  if (
    _rangeEnd &&
    !isAfterDate(
      _rangeStart,
      _rangeEnd.getDate(),
      _rangeEnd.getMonth(),
      _rangeEnd.getFullYear()
    )
  ) {
    throw new Error(
      "Invalid dates range. End date must be later than the start date."
    );
  }

  const [rangeStart, setRangeStart] = useState(_rangeStart);
  const [rangeEnd, setRangeEnd] = useState(_rangeEnd);
  const [month, setMonth] = useState(monthParam);
  const [year, setYear] = useState(yearParam);
  const [hoverWeek, setHoverWeek] = useState();

  const setRange = (start, end) => {
    if (!weeksSelector) {
      return;
    }

    if (
      (max &&
        isAfterDate(max, end.getDate(), end.getMonth(), end.getFullYear())) ||
      (min &&
        isBeforeDate(
          min,
          start.getDate(),
          start.getMonth(),
          start.getFullYear()
        ))
    ) {
      return;
    }

    setRangeStart(start);
    setRangeEnd(end);
  };

  const addMonth = () => {
    const date = new Date(year, month, 1);
    setHoverWeek(null);
    date.setMonth(date.getMonth() + 1);
    setMonth(date.getMonth());
    setYear(date.getFullYear());
  };

  const subMonth = () => {
    const date = new Date(year, month, 1);
    setHoverWeek(null);
    date.setMonth(date.getMonth() - 1);
    setMonth(date.getMonth());
    setYear(date.getFullYear());
  };

  const monthYearPairs = multi
    ? [
        { month, year },
        {
          month: month + 1 === 12 ? 0 : month + 1,
          year: month + 1 === 12 ? year + 1 : year
        }
      ]
    : [{ month, year }];

  return (
    <div className={classNames(styles.Calendar, className)}>
      <DateNavigation
        className={styles.CalendarHeader}
        nextDate={addMonth}
        prevDate={subMonth}
      >
        {monthYearPairs.map(({ month: m, year: y }) => (
          <div style={{ flex: 1 }} key={m} data-testid="month-name">
            {getMonthName(m, locale)} {y}
          </div>
        ))}
      </DateNavigation>

      <div className={styles.Flex}>
        {monthYearPairs.map(({ month: m, year: y }) => (
          <div className={styles.Flex} key={m}>
            <div className={styles.FlexDays}>
              <div className={styles.GridHeader} data-testid="week-days">
                {getWeekDays(locale).map(day => (
                  <div className={styles.HeaderItem} key={day}>
                    {day}
                  </div>
                ))}
              </div>

              <MonthDaysGrid
                hoverWeek={hoverWeek}
                locale={locale}
                max={max}
                min={min}
                month={m}
                multi={multi}
                onChange={onChange}
                rangeEnd={rangeEnd}
                rangeStart={rangeStart}
                setHoverWeek={setHoverWeek}
                setRange={setRange}
                setRangeEnd={setRangeEnd}
                setRangeStart={setRangeStart}
                weeksSelector={weeksSelector}
                year={y}
              />
            </div>

            {showWeekNumbers && (
              <div className={styles.FlexWeeks}>
                <div className={styles.GridHeader}>&nbsp;</div>
                <div
                  className={styles.WeekNumbersWrapper}
                  data-testid="week-numbers"
                >
                  <WeekNumbersGrid
                    hoverWeek={hoverWeek}
                    locale={locale}
                    max={max}
                    min={min}
                    month={m}
                    onChange={onChange}
                    rangeEnd={rangeEnd}
                    rangeStart={rangeStart}
                    setHoverWeek={setHoverWeek}
                    setRange={setRange}
                    weeksSelector={weeksSelector}
                    year={y}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

Calendar.defaultProps = {
  className: "",
  locale: "en-US",
  max: null,
  min: null,
  month: new Date().getMonth(),
  multi: false,
  showWeekNumbers: false,
  weeksSelector: false,
  value: [],
  year: new Date().getFullYear()
};

Calendar.propTypes = {
  className: PropTypes.string,
  locale: PropTypes.string,
  max: PropTypes.instanceOf(Date),
  min: PropTypes.instanceOf(Date),
  month: PropTypes.number,
  multi: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  showWeekNumbers: PropTypes.bool,
  weeksSelector: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.instanceOf(Date))
  ]),
  year: PropTypes.number
};

export default Calendar;
