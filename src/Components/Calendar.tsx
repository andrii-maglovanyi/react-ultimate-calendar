import React, { useState } from "react";

import DateNavigation from "./DateNavigation";
import MonthDaysGrid from "./MonthDaysGrid";
import WeekNumbersGrid from "./WeekNumbersGrid";

import classNames from "../Utils/ClassNames";

import {
  getWeekDays,
  isAfterDate,
  isBeforeDate,
  getMonthName,
} from "../Utils/Date";

import styles from "./Calendar.module.scss";
import { TimeSelector } from "./TimeSelector";
import { RangePresets } from "./RangePresets";

interface CalendarProps {
  className?: string;
  locale?: string;
  max?: Date | null;
  min?: Date | null;
  month?: number;
  float?: boolean;
  rangePresets?: Record<string, [Date, Date]>;
  multi?: boolean;
  onChange?: (number: number, start: Date | null, end: Date | null) => void;
  showWeekNumbers?: boolean;
  value?: Date | [Date, Date];
  weeksSelector?: boolean;
  year?: number;
  timeSelector?: boolean;
}

const Calendar = ({
  className,
  locale = "en-US",
  max = null,
  min = null,
  month: monthParam = new Date().getMonth(),
  multi = false,
  float = false,
  onChange,
  showWeekNumbers,
  rangePresets,
  value,
  weeksSelector,
  year: yearParam = new Date().getFullYear(),
  timeSelector = false,
}: CalendarProps) => {
  const [_rangeStart, _rangeEnd] = Array.isArray(value)
    ? value ?? null
    : [value ?? null, null];

  if (
    _rangeEnd &&
    !isAfterDate(
      _rangeStart,
      _rangeEnd.getDate(),
      _rangeEnd.getMonth(),
      _rangeEnd.getFullYear(),
      _rangeEnd.getHours(),
      _rangeEnd.getMinutes(),
      _rangeEnd.getSeconds()
    )
  ) {
    throw new Error(
      "Invalid dates range. End date must be later than the start date."
    );
  }

  const [rangeStart, setRangeStart] = useState<Date | null>(_rangeStart);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(_rangeEnd);
  const [month, setMonth] = useState(monthParam);
  const [year, setYear] = useState(yearParam);
  const [hoverWeek, setHoverWeek] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [selectTime, setSelectTime] = useState<boolean>(false);

  const handleDateChange = (
    number: number,
    start: Date | null,
    end: Date | null
  ) => {
    if (timeSelector) {
      setSelectTime(true);
    } else {
      onChange?.(number, start, end);
    }
  };

  const handleTimeChange = (start: Date, end: Date | null) => {
    setSelectTime(false);
    onChange?.(0, start, end);
  };

  const setRange = (start: Date, end: Date) => {
    if (!weeksSelector) {
      return;
    }

    if (
      (max &&
        isAfterDate(
          max,
          end.getDate(),
          end.getMonth(),
          end.getFullYear(),
          end.getHours(),
          end.getMinutes(),
          end.getSeconds()
        )) ||
      (min &&
        isBeforeDate(
          min,
          start.getDate(),
          start.getMonth(),
          start.getFullYear(),
          start.getHours(),
          start.getMinutes(),
          start.getSeconds()
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

  const addYear = () => {
    const date = new Date(year, month, 1);
    setHoverWeek(null);
    date.setFullYear(date.getFullYear() + 1);
    setMonth(date.getMonth());
    setYear(date.getFullYear());
  };

  const subYear = () => {
    const date = new Date(year, month, 1);
    setHoverWeek(null);
    date.setFullYear(date.getFullYear() - 1);
    setMonth(date.getMonth());
    setYear(date.getFullYear());
  };

  const monthYearPairs = multi
    ? [
        { month, year },
        {
          month: month + 1 === 12 ? 0 : month + 1,
          year: month + 1 === 12 ? year + 1 : year,
        },
      ]
    : [{ month, year }];

  return (
    <div
      className={classNames(styles.Calendar, float && styles.Float, className)}
    >
      <div className={styles.Row}>
        <div className={styles.Column}>
          <DateNavigation
            className={styles.CalendarHeader}
            nextMonth={addMonth}
            nextYear={addYear}
            prevMonth={subMonth}
            prevYear={subYear}
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
                    {getWeekDays(locale).map((day) => (
                      <div className={styles.HeaderItem} key={day}>
                        {day}
                      </div>
                    ))}
                  </div>

                  <MonthDaysGrid
                    hoverWeek={hoverWeek}
                    isPreview={isPreview}
                    locale={locale}
                    max={max}
                    min={min}
                    month={m}
                    multi={multi}
                    onChange={handleDateChange}
                    rangeEnd={rangeEnd}
                    rangeStart={rangeStart}
                    setHoverWeek={setHoverWeek}
                    setRange={setRange}
                    setRangeEnd={setRangeEnd}
                    setRangeStart={setRangeStart}
                    weeksSelector={Boolean(weeksSelector)}
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
                        weeksSelector={Boolean(weeksSelector)}
                        year={y}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {timeSelector ? (
            <TimeSelector
              active={selectTime}
              onChange={handleTimeChange}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
            />
          ) : null}
        </div>
        {rangePresets ? (
          <RangePresets
            isPreview={isPreview}
            previewRange={(start: Date | null, end: Date | null) => {
              setIsPreview(Boolean(start) && Boolean(end));
              setRangeStart(start);
              setRangeEnd(end);
            }}
            selectRange={(start, end) => {
              setRangeStart(start);
              setRangeEnd(end);
              onChange?.(0, start, end);
            }}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            ranges={rangePresets}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Calendar;
