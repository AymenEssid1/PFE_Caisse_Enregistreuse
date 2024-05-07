import { Establishment } from "../../establishments/Service/establishment.model";

export class Item {
    id: number;
    soldProductId: number;
    comboId: number;
    quantity: number;
    price: number;
    order: Order;
    name:string;
  
    constructor(data: any)
    {
      this.id = data.id;
      this.soldProductId = data.soldProductId;
      this.comboId = data.comboId;
      this.quantity = data.quantity;
      this.price = data.price;
      this.order = data.order;
      this.name =data.name;
    }
  }
export class Order {
    id: number;
    totalPrice: number;
    createdAt: Date;
    paymentStatus: boolean;
    tableId: number;
    items: Item[];
  
    constructor(data: any) {
      this.id = data.id;
      this.totalPrice = data.totalPrice;
      this.createdAt = data.createdAt;
      this.paymentStatus = data.paymentStatus;
      this.tableId = data.tableId;
      this.items = data.items;
    }
  }
  export class Session {
    id: number;
    cashierId: number;
    status: boolean;
    startTime: Date;
    closeTime: Date;
    startMoney: number;
    expectedMoney: number;
    actualMoney: number;
    orders: Order[];
  
    constructor(data: any)
     {
      this.id = data.id;
      this.cashierId = data.cashierId;
      this.status = data.status;
      this.startTime = data.startTime;
      this.closeTime = data.closeTime;
      this.startMoney = data.startMoney;
      this.expectedMoney = data.expectedMoney;
      this.actualMoney = data.actualMoney;
      this.orders = data.orders;
    }
  }






export class Category {
    id: number;
    categoryName: string;
    establishment: Establishment; // Assuming Establishment model exists

    constructor(data: any) {
        this.id = data.id;
        this.categoryName = data.categoryName;
        this.establishment = data.establishment;
    }
}




export class StockProduct {
    id: number;
    refstock: string;
    name: string;
    quantity: number;
    unit: string; // Change the type to string to match the enumeration values
    establishment: Establishment;
    stockEquivalents: StockEquivalent[];

    constructor(data: any) {
        this.id = data.id;
        this.refstock = data.refstock;
        this.name = data.name;
        this.quantity = data.quantity;
        this.unit = data.unit; // Assign unit value directly as string
        this.establishment = data.establishment;
        this.stockEquivalents = data.stockEquivalents;
    }
}


export class StockEquivalent {
    quantity: number;
    stockproduct: StockProduct; // Assuming StockProduct model exists

    constructor(data: any) {
        this.quantity = data.quantity;
        this.stockproduct = data.stockProduct;
    }

}

export class SoldProduct {
    id:number;
    ref: string;
    name: string;
    price: number;
    category: Category;
    stockEquivalents: StockEquivalent[];

    constructor(data: any) {
        this.id=data.id;
        this.ref = data.ref;
        this.name = data.name;
        this.price = data.price;
        this.category = data.category;
        this.stockEquivalents = data.stockEquivalents;
    }
}



export class Combo {
    id: number;
    ref: string;
    name: string;
    price: number;
    soldProducts: SoldProduct[];

    constructor(data: any) {
        this.id=data.id;
        this.ref = data.ref;
        this.name = data.name;
        this.price = data.price;
        this.soldProducts = data.SoldProducts;
    }
}




export class Discount {
    id: number;
    name:string;
    percentage: number;
    discountType: DiscountType;
    buyX: number;
    getY: number;
    startTime:string;
    endTime: string;
    soldProducts: SoldProduct[];
    combos: Combo[];

    constructor(data: any) {
        this.id = data.id;
        this.name =data.name;
        this.percentage = data.percentage;
        this.discountType = data.discountType;
        this.buyX = data.buyX;
        this.getY = data.getY;
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        this.soldProducts = data.soldProducts;
        this.combos = data.combos;
    }
}

export enum DiscountType {
    FLAT = "FLAT",
    BUY_X_GET_Y = "BUY_X_GET_Y"
}
