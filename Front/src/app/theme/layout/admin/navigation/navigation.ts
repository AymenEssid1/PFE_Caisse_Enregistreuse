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
    title: 'SuperAdmin',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/admin/dashboard', // Add /admin before every URL
        icon: 'icon-bar-chart',
        classes: 'nav-item',
      },
      {
        id: 'establishments',
        title: 'Points de vente',
        type: 'collapse',
        icon: 'feather icon-home',
        classes: 'nav-item',
        
            children: [
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
             

            ],
        
      },
      {
        id: 'caissiers',
        title: 'Caissiers',
        type: 'item',
        url: '/admin/caissiers', // Add /admin before every URL
        icon: 'icon-users',
        classes: 'nav-item',
      },{
        id: 'stock',
        title: 'Stock',
        type: 'item',
        url: '/admin/stock', // Add /admin before every URL
        icon: 'icon-package',
        classes: 'nav-item',
      },{
        id: 'Produits Vendus',
        title: 'Produits Vendus',
        type: 'item',
        url: '/admin/soldproduct', // Add /admin before every URL
        icon: 'icon-shopping-cart',
        classes: 'nav-item',
      },{
        id: 'promotions',
        title: 'Promotions',
        type: 'item',
        url: '/admin/discounts', // Add /admin before every URL
        icon: 'icon-tag',
        classes: 'nav-item',
      },
      
      
    ],
  },
  {
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
  },
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
