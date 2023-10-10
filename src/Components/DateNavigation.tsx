import React from "react";

import classNames from "../Utils/ClassNames";
import styles from "./DateNavigation.module.scss";

interface DateNavigationProps {
  children?: React.ReactNode;
  className?: string;
  nextMonth: () => void;
  prevMonth: () => void;
  nextYear: () => void;
  prevYear: () => void;
}

const DateNavigation = ({
  className,
  children,
  nextMonth,
  prevMonth,
  nextYear,
  prevYear,
}: DateNavigationProps) => (
  <div className={classNames(styles.DateNavigation, className)}>
    <span
      aria-label="Previous year"
      className={styles.PrevDate}
      onClick={prevYear}
      onKeyDown={prevYear}
      data-testid="action-next-year"
      role="button"
      tabIndex={0}
    >
      &laquo;
    </span>
    <span
      aria-label="Previous month"
      className={styles.PrevDate}
      onClick={prevMonth}
      onKeyDown={prevMonth}
      data-testid="action-prev-date"
      role="button"
      tabIndex={0}
    >
      &lsaquo;
    </span>
    <div className={styles.CurrentDate}>{children}</div>
    <span
      aria-label="Next month"
      className={styles.NextDate}
      onClick={nextMonth}
      onKeyDown={nextMonth}
      data-testid="action-next-date"
      role="button"
      tabIndex={0}
    >
      &rsaquo;
    </span>
    <span
      aria-label="Next year"
      className={styles.NextDate}
      onClick={nextYear}
      onKeyDown={nextYear}
      data-testid="action-next-year"
      role="button"
      tabIndex={0}
    >
      &raquo;
    </span>
  </div>
);

export default DateNavigation;
