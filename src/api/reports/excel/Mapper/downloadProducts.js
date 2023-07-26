const logger = console;

const getItemNumber = (product) => {
  const { itemNumber } = product;
  if (itemNumber === undefined) {
    logger.error('itemNumber undefined');
    return 0;
  }
  return itemNumber;
};

const getSKU = (detail) => {
  const { sku } = detail;
  if (!detail) {
    logger.error('detail sku undefined');
    return 0;
  }
  if (!sku) {
    logger.error('sku undefined');
    return 0;
  }
  return sku;
};

const getName = (product) => {
  const { name } = product;
  if (!name) {
    logger.error('name undefined');
    return '';
  }
  return name;
};

const getDescription = (product) => {
  const { description } = product;
  if (!description) {
    logger.error('description undefined');
    return '';
  }
  return description;
};

const getCategories = (product) => {
  const { category } = product;
  if (!category) {
    logger.error('category undefined');
    return '';
  }
  return category.join(',');
};

const getSize = (detail) => {
  if (!detail) {
    logger.error('detail undefined');
    return '';
  }
  if (!detail.size) {
    logger.error('detail size undefined');
    return '';
  }
  const size = detail.size;
  return size;
};

const getColor = (product) => {
  if (!product) {
    logger.error('product undefined');
    return '';
  }
  if (!product.color) {
    logger.error('product color undefined');
    return '';
  }
  const color = product.color;
  return color;
};

const getItemPrice = (product) => {
  const { price } = product;
  if (price === undefined) {
    throw new Error(`Invalid price`);
  }
  return price.basePriceSales;
};

const getBasePriceReference = (product) => {
  const { price } = product;
  if (price === undefined) {
    throw new Error(`Invalid price`);
  }
  return price.basePriceReference;
};

const getDiscount = (product) => {
  const { price } = product;
  if (price === undefined) {
    throw new Error(`Invalid price`);
  }
  return price.discount;
};

const getQuantity = (detail) => {
  const { stock } = detail;
  if (!detail) {
    return 0;
  }
  if (!stock) {
    return 0;
  }
  return stock;
};

const getProductSizeType = (product) => {
  const { productSizeType } = product;
  if (!product) {
    logger.error('product undefined');
    return '';
  }
  if (!productSizeType) {
    logger.error('productSizeType undefined');
    return '';
  }
  return productSizeType;
};

const getImages = (product) => {
  const { pictures } = product;
  if (!product) {
    return '';
  }
  if (!pictures) {
    return '';
  }
  return pictures.join(',');
};

const getIsActive = (product) => {
  const { is_active } = product;
  return is_active ? 'True' : 'False';
};

module.exports = {
  getItemNumber,
  getSKU,
  getName,
  getDescription,
  getCategories,
  getSize,
  getColor,
  getItemPrice,
  getBasePriceReference,
  getDiscount,
  getQuantity,
  getProductSizeType,
  getImages,
  getIsActive,
};
