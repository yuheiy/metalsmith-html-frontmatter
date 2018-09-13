'use strict'

const path = require('path')
const parseFrontMatter = require('@yuheiy/html-frontmatter')
const multimatch = require('multimatch')
const debug = require('debug')('@yuheiy/metalsmith-html-frontmatter')

const isHtml = (filename) => path.extname(filename) === '.html'

const defaultSettings = {
  pattern: '**',
}

const plugin = (opts) => {
  const settings = {
    ...defaultSettings,
    ...opts,
  }

  return (files, _metalsmith, done) => {
    setImmediate(done)

    multimatch(Object.keys(files), settings.pattern).forEach((file) => {
      debug('checking file: %s', file)

      if (!isHtml(file)) {
        return
      }

      const data = files[file]
      const contents = String(data.contents)
      const frontMatter = parseFrontMatter(contents)

      debug('checking front-matter: %O', frontMatter)

      if (!frontMatter.data) {
        return
      }

      Object.entries(frontMatter.data).forEach(([key, value]) => {
        data[key] = value
      })
      data.contents = Buffer.from(frontMatter.content)
    })
  }
}

module.exports = plugin
