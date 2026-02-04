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

  const titleInput = document.getElementById('ticket-title');
  const titleCount = document.getElementById('title-count');
  const descriptionInput = document.getElementById('ticket-description');
  const descriptionCount = document.getElementById('description-count');
  const createTicketForm = document.getElementById('createTicketForm');
  const ticketMessage = document.getElementById('ticket-message');

  titleInput.addEventListener('input', () => {
    titleCount.textContent = titleInput.value.length;
  });

  descriptionInput.addEventListener('input', () => {
    descriptionCount.textContent = descriptionInput.value.length;
  });

  createTicketForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const category = document.getElementById('ticket-category').value;
    const priority = document.getElementById('ticket-priority').value;
    const description = descriptionInput.value.trim();

    let hasError = false;

    if (!title || title.length < 5) {
      showError('title', 'Title must be at least 5 characters long');
      hasError = true;
    }

    if (!category) {
      showError('category', 'Please select a category');
      hasError = true;
    }

    if (!priority) {
      showError('priority', 'Please select a priority');
      hasError = true;
    }

    if (!description || description.length < 20) {
      showError('description', 'Description must be at least 20 characters long');
      hasError = true;
    }

    if (hasError) return;

    clearErrors();
    setLoading(true);

    try {
      const { data: ticket, error } = await supabaseClient
        .from('tickets')
        .insert([{
          user_id: user.id,
          title: title,
          category: category,
          priority: priority,
          description: description,
          status: 'open'
        }])
        .select()
        .single();

      if (error) throw error;

      showMessage('Ticket created successfully! Redirecting...', 'success');

      setTimeout(() => {
        window.location.href = `ticket-view.html?id=${ticket.id}`;
      }, 2000);

    } catch (error) {
      console.error('Error creating ticket:', error);
      showMessage(error.message || 'Failed to create ticket. Please try again.', 'error');
      setLoading(false);
    }
  });

  function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(`ticket-${fieldId}`);

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

  function showMessage(message, type) {
    ticketMessage.textContent = message;
    ticketMessage.className = `ticket-message ${type}`;
    ticketMessage.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (type === 'error') {
      setTimeout(() => {
        hideMessage();
      }, 5000);
    }
  }

  function hideMessage() {
    ticketMessage.classList.add('hidden');
  }

  function setLoading(isLoading) {
    const submitBtn = document.getElementById('submit-ticket-btn');
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
});
