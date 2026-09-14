// Firebase Configuration & Initialization Manager
// Allows dynamic configuration directly via Admin UI or pre-configured credentials

const FIREBASE_STORAGE_KEY = "keerthana_firebase_config";
const ADMIN_AUTH_KEY = "keerthana_admin_session";

// Default placeholder / demo config template
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  enabled: false
};

class FirebaseManager {
  constructor() {
    this.config = this.loadConfig();
    this.app = null;
    this.db = null;
    this.auth = null;
    this.isInitialized = false;
    this.firestoreDocRef = null;
    this.unsubscribeFirestore = null;
  }

  loadConfig() {
    try {
      const stored = localStorage.getItem(FIREBASE_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_FIREBASE_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn("Could not read Firebase config from storage", e);
    }
    return { ...DEFAULT_FIREBASE_CONFIG };
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    localStorage.setItem(FIREBASE_STORAGE_KEY, JSON.stringify(this.config));
    return this.init();
  }

  async init() {
    // Check if Firebase is configured
    if (!this.config.apiKey || !this.config.projectId || !this.config.enabled) {
      this.isInitialized = false;
      return { success: false, message: "Firebase is disabled or credentials not provided." };
    }

    try {
      // Check if Firebase Compat SDK is present on the window
      if (typeof firebase === "undefined") {
        return { success: false, message: "Firebase SDK is loading or not available." };
      }

      // Initialize or reuse Firebase app
      if (!firebase.apps.length) {
        this.app = firebase.initializeApp(this.config);
      } else {
        this.app = firebase.app();
      }

      this.db = firebase.firestore();
      this.auth = firebase.auth();
      this.isInitialized = true;
      return { success: true, message: "Firebase connected successfully!" };
    } catch (error) {
      console.error("Firebase init error:", error);
      this.isInitialized = false;
      return { success: false, message: error.message };
    }
  }

  // Real-time listener for Firestore document changes
  listenToPortfolio(onRemoteChange) {
    if (!this.isInitialized || !this.db) return null;

    try {
      if (this.unsubscribeFirestore) {
        this.unsubscribeFirestore();
      }

      this.unsubscribeFirestore = this.db
        .collection("portfolio")
        .doc("content")
        .onSnapshot(
          (doc) => {
            if (doc.exists) {
              const remoteData = doc.data();
              onRemoteChange(remoteData);
            }
          },
          (err) => {
            console.warn("Firestore snapshot error:", err);
          }
        );

      return this.unsubscribeFirestore;
    } catch (e) {
      console.error("Failed to attach Firestore listener", e);
      return null;
    }
  }

  // Push updated portfolio data to Firestore
  async pushPortfolioData(data) {
    if (!this.isInitialized || !this.db) {
      return { success: false, message: "Firebase not initialized" };
    }

    try {
      await this.db.collection("portfolio").doc("content").set(data, { merge: true });
      return { success: true, message: "Synced to Firebase Firestore in real time!" };
    } catch (e) {
      console.error("Failed to push data to Firestore:", e);
      return { success: false, message: e.message };
    }
  }

  // Save new contact message
  async pushContactMessage(message) {
    if (!this.isInitialized || !this.db) return null;
    try {
      const ref = await this.db.collection("inquiries").add({
        ...message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      return ref.id;
    } catch (e) {
      console.warn("Could not save message to Firestore", e);
      return null;
    }
  }
}

window.firebaseManager = new FirebaseManager();
