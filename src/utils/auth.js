// Local Authentication System using localStorage
// Simple auth for development - stores users in browser localStorage



const AUTH_STORAGE_KEY = 'revieree_users';
const SESSION_STORAGE_KEY = 'revieree_session';
const AUTH_TOKEN_KEY = 'auth_token';

// Get all users from localStorage
const getUsers = () => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Check if user has a password set
export const hasPasswordSet = (userId) => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  return user && user.password;
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
};

// Get current session
export const getCurrentUser = () => {
  const session = localStorage.getItem(SESSION_STORAGE_KEY);
  return session ? JSON.parse(session) : null;
};

// Check if user is logged in
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Sign up new user
export const signUp = (email, password, name) => {
  const users = getUsers();

  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'User with this email already exists' };
  }

  const newUser = {
    id: Date.now(),
    email,
    password, // In production, this should be hashed
    name,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, user: { id: newUser.id, email: newUser.email, name: newUser.name } };
};

// Sign in user
export const signIn = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  const session = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  // Set auth token and session
  const authToken = `token_${user.id}_${Date.now()}`;
  localStorage.setItem(AUTH_TOKEN_KEY, authToken);
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

  // Migrate guest cart to user cart
  // This will be handled by the cart utility when it detects authentication

  return { success: true, user: session };
};

// Sign out user
export const signOut = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  return { success: true };
};

// Google Sign In (Real Google OAuth)
export const signInWithGoogle = (googleUser) => {
  // googleUser contains: sub (id), email, name, picture from Google
  const googleUserData = typeof googleUser === 'object' ? googleUser : {};
  
  const user = {
    id: googleUserData.sub || Date.now(),
    email: googleUserData.email || 'googleuser@gmail.com',
    name: googleUserData.name || 'Google User',
    picture: googleUserData.picture,
    isGoogleUser: true,
  };

  // Set auth token and session
  const authToken = `google_${user.id}_${Date.now()}`;
  localStorage.setItem(AUTH_TOKEN_KEY, authToken);
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));

  // Migrate guest cart to user cart
  // This will be handled by the cart utility when it detects authentication

  return { success: true, user };
};

// Update user profile
export const updateProfile = (userId, updates) => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }

  // Update user data
  users[userIndex] = { ...users[userIndex], ...updates };
  saveUsers(users);

  // Update session if name or email changed
  const currentSession = getCurrentUser();
  if (currentSession && currentSession.id === userId) {
    const updatedSession = {
      ...currentSession,
      email: updates.email || currentSession.email,
      name: updates.name || currentSession.name,
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedSession));
  }

  return { success: true, user: users[userIndex] };
};

// Change password
export const changePassword = (userId, currentPassword, newPassword) => {
  // Validate password requirements: 8+ chars, alphanumeric + symbol
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return { success: false, error: 'Password must be at least 8 characters with letters, numbers, and a symbol' };
  }

  const users = getUsers();
  let user = users.find(u => u.id === userId);

  // If user not found in users array (e.g., Google user), create a new entry
  if (!user) {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      // Create new user entry for Google user
      const newUser = {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        password: newPassword,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      saveUsers(users);
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  }

  // Check if new password is same as current password
  if (user.password && user.password === newPassword) {
    return { success: false, error: 'New password cannot be the same as current password' };
  }

  // For existing users with password, verify current password
  if (user.password && user.password !== currentPassword) {
    return { success: false, error: 'Current password is incorrect' };
  }

  const userIndex = users.findIndex(u => u.id === userId);
  users[userIndex].password = newPassword;
  saveUsers(users);

  return { success: true };
};

// Reset password (forgot password)
export const resetPassword = (email, newPassword) => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    return { success: false, error: 'No user found with this email' };
  }

  users[userIndex].password = newPassword; // In production, this should be hashed
  saveUsers(users);

  return { success: true };
};

// Get user by email (for forgot password)
export const getUserByEmail = (email) => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  return user ? { id: user.id, email: user.email, name: user.name } : null;
};