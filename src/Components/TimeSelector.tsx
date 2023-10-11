import React, { useEffect, useState } from "react";

import { useRef } from "react";
import styles from "./TimeSelector.module.scss";

export interface TimeSelectorProps {
  active: boolean;
  rangeEnd: Date | null;
  rangeStart: Date | null;
  onChange?: (start: Date, end: Date | null) => void;
}

const getTime = (date: Date | null) => {
  if (!date) return "";

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

  const [startTime, setStartTime] = useState<string>(getTime(rangeStart));
  const [endTime, setEndTime] = useState<string>(getTime(rangeEnd));

  useEffect(() => {
    if (active) {
      if (rangeEnd) {
        endTimeRef.current?.focus();
      } else {
        startTimeRef.current?.focus();
      }
    }
  }, [active]);

  useEffect(() => {
    if (rangeStart) {
      setStartTime(getTime(rangeStart));
    }
  }, [rangeStart]);

  useEffect(() => {
    if (rangeEnd) {
      setEndTime(getTime(rangeEnd));
    }
  }, [rangeEnd]);

  const onStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(event.target.value);
  };

  const onEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(event.target.value);
  };

  const onStartBlur = () => {
    if (startTime && rangeStart) {
      const date = new Date(rangeStart.getTime());
      const [hours, minutes, seconds = 0] = startTime.split(":").map(Number);

      date.setHours(hours, minutes, seconds, 0);

      onChange?.(date, rangeEnd);
    }
  };

  const onEndBlur = () => {
    if (endTime && rangeStart && rangeEnd) {
      const date = new Date(rangeEnd.getTime());
      const [hours, minutes, seconds = 0] = endTime.split(":").map(Number);

      date.setHours(hours, minutes, seconds, 0);

      onChange?.(rangeStart, date);
    }
  };

  const onStartKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onStartBlur();
    }
  };

  const onEndKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onEndBlur();
    }
  };

  return (
    <div className={styles.TimeSelector}>
      <div className={styles.TimeSelectorInputs}>
        <input
          value={startTime}
          disabled={!rangeStart}
          type="time"
          step={1}
          ref={startTimeRef}
          onChange={onStartChange}
          onBlur={onStartBlur}
          onKeyDown={onStartKeyDown}
        />
        <div>→</div>
        <input
          value={endTime}
          type="time"
          step={1}
          disabled={!rangeEnd}
          ref={endTimeRef}
          onChange={onEndChange}
          onBlur={onEndBlur}
          onKeyDown={onEndKeyDown}
        />
      </div>
    </div>
  );
};
