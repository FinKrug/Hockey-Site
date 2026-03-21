console.log("Site.js loaded");
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCifDL5R72cq3Al5FzikSbeGk2PUStrAGY",
    authDomain: "srvc-camp.firebaseapp.com",
    projectId: "srvc-camp",
    storageBucket: "srvc-camp.firebasestorage.app",
    messagingSenderId: "205632013147",
    appId: "1:205632013147:web:7a0c8c00836c04a55a907e",
    measurementId: "G-N3DHCXYTQD"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const db = firebase.firestore();

document.querySelector(".register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });
    try {
        console.log("Sending to Firestore:", data);
        await db.collection("registrations").add(data);
        console.log("Firestore write complete");
    } catch (error) {
        console.error("Firestore error:", error.code, error.message);
    }
});