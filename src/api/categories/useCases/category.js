const logger = console;

const getCategories = async (categoriesConfig) => {
  try {
    logger.info('Get categories', categoriesConfig);
    const categoriesResponse = [
      'hombre',
      'mujer',
      'niña',
      'niño',
      'niñxs',
      'unisex',
      'irezumi',
      'traditional',
      'tattoo-collection',
      'print-art',
      'cuadro',
      'sin-cuadro',
      'poleras',
      'polerones',
      'colorear',
      'remate',
      'liquidacion',
    ];

    return categoriesResponse;
  } catch (err) {
    throw new Error(`Can't create categories use cases: ${err.message}`);
  }
};

const createCategories = async (categoriesConfig) => {
  try {
    logger.info('Creating categories', categoriesConfig);
    const categoriesResponse = [
      'hombre',
      'mujer',
      'niña',
      'niño',
      'niñxs',
      'unisex',
      'irezumi',
      'traditional',
      'tattoo-collection',
      'print-art',
      'cuadro',
      'sin-cuadro',
      'poleras',
      'polerones',
      'colorear',
      'remate',
      'liquidacion',
    ];

    return categoriesResponse;
  } catch (err) {
    throw new Error(`Can't create categories use cases: ${err.message}`);
  }
};

const getCategoriesNavLinks = async () => {
  try {
    logger.info('Getting categories nav links use case');
    const categoriesConfigNavLinksResponse = [
      {
        menu_title: 'Home/ Inicio',
        path: '/',
        icon: 'home',
        child_routes: null,
      },
      {
        path: '/category/hombre',
        menu_title: 'Hombres',
        category_name: 'hombre',
        icon: 'arrow_right_alt',
        type: 'subMenu',
        child_routes: [
          {
            path: '/category/poleras',
            menu_title: 'Poleras',
            icon: 'arrow_right_alt',
            child_routes: null,
          },
          {
            path: '/category/polerones',
            menu_title: 'Polerones',
            icon: 'arrow_right_alt',
            child_routes: null,
          },
        ],
      },
      {
        path: '/category/mujer',
        menu_title: 'Mujeres',
        category_name: 'mujer',
        type: 'subMenu',
        icon: 'arrow_right_alt',
        child_routes: [
          {
            path: '/category/poleras',
            menu_title: 'Poleras',
            icon: 'arrow_right_alt',
            child_routes: null,
          },
          {
            path: '/category/polerones',
            menu_title: 'Polerones',
            icon: 'arrow_right_alt',
            child_routes: null,
          },
        ],
      },
      {
        path: '/category/niñxs',
        menu_title: 'Niñxs',
        category_name: 'niñx',
        icon: 'arrow_right_alt',
        type: 'subMenu',
        child_routes: [
          {
            path: '/category/poleras',
            menu_title: 'Poleras',
            icon: 'arrow_right_alt',
            child_routes: null,
          },
          {
            path: '/category/polerones',
            menu_title: 'Polerones',
            icon: 'arrow_right_alt',
            child_routes: null,
          },
          {
            path: '/category/colorear',
            menu_title: 'Colorear',
            icon: 'arrow_right_alt',
            child_routes: null,
          },
        ],
      },
      {
        path: '/category/print-art',
        menu_title: 'Print Art',
        category_name: 'print-art',
        icon: 'arrow_right_alt',
        type: 'subMenu',
        child_routes: [
          {
            path: '/category/cuadro',
            menu_title: 'Print Art Cuadro',
            icon: 'arrow_right_alt',
            child_routes: null,
          },
          {
            path: '/category/sin-cuadro',
            menu_title: 'Print Art Sin cuadro',
            icon: 'arrow_right_alt',
            child_routes: null,
          },
        ],
      },
      {
        path: '/category/remate',
        menu_title: 'Remates',
        category_name: 'remate',
        icon: 'arrow_right_alt',
        type: 'subMenu',
        child_routes: [
          {
            path: '/category/ofertas',
            menu_title: 'Ofertas',
            icon: 'arrow_right_alt',
            child_routes: null,
          },
          {
            path: '/category/liquidacion',
            menu_title: 'Liquidaciones',
            icon: 'arrow_right_alt',
            child_routes: null,
          },
        ],
      },

      {
        path: '/aboutus',
        menu_title: 'Quienes somos',
        icon: 'arrow_right_alt',
        child_routes: null,
      },
      {
        path: '/contactus',
        menu_title: 'Contáctanos',
        icon: 'arrow_right_alt',
        child_routes: null,
      },
    ];

    return categoriesConfigNavLinksResponse;
  } catch (err) {
    throw new Error(`Can't get categories nav links use cases: ${err.message}`);
  }
};
module.exports = { getCategories, createCategories, getCategoriesNavLinks };
