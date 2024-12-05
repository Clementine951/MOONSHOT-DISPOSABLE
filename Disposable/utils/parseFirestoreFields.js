export default function parseFirestoreFields(fields) {
    const parsedData = {};
    for (const key in fields) {
      const value = fields[key];
      if (value.hasOwnProperty('stringValue')) {
        parsedData[key] = value.stringValue;
      } else if (value.hasOwnProperty('integerValue')) {
        parsedData[key] = value.integerValue;
      } else if (value.hasOwnProperty('booleanValue')) {
        parsedData[key] = value.booleanValue;
      } else if (value.hasOwnProperty('timestampValue')) {
        parsedData[key] = value.timestampValue;
      } else {
        parsedData[key] = value; // Default fallback
      }
    }
    return parsedData;
  }
  