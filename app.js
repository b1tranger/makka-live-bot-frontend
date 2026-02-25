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

// Documentation Viewer Logic
const viewDocBtn = document.getElementById("view-doc-btn");
const backToHomeBtn = document.getElementById("back-to-home-btn");
const docSection = document.getElementById("doc-section");
const mainContainerChildren = document.querySelectorAll(".container > *:not(#doc-section):not(footer)");
const docContent = document.getElementById("doc-content");

async function loadDoc(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("Failed to load documentation");
        const markdown = await response.text();

        // Render markdown
        docContent.innerHTML = marked.parse(markdown);

        // Handle internal links
        const links = docContent.querySelectorAll("a");
        links.forEach(link => {
            const href = link.getAttribute("href");
            if (href && href.endsWith(".md")) {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    // Resolve relative path
                    const currentDir = filePath.substring(0, filePath.lastIndexOf("/") + 1);
                    loadDoc(currentDir + href);
                });
            } else {
                link.setAttribute("target", "_blank");
            }
        });

        // Scroll to top of doc
        docSection.scrollTop = 0;
    } catch (error) {
        console.error("Doc Error:", error);
        docContent.innerHTML = `<p style="color: var(--error)">Error loading documentation: ${error.message}</p>`;
    }
}

function toggleDocView(show) {
    if (show) {
        mainContainerChildren.forEach(el => el.classList.add("hidden"));
        docSection.classList.remove("hidden");
        loadDoc("doc/README.md");
    } else {
        mainContainerChildren.forEach(el => el.classList.remove("hidden"));
        docSection.classList.add("hidden");
    }
}

if (viewDocBtn) {
    viewDocBtn.addEventListener("click", () => toggleDocView(true));
}

if (backToHomeBtn) {
    backToHomeBtn.addEventListener("click", () => toggleDocView(false));
}

// Update footer year dynamically
const footerYearElement = document.querySelector("footer p");
if (footerYearElement) {
    footerYearElement.innerHTML = `&copy; ${new Date().getFullYear()} | <a href="https://github.com/b1tranger" target="_blank" style="color: white;">b1tranger</a>`;
}
