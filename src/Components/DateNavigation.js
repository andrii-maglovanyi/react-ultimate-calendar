import PropTypes from "prop-types";
import React from "react";

import classNames from "../Utils/ClassNames";
import styles from "./DateNavigation.module.scss";

const DateNavigation = ({ className, children, nextDate, prevDate }) => (
  <div className={classNames(styles.DateNavigation, className)}>
    <span
      aria-label="Previous month"
      className={styles.PrevDate}
      onClick={prevDate}
      onKeyPress={prevDate}
      data-testid="action-prev-date"
      role="button"
      tabIndex={0}
    >
      &#8249;
    </span>
    <div className={styles.CurrentDate}>{children}</div>
    <span
      aria-label="Next month"
      className={styles.NextDate}
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
  children: PropTypes.node,
  className: PropTypes.string,
  nextDate: PropTypes.func.isRequired,
  prevDate: PropTypes.func.isRequired
};

DateNavigation.defaultProps = {
  children: [],
  className: ""
};

export default DateNavigation;
