const { executeReadGSheets, executeWriteGSheets } = require('./service/readerRouter');

const result = async() => {
  try {
    const resRead = await executeReadGSheets();
    console.log('Result Read', resRead);

    const resWrite = await executeWriteGSheets();
    console.log('Result Write', resWrite);
  } catch (exception) {
    console.error('exception', exception);
  }
}

result();