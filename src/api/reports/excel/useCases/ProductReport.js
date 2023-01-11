const excel = require('exceljs');

module.exports = class Report {
  constructor(creator, rows, mapper) {
    this.mapper = mapper;
    this.rows = rows;
    this.creator = creator;
    this.workbook = new excel.Workbook();
    this.sheet = this.workbook.addWorksheet('Todo o Nada Sales');
  }

  setProperties() {
    this.workbook.creator = this.creator;
    this.workbook.lasModifiedBy = this.creator;
    this.workbook.created = new Date();
    this.workbook.modified = new Date();
    this.workbook.lastPrinted = new Date();
  }

  setViews() {
    this.workbook.views = [
      {
        x: 0,
        y: 0,
        width: 26000,
        height: 20000,
        firstSheet: 0,
        activeTab: 1,
        visibility: 'visible',
      },
    ];
  }

  setHeadersColumns() {
    this.sheet.columns = [
      { header: 'item Number', key: 'itemNumber', width: 10 },
      { header: 'SKU', key: 'sku', width: 10 },
      { header: 'Nombre', key: 'name', width: 25 },
      { header: 'Descripción', key: 'description', width: 35 },
      { header: 'Categorias', key: 'categories', width: 15 },
      { header: 'Tamaño', key: 'size', width: 13 },
      { header: 'Color', key: 'color', width: 10 },
      { header: 'Precio Venta', key: 'basePriceSales', width: 13 },
      { header: 'Precio Compra', key: 'basePriceReference', width: 13 },
      { header: 'Descuento', key: 'discount', width: 10 },
      { header: 'Stock', key: 'stock', width: 5 },
      { header: 'Tipo tamaño', key: 'productSizeType', width: 15 },
      { header: 'Images', key: 'images', width: 15 },
      { header: 'Is_active', key: 'isActive', width: 6 },
    ];
  }

  setRows() {
    try {
      this.rows.forEach((product) => {
        const actualProduct = product;
        product.details.forEach((detail) => {
          if (detail.sku) {
            const itemNumber = this.mapper.getItemNumber(actualProduct);
            const sku = this.mapper.getSKU(detail);
            const name = this.mapper.getName(actualProduct);
            const description = this.mapper.getDescription(actualProduct);
            const categories = this.mapper.getCategories(actualProduct);
            const size = this.mapper.getSize(detail);
            const color = this.mapper.getColor(actualProduct);
            const basePriceSales = this.mapper.getItemPrice(actualProduct);
            const basePriceReference =
              this.mapper.getBasePriceReference(actualProduct);
            const discount = this.mapper.getDiscount(actualProduct);
            const stock = this.mapper.getQuantity(detail);
            const productSizeType =
              this.mapper.getProductSizeType(actualProduct);
            const images = this.mapper.getImages(actualProduct);
            const is_active = this.mapper.getIsActive(actualProduct);
            this.sheet.addRow({
              itemNumber,
              sku,
              name,
              description,
              categories,
              size,
              color,
              basePriceSales,
              basePriceReference,
              discount,
              stock,
              discount,
              productSizeType,
              images,
              is_active,
            });
          }
        });
      });
    } catch (err) {
      console.log('Cant set Rows: ', err.message);
      throw new Error(`Cant set Rows: ${err.message}`);
    }
  }

  createReport() {
    this.setProperties();
    this.setViews();
    this.setHeadersColumns();
    this.setRows();
    return this.workbook;
  }
};
