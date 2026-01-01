// Check if the current page is a markdown file
function isMarkdownFile() {
  const url = window.location.href;
  const pathname = window.location.pathname;
  
  // Check if URL ends with .md
  if (pathname.toLowerCase().endsWith('.md')) {
    return true;
  }
  
  // Check if the content type is text/plain or text/markdown
  const contentType = document.contentType;
  if (contentType === 'text/plain' || contentType === 'text/markdown') {
    // Additional check: URL should end with .md
    if (url.toLowerCase().endsWith('.md')) {
      return true;
    }
  }
  
  return false;
}

// Get the markdown content from the page
function getMarkdownContent() {
  // For files served as plain text, the content is usually in a <pre> tag
  const preElement = document.querySelector('body > pre');
  if (preElement) {
    return preElement.textContent;
  }
  
  // Otherwise, try to get the body text content
  return document.body.textContent;
}

// Render the markdown content
function renderMarkdown() {
  if (!isMarkdownFile()) {
    return;
  }
  
  // Check if marked.js is available
  if (typeof marked === 'undefined') {
    console.error('Markdown Renderer: marked.js library not loaded');
    return;
  }
  
  try {
    // Get the raw markdown content
    const markdownContent = getMarkdownContent();
    
    if (!markdownContent || markdownContent.trim() === '') {
      return;
    }
    
    // Configure marked options
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true, // Convert \n to <br>
      headerIds: true,
      mangle: false,
      sanitize: false
    });
    
    // Parse the markdown
    const htmlContent = marked.parse(markdownContent);
    
    // Create a new container for the rendered content
    const container = document.createElement('div');
    container.className = 'markdown-body';
    container.innerHTML = htmlContent;
    
    // Replace the body content with the rendered markdown
    document.body.innerHTML = '';
    document.body.appendChild(container);
    
    // Add a class to the body for styling
    document.body.classList.add('markdown-rendered');
    
  } catch (error) {
    console.error('Markdown Renderer: Error rendering markdown', error);
  }
}

// Run when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderMarkdown);
} else {
  renderMarkdown();
}
