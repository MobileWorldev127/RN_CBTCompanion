import moment from "moment";

export const getMonthRange = (currentDate = new Date(), range = "month") => {
  currentDate = moment(currentDate);
  let year = currentDate.get("year");
  let month = currentDate.get("month") + 1;
  month = month < 10 ? `0${month}` : month;
  let startDate = `${year}-${month}-01`;
  let endDate = '';
  if (month === '01' || month === '03' || month === '05' || month === '07' || month === '08' || month === '10' || month === '12') {
    endDate = `${year}-${month}-31`;
  }
  else if(month === '02') {
    endDate = `${year}-${month}-28`;
  }
  else {
    endDate = `${year}-${month}-30`;
  }
  if (range == "year") {
    startDate = `${year}-01-01`;
    endDate = `${year}-12-31`;
  }
  if (range == "week") {
    endDate = currentDate.format("YYYY-MM-DD");
    startDate = currentDate.subtract(6, "days").format("YYYY-MM-DD");
  }
  console.log({
    startDate,
    endDate
  });
  return {
    startDate,
    endDate
  };
};

export function formatDateString(dateString, inputFormat, outputFormat) {
  let date = moment(dateString, inputFormat);
  return date.format(outputFormat);
}

export function isCurrentMonth(date) {
  return moment().format("M YYYY") === moment(date).format("M YYYY");
}

export function isFutureDate(date) {
  return moment().valueOf() < date.valueOf();
}
