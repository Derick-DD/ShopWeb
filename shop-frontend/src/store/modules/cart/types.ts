export interface Cart {
  [id: string]: {
    name: string;
    price: number;
    imagePath: string;
    count: number;
  };
}

export interface CartState {
  cartItems: Cart;
  originCart: Cart;
  ifChanged: boolean;
}

export interface CartUpdate {
  productId: string;
  count: number;
}
