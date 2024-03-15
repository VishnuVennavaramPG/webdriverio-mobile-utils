import moment from "moment/moment";
import _ from "lodash";
import { PhoneNumberUtil } from "google-libphonenumber";

/**
 * This file contains common methods like random number, random name which is to support test data
 */
export default {
  /**
   * Get a random number with given length
   * @param {*} length
   * @returns
   */
  randomNumberBasedOnLength: (length) => {
    return (
      Math.floor(Math.random() * Math.pow(10, length - 1)) +
      Math.pow(10, length - 1)
    );
  },

  /**
   * Generate a random email address
   * @returns
   */
  getRandomEmailAddress: function () {
    const email =
      "mobile" +
      moment().format("YYYYMMDDHHmmss") +
      _.random(100, 999) +
      "@propertyguru.com";
    console.log("Email address : " + email);
    return email;
  },
  /**
   * Generate basic mobile, excluding country code
   * Generation rule for different marketplaces:
   * SG: 85xx xxxx
   * MY: 010-2XX XXXX
   * TH: 02xxx xxxx
   * @param {*} region
   * @returns
   */
  generateRandomMobileNumber: function (region) {
    const phoneUtil = PhoneNumberUtil.getInstance();
    let mobileNumber;
    let iter = 0;
    do {
      switch (region) {
        case "sg":
          mobileNumber = "85";
          mobileNumber += this.randomNumberBasedOnLength(6);
          break;
        case "my":
          mobileNumber = "0102";
          mobileNumber += this.randomNumberBasedOnLength(6);
          break;
        case "th":
          mobileNumber = "02";
          mobileNumber += this.randomNumberBasedOnLength(7);
          break;
        default:
          console.log("Region provided is not in the list");
          break;
      }
      iter++;
    } while (
      !phoneUtil.isValidNumberForRegion(
        phoneUtil.parse(mobileNumber, region.toUpperCase()),
        region.toUpperCase()
      ) &&
      iter < 5
    );
    console.log("GENERATED MOBILE NUMBER:" + mobileNumber);
    return mobileNumber;
  },
  /**
   * Convert given price in string to integer (e.g. 1,700 -> 1700)
   * @param {*} price
   * @returns integer
   */
  convertPriceInStringToInt: function (price) {
    return parseInt(price.replace(/,/gi, ""), 10);
  },
  /**
   * Convert given price in integer to string (e.g. 1700 -> 1,700)
   * @param {*} price
   * @returns string
   */
  convertPriceInIntToString: function (price) {
    if (typeof price === "string") {
      price = parseInt(price, 10);
    }
    return price.toLocaleString();
  },
};
