# bradther can you make a ai chatbox wi...

Here is a professional `README.md` for the **NexusAI** project. I have updated the design to reflect the "NexusAI" branding found in the code, while keeping the structure clean and professional.

```markdown
# NexusAI — Intelligent Multimodal Chat Interface

<div align="center">

![NexusAI Logo](https://platform-outputs.agnes-ai.space/images/t2i/387cda9aa98a4c1cb01712b18f5b19de.png)

**A modern, sleek AI chat application with persistent memory, conversation history, and multimodal support (Text, Image, Video).**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Production Ready](https://img.shields.io/badge/Status-Active-success.svg)]()

</div>

## 📖 Overview

NexusAI is a sophisticated web-based interface designed for seamless interaction with AI models. It goes beyond simple text chat by integrating **persistent memory**, **conversation history management**, and **multimodal capabilities**. Whether you are generating images, creating videos, or engaging in complex text conversations, NexusAI provides a fluid, glassmorphic UI that adapts to your workflow.

### ✨ Key Features

*   **🧠 Persistent Memory**: The AI remembers your preferences, facts, and context across sessions. View and manage stored memories in the dedicated panel.
*   **📚 Conversation History**: Easily switch between past chats, search through your history, and organize your workspace.
*   **🎨 Multimodal Support**:
    *   **Text**: High-quality LLM responses.
    *   **Images**: Generate stunning visuals using integrated AI image generation.
    *   **Video**: Create short video clips from text prompts.
*   **🎭 Dynamic UI**: A modern dark theme featuring glassmorphism, animated background orbs, and smooth transitions.
*   **⚡ Model Selector**: Switch between different AI models (Pro, Fast, Image, Video) directly from the top bar.
*   **🔒 Local Storage**: All chats and memory data are saved locally in your browser for privacy and persistence.

## 🛠️ Tech Stack

*   **Frontend**: HTML5, CSS3 (Custom Properties, Glassmorphism), Vanilla JavaScript (ES6+)
*   **Storage**: `localStorage` for chats and memory
*   **AI Integration**: Agnes AI API (Text, Image, Video)
*   **Design**: Custom CSS animations, Responsive Flexbox/Grid layout

## 🚀 Getting Started

You don't need to install any dependencies. This is a static web application.

### Prerequisites

*   A modern web browser (Chrome, Firefox, Edge, Safari)
*   An active API key for the Agnes AI service

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/mypassis/ai.git
    cd ai
    ```

2.  **Open the application**
    Simply open `index.html` in your preferred web browser.
    
    *Alternatively, use a local server:*
    ```bash
    # Using Python
    python -m http.server
    
    # Using Node.js
    npx serve
    ```

3.  **Configure API Key**
    Ensure your `.env` file or configuration script contains your valid `{{SITE_API_KEY}}` for the Agnes AI endpoints.

## 💻 Usage Guide

### Starting a Chat
Click the **"New Chat"** button in the sidebar. Type your message in the input field and press **Enter** or click the **Send** button.

### Generating Media
1.  Select the appropriate model from the dropdown (e.g., "NexusAI Image").
2.  Type a prompt (e.g., "A futuristic city at sunset").
3.  Click Send. The result will appear in the chat stream.

### Managing Memory
1.  Click the **Memory** icon in the top bar.
2.  Review stored facts and preferences.
3.  Add new memories manually or let the AI infer them during conversation.

### Searching History
Use the **Search Conversations** bar in the sidebar to quickly find past topics.

## 📂 Project Structure

```
├── index.html      # Main application structure
├── style.css       # Global styles, animations, and glassmorphism effects
├── script.js       # Core logic, API integration, memory management, and UI interactions
├── design.md       # Design system documentation
└── README.md       # Project documentation
```

## 🔮 Future Roadmap

*   [ ] Voice input/output support
*   [ ] Export chat history to PDF/Markdown
*   [ ] Collaborative chat rooms
*   [ ] Plugin system for custom AI integrations

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ by <strong>NexusAI Team</strong></p>
  <p>Powered by <strong>Agnes AI</strong></p>
</div>
```