import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, PRODUCTS } from '@/data/products';

export type UserRole = 'Customer' | 'Admin';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  status: 'Confirmed' | 'Delivered' | 'In Transit';
  role: UserRole;
}

interface ShopContextType {
  // Auth & Profile
  user: UserProfile;
  isAuthenticated: boolean;
  signIn: (email: string, role: UserRole, name?: string) => boolean;
  signUp: (name: string, email: string, role: UserRole, phone?: string) => boolean;
  signOut: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  switchRole: (role: UserRole) => void;

  // Products (Managed with AsyncStorage persistence)
  products: Product[];
  addProduct: (product: Omit<Product, 'id'> | Product) => Promise<Product>;
  updateProduct: (id: string, updatedData: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductById: (id: string) => Product | undefined;
  resetProducts: () => Promise<void>;
  isProductsLoaded: boolean;

  // Favourites
  favourites: string[];
  toggleFavourite: (productId: string) => void;
  isFavourite: (productId: string) => boolean;
  favouriteProducts: Product[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  totalCartItems: number;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartTotal: number;

  // Orders
  orders: Order[];
  lastOrder: Order | null;
  placeOrder: () => Order | null;
}

const DEFAULT_CUSTOMER: UserProfile = {
  name: 'Aarav Sharma',
  email: 'customer@groceryshop.com',
  phone: '+91 98765 43210',
  address: 'Flat 402, Green Valley Apartments, Andheri West, Mumbai 400053',
  role: 'Customer',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
};

const DEFAULT_ADMIN: UserProfile = {
  name: 'Karan Patel',
  email: 'admin@groceryshop.com',
  phone: '+91 98111 22334',
  address: 'Central Distribution Hub, Bandra Kurla Complex, Mumbai 400051',
  role: 'Admin',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
};

const STORAGE_KEY_PRODUCTS = '@grocery_shop_products_v1';

const INITIAL_ORDERS: Order[] = [
  {
    id: 'GS-1094',
    date: '21 Oct 2026, 11:30 AM',
    items: [
      { product: PRODUCTS[1], quantity: 1, price: PRODUCTS[1].price },
      { product: PRODUCTS[2], quantity: 2, price: PRODUCTS[2].price },
    ],
    subtotal: 180,
    deliveryFee: 30,
    total: 210,
    deliveryAddress: DEFAULT_CUSTOMER.address,
    status: 'Delivered',
    role: 'Customer',
  },
];

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  // User Profile State
  const [user, setUser] = useState<UserProfile>(DEFAULT_CUSTOMER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Products State with AsyncStorage Persistence
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isProductsLoaded, setIsProductsLoaded] = useState<boolean>(false);

  // Load saved products from AsyncStorage on mount
  useEffect(() => {
    let isMounted = true;
    const loadStoredProducts = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY_PRODUCTS);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        }
      } catch (e) {
        console.error('Failed to load stored products from AsyncStorage', e);
      } finally {
        if (isMounted) {
          setIsProductsLoaded(true);
        }
      }
    };

    loadStoredProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Favourites State (Banana & Tomato as defaults for instant visual demonstration)
  const [favourites, setFavourites] = useState<string[]>(['1', '2']);

  // Cart State (pre-populated with 1 item for convenience or quick review)
  const [cart, setCart] = useState<CartItem[]>([
    { product: PRODUCTS[0], quantity: 2 }, // 2x Banana
  ]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Products Methods
  const addProduct = async (
    productData: Omit<Product, 'id'> | Product
  ): Promise<Product> => {
    const newId =
      'id' in productData && productData.id
        ? productData.id
        : `prod_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newProduct: Product = {
      ...productData,
      id: newId,
      rating: typeof productData.rating === 'number' ? productData.rating : 4.5,
      reviewsCount: productData.reviewsCount || 1,
      origin: productData.origin || 'Farm Fresh',
      calories: productData.calories || '40 kcal / 100g',
      shelfLife: productData.shelfLife || '5-7 days',
    };

    const nextProducts = [newProduct, ...products];
    setProducts(nextProducts);

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_PRODUCTS,
        JSON.stringify(nextProducts)
      );
    } catch (e) {
      console.error('Failed to save products to AsyncStorage', e);
    }

    return newProduct;
  };

  const updateProduct = async (
    id: string,
    updatedData: Partial<Product>
  ): Promise<Product> => {
    let updatedProduct: Product | undefined;
    const nextProducts = products.map((p) => {
      if (p.id === id) {
        updatedProduct = { ...p, ...updatedData };
        return updatedProduct;
      }
      return p;
    });

    if (!updatedProduct) {
      throw new Error(`Product with id ${id} not found`);
    }

    setProducts(nextProducts);

    // Also update product in cart if present
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === id
          ? { ...item, product: updatedProduct! }
          : item
      )
    );

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_PRODUCTS,
        JSON.stringify(nextProducts)
      );
    } catch (e) {
      console.error('Failed to update product in AsyncStorage', e);
    }

    return updatedProduct;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    const nextProducts = products.filter((p) => p.id !== id);
    setProducts(nextProducts);

    // Remove from cart and favourites
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== id));
    setFavourites((prevFav) => prevFav.filter((favId) => favId !== id));

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_PRODUCTS,
        JSON.stringify(nextProducts)
      );
    } catch (e) {
      console.error('Failed to delete product from AsyncStorage', e);
    }

    return true;
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  const resetProducts = async (): Promise<void> => {
    setProducts(PRODUCTS);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_PRODUCTS);
    } catch (e) {
      console.error('Failed to clear AsyncStorage products', e);
    }
  };

  // Auth Methods
  const signIn = (email: string, role: UserRole, name?: string): boolean => {
    const chosenName = name || (role === 'Admin' ? 'Admin Manager' : 'Grocery Customer');
    setUser({
      name: chosenName,
      email: email.trim().toLowerCase(),
      phone: role === 'Admin' ? '+91 98111 22334' : '+91 98765 43210',
      address:
        role === 'Admin'
          ? 'Central Distribution Hub, BKC, Mumbai'
          : 'Flat 402, Green Valley Apartments, Mumbai',
      role,
      avatarUrl:
        role === 'Admin'
          ? DEFAULT_ADMIN.avatarUrl
          : DEFAULT_CUSTOMER.avatarUrl,
    });
    setIsAuthenticated(true);
    return true;
  };

  const signUp = (
    name: string,
    email: string,
    role: UserRole,
    phone?: string
  ): boolean => {
    setUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '+91 98765 43210',
      address: 'Flat 402, Green Valley Apartments, Mumbai',
      role,
      avatarUrl: DEFAULT_CUSTOMER.avatarUrl,
    });
    setIsAuthenticated(true);
    return true;
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUser(DEFAULT_CUSTOMER);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'Admin') {
      setUser(DEFAULT_ADMIN);
    } else {
      setUser(DEFAULT_CUSTOMER);
    }
  };

  // Favourites Methods
  const toggleFavourite = (productId: string) => {
    setFavourites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isFavourite = (productId: string): boolean => {
    return favourites.includes(productId);
  };

  // Dynamic favourites filtering from persisted products list
  const favouriteProducts = useMemo(() => {
    return products.filter((p) => favourites.includes(p.id));
  }, [favourites, products]);

  // Cart Methods
  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    if (quantityToAdd <= 0) return;
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantityToAdd,
        };
        return next;
      }
      return [...prev, { product, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const increaseQuantity = (productId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: string) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemQuantity = (productId: string): number => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const totalCartItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Free delivery above ₹200; else ₹30 delivery fee; ₹0 if cart is empty
  const cartDeliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotal >= 200 ? 0 : 30;
  }, [cart.length, cartSubtotal]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + cartDeliveryFee;
  }, [cartSubtotal, cartDeliveryFee]);

  // Order Placement
  const placeOrder = (): Order | null => {
    if (cart.length === 0) return null;

    const newOrder: Order = {
      id: `GS-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      })),
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      total: cartTotal,
      deliveryAddress: user.address,
      status: 'Confirmed',
      role: user.role,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    clearCart();
    return newOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        updateProfile,
        switchRole,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        resetProducts,
        isProductsLoaded,

        favourites,
        toggleFavourite,
        isFavourite,
        favouriteProducts,

        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getItemQuantity,
        totalCartItems,
        cartSubtotal,
        cartDeliveryFee,
        cartTotal,

        orders,
        lastOrder,
        placeOrder,
      }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
