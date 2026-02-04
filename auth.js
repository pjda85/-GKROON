document.addEventListener('DOMContentLoaded', () => {
  const loginTab = document.querySelector('[data-tab="login"]');
  const signupTab = document.querySelector('[data-tab="signup"]');
  const loginFormContainer = document.getElementById('login-form');
  const signupFormContainer = document.getElementById('signup-form');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const authMessage = document.getElementById('auth-message');

  loginTab.addEventListener('click', () => {
    switchTab('login');
  });

  signupTab.addEventListener('click', () => {
    switchTab('signup');
  });

  function switchTab(tab) {
    if (tab === 'login') {
      loginTab.classList.add('active');
      signupTab.classList.remove('active');
      loginFormContainer.classList.add('active');
      signupFormContainer.classList.remove('active');
    } else {
      signupTab.classList.add('active');
      loginTab.classList.remove('active');
      signupFormContainer.classList.add('active');
      loginFormContainer.classList.remove('active');
    }
    hideMessage();
  }

  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = button.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });

  const signupPassword = document.getElementById('signup-password');
  signupPassword.addEventListener('input', () => {
    updatePasswordStrength(signupPassword.value);
  });

  function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-bar-fill');
    const strengthText = document.querySelector('.strength-text');

    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    };

    document.getElementById('req-length').classList.toggle('met', requirements.length);
    document.getElementById('req-uppercase').classList.toggle('met', requirements.uppercase);
    document.getElementById('req-lowercase').classList.toggle('met', requirements.lowercase);
    document.getElementById('req-number').classList.toggle('met', requirements.number);

    const metCount = Object.values(requirements).filter(Boolean).length;
    const strength = (metCount / 4) * 100;

    strengthBar.style.width = `${strength}%`;

    if (strength === 0) {
      strengthBar.className = 'strength-bar-fill';
      strengthText.textContent = 'Password strength';
    } else if (strength <= 25) {
      strengthBar.className = 'strength-bar-fill weak';
      strengthText.textContent = 'Weak password';
    } else if (strength <= 50) {
      strengthBar.className = 'strength-bar-fill fair';
      strengthText.textContent = 'Fair password';
    } else if (strength <= 75) {
      strengthBar.className = 'strength-bar-fill good';
      strengthText.textContent = 'Good password';
    } else {
      strengthBar.className = 'strength-bar-fill strong';
      strengthText.textContent = 'Strong password';
    }
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!validateEmail(email)) {
      showError('login-email', 'Please enter a valid email address');
      return;
    }

    if (!password) {
      showError('login-password', 'Password is required');
      return;
    }

    clearErrors();
    setLoading('login', true);

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) throw error;

      showMessage('Success! Redirecting to dashboard...', 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);

    } catch (error) {
      console.error('Login error:', error);
      showMessage(error.message || 'Invalid email or password. Please try again.', 'error');
      setLoading('login', false);
    }
  });

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullname = document.getElementById('signup-fullname').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const agreeTerms = document.getElementById('agree-terms').checked;

    let hasError = false;

    if (!fullname || fullname.length < 2) {
      showError('signup-fullname', 'Please enter your full name (at least 2 characters)');
      hasError = true;
    }

    if (!validateEmail(email)) {
      showError('signup-email', 'Please enter a valid email address');
      hasError = true;
    }

    if (phone && !validatePhone(phone)) {
      showError('signup-phone', 'Please enter a valid phone number');
      hasError = true;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      showError('signup-password', passwordValidation.message);
      hasError = true;
    }

    if (password !== confirmPassword) {
      showError('signup-confirm-password', 'Passwords do not match');
      hasError = true;
    }

    if (!agreeTerms) {
      showMessage('Please agree to the Terms & Conditions', 'error');
      hasError = true;
    }

    if (hasError) return;

    clearErrors();
    setLoading('signup', true);

    try {
      const { data: authData, error: authError } = await supabaseClient.auth.signUp({
        email: email,
        password: password
      });

      if (authError) throw authError;

      const userId = authData.user.id;

      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert([{
          id: userId,
          email: email,
          full_name: fullname,
          phone: phone || null
        }]);

      if (profileError) throw profileError;

      showMessage('Account created successfully! Redirecting to dashboard...', 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 2000);

    } catch (error) {
      console.error('Signup error:', error);
      showMessage(error.message || 'An error occurred during sign up. Please try again.', 'error');
      setLoading('signup', false);
    }
  });

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePhone(phone) {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phone.length >= 10 && phoneRegex.test(phone);
  }

  function validatePassword(password) {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    return { isValid: true };
  }

  function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

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

    document.querySelectorAll('input').forEach(input => {
      input.classList.remove('error');
    });
  }

  function showMessage(message, type) {
    authMessage.textContent = message;
    authMessage.className = `auth-message ${type}`;
    authMessage.classList.remove('hidden');

    setTimeout(() => {
      hideMessage();
    }, 5000);
  }

  function hideMessage() {
    authMessage.classList.add('hidden');
  }

  function setLoading(form, isLoading) {
    const submitBtn = document.getElementById(`${form}-submit-btn`);
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    if (isLoading) {
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoader.classList.remove('hidden');
    } else {
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoader.classList.add('hidden');
    }
  }
});
