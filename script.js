// ============================================
// NEXUS AI — JAVASCRIPT
// Chat Logic, History, Memory, Media Generation
// ============================================

class NexusAI {
    constructor() {
        // State
        this.chats = JSON.parse(localStorage.getItem('nexus_chats')) || [];
        this.currentChatId = null;
        this.memory = JSON.parse(localStorage.getItem('nexus_memory')) || {
            preferences: [],
            facts: [],
            context: []
        };
        this.attachments = [];
        this.isGenerating = false;
        this.selectedModel = 'nexus-pro';

        // DOM Elements
        this.elements = {
            sidebar: document.getElementById('sidebar'),
            sidebarOverlay: document.getElementById('sidebarOverlay'),
            sidebarToggle: document.getElementById('sidebarToggle'),
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            newChatBtn: document.getElementById('newChatBtn'),
            searchInput: document.getElementById('searchInput'),
            chatHistory: document.getElementById('chatHistory'),
            chatArea: document.getElementById('chatArea'),
            messagesContainer: document.getElementById('messagesContainer'),
            welcomeScreen: document.getElementById('welcomeScreen'),
            chatInput: document.getElementById('chatInput'),
            sendBtn: document.getElementById('sendBtn'),
            previewArea: document.getElementById('previewArea'),
            imageUploadBtn: document.getElementById('imageUploadBtn'),
            videoUploadBtn: document.getElementById('videoUploadBtn'),
            fileUploadBtn: document.getElementById('fileUploadBtn'),
            imageFileInput: document.getElementById('imageFileInput'),
            videoFileInput: document.getElementById('videoFileInput'),
            fileInput: document.getElementById('fileInput'),
            modelSelector: document.getElementById('modelSelector'),
            modelDropdown: document.getElementById('modelDropdown'),
            modelIndicator: document.getElementById('modelIndicator'),
            memoryBtn: document.getElementById('memoryBtn'),
            memoryPanel: document.getElementById('memoryPanel'),
            panelOverlay: document.getElementById('panelOverlay'),
            panelClose: document.getElementById('panelClose'),
            memoryBody: document.getElementById('memoryBody'),
            settingsBtn: document.getElementById('settingsBtn'),
            settingsPanel: document.getElementById('settingsPanel'),
            settingsClose: document.getElementById('settingsClose'),
            clearDataBtn: document.getElementById('clearDataBtn')
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderChatHistory();
        this.updateMemoryPanel();
        
        // Auto-resize textarea
        this.elements.chatInput.addEventListener('input', () => {
            this.autoResizeTextarea();
        });

        // Enter to send
        this.elements.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Load last chat or show welcome
        if (this.chats.length > 0) {
            this.loadChat(this.chats[0].id);
        } else {
            this.showWelcomeScreen();
        }
    }

    setupEventListeners() {
        const el = this.elements;

        // Sidebar toggle
        el.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        el.mobileMenuBtn.addEventListener('click', () => this.toggleMobileSidebar());
        el.sidebarOverlay.addEventListener('click', () => this.closeMobileSidebar());

        // New chat
        el.newChatBtn.addEventListener('click', () => this.createNewChat());

        // Search
        el.searchInput.addEventListener('input', (e) => this.filterChats(e.target.value));

        // Send message
        el.sendBtn.addEventListener('click', () => this.sendMessage());

        // Model selector
        el.modelSelector.addEventListener('click', () => this.toggleModelDropdown());
        document.querySelectorAll('.model-option').forEach(option => {
            option.addEventListener('click', () => this.selectModel(option));
        });

        // File uploads
        el.imageUploadBtn.addEventListener('click', () => el.imageFileInput.click());
        el.videoUploadBtn.addEventListener('click', () => el.videoFileInput.click());
        el.fileUploadBtn.addEventListener('click', () => el.fileInput.click());

        el.imageFileInput.addEventListener('change', (e) => this.handleFileUpload(e, 'image'));
        el.videoFileInput.addEventListener('change', (e) => this.handleFileUpload(e, 'video'));
        el.fileInput.addEventListener('change', (e) => this.handleFileUpload(e, 'file'));

        // Memory panel
        el.memoryBtn.addEventListener('click', () => this.openPanel(el.memoryPanel));
        el.panelClose.addEventListener('click', () => this.closePanel(el.memoryPanel));

        // Settings panel
        el.settingsBtn.addEventListener('click', () => this.openPanel(el.settingsPanel));
        el.settingsClose.addEventListener('click', () => this.closePanel(el.settingsPanel));

        // Close panels on overlay click
        el.panelOverlay.addEventListener('click', () => {
            this.closePanel(el.memoryPanel);
            this.closePanel(el.settingsPanel);
        });

        // Clear data
        el.clearDataBtn.addEventListener('click', () => this.clearAllData());

        // Suggestion cards
        document.querySelectorAll('.suggestion-card').forEach(card => {
            card.addEventListener('click', () => {
                const prompt = card.dataset.prompt;
                this.elements.chatInput.value = prompt;
                this.sendMessage();
            });
        });

        // Close dropdown on outside click
        document.addEventListener('click', (e) => {
            if (!el.modelSelector.contains(e.target)) {
                el.modelDropdown.classList.remove('active');
            }
        });
    }

    // ==================== SIDEBAR ====================

    toggleSidebar() {
        this.elements.sidebar.classList.toggle('collapsed');
    }

    toggleMobileSidebar() {
        this.elements.sidebar.classList.add('open');
        this.elements.sidebarOverlay.classList.add('active');
    }

    closeMobileSidebar() {
        this.elements.sidebar.classList.remove('open');
        this.elements.sidebarOverlay.classList.remove('active');
    }

    // ==================== CHAT MANAGEMENT ====================

    createNewChat() {
        const chat = {
            id: Date.now().toString(),
            title: 'New Chat',
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.chats.unshift(chat);
        this.saveChats();
        this.renderChatHistory();
        this.loadChat(chat.id);
        this.closeMobileSidebar();
    }

    loadChat(chatId) {
        this.currentChatId = chatId;
        const chat = this.chats.find(c => c.id === chatId);
        
        if (!chat) return;

        this.hideWelcomeScreen();
        this.renderMessages(chat.messages);
        this.updateActiveHistoryItem(chatId);
        this.saveChats();
    }

    deleteChat(chatId, event) {
        event.stopPropagation();
        
        this.chats = this.chats.filter(c => c.id !== chatId);
        this.saveChats();
        this.renderChatHistory();

        if (this.currentChatId === chatId) {
            if (this.chats.length > 0) {
                this.loadChat(this.chats[0].id);
            } else {
                this.currentChatId = null;
                this.showWelcomeScreen();
            }
        }
    }

    filterChats(query) {
        const items = document.querySelectorAll('.history-item');
        const lowerQuery = query.toLowerCase();

        items.forEach(item => {
            const text = item.querySelector('.history-text').textContent.toLowerCase();
            item.style.display = text.includes(lowerQuery) ? 'flex' : 'none';
        });
    }

    updateActiveHistoryItem(chatId) {
        document.querySelectorAll('.history-item').forEach(item => {
            item.classList.toggle('active', item.dataset.chatId === chatId);
        });
    }

    // ==================== RENDERING ====================

    renderChatHistory() {
        const container = this.elements.chatHistory;
        container.innerHTML = '';

        this.chats.forEach(chat => {
            const item = document.createElement('div');
            item.className = `history-item ${chat.id === this.currentChatId ? 'active' : ''}`;
            item.dataset.chatId = chat.id;
            item.onclick = () => this.loadChat(chat.id);

            item.innerHTML = `
                <svg class="history-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span class="history-text">${this.escapeHtml(chat.title)}</span>
                <button class="delete-btn" onclick="nexus.deleteChat('${chat.id}', event)" title="Delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;

            container.appendChild(item);
        });
    }

    renderMessages(messages) {
        const container = this.elements.messagesContainer;
        
        // Remove welcome screen if present
        const existingWelcome = container.querySelector('.welcome-screen');
        if (existingWelcome) {
            existingWelcome.remove();
        }

        // Clear existing messages
        container.innerHTML = '';

        messages.forEach(msg => {
            this.appendMessage(msg.role, msg.content, msg.media);
        });

        this.scrollToBottom();
    }

    appendMessage(role, content, media = null) {
        const container = this.elements.messagesContainer;
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;

        const avatarContent = role === 'user' ? 'U' : '<img src="AI_Image_1.png" alt="AI">';

        let mediaHTML = '';
        if (media) {
            if (media.type === 'image') {
                mediaHTML = `<div class="message-media"><img src="${media.url}" alt="Generated image"></div>`;
            } else if (media.type === 'video') {
                mediaHTML = `<div class="message-media"><video controls src="${media.url}"></video></div>`;
            }
        }

        messageDiv.innerHTML = `
            <div class="message-avatar">${avatarContent}</div>
            <div class="message-content">
                <div class="message-bubble">
                    ${this.formatMessage(content)}
                    ${mediaHTML}
                </div>
                <div class="message-actions">
                    <button class="action-btn" onclick="nexus.copyMessage(this)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy
                    </button>
                    ${role === 'assistant' ? `
                    <button class="action-btn" onclick="nexus.regenerateResponse()">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        Regenerate
                    </button>
                    ` : ''}
                </div>
            </div>
        `;

        container.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const container = this.elements.messagesContainer;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <img src="AI_Image_1.png" alt="AI">
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

        container.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    showWelcomeScreen() {
        const container = this.elements.messagesContainer;
        
        if (!container.querySelector('.welcome-screen')) {
            const welcomeHTML = `
                <div class="welcome-screen">
                    <div class="welcome-logo">
                        <img src="AI_Image_1.png" alt="NexusAI" class="welcome-logo-img">
                        <div class="welcome-logo-ring"></div>
                    </div>
                    <h2 class="welcome-title">How can I <span class="gradient-text">help you</span> today?</h2>
                    <p class="welcome-subtitle">I can generate images, create videos, answer questions, and much more.</p>
                    
                    <div class="suggestion-grid">
                        <div class="suggestion-card" data-prompt="Create a futuristic cityscape at sunset">
                            <div class="suggestion-icon">🎨</div>
                            <span>Generate an image</span>
                        </div>
                        <div class="suggestion-card" data-prompt="Make a short video of ocean waves">
                            <div class="suggestion-icon">🎬</div>
                            <span>Create a video</span>
                        </div>
                        <div class="suggestion-card" data-prompt="Explain quantum computing in simple terms">
                            <div class="suggestion-icon">💡</div>
                            <span>Explain a concept</span>
                        </div>
                        <div class="suggestion-card" data-prompt="Write a creative story about time travel">
                            <div class="suggestion-icon">✍️</div>
                            <span>Write a story</span>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML = welcomeHTML;
        }
    }

    hideWelcomeScreen() {
        const welcome = this.elements.messagesContainer.querySelector('.welcome-screen');
        if (welcome) {
            welcome.remove();
        }
    }

    // ==================== MESSAGING ====================

    async sendMessage() {
        const input = this.elements.chatInput;
        const message = input.value.trim();

        if (!message && this.attachments.length === 0) return;
        if (this.isGenerating) return;

        // Get or create chat
        if (!this.currentChatId) {
            this.createNewChat();
        }

        const chat = this.chats.find(c => c.id === this.currentChatId);
        if (!chat) return;

        // Update chat title from first message
        if (chat.messages.length === 0 && message) {
            chat.title = message.substring(0, 40) + (message.length > 40 ? '...' : '');
            this.renderChatHistory();
        }

        // Prepare message content
        let messageContent = message;
        let mediaAttachment = null;

        // Handle attachments
        if (this.attachments.length > 0) {
            const attachment = this.attachments[0];
            if (attachment.type === 'image') {
                messageContent = message || 'Generate an image based on this context';
                mediaAttachment = { type: 'image-preview', url: attachment.url };
            }
        }

        // Add user message
        const userMessage = {
            role: 'user',
            content: messageContent,
            timestamp: new Date().toISOString()
        };

        chat.messages.push(userMessage);
        this.appendMessage('user', messageContent, mediaAttachment);
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        this.attachments = [];
        this.elements.previewArea.innerHTML = '';

        // Save chat
        this.saveChats();

        // Show typing indicator
        this.showTypingIndicator();
        this.isGenerating = true;

        try {
            // Determine if we should generate media or text
            const shouldGenerateImage = this.selectedModel === 'nexus-image' || 
                /create|generate|draw|image|picture|photo|visual/i.test(message);
            
            const shouldGenerateVideo = /video|clip|animation|motion|movie/i.test(message);

            if (shouldGenerateVideo) {
                await this.generateVideo(chat, message);
            } else if (shouldGenerateImage) {
                await this.generateImage(chat, message);
            } else {
                await this.generateTextResponse(chat, message);
            }
        } catch (error) {
            console.error('Generation error:', error);
            this.hideTypingIndicator();
            this.appendMessage('assistant', `Sorry, I encountered an error. Please try again. Error: ${error.message}`);
        }

        this.isGenerating = false;
        this.updateMemory(messageContent);
    }

    async generateTextResponse(chat, message) {
        const systemPrompt = this.buildSystemPrompt();
        
        const response = await this.callAPI([
            { role: 'system', content: systemPrompt },
            ...chat.messages.slice(-10).map(m => ({
                role: m.role,
                content: m.content
            }))
        ]);

        this.hideTypingIndicator();
        this.appendMessage('assistant', response);

        // Save to chat
        chat.messages.push({
            role: 'assistant',
            content: response,
            timestamp: new Date().toISOString()
        });

        this.saveChats();
    }

    async generateImage(chat, prompt) {
        try {
            const response = await fetch('https://apihub.agnes-ai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer sk-rWvCRyEKxFrHuuVaoQB1IwFoPXMGy6XQNQvpC3AhHl5kkNCE`
                },
                body: JSON.stringify({
                    model: 'agnes-image-2.0-flash',
                    prompt: prompt,
                    n: 1,
                    size: '1024x1024'
                })
            });

            const data = await response.json();
            this.hideTypingIndicator();

            if (data.data && data.data[0]) {
                const imageUrl = data.data[0].url || data.data[0].b64_json;
                
                if (data.data[0].b64_json) {
                    this.appendMessage('assistant', `Here's your generated image:\n\n**Prompt:** ${prompt}`, {
                        type: 'image',
                        url: `data:image/png;base64,${data.data[0].b64_json}`
                    });
                } else {
                    this.appendMessage('assistant', `Here's your generated image:\n\n**Prompt:** ${prompt}`, {
                        type: 'image',
                        url: imageUrl
                    });
                }

                chat.messages.push({
                    role: 'assistant',
                    content: `Generated image for: "${prompt}"`,
                    media: { type: 'image', url: imageUrl },
                    timestamp: new Date().toISOString()
                });
            } else {
                throw new Error('No image data received');
            }
        } catch (error) {
            console.error('Image generation error:', error);
            this.appendMessage('assistant', `I couldn't generate an image right now. Error: ${error.message}`);
        }

        this.saveChats();
    }

    async generateVideo(chat, prompt) {
        try {
            const response = await fetch('https://apihub.agnes-ai.com/v1/videos/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer sk-rWvCRyEKxFrHuuVaoQB1IwFoPXMGy6XQNQvpC3AhHl5kkNCE`
                },
                body: JSON.stringify({
                    model: 'agnes-video-v2.0',
                    prompt: prompt
                })
            });

            const data = await response.json();
            this.hideTypingIndicator();

            if (data.data && data.data[0]) {
                const videoUrl = data.data[0].url;
                
                this.appendMessage('assistant', `Here's your generated video:\n\n**Prompt:** ${prompt}`, {
                    type: 'video',
                    url: videoUrl
                });

                chat.messages.push({
                    role: 'assistant',
                    content: `Generated video for: "${prompt}"`,
                    media: { type: 'video', url: videoUrl },
                    timestamp: new Date().toISOString()
                });
            } else {
                throw new Error('No video data received');
            }
        } catch (error) {
            console.error('Video generation error:', error);
            this.appendMessage('assistant', `I couldn't generate a video right now. Error: ${error.message}`);
        }

        this.saveChats();
    }

    async callAPI(messages) {
        const response = await fetch('https://apihub.agnes-ai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer sk-rWvCRyEKxFrHuuVaoQB1IwFoPXMGy6XQNQvpC3AhHl5kkNCE`
            },
            body: JSON.stringify({
                model: 'agnes-2.0-flash',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            return data.choices[0].message.content;
        } else {
            throw new Error('Invalid response from API');
        }
    }

    buildSystemPrompt() {
        const memoryContext = this.memory.preferences.length > 0 
            ? `\n\nUser Preferences: ${this.memory.preferences.join(', ')}` 
            : '';
        
        const factsContext = this.memory.facts.length > 0 
            ? `\nKnown Facts: ${this.memory.facts.join('; ')}` 
            : '';

        return `You are NexusAI, a helpful and intelligent assistant. You can help with text, generate images, and create videos.${memoryContext}${factsContext} Be concise, accurate, and friendly.`;
    }

    // ==================== MEMORY ====================

    updateMemory(message) {
        // Extract preferences
        const prefPatterns = [
            /(?:i(?:'|')?m |prefer|like|love|want|need) (\w+(?: \w+)*)/i,
            /(?:always|never) (\w+)/i
        ];

        prefPatterns.forEach(pattern => {
            const match = message.match(pattern);
            if (match && !this.memory.preferences.includes(match[1])) {
                this.memory.preferences.push(match[1]);
            }
        });

        // Save memory
        localStorage.setItem('nexus_memory', JSON.stringify(this.memory));
        this.updateMemoryPanel();
    }

    updateMemoryPanel() {
        const body = this.elements.memoryBody;
        
        if (this.memory.preferences.length === 0 && 
            this.memory.facts.length === 0 && 
            this.memory.context.length === 0) {
            body.innerHTML = `
                <div class="memory-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <p>No memories yet. Start chatting to build context!</p>
                </div>
            `;
            return;
        }

        let html = '<div class="memory-list">';

        if (this.memory.preferences.length > 0) {
            html += `
                <div class="memory-item">
                    <div class="memory-category">Preferences</div>
                    <div class="memory-text">${this.memory.preferences.join(', ')}</div>
                </div>
            `;
        }

        if (this.memory.facts.length > 0) {
            html += `
                <div class="memory-item">
                    <div class="memory-category">Facts</div>
                    <div class="memory-text">${this.memory.facts.join('; ')}</div>
                </div>
            `;
        }

        html += '</div>';
        body.innerHTML = html;
    }

    // ==================== PANELS ====================

    openPanel(panel) {
        this.elements.panelOverlay.classList.add('active');
        panel.classList.add('panel-open');
    }

    closePanel(panel) {
        this.elements.panelOverlay.classList.remove('active');
        panel.classList.remove('panel-open');
    }

    toggleModelDropdown() {
        this.elements.modelDropdown.classList.toggle('active');
    }

    selectModel(option) {
        const model = option.dataset.model;
        this.selectedModel = model;

        // Update UI
        document.querySelectorAll('.model-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        const modelName = option.querySelector('.model-name').textContent;
        this.elements.modelIndicator.innerHTML = `
            <div class="status-dot active"></div>
            ${modelName}
        `;

        this.elements.modelDropdown.classList.remove('active');
    }

    // ==================== UTILITIES ====================

    handleFileUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target.result;
            this.attachments.push({ type, url, file });
            this.updatePreviewArea();
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }

    updatePreviewArea() {
        const container = this.elements.previewArea;
        container.innerHTML = '';

        this.attachments.forEach((att, index) => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            
            if (att.type === 'image') {
                div.innerHTML = `
                    <img src="${att.url}" alt="Preview">
                    <button class="preview-remove" onclick="nexus.removeAttachment(${index})">×</button>
                `;
            } else if (att.type === 'video') {
                div.innerHTML = `
                    <video src="${att.url}"></video>
                    <button class="preview-remove" onclick="nexus.removeAttachment(${index})">×</button>
                `;
            }

            container.appendChild(div);
        });
    }

    removeAttachment(index) {
        this.attachments.splice(index, 1);
        this.updatePreviewArea();
    }

    autoResizeTextarea() {
        const textarea = this.elements.chatInput;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.elements.chatArea.scrollTop = this.elements.chatArea.scrollHeight;
        }, 100);
    }

    formatMessage(text) {
        // Basic markdown formatting
        let formatted = this.escapeHtml(text);
        
        // Code blocks
        formatted = formatted.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        
        // Inline code
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Bold
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        // Line breaks
        formatted = formatted.replace(/\n/g, '<br>');
        
        return formatted;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    copyMessage(btn) {
        const message = btn.closest('.message-content').querySelector('.message-bubble');
        const text = message.innerText;
        
        navigator.clipboard.writeText(text).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✓ Copied';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    }

    regenerateResponse() {
        if (!this.currentChatId || this.isGenerating) return;
        
        const chat = this.chats.find(c => c.id === this.currentChatId);
        if (!chat || chat.messages.length === 0) return;

        // Remove last assistant message
        chat.messages.pop();
        
        // Get last user message
        const lastUserMsg = [...chat.messages].reverse().find(m => m.role === 'user');
        if (!lastUserMsg) return;

        this.renderMessages(chat.messages);
        this.generateTextResponse(chat, lastUserMsg.content);
    }

    saveChats() {
        localStorage.setItem('nexus_chats', JSON.stringify(this.chats));
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.removeItem('nexus_chats');
            localStorage.removeItem('nexus_memory');
            this.chats = [];
            this.memory = { preferences: [], facts: [], context: [] };
            this.currentChatId = null;
            this.renderChatHistory();
            this.showWelcomeScreen();
            this.updateMemoryPanel();
            this.closePanel(this.elements.settingsPanel);
        }
    }
}

// Initialize
const nexus = new NexusAI();
