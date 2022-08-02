/* global ProcessMaker*/
import { formatInTimeZone } from 'date-fns-tz';
import { format as formatDateFns } from 'date-fns';

// formatInTimeZone(new Date(), getTimezone());

const startsWithNumbers = /^\d{4}-/;

function getProcessMakerUserValue(key) {
  if (typeof ProcessMaker !== 'undefined' && ProcessMaker.user) {
    return ProcessMaker.user[key];
  }
}

export function getTimezone() {
  return getProcessMakerUserValue('timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getLang() {
  return getProcessMakerUserValue('lang') || 'en';
}

export function getUserDateFormat() {
  if (typeof ProcessMaker !== 'undefined' && ProcessMaker.user && ProcessMaker.user.datetime_format) {
    return ProcessMaker.user.datetime_format.replace(/[\sHh:msaAzZ]/g, '');
  }

  return 'MM/dd/yyyy';
}

export function getUserDateTimeFormat() {
  return getProcessMakerUserValue('datetime_format') || 'MM/dd/yyyy h:mm A';
}

export function isValidDate(date, format = getUserDateFormat()) {
  return formatDateFns(new Date(date), format);
}

export function formatIfDate(string) {
  let d;

  // Quick check for performance before calling date-fns
  if (!startsWithNumbers.test(string)) {
    return string;
  }

  d = new Date(string).toISOString;
  if (d.isValid()) {
    return formatDateFns(new Date(d), getUserDateTimeFormat());
  }
  
  d = formatDateFns(new Date(string), 'yyyy-MM-dd');
  if (d.isValid()) {
    return formatDateFns(new Date(d), getUserDateFormat());
  }

  return string;
}
