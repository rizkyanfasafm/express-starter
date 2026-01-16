import dayjs from 'dayjs';

declare module 'dayjs' {
  interface Dayjs {
    toDateTimeString(): string;
    toDateString(): string;
    toTimeString(): string;
  }
}

dayjs.prototype.toDateTimeString = function () {
  return this.format('YYYY-MM-DD HH:mm:ss');
};

dayjs.prototype.toDateString = function () {
  return this.format('YYYY-MM-DD');
};

dayjs.prototype.toTimeString = function () {
  return this.format('HH:mm:ss');
};

export default dayjs;
