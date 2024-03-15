const path = require("path");
const YAML = require("yamljs");

/**
 * Class for reading YAML files.
 */
class YamlReader {
  /**
   * Returns the contents of a YAML file as a JavaScript object.
   * The file path is constructed using the `path.resolve()` method, which takes in the current directory name (`__dirname`), goes up two levels (`"../.."`), and appends the file name.
   * The file name is determined based on the value of the environment variable `PRODUCT`. If it is equal to `"consumer"`, the file name is `assets/consumer-${country.toLowerCase()}.yaml`. Otherwise, it is `assets/pg-${country.toLowerCase()}.yaml`.
   * The `country` variable is set to the value of the environment variable `COUNTRY`, or `'us'` if it is not defined.
   * The contents of the file are then loaded using the `YAML.load()` method from the `yamljs` package.
   * @returns {Object} The contents of the YAML file as a JavaScript object.
   */
  static getAssets() {
    const country = (process.env.COUNTRY || "sg").toLowerCase();
    const product = process.env.PRODUCT;
    let filePath;
    if (product === "consumer") {
      filePath = path.resolve(
        __dirname,
        "../..",
        `assets/consumer-${country}.yaml`
      );
    } else {
      filePath = path.resolve(__dirname, "../..", `assets/pg-${country}.yaml`);
    }
    return YAML.load(filePath);
  }
  /**
   * Returns the value of the `AgentNet` property from the object returned by the `getAssets()` method.
   * @returns {*} The value of the `AgentNet` property.
   */
  static getAgentNet() {
    return this.getAssets().AgentNet;
  }
  /**
   * Returns the value of the `AgentNetCredentials` property from the object returned by the `getAssets()` method.
   * @returns {*} The value of the `AgentNetCredentials` property.
   */
  static getAgentNetCredentials() {
    return this.getAssets().AgentNetCredentials;
  }
  /**
   * Returns the value of the `AgentNetAdProducts` property from the object returned by the `getAssets()` method.
   * @returns {*} The value of the `AgentNetAdProducts` property.
   */
  static getAgentNetAdProducts() {
    return this.getAssets().AgentNetAdProducts;
  }
  /**
   * Returns the value of the `AgentNetDashboard` property from the object returned by the `getAssets()` method.
   * @returns {*} The value of the `AgentNetDashboard` property.
   */
  static getAgentNetDashboard() {
    return this.getAssets().AgentNetDashboard;
  }
  /**
   * Returns the value of the `AgentNetListingCreation` property from the object returned by the `getAssets()` method.
   * @returns {*} The value of the `AgentNetListingCreation` property.
   */
  static getAgentNetListingCreation() {
    return this.getAssets().AgentNetListingCreation;
  }
  /**
   * Returns the value of the `AgentNetLMP` property from the object returned by the `getAssets()` method.
   * @returns {*} The value of the `AgentNetLMP` property.
   */
  static getAgentNetLMP() {
    return this.getAssets().AgentNetLMP;
  }
  /**
   * Returns the value of the `PromoteListing` property from the object returned by the `getAssets()` method.
   * @returns {*} The value of the `AgentNetLMP` property.
   */
  static getAgentNetPromoteListing() {
    return this.getAssets().PromoteListing;
  }
  /**
   * Returns the value of the `FeaturedAgent` property from the object returned by the `getAssets()` method.
   * @returns {*} The value of the `FeaturedAgent` property.
   */
  static getAgentNetFeaturedAgent() {
    return this.getAgentNet().FeaturedAgent;
  }
  /**
   * Returns the value of the `Consumer` property from the object returned by the `getAssets()` method.
   * @returns {*} The value of the `Consumer` property.
   */
  static getConsumer() {
    return this.getAssets().Consumer;
  }
  /**
   * Returns the value of the `AgentNetARR` property from the object returned by the `getAssets()` method.
   * @returns {*} The value of the `AgentNetARR` property.
   */
  static getAgentNetARR() {
    return this.getAssets().AgentNetARR;
  }
}

module.exports = YamlReader;
