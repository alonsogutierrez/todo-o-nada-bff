const UniqueIdentifiers = require('../../db/models/uniqueIdentifiers');
const ORDER_NUMBER_SERIAL_ID = process.env.ORDER_NUMBER_SERIAL_ID;

const logger = console;

exports.generateOrderId = async () => {
  try {
    return await generateSerialNumber(ORDER_NUMBER_SERIAL_ID);
  } catch (err) {
    throw new Error(`Can't generate serial number: ${err.message}`);
  }
};

async function generateSerialNumber(type) {
  try {
    logger.info('Generating orderNumber');
    const counter = await UniqueIdentifiers.findOneAndUpdate(
      { _id: type },
      {
        $inc: { count: 1 },
        writeConcern: 'majority'
      },
      { new: true }
    );
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
