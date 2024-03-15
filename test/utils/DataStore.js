/**
 * This class acts as helper class for data transportation between different steps
 * and also to set and get values which are set at Suite and scenario level
 * All scenario level data will be cleared before every scenario which is set up in Hooks
 */
export default class DataStore {
  static suiteDataStore = new Map();
  static scenarioDataStore = new Map();

  static setValue(key, value) {
    this.scenarioDataStore.set(key, value);
  }

  static getValue(key) {
    return this.scenarioDataStore.get(key);
  }

  static getSuiteDataAsJson() {
    return JSON.stringify(Object.fromEntries(this.suiteDataStore));
  }

  static getScenarioDataAsJson() {
    return JSON.stringify(Object.fromEntries(this.scenarioDataStore));
  }

  static setSuiteValue(key, value) {
    this.suiteDataStore.set(key, value);
  }

  static getSuiteValue(key) {
    return this.suiteDataStore.get(key);
  }

  static clearScenarioData() {
    return this.scenarioDataStore.clear();
  }

  static clearSuiteData() {
    return this.suiteDataStore.clear();
  }

  static isPresent(key) {
    return this.scenarioDataStore.has(key);
  }

  static isPresentInSuiteData(key) {
    return this.suiteDataStore.has(key);
  }

  static setTestData(value) {
    this.setValue("TestDataTable", value);
  }

  static getTestData() {
    return this.getValue("TestDataTable");
  }

  static setAgentAdCreditBalance(value) {
    this.setValue("originalAdCreditBalance", value);
  }

  static getAgentAdCreditBalance() {
    return this.getValue("originalAdCreditBalance");
  }

  static setListingId(value) {
    this.setValue("ListingID", value);
  }

  static getListingId() {
    return this.getValue("ListingID");
  }

  static setAgentId(value) {
    this.setValue("AgentId", value);
  }

  static getAgentId() {
    return this.getValue("AgentId");
  }

  static setAgentEmail(value) {
    this.setValue("AgentEmail", value);
  }

  static getAgentEmail() {
    return this.getValue("AgentEmail");
  }
}
