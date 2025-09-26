export interface OffersInterface {
  id: number;
  href: string;
  name: string;
  image: string;
  alt: string;
  stock: string;
  price: number;
  discount: number | null;
  installments: string;
  shipping: string;
  description: string;
  category: string;
  categoryId: number;
  condition: "new" | "like-new" | "used";
  seller: string;
  location: string;
  isOwner: boolean;
}

export const products = {
  "1": {
    id: 1,
    href: "/marketplace/1",
    name: "Brown Hoodie",
    image: "/1.jpg",
    alt: "brown hoodie",
    stock: "Only 2 left in stock",
    price: 30.99,
    discount: 35,
    installments: "Or 9 installments of $2.22",
    shipping: "Free Shipping",
    description:
      "Comfortable brown hoodie made with premium cotton blend. Perfect for casual wear and outdoor activities.",
    category: "Fashion & Apparel",
    categoryId: 3,
    condition: "new",
    seller: "Fashion Store",
    location: "New York, NY",
    isOwner: false,
  },
  "2": {
    id: 2,
    href: "/marketplace/2",
    name: "Black Sweatshirt",
    image: "/3.webp",
    alt: "black sweatshirt without hood",
    stock: "Only 5 left in stock",
    price: 45.0,
    discount: null,
    installments: "Or 6 installments of $5.00",
    shipping: "Free Shipping",
    description:
      "Classic black sweatshirt without hood. Made from soft fleece material for maximum comfort.",
    category: "Fashion & Apparel",
    categoryId: 3,
    condition: "like-new",
    seller: "Comfort Wear",
    location: "California",
    isOwner: true,
  },
  "3": {
    id: 3,
    href: "/marketplace/3",
    name: "Wireless Headphones",
    image: "/2.webp",
    alt: "wireless headphones",
    stock: "In stock",
    price: 199.99,
    discount: 25,
    installments: "Or 12 installments of $12.50",
    shipping: "Free Shipping",
    description:
      "High-quality wireless headphones with noise cancellation and long battery life.",
    category: "Electronics & Gadgets",
    categoryId: 4,
    condition: "new",
    seller: "Tech Haven",
    location: "Texas",
    isOwner: true,
  },
  "4": {
    id: 4,
    href: "/marketplace/4",
    name: "Ceramic Coffee Mug",
    image: "/4.webp",
    alt: "coffee mug",
    stock: "Only 10 left in stock",
    price: 15.99,
    discount: null,
    installments: "Or 3 installments of $3.33",
    shipping: "Free Shipping",
    description:
      "Elegant ceramic coffee mug perfect for your morning brew. Dishwasher and microwave safe.",
    category: "Home & Living",
    categoryId: 5,
    condition: "used",
    seller: "Home Essentials",
    location: "Florida",
    isOwner: true,
  },
  "5": {
    id: 5,
    href: "/marketplace/5",
    name: "Gaming Mouse RGB",
    image: "/1.jpg",
    alt: "gaming mouse",
    stock: "Limited stock",
    price: 89.99,
    discount: 33,
    installments: "Or 6 installments of $10.00",
    shipping: "Free Shipping",
    description:
      "RGB gaming mouse with programmable buttons and high DPI sensitivity.",
    category: "Electronics & Gadgets",
    categoryId: 4,
    condition: "new",
    seller: "Gaming Gear",
    location: "New York",
    isOwner: false,
  },
  "6": {
    id: 6,
    href: "/marketplace/6",
    name: "Premium Yoga Mat",
    image: "/3.webp",
    alt: "yoga mat",
    stock: "In stock",
    price: 49.99,
    discount: null,
    installments: "Or 4 installments of $8.75",
    shipping: "Free Shipping",
    description:
      "High-quality yoga mat with non-slip surface and excellent cushioning.",
    category: "Sports & Fitness",
    categoryId: 7,
    condition: "like-new",
    seller: "Fitness World",
    location: "California",
    isOwner: true,
  },
};
