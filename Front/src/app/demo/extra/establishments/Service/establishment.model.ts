export class Establishment {
  id: number = 0;
  name: string = "";
  tables: Tables[] = []; 
  tableSystem:boolean;
  tippingSystem:boolean;
  fidelitySystem:boolean;
  fidelityRatio:number;

    

  
}


  export class Tables {
    id: number;
    name: string;
    status: boolean;
  
    constructor(id: number, name: string, status: boolean) {
      this.id = id;
      this.name = name;
      this.status = status;
    }
  }
  
  