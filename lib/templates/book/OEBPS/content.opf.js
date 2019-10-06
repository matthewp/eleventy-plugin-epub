
module.exports = function(data = {}) {
  let {
    id,
    creator = '',
    lang = 'en',
    title, chapters
  } = data;

  return /* xml */ `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf"
          version="3.0"
          unique-identifier="BookId"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
          xmlns:dcterms="http://purl.org/dc/terms/"
          xml:lang="en"
          xmlns:media="http://www.idpf.org/epub/vocab/overlays/#"
          prefix="ibooks: http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0/">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:opf="http://www.idpf.org/2007/opf">

    <dc:identifier id="BookId">${id}</dc:identifier>
    <meta refines="#BookId" property="identifier-type" scheme="onix:codelist5">22</meta>
    <meta property="dcterms:identifier" id="meta-identifier">BookId</meta>
    <dc:title>${title}</dc:title>
    <meta property="dcterms:title" id="meta-title">${title}</meta>
    <dc:language>${lang}</dc:language>
    <meta property="dcterms:language" id="meta-language">${lang}</meta>
    <meta property="dcterms:modified">2019-10-04T11:40:30Z</meta>
    <dc:creator id="creator">${creator}</dc:creator>
    <meta refines="#creator" property="file-as">${creator}</meta>
    <meta property="dcterms:publisher">anonymous</meta>
    <dc:publisher>anonymous</dc:publisher>
    
    <meta property="dcterms:date">2019-10-4</meta>
    <dc:date>2019-10-4</dc:date>
    <meta property="dcterms:rights">All rights reserved</meta>
    <dc:rights>Copyright &#x00A9; 2019 by anonymous</dc:rights>
    <meta name="cover" content="image_cover"/>
    <meta name="generator" content="epub-gen" />
    <meta property="ibooks:specified-fonts">true</meta>
  </metadata>

  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" />
    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="css" href="style.css" media-type="text/css" />      
    <item id="image_cover" href="cover.jpeg" media-type="image/jpeg" />

    ${chapters.map(chapter => `<item id="${chapter.slug}"
        href="${chapter.slug}.xhtml"
        media-type="application/xhtml+xml" />`).join('\n')}
  </manifest>

  <spine toc="ncx">  
    <itemref idref="toc" />
    ${chapters.map(chapter => `<itemref idref="${chapter.slug}" />`).join('\n')}
  </spine>
  <guide>
    <reference type="text" title="Table of Content" href="toc.xhtml"/>
  </guide>
</package>`;
}