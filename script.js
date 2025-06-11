let previousSearches = [];

async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userMessage = input.value.trim();

  if (!userMessage) return;

  // Save to previous searches
  previousSearches.push(userMessage);

  // Display user message
  const userDiv = document.createElement("div");
  userDiv.className = "message user";
  userDiv.textContent = userMessage;
  chatBox.appendChild(userDiv);
  input.value = "";

  try {
    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    const botDiv = document.createElement("div");
    botDiv.className = "message bot";
    botDiv.textContent = data.bot || "❌ No response from server.";
    chatBox.appendChild(botDiv);
  } catch (err) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "message bot";
    errorDiv.textContent = "⚠️ Error connecting to server.";
    chatBox.appendChild(errorDiv);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleKey(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
}


// 🆕 New Chat
document.getElementById("new-chat").addEventListener("click", () => {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";
  const welcome = document.createElement("div");
  welcome.className = "message bot";
  welcome.textContent = "👋 New chat started! Ask me anything...";
  chatBox.appendChild(welcome);
});

// 🔍 Search Chat
document.getElementById("search-chat").addEventListener("click", () => {
  const term = prompt("Enter keyword to search:");
  if (!term) return;

  const messages = document.querySelectorAll("#chat-box .message");
  messages.forEach(msg => {
    if (msg.textContent.toLowerCase().includes(term.toLowerCase())) {
      msg.style.backgroundColor = "#fff176"; // highlight
    } else {
      msg.style.backgroundColor = ""; // reset
    }
  });
});

// 🕘 Dynamic Previous Searches
document.getElementById("previous-searches").addEventListener("click", () => {
  if (previousSearches.length === 0) {
    alert("No previous searches yet.");
  } else {
    const list = previousSearches.map((q, i) => `${i + 1}. ${q}`).join("\n");
    alert("Previous Searches:\n" + list);
  }
});

// ⚙️ Settings (placeholder)
document.getElementById("settings").addEventListener("click", () => {
  alert("Settings panel is under construction.");
});
