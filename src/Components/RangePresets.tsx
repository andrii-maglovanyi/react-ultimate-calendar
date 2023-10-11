import React, { useEffect, useState } from "react";
import styles from "./RangePresets.module.scss";

import classNames from "../Utils/ClassNames";

interface RangePresetsProps {
  ranges: Record<string, [Date, Date]>;
  selectRange: (start: Date, end: Date, triggerChange: boolean) => void;
  previewRange: (start: Date | null, end: Date | null) => void;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  isPreview: boolean;
}

export const RangePresets = ({
  ranges,
  rangeStart,
  rangeEnd,
  selectRange,
  previewRange,
  isPreview,
}: RangePresetsProps) => {
  const [selectedRange, setSelectRange] =
    useState<[string, Date | null, Date | null]>();
  const list = Object.entries(ranges);

  if (list.length > 7) {
    console.warn("RangePresets: only 6 presets are supported");
  }

  useEffect(() => {
    if (!isPreview) {
      const title =
        list.find(
          ([, dates]) => rangeStart === dates[0] && rangeEnd === dates[1]
        )?.[0] ?? "";

      setSelectRange([title, rangeStart, rangeEnd]);
    }
  }, [rangeStart, rangeEnd]);

  return (
    <div className={styles.RangePresets}>
      {list.slice(0, 7).map(([title, dates]) => {
        return (
          <div
            className={classNames(
              styles.RangePreset,
              title === selectedRange?.[0] && styles.SelectedPreset
            )}
            key={title}
            onClick={() => {
              previewRange(null, null);
              setSelectRange([title, ...dates]);
              selectRange(...dates, true);
            }}
            onMouseEnter={() => {
              previewRange(...dates);
            }}
            onMouseLeave={() => {
              previewRange(null, null);
              if (selectedRange?.[1] && selectedRange?.[2]) {
                selectRange(selectedRange[1], selectedRange[2], false);
              }
            }}
          >
            {title}
          </div>
        );
      })}
    </div>
  );
};
