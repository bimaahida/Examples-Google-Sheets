const fs = require('fs');
const { google } = require('googleapis');
const { promisify } = require('util');

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);

class GDocAuth {
  constructor(tokenJsonPath) {
    this.tokenJsonPath = tokenJsonPath;
  }

  async getOauthClient(
    scope = ['https://www.googleapis.com/auth/spreadsheets']
  ) {
    const fileExists = await exists(this.tokenJsonPath);

    if (!fileExists) throw new Error('Cannot read service account token');

    const tokenFile =  await readFile(this.tokenJsonPath);
    const token = JSON.parse(tokenFile);


    const jwtClient = new google.auth.JWT(
      token.client_email,
      null,
      token.private_key,
      scope
    );

    await jwtClient.authorize();

    return jwtClient
  }
}

module.exports = GDocAuth;