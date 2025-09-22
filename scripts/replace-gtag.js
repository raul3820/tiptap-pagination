#!/usr/bin/env node

import fs from 'fs';

const files = ['docs/index.html', 'docs/404.html'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const gtagScript = `
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-YCTBQN00K5"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-YCTBQN00K5');
    </script>
  </body>`;

    content = content.replace('</body>', gtagScript);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File ${file} not found, skipping`);
  }
});