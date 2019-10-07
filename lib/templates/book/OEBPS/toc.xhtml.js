
module.exports = function(data = {}) {
  let {
    title,
    stories
  } = data;

  return /* xhtml */ `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en" lang="en">
<head>
  <title>${title}</title>
  <meta charset="UTF-8" />
  <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
  <h1 class="h1">Table Of Contents</h1>
  <nav id="toc" epub:type="toc">
    <ol>
      ${stories.map(story => /* html */`<li class="table-of-content">
        <a href="${story.slug}.xhtml">${story.title}</a>
      </li>`).join('\n')}
    </ol>
  </nav>
</body>
</html>`;
};