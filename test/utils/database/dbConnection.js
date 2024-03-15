const mysql = require("mysql");
const util = require("util");
const moment = require("moment");
const config = require("../../../config");

const dbCreds = {};
dbCreds.integration = {
  ads: {
    user: "ad_products",
    host: "integration-pg-db-masters.guruestate.com",
    database: "ad_products",
    password: "ad_products",
    port: 3306,
  },
  propertyDB: {
    sg: {
      user: "appuser",
      host: "integration-pg-db-masters.guruestate.com",
      database: "propertydb",
      password: "yAwh9^T#2#Zn",
      port: 3306,
    },
    my: {
      user: "appuser",
      host: "integration-hg-db-masters.guruestate.com",
      database: "propertydb_my",
      password: "yAwh9^T#2#Zn",
      port: 3306,
    },
    th: {
      user: "appuser",
      host: "integration-dd-db-masters.guruestate.com",
      database: "propertydb_th",
      password: "yAwh9^T#2#Zn",
      port: 3306,
    },
  },
};
dbCreds.staging = {
  ads: {
    user: "ad_products",
    host: "staging-pg-db-masters.guruestate.com",
    database: "ad_products",
    password: "QhGBF6WXkfbtKdBAEMjwjjfC",
    port: 3306,
  },
  propertyDB: {
    sg: {
      user: "appuser",
      host: "staging-pg-db-masters.guruestate.com",
      database: "propertydb",
      password: "yAwh9^T#2#Zn",
      port: 3306,
    },
    my: {
      user: "appuser",
      host: "staging-hg-db-masters.guruestate.com",
      database: "propertydb_my",
      password: "yAwh9^T#2#Zn",
      port: 3306,
    },
    th: {
      user: "appuser",
      host: "staging-dd-db-masters.guruestate.com",
      database: "propertydb_th",
      password: "yAwh9^T#2#Zn",
      port: 3306,
    },
  },
};

let connection;
let connectionDetails;

class DBConnection {
  setDataBaseCreds(dbType, environment, region) {
    connectionDetails = dbCreds[environment][dbType];
    if (region != null) {
      connectionDetails = connectionDetails[region.toLowerCase()];
    }
  }

  async connectDB() {
    connection = await mysql.createConnection(connectionDetails);
    await connection.connect(async function (err) {
      if (err) throw err;
      console.log("Successfully connected!");
    });
    connection.query = util.promisify(connection.query);
    return connection.status;
  }

  async updateTransactionEndDate(listingID) {
    const endDate = moment()
      .add("2", "minutes")
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");
    await this.updateTable(
      "transactions",
      "end_date",
      endDate,
      `listing_id=${listingID}`
    );
    const transactions = await this.executeSQL(
      `SELECT * FROM transactions where listing_id = ${listingID}`
    );
    return transactions;
  }

  async getColumnValue(
    field,
    tableName,
    whereClause,
    orderBy,
    isDescending,
    limit,
    key
  ) {
    const sqlStatement = await this.selectTable(
      field,
      tableName,
      whereClause,
      orderBy,
      isDescending,
      limit
    );
    return this.getKeyValueFromResult(sqlStatement, key);
  }

  async selectTable(
    fields,
    tableName,
    whereClause,
    orderBy,
    isDescending,
    limit
  ) {
    let sql = "select " + fields + " ";
    sql += "from " + tableName + " ";
    if (whereClause != null) {
      sql += "where " + whereClause;
    }
    if (orderBy != null) {
      sql += " order by " + orderBy + " ";
      if (isDescending === true) {
        sql += "desc ";
      }
    }
    if (limit > 0) {
      sql += "limit " + limit;
    }
    return sql.replace(";", "") + " ;";
  }

  async getKeyValueFromResult(sqlStatement, key) {
    const result = await this.executeSQL(sqlStatement);
    if (result.length > 0) {
      const value = await result.find(function (item) {
        return item[key] !== undefined;
      })[key];
      return value;
    }
    return null;
  }

  async updateTable(tableName, columnName, value, whereClause) {
    let sql = "UPDATE " + tableName + " ";
    sql += "set " + columnName + "='" + value + "' ";
    if (whereClause != null) {
      sql += "where " + whereClause;
    }
    await this.executeSQL(sql);
  }

  async insertToTable(tableName, columns, values) {
    let sql = "INSERT INTO " + tableName + " ";
    sql += "(" + columns + ") ";
    sql += "VALUES (" + values + " )";
    await this.executeSQL(sql);
  }

  async deleteToTable(tableName, column, value) {
    let sql = "DELETE FROM " + tableName + " ";
    sql += "where " + column + "='" + value + "'";
    await this.executeSQL(sql);
  }

  async executeSQL(sqlStatement) {
    let result;
    try {
      await this.connectDB();
      console.log("SQLSTATEMENT: ", sqlStatement);
      result = await connection.query(sqlStatement);
    } catch (e) {
      console.error("Error on updating table -- ", e);
    } finally {
      await connection.end(function (err) {
        if (err) throw err;
        console.log("DB connection closed!");
      });
    }
    console.log("Executed SQL!", JSON.parse(JSON.stringify(result)));
    return JSON.parse(JSON.stringify(result));
  }
}
module.exports = new DBConnection();
