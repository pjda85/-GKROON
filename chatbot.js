const CHATBOT_CONFIG = {
  apiEndpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
  contextPrompt: `You are a helpful AI assistant for GKroon (Pty) Ltd, a South African company that provides:
- Company registration and compliance services (CIPC registration, annual returns, tax clearance, etc.)
- Web design and development services
- Domain registration and hosting packages
- Smartphone repair services

You help customers with information about services, pricing, and general inquiries. Be friendly, professional, and concise.`,
  maxTokens: 150,
  temperature: 0.7
};

class ChatbotWidget {
  constructor() {
    this.isOpen = false;
    this.conversationHistory = [];
    this.init();
  }

  init() {
    this.elements = {
      toggle: document.getElementById('chatbot-toggle'),
      window: document.getElementById('chatbot-window'),
      minimize: document.getElementById('chatbot-minimize'),
      messages: document.getElementById('chatbot-messages'),
      input: document.getElementById('chatbot-input-field'),
      sendBtn: document.getElementById('chatbot-send'),
      typing: document.getElementById('chatbot-typing'),
      badge: document.getElementById('chatbot-badge')
    };

    this.bindEvents();
    this.adjustTextareaHeight();
  }

  bindEvents() {
    this.elements.toggle.addEventListener('click', () => this.toggleChat());
    this.elements.minimize.addEventListener('click', () => this.toggleChat());

    this.elements.input.addEventListener('input', (e) => {
      this.adjustTextareaHeight();
      this.elements.sendBtn.disabled = !e.target.value.trim();
    });

    this.elements.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.elements.sendBtn.addEventListener('click', () => this.sendMessage());

    document.querySelectorAll('.quick-reply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        this.elements.input.value = query;
        this.sendMessage();
        document.querySelector('.quick-replies').style.display = 'none';
      });
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.elements.window.classList.remove('hidden');
      this.elements.toggle.classList.add('active');
      this.elements.badge.style.display = 'none';
      this.elements.input.focus();
      this.scrollToBottom();
    } else {
      this.elements.window.classList.add('hidden');
      this.elements.toggle.classList.remove('active');
    }
  }

  async sendMessage() {
    const message = this.elements.input.value.trim();

    if (!message) return;

    this.addMessage(message, 'user');
    this.elements.input.value = '';
    this.elements.sendBtn.disabled = true;
    this.adjustTextareaHeight();

    this.showTyping();

    try {
      const response = await this.getAIResponse(message);
      this.hideTyping();
      this.addMessage(response, 'bot');
    } catch (error) {
      console.error('Chatbot error:', error);
      this.hideTyping();
      this.addMessage('I apologize, but I\'m having trouble connecting right now. Please try again later or contact us directly at info.gkroon@gmail.com', 'bot');
    }
  }

  async getAIResponse(userMessage) {
    const knowledgeBase = {
      'company registration': 'We offer comprehensive company registration services for R1,500. This includes CIPC registration, name reservation, director appointments, and all necessary documentation.',
      'web design': 'Our web design services start from R250 for landing pages, R3,500 for basic websites (3 pages), and R5,500 for business websites (5 pages). All our websites are mobile-responsive and SEO-optimized.',
      'hosting': 'We provide various hosting packages including Email Hosting (from R150/month), WordPress Hosting (from R200/month), cPanel Hosting (from R200/month), and VPS solutions.',
      'domain': 'Domain registration starts from R250/year for .com, .co.za, .net, and other extensions. Domain transfers are available from R200/year.',
      'smartphone repair': 'We offer smartphone repair services including screen replacement (from R499), battery replacement (from R299), and charging port repair (from R399).',
      'annual returns': 'We assist with CIPC annual returns filing. Contact us for pricing and to discuss your specific requirements.',
      'tax': 'We provide tax clearance certificates (R850), VAT registration (R3,500), PAYE registration (R1,550), and UIF registration (R2,500).',
      'cidb': 'CIDB registration is available for R2,500. This is essential for construction companies bidding on government tenders.',
      'csd': 'We offer CSD (Central Supplier Database) registration for R1,500, required for doing business with government.',
      'pricing': 'Our services range from company registration (R1,500), web design (from R250), hosting (from R150/month), to various compliance services. What specific service are you interested in?',
      'contact': 'You can reach us at info.gkroon@gmail.com or WhatsApp: +27 66 119 9255. We\'re here to help!',
      'hours': 'Our support team is available Monday to Friday, 8 AM to 5 PM SAST. Feel free to send us a message anytime!',
      'payment': 'We accept various payment methods. Once you select a service, you\'ll receive payment instructions including our banking details.',
    };

    const lowerMessage = userMessage.toLowerCase();

    for (const [keyword, response] of Object.entries(knowledgeBase)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! How can I assist you today? I can help you with information about our company registration, web design, hosting, or smartphone repair services.';
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    }

    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return 'Goodbye! Feel free to reach out anytime you need assistance. Have a great day!';
    }

    return 'I\'m here to help you with information about our services including company registration, web design, hosting, and smartphone repairs. Could you please be more specific about what you\'d like to know?';
  }

  addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}-message`;

    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    if (sender === 'bot') {
      messageDiv.innerHTML = `
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
          <p>${this.escapeHtml(text)}</p>
          <div class="message-time">${time}</div>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="message-content">
          <p>${this.escapeHtml(text)}</p>
          <div class="message-time">${time}</div>
        </div>
      `;
    }

    this.elements.messages.appendChild(messageDiv);
    this.scrollToBottom();
  }

  showTyping() {
    this.elements.typing.classList.remove('hidden');
    this.scrollToBottom();
  }

  hideTyping() {
    this.elements.typing.classList.add('hidden');
  }

  scrollToBottom() {
    setTimeout(() => {
      this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }, 100);
  }

  adjustTextareaHeight() {
    const textarea = this.elements.input;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('chatbot-widget')) {
    new ChatbotWidget();
  }
});
