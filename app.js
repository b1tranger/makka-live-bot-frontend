const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");
const backendInput = document.getElementById("backend-url");

const inviteSection = document.getElementById("invite-section");

let baseUrl = backendInput.value.replace(/\/$/, "");

backendInput.addEventListener("change", () => {
    baseUrl = backendInput.value.replace(/\/$/, "");
    checkStatus();
});

async function apiCall(endpoint, method = "GET") {
    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return { error: "Could not connect to backend" };
    }
}

async function checkStatus() {
    const data = await apiCall("/status");

    if (data.status === "running") {
        updateUI(true);
    } else if (data.status === "stopped") {
        updateUI(false);
    } else {
        statusText.innerText = "Status: Connection Error";
        statusDot.className = "dot stopped";
        startBtn.disabled = true;
        stopBtn.disabled = true;
    }
}

function updateUI(isRunning) {
    if (isRunning) {
        statusText.innerText = "Status: Running";
        statusDot.className = "dot running";
        startBtn.disabled = true;
        stopBtn.disabled = false;
    } else {
        statusText.innerText = "Status: Stopped";
        statusDot.className = "dot stopped";
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
}

startBtn.addEventListener("click", async () => {
    startBtn.disabled = true;
    statusText.innerText = "Status: Starting...";
    const data = await apiCall("/start", "POST");
    if (data.error) {
        alert(data.error);
        checkStatus();
    } else {
        setTimeout(checkStatus, 2000); // Give bot a moment to initialize
    }
});

stopBtn.addEventListener("click", async () => {
    stopBtn.disabled = true;
    statusText.innerText = "Status: Stopping...";
    const data = await apiCall("/stop", "POST");
    if (data.error) {
        alert(data.error);
        checkStatus();
    } else {
        setTimeout(checkStatus, 1000);
    }
});

// Initial check
checkStatus();
// Poll every 5 seconds
setInterval(checkStatus, 5000);

// Update footer year dynamically
const footerYearElement = document.querySelector("footer p");
if (footerYearElement) {
    footerYearElement.innerHTML = `&copy; ${new Date().getFullYear()} | <a href="https://github.com/b1tranger" target="_blank" style="color: white;">b1tranger</a>`;
}
