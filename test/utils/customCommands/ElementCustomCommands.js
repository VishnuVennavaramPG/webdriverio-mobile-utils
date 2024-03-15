/**
 * This file contains all commands/methods to interact with elements
 * Use this as e.g: $(element).waitAndClick()
 */
module.exports = {
  waitAndClick: async function (timeout = 10000) {
    await this.waitForDisplayed({ timeout: timeout });
    await this.click();
  },
  waitAndSetValue: async function (value, timeout = 10000) {
    await this.waitForDisplayed({ timeout: timeout });
    await this.setValue(value);
  },
  /**
   * Wait for element to be displayed and get its text
   * @param {*} timeout
   */
  waitAndGetText: async function (timeout = 10000) {
    await this.waitForDisplayed({ timeout: timeout });
    return this.getText();
  },
  /**
   * Wait until element is displayed while page is refreshing without throwing any element not found exception and return true or false
   * @param {*} timeout max time to wait for element to get displayed
   * @return true if exist else false
   */
  waitForElementToBeVisible: async function (timeout = 10000) {
    await browser.waitUntil(async () => this.waitForDisplayed(), {
      timeout: timeout,
    });
    return this.waitForDisplayed();
  },
  /**
   * Wait until element is enabled while page is refreshing without throwing any element not found exception and return true or false
   * @param {*} reverse true if wait for element to be disabled else false
   * @param {*} timeout max time to wait for element to get displayed
   * @return true if exist else false
   */
  waitUntilElementIsEnabled: async function (reverse = false, timeout = 10000) {
    return browser.waitUntil(async () => (await this.isEnabled()) !== reverse, {
      timeout: timeout,
    });
  },
  /**
   * Wait until text is updated to the expected value while page is refreshing
   * @param {*} toValue updated value
   * @param {*} timeout max time to wait for text to change
   */
  waitForTextToUpdateAsValue: async function (toValue, timeout = 10000) {
    await browser.waitUntil(
      async () =>
        (await this.getText()).toLowerCase() === toValue.toLowerCase(),
      { timeout: timeout }
    );
  },
  /**
   * Use it against a selector to wait till element becomes invisible if visible for about 10000ms
   * @returns true if invisible and false if still visible
   */
  waitForElementInvisible: async function (timeout = 10000) {
    return await this.waitForDisplayed({
      timeout: timeout,
      reverse: true,
    });
  },
};
