const logger = console;

const getCategories = async (categoriesConfig) => {
  try {
    logger.info("Get categories", categoriesConfig);
    const categoriesResponse = [
      "accesorios",
      "bananos",
      "bandanas",
      "beanies",
      "colorear",
      "cuadro",
      "estuches",
      "gorros",
      "hombre",
      "irezumi",
      "liquidaciones",
      "marcos",
      "mujer",
      "niña",
      "niño",
      "niñxs",
      "parches",
      "pecheras",
      "pins",
      "poleras",
      "polerones",
      "print-art",
      "remate",
      "sin-cuadro",
      "snapbacks",
      "stickers",
      "tattoo-collection",
      "traditional",
      "unisex",
      "hardcore",
      "merch",
      "decohogart",
      "todo-o-nada-sergrafias",
    ].sort();

    return categoriesResponse;
  } catch (err) {
    throw new Error(`Can't create categories use cases: ${err.message}`);
  }
};

const createCategories = async (categoriesConfig) => {
  try {
    logger.info("Creating categories", categoriesConfig);
    // TODO: Generate the logic to receive the categoriesConfig and create the categories into DB
    const categoriesResponse = [
      "hombre",
      "mujer",
      "niña",
      "niño",
      "niñxs",
      "unisex",
      "irezumi",
      "traditional",
      "tattoo-collection",
      "print-art",
      "cuadro",
      "sin-cuadro",
      "poleras",
      "polerones",
      "colorear",
      "remate",
      "liquidaciones",
      "hardcore",
      "merch",
      "decohogart",
      "todo-o-nada-sergrafias",
    ];

    return categoriesResponse;
  } catch (err) {
    throw new Error(`Can't create categories use cases: ${err.message}`);
  }
};

const getCategoriesNavLinks = async () => {
  try {
    logger.info("Getting categories nav links use case");
    const categoriesConfigNavLinksResponse = [
      {
        menu_title: "Home/ Inicio",
        path: "/",
        icon: "home",
        child_routes: null,
      },
      {
        path: "/category/hombre",
        menu_title: "Hombres",
        category_name: "hombre",
        icon: "arrow_right_alt",
        type: "subMenu",
        child_routes: [
          {
            path: "/category/poleras",
            menu_title: "Poleras",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/polerones",
            menu_title: "Polerones",
            icon: "arrow_right_alt",
            child_routes: null,
          },
        ],
      },
      {
        path: "/category/mujer",
        menu_title: "Mujeres",
        category_name: "mujer",
        type: "subMenu",
        icon: "arrow_right_alt",
        child_routes: [
          {
            path: "/category/poleras",
            menu_title: "Poleras",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/polerones",
            menu_title: "Polerones",
            icon: "arrow_right_alt",
            child_routes: null,
          },
        ],
      },
      {
        path: "/category/niñxs",
        menu_title: "Niñxs",
        category_name: "niñxs",
        icon: "arrow_right_alt",
        type: "subMenu",
        child_routes: [
          {
            path: "/category/poleras",
            menu_title: "Poleras",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/polerones",
            menu_title: "Polerones",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/colorear",
            menu_title: "Colorear",
            icon: "arrow_right_alt",
            child_routes: null,
          },
        ],
      },
      {
        path: "/category/print-art",
        menu_title: "Print Art",
        category_name: "print-art",
        icon: "arrow_right_alt",
        type: "subMenu",
        child_routes: [
          {
            path: "/category/print-art",
            menu_title: "Print-Art",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/stickers",
            menu_title: "Stickers",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/marcos",
            menu_title: "Marcos",
            icon: "arrow_right_alt",
            child_routes: null,
          },
        ],
      },
      {
        path: "/category/accesorios",
        menu_title: "Accesorios",
        category_name: "accesorios",
        icon: "arrow_right_alt",
        type: "subMenu",
        child_routes: [
          {
            path: "/category/gorros",
            menu_title: "Gorros",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/snapbacks",
            menu_title: "Snapbacks",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/bandanas",
            menu_title: "Bandanas",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/beanies",
            menu_title: "Beanies",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/bananos",
            menu_title: "Bananos",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/estuches",
            menu_title: "Estuches",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/pecheras",
            menu_title: "Pecheras",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/parches",
            menu_title: "Parches",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/pins",
            menu_title: "Pins",
            icon: "arrow_right_alt",
            child_routes: null,
          },
        ],
      },
      {
        path: "/category/remate",
        menu_title: "Remate",
        category_name: "remate",
        icon: "arrow_right_alt",
        type: "subMenu",
        child_routes: [
          {
            path: "/category/ofertas",
            menu_title: "Ofertas",
            icon: "arrow_right_alt",
            child_routes: null,
          },
          {
            path: "/category/liquidaciones",
            menu_title: "Liquidaciones",
            icon: "arrow_right_alt",
            child_routes: null,
          },
        ],
      },
      {
        path: "/category/hardcore",
        menu_title: "Hardcore",
        category_name: "hardcore",
        icon: "arrow_right_alt",
        type: "subMenu",
        child_routes: [
          {
            path: "/category/hardcore/merch",
            menu_title: "Merch",
            icon: "arrow_right_alt",
            child_routes: null,
          },
        ],
      },
      {
        path: "/category/decohogar",
        menu_title: "DecohogART",
        icon: "arrow_right_alt",
        child_routes: null,
      },
      {
        path: "/category/todo-o-nada-sergrafias",
        menu_title: "Todo o Nada Serigrafías",
        icon: "arrow_right_alt",
        child_routes: null,
      },
      {
        path: "/aboutus",
        menu_title: "Quienes somos",
        icon: "arrow_right_alt",
        child_routes: null,
      },
      {
        path: "/contactus",
        menu_title: "Contáctanos",
        icon: "arrow_right_alt",
        child_routes: null,
      },
    ];

    return categoriesConfigNavLinksResponse;
  } catch (err) {
    throw new Error(`Can't get categories nav links use cases: ${err.message}`);
  }
};
module.exports = { getCategories, createCategories, getCategoriesNavLinks };
