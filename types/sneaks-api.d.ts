declare module 'sneaks-api' {
  export default class SneaksAPI {
    constructor();
    
    getMostPopular(callback: (err: Error | null, products: any[]) => void): void;
    
    getProducts(
      keyword: string, 
      limit: number, 
      callback: (err: Error | null, products: any[]) => void
    ): void;
    
    getProductPrices(
      styleID: string, 
      callback: (err: Error | null, prices: any) => void
    ): void;
    
    getProductSizes(
      styleID: string, 
      callback: (err: Error | null, sizes: any) => void
    ): void;
  }
}