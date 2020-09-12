const UniqueIdentifiers = require('../../db/models/uniqueIdentifiers');
const ORDER_NUMBER_SERIAL_ID = process.env.ORDER_NUMBER_SERIAL_ID;

const logger = console;

exports.generateOrderId = async () => {
  return await generateSerialNumber(ORDER_NUMBER_SERIAL_ID);
};

async function generateSerialNumber(type) {
  console.log('type:', type);
  try {
    const counter = await UniqueIdentifiers.findOneAndUpdate(
      { _id: type },
      {
        $inc: { count: 1 },
        writeConcern: 'majority'
      },
      { new: true }
    );
    console.log('counter!!: ', counter);
    return counter.count;
  } catch (error) {
    logger.error(error.message, {
      action: 'generate-id',
      entity: 'orderBuilder',
      module: 'generateSerialNumber',
      type: type
    });
    throw new Error(error.message);
  }
}
