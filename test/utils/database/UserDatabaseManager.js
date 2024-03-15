const config = require("../../../config");
const dbConnection = require("./dbConnection");

class UserDatabaseManager {
  constructor(environment = config.environment, region = config.countryCode) {
    dbConnection.setDataBaseCreds("propertyDB", environment, region);
  }

  async getUserToken(email) {
    return dbConnection.getColumnValue(
      "validation_token",
      "user_registration",
      `email = '${email}' `,
      "id",
      true,
      4,
      "validation_token"
    );
  }
}

module.exports = UserDatabaseManager;
