import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Category, Customer, Order, Coupon, MediaAsset } from '../types';
import {
  PRODUCTS as INITIAL_PRODUCTS,
  CATEGORIES as INITIAL_CATEGORIES,
  COUPONS as INITIAL_COUPONS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_MEDIA,
} from '../data/initialData';

export type TabType =
  | 'overview'
  | 'products'
  | 'add-product'
  | 'orders'
  | 'customers'
  | 'media'
  | 'coupons'
  | 'settings';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

interface DashboardContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  products: Product[];
  categories: Category[];
  customers: Customer[];
  orders: Order[];
  coupons: Coupon[];
  media: MediaAsset[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  updateStockCount: (id: string, count: number) => void;
  // Order actions
  updateOrderStatus: (
    id: string,
    status: Order['orderStatus'],
    trackingNumber?: string,
    courierPartner?: string
  ) => void;
  // Customer actions
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, updated: Partial<Customer>) => void;
  // Media actions
  addMedia: (asset: Omit<MediaAsset, 'id'>) => void;
  deleteMedia: (id: string) => void;
  // Coupon actions
  addCoupon: (coupon: Coupon) => void;
  toggleCoupon: (code: string) => void;
  deleteCoupon: (code: string) => void;
  // Modals state
  editingProduct: Product | null;
  setEditingProduct: (p: Product | null) => void;
  deletingProduct: Product | null;
  setDeletingProduct: (p: Product | null) => void;
  viewingCustomer: Customer | null;
  setViewingCustomer: (c: Customer | null) => void;
  viewingOrder: Order | null;
  setViewingOrder: (o: Order | null) => void;
  // Data Management
  resetToDefaults: () => void;
  exportDatabase: () => void;
  importDatabase: (jsonData: string) => boolean;
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial States from LocalStorage or Defaults
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('va_admin_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('va_admin_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('va_admin_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('va_admin_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [media, setMedia] = useState<MediaAsset[]>(() => {
    try {
      const saved = localStorage.getItem('va_admin_media');
      return saved ? JSON.parse(saved) : INITIAL_MEDIA;
    } catch {
      return INITIAL_MEDIA;
    }
  });

  // Modal selections
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('va_admin_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('va_admin_customers', JSON.stringify(customers));
    } catch (e) {
      console.error(e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem('va_admin_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('va_admin_coupons', JSON.stringify(coupons));
    } catch (e) {
      console.error(e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem('va_admin_media', JSON.stringify(media));
    } catch (e) {
      console.error(e);
    }
  }, [media]);

  // Product Actions
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const nextIdNumber = products.length + 1;
    const newId = `va-${String(nextIdNumber).padStart(2, '0')}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" added successfully!`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    showToast(`Product updated successfully!`, 'success');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (deletingProduct?.id === id) {
      setDeletingProduct(null);
    }
    showToast(
      target ? `Deleted "${target.name}"` : 'Product deleted successfully',
      'info'
    );
  };

  const toggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newInStock = !p.inStock;
          const newCount = newInStock ? (p.stockCount > 0 ? p.stockCount : 25) : 0;
          return { ...p, inStock: newInStock, stockCount: newCount };
        }
        return p;
      })
    );
  };

  const updateStockCount = (id: string, count: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            stockCount: Math.max(0, count),
            inStock: count > 0,
          };
        }
        return p;
      })
    );
  };

  // Order Actions
  const updateOrderStatus = (
    id: string,
    status: Order['orderStatus'],
    trackingNumber?: string,
    courierPartner?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          return {
            ...o,
            orderStatus: status,
            ...(trackingNumber ? { trackingNumber } : {}),
            ...(courierPartner ? { courierPartner } : {}),
          };
        }
        return o;
      })
    );
    showToast(`Order status updated to "${status}"`, 'success');
  };

  // Customer Actions
  const addCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newId = `usr-${100 + customers.length + 1}`;
    const newCustomer: Customer = {
      ...customerData,
      id: newId,
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    showToast(`Customer ${newCustomer.fullName} registered!`, 'success');
  };

  const updateCustomer = (id: string, updated: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    showToast('Customer profile updated', 'success');
  };

  // Media Actions
  const addMedia = (asset: Omit<MediaAsset, 'id'>) => {
    const newId = `m-${Date.now()}`;
    const newAsset: MediaAsset = {
      ...asset,
      id: newId,
    };
    setMedia((prev) => [newAsset, ...prev]);
    showToast(`Asset "${newAsset.name}" added to Media Library`, 'success');
  };

  const deleteMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
    showToast('Media asset removed', 'info');
  };

  // Coupon Actions
  const addCoupon = (coupon: Coupon) => {
    const exists = coupons.some((c) => c.code.toUpperCase() === coupon.code.toUpperCase());
    if (exists) {
      showToast(`Coupon code ${coupon.code} already exists`, 'error');
      return;
    }
    setCoupons((prev) => [{ ...coupon, code: coupon.code.toUpperCase() }, ...prev]);
    showToast(`Coupon ${coupon.code.toUpperCase()} created!`, 'success');
  };

  const toggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast(`Coupon ${code} deleted`, 'info');
  };

  // Reset & Backup
  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setOrders(INITIAL_ORDERS);
    setCoupons(INITIAL_COUPONS);
    setMedia(INITIAL_MEDIA);
    localStorage.removeItem('va_admin_products');
    localStorage.removeItem('va_admin_customers');
    localStorage.removeItem('va_admin_orders');
    localStorage.removeItem('va_admin_coupons');
    localStorage.removeItem('va_admin_media');
    showToast('All data has been reset to defaults', 'info');
  };

  const exportDatabase = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      brand: 'VEDAYU AMRIT',
      products,
      customers,
      orders,
      coupons,
      media,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vedayuamrit-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database exported successfully!', 'success');
  };

  const importDatabase = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.products && Array.isArray(parsed.products)) {
        setProducts(parsed.products);
      }
      if (parsed.customers && Array.isArray(parsed.customers)) {
        setCustomers(parsed.customers);
      }
      if (parsed.orders && Array.isArray(parsed.orders)) {
        setOrders(parsed.orders);
      }
      if (parsed.coupons && Array.isArray(parsed.coupons)) {
        setCoupons(parsed.coupons);
      }
      if (parsed.media && Array.isArray(parsed.media)) {
        setMedia(parsed.media);
      }
      showToast('Database imported successfully!', 'success');
      return true;
    } catch {
      showToast('Failed to parse JSON backup file', 'error');
      return false;
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
        products,
        categories,
        customers,
        orders,
        coupons,
        media,
        searchQuery,
        setSearchQuery,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStock,
        updateStockCount,
        updateOrderStatus,
        addCustomer,
        updateCustomer,
        addMedia,
        deleteMedia,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        editingProduct,
        setEditingProduct,
        deletingProduct,
        setDeletingProduct,
        viewingCustomer,
        setViewingCustomer,
        viewingOrder,
        setViewingOrder,
        resetToDefaults,
        exportDatabase,
        importDatabase,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
