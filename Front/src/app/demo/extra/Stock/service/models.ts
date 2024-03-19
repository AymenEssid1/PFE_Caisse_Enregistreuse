import { Establishment } from "../../establishments/Service/establishment.model";

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
    establishment: Establishment; // Assuming Establishment model exists
    stockEquivalents: StockEquivalent[]; // Assuming StockEquivalent model exists

    constructor(data: any) {
        this.id = data.id;
        this.refstock = data.refstock;
        this.name = data.name;
        this.quantity = data.quantity;
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
