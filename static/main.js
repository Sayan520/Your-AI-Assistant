const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function addMessage(role, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role);

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.textContent = text;

    messageDiv.appendChild(textDiv);
    messagesDiv.appendChild(messageDiv);

    // Scroll to the bottom manually
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function simulateTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'bot');
    typingDiv.innerHTML = '<div class="text typing">Typing...</div>';
    messagesDiv.appendChild(typingDiv);

    // Keep the typing message while waiting for a response
    return typingDiv;
}

async function sendMessage() {
    const userMessage = messageInput.value.trim();

    if (!userMessage) return;

    addMessage('user', userMessage); // Add user's message
    messageInput.value = '';

    const typingIndicator = simulateTyping(); // Show typing indicator

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();
        messagesDiv.removeChild(typingIndicator); // Remove typing indicator
        addMessage('bot', data.response); // Add bot's response
    } catch (error) {
        console.error('Error:', error);
        messagesDiv.removeChild(typingIndicator); // Remove typing indicator
        addMessage('bot', 'Error occurred, please try again.');
    }
}
