const config = require("../../../config");
/**
 * This is used to have all commands/methods that are related to the browser session and not related to elements
 * like scrolling, pause, swipe right, left etc. which are not related to elements
 */
module.exports = {
  waitAndSetValue: async function (element, value, timeout = 10000) {
    await $(element).waitForDisplayed({ timeout: timeout });
    await $(element).setValue(value);
  },
  waitAndClick: async function (element, timeout = 10000) {
    await $(element).waitForDisplayed({ timeout: timeout });
    await $(element).click();
  },
  /**
   * Wait for an element and get its text if its android and label for ios which is for a static element
   * @param {*} element
   * @param {*} timeout
   * @returns
   */
  waitAndGetText: async function (element, timeout = 10000) {
    await $(element).waitForDisplayed({ timeout: timeout });
    return browser.isAndroid
      ? $(element).getText()
      : $(element).getAttribute("label");
  },
  /**
   * Wait for an element and get its value for iOS and text for android - usually used for text field
   * @param {*} element
   * @param {*} timeout
   * @returns
   */
  waitAndGetValue: async function (element, timeout = 10000) {
    await $(element).waitForDisplayed({ timeout: timeout });
    return browser.isAndroid
      ? await $(element).getText()
      : await $(element).getValue();
  },
  executeClick: async function (element) {
    await browser.execute("mobile: tap", {
      x: 0,
      y: 0,
      element: $(element),
    });
  },
  /**
   * To provide location only access, this will handle popup of 'while using the app'
   */
  allowAccessToDeviceLocation: async function () {
    try {
      const allowWhileUsingApp = browser.isAndroid
        ? "//android.widget.Button[@text='While using the app']"
        : "//XCUIElementTypeButton[@name='Allow While Using App']";
      await $(allowWhileUsingApp).waitAndClick();
    } catch (err) {
      console.log("Location Media permission dialogue not displayed");
    }
  },
  /**
   * To deny turning on location access on the mobile by default, this will handle the popup of 'No, thanks'
   * which is about mobile settings permission.
   */
  denyTurnOnDeviceLocationServices: async function () {
    if (config.platform === "android") {
      try {
        const btnNoThanks = "//*[@text='No, thanks']|//*[@text='No thanks']";
        await $(btnNoThanks).waitAndClick();
        await $(btnNoThanks).waitAndClick();
      } catch (err) {
        console.log("'No thanks' popup not available for denial");
      }
    }
  },
  /**
   * To access any media like gallery etc, this will handle popup of 'Allow'
   */
  allowAccessToMedia: async function () {
    try {
      const allowWhileUsingApp = browser.isAndroid
        ? "//android.widget.Button[contains(@text, 'Allow')]"
        : "//XCUIElementTypeButton[@name='Allow Access to All Photos']";
      await $(allowWhileUsingApp).waitAndClick();
    } catch (err) {
      console.log("Media permission dialogue not displayed");
    }
  },
  /**
   * To allow notification access, this will handle popup of 'Allow'
   */
  allowNotificationAccess: async function () {
    try {
      const allowButton = browser.isAndroid
        ? "//android.widget.Button[@text='Allow']"
        : "~Allow";
      await browser.waitAndClick(allowButton, 3000);
    } catch (err) {
      console.log("Notification permission dialogue not displayed");
    }
  },
  /**
   * Due to the deprecation of browser.reset() on WDIO v8,
   * we have to create our own method to reset the app
   * This is used in Hooks.js
   */
  uninstallInstallApplication: async function () {
    const appPath = browser.capabilities.app;
    // app id needed for removeApp is app package for android and bundle id for ios
    const app = browser.isAndroid
      ? browser.capabilities.appPackage
      : browser.capabilities.bundleId;
    await browser.terminateApp(app);
    await browser.removeApp(app);
    await browser.installApp(appPath);
    await browser.pause(1000); // need to add a pause to complete installation
    await browser.activateApp(app);
    console.log("App reinstalled and opened ...");
    await browser.allowNotificationAccess();
  },
  /**
   * closing the app then re-open
   * terminate reloads the browser session to avoid conflict with old element id
   * This is used in Hooks.js
   */
  restartApp: async function () {
    // app id needed for terminateApp/activateApp is app package for android and bundle id for ios
    const app = browser.isAndroid
      ? browser.capabilities.appPackage
      : browser.capabilities.bundleId;
    await browser.terminateApp(app);
    await browser.activateApp(app);
    console.log("App restarted ...");
  },
  /**
   * Wait until at least 1 element is returned by get elements
   * @param {*} locator
   * @param {*} timeout
   */
  waitUntilAtLeastAnElementDisplayed: async function (
    locator,
    timeout = 10000
  ) {
    await browser.waitUntil(async () => (await $$(locator).length) > 1, {
      timeout: timeout,
    });
  },
  /**
   * To easily get scrollable view
   * @returns selector for scrollable view
   */
  async getHorizontalScrollableView() {
    return browser.isAndroid
      ? "//android.widget.HorizontalScrollView"
      : "//XCUIElementTypeScrollView";
  },
  /**
   * To check if test is running in SG
   * @returns true/false
   */
  isSG: function () {
    return config.country === "SG";
  },
  /**
   * To check if test is running in MY
   * @returns true/false
   */
  isMY: function () {
    return config.country === "MY";
  },
  /**
   * To check if test is running in TH
   * @returns true/false
   */
  isTH: function () {
    return ["DD", "DDE"].includes(config.country);
  },
  /**
   * To check if test is running in DD and not DDE
   * @returns true/false
   */
  isDD: function () {
    return config.country === "DD";
  },
  /**
   * To check if locale is in thai
   * @returns true/false
   */
  isEnLocale: function () {
    return ["SG", "MY", "DDE"].includes(config.country);
  },
  /**
   * To check if locale is in english
   * @returns true/false
   */
  isThLocale: function () {
    return config.country === "DD";
  },
  /**
   * To check if test is running for consumer
   * @returns true/false
   */
  isConsumer: function () {
    return config.product === "consumer";
  },
  /**
   * To check if test is running for agentnet
   * @returns true/false
   */
  isAgentnet: function () {
    return config.product === "agentnet";
  },
  /**
   * To get which environment test is running
   * @returns staging/integration
   */
  getEnvironment: function () {
    return config.environment;
  },
  /**
   * To get which locale test is running
   * @returns string
   */
  getLocale: function () {
    return this.isThLocale() ? "th" : "en";
  },
  /**
   * To get which region test is running
   * @returns true/false
   */
  getRegion: async function () {
    return this.isTH() ? "th" : config.country.toLowerCase();
  },
  /**
   * Tap by position's coordinate
   * @param {*} x - x coordinate of position (e.g. 816.5)
   * @param {*} y - y coordinate of position (e.g. 432)
   */
  tapByCoordinate: async function (x, y) {
    await browser.performActions([
      {
        type: "pointer",
        id: "finger",
        parameters: { pointerType: "touch" },
        actions: [
          // move pointer to coordinate
          {
            type: "pointerMove",
            duration: 0,
            x: x,
            y: y,
          },
          // press left mouse button
          { type: "pointerDown", button: 0 },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
  },
};
