export interface Product {
  categoryName: string;
  rating: any;
  originalPrice: any;
  featured: string;
  _id: string;
  title: string;
  price: number;
  image: string[];
  subCategory: {
    title: string;
  };
  reviewData: {
    ratings: number;
    total: number;
  };
  // Add other product properties as needed
}

export interface WishlistResponse {
  success: boolean;
  message?: string;
  // Add other response properties as needed
}