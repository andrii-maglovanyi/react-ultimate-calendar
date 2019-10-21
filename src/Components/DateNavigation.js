import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import styles from "./DateNavigation.module.scss";

// TODO: chane role, change tabIndex
const DateNavigation = ({
  border,
  className,
  children,
  nextDate,
  prevDate
}) => (
  <div
    className={classNames(
      styles.DateNavigation,
      { [styles.DateNavigationBorder]: border },
      className
    )}
  >
    <span
      className={classNames(styles.PrevDate, {
        [styles.PrevDateBorder]: border
      })}
      onClick={prevDate}
      onKeyPress={prevDate}
      data-testid="action-prev-date"
      role="button"
      tabIndex={0}
    >
      &#8249;
    </span>
    <div
      className={classNames(styles.CurrentDate, {
        [styles.CurrentDateBorder]: border
      })}
    >
      {children}
    </div>
    <span
      className={classNames(styles.NextDate, {
        [styles.NextDateBorder]: border
      })}
      onClick={nextDate}
      onKeyPress={nextDate}
      data-testid="action-next-date"
      role="button"
      tabIndex={0}
    >
      &rsaquo;
    </span>
  </div>
);

DateNavigation.propTypes = {
  border: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  nextDate: PropTypes.func.isRequired,
  prevDate: PropTypes.func.isRequired
};

DateNavigation.defaultProps = {
  border: false,
  children: [],
  className: ""
};

export default DateNavigation;
