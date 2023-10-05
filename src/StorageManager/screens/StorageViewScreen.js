// @ts-check
const Text = Java.type('xyz.wagyourtail.jsmacros.client.api.classes.render.components.Text')
const JavaClassBuilder = require('../lib/JavaClassBuilder')
const Threads = require('../lib/Threads')
const { ItemData } = require('./classes/ItemData')
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
    SearchBar: SearchBar.class.getTypeName(),
    ItemData: ItemData.class.getTypeName()
  }
)

/**
 * [source](./classes/ItemsLoader.java)
 * @type {new (screen: StorageViewScreenInstance, nbtItems: ArrayList, unpackShulker: boolean, chestsPath: Packages.java.nio.file.Path, chunks: string[], playerPos: Pos3D, loadingLabel: Text) => { load(): void }}
 */// @ts-ignore
const ItemsLoader = JavaClassBuilder.buildClass(
  'MelonRind$Class$ItemsLoader', __dirname + '/classes/ItemsLoader.java', {
    StorageViewScreen: StorageViewScreenClass.class.getTypeName(),
    ItemData: ItemData.class.getTypeName()
  }
)

class StorageViewScreen {

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
      loadingLabel.setPos(8, s.getHeight() - 16)
      s.reAddElement(loadingLabel)
    }, { loadingLabel }))

    screen.setItemsPositionFunction(await Threads.wrapCallback(itemsPosition))
    screen.setSearchBarPositionFunction(await Threads.wrapCallback(searchBarPosition))
    screen.setSortComparator(await Threads.wrapCallback((a, b) => {
      return Math.floor(Math.sign(-a.compareCount(b) || a.compareName(b) || a.compareDistance(b)))
    }))
    screen.setOnClickItem(JavaWrapper.methodToJavaAsync((i, btn) => {
      // currently bugged while loading because of guest object variables
      logger.log(`Clicked item: [${i.index}]: ${i.item.getItemId()}, button: ${btn}`)
    })) // , { logger, profile }
    // screen.setTooltipFunction(await Threads.wrapCallback(i => {
    //   return Java.to(['aaaaaaaa'])
    // }))
    // screen.setExtraTooltipFunction(await Threads.wrapCallback(i => {
    //   return Java.to(['extra tooltip here', ''])
    // }))
    // screen.setFilterer(await Threads.wrapCallback(i => {
    //   return i.count > 1000
    // }))
    screen.sortReversed = DataManager.Settings.getBoolean('sortReversed', false)

    screen.setOnClose(JavaWrapper.methodToJavaAsync(s => {
      screen.destroy()
      Threads.cleanWrapper()
    }))

    const loader = new ItemsLoader(
      screen,
      profile.getNbtItemList(),
      DataManager.Settings.getBoolean('unpackShulker', false),
      FS.toRawPath(DataManager.getRoot()).resolve(`./${profile.profileName}/chests/${profile.getCurrentPath()}`),
      profile.getChunksInRenderDistance(),
      Player.getPlayer().getPos(),
      loadingLabel
    )

    // @ts-ignore thanks to javassist, inserting a $ inside class path making itself can't load this class
    loader.setParser(await Threads.wrapCallback(reader => Java.type('com.google.gson.JsonParser').parseReader(reader)))

    Threads.run(() => loader.load(), { loader }).then(() => Threads.clearSyncObjects())
    
    Hud.openScreen(screen)
  }

}

module.exports = StorageViewScreen

/**
 * @typedef {ScriptScreen & OtherProperties} StorageViewScreenInstance
 * @typedef {object} OtherProperties
 * @prop {(itemStack: ItemStackHelper?, count: long, index?: int) => void} addItem
 * @prop {() => void} clearItems
 * @prop {(filterer: MethodWrapper<ItemData, any, boolean>?) => void} setFilterer
 * @prop {(onClickItem: MethodWrapper<ItemData, int>?) => void} setOnClickItem
 * @prop {(tooltipFunction: MethodWrapper<ItemData, any, JavaArray<string | TextHelper | TextBuilder>?>?) => void} setTooltipFunction
 * @prop {(extraTooltipFunction: MethodWrapper<ItemData, any, JavaArray<string | TextHelper | TextBuilder>?>?) => void} setExtraTooltipFunction
 * @prop {(itemsPositionFunction: MethodWrapper<Pos2D, any, Vec2D>?) => void} setItemsPositionFunction
 * @prop {(searchBarPositionFunction: MethodWrapper<Pos2D, any, Vec2D>?) => void} setSearchBarPositionFunction
 * @prop {(method: MethodWrapper<ItemData, ItemData, int>) => void} setSortComparator
 * @prop {(progress: double) => void} setLoadProgress
 * @prop {() => void} filterAndSort
 * @prop {() => void} destroy
 * @prop {() => boolean} isDestroyed
 * @prop {boolean} sortReversed
 */
