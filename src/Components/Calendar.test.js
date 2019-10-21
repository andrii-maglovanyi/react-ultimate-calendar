import React from "react";

import {
  cleanup,
  fireEvent,
  render,
  wait,
  getByText as getByTextFromNode
} from "@testing-library/react";

import Calendar from "./Calendar";

afterEach(cleanup);

test("should render a calendar with current date highlighted", async () => {
  const { getByTestId } = render(<Calendar onChange={() => {}} />);
  const date = new Date();

  await wait(() => {
    const calendarHeaderNode = getByTestId("today");
    expect(calendarHeaderNode.innerHTML).toBe(date.getDate().toString());
  });
});

test("should return a selected week range by clicking on a week number", async () => {
  let weekNumber = null;
  let rangeStart = null;
  let rangeEnd = null;
  const date = new Date(2019, 8 /* Sep */, 1);

  const { getByTestId, getByText } = render(
    <Calendar
      month={date.getMonth()}
      onChange={(number, start, end) => {
        weekNumber = number;
        rangeStart = start;
        rangeEnd = end;
      }}
      showWeekNumbers
      weeksSelector
      year={date.getFullYear()}
    />
  );

  const weekDaysNode = getByTestId("week-days");
  expect(weekDaysNode.firstChild.innerHTML).toEqual("Sun");

  let week = getByText("38"); // Select 38th week
  fireEvent.click(week);
  expect(weekNumber).toBe(38);
  expect(rangeStart).toEqual(new Date(2019, 8, 15, 0, 0, 0, 0));
  expect(rangeEnd).toEqual(new Date(2019, 8, 21, 23, 59, 59, 999));

  week = getByText("40"); // Select 40th week
  fireEvent.click(week);
  expect(weekNumber).toBe(40);
  expect(rangeStart).toEqual(new Date(2019, 8, 29, 0, 0, 0, 0));
  expect(rangeEnd).toEqual(new Date(2019, 9, 5, 23, 59, 59, 999));

  const nextMonthNode = getByTestId("action-next-date");
  fireEvent.click(nextMonthNode);
  fireEvent.click(nextMonthNode);
  fireEvent.click(nextMonthNode);
  expect(getByText("52")).not.toBeNull();
  const weekNumbers = getByTestId("week-numbers");
  week = getByTextFromNode(weekNumbers, "53"); // Select 53rd week
  fireEvent.click(week);
  expect(weekNumber).toBe(53);
  expect(rangeStart).toEqual(new Date(2019, 11, 29, 0, 0, 0, 0));
  expect(rangeEnd).toEqual(new Date(2020, 0, 4, 23, 59, 59, 999));
});

test("should allow to specify locale for the calendar", async () => {
  let weekNumber = null;
  let rangeStart = null;
  let rangeEnd = null;
  const date = new Date(2019, 8 /* Sep */, 1);

  const { getByTestId, getByText } = render(
    <Calendar
      locale="en-GB"
      month={date.getMonth()}
      onChange={(number, start, end) => {
        weekNumber = number;
        rangeStart = start;
        rangeEnd = end;
      }}
      showWeekNumbers
      weeksSelector
      year={date.getFullYear()}
    />
  );

  const weekDaysNode = getByTestId("week-days");
  expect(weekDaysNode.firstChild.innerHTML).toEqual("Mon");

  let week = getByText("38"); // Select 38th week
  fireEvent.click(week);
  expect(weekNumber).toBe(38);
  expect(rangeStart).toEqual(new Date(2019, 8, 16, 0, 0, 0, 0));
  expect(rangeEnd).toEqual(new Date(2019, 8, 22, 23, 59, 59, 999));

  week = getByText("40"); // Select 40th week
  fireEvent.click(week);
  expect(weekNumber).toBe(40);
  expect(rangeStart).toEqual(new Date(2019, 8, 30, 0, 0, 0, 0));
  expect(rangeEnd).toEqual(new Date(2019, 9, 6, 23, 59, 59, 999));

  const nextMonthNode = getByTestId("action-next-date");
  fireEvent.click(nextMonthNode);
  fireEvent.click(nextMonthNode);
  fireEvent.click(nextMonthNode);
  expect(getByText("52")).not.toBeNull();
  const weekNumbers = getByTestId("week-numbers");
  week = getByTextFromNode(weekNumbers, "1"); // Select 53rd week
  fireEvent.click(week);
  expect(weekNumber).toBe(1);
  expect(rangeStart).toEqual(new Date(2019, 11, 30, 0, 0, 0, 0));
  expect(rangeEnd).toEqual(new Date(2020, 0, 5, 23, 59, 59, 999));
});

test("should allow to specify locale for the calendar", async () => {
  const date = new Date(2019, 8 /* Sep */, 1);

  const { getByTestId } = render(
    <Calendar
      locale="ar-AE"
      month={date.getMonth()}
      onChange={() => {}}
      year={date.getFullYear()}
    />
  );

  const weekDaysNode = getByTestId("week-days");
  expect(weekDaysNode.firstChild.innerHTML).toEqual("Sat");
});
