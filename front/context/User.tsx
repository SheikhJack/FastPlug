import React, { useState, useEffect, createContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContextType, CartItem, Order, UserProfile } from '@/lib/types/user';
import { orderApi } from '@/lib/orderApi';
import {  userApi } from '@/lib/userApi';
import { authApi } from '@/lib/authApi';
import { v4 as uuidv4 } from 'uuid';

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode;
}





export const UserProvider: React.FC<UserProviderProps> = (props) => {
  const [token, setToken] = useState<string>('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  const addToWishlist = async (productId: string) => {
  try {
    const response = await userApi.addToWishlist(productId);
    if (response.success) {
      await loadProfile();
    }
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

const removeFromWishlist = async (productId: string) => {
  try {
    const response = await userApi.removeFromWishlist(productId);
    if (response.success) {
      await loadProfile();
    }
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

  const loadInitialData = async () => {
    const token = await AsyncStorage.getItem('token')
    setToken(token || '')
    
    if (token) {
      await loadProfile()
      await loadOrders()
    }
    
    loadCart()
  }

const loadProfile = async () => {
  setLoading(true);
  try {
    const response = await userApi.getProfile();
    if (response.success) {
      setProfile(response.data); 
    } else {
      console.error('Profile load failed:', response.error);
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  } finally {
    setLoading(false);
  }
};

  const loadOrders = async () => {
  setLoading(true);
  try {
      const response = await orderApi.getOrders()
      if (response.success) {
        setOrders(response.data.orders)
 } else {
      console.error('Profile load failed:', response.error);
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  } finally {
    setLoading(false);
  }
};

  const loadCart = async () => {
    try {
      const cart = await AsyncStorage.getItem('cartItems')
      setCart(cart ? JSON.parse(cart) : [])
    } catch (error) {
      console.error('Error loading cart:', error)
    }
  }

  const setTokenAsync = async (newToken: string) => {
    await AsyncStorage.setItem('token', newToken)
    setToken(newToken)
    await loadProfile()
    await loadOrders()
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      setToken('')
      setProfile(null)
      setOrders([])
      await authApi.logout()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const clearCart = async () => {
    setCart([])
    await AsyncStorage.setItem('cartItems', JSON.stringify([]))
  }

  const addQuantity = async (key: string, quantity: number = 1) => {
    const cartIndex = cart.findIndex(c => c.key === key)
    if (cartIndex === -1) return
    
    const newCart = [...cart]
    newCart[cartIndex].quantity += quantity
    setCart(newCart)
    await AsyncStorage.setItem('cartItems', JSON.stringify(newCart))
  }

  const removeQuantity = async (key: string) => {
    const cartIndex = cart.findIndex(c => c.key === key)
    if (cartIndex === -1) return
    
    const newCart = [...cart]
    newCart[cartIndex].quantity -= 1
    const filteredCart = newCart.filter(c => c.quantity > 0)
    setCart(filteredCart)
    await AsyncStorage.setItem('cartItems', JSON.stringify(filteredCart))
  }

  const addCartItem = async (
    _id: string,
    product: string,
    image: string,
    quantity: number = 1,
    price?: number,
    attributes: any[] = []
  ) => {
    const newCartItem: CartItem = {
      key: uuidv4(),
      _id,
      product,
      quantity,
      image,
      price: Number(price || 0),
      selectedAttributes: attributes.map(({ attributeId, title, options }) => {
        return {
          title,
          attributeId,
          option: {
            optionId: options.optionId,
            title: options.title,
            price: options.price
          }
        }
      })
    }
    
    const newCart = [...cart, newCartItem]
    await AsyncStorage.setItem('cartItems', JSON.stringify(newCart))
    setCart(newCart)
  }

  const updateCart = async (newCart: CartItem[]) => {
    setCart(newCart)
    await AsyncStorage.setItem('cartItems', JSON.stringify(newCart))
  }

 const contextValue: UserContextType = {
    isLoggedIn: !!token && !!profile,
    loadingProfile: loading,
    profile,
    setTokenAsync,
    logout,
    loadingOrders: false,
    orders,
    fetchOrders: loadOrders,
    fetchMoreOrdersFunc: async () => {
      // Implement pagination if needed
      const response = await orderApi.getOrders(orders.length)
      if (response.success) {
        setOrders(prev => [...prev, ...(response.data.orders || [])])
      }
    },
    cart,
    cartCount: cart.length,
    clearCart,
    updateCart,
    addQuantity,
    removeQuantity,
    addCartItem,
    addToWishlist,
    removeFromWishlist
  }

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  )
}


export default UserContext