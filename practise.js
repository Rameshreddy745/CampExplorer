const sanitizeHtml=require('sanitize-html')

let html = "<h2>hello world</h2>";
html = sanitizeHtml(html, {
    allowedTags: [ ],
    allowedAttributes: {},
  });
console.log(html);
console.log(sanitizeHtml("<script>alert('hello world')</script>"));