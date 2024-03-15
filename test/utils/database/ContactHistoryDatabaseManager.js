const config = require("../../../config");
const dbConnection = require("./dbConnection");

class ContactHistoryDatabaseManager {
  constructor(environment = config.environment, region = config.countryCode) {
    dbConnection.setDataBaseCreds("propertyDB", environment, region);
  }

  async insertContactHistoryListingEnquiry(
    email,
    agentId,
    listingId,
    messageStatus
  ) {
    let listing = listingId;
    if (listing == null) {
      listing = "0";
    }

    const columns =
      "agent_id, email, phone, message, enquiry_type, user_id, name, message_status, reference_id, listing_id, status_code, source";
    const values =
      agentId +
      ", '" +
      email +
      "', '90573893', 'Created for mobile automation', 'LIST', '" +
      agentId +
      "', 'Test Data Seed Agent', '" +
      messageStatus +
      "', " +
      "'" +
      listing +
      "','" +
      listing +
      "', 'SENT','mobile-test'";
    await dbConnection.insertToTable("contact_history", columns, values);
  }

  async cleanUpInbox() {
    await dbConnection.deleteToTable(
      "contact_history",
      "message",
      "Created for mobile automation"
    );
  }
}
module.exports = ContactHistoryDatabaseManager;
