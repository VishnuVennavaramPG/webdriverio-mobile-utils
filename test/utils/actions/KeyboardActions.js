import Base from "../Base";

/**
 * This file contains all methods to perform or mimic operations using keyboard/ unicode doing same.
 * We aim to have common methods in which we solve the operation for both iOS and Android
 */

const iOS = {
  keyReturn: "~Return",
  keyNext: "~Next",
  keySearch: "~Search",
};

const ANDROID_BACK_KEYCODE = 4;

export default class KeyboardActions extends Base {
  /**
   * This method is to submit a text/value by pressing return or done action of keyboard
   */
  static async keyboardActionEnterOrConfirm() {
    if (browser.isAndroid) {
      await browser.execute("mobile: performEditorAction", { action: "done" });
    } else {
      await $(iOS.keyReturn).click();
    }
  }

  /**
   * This method is to submit a text/value by pressing next action of keyboard
   */
  static async keyboardActionNext() {
    if (browser.isAndroid) {
      await browser.execute("mobile: performEditorAction", { action: "next" });
    } else {
      await $(iOS.keyNext).click();
    }
  }
  /**
   * This method is to submit a text/value by pressing search action of keyboard
   */
  static async keyboardActionSearch() {
    if (browser.isAndroid) {
      await browser.execute("mobile: performEditorAction", {
        action: "search",
      });
    } else {
      await $(iOS.keySearch).click();
    }
  }

  // TODO - Not validated. Moved from Base.js. Remove if not required
  async keyPadSearchClicked() {
    if (Base.getPlatform() === "ios") {
      await $("//*[@name='Search']").click();
    } else {
      await browser.execute("mobile: performEditorAction", { action: "done" });
    }
  }

  static async keyCodeActionAndroidBack() {
    await browser.pressKeyCode(ANDROID_BACK_KEYCODE);
  }
}
