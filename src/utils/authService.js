// Authentication Service - LocalStorage based
const USERS_KEY = 'taxgrid_users';
const CURRENT_USER_KEY = 'taxgrid_current_user';

export const authService = {
  // Register new user
  register(email, password, businessName) {
    const users = this.getUsers();

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, this should be hashed
      businessName,
      createdAt: new Date().toISOString(),
      suppliers: [],
      riskAlerts: []
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { success: true, user: this.sanitizeUser(newUser) };
  },

  // Login
  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(this.sanitizeUser(user)));
    return { success: true, user: this.sanitizeUser(user) };
  },

  // Logout
  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Get current logged-in user
  getCurrentUser() {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is logged in
  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  // Get all users
  getUsers() {
    const usersStr = localStorage.getItem(USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  },

  // Update user data
  updateUser(userId, updates) {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Update current user if it's the same
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(this.sanitizeUser(users[userIndex])));
    }

    return { success: true, user: this.sanitizeUser(users[userIndex]) };
  },

  // Add supplier
  addSupplier(userId, supplier) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!user.suppliers) {
      user.suppliers = [];
    }

    const newSupplier = {
      id: Date.now().toString(),
      ...supplier,
      addedAt: new Date().toISOString(),
      lastVerified: new Date().toISOString(),
      status: 'active'
    };

    user.suppliers.push(newSupplier);
    return this.updateUser(userId, { suppliers: user.suppliers });
  },

  // Remove supplier
  removeSupplier(userId, supplierId) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    user.suppliers = user.suppliers.filter(s => s.id !== supplierId);
    return this.updateUser(userId, { suppliers: user.suppliers });
  },

  // Add risk alert
  addRiskAlert(userId, alert) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!user.riskAlerts) {
      user.riskAlerts = [];
    }

    const newAlert = {
      id: Date.now().toString(),
      ...alert,
      createdAt: new Date().toISOString(),
      read: false
    };

    user.riskAlerts.unshift(newAlert); // Add to beginning
    return this.updateUser(userId, { riskAlerts: user.riskAlerts });
  },

  // Mark alert as read
  markAlertAsRead(userId, alertId) {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const alert = user.riskAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.read = true;
    }

    return this.updateUser(userId, { riskAlerts: user.riskAlerts });
  },

  // Sanitize user (remove password)
  sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
};
