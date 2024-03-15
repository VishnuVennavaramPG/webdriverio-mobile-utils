const config = require("../../../config");
const dbConnection = require("./dbConnection");

class ListingDataBaseManager {
  constructor(environment = config.environment, region = config.countryCode) {
    dbConnection.setDataBaseCreds("propertyDB", environment, region);
  }

  async updateDraftListingCreationDate(listingId, date) {
    await dbConnection.updateTable(
      "listing",
      "created_date",
      `${date} 00:00:00`,
      `id='${listingId}' AND status_code='DRAFT' LIMIT 1`
    );
  }

  async getDraftListingId(agentId) {
    return dbConnection.getColumnValue(
      "id",
      "v_listing",
      `agent_id = '${agentId}' AND status_code='DRAFT'`,
      "id",
      true,
      1,
      "id"
    );
  }

  async updateListingStatus(listingId, status) {
    await dbConnection.updateTable(
      "listing",
      "status_code",
      status,
      `id='${listingId}' LIMIT 1`
    );
  }
}
module.exports = ListingDataBaseManager;
