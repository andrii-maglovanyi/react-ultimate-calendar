import React from "react";
import "@testing-library/jest-dom";

import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  getByText as getByTextFromNode,
} from "@testing-library/react";

import Calendar from "./Calendar";

afterEach(cleanup);

test("should render a calendar with current date highlighted", async () => {
  const { getByTestId } = render(<Calendar />);
  const date = new Date();

  await waitFor(() => {
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
  expect(weekDaysNode?.firstChild).toHaveTextContent("Sun");

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

  const nextMonthNode = getByTestId("action-next-month");
  fireEvent.click(nextMonthNode);
  fireEvent.click(nextMonthNode);
  fireEvent.click(nextMonthNode);
  expect(getByText("52")).not.toBeNull();
  const weekNumbers = getByTestId("week-numbers");
  week = getByTextFromNode(weekNumbers, "1"); // Select 1st week of 2020
  fireEvent.click(week);
  expect(weekNumber).toBe(1);
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
  expect(weekDaysNode?.firstChild).toHaveTextContent("Mon");

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

  const nextMonthNode = getByTestId("action-next-month");
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
  expect(weekDaysNode?.firstChild).toHaveTextContent("السبت");
});

test("should display two-months calendar view", () => {
  const date = new Date(2019, 8 /* Sep */, 1);

  const { getAllByTestId } = render(
    <Calendar
      month={date.getMonth()}
      multi
      onChange={() => {}}
      showWeekNumbers
      year={date.getFullYear()}
    />
  );

  const monthNames = getAllByTestId("month-name");
  expect(monthNames.length).toBe(2);
  expect(monthNames[0].innerHTML).toBe("September 2019");
  expect(monthNames[1].innerHTML).toBe("October 2019");

  const weekNumbers = getAllByTestId("week-numbers");
  expect(weekNumbers.length).toBe(2);
  expect(weekNumbers[0].firstChild).toHaveTextContent("36");
  expect(weekNumbers[0].lastChild).toHaveTextContent("40");
  expect(weekNumbers[1].firstChild).toHaveTextContent("40");
  expect(weekNumbers[1].lastChild).toHaveTextContent("44");

  const monthDaysNode = getAllByTestId("month-days");
  expect(monthDaysNode.length).toBe(2);
  expect(monthDaysNode[0].firstChild?.firstChild).toHaveTextContent("1");
  expect(monthDaysNode[0].lastChild?.lastChild).toHaveTextContent("5");
  expect(monthDaysNode[1].firstChild?.firstChild).toHaveTextContent("29");
  expect(monthDaysNode[1].lastChild?.lastChild).toHaveTextContent("2");
});

describe("First and last weeks of a year", () => {
  test("should show correct first and last week of the year for us-US locale", () => {
    const { getByTestId: getStart2020 } = render(
      <Calendar month={0} onChange={() => {}} showWeekNumbers year={2020} />
    );
    expect(getStart2020("week-numbers").firstChild).toHaveTextContent("1");
    expect(getStart2020("month-days").firstChild?.firstChild).toHaveTextContent(
      "29"
    );

    cleanup();

    const { getByTestId: getEnd2020 } = render(
      <Calendar month={11} onChange={() => {}} showWeekNumbers year={2020} />
    );
    expect(getEnd2020("week-numbers").firstChild).toHaveTextContent("49");
    expect(getEnd2020("week-numbers").childNodes[3]).toHaveTextContent("52");
    expect(getEnd2020("week-numbers").lastChild).toHaveTextContent("1");
    expect(getEnd2020("month-days").firstChild?.firstChild).toHaveTextContent(
      "29"
    );
    expect(getEnd2020("month-days").lastChild?.lastChild).toHaveTextContent(
      "2"
    );

    cleanup();

    const { getByTestId: getStart2021 } = render(
      <Calendar month={0} onChange={() => {}} showWeekNumbers year={2021} />
    );
    expect(getStart2021("week-numbers").firstChild).toHaveTextContent("1");
    expect(getStart2021("month-days").firstChild?.firstChild).toHaveTextContent(
      "27"
    );

    cleanup();

    const { getByTestId: getEnd2021 } = render(
      <Calendar month={11} onChange={() => {}} showWeekNumbers year={2021} />
    );
    expect(getEnd2021("week-numbers").firstChild).toHaveTextContent("49");
    expect(getEnd2021("week-numbers").childNodes[3]).toHaveTextContent("52");
    expect(getEnd2021("week-numbers").lastChild).toHaveTextContent("1");
    expect(getEnd2021("month-days").firstChild?.firstChild).toHaveTextContent(
      "28"
    );
    expect(getEnd2021("month-days").lastChild?.lastChild).toHaveTextContent(
      "1"
    );

    cleanup();

    const { getByTestId: getStart2022 } = render(
      <Calendar month={0} onChange={() => {}} showWeekNumbers year={2022} />
    );
    expect(getStart2022("week-numbers").firstChild).toHaveTextContent("1");
    expect(getStart2022("month-days").firstChild?.firstChild).toHaveTextContent(
      "26"
    );

    cleanup();

    const { getByTestId: getEnd2022 } = render(
      <Calendar month={11} onChange={() => {}} showWeekNumbers year={2022} />
    );
    expect(getEnd2022("week-numbers").firstChild).toHaveTextContent("49");
    expect(getEnd2022("week-numbers").lastChild).toHaveTextContent("53");
    expect(getEnd2022("month-days").firstChild?.firstChild).toHaveTextContent(
      "27"
    );
    expect(getEnd2022("month-days").lastChild?.lastChild).toHaveTextContent(
      "31"
    );

    cleanup();

    const { getByTestId: getStart2023 } = render(
      <Calendar month={0} onChange={() => {}} showWeekNumbers year={2023} />
    );
    expect(getStart2023("week-numbers").firstChild).toHaveTextContent("1");
    expect(getStart2023("month-days").firstChild?.firstChild).toHaveTextContent(
      "1"
    );

    cleanup();

    const { getByTestId: getEnd2023 } = render(
      <Calendar month={11} onChange={() => {}} showWeekNumbers year={2023} />
    );
    expect(getEnd2023("week-numbers").firstChild).toHaveTextContent("48");
    expect(getEnd2023("week-numbers").childNodes[4]).toHaveTextContent("52");
    expect(getEnd2023("week-numbers").lastChild).toHaveTextContent("1");
    expect(getEnd2023("month-days").firstChild?.firstChild).toHaveTextContent(
      "26"
    );
    expect(getEnd2023("month-days").lastChild?.lastChild).toHaveTextContent(
      "6"
    );

    cleanup();

    const { getByTestId: getStart2024 } = render(
      <Calendar month={0} onChange={() => {}} showWeekNumbers year={2024} />
    );
    expect(getStart2024("week-numbers").firstChild).toHaveTextContent("1");
    expect(getStart2024("month-days").firstChild?.firstChild).toHaveTextContent(
      "31"
    );

    cleanup();

    const { getByTestId: getEnd2024 } = render(
      <Calendar month={11} onChange={() => {}} showWeekNumbers year={2024} />
    );
    expect(getEnd2024("week-numbers").firstChild).toHaveTextContent("49");
    expect(getEnd2024("week-numbers").childNodes[3]).toHaveTextContent("52");
    expect(getEnd2024("week-numbers").lastChild).toHaveTextContent("1");
    expect(getEnd2024("month-days").firstChild?.firstChild).toHaveTextContent(
      "1"
    );
    expect(getEnd2024("month-days").lastChild?.lastChild).toHaveTextContent(
      "4"
    );
  });

  test("should show correct first and last week of the year for ru-RU locale", () => {
    const { getByTestId: getStart2020 } = render(
      <Calendar
        locale="ru-RU"
        month={0}
        onChange={() => {}}
        showWeekNumbers
        year={2020}
      />
    );
    expect(getStart2020("week-numbers").firstChild).toHaveTextContent("1");
    expect(getStart2020("month-days").firstChild?.firstChild).toHaveTextContent(
      "30"
    );

    cleanup();

    const { getByTestId: getEnd2020 } = render(
      <Calendar
        locale="ru-RU"
        month={11}
        onChange={() => {}}
        showWeekNumbers
        year={2020}
      />
    );
    expect(getEnd2020("week-numbers").firstChild).toHaveTextContent("49");
    expect(getEnd2020("week-numbers").lastChild).toHaveTextContent("53");
    expect(getEnd2020("month-days").firstChild?.firstChild).toHaveTextContent(
      "30"
    );
    expect(getEnd2020("month-days").lastChild?.lastChild).toHaveTextContent(
      "3"
    );

    cleanup();

    const { getByTestId: getStart2021 } = render(
      <Calendar
        locale="ru-RU"
        month={0}
        onChange={() => {}}
        showWeekNumbers
        year={2021}
      />
    );
    expect(getStart2021("week-numbers").firstChild).toHaveTextContent("53");
    expect(getStart2021("month-days").firstChild?.firstChild).toHaveTextContent(
      "28"
    );

    cleanup();

    const { getByTestId: getEnd2021 } = render(
      <Calendar
        locale="ru-RU"
        month={11}
        onChange={() => {}}
        showWeekNumbers
        year={2021}
      />
    );
    expect(getEnd2021("week-numbers").firstChild).toHaveTextContent("48");
    expect(getEnd2021("week-numbers").lastChild).toHaveTextContent("52");
    expect(getEnd2021("month-days").firstChild?.firstChild).toHaveTextContent(
      "29"
    );
    expect(getEnd2021("month-days").lastChild?.lastChild).toHaveTextContent(
      "2"
    );

    cleanup();

    const { getByTestId: getStart2022 } = render(
      <Calendar
        locale="ru-RU"
        month={0}
        onChange={() => {}}
        showWeekNumbers
        year={2022}
      />
    );
    expect(getStart2022("week-numbers").firstChild).toHaveTextContent("52");
    expect(getStart2022("month-days").firstChild?.firstChild).toHaveTextContent(
      "27"
    );

    cleanup();

    const { getByTestId: getEnd2022 } = render(
      <Calendar
        locale="ru-RU"
        month={11}
        onChange={() => {}}
        showWeekNumbers
        year={2022}
      />
    );
    expect(getEnd2022("week-numbers").firstChild).toHaveTextContent("48");
    expect(getEnd2022("week-numbers").lastChild).toHaveTextContent("52");
    expect(getEnd2022("month-days").firstChild?.firstChild).toHaveTextContent(
      "28"
    );
    expect(getEnd2022("month-days").lastChild?.lastChild).toHaveTextContent(
      "1"
    );

    cleanup();

    const { getByTestId: getStart2023 } = render(
      <Calendar
        locale="ru-RU"
        month={0}
        onChange={() => {}}
        showWeekNumbers
        year={2023}
      />
    );
    expect(getStart2023("week-numbers").firstChild).toHaveTextContent("52");
    expect(getStart2023("month-days").firstChild?.firstChild).toHaveTextContent(
      "26"
    );

    cleanup();

    const { getByTestId: getEnd2023 } = render(
      <Calendar
        locale="ru-RU"
        month={11}
        onChange={() => {}}
        showWeekNumbers
        year={2023}
      />
    );
    expect(getEnd2023("week-numbers").firstChild).toHaveTextContent("48");
    expect(getEnd2023("week-numbers").lastChild).toHaveTextContent("52");
    expect(getEnd2023("month-days").firstChild?.firstChild).toHaveTextContent(
      "27"
    );
    expect(getEnd2023("month-days").lastChild?.lastChild).toHaveTextContent(
      "31"
    );

    cleanup();

    const { getByTestId: getStart2024 } = render(
      <Calendar
        locale="ru-RU"
        month={0}
        onChange={() => {}}
        showWeekNumbers
        year={2024}
      />
    );
    expect(getStart2024("week-numbers").firstChild).toHaveTextContent("1");
    expect(getStart2024("month-days").firstChild?.firstChild).toHaveTextContent(
      "1"
    );

    cleanup();

    const { getByTestId: getEnd2024 } = render(
      <Calendar
        locale="ru-RU"
        month={11}
        onChange={() => {}}
        showWeekNumbers
        year={2024}
      />
    );
    expect(getEnd2024("week-numbers").firstChild).toHaveTextContent("48");
    expect(getEnd2024("week-numbers").childNodes[4]).toHaveTextContent("52");
    expect(getEnd2024("week-numbers").lastChild).toHaveTextContent("1");
    expect(getEnd2024("month-days").firstChild?.firstChild).toHaveTextContent(
      "25"
    );
    expect(getEnd2024("month-days").lastChild?.lastChild).toHaveTextContent(
      "5"
    );
  });

  test("should show correct first and last week of the year for ar-AE locale", () => {
    const { getByTestId: getStart2020 } = render(
      <Calendar
        locale="ar-AE"
        month={0}
        onChange={() => {}}
        showWeekNumbers
        year={2020}
      />
    );
    expect(getStart2020("week-numbers").firstChild).toHaveTextContent("1");
    expect(getStart2020("month-days").firstChild?.firstChild).toHaveTextContent(
      "28"
    );

    cleanup();

    const { getByTestId: getEnd2020 } = render(
      <Calendar
        locale="ar-AE"
        month={11}
        onChange={() => {}}
        showWeekNumbers
        year={2020}
      />
    );
    expect(getEnd2020("week-numbers").firstChild).toHaveTextContent("49");
    expect(getEnd2020("week-numbers").lastChild).toHaveTextContent("1");
    expect(getEnd2020("month-days").firstChild?.firstChild).toHaveTextContent(
      "28"
    );
    expect(getEnd2020("month-days").lastChild?.lastChild).toHaveTextContent(
      "1"
    );

    cleanup();

    const { getByTestId: getStart2021 } = render(
      <Calendar
        locale="ar-AE"
        month={0}
        onChange={() => {}}
        showWeekNumbers
        year={2021}
      />
    );
    expect(getStart2021("week-numbers").firstChild).toHaveTextContent("1");
    expect(getStart2021("month-days").firstChild?.firstChild).toHaveTextContent(
      "26"
    );

    cleanup();

    const { getByTestId: getEnd2021 } = render(
      <Calendar
        locale="ar-AE"
        month={11}
        onChange={() => {}}
        showWeekNumbers
        year={2021}
      />
    );
    expect(getEnd2021("week-numbers").firstChild).toHaveTextContent("49");
    expect(getEnd2021("week-numbers").lastChild).toHaveTextContent("53");
    expect(getEnd2021("month-days").firstChild?.firstChild).toHaveTextContent(
      "27"
    );
    expect(getEnd2021("month-days").lastChild?.lastChild).toHaveTextContent(
      "31"
    );

    cleanup();

    const { getByTestId: getStart2022 } = render(
      <Calendar
        locale="ar-AE"
        month={0}
        onChange={() => {}}
        showWeekNumbers
        year={2022}
      />
    );
    expect(getStart2022("week-numbers").firstChild).toHaveTextContent("1");
    expect(getStart2022("month-days").firstChild?.firstChild).toHaveTextContent(
      "1"
    );

    cleanup();

    const { getByTestId: getEnd2022 } = render(
      <Calendar
        locale="ar-AE"
        month={11}
        onChange={() => {}}
        showWeekNumbers
        year={2022}
      />
    );
    expect(getEnd2022("week-numbers").firstChild).toHaveTextContent("48");
    expect(getEnd2022("week-numbers").lastChild).toHaveTextContent("1");
    expect(getEnd2022("month-days").firstChild?.firstChild).toHaveTextContent(
      "26"
    );
    expect(getEnd2022("month-days").lastChild?.lastChild).toHaveTextContent(
      "6"
    );

    cleanup();

    const { getByTestId: getStart2023 } = render(
      <Calendar
        locale="ar-AE"
        month={0}
        onChange={() => {}}
        showWeekNumbers
        year={2023}
      />
    );
    expect(getStart2023("week-numbers").firstChild).toHaveTextContent("1");
    expect(getStart2023("month-days").firstChild?.firstChild).toHaveTextContent(
      "31"
    );

    cleanup();

    const { getByTestId: getEnd2023 } = render(
      <Calendar
        locale="ar-AE"
        month={11}
        onChange={() => {}}
        showWeekNumbers
        year={2023}
      />
    );
    expect(getEnd2023("week-numbers").firstChild).toHaveTextContent("48");
    expect(getEnd2023("week-numbers").lastChild).toHaveTextContent("1");
    expect(getEnd2023("month-days").firstChild?.firstChild).toHaveTextContent(
      "25"
    );
    expect(getEnd2023("month-days").lastChild?.lastChild).toHaveTextContent(
      "5"
    );

    cleanup();

    const { getByTestId: getStart2024 } = render(
      <Calendar
        locale="ar-AE"
        month={0}
        onChange={() => {}}
        showWeekNumbers
        year={2024}
      />
    );
    expect(getStart2024("week-numbers").firstChild).toHaveTextContent("1");
    expect(getStart2024("month-days").firstChild?.firstChild).toHaveTextContent(
      "30"
    );

    cleanup();

    const { getByTestId: getEnd2024 } = render(
      <Calendar
        locale="ar-AE"
        month={11}
        onChange={() => {}}
        showWeekNumbers
        year={2024}
      />
    );
    expect(getEnd2024("week-numbers").firstChild).toHaveTextContent("49");
    expect(getEnd2024("week-numbers").childNodes[3]).toHaveTextContent("52");
    expect(getEnd2024("week-numbers").lastChild).toHaveTextContent("1");
    expect(getEnd2024("month-days").firstChild?.firstChild).toHaveTextContent(
      "30"
    );
    expect(getEnd2024("month-days").lastChild?.lastChild).toHaveTextContent(
      "3"
    );
  });
});
