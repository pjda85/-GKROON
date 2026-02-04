# GKroon Website - Enhanced Features Documentation

## Overview
This is a comprehensive, fully responsive website for GKroon (Pty) Ltd with secure authentication, ticketing system, and AI chatbot functionality.

## Features Implemented

### 1. Secure Authentication System
**Files:** `auth.html`, `auth.js`, `supabase-config.js`

#### Features:
- **Sign Up Form** with comprehensive validation:
  - Full name validation (minimum 2 characters)
  - Email format validation
  - Phone number validation (optional)
  - Password strength indicator (weak, fair, good, strong)
  - Real-time password requirements checking:
    - At least 8 characters
    - One uppercase letter
    - One lowercase letter
    - One number
  - Password confirmation matching
  - Terms & Conditions checkbox

- **Sign In Form**:
  - Email validation
  - Password field with show/hide toggle
  - Remember me option
  - Forgot password link

- **Security Features**:
  - Row Level Security (RLS) enabled on all database tables
  - Passwords securely hashed by Supabase Auth
  - Protected routes (dashboard, tickets) redirect to login if not authenticated
  - Session management with automatic token refresh

#### How to Use:
1. Visit `auth.html`
2. Toggle between Sign In and Sign Up tabs
3. Fill in the required information
4. Submit to create account or sign in
5. Automatic redirect to dashboard upon successful authentication

---

### 2. User Dashboard
**Files:** `dashboard.html`, `dashboard.js`

#### Features:
- **Statistics Cards**:
  - Total support tickets
  - Pending tickets count
  - Resolved tickets count
  - Quick access to create new ticket

- **Recent Tickets Display**:
  - Shows last 5 tickets
  - Status badges (open, in-progress, resolved, closed)
  - Priority indicators (low, medium, high, urgent)
  - Category tags
  - Relative timestamps

- **Account Information**:
  - Full name
  - Email address
  - Phone number
  - Member since date

#### How to Use:
1. Sign in to access dashboard
2. View ticket statistics at a glance
3. Click on tickets to view details
4. Access account information at the bottom
5. Sign out button in navigation

---

### 3. Ticketing System
**Files:** `tickets.html`, `tickets.js`, `create-ticket.html`, `create-ticket.js`, `ticket-view.html`, `ticket-view.js`

#### Database Schema:
```sql
Tables:
- profiles: User profile information
- tickets: Support ticket records
- ticket_messages: Conversation threads
```

#### Features:

**Tickets List Page:**
- Filter by status (All, Open, In Progress, Resolved, Closed)
- Search functionality (searches title and description)
- Responsive grid layout
- Status indicators with color coding
- Priority badges
- Category tags
- Relative timestamps

**Create Ticket Page:**
- Title input with character counter (max 200)
- Category dropdown:
  - Web Design & Development
  - Domain & Hosting
  - Company Services
  - Smartphone Repairs
  - General Inquiry
- Priority selector (Low, Medium, High, Urgent)
- Description textarea with character counter (max 2000)
- Form validation with error messages
- Success notification on creation

**Ticket View Page:**
- Full ticket details
- Status, category, and priority display
- Ticket description
- Creation and last updated timestamps
- Message thread display
- Add reply functionality
- Real-time message updates

#### How to Use:
1. **Creating a Ticket:**
   - Click "Create New Ticket" from dashboard or tickets page
   - Fill in title, select category and priority
   - Provide detailed description
   - Click "Submit Ticket"

2. **Viewing Tickets:**
   - Navigate to tickets page
   - Use filters to find specific tickets
   - Search by keyword
   - Click ticket to view full details

3. **Replying to Tickets:**
   - Open ticket details
   - Scroll to "Add Reply" section
   - Type message (5-1000 characters)
   - Click "Send Reply"

---

### 4. AI Chatbot Assistant
**Files:** `chatbot.html`, `chatbot.js`

#### Features:
- **Floating Widget**:
  - Fixed bottom-right position
  - Animated toggle button
  - Notification badge
  - Smooth open/close animations

- **Chat Interface**:
  - Professional header with avatar
  - Scrollable message history
  - Typing indicator
  - Timestamp on messages
  - Auto-scroll to latest message

- **Quick Replies**:
  - Pre-defined common questions
  - One-click to send query
  - Topics covered:
    - Services offered
    - Company registration
    - Web design
    - Hosting packages

- **Knowledge Base**:
  The AI assistant has built-in knowledge about:
  - Company registration services and pricing
  - Web design packages (R250 - R5,500)
  - Hosting solutions (from R150/month)
  - Domain registration (from R250/year)
  - Smartphone repair services
  - Tax and compliance services
  - Contact information
  - Business hours

#### How to Use:
1. Click the chat icon (bottom-right corner)
2. Type your question or use quick replies
3. Receive instant AI-powered responses
4. Continue conversation naturally
5. Close chat by clicking minimize button

#### Customization:
To customize chatbot responses, edit the `knowledgeBase` object in `chatbot.js`:
```javascript
const knowledgeBase = {
  'keyword': 'Your custom response here',
  // Add more entries
};
```

---

### 5. Responsive Design
**All devices supported:**

#### Desktop (1200px+):
- Full navigation menu
- Multi-column layouts
- Large dashboard cards
- Side-by-side forms

#### Tablet (768px - 1199px):
- Adjusted grid layouts
- Optimized card sizes
- Touch-friendly buttons
- Readable font sizes

#### Mobile (320px - 767px):
- Hamburger navigation menu
- Single-column layouts
- Full-width buttons
- Collapsible sections
- Touch-optimized chatbot
- Stacked ticket cards

#### Key Responsive Features:
- Fluid typography
- Flexible images
- Touch-friendly tap targets (minimum 44px)
- Optimized form inputs for mobile keyboards
- Reduced motion for accessibility
- Proper viewport meta tags

---

## Database Security

### Row Level Security (RLS) Policies:

#### Profiles Table:
```sql
- Users can view own profile
- Users can update own profile
- Users can insert own profile (on signup)
```

#### Tickets Table:
```sql
- Users can view own tickets
- Users can create tickets
- Users can update own tickets
```

#### Ticket Messages Table:
```sql
- Users can view messages for their tickets
- Users can create messages for their tickets
```

### Data Validation:
- Server-side validation via Supabase
- Client-side validation for better UX
- SQL injection prevention through parameterized queries
- XSS prevention through HTML escaping

---

## File Structure

```
/project
├── auth.html                 # Authentication page (Sign In/Sign Up)
├── auth.js                   # Authentication logic
├── dashboard.html            # User dashboard
├── dashboard.js              # Dashboard functionality
├── tickets.html              # Tickets list page
├── tickets.js                # Tickets list logic
├── create-ticket.html        # Create new ticket form
├── create-ticket.js          # Ticket creation logic
├── ticket-view.html          # Individual ticket view
├── ticket-view.js            # Ticket view and reply logic
├── chatbot.html              # AI chatbot widget HTML
├── chatbot.js                # AI chatbot functionality
├── supabase-config.js        # Supabase client configuration
├── style.css                 # All CSS styles (enhanced)
├── script.js                 # General site scripts
├── index.html                # Homepage (Company Services)
├── about.html                # About page
├── web-design.html           # Web Design services
├── index1.html               # Domain & Hosting
├── smartphone-repairs.html   # Smartphone repairs
└── FEATURES.md              # This documentation file
```

---

## Setup Instructions

### 1. Environment Variables
The Supabase configuration is automatically loaded from environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 2. Database Setup
The database tables are automatically created through migrations. The following tables are set up:
- `profiles`: User information
- `tickets`: Support tickets
- `ticket_messages`: Ticket conversation threads

### 3. Authentication Setup
Supabase authentication is pre-configured with:
- Email/Password authentication enabled
- Email confirmation disabled (for easier testing)
- Automatic profile creation on signup

---

## Browser Compatibility

### Fully Supported:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

### Mobile Browsers:
- Chrome Mobile
- Safari iOS
- Samsung Internet
- Firefox Mobile

### Progressive Enhancement:
- Core functionality works on older browsers
- Enhanced features for modern browsers
- Graceful degradation for unsupported features

---

## Performance Optimizations

1. **Code Splitting**:
   - Separate JS files for each page
   - Load only required scripts

2. **CSS Optimization**:
   - Single CSS file with modular structure
   - Media queries for responsive design
   - Efficient selectors

3. **Database Queries**:
   - Indexed fields for faster searches
   - Limited data fetching (pagination-ready)
   - Efficient RLS policies

4. **Asset Loading**:
   - Lazy loading for images
   - Async script loading
   - Font optimization

---

## Accessibility Features

1. **ARIA Labels**:
   - Proper semantic HTML
   - ARIA labels on interactive elements
   - Screen reader friendly

2. **Keyboard Navigation**:
   - Tab order optimized
   - Focus indicators
   - Keyboard shortcuts

3. **Visual Accessibility**:
   - High contrast ratios
   - Focus visible states
   - Readable font sizes (minimum 16px)
   - Color-blind friendly palette

4. **Forms**:
   - Clear error messages
   - Required field indicators
   - Helpful placeholder text
   - Validation feedback

---

## Security Best Practices

1. **Authentication**:
   - Secure password requirements
   - Session management
   - Protected routes
   - CSRF protection via Supabase

2. **Data Protection**:
   - RLS on all tables
   - Input sanitization
   - Output escaping
   - Parameterized queries

3. **Privacy**:
   - User data isolated
   - Minimal data collection
   - Secure data transmission (HTTPS)

---

## Future Enhancements

### Potential Additions:
1. **Email Notifications**:
   - Ticket creation confirmation
   - Status update alerts
   - Reply notifications

2. **File Attachments**:
   - Upload images/documents to tickets
   - Supabase Storage integration

3. **Admin Panel**:
   - Staff dashboard
   - Ticket management
   - User management
   - Analytics

4. **Advanced Chatbot**:
   - Integration with external LLM APIs
   - Conversation history
   - Multilingual support

5. **Payment Integration**:
   - Service payments
   - Invoice generation
   - Payment history

---

## Testing Checklist

### Authentication:
- [ ] Sign up with valid data
- [ ] Sign up with invalid data (test validation)
- [ ] Sign in with correct credentials
- [ ] Sign in with incorrect credentials
- [ ] Sign out
- [ ] Protected route redirection

### Ticketing:
- [ ] Create ticket
- [ ] View tickets list
- [ ] Filter tickets by status
- [ ] Search tickets
- [ ] View individual ticket
- [ ] Reply to ticket
- [ ] Verify RLS (can't see other users' tickets)

### Chatbot:
- [ ] Open/close chatbot
- [ ] Send messages
- [ ] Use quick replies
- [ ] Receive responses
- [ ] Test on mobile

### Responsive Design:
- [ ] Desktop view (1920px)
- [ ] Laptop view (1366px)
- [ ] Tablet view (768px)
- [ ] Mobile view (375px)
- [ ] Mobile view (320px)

---

## Support & Maintenance

### Common Issues:

**Issue: Can't sign in**
- Check email/password is correct
- Verify email is confirmed (if enabled)
- Clear browser cache
- Check Supabase connection

**Issue: Tickets not loading**
- Check authentication status
- Verify database connection
- Check browser console for errors
- Refresh the page

**Issue: Chatbot not responding**
- Check JavaScript console
- Verify chatbot.js is loaded
- Clear browser cache

### Logs & Debugging:
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls
- Review Supabase dashboard logs

---

## Credits

**Built with:**
- HTML5
- CSS3
- JavaScript (ES6+)
- Supabase (Database & Authentication)
- Font Awesome (Icons)
- Google Fonts (Advent Pro)

**Design Pattern:**
- Mobile-first responsive design
- Progressive enhancement
- Semantic HTML
- BEM-inspired CSS methodology

---

## License

Copyright © 2025 GKroon (Pty) Ltd. All Rights Reserved.

This is proprietary software. Unauthorized copying or distribution is prohibited.
