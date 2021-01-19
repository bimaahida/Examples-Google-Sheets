const { google } = require('googleapis');
const { promisify } = require('util');

class GDocSheets {
  constructor(gDocAuth) {
    this.sheets = google.sheets({ version: 'v4' });
    this.gDocAuth = gDocAuth;
  }

  async readValues(spreadsheetId, range) {
    try {
      const sheetsAsync = promisify(
        this.sheets.spreadsheets.values.get
      ).bind(this.sheets);

      const jwt = await this.gDocAuth.getOauthClient();

      const result = await sheetsAsync({
        spreadsheetId,
        range,
        auth: jwt
      });

      return { sheets: result.data };
    }catch (err) {
      return { err };
    }
  }

  async writeValuesBatch(spreadsheetId, range, values) {
    try {
      const sheetsAsync = promisify(
        this.sheets.spreadsheets.values.batchUpdate
      ).bind(this.sheets);

      const jwt = await this.gDocAuth.getOauthClient();

      const result = await sheetsAsync({
        spreadsheetId,
        resource: {
          valueInputOption: "USER_ENTERED",
          data: [
            {
              majorDimension: "ROWS",
              range,
              values: [values]
            }
          ]
        },
        auth: jwt,
      });

      return { result };

    } catch (err) {
      return { err }
    }
  }
}

module.exports = GDocSheets;