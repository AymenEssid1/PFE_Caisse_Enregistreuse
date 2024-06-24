import { Component, OnInit } from '@angular/core';
import { SessionPDFService } from './statsService';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { EstablishmentService } from '../establishments/Service/EstablishmentService';
import { Establishment } from '../establishments/Service/establishment.model';
import { WebSocketService } from './WebsocketService';
import { NgApexchartsModule } from 'ng-apexcharts';





@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [SharedModule,NgApexchartsModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  establishments: any[] = [];
  sessionPDFs: any[] = [];
  filteredSessionPDFs: any[] = [];
  selectedEstablishment: any = null;
  selectedEstablishment2: any = null;
  selectedEstablishment3: Establishment;
  reportTypes: string[] = ['quotidien', 'mensuel', 'annuel'];
  selectedReportType: string | null = null;
  selectedDate: string | null = null;

  establishmentNamesById: Map<number, string> = new Map<number, string>();


  // Mapping of month numbers to French names
  months = [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // Mapping of month numbers to French names
  monthNames: { [key: number]: string } = {
    1: 'Janvier',
    2: 'Février',
    3: 'Mars',
    4: 'Avril',
    5: 'Mai',
    6: 'Juin',
    7: 'Juillet',
    8: 'Août',
    9: 'Septembre',
    10: 'Octobre',
    11: 'Novembre',
    12: 'Décembre',

    
  };



  selectedYear: number = new Date().getFullYear(); // Default to current year
  selectedYear2: number = new Date().getFullYear(); // Default to current year

  selectedMonth: number = 0; // Default to all months
  years: number[] ; // Assuming you want to select from these years

   allEstablishments: Establishment = {
    id: -1,
    name: "Tous les points de vente",
    tables: [],
    tableSystem: false,
    scanSystem: false,
    fidelitySystem: false,
    fidelityRatio: 0,
    cashOutRatio: 0,
  };

  constructor(private sessionPdfService: SessionPDFService, private establishmentService: EstablishmentService , private socketService:WebSocketService) 
  { this.selectedYear=2024
    this.selectedMonth=-1;
    this.selectedMonth3=-1;

   
    this.selectedEstablishment3= this.allEstablishments;


    const currentYear = new Date().getFullYear();
    const yearsBeforeAndAfter = 20;
    this.years = Array.from({ length: yearsBeforeAndAfter * 2 + 1 }, (_, index) => currentYear - yearsBeforeAndAfter + index);

   
  }




  chartOptions: any;


 

  ngOnInit(): void {
    //this.socketService.initializeWebSocketConnection();
    

    this.fetchEstablishments();
    this.loadPercentageChange();
    this.loadStats(this.selectedEstablishment3);



  
  }
////////////////////////////////////////////////////////////////////Cashiers/////////////////////////////////
selectedYear3:number = new Date().getFullYear();
selectYear3(year: number): void {
  this.selectedYear3 = year;
  this.fetchCashiersWithMinusSessions();}
selectedMonth3: number = 0; // Default to all months

selectMonth3(month: number): void {
  this.selectedMonth3 = month;
  this.fetchCashiersWithMinusSessions();}
selectedEstablishment4: any = null;

selectestabcaissier(estab: Establishment): void {
  this.selectedEstablishment4 = estab; // Assign the establishment ID
  console.log(this.selectedEstablishment4); // Ensure that the correct ID is logged
  this.fetchCashiersWithMinusSessions();
}

cashiersWithMinusSessions: any[] = [];

fetchCashiersWithMinusSessions(): void {
  this.sessionPdfService.getCashiersWithMinusSessions(this.selectedEstablishment4.id, this.selectedYear3, this.selectedMonth3).subscribe(
    (data: any[]) => {
      this.cashiersWithMinusSessions = data;
      
      console.log(data);
    },
    (error) => {
      console.error('Error fetching cashiers with minus sessions:', error);
    }
  );
}


  //////////////////////////TOP 5 & BOTTOM 5/////////////////////////////////////////////
  selectYear2(year: number): void {
    this.selectedYear2 = year;
    this.loadStats(this.selectedEstablishment3);
  }
  
  selectMonth(month: number): void {
    this.selectedMonth = month;
    this.loadStats(this.selectedEstablishment3);
  }
  selectestabtop5(estab: Establishment): void {
    this.selectedEstablishment3 = estab; // Assign the establishment ID
    console.log(this.selectedEstablishment3); // Ensure that the correct ID is logged
    this.loadStats(estab);
  }
  
  

  loadStats(estab: Establishment) {
    this.selectedEstablishment3 = estab; // Assign the establishment ID

    this.getTop5SoldProducts(this.selectedYear, this.selectedMonth, this.selectedEstablishment3!=this.allEstablishments  ? this.selectedEstablishment3.id : -1);
    this.getWorst5Combos(this.selectedYear, this.selectedMonth, this.selectedEstablishment3!=this.allEstablishments  ? this.selectedEstablishment3.id : -1);
    this.getWorst5SoldProducts(this.selectedYear, this.selectedMonth, this.selectedEstablishment3!=this.allEstablishments ? this.selectedEstablishment3.id : -1);
    this.getTop5Combos(this.selectedYear, this.selectedMonth, this.selectedEstablishment3!=this.allEstablishments ? this.selectedEstablishment3.id : -1);

  }

  fillEmptySlots(list: any[], placeholder: any, length: number = 5) {
    while (list.length < length) {
      list.push(placeholder);
    }
  }






  top5Combos: any[] = [];
  bottom5Combos: any[] = [];
  top5SoldProducts: any[] = [];
  bottom5SoldProducts: any[] = [];

  fetchCombosByIds(comboIdsWithQuantities: number[][], type: string): void {
    const comboIds = comboIdsWithQuantities.map(pair => pair[0]); // Extracting only the IDs
    this.sessionPdfService.getCombosByIds(comboIds).subscribe(
      (combos: any[]) => {
        const idToNameMap: any = {};
        combos.forEach(combo => {
          idToNameMap[combo.id] = combo.name;
        });

        const formattedData = comboIdsWithQuantities.map(pair => {
          const comboId = pair[0];
          return { name: idToNameMap[comboId] || 'Aucune donnée disponible', quantity: pair[1] };
        });

        if (type === 'topCombos') {
          this.top5Combos = formattedData;
          this.fillEmptySlots(this.top5Combos, { name: 'Aucune donnée disponible', quantity: 0 });
        } else if (type === 'bottomCombos') {
          this.bottom5Combos = formattedData;
          this.fillEmptySlots(this.bottom5Combos, { name: 'Aucune donnée disponible', quantity: 0 });
        }
      },
      (error) => {
        console.error('Error fetching combos by IDs:', error);
      }
    );
  }

  getSoldProductsByIds(idsWithQuantities: number[][], type: string): void {
    const ids = idsWithQuantities.map(pair => pair[0]); // Extracting only the IDs
    this.sessionPdfService.getSoldProductsByIds(ids).subscribe(
      (soldProducts: any[]) => {
        const idToNameMap: any = {};
        soldProducts.forEach(product => {
          idToNameMap[product.id] = product.name;
        });

        const formattedData = idsWithQuantities.map(pair => {
          const productId = pair[0];
          return { name: idToNameMap[productId] || 'Aucune donnée disponible', quantity: pair[1] };
        });

        if (type === 'topSoldProducts') {
          this.top5SoldProducts = formattedData;
          this.fillEmptySlots(this.top5SoldProducts, { name: 'Aucune donnée disponible', quantity: 0 });
        } else if (type === 'bottomSoldProducts') {
          this.bottom5SoldProducts = formattedData;
          this.fillEmptySlots(this.bottom5SoldProducts, { name: 'Aucune donnée disponible', quantity: 0 });
        }
      },
      (error) => {
        console.error('Error fetching sold products by IDs:', error);
      }
    );
  }
  
  
  

  getTop5Combos(year: number, month: number, establishmentId: number): void {
    this.sessionPdfService.getTop5Combos(year, month, establishmentId).subscribe(
      (data: any) => {
        this.fetchCombosByIds(data,"topCombos");
      },
      (error) => {
        console.error('Error fetching top 5 combos:', error);
      }
    );
  }

  getTop5SoldProducts(year: number, month: number, establishmentId: number): void {
    this.sessionPdfService.getTop5SoldProducts(year, month, establishmentId).subscribe(
      (data: any) => {
        this.getSoldProductsByIds(data,"topSoldProducts");
      },
      (error) => {
        console.error('Error fetching top 5 sold products:', error);
      }
    );
  }

  getWorst5Combos(year: number, month: number, establishmentId: number): void {
    this.sessionPdfService.getWorst5Combos(year, month, establishmentId).subscribe(
      (data: any) => {
        this.fetchCombosByIds(data,'bottomCombos');
      },
      (error) => {
        console.error('Error fetching worst 5 combos:', error);
      }
    );
  }

  getWorst5SoldProducts(year: number, month: number, establishmentId: number): void {
    this.sessionPdfService.getWorst5SoldProducts(year, month, establishmentId).subscribe(
      (data: any) => {
        this.getSoldProductsByIds(data,"bottomSoldProducts");
      },
      (error) => {
        console.error('Error fetching worst 5 sold products:', error);
      }
    );
  }
////////////////////////////////////
 
  percentageChangeDataArray: any[] = [];

loadPercentageChange(): void {
  this.sessionPdfService.getPercentageChange().subscribe(
    (data: any) => {
      console.log(data);
      this.populateDataArray(data);
    },
    (error) => {
      console.error('Error fetching percentage change:', error);
    }
  );
}

loadPercentageChange2(establishmentId:number): void {
  this.sessionPdfService.getPercentageChange2(establishmentId).subscribe(
    (data: any) => {
      console.log(establishmentId);
      console.log(data);
      this.populateDataArray(data);
    },
    (error) => {
      console.error('Error fetching percentage change:', error);
    }
  );
}

populateDataArray(data: any): void {
  this.percentageChangeDataArray = [
    {
      design: 'col-md-4',
      title: 'Ventes: Aujourd\'hui vs Hier',
      icon: data.todayYesterdayPercentage >= 0 ? 'icon-arrow-up text-c-green' : 'icon-arrow-down text-c-red',
      amount: data.todayTotal,
      percentage: (data.todayYesterdayPercentage > 0 ? '+' : '') + data.todayYesterdayPercentage.toFixed(1) + '%',
      progress: data.todayYesterdayPercentage.toFixed(1)
    },
    {
      design: 'col-md-4',
      title: 'Ventes: Ce Mois vs Mois Précédent',
      icon: data.monthLastMonthPercentage >= 0 ? 'icon-arrow-up text-c-green' : 'icon-arrow-down text-c-red',
      amount: data.monthTotal,
      percentage: (data.monthLastMonthPercentage > 0 ? '+' : '') + data.monthLastMonthPercentage.toFixed(1) + '%',
      progress: data.monthLastMonthPercentage.toFixed(1)
    },
    {
      design: 'col-md-4',
      title: 'Ventes: Cette Année vs Année Précédente',
      icon: data.yearLastYearPercentage >= 0 ? 'icon-arrow-up text-c-green' : 'icon-arrow-down text-c-red',
      amount: data.yearTotal,
      percentage: (data.yearLastYearPercentage > 0 ? '+' : '') + data.yearLastYearPercentage.toFixed(1) + '%',
      progress: data.yearLastYearPercentage.toFixed(1)
    }
  ];
}





  
/////////////////////////////

  chartData: any;

  loadChartData(): void {
    this.initializeChartData(); // Initialize chartData with default values

    setTimeout(() => {
      
    }, 1000);
    
    this.sessionPdfService.getOrdersSumByEstablishment(this.selectedYear)
      .subscribe(data => {
        this.populateChartData(data); // Populate chartData with fetched data
      });
  }
  
  initializeChartData(): void {
    this.chartData = {
      series: [],
      chart: {
        type: 'area',
        height: 350
      },
      fill: {
        opacity: 0.5
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        categories: ['Q1', 'Q2', 'Q3', 'Q4']
      },
      tooltip: {
        enabled: true
      }
    };
    
  }
  
  populateChartData(data: any[]): void {
    this.chartData.series = data.map(item => {
      const establishment = this.establishments.find(est => est.id === item[0]);
      const establishmentName = establishment ? establishment.name : 'Unknown Establishment';
      return {
        name: establishmentName,
        data: [
          Number(item[1].toFixed(1)), // Q1
          Number(item[2].toFixed(1)), // Q2
          Number(item[3].toFixed(1)), // Q3
          Number(item[4].toFixed(1))  // Q4
        ]
      };
    });
  }
  
  
  

  onYearChange() {
    this.loadChartData();
  }


  deleteAllSessionPDFs() {
    this.sessionPdfService.deleteAllSessionPDFs().subscribe(
      () => {
        console.log('All session PDFs deleted successfully.');
        // You can update the UI or perform any other actions after successful deletion
        this.fetchEstablishments();
      },
      (error) => {
        console.error('Error deleting all session PDFs:', error);
      }
    );
  }

 
  


 

  fetchEstablishments() {
    this.establishmentService.getAllEstablishments().subscribe(
      (data) => {
        this.establishments = data;
        if (this.establishments.length > 0) {
          this.selectedEstablishment = this.establishments[0];
          this.selectedEstablishment4 = this.establishments[0];
          this.loadSessionPDFs();
          this.loadChartData();
          this.fetchCashiersWithMinusSessions();

        }
      },
      (error) => {
        console.error('Error fetching establishments', error);
      }
    );
  }

  fetchEstablishmentById(id: number) {
    this.establishmentService.getEstablishmentById(id).subscribe(
      (data: Establishment) => {
        this.establishmentNamesById.set(id, data.name);
        this.filterSessionPDFs(); // Ensure the PDF list updates once establishment names are fetched
      },
      (error) => {
        console.error(`Error fetching establishment with id ${id}`, error);
      }
    );
  }

  getEstablishmentName(pdfName: string): string {
    const match = pdfName.match(/pv:(\d+)/);
    if (match) {
      const id = +match[1];
      return this.establishmentNamesById.get(id) || 'Unknown';
    }
    return 'Unknown';
  }
  
  

  loadSessionPDFs() {
    this.sessionPdfService.getAllSessionPDFs().subscribe(
      (response) => {
        this.sessionPDFs = response;
  
        // Fetch establishment names
        const establishmentIds = new Set<number>();
        this.sessionPDFs.forEach(pdf => {
          const match = pdf.name.match(/pv:(\d+)/);
          if (match) {
            const id = +match[1];
            if (!this.establishmentNamesById.has(id)) {
              establishmentIds.add(id);
            }
          }
        });
  
        establishmentIds.forEach(id => this.fetchEstablishmentById(id));
        this.filterSessionPDFs(); // Filter PDFs after loading
      },
      (error) => {
        console.log('Error fetching session PDFs:', error);
      }
    );
  }
  

  selectEstablishment(establishment: any) {
    this.selectedEstablishment = establishment;
    this.filterSessionPDFs();
  }
  selectEstablishment2(establishment: any,establishmentId:number) {
    this.selectedEstablishment2 = establishment;
    this.loadPercentageChange2(establishmentId);
  }
  selectEstablishment3() {
    this.selectedEstablishment2 = null;
    this.loadPercentageChange();
  }

  selectReportType(type: string) {
    this.selectedReportType = type;
    this.filterSessionPDFs();
  }

  filterSessionPDFs() {
    if (this.selectedEstablishment) {
      const estId = this.selectedEstablishment.id;
      this.filteredSessionPDFs = this.sessionPDFs.filter(pdf => 
        pdf.name.includes(`pv:${estId}`) && 
        (this.selectedReportType ? pdf.name.includes(this.selectedReportType) : true) && 
        (this.selectedReportType === 'quotidien' && this.selectedDate ? pdf.name.includes(this.selectedDate) : true)
      );
    } else {
      this.filteredSessionPDFs = this.sessionPDFs;
    }
  }

  downloadPDF(id: number): void {
    this.sessionPdfService.downloadSessionPDF(id).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      (error) => {
        console.log('Error downloading PDF:', error);
      }
    );
  }

  deletePDF(id: number): void {
    this.sessionPdfService.deleteSessionPDF(id).subscribe(
      () => {
        this.sessionPDFs = this.sessionPDFs.filter(pdf => pdf.id !== id);
        this.filterSessionPDFs(); // Re-filter after deletion
      },
      (error) => {
        console.log('Error deleting PDF:', error);
      }
    );
  }
}
