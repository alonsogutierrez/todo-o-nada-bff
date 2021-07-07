const excel = require('exceljs');
const dateFns = require('date-fns');

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
      { header: 'Nº orden', key: 'numOrder', width: 20 },
      { header: 'Fecha venta', key: 'creationDate', width: 15 },
      { header: 'Cliente', key: 'clientNames', width: 20 },
      { header: 'Email', key: 'clientEmail', width: 30 },
      { header: 'Sub total order', key: 'subTotal', width: 15 },
      { header: 'Envío', key: 'shippingTotal', width: 5 },
      { header: 'Total order', key: 'total', width: 15 },
      { header: 'Item number', key: 'itemNumber', width: 10 },
      { header: 'SKU', key: 'sku', width: 10 },
      { header: 'Talla', key: 'size', width: 5 },
      { header: 'Precio unitario', key: 'itemPrice', width: 15 },
      { header: 'Cantidad', key: 'quantity', width: 10 },
      { header: 'Precio total', key: 'totalPrice', width: 10 },
    ];
  }

  setRows() {
    try {
      this.rows.forEach((order) => {
        const numOrder = this.mapper.getOrderNumber(order);
        const creationDate = this.mapper.getTransactionDate(order);
        const clientNames = this.mapper.getClientNames(order);
        const clientEmail = this.mapper.getClientEmail(order);
        const subTotal = this.mapper.getSubTotal(order);
        const shippingTotal = this.mapper.getShippingTotal(order);
        const total = this.mapper.getTotal(order);
        order.products.forEach((product) => {
          const itemNumber = this.mapper.getItemNumber(product);
          const sku = this.mapper.getSKU(product);
          const size = this.mapper.getSize(product);
          const itemPrice = this.mapper.getItemPrice(product);
          const quantity = this.mapper.getQuantity(product);
          const totalPrice = parseInt(itemPrice * quantity, 10);
          this.sheet.addRow({
            numOrder,
            creationDate,
            clientNames,
            clientEmail,
            subTotal,
            shippingTotal,
            total,
            itemNumber,
            sku,
            size,
            itemPrice,
            quantity,
            totalPrice,
          });
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
