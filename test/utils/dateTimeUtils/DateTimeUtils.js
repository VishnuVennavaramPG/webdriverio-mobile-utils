import moment from "moment-timezone";
import Base from "../Base";

/**
 * This class acts as a utility to maintain all date and time related methods.
 */
export default class DateTimeUtils {
  async getCurrentDateTime() {
    // Get the current time
    const currentTime = new Date();

    // Format the current time as a string in the format 'YYYYMMDDHHmmss'
    const formattedTime = currentTime
      .toISOString()
      .replace(/[-:T]/g, "")
      .slice(0, 14);

    // Return the formatted time
    return formattedTime;
  }

  async getEmailAddresOnTimeStamp() {
    try {
      return `Automation_${await this.getCurrentDateTime()}@propertyguru.com`;
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }
  /**
   * Getting date based on timezone and number of days to add to today's date
   * @param {*} timezone
   * @param {*} noOfDays
   * @returns string DD MMM YYYY (e.g. 03 Aug 2023)
   */
  static getDateWithTimeZone(timezone, noOfDays) {
    return this.getDateAfterAddingDaysAndFormat(
      timezone,
      noOfDays,
      "DD MMM YYYY"
    );
  }

  /**
   * Getting date based on timezone and number of days to add to today's date
   * @param {*} timezone
   * @param {*} daysToAdd
   * @returns string day (e.g. Monday)
   */
  static getDay(timezone, daysToAdd) {
    if (Base.getCountry() === "DD") {
      return moment
        .tz(timezone)
        .locale("th")
        .add(daysToAdd, "d")
        .format("dddd");
    }
    return moment.tz(timezone).add(daysToAdd, "d").format("dddd");
  }

  /**
   * Get today's date in specific format
   * refer to https://momentjs.com/docs/ for available format
   * Already handles TH date
   * @param {*} timezone
   * @param {*} format
   * @returns string date in given format
   */
  static getCurrentDateWithFormat(timezone, format) {
    const currentDateAndTime = moment.tz(timezone);
    if (Base.getCountry() === "DD") {
      return currentDateAndTime.locale("th").add("543", "y").format(format);
    }
    return currentDateAndTime.format(format);
  }
  /**
   * Get today's date and time
   * @param {*} timezone
   * @param {*} unitOfTime
   * @returns string MMM YYYY, HH:mm (e.g. 03 Aug 2023, 13:30)
   */
  static getCurrentDateAndTime(timezone, unitOfTime) {
    return (
      this.getCurrentDateWithFormat(timezone, "DD MMM YYYY, HH:mm") +
      ` ${unitOfTime}`
    );
  }
  /**
   * Get date after adding x number of days to today's date
   * Already handles TH date
   * @param {*} timezone
   * @param {*} noOfDays
   * @param {*} format
   * @returns string in given format
   */
  static getDateAfterAddingDaysAndFormat(timezone, noOfDays, format) {
    const addedDaysDateAndTime = moment.tz(timezone).add(noOfDays, "d");
    if (Base.getCountry() === "DD") {
      return addedDaysDateAndTime.locale("th").add("543", "y").format(format);
    }
    return addedDaysDateAndTime.format(format);
  }

  /**
   * Get date after subtracting x number of days to today's date
   * Already handles TH date
   * @param {*} timezone
   * @param {*} noOfDays
   * @param {*} format
   * @returns string in given format
   */
  static getDateAfterDeductingDaysAndFormat(timezone, noOfDays, format) {
    const subtractedDaysDateAndTime = moment
      .tz(timezone)
      .subtract(noOfDays, "d");
    if (Base.getCountry() === "DD") {
      return addedDaysDateAndTime.locale("th").add("543", "y").format(format);
    }
    return subtractedDaysDateAndTime.format(format);
  }

  /**
   * Get date 1 year from today
   * @param {*} format
   * @returns
   */
  static getDateAYearFromToday(format = "DD MMM YYYY") {
    return moment().add(1, "y").format(format);
  }

  /**
   * Add days to a given date and return a formated date value
   * @param {*} originalDate
   * @param {*} originalDateFormat - example: DD MMM YYYY
   * @param {*} timezone
   * @param {*} noOfDays
   * @param {*} format
   * @returns
   */
  static addDaysToDate(
    originalDate,
    originalDateFormat = "DD-MM-YYYY",
    timezone,
    noOfDays,
    format
  ) {
    const addedDaysDateAndTime = moment(originalDate, originalDateFormat)
      .tz(timezone)
      .add(noOfDays, "d");
    if (Base.getCountry() === "DD") {
      return addedDaysDateAndTime.locale("th").add("543", "y").format(format);
    }
    return addedDaysDateAndTime.format(format);
  }

  /**
   * Get date together with time after adding x number of days to today's date
   * @param {*} timezone
   * @param {*} noOfDays
   * @param {*} unitOfTime
   * @returns string MMM YYYY, HH:mm hrs (e.g. 03 Aug 2023, 13:30 hrs)
   */
  static getDateAndTimeAfterAddingDays(timezone, noOfDays, unitOfTime) {
    return (
      this.getDateAfterAddingDaysAndFormat(
        timezone,
        noOfDays,
        "DD MMM YYYY, HH:mm"
      ) + ` ${unitOfTime}`
    );
  }

  /**
   * Check if time difference between 2 date time is less than given threshold
   * Locale is required to ensure correct time difference is calculated
   * based on different locale (specifically for Thai date)
   * @param {*} dateTime1 - format DD MMM YYYY, HH:mm
   * @param {*} dateTime2 - format DD MMM YYYY, HH:mm
   * @param {*} dateLocale - en|th
   * @param {*} unitOfTime - hrs or mins
   * @param {*} thresholdTime - max time difference in minutes (default 2 minutes)
   * @returns boolean true if time difference is less than thresholdTime
   */
  static isTimeDifferenceLessThanThreshold(
    dateTime1,
    dateTime2,
    dateLocale,
    unitOfTime,
    thresholdTime = 2
  ) {
    moment.locale(dateLocale);
    moment.localeData(dateLocale);
    console.log(
      "Comparing time difference between:" + dateTime1 + " and " + dateTime2
    );
    dateTime1 = dateTime1.replace(unitOfTime, "");
    dateTime2 = dateTime2.replace(unitOfTime, "");
    let timeDiffer = moment(dateTime1, "DD MMM YYYY, HH:mm", dateLocale).diff(
      moment(dateTime2, "DD MMM YYYY, HH:mm", dateLocale),
      "minutes"
    );
    return timeDiffer < thresholdTime;
  }
}
