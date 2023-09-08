// @ts-check
const NbtIoHelper = require('../lib/NbtIoHelper')
const NbtHelper = require('../lib/NbtHelper')

const logger = require('../modules/StorageManagerLogger')

const filenameRegex = /^[^\\\/:*?"<>|\r\n]+$(?<!\.$)/
const dataroot = FS.toRawPath(__dirname).getParent() + '/data/'

const chestDataKeys = [ 'type', 'slots', 'items', 'counts' ]
const chunkPosStringRegex = /^(-?(?:0|[1-9]\d*)),(-?(?:0|[1-9]\d*))$/
const blockPosStringRegex = /^(-?(?:0|[1-9]\d*)),(-?(?:0|[1-9]\d*)),(-?(?:0|[1-9]\d*))$/

class DataManager {
  /**
   * @type {Record<string, string>}
   * @readonly
   * @private
   */
  static profileIndex = this.getJsonOrDefault('./profileIndex.json', undefined, (json, backup) => {
    if (!Object.values(json).every(v => typeof v === 'string' && filenameRegex.test(v))) {
      for (const key of Object.keys(json).filter(k => typeof json[k] !== 'string' || !filenameRegex.test(json[k]))) {
        delete json[key]
      }
      backup()
    }
  })

  static {
    FS.makeDir(dataroot)
  }

  /**
   * @param {string} id 
   */
  static getProfileIndex(id) {
    const profile = this.profileIndex[id]
    return profile ? filenameRegex.test(profile) ? profile : null : null
  }

  /**
   * @param {string} id 
   * @param {string} name 
   */
  static setProfileIndex(id, name) {
    verifyName(name, 'server name')
    this.profileIndex[id] = name
    this.saveJson('./profileIndex.json', this.profileIndex)
  }

  /**
   * @param {string} id 
   */
  static delProfileIndex(id) {
    if (id in this.profileIndex) {
      delete this.profileIndex[id]
      this.saveJson('./profileIndex.json', this.profileIndex)
    }
  }

  /**
   * @param {string} name 
   * @returns {boolean}
   */
  static hasProfile(name) {
    return Object.values(this.profileIndex).includes(name)
  }

  /**
   * @returns {DataManager?}
   */
  static getCurrentProfile() {
    const profile = this.getProfileIndex(World.getWorldIdentifier())
    return profile === null ? null : new DataManager(profile)
  }

  /**
   * @param {string} path 
   * @param {((type: 'object' | 'array' | string & {}, json: any) => boolean)?} verifier checks if the type of json is correct, checks object by default
   * @param {((json: any, backup: () => void, defaultSupplier: () => any) => any)?} fixer fixes the json data if it's corrupted. returns json if changed, nullish otherwise
   * @param {string?} indent
   * @param {() => any} defaultSupplier 
   */
  static getJsonOrDefault(path, verifier = type => type === 'object', fixer = null, indent = '  ', defaultSupplier = () => ({})) {
    path = fixedPath(path)
    const pa = FS.toRawPath(path)

    if (!FS.isFile(path) && !FS.createFile(pa.getParent().toString(), pa.getFileName().toString(), true)) throw new Error(`Can't create ${path}`)
    const file = FS.open(path)
    const data = file.read()
    if (data.trim() === '') {
      const json = defaultSupplier()
      file.write(JSON.stringify(json, undefined, indent ?? undefined))
      return json
    } else {
      try {
        let json = JSON.parse(data)
        if (verifier && !verifier(Array.isArray(json) ? 'array' : typeof json, json)) {
          logger.warn(`Verifier for "${path}" didn't pass`)
          json = defaultSupplier()
          this.backup(path)
          file.write(JSON.stringify(json, undefined, indent ?? undefined))
          return json
        }
        if (fixer) {
          json = fixer(json, () => this.backup(path), defaultSupplier) ?? json
          const str = JSON.stringify(json, undefined, indent ?? undefined)
          if (data !== str) file.write(str)
        }
        return json
      } catch (e) {
        logger.warn(`Error when parsing ${path}: `, e)
        const json = defaultSupplier()
        this.backup(path)
        file.write(JSON.stringify(json, undefined, indent ?? undefined))
        return json
      }
    }
  }

  /**
   * @param {string} path 
   * @param {*} json 
   * @param {string?} indent
   */
  static saveJson(path, json, indent = '  ') {
    this.save(path, JSON.stringify(json, undefined, indent ?? undefined))
  }

  /**
   * @param {string} path 
   * @param {NbtCompound} nbt 
   */
  static saveNbt(path, nbt) {
    this.save(path, () => NbtIoHelper.writeRawCompressed(path, nbt))
  }

  /** @private */
  static saveConfirm = false
  /**
   * @type {Record<string, string | (() => void)>}
   * @readonly
   * @private
   */
  static saveQueue = {}
  /**
   * @type {IEventListener?}
   * @private
   */
  static savingTickListener = null

  /**
   * @param {string} path
   * @param {string | (() => void)} data
   * @private
   */
  static save(path, data) {
    if (data == null) return
    logger.debug?.(`save called (${path.split(/[\\\/]/).at(-1)})`)
    this.saveQueue[fixedPath(path)] = data
    this.saveConfirm = false
    this.savingTickListener ??= JsMacros.on('Tick', JavaWrapper.methodToJava(() => {
      if (!this.saveConfirm) this.saveConfirm = true
      else {
        for (const path in this.saveQueue) try {
          if (!FS.isFile(path)) {
            const pa = FS.toRawPath(path)
            if (!FS.createFile(pa.getParent().toString(), pa.getFileName().toString(), true)) throw new Error(`Can't create ${path}`)
          }
          logger.debug?.('Saving file: ' + path.split(/[\\\/]/).at(-1))
          const data = this.saveQueue[path]
          if (typeof data === 'function') data()
          else FS.open(path).write(`${data}`)
          logger.debug?.('File saved: ' + path.split(/[\\\/]/).at(-1))
        } catch (e) {
          logger.warn(`Error while saving file "${path}": `, e)
        } finally {
          delete this.saveQueue[path]
        }
        if (this.savingTickListener)
        JsMacros.off('Tick', this.savingTickListener)
        this.savingTickListener = null
        this.saveConfirm = false
      }
    }))
  }

  /**
   * @param {string} path 
   * @returns 
   */
  static backup(path) {
    path = fixedPath(path)
    const pa = FS.toRawPath(path)
    if (FS.isDir(path)) throw new Error('this backup method can only backups file!')
    if (!FS.isFile(path) || FS.open(path).read().trim() === '') return false
    const name = pa.getFileName() + '.bak'
    const baknum = FS.list(pa.getParent().toString())
      .filter(f => f.startsWith(name))
      .map(f => f.slice(name.length) || '1')
      .filter(f => /^\d+$/.test(f))
      .reduce((p, v) => Math.max(p, parseInt(v) + 1), 1)
    FS.copy(path, `${path}.bak${baknum === 1 ? '' : baknum}`)
    logger.warn(`Backed up file: ${path.split(/[\\\/]/).at(-1)}.bak${baknum === 1 ? '' : baknum}`)
    return true
  }

  /**
   * boolean | number | string | object | any[]
   * @template J
   * @param {J} jsona 
   * @param {J} jsonb 
   * @returns {boolean}
   */
  static jsonEquals(jsona, jsonb) {
    if (Array.isArray(jsona) || Array.isArray(jsonb)) {
      if (Array.isArray(jsona) && Array.isArray(jsonb)) {
        if (jsona.length !== jsonb.length) return false
        return jsona.every((a, i) => this.jsonEquals(a, jsonb[i]))
      }
      return false
    }
    if (typeof jsona !== typeof jsonb) return false
    if (typeof jsona !== 'object') return jsona === jsonb
    // @ts-ignore 
    const keys = Object.keys(jsona)
    // @ts-ignore
    const keysb = Object.keys(jsonb)
    if (keys.length !== keysb.length) return false
    keys.sort()
    keysb.sort()
    if (!keys.every((v, i) => v === keysb[i])) return false
    // @ts-ignore
    return keys.every(k => this.jsonEquals(jsona[k], jsonb[k]))
  }

  static Settings = class Settings {
    /**
     * @type {object}
     * @readonly
     * @private
     */
    static settings = DataManager.getJsonOrDefault('./settings.json')

    /**
     * @param {string} key 
     * @param {boolean} defaultValue 
     * @returns {boolean}
     */
    static getBoolean(key, defaultValue = false) {
      return this._get(key, 'boolean', defaultValue)
    }

    /**
     * @param {string} key 
     * @param {number} defaultValue 
     * @returns {number}
     */
    static getNumber(key, defaultValue = 0) {
      return this._get(key, 'number', defaultValue)
    }

    /**
     * @param {string} key 
     * @param {string} defaultValue 
     * @returns {string}
     */
    static getString(key, defaultValue = '') {
      return this._get(key, 'string', defaultValue)
    }

    /**
     * @param {string} key 
     * @param {object} defaultValue 
     * @returns {object}
     */
    static getObject(key, defaultValue = {}) {
      return this._get(key, 'object', defaultValue)
    }

    /**
     * @param {string} key 
     * @param {any[]} defaultValue 
     * @returns {any[]}
     */
    static getArray(key, defaultValue = []) {
      return this._get(key, 'array', defaultValue)
    }

    /**
     * @param {string} key 
     * @returns {*}
     */
    static get(key) {
      return this.settings[key]
    }

    /**
     * @param {string} key 
     * @param {boolean | number | string | object | any[]} value 
     */
    static set(key, value) {
      this.settings[key] = value
      this.saveSettings()
    }

    /**
     * @param {string} key 
     * @param {'boolean' | 'number' | 'string' | 'object' | 'array'} type 
     * @param {boolean | number | string | object | any[]} defaultValue
     * @private
     */ 
    static _get(key, type, defaultValue) {
      if (type === 'array' ? Array.isArray(this.settings[key]) : typeof this.settings[key] === type) return this.settings[key]
      this.settings[key] = defaultValue
      this.saveSettings()
      return defaultValue
    }
    
    /** @private */
    static saveSettings() {
      DataManager.saveJson('./settings.json', this.settings)
    }

  }

  /**
   * @type {string}
   * @readonly
   * @private
   */
  itemsPath
  /**
   * @type {string}
   * @readonly
   */
  profileName
  /**
   * @type {JavaList<NbtCompound>}
   * @readonly
   * @private
   */
  items
  /**
   * @type {(ItemStackHelper | null)[]}
   * @readonly
   * @private
   */
  itemStackCache = []
  /** @private */
  newItemIndex = -1

  /**
   * @type {JavaMap<ChunkPosString, ChestChunkData>}
   * @readonly
   * @private
   */
  // @ts-ignore
  chestChunks = JavaUtils.createHashMap()
  /**
   * @type {Record<ChunkPosString, number[]>}
   * @readonly
   * @private
   */
  chunkItemRecord  

  /**
   * @param {string} profileName pattern: `/^[^\\\/:*?"<>|\r\n]+$(?<!\.$)/`
   */
  constructor (profileName) {
    verifyName(profileName, 'server name')
    this.profileName = profileName
    FS.makeDir(fixedPath(`./${profileName}/chests`))

    this.itemsPath = fixedPath(`./${profileName}/items.nbt`)
    try {
      if (!FS.isFile(this.itemsPath)) throw null
      const nbt = NbtIoHelper.readRawCompressed(this.itemsPath)
      if (!nbt) throw new Error('loaded value is null')
      const contained = NbtHelper.getContainedList(NbtHelper.getList(nbt, 'items'))
      if (!NbtHelper.isListOfCompound(contained)) throw new Error('incorrect type of list')

      this.items = contained
    } catch (e) {
      if (e) {
        logger.warn(`Failed to load items for ${profileName}: `, e)
        DataManager.backup(this.itemsPath)
        FS.unlink(this.itemsPath)
      }
      this.items = JavaUtils.createArrayList()
    }

    this.chunkItemRecord = DataManager.getJsonOrDefault(`./${profileName}/chunk-item_record.json`, undefined, (json, backup) => {
      let shouldBackup = false
      const list = FS.list(fixedPath(`./${profileName}/chests`)).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5))
      for (const key in json) {
        if (!list.includes(key) || !Array.isArray(json[key]) || !json[key].every(v => typeof v === 'number')) {
          delete json[key]
          shouldBackup = true
        }
      }
      if (shouldBackup) backup()
    }, null)

    const existItems = new Set(Object.values(this.chunkItemRecord).flat())
    const empty = NbtHelper.newNbtCompound()
    let shouldSaveItems = false
    for (let i = this.items.size() - 1; i >= 0; i--) {
      if (!existItems.has(i + 1)) {
        this.items.set(i, empty)
        shouldSaveItems = true
      }
    }
    for (let i = this.items.size() - 1; i >= 0 && empty.equals(this.items.get(i)); i--) {
      this.items.remove(i)
      shouldSaveItems = true
    }
    if (shouldSaveItems) DataManager.save(this.itemsPath, () => {
      const nbt = NbtHelper.newNbtCompound()
      NbtHelper.putElement(nbt, 'items', NbtHelper.toNbtList(this.items))
      NbtIoHelper.writeRawCompressed(this.itemsPath, nbt)
    })

    this.updateNewItemIndex()
    logger.debug?.(`new DataManager("${profileName}"), Loaded items size: ${this.items.size()}`)
  }

  /** @private */
  updateNewItemIndex() {
    if (this.newItemIndex + 1 === this.items.size()) {
      this.newItemIndex++
      return
    }
    const nullIndex = this.items.indexOf(NbtHelper.newNbtCompound())
    this.newItemIndex = nullIndex !== -1 ? nullIndex : this.items.size()
  }

  /**
   * @param {ItemStackHelper} item 
   * @returns {number}
   */
  getItemIndex(item) {
    if (item.isEmpty()) return 0
    const nbt = NbtHelper.getNbtFromItem(item)
    let index = this.items.indexOf(nbt)
    if (index !== -1) return index + 1
    index = this.newItemIndex
    if (index >= this.items.size()) {
      index = this.items.size()
      this.items.add(nbt)
    } else this.items.set(index, nbt)
    logger.debug?.(`item added (${item.getItemId()})`)
    this.updateNewItemIndex()
    DataManager.save(this.itemsPath, () => {
      const nbt = NbtHelper.newNbtCompound()
      NbtHelper.putElement(nbt, 'items', NbtHelper.toNbtList(this.items))
      NbtIoHelper.writeRawCompressed(this.itemsPath, nbt)
    })
    return index + 1
  }

  /**
   * @param {number} index 
   * @returns {ItemStackHelper?}
   */
  getItem(index) {
    if (this.itemStackCache[index]) return this.itemStackCache[index]
    const nbt = this.getNbtItem(index)
    return this.itemStackCache[index] = nbt ? NbtHelper.getItemFromNbt(nbt) : null
  }

  /**
   * @param {number} index 
   * @returns {NbtCompound?}
   */
  getNbtItem(index) {
    if (index <= 0) return null
    const nbt = this.items.get(index - 1)
    return (!nbt || NbtHelper.isEmpty(nbt)) ? null : nbt
  }

  /**
   * @param {number} itemIndex 
   * @returns {Pos3D[]}
   */
  findItemLocations(itemIndex) {
    const locs = []
    logger.warn('not implemented: findItemLocations')
    return locs
  }

  /**
   * @param {ChunkPosString} chunkPos 
   * @returns {ChestChunkData}
   */
  getChestChunk(chunkPos) {
    if (!chunkPosStringRegex.test(chunkPos)) throw new SyntaxError(`Wrong chunkPos syntax! (${chunkPos})`)
    if (this.chestChunks.containsKey(chunkPos)) {
      const data = this.chestChunks.get(chunkPos)
      if (data) return data
    }
    const chunk = DataManager.getJsonOrDefault(`./${this.profileName}/chests/${chunkPos}.json`, undefined, (json, backup) => {
      let shouldBackup = false
      for (const key in json) if (key !== 'chests' && key !== 'ignored') delete json[key]
      if (typeof json.chests !== 'object' || Array.isArray(json.chests)) {
        if ('chests' in json) shouldBackup = true
        json.chests = {}
      }
      if (!Array.isArray(json.ignored) || !json.ignored.every(v => blockPosStringRegex.test(v))) {
        if ('ignored' in json) shouldBackup = true
        if (!Array.isArray(json.ignored)) json.ignored = []
        else json.ignored = json.ignored.filter(v => blockPosStringRegex.test(v))
      }
      const chests = json.chests
      for (const key in chests) {
        if (!blockPosStringRegex.test(key)) {
          shouldBackup = true
          delete chests[key]
          continue
        }
        /** @type {ChestData} */
        const chest = chests[key]
        let toss = false
        if (!chestDataKeys.every(k => k in chest)) toss = true
        for (const prop in chest) {
          if (toss) break
          if (!chestDataKeys.includes(prop)) {
            shouldBackup = true
            delete chest[prop]
            continue
          }
          switch (prop) {
            case 'type':
              if (typeof chest[prop] !== 'string') toss = true
              break
            case 'slots':
              if (typeof chest[prop] !== 'number') toss = true
              break
            case 'items':
            case 'counts':
              if (!Array.isArray(chest[prop]) || !chest[prop].every(v => typeof v === 'number')) toss = true
              break
          }
        }
        if (chest.items.reduce((p, v) => v === 0 ? p : p + 1, 0) !== chest.counts.length) toss = true
        if (toss) {
          shouldBackup = true
          delete chests[key]
          continue
        }
      }
      if (shouldBackup) backup()
      for (const ignored of json.ignored) if (ignored in chests) delete chests[ignored]
    }, null, () => ({ chests: {}, ignored: [] }))
    this.chestChunks.put(chunkPos, chunk)
    return chunk
  }

  /**
   * @param {ChunkPosString} chunkPos 
   */
  saveChestChunk(chunkPos) {
    if (!chunkPosStringRegex.test(chunkPos)) throw new SyntaxError(`Wrong chunkPos syntax! (${chunkPos})`)
    const path = fixedPath(`./${this.profileName}/chests/${chunkPos}.json`)
    const chunk = this.chestChunks.get(chunkPos)
    const data = JSON.stringify(chunk)
    logger.debug?.(`ChestChunk data length: ${data.length}`)
    if (data.length <= 25) {
      if (FS.isFile(path)) FS.unlink(path)
    } else if (this.chestChunks.containsKey(chunkPos)) DataManager.save(path, data)
    if (!chunk) return
    const items = new Set(Object.values(chunk.chests).flatMap(v => v.items))
    items.delete(0)
    if (items.size > 0 || chunkPos in this.chunkItemRecord) {
      if (items.size === 0) delete this.chunkItemRecord[chunkPos]
      else this.chunkItemRecord[chunkPos] = [...items]
      DataManager.saveJson(`./${this.profileName}/chunk-item_record.json`, this.chunkItemRecord, null)
    }
  }

  /**
   * @param {ChunkPosString} chunkPos 
   * @returns {boolean}
   */
  hasChestChunkData(chunkPos) {
    if (!chunkPosStringRegex.test(chunkPos)) throw new SyntaxError(`Wrong chunkPos syntax! (${chunkPos})`)
    return FS.isFile(fixedPath(`./${this.profileName}/chests/${chunkPos}.json`))
  }

  /**
   * @param {BlockPos} pos 
   * @returns {{ chunkPos: ChunkPosString, stringPos: BlockPosString }}
   */
  convertStringPos(pos) {
    /** @type {ChunkPosString} */// @ts-ignore
    const chunkPos = `${Math.floor(pos.getX()) >> 4},${Math.floor(pos.getZ()) >> 4}` // the get and save will handle the syntax
    /** @type {BlockPosString} */// @ts-ignore
    const stringPos = `${Math.floor(pos.getX())},${Math.floor(pos.getY())},${Math.floor(pos.getZ())}`
    if (!blockPosStringRegex.test(stringPos)) throw new SyntaxError(`Wrong stringPos syntax! (${stringPos})`)
    return { chunkPos, stringPos }
  }

  /**
   * @param {BlockPos} pos 
   * @param {string} type
   * @param {(ItemStackHelper | null)[]} items 
   */
  setChestData(pos, type, items) {
    const { chunkPos, stringPos } = this.convertStringPos(pos)
    const chunk = this.getChestChunk(chunkPos)
    if (chunk.ignored.includes(stringPos)) return

    const slots = items.length
    let lastIndex = items.length - 1
    for (; lastIndex >= 0; lastIndex--) {
      if (items[lastIndex] && !items[lastIndex]?.isEmpty()) break
    }
    // if (lastIndex === -1) {
    //   delete chunk.chests[stringPos]
    //   return
    // }
    items = items.slice(0, lastIndex + 1)
    const counts = []
    const mappedItems = items.map(item => {
      if (!item || item.isEmpty()) return 0
      counts.push(item.getCount())
      return this.getItemIndex(item)
    })
    if (type.startsWith('minecraft:')) type = type.slice(10)
    chunk.chests[stringPos] = {
      type: `${type}`,
      slots,
      items: mappedItems,
      counts
    }
    this.saveChestChunk(chunkPos)
    logger.debug?.('Container Stored')
  }

  /**
   * @param {BlockPos} pos 
   * @returns {ChestData?}
   */
  getChestData(pos) {
    const { chunkPos, stringPos } = this.convertStringPos(pos)
    if (!this.hasChestChunkData(chunkPos)) return null
    const chunk = this.getChestChunk(chunkPos)
    if (chunk.ignored.includes(stringPos)) return null
    return chunk.chests[stringPos] ?? null
  }

  /**
   * @param {BlockPos} pos 
   * @param {boolean} ignore 
   */
  setIgnored(pos, ignore = true) {
    const { chunkPos, stringPos } = this.convertStringPos(pos)
    const chunk = this.getChestChunk(chunkPos)
    if (ignore) {
      delete chunk.chests[stringPos]
      if (!chunk.ignored.includes(stringPos)) {
        chunk.ignored.push(stringPos)
        this.saveChestChunk(chunkPos)
      }
    } else if (chunk.ignored.includes(stringPos)) {
      chunk.ignored = chunk.ignored.filter(p => p !== stringPos)
      this.saveChestChunk(chunkPos)
    }
  }

  /**
   * @param {BlockPos} pos 
   * @returns {boolean}
   */
  isIgnored(pos) {
    const { chunkPos, stringPos } = this.convertStringPos(pos)
    if (!this.hasChestChunkData(chunkPos)) return false
    const chunk = this.getChestChunk(chunkPos)
    return chunk.ignored.includes(stringPos)
  }

  getChunksInRenderDistance() {
    const dist = Client.getGameOptions().getVideoOptions().getRenderDistance()
    const cpos = Player.getPlayer().getChunkPos()
    return this.getChunksInChunkArea(PositionCommon.createVec(cpos.x - dist, cpos.y - dist, cpos.x + dist, cpos.y + dist))
  }

  /**
   * @param {Vec2D} vec 
   * @returns {ChunkPosString[]}
   */
  getChunksInChunkArea(vec) {
    vec.x1 = Math.floor(vec.x1)
    vec.x2 = Math.floor(vec.x2)
    vec.y1 = Math.floor(vec.y1)
    vec.y2 = Math.floor(vec.y2)
    let temp
    if (vec.x1 > vec.x2) {
      temp = vec.x1
      vec.x1 = vec.x2
      vec.x2 = temp
    }
    if (vec.y1 > vec.y2) {
      temp = vec.y1
      vec.y1 = vec.y2
      vec.y2 = temp
    }
    const fileList = this.getAllChunks().filter(f => {
        const match = f.match(chunkPosStringRegex)
        if (!match) return false
        const x = parseInt(match[1])
        const z = parseInt(match[2])
        return vec.x1 <= x && x <= vec.x2 && vec.y1 <= z && z <= vec.y2
      }) ?? []
    // @ts-ignore
    return fileList
  }

  /**
   * @returns {string[]}
   */
  getAllChunks() {
    return FS.list(fixedPath(`./${this.profileName}/chests/`))
      ?.filter(f => f.endsWith('.json'))
      .map(f => f.slice(0, -5))
      .filter(f => chunkPosStringRegex.test(f)) ?? []
  }

  /**
   * @param {ChunkPosString} cpos 
   * @returns {JavaMap<number, number>?}
   */
  getItemsInChunk(cpos, unpackShulker = false) {
    if (!this.hasChestChunkData(cpos)) return null
    /** @type {JavaMap<number, number>} */// @ts-ignore
    const items = JavaUtils.createHashMap()
    Object.values(this.getChestChunk(cpos).chests)
      .forEach(chest => this.decodeItems(chest.items, chest.counts, unpackShulker, items))
    return items
  }

  /**
   * @param {readonly number[]} itemIndexes 
   * @param {readonly number[]} counts 
   * @param {boolean} unpackShulker 
   * @param {JavaMap<number, number>} items
   * @returns {JavaMap<number, number>}
   */// @ts-ignore
  decodeItems(itemIndexes, counts, unpackShulker = false, items = JavaUtils.createHashMap()) {
    let countIndex = 0
    itemIndexes.forEach(i => {
      if (i === 0) return
      items.put(i, items.getOrDefault(i, 0) + counts[countIndex++])
    })
    if (unpackShulker) {
      for (const itemIndex of java.util.Set.copyOf(items.keySet())) {
        const item = this.getNbtItem(itemIndex)
        if (!item || !NbtHelper.isShulker(item)) continue
        const sitems = NbtHelper.unpackItems(item)
        const count = items.get(itemIndex) ?? 1
        items.remove(itemIndex)
        for (const item of sitems.keySet()) {
          const i = this.getItemIndex(item)
          items.put(i, items.getOrDefault(i, 0) + (sitems.get(item) ?? 0) * count)
        }
      }
    }
    items.remove(0)
    return items
  }

  clearCache() {
    this.chestChunks.clear()
    this.itemStackCache.splice(0, Infinity)
  }

}

/**
 * @param {string} name 
 * @param {string} [id] 
 */
function verifyName(name, id = 'filename') {
  if (typeof name !== 'string') throw new TypeError(`${id} should be string! (${name}) (${typeof name})`)
  if (!filenameRegex.test(name)) throw new SyntaxError(`${id} should be valid file name! (${name})`)
}

/**
 * @param {string} [path] 
 * @returns {string} fixed path that won't be affected by main script location
 */
function fixedPath(path = '') {
  return path.includes(':') ? path : dataroot + path
}

module.exports = DataManager

/**
 * @typedef {`${bigint},${bigint}`} ChunkPosString
 * @typedef {`${bigint},${bigint},${bigint}`} BlockPosString
 * @typedef {{ chests: Record<BlockPosString, ChestData>, ignored: BlockPosString[] }} ChestChunkData
 * @typedef {Object} ChestData
 * @prop {string} type
 * @prop {number} slots
 * @prop {readonly number[]} items
 * @prop {readonly number[]} counts
 */
