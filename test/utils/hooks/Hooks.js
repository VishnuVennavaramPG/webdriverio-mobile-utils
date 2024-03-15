import { Before, After, AfterAll } from "@cucumber/cucumber";
import Base from "../Base";
import DataStore from "../DataStore";
import crypto from "crypto";
import YamlReader from "../YamlReader";
import config from "../../../config";
import cucumberJson from "wdio-cucumberjs-json-reporter";

const fs = require("fs");
const path = require("path");
const jsonpath = require("jsonpath");
const GAKeys = require("../segmentVerification/GALogFiles/Recorded/GAKeys.json");

const getImageFiles = function (location, imageFolderPath, files) {
  files.forEach((file) => {
    const filePath = imageFolderPath + `/${file}`;
    fs.readFile(filePath, (err2, data) => {
      browser.pushFile(location + file, data.toString("base64"));
    });
  });
};

const getVideoFiles = function (location, videoFolderPath, files) {
  files.forEach((file) => {
    const filePath = videoFolderPath + `/${file}`;
    let data = "";
    const stream = fs.createReadStream(filePath, "base64");
    stream.on("data", function (chunk) {
      data += chunk;
    });
    stream.on("end", function () {
      browser.pushFile(location + file, data);
    });
  });
};

const uploadImagesToDevice = function (type, location, imageFolderPath) {
  fs.readdir(imageFolderPath, (err, files) => {
    if (type === "video") {
      getVideoFiles(location, imageFolderPath, files);
    } else {
      getImageFiles(location, imageFolderPath, files);
    }
  });
};

const getGAKeys = function () {
  // Below is logic to store the session id of saucelabs for GA tests
  const devicePlatform = Base.getPlatform();
  Object.keys(GAKeys).forEach((key) => {
    if (key === browser.params.featureFile) {
      fs.readFile(
        "../segmentVerification/GALogFiles/Recorded/GAKeys.json",
        function (err, content) {
          const parseJson = JSON.parse(content);
          jsonpath.value(
            parseJson,
            `${key}.${devicePlatform}`,
            browser.sessionId
          );
          fs.writeFile(
            "../segmentVerification/GALogFiles/Recorded/GAKeys.json",
            JSON.stringify(parseJson, null, 2),
            function (err) {
              if (err) throw err;
            }
          );
        }
      );
    }
  });
};

async function tapLoginSelectLanguage() {
  const loginImage = "~test-login-bank-image";
  await $(loginImage).waitForEnabled({ timeout: 5000 });
  // TODO: enable ios selector for language selector
  if (browser.isAndroid) {
    const btnLanguageSelect = "~test-language-toggle-cta";
    await $(btnLanguageSelect).waitAndClick();
  } else {
    const deviceHeight = (await browser.getWindowSize()).height;
    const deviceWidth = (await browser.getWindowSize()).width;
    const languageSelectorYPosition = deviceHeight * 0.08;
    const languageSelectorXPosition = deviceWidth - deviceWidth * 0.1;
    await browser.pause(500); // need to add a quick pause to make sure coordinate is already clickable
    await browser.tapByCoordinate(
      languageSelectorXPosition,
      languageSelectorYPosition
    );
  }
}

const setTimezone = async function () {
  const timezoneFromAssets = YamlReader.getAgentNet()["timezone"];
  if (
    Base.getPlatform() === "android" &&
    process.env.IsCloud.toLowerCase() === "true"
  ) {
    if (Base.getCountryCode() === "TH") {
      await browser.execute("mobile:shell", {
        command: `su root service call alarm 3 s16 ${timezoneFromAssets}`,
      });
    } else {
      await browser.execute("mobile:shell", {
        command: `su root service call alarm 3 s16 ${timezoneFromAssets.replace(
          "Asia/",
          ""
        )}`,
      });
    }
  }
};

/**
 * Clear all data stored at scenario level before a scenario starts
 */
Before(async () => {
  console.log("Before Hook is being executed");
  DataStore.clearScenarioData();
  await browser.allowNotificationAccess();
});

Before("@agentnet and not @deeplink", async () => {
  console.log(
    "Before Hook with conditions '@agentnet and not @deeplink' is executed"
  );
  await Base.openDeepLink();
  const debugSaveButton = "~test-debug-mode-save";
  const integrationButton = "~test-debug-mode-screen-env-Integration";
  await setTimezone();
  if (Base.getEnvironment() === "integration") {
    await $(integrationButton).click();
  }
  await browser.waitAndClick(debugSaveButton, 10000);

  if (Base.getCountry() === "DDE") {
    const enSelector = "~test-change-language_item_en";
    await tapLoginSelectLanguage();
    await browser.waitAndClick(enSelector);
  }
});

Before("@agentnet and @deeplink", () => {
  console.log("Logging in via deeplink...");
  setTimezone();
});

function toggleLocationServiceOnMobile() {
  if (Base.getPlatform() === "android") {
    browser.toggleLocationServices();
  }
}

Before("@setLocation", () => {
  console.log("Before hook for @setLocation is executed ....");
  toggleLocationServiceOnMobile();
});

// This tag is to disable auto-accept of ios native alert for tests which needs to enter specific pop-up scenario flow
Before("@disableAutoAcceptAlert", async () => {
  // autoAcceptAlert appium config is only added for ios
  if (browser.isIOS) {
    console.log("Before hook to disable auto-accept of ios native alert");
    await browser.updateSettings({ defaultAlertAction: "" });
  }
});

function logSauceLabsReportLink() {
  const auth = crypto
    .createHmac(
      "md5",
      `${config.saucelabConfig.user}:${config.saucelabConfig.key}`
    )
    .update(browser.sessionId)
    .digest("hex");
  return `https://app.saucelabs.com/tests/${browser.sessionId}?auth=${auth}`;
}

/** Execution of after hooks is based on reverse order */

// Agentnet will always do hard reset to clear up the session since login is required
After("@agentnet or @hardResetApp", async () => {
  console.log("After hook with Agentnet HardResetApp is being executed .....");
  await browser.uninstallInstallApplication();
  // adding a reload only for saucelabs run since there are cases where the session closes after a failure
  if (!(process.env.IsCloud.toLowerCase() === "true")) {
    await browser.reloadSession();
  }
});

// When hard reset is done there is no need for restarting the app
After("not @agentnet and not @hardResetApp", async () => {
  console.log(
    "After hook to restart app is being executed for not Agentnet and not HardResetApp....."
  );
  await browser.restartApp();
});

After(async (scenario) => {
  console.log("After Hook to log all data in report is being executed ....");

  // Log all test data into a report
  cucumberJson.attach(DataStore.getScenarioDataAsJson(), "application/json");
  cucumberJson.attach(DataStore.getSuiteDataAsJson(), "application/json");

  // Attaching a link of sauce labs test report
  if (process.env.IsCloud.toLowerCase() === "true") {
    cucumberJson.attach(
      JSON.stringify({ sauceLabURL: logSauceLabsReportLink() }),
      "application/json"
    );
  }

  // Capture exception on failure
  if (scenario.result.status !== "PASSED") {
    console.log("ERROR SCREENSHOT CAPTURED");
    cucumberJson.attach(
      JSON.stringify(scenario.result.exception),
      "application/json"
    );

    // If a screenshot is visible properly on a pipeline, then download the zip report to see images
    cucumberJson.attach(await browser.takeScreenshot(), "image/png");
  }
});

After("@GA and @agentnet and @smoke", () => getGAKeys());

Before("@mediaUpload", () => {
  console.log("Uploading Needed Media...");
  const imageFolder = path.resolve(__dirname, "../media") + "/";
  let location = "";
  if (Base.getPlatform() === "android") {
    location = "/sdcard/DCIM/Camera/";
  }
  browser.call(() => {
    uploadImagesToDevice("photo", location, imageFolder + "photos");
    uploadImagesToDevice("video", location, imageFolder + "video");
  });
});

/*
BeforeAll(async () => {
  console.log("BeforeAll hook is executing");
});
*/

AfterAll(async () => {
  DataStore.clearSuiteData();
});
