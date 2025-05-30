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
    recognition.lang = "en-US";  
    recognition.continuous = false;  
    recognition.interimResults = false;  

    micBtn.addEventListener("click", () => {
        micBtn.classList.add("recording");  // Start animation
        recognition.start();  
    });

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;  
        messageInput.value = transcript;  
        sendMessage();  
    };

    recognition.onend = function () {
        micBtn.classList.remove("recording");  // Stop animation
    };       

    function addMessage(role, text) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", role);

        const avatar = document.createElement("img");
        avatar.src = role === "user" ? "static/assets/icons8-circled-user-male-skin-type-4.gif" : "static/assets/icons8-robot.gif";
        avatar.alt = role === "user" ? "User" : "Bot";

        const textDiv = document.createElement("div");
        textDiv.classList.add("text");
        textDiv.textContent = text;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(textDiv);
        messagesDiv.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.opacity = "1";
            messageDiv.style.transform = "translateY(0)";
        }, 50);

        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function simulateTyping() {
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("message", "bot");

        const avatar = document.createElement("img");
        avatar.src = "static/assets/icons8-robot.gif";
        avatar.alt = "Bot";

        const textDiv = document.createElement("div");
        textDiv.classList.add("text", "typing");
        textDiv.innerHTML = "Typing<span class='dot'>.</span><span class='dot'>.</span><span class='dot'>.</span>";

        typingDiv.appendChild(avatar);
        typingDiv.appendChild(textDiv);
        messagesDiv.appendChild(typingDiv);

        return typingDiv;
    }

    // 🗣️ Function to Make the Bot Speak (Commented out for future use)
    function speakText(text) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";  // Set language
        speech.rate = 1;  // Speed (1 = normal, 0.5 = slow, 1.5 = fast)
        speech.pitch = 1;  // Pitch (1 = normal, 0.5 = deep, 1.5 = high)
        speech.volume = 1;  // Volume (0 to 1)

        // Use the first available voice
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            speech.voice = voices[0];
        }

        speechSynthesis.speak(speech);
    }

    async function sendMessage() {
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;  
    
        addMessage("user", userMessage);  
        messageInput.value = "";  
        messageInput.disabled = true;
        sendBtn.disabled = true;
        sendBtn.textContent = "Sending...";

        const typingIndicator = simulateTyping();  
    
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });
    
            const data = await response.json();
            messagesDiv.removeChild(typingIndicator);  
            addMessage("bot", data.response);
            
            // 🗣️ Uncomment this line if you want the bot to speak its response
            // speakText(data.response);

        } catch (error) {
            console.error("Error:", error);
            messagesDiv.removeChild(typingIndicator);
            addMessage("bot", "Error occurred, please try again.");
            
            // 🗣️ Uncomment this line if you want the bot to speak the error message
            // speakText("Error occurred, please try again.");
        } 
        
        messageInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.textContent = "Send";
        messageInput.focus();
    }    
});
