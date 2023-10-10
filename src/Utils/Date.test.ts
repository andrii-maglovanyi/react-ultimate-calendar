import {
  getDateRangeOfWeek,
  getFirstDayOfWeek,
  getEndOfWeek,
  getStartOfWeek,
  getWeekNumber
} from "./Date";

describe("getDateRangeOfWeek", () => {
  test("should return first day of week with time set to 00:00:00 and last day with time set to 23:59:59:999", () => {
    let result = getDateRangeOfWeek(14, 2019);
    expect(result).toEqual([
      new Date(2019, 2 /* Mar */, 31, 0, 0, 0, 0),
      new Date(2019, 3 /* Apr */, 6, 23, 59, 59, 999)
    ]);

    result = getDateRangeOfWeek(9, 2019);
    expect(result).toEqual([
      new Date(2019, 1 /* Feb */, 24, 0, 0, 0, 0),
      new Date(2019, 2 /* Mar */, 2, 23, 59, 59, 999)
    ]);

    result = getDateRangeOfWeek(1, 2016);
    expect(result).toEqual([
      new Date(2015, 11 /* Dec */, 27, 0, 0, 0, 0),
      new Date(2016, 0 /* Jan */, 2, 23, 59, 59, 999)
    ]);
  });

  test("should allow to specify the first day of the week", () => {
    let result = getDateRangeOfWeek(14, 2019, 1);
    expect(result).toEqual([
      new Date(2019, 3 /* Apr */, 1, 0, 0, 0, 0),
      new Date(2019, 3 /* Apr */, 7, 23, 59, 59, 999)
    ]);

    result = getDateRangeOfWeek(9, 2019, 1);
    expect(result).toEqual([
      new Date(2019, 1 /* Feb */, 25, 0, 0, 0, 0),
      new Date(2019, 2 /* Mar */, 3, 23, 59, 59, 999)
    ]);

    result = getDateRangeOfWeek(53, 2015, 1);
    expect(result).toEqual([
      new Date(2015, 11 /* Dec */, 28, 0, 0, 0, 0),
      new Date(2016, 0 /* Jan */, 3, 23, 59, 59, 999)
    ]);

    result = getDateRangeOfWeek(14, 2019, 6);
    expect(result).toEqual([
      new Date(2019, 2 /* Mar */, 30, 0, 0, 0, 0),
      new Date(2019, 3 /* Apr */, 5, 23, 59, 59, 999)
    ]);

    result = getDateRangeOfWeek(9, 2019, 6);
    expect(result).toEqual([
      new Date(2019, 1 /* Feb */, 23, 0, 0, 0, 0),
      new Date(2019, 2 /* Mar */, 1, 23, 59, 59, 999)
    ]);

    result = getDateRangeOfWeek(1, 2016, 6);
    expect(result).toEqual([
      new Date(2015, 11 /* Dec */, 26, 0, 0, 0, 0),
      new Date(2016, 0 /* Jan */, 1, 23, 59, 59, 999)
    ]);
  });
});

describe("getFirstDayOfWeek", () => {
  test("should return 0 (Sunday) for US, Canada, Egypt and Israel locales", () => {
    expect(getFirstDayOfWeek("en-US")).toEqual(0);
    expect(getFirstDayOfWeek("en-CA")).toEqual(0);
    expect(getFirstDayOfWeek("fr-CA")).toEqual(0);
    expect(getFirstDayOfWeek("ar-CEG")).toEqual(0);
    expect(getFirstDayOfWeek("he-IL")).toEqual(0);
  });

  test("should return 1 (Monday) for UK, Russian and German locales", () => {
    expect(getFirstDayOfWeek("en-GB")).toEqual(1);
    expect(getFirstDayOfWeek("ru-RU")).toEqual(1);
    expect(getFirstDayOfWeek("de-DE")).toEqual(1);
  });

  test("should return 6 (Saturday) for Morocco, Syria and United Arab Emirates locales", () => {
    expect(getFirstDayOfWeek("ar-MA")).toEqual(6);
    expect(getFirstDayOfWeek("ar-SY")).toEqual(6);
    expect(getFirstDayOfWeek("ar-AE")).toEqual(6);
  });
});

describe("getEndOfWeek", () => {
  test("should return a date set to the last day of a week and time set to 23:59:59:999", () => {
    let result = getEndOfWeek(new Date(2019, 9 /* Oct */, 4, 11, 55, 0));
    expect(result).toEqual(new Date(2019, 9 /* Oct */, 5, 23, 59, 59, 999));

    result = getEndOfWeek(new Date(2019, 0 /* Jan */, 3, 11, 55, 0));
    expect(result).toEqual(new Date(2019, 0 /* Jan */, 5, 23, 59, 59, 999));
  });

  test("should allow to specify the first day of the week", () => {
    const date = new Date(2019, 9 /* Oct */, 4, 11, 55, 0);
    let result = getEndOfWeek(date, 1);
    expect(result).toEqual(new Date(2019, 9 /* Oct */, 6, 23, 59, 59, 999));

    result = getEndOfWeek(date, 6);
    expect(result).toEqual(new Date(2019, 9 /* Oct */, 4, 23, 59, 59, 999));
  });

  test("should not mutate the original date", () => {
    const date = new Date(2019, 9 /* Oct */, 4, 11, 55, 0);
    getEndOfWeek(date);
    expect(date).toEqual(new Date(2019, 9 /* Oct */, 4, 11, 55, 0));
  });
});

describe("getStartOfWeek", () => {
  test("should return a date set to the first day of a week and time set to 00:00:00", () => {
    let result = getStartOfWeek(new Date(2019, 9 /* Oct */, 4, 11, 55, 0));
    expect(result).toEqual(new Date(2019, 8 /* Sep */, 29));

    result = getStartOfWeek(new Date(2019, 0 /* Jan */, 3, 11, 55, 0));
    expect(result).toEqual(new Date(2018, 11 /* Dec */, 30));
  });

  test("should allow to specify the first day of the week", () => {
    const date = new Date(2019, 9 /* Oct */, 4, 11, 55, 0);

    let result = getStartOfWeek(date, 1);
    expect(result).toEqual(new Date(2019, 8 /* Sep */, 30));

    result = getStartOfWeek(date, 6);
    expect(result).toEqual(new Date(2019, 8 /* Oct */, 28));
  });

  test("should not mutate the original date", () => {
    const date = new Date(2019, 9 /* Oct */, 4, 11, 55, 0);
    getStartOfWeek(date);
    expect(date).toEqual(new Date(2019, 9 /* Oct */, 4, 11, 55, 0));
  });
});

describe("getWeekNumber", () => {
  test("returns the local week of year of the given date", () => {
    let result = getWeekNumber(new Date(2005, 0 /* Jan */, 2));
    expect(result).toEqual(2);

    result = getWeekNumber(new Date(2016, 0 /* Jan */, 2));
    expect(result).toEqual(1);

    result = getWeekNumber(new Date(2019, 0 /* Jan */, 6));
    expect(result).toEqual(2);

    result = getWeekNumber(new Date(2020, 0 /* Jan */, 6));
    expect(result).toEqual(2);
  });

  test("should allow to specify the first day of the week", () => {
    let result = getWeekNumber(new Date(2005, 0 /* Jan */, 2), 1);
    expect(result).toEqual(53);

    result = getWeekNumber(new Date(2016, 0 /* Jan */, 3), 1);
    expect(result).toEqual(53);

    result = getWeekNumber(new Date(2019, 0 /* Jan */, 6), 1);
    expect(result).toEqual(1);

    result = getWeekNumber(new Date(2020, 0 /* Jan */, 6), 1);
    expect(result).toEqual(2);

    result = getWeekNumber(new Date(2005, 0 /* Jan */, 2), 6);
    expect(result).toEqual(1);

    result = getWeekNumber(new Date(2016, 0 /* Jan */, 2), 6);
    expect(result).toEqual(2);

    result = getWeekNumber(new Date(2019, 0 /* Jan */, 6), 6);
    expect(result).toEqual(2);

    result = getWeekNumber(new Date(2020, 0 /* Jan */, 6), 6);
    expect(result).toEqual(2);
  });

  test("should not mutate the original date", () => {
    const date = new Date(2019, 9 /* Oct */, 4, 11, 55, 0);
    getWeekNumber(date);
    expect(date).toEqual(new Date(2019, 9 /* Oct */, 4, 11, 55, 0));
  });
});
