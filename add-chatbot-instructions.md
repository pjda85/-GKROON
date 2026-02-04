# How to Add the AI Chatbot to Your Pages

## Method 1: Include in HTML (Recommended)

Add these lines to the **bottom of the body tag** on each page where you want the chatbot:

```html
<!-- Just before closing </body> tag -->

<!-- Load chatbot HTML -->
<script>
  fetch('chatbot.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
      // Load chatbot script after HTML is inserted
      const script = document.createElement('script');
      script.src = 'chatbot.js';
      document.body.appendChild(script);
    });
</script>

</body>
</html>
```

## Method 2: Direct Include

Alternatively, copy the entire content of `chatbot.html` and paste it just before the `</body>` tag, then add:

```html
<script src="chatbot.js"></script>
```

## Method 3: Server-Side Include (If using a server)

If you're using PHP, Node.js, or another server-side language:

### PHP:
```php
<?php include 'chatbot.html'; ?>
<script src="chatbot.js"></script>
```

### Node.js/Express:
```javascript
// In your template
<%- include('chatbot.html') %>
<script src="chatbot.js"></script>
```

## Example: Complete Page with Chatbot

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>My Page @ GKroon</title>
  <link rel="icon" href="gk.png" type="icon">
  <link href="style.css" rel="stylesheet" type="text/css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body>
  <!-- Your navigation -->
  <nav class="navbar">
    <!-- nav content -->
  </nav>

  <!-- Your page content -->
  <div class="container">
    <h1>Welcome</h1>
    <!-- content -->
  </div>

  <!-- Your footer -->
  <footer class="footer">
    <!-- footer content -->
  </footer>

  <!-- ADD CHATBOT HERE - Method 1 -->
  <script>
    fetch('chatbot.html')
      .then(response => response.text())
      .then(data => {
        document.body.insertAdjacentHTML('beforeend', data);
        const script = document.createElement('script');
        script.src = 'chatbot.js';
        document.body.appendChild(script);
      });
  </script>

  <!-- Your existing scripts -->
  <script src="script.js"></script>
</body>
</html>
```

## Pages That Should Have the Chatbot

### Essential Pages:
- ✅ `index.html` - Homepage
- ✅ `about.html` - About page
- ✅ `web-design.html` - Services page
- ✅ `index1.html` - Hosting page
- ✅ `smartphone-repairs.html` - Repairs page

### Optional (User Pages):
- Dashboard pages (users are logged in, may prefer support tickets)
- Authentication pages (keep minimal)

## Customizing the Chatbot

### Change Position:
Edit `style.css`, find `.chatbot-widget`:
```css
.chatbot-widget {
  position: fixed;
  bottom: 20px;    /* Adjust vertical position */
  right: 20px;     /* Adjust horizontal position */
  /* Change to left: 20px for left side */
  z-index: 9999;
}
```

### Change Colors:
Find `.chatbot-toggle` and `.chatbot-header`:
```css
.chatbot-toggle {
  background: linear-gradient(135deg, #00ff00, #004400); /* Your colors */
}

.chatbot-header {
  background: linear-gradient(135deg, #00ff00, #004400); /* Your colors */
}
```

### Change Chatbot Messages:
Edit `chatbot.js`, modify the `knowledgeBase` object:
```javascript
const knowledgeBase = {
  'your_keyword': 'Your response here',
  // Add more Q&A pairs
};
```

## Testing the Chatbot

1. Open the page in a browser
2. Look for the green chat button (bottom-right)
3. Click to open
4. Try these test queries:
   - "What services do you offer?"
   - "How much does company registration cost?"
   - "Tell me about web design"
   - "Contact information"

## Troubleshooting

### Chatbot doesn't appear:
- Check browser console for errors (F12)
- Verify `chatbot.html` and `chatbot.js` are in the same directory
- Ensure Font Awesome CSS is loaded
- Check `style.css` is loaded

### Chatbot appears but doesn't respond:
- Check `chatbot.js` is loaded
- Open browser console and look for JavaScript errors
- Verify the `knowledgeBase` object is properly formatted

### Chatbot overlaps content:
- Adjust `z-index` in CSS
- Change `bottom` or `right` position values
- Add padding to page content: `padding-bottom: 100px;`

## Mobile Optimization

The chatbot is already mobile-optimized, but you can further customize:

```css
@media (max-width: 480px) {
  .chatbot-window {
    width: calc(100vw - 20px); /* Almost full width */
    height: calc(100vh - 100px); /* Almost full height */
    right: 10px;
    left: 10px;
  }

  .chatbot-toggle {
    width: 50px;
    height: 50px;
    bottom: 15px;
    right: 15px;
  }
}
```

## Advanced: Add to All Pages Automatically

Create a file called `init-chatbot.js`:

```javascript
// init-chatbot.js
document.addEventListener('DOMContentLoaded', function() {
  fetch('chatbot.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
      const script = document.createElement('script');
      script.src = 'chatbot.js';
      document.body.appendChild(script);
    })
    .catch(error => console.error('Error loading chatbot:', error));
});
```

Then add to all pages:
```html
<script src="init-chatbot.js"></script>
</body>
```

## Support

If you need help adding the chatbot to your pages:
1. Check the console for errors
2. Verify file paths are correct
3. Ensure all dependencies are loaded
4. Contact support if issues persist

---

**Note:** The chatbot is client-side only and requires no backend. All responses are defined in `chatbot.js`.
