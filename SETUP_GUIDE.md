# GKroon Website - Setup & Usage Guide

## Quick Start Guide

### Step 1: Access the Website
1. The website is automatically served and accessible
2. Main pages:
   - Homepage: `index.html`
   - Authentication: `auth.html`
   - Dashboard: `dashboard.html` (requires login)
   - Support Tickets: `tickets.html` (requires login)

### Step 2: Create an Account
1. Navigate to `auth.html` or click "Sign In" in the navigation
2. Click the "Sign Up" tab
3. Fill in your details:
   - **Full Name**: Your name (minimum 2 characters)
   - **Email**: A valid email address
   - **Phone**: Optional contact number
   - **Password**: Must meet requirements:
     - At least 8 characters
     - One uppercase letter (A-Z)
     - One lowercase letter (a-z)
     - One number (0-9)
   - **Confirm Password**: Must match your password
4. Check "I agree to the Terms & Conditions"
5. Click "Create Account"
6. You'll be automatically redirected to the dashboard

### Step 3: Sign In
1. If you already have an account, click the "Sign In" tab
2. Enter your email and password
3. Optionally check "Remember me"
4. Click "Sign In"
5. You'll be redirected to your dashboard

### Step 4: Explore the Dashboard
Once logged in, you'll see:
- **Statistics Cards**: Overview of your support tickets
- **Recent Tickets**: Your last 5 support requests
- **Account Information**: Your profile details

### Step 5: Create a Support Ticket
1. From the dashboard, click "Create Ticket" or navigate to `create-ticket.html`
2. Fill in the ticket form:
   - **Title**: Brief description (5-200 characters)
   - **Category**: Select the type of service
     - Web Design & Development
     - Domain & Hosting
     - Company Services
     - Smartphone Repairs
     - General Inquiry
   - **Priority**: Select urgency level
     - Low: General questions
     - Medium: Normal issues (default)
     - High: Important issues
     - Urgent: Critical issues
   - **Description**: Detailed explanation (20-2000 characters)
3. Click "Submit Ticket"
4. You'll be redirected to the ticket details page

### Step 6: Manage Your Tickets
1. Navigate to `tickets.html`
2. Use filters to view tickets by status:
   - **All**: Show all tickets
   - **Open**: New tickets awaiting response
   - **In Progress**: Tickets being worked on
   - **Resolved**: Issues that have been fixed
   - **Closed**: Completed tickets
3. Use the search bar to find specific tickets
4. Click any ticket to view full details and add replies

### Step 7: Use the AI Chatbot
1. Look for the green chat button in the bottom-right corner of any page
2. Click the button to open the chatbot
3. You can:
   - Type your questions directly
   - Click quick reply buttons for common questions
   - Get instant answers about:
     - Services and pricing
     - Company registration process
     - Web design packages
     - Hosting solutions
     - Contact information
4. Click the minimize button to close the chatbot

---

## Navigation Guide

### Public Pages (No Login Required):
- **Home** (`index.html`): Company services overview
- **About** (`about.html`): Information about GKroon
- **Web Design** (`web-design.html`): Web design services
- **Domain & Hosting** (`index1.html`): Hosting packages
- **Smartphone Repairs** (`smartphone-repairs.html`): Repair services
- **Contact**: External contact form

### Protected Pages (Login Required):
- **Dashboard** (`dashboard.html`): User overview and statistics
- **Support** (`tickets.html`): View all your tickets
- **Create Ticket** (`create-ticket.html`): Submit new support request
- **Ticket View** (`ticket-view.html`): View and reply to specific ticket

### Authentication:
- **Sign In/Sign Up** (`auth.html`): Account management

---

## Features Usage

### 1. Password Strength Indicator
When creating an account, you'll see a real-time password strength indicator:
- **Red bar (Weak)**: Missing requirements
- **Orange bar (Fair)**: Meets some requirements
- **Blue bar (Good)**: Meets most requirements
- **Green bar (Strong)**: Meets all requirements

Requirements are shown below the password field with checkmarks as you meet them.

### 2. Form Validation
All forms have built-in validation:
- **Red borders**: Indicate errors
- **Error messages**: Show what needs to be fixed
- **Character counters**: Help you stay within limits
- **Disabled submit buttons**: Prevent incomplete submissions

### 3. Ticket Status Colors
Tickets are color-coded by status:
- **Blue**: Open (new ticket)
- **Orange**: In Progress (being handled)
- **Green**: Resolved (issue fixed)
- **Gray**: Closed (completed)

### 4. Priority Indicators
Priority levels are color-coded:
- **Green**: Low priority
- **Orange**: Medium priority
- **Red**: High priority
- **Dark Red & Bold**: Urgent

### 5. Responsive Mobile Menu
On mobile devices:
1. Navigation becomes a hamburger menu (☰)
2. Click the menu icon to open
3. Menu slides in from the right
4. Click any link to navigate
5. Click outside or the menu icon again to close

---

## Common Tasks

### Change Your Profile Information
Currently, profile updates must be done through the dashboard display. Future updates will include an edit profile page.

### Search for Specific Tickets
1. Go to the tickets page
2. Use the search box at the top
3. Type keywords from the ticket title or description
4. Results filter automatically as you type

### Reply to a Ticket
1. Open the ticket you want to reply to
2. Scroll to the "Add Reply" section at the bottom
3. Type your message (5-1000 characters)
4. Click "Send Reply"
5. Your reply appears immediately in the message thread

### Filter Tickets by Category
While viewing tickets, use the status filter buttons:
- Click "Open" to see only open tickets
- Click "In Progress" for tickets being worked on
- Click "Resolved" for completed tickets
- Click "All" to see everything

### Ask the Chatbot a Question
The AI chatbot can help with:
- Service information
- Pricing questions
- General inquiries
- Contact details
- Business hours

Examples:
- "What services do you offer?"
- "How much does company registration cost?"
- "Tell me about web design"
- "What are your hosting packages?"
- "How do I contact you?"

---

## Mobile App Experience

### iOS Safari:
1. Visit the website
2. Tap the Share button
3. Select "Add to Home Screen"
4. The website will open like a native app

### Android Chrome:
1. Visit the website
2. Tap the menu (⋮)
3. Select "Add to Home screen"
4. The website will open like a native app

This provides a full-screen, app-like experience!

---

## Keyboard Shortcuts

### Navigation:
- **Tab**: Move between interactive elements
- **Shift + Tab**: Move backward
- **Enter**: Activate buttons/links
- **Esc**: Close modals/menus

### Forms:
- **Enter**: Submit form (when in input field)
- **Shift + Enter**: New line in textarea

---

## Troubleshooting

### "I can't sign in"
**Solutions:**
1. Verify your email and password are correct
2. Check caps lock is off
3. Try clicking "Forgot password?" (if implemented)
4. Clear your browser cache and try again
5. Try a different browser

### "My tickets aren't loading"
**Solutions:**
1. Refresh the page
2. Check your internet connection
3. Sign out and sign in again
4. Clear browser cache
5. Check browser console for errors (F12)

### "The chatbot isn't responding"
**Solutions:**
1. Refresh the page
2. Close and reopen the chatbot
3. Check your internet connection
4. Try a different browser
5. Clear browser cache

### "Forms aren't submitting"
**Solutions:**
1. Check all required fields are filled (marked with *)
2. Look for red error messages
3. Ensure data meets requirements (e.g., email format)
4. Check character count limits
5. Try refreshing and filling the form again

### "Page is blank or not loading"
**Solutions:**
1. Check your internet connection
2. Refresh the page (Ctrl+R or Cmd+R)
3. Clear browser cache
4. Try a different browser
5. Check if JavaScript is enabled

---

## Browser Requirements

### Minimum Requirements:
- **Chrome**: Version 90 or later
- **Firefox**: Version 88 or later
- **Safari**: Version 14 or later
- **Edge**: Version 90 or later

### Recommended:
- Use the latest version of your browser
- Enable JavaScript
- Enable cookies
- Clear cache regularly

---

## Data & Privacy

### What We Store:
- Your name and email (for account)
- Optional phone number
- Support tickets you create
- Ticket messages and replies

### What We Don't Store:
- Credit card information
- Browsing history
- Third-party tracking data
- Unnecessary personal information

### Data Security:
- Passwords are encrypted (never stored in plain text)
- Database has Row Level Security (RLS)
- You can only see your own data
- Secure HTTPS connection
- Regular security updates

---

## Getting Help

### Need Assistance?
1. **AI Chatbot**: Quick answers to common questions
2. **Support Ticket**: Create a ticket for complex issues
3. **Email**: info.gkroon@gmail.com
4. **WhatsApp**: +27 66 119 9255
5. **Business Hours**: Monday-Friday, 8 AM - 5 PM SAST

### What to Include When Reporting Issues:
1. What you were trying to do
2. What happened instead
3. Your browser and version
4. Any error messages you saw
5. Screenshots (if possible)

---

## Tips & Best Practices

### For Better Support:
1. **Be specific** in ticket titles
2. **Provide details** in descriptions
3. **Include examples** when possible
4. **Use appropriate priority** levels
5. **Reply promptly** to staff responses

### For Account Security:
1. Use a **strong, unique password**
2. **Don't share** your login credentials
3. **Sign out** when using public computers
4. **Keep your email secure**
5. **Update your information** if it changes

### For Best Experience:
1. Use a **modern browser**
2. Keep your browser **updated**
3. Enable **JavaScript**
4. Allow **cookies**
5. Use a **stable internet connection**

---

## Feedback

We value your feedback! If you have suggestions, questions, or issues:
1. Create a support ticket
2. Use the AI chatbot
3. Email us directly
4. Call or WhatsApp

Your input helps us improve the website and services!

---

## Updates & Changelog

### Current Version: 1.0.0 (2025)

**What's New:**
- ✅ Secure authentication system
- ✅ User dashboard
- ✅ Complete ticketing system
- ✅ AI-powered chatbot
- ✅ Fully responsive design
- ✅ Database with RLS security

**Coming Soon:**
- 📧 Email notifications
- 📎 File attachments for tickets
- 👤 User profile editing
- 📊 Advanced analytics
- 🌍 Multi-language support

---

## Thank You!

Thank you for choosing GKroon (Pty) Ltd. We're committed to providing excellent service and support. If you need any assistance, don't hesitate to reach out!

**GKroon (Pty) Ltd**
Your Partner in Business Success
📧 info.gkroon@gmail.com
📱 +27 66 119 9255
🌐 Monday-Friday: 8 AM - 5 PM SAST
