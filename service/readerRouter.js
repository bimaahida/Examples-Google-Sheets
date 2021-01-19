const uuid = require('uuid');
const path = require('path');
const _ = require('lodash');

const GDocOAuth = require('../drivers/oauth');
const GDocSheet = require('../drivers/sheets');

const tokenJson = path.resolve(__dirname, '../config/token.json');
const gDocOAuth = new GDocOAuth(tokenJson);
const gDocSheet = new GDocSheet(gDocOAuth);

const SheetID = '1PSc1WZAPr_pUnQhu8k2qHzfap1LV7Uuf1g8YGUBoP4c';
const SheetName = 'Campaign List';

const parseRow = (arr, index) => {
  return shipment = {
    index,
    date: _.toString(arr[0]),
    day: _.toString(arr[1]),
    time: _.toString(arr[2]),
    campaign: _.toString(arr[3]),
    copy: _.toString(arr[4]),
    cta: _.toString(arr[5]),
    img: _.toString(arr[6]), 
    template: _.toString(arr[7])
  };
};

const executeReadGSheets = async() => {
  const tid = uuid.v4();
  try {
    const { sheets, err} = await gDocSheet.readValues(SheetID, `${SheetName}!A3:L`);

    if (err || !sheets.values) {
      console.error('Error', err.errors);

      return false;
    }

    const dataSheets = [];

    for (let i=0; i < sheets.values.length; i +=1 ) {
       const dataObject = parseRow(sheets.values[i], i);

       dataSheets.push(dataObject);
    }

    return dataSheets;
    
  } catch (err) {
    console.error('Error', err);

    return false;
  }
}

const executeWriteGSheets = async() => {
  const tid = uuid.v4();
  try {
    const { result } = await gDocSheet.writeValuesBatch(
      SheetID, 
      `${SheetName}!J3`, 
      ['success', 88, 10]
    );

    if (result.status !== 200) {
      return false;
    }

    return result.data;

  }catch(err) {
    console.error('Error', err);

    return false;
  }
}


module.exports = {
  executeReadGSheets,
  executeWriteGSheets
};