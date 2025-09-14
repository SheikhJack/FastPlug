


export interface CartItem {
  key: string;
  _id: string;
  product: string;
  quantity: number;
  image: string;
  price: number;
  selectedAttributes: {
    title: string;
    attributeId: string;
    option: {
      optionId: string;
      title: string;
      price: number;
    };
  }[];
}

export interface Order {
  _id: string;
  orderId: string;
  orderStatus: string;
  deliveryAddress?: {
    label: string;
    region: string;
    city: string;
    apartment: string;
    building: string;
    details: string;
  };
  deliveryCharges?: number;
  items?: OrderItem[];
  user?: {
    _id: string;
    name: string;
    phone: string;
    email: string;
  };
  paymentStatus?: string;
  paymentMethod?: string;
  paidAmount?: number;
  orderAmount?: number;
  statusQueue?: {
    pending: boolean;
    accepted: boolean;
    dispatched: boolean;
    preparing: boolean;
    picked: boolean;
    delivered: boolean;
    cancelled: boolean;
  };
  createdAt?: string;
}


export interface OrderItem {
  _id: string;
  product: string;
  productId: string;
  image: string;
  price: number;
  quantity: number;
  isReviewed?: boolean;
}

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
  phone?: string;
  addresses?: any[];
  whishlist?: any[];
  // Add other profile properties as needed
}

export interface UserContextType {
  isLoggedIn: boolean;
  loadingProfile: boolean;
  profile: UserProfile | null;
  setTokenAsync: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadingOrders: boolean;
  orders: Order[];
  fetchOrders: () => void;
  fetchMoreOrdersFunc: () => void;
  cart: CartItem[];
  cartCount: number;
  clearCart: () => Promise<void>;
  updateCart: (cart: CartItem[]) => Promise<void>;
  addQuantity: (key: string, quantity?: number) => Promise<void>;
  removeQuantity: (key: string) => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  addCartItem: (
    _id: string,
    product: string,
    image: string,
    quantity?: number,
    price?: number,
    attributes?: any[]
  ) => Promise<void>;
}

