const parkingContainer = document.getElementById("parking-container");
const availableCount = document.getElementById("available-count");
const lastSelected = document.getElementById("last-selected");
const message = document.getElementById("message");
const historyContainer = document.getElementById("history-container");

let allSlots=[];

async function loadSlots() {

    const response = await fetch("https://smart-parking-hi4o.onrender.com/api/slots");
    const slots = await response.json();
    allSlots=slots;

    parkingContainer.innerHTML = "";

    let availableSlots = 0;

    slots.forEach(slotData => {

        const slot = document.createElement("div");
        slot.classList.add("slot");

        const slotName = document.createElement("h3");
        slotName.innerText = "Slot " + slotData.id;

        const status = document.createElement("p");
        status.innerText = slotData.status.toUpperCase();

        const button = document.createElement("button");

        if (slotData.status === "Available") {

            button.innerText = "Reserve";
            slot.classList.add("available");
            availableSlots++;

        } else {

            button.innerText = "Release";
            slot.classList.add("occupied");
        }

        button.addEventListener("click", async function () {
             lastSelected.innerText = "Last Selected at: " +new Date().toLocaleString();
            let url;

            if (slotData.status === "Available") {
                url = `https://smart-parking-hi4o.onrender.com/api/slots/${slotData.id}/reserve`;
            } else {
                url = `https://smart-parking-hi4o.onrender.com/api/slots/${slotData.id}/release`;
            }

            const response = await fetch(url, {
                method: "POST"
            });


    if (response.ok) {

    if (slotData.status === "Available") {
        message.innerText = "✅ Slot " + slotData.id + " reserved successfully!";
    } else {
        message.innerText = "✅ Slot " + slotData.id + " released successfully!";
    }
    
    loadSlots();
    loadHistory();
    
} else {
    const data=await response.json();
    message.innerText = "❌ " + data.message;
}
        });

        slot.appendChild(slotName);
        slot.appendChild(status);
        slot.appendChild(button);

        parkingContainer.appendChild(slot);
    });

    updateCount(availableSlots);
   
}

async function loadHistory() {
const response = await fetch("https://smart-parking-hi4o.onrender.com/api/history");
const history = await response.json();


historyContainer.innerHTML = "";

history.forEach(record => {

    const item = document.createElement("div");
    item.classList.add("history-item");

    const slotName = document.createElement("strong");
    slotName.innerText = "Slot " + record.slot_id;

    const action = document.createElement("span");
    action.innerText = record.action.toUpperCase();
    action.classList.add(
        record.action === "Reserved" ? "history-reserved" : "history-released"
    );

    const time = document.createElement("small");
    time.innerText = new Date(record.action_time).toLocaleString();

    const topRow = document.createElement("div");
    topRow.classList.add("history-top");

    topRow.appendChild(slotName);
    topRow.appendChild(action);

    item.appendChild(topRow);
    item.appendChild(time);

    historyContainer.appendChild(item);
});


}


function updateCount(count) {

    availableCount.innerText = "Available Slots: " + count + " / 10";

    if (count === 0) {
        availableCount.innerText = "Parking Full";
    }
}

loadSlots();
loadHistory();
function showAvailableSlots() {
    const available = allSlots.filter(slot => slot.status === "Available");

    parkingContainer.innerHTML = "";
    if (available.length === 0) {
    parkingContainer.innerHTML = "<p>No parking slots available right now.</p>";
    return;
}

    available.forEach(slotData => {

        const slot = document.createElement("div");
        slot.classList.add("slot");

        const slotName = document.createElement("h3");
        slotName.innerText = "Slot " + slotData.id;

        const status = document.createElement("p");
        status.innerText = slotData.status.toUpperCase();

        const button = document.createElement("button");
        button.innerText = "Reserve";

        slot.classList.add("available"); 

        button.addEventListener("click", async function () {

            const response = await fetch(
                `https://smart-parking-hi4o.onrender.com/api/slots/${slotData.id}/reserve`,
                {
                    method: "POST"
                }
            );

            if (response.ok) {
                message.innerText =
                    "✅ Slot " + slotData.id + " reserved successfully!";

                lastSelected.innerText = "Last Selected at: " + new Date().toLocaleString();
                loadSlots();
                loadHistory();
            }
        });

        slot.appendChild(slotName);
        slot.appendChild(status);
        slot.appendChild(button);

        parkingContainer.appendChild(slot);
    });
}

function showAllSlots() {
    loadSlots();
}



document.getElementById("show-available").addEventListener("click", showAvailableSlots);

document.getElementById("show-all").addEventListener("click", showAllSlots);

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.innerText = "☀️ Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.innerText = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
    }
});


if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.innerText = "☀️ Light Mode";
}


// =========================
// AI PARKING ASSISTANT
// =========================

const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotWindow = document.getElementById("chatbot-window");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotMessages = document.getElementById("chatbot-messages");
const chatbotSend = document.getElementById("chatbot-send");

// Your deployed backend URL
const CHATBOT_API_URL = "https://smart-parking-hi4o.onrender.com/api/chat";

// Open chatbot
chatbotToggle.addEventListener("click", () => {
chatbotWindow.classList.toggle("hidden");


if (!chatbotWindow.classList.contains("hidden")) {
    chatbotInput.focus();
}


});

// Close chatbot
chatbotClose.addEventListener("click", () => {
chatbotWindow.classList.add("hidden");
});

// Display a message safely
function addChatMessage(message, sender) {
const messageElement = document.createElement("div");


messageElement.className =
    sender === "user" ? "user-message" : "bot-message";

messageElement.textContent = message;

chatbotMessages.appendChild(messageElement);
chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

return messageElement;


}

// Send question to backend
chatbotForm.addEventListener("submit", async (event) => {
event.preventDefault();


const question = chatbotInput.value.trim();

if (!question) return;

addChatMessage(question, "user");

chatbotInput.value = "";
chatbotSend.disabled = true;
chatbotInput.disabled = true;

const loadingMessage = addChatMessage(
    "Thinking... 🤖",
    "bot"
);

try {
    const response = await fetch(CHATBOT_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: question
        })
    });

    const data = await response.json();

    loadingMessage.remove();

    if (!response.ok) {
        throw new Error(
            data.message || "The AI assistant couldn't respond."
        );
    }

    addChatMessage(data.reply, "bot");

} catch (error) {
    loadingMessage.remove();

    console.error("Chatbot error:", error);

    addChatMessage(
        "Sorry, I couldn't connect to the AI assistant. Please try again.",
        "bot"
    );

} finally {
    chatbotSend.disabled = false;
    chatbotInput.disabled = false;
    chatbotInput.focus();
}


});





