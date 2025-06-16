async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const message = userInput.value;

    chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
    userInput.value = "";

    try {
        const response = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        const botReply = data.reply;

        chatBox.innerHTML += `<div><strong>Bot:</strong> ${marked.parse(botReply)}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        chatBox.innerHTML += `<div><strong>Bot:</strong> Error connecting to server.</div>`;
    }
}
