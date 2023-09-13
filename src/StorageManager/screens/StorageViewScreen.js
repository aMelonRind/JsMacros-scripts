// @ts-check
const Text = Java.type('xyz.wagyourtail.jsmacros.client.api.classes.render.components.Text')
const JavaClassBuilder = require('../lib/JavaClassBuilder')
const Threads = require('../lib/Threads')
const DataManager = require('../modules/DataManager')
const logger = require('../modules/StorageManagerLogger')

const { itemsPosition, searchBarPosition } = require('../positionSettings.js').storageViewer

/** @enum {string} */
const LoadMethod = {
  /** @readonly */ RENDER_DISTANCE: 'render_distance',
  /** @readonly */ ALL: 'all',
  /** @readonly */ STORAGE_AREA: 'storage_area'
}

/** @enum {string} */
const SortMethod = {
  /** @readonly */ NAME: 'name',
  /** @readonly */ COUNT: 'count',
  /** @readonly */ DISTANCE: 'distance'
}

/** [source](./classes/DrawContextProxy.java) */
const DrawContextProxy = JavaClassBuilder.buildClass('MelonRind$Proxy$DrawContextProxy', __dirname + '/classes/DrawContextProxy.java')
/** [source](./classes/SearchBar.java) */
const SearchBar = JavaClassBuilder.buildClass('MelonRind$RenderElement$SearchBar', __dirname + '/classes/SearchBar.java')

/**
 * [source](./StorageViewScreen.java)
 * @type {{ readonly class: JavaClass<StorageViewScreenInstance> } & (new () => StorageViewScreenInstance)}
 */// @ts-ignore
const StorageViewScreenClass = JavaClassBuilder.buildClass(
  'MelonRind$Screen$StorageViewScreen', __dirname + '/StorageViewScreen.java', {
    ItemTextOverlay: require('./elements/ItemTextOverlay').create('', 0, 0).getClass().getTypeName(),
    DrawContextProxy: DrawContextProxy.class.getTypeName(),
    SearchBar: SearchBar.class.getTypeName()
  }
)

class StorageViewScreen {

  static searchText = 'currently is an useless searchbar'

  /**
   * @param {IScreen?} parent
   * @param {DataManager} profile 
   */
  static async open(parent, profile) {
    logger.debug?.('StorageViewScreen.open()')
    const screen = new StorageViewScreenClass()
    screen.setParent(parent)
    screen.drawTitle = false

    // const isCurrentWorld = World.isWorldLoaded() && profile.profileName === DataManager.getProfileIndex(World.getWorldIdentifier())
    const loadingLabel = new Text('', 0, 0, 0xFFFFFF, 0, true, 1, 0)

    screen.setOnInit(await Threads.wrapCallback(s => {
      const screenSize = PositionCommon.createPos(s.getWidth(), s.getHeight())
      loadingLabel.setPos(8, screenSize.y - 16)
      s.reAddElement(loadingLabel)
    }, { loadingLabel }))

    screen.setItemsPositionFunction(await Threads.wrapCallback(itemsPosition))
    screen.setSearchBarPositionFunction(await Threads.wrapCallback(searchBarPosition))
    screen.setSortComparator(await Threads.wrapCallback((a, b) => {
      const count = Math.sign(screen.getLoadedCount(a) - screen.getLoadedCount(b))
      if (count) return count
      const name1 = screen.getCache(a)?.getName()?.getStringStripFormatting() || ''
      const name2 = screen.getCache(b)?.getName()?.getStringStripFormatting() || ''
      if (name1 !== name2) return name1 > name2 ? -1 : 1
      return 0
    }, { screen }))
    screen.setOnClickItem(JavaWrapper.methodToJavaAsync((i, btn) => { // currently bugged because of guest object variables
      logger.log(`Clicked item: [${i}]: ${profile.getItem(i)?.getItemId()}, button: ${btn}`)
    })) // , { logger, profile }
    // screen.setTooltipFunction(JavaWrapper.methodToJava(i => {
    //   return Java.to(['aaaaaaaa'])
    // }))
    // screen.setExtraTooltipFunction(JavaWrapper.methodToJava(i => {
    //   return Java.to(['extra tooltip here', ''])
    // }))
    // screen.setFilterer(JavaWrapper.methodToJava(i => {
    //   return screen.getLoaded(i) > 1000
    // }))
    screen.sortReversed = true

    screen.setOnClose(JavaWrapper.methodToJavaAsync(s => {
      s.removeElement(loadingLabel)
      screen.destroy()
      Threads.cleanWrapper()
    }))

    new ItemsLoader(screen, profile, loadingLabel, LoadMethod.RENDER_DISTANCE, null).load(JavaWrapper.methodToJava(() => {
      // Threads.run(() => Hud.openScreen(screen), {screen})
    }))
    
    Hud.openScreen(screen)
  }

}

class ItemsLoader {
  
  /** @private @readonly @type {StorageViewScreenInstance} */ screen
  /** @private @readonly @type {DataManager} */ profile
  /** @private @readonly @type {Text} */ loadingLabel
  /** @private @readonly @type {LoadMethod} */ loadMethod
  /** @private @readonly @type {object?} */ storageArea

  /** @private @readonly */ unpackShulker = DataManager.Settings.getBoolean('unpackShulker', false)
  stopped = false

  /**
   * @param {StorageViewScreenInstance} screen 
   * @param {DataManager} profile 
   * @param {Text} loadingLabel
   * @param {LoadMethod} loadMethod
   * @param {object?} storageArea
   */
  constructor (screen, profile, loadingLabel, loadMethod, storageArea = null) {
    this.screen = screen
    this.profile = profile
    this.loadingLabel = loadingLabel
    this.loadMethod = loadMethod
    this.storageArea = storageArea
  }

  /**
   * @param {MethodWrapper?} callback 
   */
  async load(callback = null) {
    this.loading = true
    logger.debug?.('Loading items...')
    this.stopped = false
    this.clean()
    await Threads.escapeThread()
    const chunks = this.profile.getChunksInRenderDistance() // TODO: more load methods
    for (const index in chunks) {
      // await Threads.escapeThread()
      this.loadingLabel.setText(`Loading Chunk ${chunks[index]} (${index}/${chunks.length})...`)
      this.screen.setLoadProgress((+index + 1) / chunks.length)
      if (this.#checkStop()) break
      const items = this.profile.getItemsInChunk(chunks[index], this.unpackShulker)
      if (!items) continue
      if (this.#checkStop()) break
      for (const item of items.keySet()) {
        if (this.#checkStop()) break
        this.screen.addItem(item, this.profile.getItem(item), items.get(item) ?? 0)
      }
    }
    this.screen.setLoadProgress(1.1)
    this.loadingLabel.setText('')
    logger.debug?.('Loaded items')
    this.loading = false
    callback?.run()
  }

  #checkStop() {
    JavaWrapper.deferCurrentTask()
    if (this.stopped || this.screen.isDestroyed()) return true
    return false
  }

  stop(clean = true) {
    this.stopped = true
    if (clean) this.clean()
  }

  clean() {
    this.loadingLabel.setText('')
  }

}

module.exports = StorageViewScreen

/**
 * @typedef {ScriptScreen & OtherProperties} StorageViewScreenInstance
 * @typedef {object} OtherProperties
 * @prop {(items: JavaMap<int, long>) => void} addItems
 * @prop {(item: int, itemStack: ItemStackHelper?, count: long) => void} addItem
 * @prop {() => void} clearItems
 * @prop {(item: int) => ItemStackHelper?} getCache
 * @prop {(filterer: MethodWrapper<int, any, boolean>?) => void} setFilterer
 * @prop {(onClickItem: MethodWrapper<int, int>?) => void} setOnClickItem
 * @prop {(tooltipFunction: MethodWrapper<int, any, JavaArray<string | TextHelper | TextBuilder>?>?) => void} setTooltipFunction
 * @prop {(extraTooltipFunction: MethodWrapper<int, any, JavaArray<string | TextHelper | TextBuilder>?>?) => void} setExtraTooltipFunction
 * @prop {(itemsPositionFunction: MethodWrapper<Pos2D, any, Vec2D>?) => void} setItemsPositionFunction
 * @prop {(searchBarPositionFunction: MethodWrapper<Pos2D, any, Vec2D>?) => void} setSearchBarPositionFunction
 * @prop {(method: MethodWrapper<int, int, int>) => void} setSortComparator
 * @prop {(item: int) => number} getLoadedCount
 * @prop {(progress: double) => void} setLoadProgress
 * @prop {() => void} filterAndSort
 * @prop {() => void} destroy
 * @prop {() => boolean} isDestroyed
 * @prop {boolean} sortReversed
 */
