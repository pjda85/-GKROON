let currentTicket = null;

document.addEventListener('DOMContentLoaded', async () => {
  const user = await checkAuth();

  if (!user) {
    return;
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await supabaseClient.auth.signOut();
      window.location.href = 'index.html';
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get('id');

  if (!ticketId) {
    window.location.href = 'tickets.html';
    return;
  }

  await loadTicket(ticketId, user);

  const replyMessage = document.getElementById('reply-message');
  const replyCount = document.getElementById('reply-count');

  replyMessage.addEventListener('input', () => {
    replyCount.textContent = replyMessage.value.length;
  });

  const replyForm = document.getElementById('replyForm');
  replyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await submitReply(ticketId, user.id);
  });
});

async function loadTicket(ticketId, user) {
  try {
    const { data: ticket, error } = await supabaseClient
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;

    if (!ticket) {
      window.location.href = 'tickets.html';
      return;
    }

    currentTicket = ticket;
    displayTicketDetails(ticket);
    await loadMessages(ticketId);

  } catch (error) {
    console.error('Error loading ticket:', error);
    document.getElementById('ticket-header-content').innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load ticket. Please try again.</p>
      </div>
    `;
  }
}

function displayTicketDetails(ticket) {
  document.getElementById('ticket-header-content').innerHTML = `
    <h1>${escapeHtml(ticket.title)}</h1>
    <div class="ticket-meta">
      <span class="ticket-status status-${ticket.status}">${formatStatus(ticket.status)}</span>
      <span class="ticket-category">
        <i class="fas fa-tag"></i> ${formatCategory(ticket.category)}
      </span>
      <span class="ticket-priority priority-${ticket.priority}">
        <i class="fas fa-exclamation-circle"></i> ${formatPriority(ticket.priority)}
      </span>
      <span class="ticket-date">
        <i class="fas fa-clock"></i> ${formatDate(ticket.created_at)}
      </span>
    </div>
  `;

  document.getElementById('ticket-details').innerHTML = `
    <div class="account-info-card">
      <div class="info-row">
        <div class="info-label">
          <i class="fas fa-align-left"></i> Description
        </div>
        <div class="info-value">${escapeHtml(ticket.description)}</div>
      </div>

      <div class="info-row">
        <div class="info-label">
          <i class="fas fa-calendar-plus"></i> Created
        </div>
        <div class="info-value">${new Date(ticket.created_at).toLocaleString()}</div>
      </div>

      <div class="info-row">
        <div class="info-label">
          <i class="fas fa-calendar-check"></i> Last Updated
        </div>
        <div class="info-value">${new Date(ticket.updated_at).toLocaleString()}</div>
      </div>

      <div class="info-row">
        <div class="info-label">
          <i class="fas fa-info-circle"></i> Ticket ID
        </div>
        <div class="info-value" style="font-family: monospace; font-size: 0.9rem;">${ticket.id}</div>
      </div>
    </div>
  `;
}

async function loadMessages(ticketId) {
  try {
    const { data: messages, error } = await supabaseClient
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    document.getElementById('ticket-messages-section').classList.remove('hidden');

    const messagesContainer = document.getElementById('ticket-messages-list');

    if (messages.length === 0) {
      messagesContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-comments"></i>
          <h3>No Messages Yet</h3>
          <p>Be the first to add a message to this ticket.</p>
        </div>
      `;
      return;
    }

    messagesContainer.innerHTML = messages.map(message => `
      <div class="ticket-item" style="border-left-color: ${message.is_staff ? '#ff9800' : '#00ff00'};">
        <div class="ticket-header">
          <h3>${message.is_staff ? 'Support Team' : 'You'}</h3>
          <span class="ticket-date">
            <i class="fas fa-clock"></i> ${formatDate(message.created_at)}
          </span>
        </div>
        <p class="ticket-description">${escapeHtml(message.message)}</p>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

async function submitReply(ticketId, userId) {
  const replyMessage = document.getElementById('reply-message');
  const message = replyMessage.value.trim();

  if (!message || message.length < 5) {
    showError('reply', 'Message must be at least 5 characters long');
    return;
  }

  clearErrors();
  setLoading(true);

  try {
    const { error } = await supabaseClient
      .from('ticket_messages')
      .insert([{
        ticket_id: ticketId,
        user_id: userId,
        message: message,
        is_staff: false
      }]);

    if (error) throw error;

    replyMessage.value = '';
    document.getElementById('reply-count').textContent = '0';

    await loadMessages(ticketId);

    window.scrollTo({ top: document.getElementById('ticket-messages-list').offsetTop - 100, behavior: 'smooth' });

  } catch (error) {
    console.error('Error submitting reply:', error);
    showError('reply', 'Failed to send reply. Please try again.');
  } finally {
    setLoading(false);
  }
}

function formatStatus(status) {
  const statusMap = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'resolved': 'Resolved',
    'closed': 'Closed'
  };
  return statusMap[status] || status;
}

function formatCategory(category) {
  const categoryMap = {
    'web-design': 'Web Design',
    'hosting': 'Hosting',
    'company-services': 'Company Services',
    'smartphone-repairs': 'Smartphone Repairs',
    'general': 'General'
  };
  return categoryMap[category] || category;
}

function formatPriority(priority) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}-error`);
  const inputElement = document.getElementById(`${fieldId}-message`);

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  if (inputElement) {
    inputElement.classList.add('error');
  }
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });

  document.querySelectorAll('input, select, textarea').forEach(input => {
    input.classList.remove('error');
  });
}

function setLoading(isLoading) {
  const submitBtn = document.getElementById('reply-submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');

  if (isLoading) {
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.classList.remove('hidden');
  } else {
    submitBtn.disabled = false;
    btnText.style.display = 'inline-flex';
    btnLoader.classList.add('hidden');
  }
}
