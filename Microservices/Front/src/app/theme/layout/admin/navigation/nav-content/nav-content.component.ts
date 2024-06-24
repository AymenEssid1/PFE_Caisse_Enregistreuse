// angular import
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';

// project import
import { NavigationItem } from '../navigation';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss'],
})
export class NavContentComponent implements OnInit {
  // public props
  title = 'Demo application for version numbering';
 // currentApplicationVersion = environment.appVersion;
  @Output() onNavCollapsedMob = new EventEmitter();
  navigation: any;
  windowWidth: number;

  // constructor
  constructor(
    public nav: NavigationItem,
    private location: Location,
  ) {
    this.windowWidth = window.innerWidth;
    this.navigation = this.nav.get();
  }
//ROLE CONTROL
  
  removeItembyrole (): void {

    const roles = JSON.parse(localStorage.getItem('roles'));

    // Check if roles include ADMIN
    const isAdmin = roles.includes('ADMIN');
    const isCaissier=roles.includes('Caissier');
    const isGérant=roles.includes('Gérant');
    const isDev=roles.includes('Developper');
    

    if (!isDev) {
      this.navigation = this.navigation.filter(item => item.id !== 'forms');
      this.navigation = this.navigation.filter(item => item.id !== 'pages');
      this.navigation = this.navigation.filter(item => item.id !== 'chart-maps');
      this.navigation = this.navigation.filter(item => item.id !== 'ui-element');

      

      
    } 
    // If not admin, filter out the SuperAdmin item
    if (!isAdmin) {
      this.navigation = this.navigation.filter(item => item.id !== 'SuperAdmin');
      
    } 
     if(!isGérant) {
      this.navigation = this.navigation.filter(item => item.id !== 'Gérant');
     
    }if(!isCaissier && !isGérant){
      this.navigation = this.navigation.filter(item => item.id !== 'Caissier');


    }
   
  }
  // life cycle event
  ngOnInit() {
    this.removeItembyrole();
    console.log(this.navigation);
    if (this.windowWidth < 992) {
      setTimeout(() => {
        document
          .querySelector('.pcoded-navbar')
          .classList.add('menupos-static');
        (
          document.querySelector('#nav-ps-datta') as HTMLElement
        ).style.maxHeight = '100%';
      }, 500);
    }
  }

  // public method
  navMob() {
    if (
      this.windowWidth < 992 &&
      document
        .querySelector('app-navigation.pcoded-navbar')
        .classList.contains('mob-open')
    ) {
      this.onNavCollapsedMob.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
  }
}
