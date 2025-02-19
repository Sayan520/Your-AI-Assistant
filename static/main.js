document.addEventListener("DOMContentLoaded", function () {
    const sendBtn = document.getElementById("sendBtn");  // The "Send" button
    const messageInput = document.getElementById("messageInput");  // The text input field
    const micBtn = document.getElementById("micBtn");  // The microphone button
    const messagesDiv = document.getElementById("messages");  // The chat messages area
    

    sendBtn.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage();
    });

    // 🎤 Voice Input Setup
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";  // Set language to English
    recognition.continuous = false;  // Only recognize once per activation
    recognition.interimResults = false;  // Wait until the user finishes speaking

    micBtn.addEventListener("click", () => {
        micBtn.style.background = "#00bfff";  // Indicate recording when change mic button color to blue
        recognition.start();  // Start voice recognition
    });

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;  // Get recognized text
        messageInput.value = transcript;  // Fill input field with recognized text
        sendMessage();  // Auto-send the message after speaking
    };
    
    recognition.onend = function () {
        micBtn.style.background = "rgba(255, 255, 255, 0.2)";  // Reset color after recording stops
    };       

    function addMessage(role, text) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", role);

        const avatar = document.createElement("img");
        avatar.src = role === "user" ? "static/icons8-circled-user-male-skin-type-4.gif" : "static/icons8-robot.gif";
        avatar.alt = role === "user" ? "User" : "Bot";

        const textDiv = document.createElement("div");
        textDiv.classList.add("text");
        textDiv.textContent = text;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(textDiv);
        messagesDiv.appendChild(messageDiv);

        // Apply fade-in effect
        setTimeout(() => {
            messageDiv.style.opacity = "1";
            messageDiv.style.transform = "translateY(0)";
        }, 50);

        // Scroll to the latest message
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function simulateTyping() {
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("message", "bot");

        const avatar = document.createElement("img");
        avatar.src = "static/icons8-robot.gif";
        avatar.alt = "Bot";

        const textDiv = document.createElement("div");
        textDiv.classList.add("text", "typing");
        textDiv.innerHTML = "Typing<span class='dot'>.</span><span class='dot'>.</span><span class='dot'>.</span>";

        typingDiv.appendChild(avatar);
        typingDiv.appendChild(textDiv);
        messagesDiv.appendChild(typingDiv);

        return typingDiv;
    }

    // 🎙️ Function to Make the Bot Speak
    // function speakText(text) {
    //     const speech = new SpeechSynthesisUtterance(text);
    //     speech.lang = "en-US";  // Set language
    //     speech.rate = 1;  // Speed (1 = normal, 0.5 = slow, 1.5 = fast)
    //     speech.pitch = 1;  // Pitch (1 = normal, 0.5 = deep, 1.5 = high)
    //     speech.volume = 1;  // Volume (0 to 1)

    //     // Use the first available voice
    //     const voices = speechSynthesis.getVoices();
    //     if (voices.length > 0) {
    //         speech.voice = voices[0];
    //     }

    //     speechSynthesis.speak(speech);
    // }

    async function sendMessage() {
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;  // Don't send empty messages
    
        addMessage("user", userMessage);  // Add user message to chat
        messageInput.value = "";  // Clear input field
        messageInput.disabled = true;
        sendBtn.disabled = true;
        sendBtn.textContent = "Sending...";

        const typingIndicator = simulateTyping();  // Show "Typing..." effect
    
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });
    
            const data = await response.json();
            messagesDiv.removeChild(typingIndicator);  // Remove "Typing..."
            addMessage("bot", data.response);
            
             // 🗣️ Make the bot speak its response
            // speakText(data.response);
        } catch (error) {
            console.error("Error:", error);
            messagesDiv.removeChild(typingIndicator);
            addMessage("bot", "Error occurred, please try again.");
            // speakText("Error occurred, please try again.");

        } 
    
        messageInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.textContent = "Send";
        messageInput.focus();
    }    
});
