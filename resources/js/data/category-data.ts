export interface Category {
    id: number;
    name: string;
  }
  
  export const categories: Category[] = [
    { id: 1, name: "All Products" },
    { id: 2, name: "Offers & Special Price" },
    { id: 3, name: "Fashion & Apparel" },
    { id: 4, name: "Electronics & Gadgets" },
    { id: 5, name: "Home & Living" },
    { id: 6, name: "Health & Beauty" },
    { id: 7, name: "Sports & Fitness" },
    { id: 8, name: "Books & Media" },
    { id: 9, name: "Art & Crafts" },
    { id: 10, name: "Food & Beverages" },
    { id: 11, name: "Toys & Games" },
    { id: 12, name: "Automotive & Tools" },
    { id: 13, name: "Pet Supplies" },
    { id: 14, name: "Travel & Luggage" },
    { id: 15, name: "Musical Instruments" },
    { id: 16, name: "Office & Stationery" },
  ] as const;