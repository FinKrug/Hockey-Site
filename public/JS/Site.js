// Always start on Step 1 unless coming back from payment
const params = new URLSearchParams(window.location.search);
const paid = params.get("paid");

if (paid === "true") {
    // Show Step 2
    document.getElementById("doc-step").style.display = "none";
    document.getElementById("form-step").style.display = "block";
} else {
    // Always show Step 1 first
    document.getElementById("doc-step").style.display = "block";
    document.getElementById("form-step").style.display = "none";
}

// Check URL for ?new=true
const urlParams = new URLSearchParams(window.location.search);
const isNewRegistration = urlParams.get("new") === "true";

// If user already submitted AND not starting a new registration → redirect
if (!isNewRegistration && localStorage.getItem("srvcFormSubmitted") === "true") {
    window.location.href = "thanks.html";
}

// If starting a new registration → clear saved data + submission flag
if (isNewRegistration) {
    localStorage.removeItem("srvcRegistrationData");
    localStorage.removeItem("srvcFormSubmitted");
    localStorage.removeItem("srvcStepCompleted");
}

const form = document.querySelector(".register-form");
const STORAGE_KEY = "srvcRegistrationData";

// Load saved data on page load (ONLY if not new registration)
window.addEventListener("DOMContentLoaded", () => {
    if (isNewRegistration) return; // ← prevents restoring old data

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return;

    for (const [key, value] of Object.entries(saved)) {
        const field = form.elements[key];
        if (!field) continue;

        if (field.type === "checkbox") {
            field.checked = value;
        } else {
            field.value = value;
        }
    }
});

// Save data whenever a field changes
form.addEventListener("input", () => {
    const data = {};
    for (const field of form.elements) {
        if (!field.name) continue;

        data[field.name] = field.type === "checkbox"
            ? field.checked
            : field.value;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
});

// Handle form submission with await + redirect
document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // stop normal form submission

    const form = e.target;

    // Disable submit button immediately
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const formData = new FormData(form);

    // Send POST request manually
    await fetch("https://script.google.com/macros/s/AKfycbwk4gnWTISvhbuXdQnf116At7bjLxs718Fodr3uOenS-TEidVTgD2v0BEPvvmA4Yi3g7Q/exec", {
        method: "POST",
        body: formData
    });

    // Mark form as submitted
    localStorage.setItem("srvcFormSubmitted", "true");

    // Clear saved data
    localStorage.removeItem("srvcRegistrationData");

    // Redirect AFTER the POST finishes
    window.location.href = "thanks.html";
});
document.getElementById("docForm").addEventListener("submit", function (e) {
    e.preventDefault();

    if (this.checkValidity()) {
        // Save doc completion if you still want it
        localStorage.setItem("srvcStepCompleted", "true");

        // Redirect to payment page
        window.location.href = "payment.html";
    } else {
        this.reportValidity();
    }
});
document.querySelectorAll(".doc-check").forEach(check => {
    check.addEventListener("change", () => {
        const docState = [];
        document.querySelectorAll(".doc-check").forEach(c => {
            docState.push(c.checked);
        });
        localStorage.setItem("srvcDocChecks", JSON.stringify(docState));
    });
});
const savedDocs = JSON.parse(localStorage.getItem("srvcDocChecks"));
if (savedDocs) {
    const checks = document.querySelectorAll(".doc-check");
    checks.forEach((c, i) => {
        c.checked = savedDocs[i];
    });
}