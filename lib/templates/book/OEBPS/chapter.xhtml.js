
module.exports = function(data = {}) {
  let {
    title,
    content
  } = data;

  return /* xhtml */ `<?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
    <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="style.css" />
    </head>
  <body>${content}</body></html>`;
};