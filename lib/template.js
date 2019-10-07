const archiver = require('archiver');
const { readFile } = require('fs').promises;
const slugify = require('@sindresorhus/slugify');
const { Writable } = require('stream');

const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random()*16|0;
    let y;
    if(c === 'x') {
      y = r;
    } else {
      y = r & 0x3 | 0x8;
    }
    return y.toString(16);
  });

function getTemplate(pth) {
  return require(pth);
}

function getFile(rel) {
  return readFile(__dirname + '/' + rel);
}

async function template(data) {
  let id = uuid();
  let title = data.title;

  let stories = [];
  let chapters = [];
  let playOrder = 0;

  for(let [title, collectionName] of Object.entries(data.chapters)) {
    let story = { title };

    let collection = data.collections[collectionName];
    for(let page of collection) {
      let slug = slugify(page.data.subtitle ?
        title + '-' + page.data.subtitle :
        title + '-' + page.data.title
      );

      if(!story.slug) {
        story.slug = slug;
        story.description = 'This is a description.';
      }

      chapters.push({
        title: page.data.title,
        content: page.templateContent,
        playOrder: ++playOrder,
        slug
      });
    }

    stories.push(story);
  }

  let contentOpfTemplate = getTemplate('./templates/book/OEBPS/content.opf.js');
  let contentOpf = contentOpfTemplate({ id, title, chapters });

  let tocNcxTemplate = getTemplate('./templates/book/OEBPS/toc.ncx.js');
  let tocNcx = tocNcxTemplate({ id, title, chapters });

  let tocXhtmlTemplate = getTemplate('./templates/book/OEBPS/toc2.xhtml.js');
  let tocXhtml = tocXhtmlTemplate({ id, title, stories });

  let containerXml = await getFile('./templates/book/META-INF/container.xml');
  let styleCss = await getFile('./templates/book/OEBPS/style.css');

  let chapterTemplate = getTemplate('./templates/book/OEBPS/chapter.xhtml.js');

  let promise = new Promise(async (resolve) => {
    let archiveData = [];
    let archiveStream = new Writable();
    archiveStream._write = function(chunk, enc, cb) {
      archiveData.push(chunk);
      cb();
    };
    let archive = archiver('zip', {zlib: {level: 9}});
    archive.pipe(archiveStream);

    archive.on('end', () => {
      let bytes = Buffer.concat(archiveData);
      resolve(bytes);
    });
    
    archive.append('application/epub+zip', {store:true, name:'mimetype'});
    archive.append(containerXml, { name: 'META-INF/container.xml' });
    archive.append(contentOpf, { name: 'OEBPS/content.opf' });
    archive.append(tocNcx, { name: 'OEBPS/toc.ncx' });
    archive.append(tocXhtml, { name: 'OEBPS/toc.xhtml' });
    archive.append(styleCss, { name : 'OEBPS/style.css' });

    if(data.cover) {
      let coverBuffer = await readFile(process.cwd() + '/' + data.cover);
      archive.append(coverBuffer, { name: 'OEBPS/cover.jpeg' });
    }

    for(let chapter of chapters) {
      let filePath = `OEBPS/${chapter.slug}.xhtml`;
      let html = chapterTemplate(chapter);
      archive.append(html, { name: filePath });
    }

    archive.finalize();
  });

  let bytes = await promise;
  return bytes;
};

module.exports = () => template;