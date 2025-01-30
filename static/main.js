document.getElementById("sendBtn").addEventListener("click", function() {
    sendMessage();
});

document.getElementById("messageInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function addMessage(role, text) {
    const messagesDiv = document.getElementById("messages");
    const userGif = "static/icons8-circled-user-male-skin-type-4.gif";
    const botGif = "static/icons8-robot.gif";

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", role);

    const avatar = document.createElement("img");
    avatar.src = role === "user" ? userGif : botGif;
    avatar.alt = role === "user" ? "User" : "Bot";

    const textDiv = document.createElement("div");
    textDiv.classList.add("text");
    textDiv.textContent = text;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(textDiv);
    messagesDiv.appendChild(messageDiv);

    // Scroll to the bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function simulateTyping() {
    const messagesDiv = document.getElementById("messages");
    const botGif = "static/icons8-robot.gif";

    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot");

    const avatar = document.createElement("img");
    avatar.src = botGif;
    avatar.alt = "Bot";

    const textDiv = document.createElement("div");
    textDiv.classList.add("text", "typing");
    textDiv.textContent = "Typing...";

    typingDiv.appendChild(avatar);
    typingDiv.appendChild(textDiv);
    messagesDiv.appendChild(typingDiv);

    return typingDiv;
}

async function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const userMessage = messageInput.value.trim();

    if (!userMessage) return;

    addMessage("user", userMessage);
    messageInput.value = "";

    const typingIndicator = simulateTyping();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();
        document.getElementById("messages").removeChild(typingIndicator);
        addMessage("bot", data.response);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("messages").removeChild(typingIndicator);
        addMessage("bot", "Error occurred, please try again.");
    }
}
