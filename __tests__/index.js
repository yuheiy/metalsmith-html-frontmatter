const htmlFrontMatter = require('..')
const path = require('path')
const del = require('del')
const Metalsmith = require('metalsmith')
const layouts = require('metalsmith-layouts')
var dirEqual = require('assert-dir-equal')

afterEach(() => {
  return del('fixtures/build')
})

test('should parse front-matter', (done) => {
  const root = path.join(__dirname, '../fixtures')
  const actual = path.join(root, 'build')
  const expected = path.join(root, 'expected')

  Metalsmith(root)
    .use(htmlFrontMatter({ pattern: ['**', '!comment.html'] }))
    .use(layouts({ directory: 'layouts' }))
    .build((err) => {
      if (err) {
        return done(err)
      }
      expect(() => dirEqual(actual, expected)).not.toThrow()
      done()
    })
})
