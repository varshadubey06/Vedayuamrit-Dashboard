export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  subCategory?: string;
  tagline: string;
  price: number;
  mrp: number;
  costPrice?: number; // Cost of goods sold for profit calculations
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  image: string;
  images: string[];
  sizeWeight: string;
  dosageForm: string;
  dosha: string[];
  benefits: string[];
  ingredients: { name: string; percentage?: string; purpose?: string }[];
  usageInstructions: string;
  description: string;
  highlights: string[];
  certifications: string[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  featuredHerbs: string[];
}

export interface CustomerAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  registeredDate: string;
  status: 'Active' | 'VIP' | 'New' | 'Inactive';
  doshaQuizResult?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  addresses: CustomerAddress[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  profitEstimate: number;
  paymentMethod: 'UPI' | 'Razorpay' | 'COD' | 'Card';
  paymentStatus: 'Paid' | 'Pending' | 'COD Confirmed' | 'Refunded';
  orderStatus: 'Order Placed' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  courierPartner?: string;
}

export interface Coupon {
  id?: string;
  code: string;
  discountPercent?: number;
  discountFlat?: number;
  minOrderValue: number;
  description: string;
  isActive: boolean;
  usageCount?: number;
}

export interface MediaAsset {
  id: string;
  name: string;
  path: string;
  category: 'product' | 'banner' | 'logo' | 'marketing';
  size: string;
  dimension?: string;
  uploadedDate: string;
}
