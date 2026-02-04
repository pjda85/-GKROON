const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getCurrentUser() {
  const { data: { user }, error } = await supabaseClient.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
}

async function getUserProfile(userId) {
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

async function checkAuth() {
  const user = await getCurrentUser();
  const currentPath = window.location.pathname;
  const protectedPaths = ['/dashboard.html', '/tickets.html', '/create-ticket.html'];

  const isProtectedPath = protectedPaths.some(path => currentPath.includes(path));

  if (!user && isProtectedPath) {
    window.location.href = 'auth.html';
    return false;
  }

  if (user && currentPath.includes('auth.html')) {
    window.location.href = 'dashboard.html';
    return false;
  }

  return user;
}

function updateNavigation() {
  checkAuth().then(user => {
    const authLink = document.querySelector('.auth-link');
    if (authLink && user) {
      authLink.textContent = 'Dashboard';
      authLink.href = 'dashboard.html';
      authLink.setAttribute('data-tooltip', 'Go to Dashboard');
    }
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', updateNavigation);
}
