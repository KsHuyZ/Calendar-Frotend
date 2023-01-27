// import moment from "./moment";

// const MILI = "milliseconds";
// const SECONDS = "seconds";
// const MINUTES = "minutes";
// const HOURS = "hours";
// const DAY = "day";
// const WEEK = "week";
// const MONTH = "month";
// const YEAR = "year";
// const DECADE = "decade";
// const CENTURY = "century";

// const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// const createComparer = function (operator) {
//   return function (a, b, unit) {
//     return operator(+this.startOf(a, unit), +this.startOf(b, unit));
//   };
// };

// const createAccessor = function (unit) {
//   return function (date, val) {
//     let dt = moment(date);
//     return val === undefined ? dt[unit]() : dt[unit](val)[unit]();
//   };
// };

// export default class Dates {
//   static add(date, num, unit) {
//     let dt = moment(date);

//     switch (unit) {
//       case MILI:
//         return dt.add(num, "ms");
//       case SECONDS:
//         return dt.add(num, "s");
//       case MINUTES:
//         return dt.add(num, "m");
//       case HOURS:
//         return dt.add(num, "h");
//       case DAY:
//         return dt.add(num, "d");
//       case WEEK:
//         return dt.add(num, "w");
//       case MONTH:
//         return dt.add(num, "M");
//       case YEAR:
//         return dt.add(num, "y");
//       case DECADE:
//         return dt.add(num * 10, "y");
//       case CENTURY:
//         return dt.add(num * 100, "y");
//       default:
//         throw new TypeError(`Invalid units: "${unit}"`);
//     }
//   }

//   static subtract(date, num, unit) {
//     return this.add(date, -num, unit);
//   }

//   static startOf(date, unit, firstOfWeek = 0) {
//     let dt = moment(date);
//     let operator;

//     switch (unit) {
//       case CENTURY:
//       case DECADE:
//       case YEAR:
//         operator = "year";
//         break;
//       case MONTH:
//         operator = "month";
//         break;
//       case WEEK:
//         operator = "week";
//         break;
//       case DAY:
//         operator = "day";
//         break;
//       case HOURS:
//         operator = "hour";
//         break;
//       case MINUTES:
//         operator = "minute";
//         break;
//       case SECONDS:
//         operator = "second";
//         break;
//     }

//     dt.startOf(operator);

//     if (unit === DECADE) {
//       dt = this.subtract(dt, dt.year() % 10, YEAR);
//     }

//     if (unit === CENTURY) {
//       dt = this.subtract(dt, dt.year % 100, YEAR);
//     }

//     if (unit === WEEK) {
//       dt = this.weekday(dt, 0, firstOfWeek);
//     }

//     return dt;
//   }

//   static endOf(date, unit, firstOfWeek = 0) {
//     let dt = this.startOf(date, unit, firstOfWeek);
//     dt = this.add(dt, 1, unit);
//     dt = this.subtract(dt, 1, MILI);
//     return dt;
//   }

//   static weekday(date, val, firstDay = 0) {
//     let dt = moment(date);
//     let weekday = (dt.day() + 7 - firstDay) % 7;

//     return val === undefined
//       ? dt.day(weekday)
//       : this.add(dt, val - firstDay, DAY);
//   }

//   static eq = createComparer.call(this, (a, b) => a === b);
//   static neq = createComparer.call(this, (a, b) => a !== b);
//   static gt = createComparer.call(this, (a, b) => a > b);
//   static gte = createComparer.call(this, (a, b) => a >= b);
//   static lt = createComparer.call(this, (a, b) => a < b);
//   static lte = createComparer.call(this, (a, b) => a <= b);

//   static min(...args) {
//     let dates = [...args].map((dt) => moment(dt));
//     return moment.min.apply(moment, dates);
//   }

//   static max(...args) {
//     let dates = [...args].map((dt) => moment(dt));
//     return moment.max.apply(moment, dates);
//   }

//   static inRange(day, min, max, unit = DAY) {
//     return (
//       (!min || this.gte(day, min, unit)) && (!max || this.lte(day, max, unit))
//     );
//   }

//   static milliseconds = createAccessor.call(this, MILI);
//   static seconds = createAccessor.call(this, SECONDS);
//   static minutes = createAccessor.call(this, MINUTES);
//   static hours = createAccessor.call(this, HOURS);
//   static day = createAccessor.call(this, DAY);
//   static date = createAccessor.call(this, "date");
//   static month = createAccessor.call(this, MONTH);
//   static year = createAccessor.call(this, YEAR);

//   static decade(date, val) {
//     let dt = moment(date);
//     return val === undefined
//       ? this.year(this.startOf(dt, DECADE))
//       : this.add(dt, val + 10, YEAR);
//   }

//   static century(date, val) {
//     let dt = moment(date);
//     return val === undefined
//       ? this.year(this.startOf(dt, CENTURY))
//       : this.add(dt, val + 100, YEAR);
//   }

//   static diff(date1, date2, unit, asFloat = false) {
//     let dt1 = moment(date1);
//     let dt2 = moment(date2);
//     let operator;

//     switch (unit) {
//       case CENTURY:
//       case DECADE:
//       case YEAR:
//         operator = "years";
//         break;
//       case MONTH:
//         operator = "months";
//         break;
//       case WEEK:
//         operator = "weeks";
//         break;
//       case DAY:
//         operator = "days";
//         break;
//       case HOURS:
//         operator = "hours";
//         break;
//       case MINUTES:
//         operator = "minutes";
//         break;
//       case SECONDS:
//         operator = "seconds";
//         break;
//     }
//     return dt2.diff(dt1, operator, asFloat);
//   }

//   static monthMath(date, val) {
//     let current = this.month(date);
//     let newMonth = current + val;

//     let dt = this.month(date, newMonth);
//     while (newMonth < 0) {
//       newMonth = 12 + newMonth;
//     }

//     // month rollover
//     if (this.month(dt) !== newMonth % 12) {
//       dt = this.date(dt, 0);
//     }

//     return dt;
//   }

//   static monthsInYear(year) {
//     let dt = moment().year(year).month(0).date(1);
//     return MONTHS.map((i) => this.month(dt, i));
//   }

//   static firstVisibleDay(date) {
//     let firstOfMonth = this.startOf(date, MONTH);
//     let firstOfWeek = this.startOf(
//       firstOfMonth,
//       WEEK,
//       firstOfMonth.localeData().firstDayOfWeek()
//     );

//     return this.merge(firstOfWeek, date);
//   }

//   static lastVisibleDay(date) {
//     let endOfMonth = this.endOf(date, MONTH);
//     let endOfWeek = this.endOf(
//       endOfMonth,
//       WEEK,
//       endOfMonth.localeData().firstDayOfWeek()
//     );

//     return this.merge(endOfWeek, date);
//   }

//   static visibleDays(date) {
//     let current = this.firstVisibleDay(date);
//     let last = this.lastVisibleDay(date);
//     let days = [];

//     while (this.lte(current, last, DAY)) {
//       days.push(current);
//       current = this.add(current, 1, DAY);
//     }

//     return days;
//   }

//   static ceil(date, unit) {
//     let floor = this.startOf(date, unit);

//     return this.eq(floor, date) ? floor : this.add(floor, 1, unit);
//   }

//   static range(start, end, unit = DAY) {
//     let current = start;
//     let days = [];

//     while (this.lte(current, end, unit)) {
//       days.push(moment(current));
//       current = this.add(current, 1, unit);
//     }

//     return days;
//   }

//   static merge(date, time) {
//     if (time == null && date == null) {
//       return null;
//     }

//     if (time == null) {
//       time = moment();
//     } else {
//       time = moment(time, "HH:mm:ss:SSS");
//     }
//     if (date == null) {
//       date = moment();
//     }

//     return this.startOf(date, DAY)
//       .hours(time.hours())
//       .minutes(time.minutes())
//       .seconds(time.seconds())
//       .milliseconds(time.milliseconds());
//   }

//   static eqTime(dateA, dateB) {
//     return (
//       this.hours(dateA) === this.hours(dateB) &&
//       this.minutes(dateA) === this.minutes(dateB) &&
//       this.seconds(dateA) === this.seconds(dateB)
//     );
//   }

//   static isJustDate(date) {
//     return (
//       this.hours(date) === 0 &&
//       this.minutes(date) === 0 &&
//       this.seconds(date) === 0 &&
//       this.milliseconds(date) === 0
//     );
//   }

//   static total(date, unit) {
//     let ms = moment(date).toDate().getTime();
//     let div = 1;

//     switch (unit) {
//       case WEEK:
//         div *= 7;
//         break;
//       case DAY:
//         div *= 24;
//         break;
//       case HOURS:
//         div *= 60;
//         break;
//       case MINUTES:
//         div *= 60;
//         break;
//       case SECONDS:
//         div *= 1000;
//         break;
//       default:
//         throw new TypeError(`Invalid units for 'total': "${unit}"`);
//     }

//     return ms / div;
//   }

//   static week(date) {
//     return moment(date).isoWeek();
//   }

//   static today() {
//     return this.startOf(moment(), DAY);
//   }

//   static yesterday() {
//     return this.add(this.startOf(moment(), DAY), -1, DAY);
//   }

//   static tomorrow() {
//     return this.add(this.startOf(moment(), DAY), 1, DAY);
//   }
// }
