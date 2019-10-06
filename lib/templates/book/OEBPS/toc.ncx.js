
module.exports = function(data = {}) {
  let {
    id, title, author, chapters
  } = data;

  return /* xml */ `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${id}" />
    <meta name="dtb:generator" content="@matthewp/eleventy-plugin-epub"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>${title}</text>
  </docTitle>
  <docAuthor>
    <text>${author}</text>
  </docAuthor>
  <navMap>
    <navPoint id="toc" playOrder="0" class="chapter">
      <navLabel>
        <text>Table Of Contents</text>
      </navLabel>
      <content src="toc.xhtml"/>
    </navPoint>
    ${chapters.map(chapter => `<navPoint id="${chapter.slug}" playOrder="${chapter.playOrder}" class="chapter">
      <navLabel>
        <text>${chapter.title}</text>
      </navLabel>
      <content src="${chapter.slug}.xhtml"/>
    </navPoint>`).join('\n')}
  </navMap>
</ncx>`;
};