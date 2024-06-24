import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'SuperAdmin',
    title: 'Admin',
    type: 'group',
    icon: 'icon-navigation',
    children: [
     
      {
        id: 'stats',
        title: 'Dashboard',
        type: 'item',
        url: '/admin/stats', // Add /admin before every URL
        icon: 'fa-solid fa-chart-line',
        classes: 'nav-item',
      },
      {
        id: 'establishments',
        title: 'Points de vente',
        type: 'item',
        icon: 'fa-solid fa-shop',
        classes: 'nav-item',
        url: '/admin/establishments'

       /* children: [
          {
            id: 'establishments',
            title: 'Points de vente',
            type: 'item',
            url: '/admin/establishments',
          },
          {
            id: 'addestab',
            title: 'Formulaire Point de vente',
            type: 'item',
            url: '/admin/addestablishments', // Add /admin before every URL
          },


        ],*/

      },
      {
        id: 'caissiers',
        title: 'Caissiers',
        type: 'item',
        url: '/admin/caissiers', // Add /admin before every URL
        icon: 'fa-solid fa-users-gear',
        classes: 'nav-item',
      },
      


    ],
  },
  {
    id: 'Gérant',
    title: 'Gérant',
    type: 'group',
    icon: 'icon-ui',
    children: [

      {
        id: 'stock',
        title: 'Stock',
        type: 'item',
        url: '/admin/stock',
        icon: 'fa-solid fa-warehouse',
        classes: 'nav-item',


      },




      {
        id: 'Produits Vendus',
        title: 'Produits Vendus',
        type: 'item',
        url: '/admin/sold', // Add /admin before every URL
        icon: 'fa-solid fa-basket-shopping',
        classes: 'nav-item',
      }, 
      {
        id: 'combos',
        title: 'Combos',
        type: 'item',
        url: '/admin/combo', // Add /admin before every URL
        icon: 'fa-solid fa-boxes-stacked',
        classes: 'nav-item',
      },
      {
        id: 'promotions',
        title: 'Promotions',
        type: 'item',
        url: '/admin/discount', // Add /admin before every URL
        icon: 'fa-solid fa-tag',
        classes: 'nav-item',
      }
    ]
  },
  {
    id: 'Caissier',
    title: 'Caissier',
    type: 'group',
    icon: 'icon-ui',
    children: [
   
      {
        id: 'session',
        title: 'Caisse',
        type: 'item',
        url: '/admin/session', // Add /admin before every URL
        icon: 'fa-solid fa-cash-register',
        classes: 'nav-item',
      },
      
    ]
  },
  /*{
    id: 'ui-element',
    title: 'UI ELEMENT',
    type: 'group',
    icon: 'icon-ui',
    children: [
      {
        id: 'basic',
        title: 'Component',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'button',
            title: 'Button',
            type: 'item',
            url: '/admin/basic/button', // Add /admin before every URL
          },
          {
            id: 'badges',
            title: 'Badges',
            type: 'item',
            url: '/admin/basic/badges', // Add /admin before every URL
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Breadcrumb & Pagination',
            type: 'item',
            url: '/admin/basic/breadcrumb-paging', // Add /admin before every URL
          },
          {
            id: 'collapse',
            title: 'Collapse',
            type: 'item',
            url: '/admin/basic/collapse', // Add /admin before every URL
          },
          {
            id: 'tabs-pills',
            title: 'Tabs & Pills',
            type: 'item',
            url: '/admin/basic/tabs-pills', // Add /admin before every URL
          },
          {
            id: 'typography',
            title: 'Typography',
            type: 'item',
            url: '/admin/basic/typography', // Add /admin before every URL
          },
        ],
      },
    ],
  },
  {
    id: 'forms',
    title: 'Forms & Tables',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'forms-element',
        title: 'Form Elements',
        type: 'item',
        url: '/admin/forms/basic', // Add /admin before every URL
        classes: 'nav-item',
        icon: 'feather icon-file-text',
      },
      {
        id: 'tables',
        title: 'Tables',
        type: 'item',
        url: '/admin/tables/bootstrap', // Add /admin before every URL
        classes: 'nav-item',
        icon: 'feather icon-server',
      },
    ],
  },
  {
    id: 'chart-maps',
    title: 'Chart',
    type: 'group',
    icon: 'icon-charts',
    children: [
      {
        id: 'apexChart',
        title: 'ApexChart',
        type: 'item',
        url: '/admin/apexchart', // Add /admin before every URL
        classes: 'nav-item',
        icon: 'feather icon-pie-chart',
      },
    ],
  },
  
  {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    icon: 'icon-pages',
    children: [
      {
        id: 'auth',
        title: 'Authentication',
        type: 'collapse',
        icon: 'feather icon-lock',
        children: [
          {
            id: 'signup',
            title: 'Sign up',
            type: 'item',
            url: '/admin/auth/signup', // Add /admin before every URL
            target: true,
            breadcrumbs: false,
          },
          {
            id: 'signin',
            title: 'Sign in',
            type: 'item',
            url: '/admin/auth/signin', // Add /admin before every URL
            target: true,
            breadcrumbs: false,
          },
        ],
      },
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/admin/sample-page', // Add /admin before every URL
        classes: 'nav-item',
        icon: 'feather icon-sidebar',
      },
      {
        id: 'disabled-menu',
        title: 'Disabled Menu',
        type: 'item',
        url: 'javascript:',
        classes: 'nav-item disabled',
        icon: 'feather icon-power',
        external: true,
        
      },
      {
        id: 'buy_now',
        title: 'Buy Now',
        type: 'item',
        icon: 'feather icon-book',
        classes: 'nav-item',
        url: 'https://codedthemes.com/item/datta-able-angular/',
        target: true,
        external: true,
      },
    ],
  },*/
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
