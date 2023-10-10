import React, { useEffect } from "react";

import { useRef } from "react";
import styles from "./TimeSelector.module.scss";

export interface TimeSelectorProps {
  active: boolean;
  rangeEnd: Date | null;
  rangeStart: Date | null;
  onChange?: (start: Date, end: Date | null) => void;
}

const getTime = (date: Date | null) => {
  if (!date) return;

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

export const TimeSelector = ({
  active,
  onChange,
  rangeStart,
  rangeEnd,
}: TimeSelectorProps) => {
  const startTimeRef = useRef<HTMLInputElement | null>(null);
  const endTimeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (active) {
      if (rangeEnd) {
        endTimeRef.current?.focus();
      } else {
        startTimeRef.current?.focus();
      }
    }
  }, [active]);

  const onStartChange = () => {
    const timeValue = startTimeRef.current?.value;
    if (timeValue && rangeStart && !rangeEnd) {
      const [hours, minutes, seconds = 0] = timeValue.split(":").map(Number);

      rangeStart.setHours(hours, minutes, seconds, 0);

      onChange?.(rangeStart, null);
    }
  };

  const onEndChange = () => {
    const timeValue = endTimeRef.current?.value;

    if (timeValue && rangeStart && rangeEnd) {
      const [hours, minutes, seconds = 0] = timeValue.split(":").map(Number);

      rangeEnd.setHours(hours, minutes, seconds, 0);

      onChange?.(rangeStart, rangeEnd);
    }
  };

  const onStartKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onStartChange();
    }
  };

  const onEndKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onEndChange();
    }
  };

  return (
    <div className={styles.TimeSelector}>
      <div className={styles.TimeSelectorInputs}>
        <input
          defaultValue={getTime(rangeStart)}
          disabled={!rangeStart}
          type="time"
          step={1}
          ref={startTimeRef}
          onBlur={onStartChange}
          onKeyDown={onStartKeyDown}
        />
        <div>→</div>
        <input
          defaultValue={getTime(rangeEnd)}
          type="time"
          step={1}
          disabled={!rangeEnd}
          ref={endTimeRef}
          onBlur={onEndChange}
          onKeyDown={onEndKeyDown}
        />
      </div>
    </div>
  );
};
