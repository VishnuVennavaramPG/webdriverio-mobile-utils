/**
 * This file contains all methods to perform scrolling/swiping
 */
export default {
  /**
   * Scroll screen to a specific coordinates
   * Usually values passed are coming from element.getLocation() and element.getSize()
   * @param {*} startX - x coordinate starting point (e.g. 816.5)
   * @param {*} startY - y coordinate starting point (e.g. 432)
   * @param {*} endX - x coordinate ending point (e.g. 816.5)
   * @param {*} endY - y coordinate ending ppint  (e.g. 1920)
   */
  scrollScreenToDestination: async function (startX, startY, endX, endY) {
    await browser.performActions([
      {
        type: "pointer",
        id: "finger",
        parameters: { pointerType: "touch" },
        actions: [
          // move pointer to start point
          {
            type: "pointerMove",
            duration: 0,
            x: startX,
            y: startY,
          },
          // long press left mouse button
          { type: "pointerDown", button: 0 },
          // move pointer to expected end point
          {
            type: "pointerMove",
            duration: 600,
            x: endX,
            y: endY,
          },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
  },
  /**
   * This method is to be used when we want to swipe a portion of the screen
   * @param {*} direction - up, down, left, right
   * @param {*} heightPercentage - % of screen where we can start/stop
   */
  scrollScreen: async function (direction, percentage = 0.8) {
    const deviceWidth = (await browser.getWindowSize()).width * percentage;
    const deviceHeight = (await browser.getWindowSize()).height * percentage;
    let startX = deviceWidth / 2;
    let startY = deviceHeight / 2;
    let endX = deviceWidth / 2;
    let endY = deviceHeight / 2;

    switch (direction) {
      case "up":
        startY = deviceHeight;
        endY = deviceHeight * 0.2;
        break;
      case "down":
        startY = deviceHeight * 0.2;
        endY = deviceHeight;
        break;
      case "right":
        startX = deviceWidth * 0.2;
        endX = deviceWidth;
        break;
      case "left":
        startX = deviceWidth;
        endX = deviceWidth * 0.2;
        break;
      default:
        throw new Error("Invalid direction");
    }
    await console.log("Scrolling from ", startX, startY, " to ", endX, endY);
    await this.scrollScreenToDestination(startX, startY, endX, endY);
    await browser.pause(1000);
  },
  /**
   * Use it to swipe up until element is found
   * @param {*} element to find
   * @param {*} maxScrolls - maximum number of scroll to try to find element on screen
   * @param {*} heightPercentage - % of screen where we can start/stop
   */
  scrollUpUntilElementVisibleWithPercentage: async function (
    element,
    maxScrolls = 4,
    heightPercentage = 0.6
  ) {
    await this.scrollUpOrDownUntilElementVisibleWithPercentage(
      element,
      "up",
      maxScrolls,
      heightPercentage
    );
  },
  /**
   * Use it to swipe down until an element is found
   * @param {*} element to find
   * @param {*} maxScrolls - maximum number of scrolls to try to find an element on screen
   * @param {*} heightPercentage - % of screen where we can start/stop
   */
  scrollDownUntilElementVisibleWithPercentage: async function (
    element,
    maxScrolls = 4,
    heightPercentage = 0.6
  ) {
    await this.scrollUpOrDownUntilElementVisibleWithPercentage(
      element,
      "down",
      maxScrolls,
      heightPercentage
    );
  },
  /**
   * Use it to swipe up or down until element is found
   * @param {*} element to find
   * @param {*} maxScrolls - maximum number of scroll to try to find element on screen
   * @param {*} heightPercentage - % of screen where we can start/stop
   * @param {*} direction - up or down direction of swipe where to look for an element
   */
  scrollUpOrDownUntilElementVisibleWithPercentage: async function (
    element,
    direction,
    maxScrolls = 4,
    heightPercentage = 0.6
  ) {
    let elementLocator =
      typeof element === "string" ? await $(element) : element;
    let scrollTimes = 0;
    while (!(await elementLocator.isDisplayed()) && maxScrolls > scrollTimes) {
      await this.scrollScreen(direction, heightPercentage);
      scrollTimes += 1;
    }
  },
  /**
   * Swipe up until element is visible and click on the element
   * @param {*} element - element to find can be a test-id or a webdriverio element
   * @param {*} maxScrolls - maximum number of times to try to find element on screen
   * @param {*} heightPercentage - % of screen where we can start/stop
   * @param {*} timeout - wait until this time
   */
  scrollUpAndClickElement: async function (
    element,
    maxScrolls = 4,
    heightPercentage = 0.6
  ) {
    await this.scrollUpUntilElementVisibleWithPercentage(
      element,
      maxScrolls,
      heightPercentage
    );
    const elementLocator =
      typeof element === "string" ? await $(element) : element;
    await elementLocator.click();
  },
  /**
   * Only works for local run until saucelabs support appium 2.0 plugin
   * Use of gestures to scroll until element is visible on screen (using specific strategy)
   * @param {*} strategy xpath, id, name, class name, -ios predicate string, -ios class chain, accessibility id, css selector
   * @param {*} selector
   * @param {*} percentage % of screen where scroll will start
   */
  scrollElementIntoView: async function (
    strategy,
    selector,
    percentage = 0.4,
    maxScroll = 4
  ) {
    const scrollableView = browser.isAndroid
      ? await $("android.widget.ScrollView")
      : await $("XCUIElementTypeScrollView");
    if (strategy === "accessibility id") selector = selector.replace(/~/, "");
    const scrollMap = {
      scrollableView: scrollableView.elementId,
      strategy: strategy,
      selector: selector,
      percentage: percentage,
      direction: "up",
      maxCount: maxScroll,
    };
    await browser.execute("gesture: scrollElementIntoView", scrollMap);
  },
  /**
   * Only works for local run until saucelabs support appium 2.0 plugin
   * Combined scrollElementIntoView via accessibility id and clicking the element
   * @param {*} selector - element locator value
   * @param {*} heightPercentage - percentage of the screen where scrolling should start
   * @param {*} maxScroll - threshold on how many times scroll should happen
   */
  scrollViaAccessibilityIdAndClick: async function (
    selector,
    heightPercentage = 0.4,
    maxScroll = 4
  ) {
    await this.scrollElementIntoView(
      "accessibility id",
      selector,
      heightPercentage,
      maxScroll
    );
    await $(selector).click();
  },
  /**
   * Only works for local run until saucelabs support appium 2.0 plugin
   * Combined scrollElementIntoView via xpath and clicking the element
   * @param {*} xPathValue - element xpath value
   * @param {*} heightPercentage - percentage of the screen where scrolling should start
   * @param {*} maxScroll - threshold on how many times scroll should happen
   */
  scrollViaXpathAndClick: async function (
    xPathValue,
    heightPercentage = 0.4,
    maxScroll = 4
  ) {
    await this.scrollElementIntoView(
      "xpath",
      xPathValue,
      heightPercentage,
      maxScroll
    );
    await $(selector).click();
  },
  /**
   * Use it against a selector for page to scroll until it is found using appium TouchAction method
   * @param {*} maxScrolls - maximum number of scroll to try to find element on screen
   * @param {*} selector - any element selector we can pass this function to
   * @param {*} startY - pixel Location Y to start scroll from
   * @param {*} endY - pixel Location Y to end scroll to
   */
  scrollUntilElementVisibleByTouchAction: async function (
    selector,
    maxScrolls = 4,
    startY = 400,
    endY = 100
  ) {
    let scrollCount = 0;
    while (scrollCount < maxScrolls) {
      const element = await $(selector);
      if (await element.waitForDisplayed()) {
        return element;
      }
      // Scroll down using Appium's swipe gesture
      await driver.touchPerform([
        { action: "press", options: { x: 100, y: startY } },
        { action: "wait", options: { ms: 1000 } }, // Add a delay
        { action: "moveTo", options: { x: 100, y: endY } },
        { action: "release" },
      ]);
      scrollCount++;
    }
  },
  /**
   * Horizontal scroll to find an element
   * @param {*} scrollableElement
   * @param {*} elementToFind accessibility id or xpath
   * @param {*} direction left or right
   * @param {*} widthPercentage width percentage of the device where it'll end if scrolling right
   * @param {*} maxScroll threshold for the max number of scroll
   */
  async horizontalScrollUntilElementVisible(
    scrollableElement,
    elementToFind,
    direction = "left",
    maxScroll = 4,
    widthPercentage = 0.8
  ) {
    // get element position and size
    const startX = (await $(scrollableElement).getLocation())["x"];
    const elementSize = await $(scrollableElement).getSize();
    const width = elementSize["width"];
    const height = elementSize["height"];
    const y = (await $(scrollableElement).getLocation())["y"] + height / 2;
    let xdest;
    let scrollTimes = 0;

    while (!(await $(elementToFind).isDisplayed()) && scrollTimes < maxScroll) {
      if (direction === "left") {
        xdest = startX;
      } else if (direction === "right") {
        xdest = width * widthPercentage;
      }
      await this.scrollScreenToDestination(startX + width / 2, y, xdest, y);
      scrollTimes += 1;
    }
  },

  /**
   * Get element center point location
   * @param {*} elementSelector - locator of element to get the location
   * @returns {xPosition, yPosition} json object (e.g. { xPosition: 108.6, yPosition: 103.5 })
   */
  getElementLocation: async function (elementSelector) {
    const element = await $(elementSelector);
    const elementLocation = await element.getLocation();
    const elementSize = await element.getSize();
    const xPosition = elementLocation["x"] + elementSize["width"] / 2;
    const yPosition = elementLocation["y"] + elementSize["height"] / 2;
    return { xPosition: xPosition, yPosition: yPosition };
  },

  /**
   * Drag element1 to element2's position
   * @param {*} element1 - element selector to be moved
   * @param {*} element2 - element selector to be replaced
   */
  dragElement1ToElement2: async function (element1, element2) {
    const { xPosition: startX, yPosition: startY } =
      await this.getElementLocation(element1);
    const { xPosition: endX, yPosition: endY } = await this.getElementLocation(
      element2
    );
    await this.scrollScreenToDestination(startX, startY, endX, endY);
    await browser.pause(1000);
  },
};
