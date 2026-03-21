document.getElementById("registerForm").addEventListener("submit", async function(e) {
    e.preventDefault(); // stop normal form submission

    const form = e.target;
    const formData = new FormData(form);

    // Send POST request manually
    await fetch("https://script.google.com/macros/s/AKfycbwk4gnWTISvhbuXdQnf116At7bjLxs718Fodr3uOenS-TEidVTgD2v0BEPvvmA4Yi3g7Q/exec", {
        method: "POST",
        body: formData
    });

    // Redirect AFTER the POST finishes
    window.location.href = "thanks.html";
});
