// @ts-check

const mappings = 'Fabric'

/**
 * i know this is a bad java parser but it's good enough for my needs
 */
class JavaClassBuilder {

  /**
   * @param {string} className 
   * @param {string} sourcePath absolute path please
   * @param {Record<string, string>} [extraImport] 
   * @returns {{ readonly class: JavaClass }}
   */
  static buildClass(className, sourcePath, extraImport = {}) {
    className += '$At_' + FS.toRawFile(sourcePath).lastModified()
    try { // @ts-ignore
      return Java.type('xyz.wagyourtail.jsmacros.core.library.impl.classes.proxypackage.' + className)
    } catch (e) {}
    extraImport[FS.toRawPath(sourcePath).getFileName().toString().slice(0, -5)] = className
    this.build(this.applyImports(this.cleanComments(FS.open(sourcePath).read()), extraImport))
    // @ts-ignore
    return Java.type('xyz.wagyourtail.jsmacros.core.library.impl.classes.proxypackage.' + className)
  }

  /**
   * @param {string} code 
   * @returns {string}
   * @private
   */
  static cleanComments(code) {
    let inBlockComment = false
    let inBlockString = false
    let inString = false
    let res = ''
    code.split(/(?<=\n)/).forEach(line => {
      if (!inBlockComment && line.startsWith('//#')) return res += line
      outer:
      while (line) {
        if (inBlockComment) {
          const index = line.indexOf('*/')
          if (index === -1) return
          else {
            line = line.slice(index + 2)
            inBlockComment = false
          }
        } else if (inBlockString) {
          let index = line.indexOf('"""')
          while (line[index - 1] === '\\') index = line.indexOf('"""', index + 1)
          if (index === -1) return res += line
          else {
            res += line.slice(0, index + 3)
            line = line.slice(index + 3)
            inBlockString = false
          }
        } else if (inString) {
          let index = line.indexOf('"')
          while (line[index - 1] === '\\') index = line.indexOf('"', index + 1)
          if (index === -1) return res += line
          else {
            res += line.slice(0, index + 1)
            line = line.slice(index + 1)
            inString = false
          }
        }
        let index = 0
        while (line) {
          const slashIndex = line.indexOf('/', index)
          const strIndex = line.indexOf('"', index)
          if (slashIndex === -1 && strIndex === -1) return res += line
          if (slashIndex !== -1 && (strIndex === -1 || slashIndex < strIndex)) {
            if (line.slice(slashIndex, slashIndex + 2) === '//') return res += line.slice(0, slashIndex).trimEnd() + '\n'
            if (line.slice(slashIndex, slashIndex + 2) === '/*') {
              inBlockComment = true
              res += line.slice(0, slashIndex) + '\n'
              line = line.slice(slashIndex + 2)
              continue outer
            }
            index = slashIndex + 1
            continue
          } else {
            if (line.slice(strIndex, strIndex + 3) === '"""') {
              inBlockString = true
              res += line.slice(0, strIndex + 3)
              line = line.slice(strIndex + 3)
              continue outer
            } else {
              inString = true
              res += line.slice(0, strIndex + 1)
              line = line.slice(strIndex + 1)
              continue outer
            }
          }
        }
      }
    })
    return res
  }

  /**
   * @param {string} code 
   * @param {Record<string, string>} extraImport 
   * @returns {string}
   * @private
   */
  static applyImports(code, extraImport) {
    /** @type {Map<string, string>} */
    const imports = new Map()
    let [head, clazz] = code.split(/\n(?=class )/, 2)
    if (!clazz) throw new Error('cannot split class!')
    head.split(/\n(?=\/\/# Imports: )/).forEach(im => {
      if (im.startsWith('//# Imports: ') && im.slice(13).split('\n', 2)[0].trim().toLowerCase() !== mappings.toLowerCase()) return
      im.split('\n').forEach(line => {
        line = line.trim()
        if (line.startsWith('import')) {
          const match = line.match(/^import\s+([\w$.]+)(?:\s+as\s+([\w$.]+))?\s*;$/)
          if (!match) return
          let [, claz, alias] = match
          alias ??= claz.split('.').at(-1) ?? 'unknown'
          imports.set(alias, claz)
        } else if (line.startsWith('const ')) {
          const match = line.match(/^const\s+(\w+)\s*=\s*(\w+)\s*;$/)
          if (!match) return
          const [, name, obf] = match
          imports.set('$' + name, obf)
        }
      })
    })
    Object.keys(extraImport).forEach(key => imports.set(key, extraImport[key]))
    const replaces = [...imports.entries()].map(/** @returns {[RegExp, string]} */ v =>
      [RegExp(`${v[0][0] === '$' ? '' : '(?<!\$)\\b'}${v[0].replaceAll(/([.$])/g, '\\$1')}\\b(?!\$)`, 'g'), v[1]]
    )
    let res = ''
    while (clazz) {
      const strIndex = clazz.indexOf('"')
      if (strIndex === -1) break
      const size = clazz.slice(strIndex, strIndex + 3) === '"""' ? 3 : 1
      res += replaces.reduce((c, r) => c.replaceAll(...r), clazz.slice(0, strIndex + size))
      clazz = clazz.slice(strIndex + size)
      let index = clazz.indexOf('"'.repeat(size))
      while (clazz[index - 1] === '\\') index = clazz.indexOf('"'.repeat(size), index + 1)
      if (index === -1) {
        res += clazz
        clazz = ''
        break
      } else {
        res += clazz.slice(0, index + size)
        clazz = clazz.slice(index + size)
      }
    }
    return res + replaces.reduce((c, r) => c.replaceAll(...r), clazz)
  }

  /**
   * @param {string} code 
   * @private
   */
  static build(code) {
    const match = code.trim().match(/^class\s+(\S+)(?:\s+extends\s+(\S+))?\s*\{((?:.|\s)*)\}$/m)
    if (!match) throw new Error('cannot parse class')
    let [, name, sup, body] = match
    sup ??= 'java.lang.Object'
    // @ts-ignore
    const builder = Reflection.createClassBuilder(name, Java.type(sup))
    const modifers = [ 'private', 'public', 'protected', 'abstract', 'final', 'static', 'synchronized' ]
    while (body = body.trimStart()) {
      let index = 0
      while (modifers.some(m => {
        if (!body.slice(index, index + 16).startsWith(m)) return false
        index += m.length + 1
        while (body[index] === ' ') {
          index++
        }
        return true
      }));
      if (Math.min(((body.indexOf('=') + 1) || body.length), ((body.indexOf(';') + 1) || body.length)) < ((body.indexOf('(') + 1) || body.length)) {
        const end = this.getEnd(body, ';');
        const field = body.slice(0, end)
        try {
          builder.addField(field)
        } catch (e) {
          Chat.log(`Error when building ${field.split(/\r?\n/, 2)[0]}:`)
          throw e
        }
        body = body.slice(end)
      } else if (body.slice(index).startsWith(name) && body.slice(index + name.length).trimStart()[0] === '(') {
        const end = this.getEnd(body, '}');
        const constructor = body.slice(0, end)
        try {
          builder.addConstructor(constructor)
        } catch (e) {
          Chat.log(`Error when building ${constructor.split(/\r?\n/, 2)[0]}:`)
          throw e
        }
        body = body.slice(end)
      } else {
        const end = this.getEnd(body, '}');
        const method = body.slice(0, end)
        try {
          builder.addMethod(method)
        } catch (e) {
          Chat.log(`Error when building ${method.split(/\r?\n/, 2)[0]}:`)
          throw e
        }
        body = body.slice(end)
      }
    }
    return builder.finishBuildAndFreeze()
  }

  /**
   * @param {string} body
   * @param {string} stopAt 
   * @returns {number}
   * @private
   */
  static getEnd(body, stopAt = ';') {
    let stack = ''
    let index = -1
    const table = { '(': ')', '[': ']', '{': '}' }
    outer:
    while (true) {
      while (!'()[]{}";'.includes(body[++index])) {
        if (body[index] === undefined) throw new Error(`Unexpected end at ${body}. Trying to stop at ${stopAt}, Stack: ${stack}`)
      }
      switch (body[index]) {
        case '(':
        case '[':
        case '{':
          stack += body[index]
          continue outer
        case ')':
        case ']':
        case '}':
          if (stack === '' || table[stack.at(-1)] !== body[index]) break
          stack = stack.slice(0, -1)
          if (stack === '' && stopAt === body[index]) return index + 1
          continue outer
        case '"':
          const size = body.slice(index, index + 3) === '"""' ? 3 : 1
          index += size
          index = body.indexOf('"'.repeat(size), index)
          while (body[index - 1] === '\\') index = body.indexOf('"'.repeat(size), index + 1)
          if (index === -1) index = body.length
          else index += size - 1
          continue outer
        case ';':
          if (stack === '' && stopAt === ';') return index + 1
          continue outer
        default:
          break
      }
      throw new Error(`Unexpected token ${body[index]} around \`${body.slice(Math.max(0, index - 16), index + 16)}\`. Stack: ${stack}`)
    }
  }

}

module.exports = JavaClassBuilder
