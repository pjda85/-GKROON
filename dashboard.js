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

  loadDashboardData(user);
});

async function loadDashboardData(user) {
  try {
    const profile = await getUserProfile(user.id);

    if (profile) {
      document.getElementById('user-name').textContent = profile.full_name;
      document.getElementById('profile-name').textContent = profile.full_name;
      document.getElementById('profile-email').textContent = profile.email;
      document.getElementById('profile-phone').textContent = profile.phone || 'Not provided';

      const joinedDate = new Date(profile.created_at);
      document.getElementById('profile-joined').textContent = joinedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    const { data: tickets, error } = await supabaseClient
      .from('tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const totalTickets = tickets.length;
    const pendingTickets = tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

    document.getElementById('total-tickets').textContent = totalTickets;
    document.getElementById('pending-tickets').textContent = pendingTickets;
    document.getElementById('resolved-tickets').textContent = resolvedTickets;

    displayRecentTickets(tickets.slice(0, 5));

  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showError('Failed to load dashboard data. Please refresh the page.');
  }
}

function displayRecentTickets(tickets) {
  const container = document.getElementById('recent-tickets');

  if (tickets.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-inbox"></i>
        <h3>No Tickets Yet</h3>
        <p>You haven't created any support tickets yet.</p>
        <a href="create-ticket.html" class="listen-btn">Create Your First Ticket</a>
      </div>
    `;
    return;
  }

  container.innerHTML = tickets.map(ticket => `
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
      <p class="ticket-description">${escapeHtml(ticket.description.substring(0, 150))}${ticket.description.length > 150 ? '...' : ''}</p>
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
  const container = document.getElementById('recent-tickets');
  container.innerHTML = `
    <div class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <p>${message}</p>
    </div>
  `;
}
