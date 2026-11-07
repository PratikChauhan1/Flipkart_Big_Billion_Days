const { supabase } = require('./supabase');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Initial sample products for Flipkart Big Billion Day
const initialProducts = [
  {
    id: 'prod-iphone-15',
    title: 'Apple iPhone 15 (Blue, 128 GB)',
    description: 'Dynamic Island, 48MP Main camera, USB-C, A16 Bionic chip, Super Retina XDR display with ceramic shield front.',
    category: 'Mobiles',
    brand: 'Apple',
    price: 54999,
    original_price: 79900,
    discount_percent: 31,
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews_count: 28410,
    is_bestseller: true,
    is_big_billion_deal: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-s24-ultra',
    title: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)',
    description: 'Galaxy AI is here. 200MP camera, Snapdragon 8 Gen 3, S-Pen included, titanium frame, 5000mAh battery.',
    category: 'Mobiles',
    brand: 'Samsung',
    price: 109999,
    original_price: 134999,
    discount_percent: 18,
    stock: 12,
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviews_count: 11200,
    is_bestseller: true,
    is_big_billion_deal: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-sony-xm5',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    description: 'Industry-leading noise canceling with 2 processors, 8 microphones, 30hr battery life, speak-to-chat.',
    category: 'Electronics',
    brand: 'Sony',
    price: 24990,
    original_price: 34990,
    discount_percent: 28,
    stock: 25,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews_count: 8900,
    is_bestseller: true,
    is_big_billion_deal: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-macbook-air-m2',
    title: 'Apple MacBook Air M2 (8GB RAM, 256GB SSD, Midnight)',
    description: '13.6-inch Liquid Retina display, MagSafe 3 charging, 1080p FaceTime HD camera, all-day battery life.',
    category: 'Electronics',
    brand: 'Apple',
    price: 79990,
    original_price: 99900,
    discount_percent: 20,
    stock: 8,
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews_count: 14500,
    is_bestseller: false,
    is_big_billion_deal: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-nike-air-max',
    title: 'Nike Air Max 270 Running Shoes For Men',
    description: 'Big Billion Special Edition. Breathable mesh upper, large max air unit in heel for ultra-plush cushioning.',
    category: 'Fashion',
    brand: 'Nike',
    price: 6499,
    original_price: 12995,
    discount_percent: 50,
    stock: 30,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    reviews_count: 5120,
    is_bestseller: false,
    is_big_billion_deal: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-lg-oled-55',
    title: 'LG 55 Inch OLED 4K Ultra HD Smart TV (Cinema Edition)',
    description: 'Self-lit OLED pixels, alpha 8 AI Processor 4K, Dolby Vision & Atmos, 120Hz refresh rate for ultimate gaming.',
    category: 'Appliances',
    brand: 'LG',
    price: 89990,
    original_price: 169990,
    discount_percent: 47,
    stock: 6,
    image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews_count: 3200,
    is_bestseller: true,
    is_big_billion_deal: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-fastrack-smartwatch',
    title: 'Fastrack Revoltt FS1 Pro Smartwatch with 1.96" AMOLED Display',
    description: 'SingleSync BT Calling, 410x502 resolution, Always-on display, NitroFast charging, 110+ sports modes.',
    category: 'Electronics',
    brand: 'Fastrack',
    price: 1999,
    original_price: 7995,
    discount_percent: 75,
    stock: 50,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    reviews_count: 34900,
    is_bestseller: true,
    is_big_billion_deal: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'prod-puma-bomber-jacket',
    title: 'Puma Men Classic Solid Casual Bomber Jacket',
    description: 'Windproof, stylish athletic casual jacket with contrast zipper and water-resistant finish.',
    category: 'Fashion',
    brand: 'Puma',
    price: 1899,
    original_price: 4499,
    discount_percent: 57,
    stock: 40,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviews_count: 4100,
    is_bestseller: false,
    is_big_billion_deal: true,
    created_at: new Date().toISOString()
  }
];

// Fallback in-memory stores
const memoryStore = {
  users: [],
  products: [...initialProducts],
  orders: []
};

// Seed default admin and user in fallback
const adminHash = bcrypt.hashSync('admin123', 10);
const userHash = bcrypt.hashSync('user123', 10);

memoryStore.users.push(
  {
    id: 'admin-1',
    name: 'Flipkart Admin',
    email: 'admin@flipkart.com',
    password_hash: adminHash,
    role: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: 'user-1',
    name: 'Rahul Sharma',
    email: 'user@flipkart.com',
    password_hash: userHash,
    role: 'user',
    created_at: new Date().toISOString()
  }
);

class DataStore {
  constructor() {
    this.supabaseAvailable = false;
    this.checkSupabaseConnection();
  }

  async checkSupabaseConnection() {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('products').select('id').limit(1);
      if (!error) {
        this.supabaseAvailable = true;
        console.log('⚡ Connected to Supabase products table successfully!');
      } else {
        console.log(`ℹ️ Supabase table note: ${error.message}. (Local storage active, ready for schema.sql)`);
      }
    } catch (e) {
      this.supabaseAvailable = false;
    }
  }

  // --- USER OPERATIONS ---
  async findUserByEmail(email) {
    if (this.supabaseAvailable) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
        if (!error && data) return data;
      } catch (err) {}
    }
    return memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id) {
    if (this.supabaseAvailable) {
      try {
        const { data, error } = await supabase.from('users').select('id, name, email, role, phone, address, created_at').eq('id', id).maybeSingle();
        if (!error && data) return data;
      } catch (err) {}
    }
    const user = memoryStore.users.find(u => u.id === id);
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  async createUser({ name, email, password, role = 'user', phone = '', address = '' }) {
    const password_hash = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      name,
      email: email.toLowerCase(),
      password_hash,
      role,
      phone,
      address,
      created_at: new Date().toISOString()
    };

    if (this.supabaseAvailable) {
      try {
        const { data, error } = await supabase.from('users').insert([newUser]).select().single();
        if (!error && data) return data;
      } catch (err) {}
    }

    memoryStore.users.push(newUser);
    return newUser;
  }

  // --- PRODUCT OPERATIONS ---
  async getAllProducts({ category, search, minPrice, maxPrice, sort } = {}) {
    let prods = [];
    if (this.supabaseAvailable) {
      try {
        let query = supabase.from('products').select('*');
        if (category && category !== 'All') query = query.eq('category', category);
        if (search) query = query.ilike('title', `%${search}%`);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          prods = data;
        }
      } catch (err) {}
    }

    if (prods.length === 0) {
      prods = [...memoryStore.products];
      if (category && category !== 'All') {
        prods = prods.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const term = search.toLowerCase();
        prods = prods.filter(p => 
          p.title.toLowerCase().includes(term) || 
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
        );
      }
    }

    if (sort === 'price_asc') {
      prods.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === 'price_desc') {
      prods.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === 'discount') {
      prods.sort((a, b) => Number(b.discount_percent || 0) - Number(a.discount_percent || 0));
    } else if (sort === 'rating') {
      prods.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return prods;
  }

  async getProductById(id) {
    if (this.supabaseAvailable) {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
        if (!error && data) return data;
      } catch (err) {}
    }
    return memoryStore.products.find(p => p.id === id) || null;
  }

  async createProduct(productData) {
    const original_price = Number(productData.original_price || productData.price);
    const price = Number(productData.price);
    const discount_percent = original_price > price ? Math.round(((original_price - price) / original_price) * 100) : 0;

    const newProduct = {
      id: uuidv4(),
      title: productData.title,
      description: productData.description || '',
      category: productData.category || 'Electronics',
      brand: productData.brand || 'Flipkart Assured',
      price,
      original_price,
      discount_percent: productData.discount_percent || discount_percent,
      stock: Number(productData.stock) || 10,
      image_url: productData.image_url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
      rating: Number(productData.rating) || 4.2,
      reviews_count: Number(productData.reviews_count) || 10,
      is_bestseller: !!productData.is_bestseller,
      is_big_billion_deal: productData.is_big_billion_deal !== false,
      created_at: new Date().toISOString()
    };

    if (this.supabaseAvailable) {
      try {
        const { data, error } = await supabase.from('products').insert([newProduct]).select().single();
        if (!error && data) return data;
      } catch (err) {}
    }

    memoryStore.products.unshift(newProduct);
    return newProduct;
  }

  async updateProduct(id, updates) {
    if (this.supabaseAvailable) {
      try {
        const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
        if (!error && data) return data;
      } catch (err) {}
    }

    const idx = memoryStore.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    memoryStore.products[idx] = { ...memoryStore.products[idx], ...updates, updatedAt: new Date().toISOString() };
    return memoryStore.products[idx];
  }

  async deleteProduct(id) {
    if (this.supabaseAvailable) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {}
    }

    const idx = memoryStore.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      memoryStore.products.splice(idx, 1);
      return true;
    }
    return false;
  }

  // --- ATOMIC ORDER PROCESSING FOR ORDER QUEUE ---
  async processOrder(orderData) {
    const { items, customer_name, customer_email, shipping_address, user_id, orderNumber, payment_method } = orderData;

    // 1. Check stock for all items
    for (const item of items) {
      const prod = await this.getProductById(item.productId || item.id);
      if (!prod) {
        return { success: false, message: `Product "${item.title || item.productId}" not found.` };
      }
      if (prod.stock < (item.quantity || 1)) {
        return { 
          success: false, 
          message: `Item "${prod.title}" is out of stock! Available: ${prod.stock}, Requested: ${item.quantity}` 
        };
      }
    }

    // 2. Deduct stock atomically
    for (const item of items) {
      const prod = await this.getProductById(item.productId || item.id);
      const newStock = Math.max(0, prod.stock - (item.quantity || 1));
      await this.updateProduct(prod.id, { stock: newStock });
    }

    // 3. Create confirmed order
    const orderRecord = {
      id: uuidv4(),
      order_number: orderNumber,
      user_id: user_id || null,
      customer_name,
      customer_email,
      customer_phone: orderData.customer_phone || '',
      shipping_address,
      items,
      total_amount: Number(orderData.total_amount),
      status: 'CONFIRMED',
      payment_method: payment_method || 'Cash on Delivery (Big Billion Pay)',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (this.supabaseAvailable) {
      try {
        const { data, error } = await supabase.from('orders').insert([orderRecord]).select().single();
        if (!error && data) {
          return { success: true, order: data };
        }
      } catch (err) {}
    }

    memoryStore.orders.unshift(orderRecord);
    return { success: true, order: orderRecord };
  }

  async getAllOrders() {
    if (this.supabaseAvailable) {
      try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {}
    }
    return memoryStore.orders;
  }

  async getOrdersByUser(user_id, email) {
    if (this.supabaseAvailable) {
      try {
        let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (user_id) query = query.eq('user_id', user_id);
        else if (email) query = query.eq('customer_email', email);
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (err) {}
    }
    return memoryStore.orders.filter(o => (user_id && o.user_id === user_id) || (email && o.customer_email === email));
  }

  async updateOrderStatus(id, status) {
    if (this.supabaseAvailable) {
      try {
        const { data, error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select().single();
        if (!error && data) return data;
      } catch (err) {}
    }

    const order = memoryStore.orders.find(o => o.id === id || o.order_number === id);
    if (!order) return null;
    order.status = status;
    order.updated_at = new Date().toISOString();
    return order;
  }
}

const dataStore = new DataStore();
module.exports = dataStore;
