let allTickets = [];
let currentFilter = 'all';
let searchTerm = '';

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

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      displayTickets();
    });
  });

  const searchInput = document.getElementById('tickets-search');
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    displayTickets();
  });

  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');
  if (filterParam) {
    const targetBtn = document.querySelector(`[data-filter="${filterParam}"]`);
    if (targetBtn) {
      targetBtn.click();
    }
  }

  await loadTickets(user);
});

async function loadTickets(user) {
  try {
    const { data: tickets, error } = await supabaseClient
      .from('tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    allTickets = tickets;
    displayTickets();

  } catch (error) {
    console.error('Error loading tickets:', error);
    showError('Failed to load tickets. Please refresh the page.');
  }
}

function displayTickets() {
  const container = document.getElementById('tickets-list');

  let filteredTickets = allTickets;

  if (currentFilter !== 'all') {
    filteredTickets = filteredTickets.filter(ticket => ticket.status === currentFilter);
  }

  if (searchTerm) {
    filteredTickets = filteredTickets.filter(ticket =>
      ticket.title.toLowerCase().includes(searchTerm) ||
      ticket.description.toLowerCase().includes(searchTerm)
    );
  }

  if (filteredTickets.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-inbox"></i>
        <h3>${searchTerm ? 'No Tickets Found' : 'No Tickets Yet'}</h3>
        <p>${searchTerm ? 'Try adjusting your search or filter.' : 'You haven\'t created any support tickets yet.'}</p>
        ${!searchTerm ? '<a href="create-ticket.html" class="listen-btn">Create Your First Ticket</a>' : ''}
      </div>
    `;
    return;
  }

  container.innerHTML = filteredTickets.map(ticket => `
    <div class="ticket-item">
      <div class="ticket-header">
        <h3>${escapeHtml(ticket.title)}</h3>
        <span class="ticket-status status-${ticket.status}">${formatStatus(ticket.status)}</span>
      </div>
      <div class="ticket-meta">
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
      <p class="ticket-description">${escapeHtml(ticket.description.substring(0, 200))}${ticket.description.length > 200 ? '...' : ''}</p>
      <a href="ticket-view.html?id=${ticket.id}" class="ticket-view-link">View Details <i class="fas fa-arrow-right"></i></a>
    </div>
  `).join('');
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

function showError(message) {
  const container = document.getElementById('tickets-list');
  container.innerHTML = `
    <div class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <p>${message}</p>
    </div>
  `;
}
