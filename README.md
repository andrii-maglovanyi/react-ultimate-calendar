<h1 align="center">
    📅 React Ultimate Calendar
</h1>

[![Travis build](https://img.shields.io/travis/andrii-maglovanyi/react-ultimate-calendar?style=flat-square)](https://travis-ci.org/andrii-maglovanyi/react-ultimate-calendar)
![MIT License](https://img.shields.io/github/license/andrii-maglovanyi/react-ultimate-calendar?style=flat-square)

Zero dependency calendar with a localization support, dynamic or weekly range selection, and expanded view.

## Install

```bash
npm install react-ultimate-calendar
```

## Getting Started

```jsx
import Calendar from "react-ultimate-calendar";

const start = new Date();
const end = new Date();
end.setDate(end.getDate() + 10);

const onChangeHandler = (weekNumber, startDate, end Date) => { ... }

<Calendar
  locale="de-DE"
  multi
  onChange={onChangeHandler}
  showWeekNumbers
  weeksSelector
  value={[start, end]} // Specify default selected range of 10 days from today
/>;
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
