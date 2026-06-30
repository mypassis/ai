# bradther can you make a ai chatbox wi...

I will create a comprehensive `README.md` file for the NexusAI project, detailing its features, installation, and usage based on the provided code structure.

[write_file]
path: README.md
content: # NexusAI — Intelligent Multi-Modal Chat Assistant

<div align="center">

![NexusAI Logo](https://platform-outputs.agnes-ai.space/images/t2i/387cda9aa98a4c1cb01712b18f5b19de.png)

**A modern, AI-powered chat interface with memory, history, and multi-modal generation capabilities.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Stable](https://img.shields.io/badge/status-stable-brightgreen.svg)]()
[![Agnes AI](https://img.shields.io/badge/AI-Agnes%202.0%20Flash-blue.svg)](https://agnes-ai.com)

</div>

---

## 📖 Description

NexusAI is a sophisticated, self-hosted intelligent chat application built for modern workflows. It combines natural language processing with multi-modal content generation, allowing users to interact via text, images, and video. 

Unlike standard chatbots, NexusAI features **persistent memory** and **conversation history**, ensuring that interactions feel continuous and contextual. It leverages the power of the Agnes AI API to deliver high-performance responses and media generation.

### ✨ Key Features

*   **🧠 Intelligent Memory**: The AI remembers past interactions, user preferences, and context across sessions.
*   **📜 Conversation History**: Easily browse, search, and resume previous chats via a dedicated sidebar.
*   **🎨 Multi-Modal Generation**:
    *   **Text**: Fast and complex reasoning with NexusAI Pro.
    *   **Images**: Generate stunning visuals on demand.
    *   **Video**: Create short video clips from text prompts.
*   **⚡ Model Switching**: Seamlessly switch between "Pro" (complex tasks) and "Fast" (quick responses) models.
*   **🌙 Modern UI/UX**: 
    *   Sleek dark theme with glassmorphism effects.
    *   Animated background orbs and grid overlays.
    *   Fully responsive design for desktop and mobile.
*   **💾 Local Persistence**: All chats and memory are saved locally in your browser using `localStorage`.

---

## 🚀 Getting Started

### Prerequisites

*   A modern web browser (Chrome, Firefox, Edge, Safari).
*   No server setup required! This is a static client-side application.

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/mypassis/ai.git
    cd ai
    ```

2.  **Open the Application**
    Simply open `index.html` in your web browser.
    
    *Note: For best results with some browser security policies regarding local storage and APIs, it is recommended to run this through a local server (e.g., VS Code Live Server).*

    ```bash
    # Example using Python
    python -m http.server
    
    # Example using Node.js
    npx serve
    ```

3.  **API Configuration**
    The application uses the Agnes AI API. Ensure the environment variable `{{SITE_API_KEY}}` is correctly configured in the deployment environment or replace the placeholder in `script.js` if running locally without auto-injection.

---

## 📁 Project Structure

```text
├── index.html      # Main application structure
├── style.css       # Styling, animations, and glassmorphism effects
├── script.js       # Core logic, AI integration, memory management, and state
├── design.md       # Design system guidelines
└── README.md       # Project documentation
```

---

## 🛠️ Technology Stack

*   **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
*   **Styling**: CSS Variables, Flexbox, Grid, Backdrop Filters
*   **AI Backend**: Agnes AI API (`agnes-2.0-flash`, `agnes-image-2.0-flash`, `agnes-video-v2.0`)
*   **Storage**: Browser `localStorage` for chats and memory persistence

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue.

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ by <strong>NexusAI Team</strong></p>
  <p>Powered by <strong>Agnes AI</strong></p>
</div>
</content>