document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    // Your FastAPI backend URL - adjust if needed
    const API_URL = 'http://localhost:8020/api/gemini/chat';
    
    // Add welcome message
    setTimeout(() => {
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'message bot-message';
        welcomeMsg.textContent = 'Hi there! I\'m Gemini. How can I help you today?';
        chatBox.appendChild(welcomeMsg);
    }, 500);
    
    // Function to clean up the response text
    function cleanResponse(text) {
        // Remove asterisks but preserve line breaks
        return text.replace(/\*\*/g, '')  // Remove bold markers
                  .replace(/\*/g, '')     // Remove italics markers
                  .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
                  .trim();
    }
    
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = isUser ? text : cleanResponse(text);
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, true);
        userInput.value = '';
        
        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot-message');
        loadingDiv.innerHTML = 'Thinking... <span class="loading"></span>';
        chatBox.appendChild(loadingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Remove loading indicator
            chatBox.removeChild(loadingDiv);
            
            // Add cleaned bot response
            addMessage(data.reply, false);
        } catch (error) {
            console.error('Error:', error);
            chatBox.removeChild(loadingDiv);
            addMessage("Sorry, I encountered an error. Please try again.", false);
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});