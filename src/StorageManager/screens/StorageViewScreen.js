// @ts-check
const Text = Java.type('xyz.wagyourtail.jsmacros.client.api.classes.render.components.Text')
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

/** @type {JavaClass} */// @ts-ignore
const DrawContextProxy = (() => {
  const className = 'MelonRind$Proxy$DrawContextProxy' + `$Test${GlobalVars.getAndIncrementInt('classtesting')}`
  try {
    return Java.type('xyz.wagyourtail.jsmacros.core.library.impl.classes.proxypackage.' + className)
  } catch (e) {}

  const MinecraftClient = 'net.minecraft.class_310'
  const TextRenderer    = 'net.minecraft.class_327'
  const DrawContext     = 'net.minecraft.class_332'
  const ItemStack       = 'net.minecraft.class_1799'
  
  const Optional = 'java.util.Optional'
  const List     = 'java.util.List'
  
  const getInstance     = 'method_1551'
  const drawTooltip     = 'method_51437'
  const drawItemTooltip = 'method_51446'

  const builder = Reflection.createClassBuilder(className, Java.type(DrawContext))
  .addField(`private ${DrawContext} parent;`)
  .addField(`private ${List} extraTooltips;`)

  .addConstructor(`public ${className}() {
    super(${MinecraftClient}.${getInstance}(), null);
  }`)

  .addMethod(`public void drawItemTooltipWithExtra(${TextRenderer} textRenderer, ${ItemStack} stack, int x, int y, ${DrawContext} parent, ${List} extra) {
    this.parent = parent;
    this.extraTooltips = extra;
    this.${drawItemTooltip}(textRenderer, stack, x, y);
  }`)

  .addMethod(`public void ${drawTooltip}(${TextRenderer} textRenderer, ${List} text, ${Optional} data, int x, int y) {
    text.addAll(extraTooltips);
    parent.${drawTooltip}(textRenderer, text, data, x, y);
  }`)

  return builder.finishBuildAndFreeze()
})()

/** @type {new (itemGetter: MethodWrapper<int, any, ItemStackHelper?>) => StorageViewScreenInstance} */// @ts-ignore
const StorageViewScreenClass = (() => {
  const className = 'MelonRind$Screen$StorageViewScreen' + `$Test${GlobalVars.getAndIncrementInt('classtesting')}`
  try {
    return Java.type('xyz.wagyourtail.jsmacros.core.library.impl.classes.proxypackage.' + className)
  } catch (e) {}

  const FChat                 = 'xyz.wagyourtail.jsmacros.client.api.library.impl.FChat'
  const Core                  = 'xyz.wagyourtail.jsmacros.core.Core'
  const MethodWrapper         = 'xyz.wagyourtail.jsmacros.core.MethodWrapper'
  const Pos2D                 = 'xyz.wagyourtail.jsmacros.client.api.classes.math.Pos2D'
  const Vec2D                 = 'xyz.wagyourtail.jsmacros.client.api.classes.math.Vec2D'
  const Item                  = 'xyz.wagyourtail.jsmacros.client.api.classes.render.components.Item'
  const Rect                  = 'xyz.wagyourtail.jsmacros.client.api.classes.render.components.Rect'
  const ScriptScreen          = 'xyz.wagyourtail.jsmacros.client.api.classes.render.ScriptScreen'
  const ItemStackHelper       = 'xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper'
  const ClickableWidgetHelper = 'xyz.wagyourtail.jsmacros.client.api.helpers.screen.ClickableWidgetHelper'
  const OptionsHelper         = 'xyz.wagyourtail.jsmacros.client.api.helpers.OptionsHelper'

  const ItemTextOverlay = require('./elements/ItemTextOverlay').create('', 0, 0).getClass().getTypeName()

  const MinecraftClient = 'net.minecraft.class_310'
  const DrawContext     = 'net.minecraft.class_332'
  const Screen          = 'net.minecraft.class_437'
  const ItemStack       = 'net.minecraft.class_1799'
  const Text            = 'net.minecraft.class_2561'

  const Collections = 'java.util.Collections'
  const ArrayList   = 'java.util.ArrayList'
  const HashMap     = 'java.util.HashMap'
  const List        = 'java.util.List'
  const Map         = 'java.util.Map'
  
  const options         = 'field_1690'
  const textRenderer    = 'field_1772'
  const width           = 'field_22789'
  const height          = 'field_22790'

  const getInstance     = 'method_1551'
  const getWidth        = 'method_27525'
  const render          = 'method_25394'
  const mouseScrolled   = 'method_25401'
  const close           = 'method_25419'
  const hasControlDown  = 'method_25441'
  const hasShiftDown    = 'method_25442'
  const literal         = 'method_43470'
  const drawTooltip     = 'method_51434'
  const drawItemTooltip = 'method_51446'

  const builder = Reflection.createClassBuilder(className, Java.type(ScriptScreen))
  .addField(`private static final ${MinecraftClient} mc = ${MinecraftClient}.${getInstance}();`)
  .addField(`private static final ${FChat} Chat = new ${FChat}();`)
  .addField(`private static final ${OptionsHelper} Options = new ${OptionsHelper}(mc.${options});`)
  .addField(`private static final ${Text} NO_ITEM_TEXT = ${Text}.${literal}("No item");`)
  .addField(`private static final ${Text} NOT_ENOUGH_SPACE_TEXT = ${Text}.${literal}("No Space. Check positionSettings.js");`)
  
  .addField(`private final ${DrawContextProxy.getTypeName()} contextProxy = new ${DrawContextProxy.getTypeName()}();`)
  .addField(`private final ${Rect} scrollBar = new ${Rect}(0, 0, 0, 0, 0xAAAAAA, 0.0f, 0);`)
  .addField(`private final ${Item} itemRender = new ${Item}(0, 0, 0, "minecraft:air", true, 1.0, 0.0f).setOverlayText("");`)
  .addField(`private final ${ClickableWidgetHelper} tooltipConverter = new ${ClickableWidgetHelper}(null);`)
  .addField(`private final ${ItemTextOverlay} itemText = new ${ItemTextOverlay}("", 0, 0, 0xFFFFFF, 0, true, 1.0, 0.0f);`)
  .addField(`private ${HashMap} loadedItemsBuffer = new ${HashMap}();`)
  .addField(`private final ${HashMap} loadedItems = new ${HashMap}();`)
  .addField(`private final ${ArrayList} displayedItems = new ${ArrayList}();`)
  .addField(`private final ${HashMap} itemCache = new ${HashMap}();`)
  .addField(`private ${MethodWrapper} itemGetter;`)
  .addField(`private ${MethodWrapper} filterer = null;`)
  .addField(`private ${MethodWrapper} sortMethod = null;`)
  .addField(`private ${MethodWrapper} onClickItem = null;`)
  .addField(`private ${MethodWrapper} tooltipFunction = null;`)
  .addField(`private ${MethodWrapper} extraTooltipFunction = null;`)
  .addField(`private ${MethodWrapper} itemsPositionFunction = null;`)
  .addField(`private boolean errorLogged = false;`)
  .addField(`public boolean sortReversed = false;`)
  .addField(`private boolean isDraggingScrollBar = false;`)
  .addField(`private boolean isDraggingScroll = false;`)
  .addField(`private boolean dirty = false;`)
  .addField(`private boolean destroyed = false;`)
  .addField(`private double scrolled = 0.0;`)
  .addField(`private int[] clickingItem = new int[] {-1, -1, -1, -1, -1, -1, -1, -1, -1, -1};`) // i don't think any mouse has more than 10 keys but anyways

  .addConstructor(`public ${className}(${MethodWrapper} itemGetter) {
    super("Storage Viewer", false);
    this.itemGetter = itemGetter;
  }`)

  .addMethod(`private void putLoaded(int item, long count) {
    synchronized (loadedItemsBuffer) {
      loadedItemsBuffer.put(Integer.valueOf(item), Long.valueOf(count));
    }
    dirty = true;
  }`)

  .addMethod(`private long getLoaded(int item) {
    synchronized (loadedItemsBuffer) {
      Long value = (Long) loadedItemsBuffer.get(Integer.valueOf(item));
      return value == null ? 0L : value.longValue();
    }
  }`)

  .addMethod(`public long getLoadedCount(int item) {
    synchronized (loadedItems) {
      Long value = (Long) loadedItems.get(Integer.valueOf(item));
      return value == null ? 0L : value.longValue();
    }
  }`)

  .addMethod(`private boolean loadedContains(int item) {
    synchronized (loadedItemsBuffer) {
      return loadedItemsBuffer.containsKey(Integer.valueOf(item));
    }
  }`)

  .addMethod(`private void addDisplayed(int item) {
    synchronized (displayedItems) {
      displayedItems.add(Integer.valueOf(item));
    }
  }`)

  .addMethod(`public void addItem(int item, ${ItemStackHelper} itemStack, long count) {
    synchronized (loadedItemsBuffer) {
      if (!loadedContains(item)) {
        putLoaded(item, count);
      } else putLoaded(item, getLoaded(item) + count);
      itemCache.put(Integer.valueOf(item), itemStack);
      dirty = true;
    }
  }`)

  .addMethod(`public ${ItemStackHelper} getCache(int item) {
    return (${ItemStackHelper}) itemCache.get(Integer.valueOf(item));
  }`)

  // .addMethod(`public void addItems(${HashMap} items) {
  //   ${List} keyList = new ${ArrayList}(items.keySet());
  //   int size = keyList.size();
  //   for (int i = 0; i < size; i++) {
  //     addItem(((Integer) keyList.get(i)).intValue(), ((Long) items.get(keyList.get(i))).longValue());
  //   }
  // }`)

  .addMethod(`public void destroy() {
    destroyed = true;
  }`)

  .addMethod(`public boolean isDestroyed() {
    return destroyed;
  }`)

  .addMethod(`public void clearItems() {
    synchronized (loadedItemsBuffer) {
      loadedItemsBuffer.clear();
    }
    synchronized (loadedItems) {
      loadedItems.clear();
    }
    synchronized (displayedItems) {
      displayedItems.clear();
      dirty = false;
    }
  }`)

  .addMethod(`public void setFilterer(${MethodWrapper} filterer) {
    this.filterer = filterer;
    dirty = true;
  }`)

  .addMethod(`public void setTooltipFunction(${MethodWrapper} tooltipFunction) {
    this.tooltipFunction = tooltipFunction;
  }`)

  .addMethod(`public void setExtraTooltipFunction(${MethodWrapper} extraTooltipFunction) {
    this.extraTooltipFunction = extraTooltipFunction;
  }`)

  .addMethod(`public void setOnClickItem(${MethodWrapper} onClickItem) {
    this.onClickItem = onClickItem;
  }`)

  .addMethod(`public void setItemsPositionFunction(${MethodWrapper} itemsPositionFunction) {
    this.itemsPositionFunction = itemsPositionFunction;
  }`)

  .addMethod(`public void setSortComparator(${MethodWrapper} method) {
    sortMethod = method;
    dirty = true;
  }`)

  .addMethod(`public void filterAndSort() {
    if (!dirty) return;
    if (!loadedItemsBuffer.isEmpty()) {
      synchronized (loadedItemsBuffer) {
        ${HashMap} buf = loadedItemsBuffer;
        loadedItemsBuffer = new ${HashMap}();
        ${List} keyList = new ${ArrayList}(buf.keySet());
        int size = keyList.size();
        for (int i = 0; i < size; i++) {
          Integer item = (Integer) keyList.get(i);
          if (!loadedItems.containsKey(item)) {
            loadedItems.put(item, buf.get(item));
          } else loadedItems.put(item, Long.valueOf(((Long) loadedItems.get(item)).longValue() + ((Long) buf.get(item)).longValue()));
        }
      }
    }
    if (filterer != null) {
      displayedItems.clear();
      ${List} keyList = new ${ArrayList}(loadedItems.keySet());
      int size = keyList.size();
      try {
        for (int i = 0; i < size; i++) {
          Integer item = (Integer) keyList.get(i);
          if (filterer.test(item)) displayedItems.add(item);
        }
      } catch (Throwable e) {
        Chat.log("[StorageViewScreen] Error in filterer: " + e.getLocalizedMessage());
        // ${Core}.getInstance().profile.logError(e);
        filterer = null;
      }
    }
    if (filterer == null) {
      displayedItems.clear();
      displayedItems.addAll(loadedItems.keySet());
    }
    if (sortMethod != null) {
      try {
        ${Collections}.sort(displayedItems, sortMethod);
        if (sortReversed) ${Collections}.reverse(displayedItems);
      } catch (Throwable e) {
        Chat.log("[StorageViewScreen] Error in sortMethod: " + e.getLocalizedMessage());
        // ${Core}.getInstance().profile.logError(e);
        sortMethod = null;
      }
    }
    isDraggingScroll = false;
    isDraggingScrollBar = false;
    for (int i = 0; i < 10; i++) clickingItem[i] = -1;
    dirty = false;
  }`)

  .addMethod(`private static String formatNumber(long num) {
    String str = Long.toString(num);
    String res = "";
    if (str.startsWith("-")) {
        res = "-";
        str = str.substring(1);
    }
    int len = str.length();
    if (num >= 10000000000L) {
        res += str.substring(0, len - 9);
        if (num < 1000000000000L) res += "." + str.charAt(len - 9);
        res += 'B';
    } else if (num >= 10000000L) {
        res += str.substring(0, len - 6);
        if (num < 1000000000L) res += "." + str.charAt(len - 6);
        res += 'M';
    } else if (num >= 10000L) {
        res += str.substring(0, len - 3);
        if (num < 1000000L) res += "." + str.charAt(len - 3);
        res += 'K';
    } else res += str;
    return res;
  }`)
  
  .addMethod(`private void addLabel(${Vec2D} vec, ${Text} text, ${DrawContext} context, int mouseX, int mouseY, float tickDelta) {
    itemText.setScale(1.0);
    itemText.text = text;
    itemText.width = mc.${textRenderer}.${getWidth}(text);
    itemText.setPos(
      (int) Math.floor((vec.x1 + vec.x2) / 2 - (double) itemText.width / 2),
      (int) Math.floor((vec.y1 + vec.y2) / 2 - 4)
    );
    itemText.${render}(context, mouseX, mouseY, tickDelta);
  }`)

  .addMethod(`private static ${Vec2D} defaultItemsPosition(int w, int h) {
    w /= 2;
    h /= 2;
    return new ${Vec2D}(w - 90d, h - 80d, w + 90d, h + 101d);
  }`)

  .addMethod(`private static String localeNumber(long num) {
    String str = Long.toString(num);
    StringBuilder res = new StringBuilder();
    if (str.contains(".")) {
        String[] spl = str.split("\\.", 2);
        res.append(".").append(spl[1]);
        str = spl[0];
    }
    String sign = "";
    if (str.startsWith("-")) {
        sign = "-";
        str = str.substring(1);
    }
    int len;
    while ((len = str.length()) > 3) {
        res.insert(0, "," + str.substring(len - 3));
        str = str.substring(0, len - 3);
    }
    return res.insert(0, sign + str).toString();
  }`)

  .addField(`private byte signX = 1;`)
  .addField(`private byte signY = 1;`)
  .addField(`private int startX = 0;`)
  .addField(`private int startY = 0;`)
  .addField(`private int countX = 0;`)
  .addField(`private int countY = 0;`)
  .addField(`private int cy18 = 0;`)
  .addField(`private int scrollBarX = -1;`)
  .addField(`private int scrollBarSize = 0;`)
  .addField(`private int totalRows = 0;`)
  .addField(`private int flooredScrolled = 0;`)

  .addMethod(`private int getHoveredIndex(int mouseX, int mouseY) {
    if (countX == 0) return 0;
    int x = startX - 1;
    int y = startY - 1;
    if (signX == -1) x -= countX * 18 - 18;
    if (signY == -1) y -= countY * 18 - 18;
    if (x > mouseX || mouseX >= x + countX * 18
    ||  y > mouseY || mouseY >= y + countY * 18
    ) return -1;
    int posX = (mouseX - x) / 18;
    int posY = (mouseY - y) / 18;
    if (signX == -1) posX = countX - 1 - posX;
    if (signY == -1) posY = countY - 1 - posY;
    int index = (posY + flooredScrolled) * countX + posX;
    return index < displayedItems.size() ? index : -1;
  }`)

  .addMethod(`private int getHoveredIndex(double mouseX, double mouseY) {
    return getHoveredIndex((int) Math.floor(mouseX), (int) Math.floor(mouseY));
  }`)

  // button 01234: left right mid prev next
  .addMethod(`public void jsmacros_mouseClicked(double mouseX, double mouseY, int button) {
    if (countX == 0) return;
    int x = (int) Math.floor(mouseX);
    int y = (int) Math.floor(mouseY);
    int hovered = getHoveredIndex(x, y);
    if (hovered != -1) {
      isDraggingScroll = true;
      if (0 <= button && button < 10) {
        clickingItem[button] = hovered;
      }
    } else if (button == 0) {
      int sx = scrollBarX;
      if (signX == -1) sx -= 10;
      if (sx - 1 <= x && mouseX <= sx + 10) {
        int sy = startY - 1;
        if (signY == -1) sy -= cy18 - 18;
        if (sy <= y && mouseY <= sy + cy18) {
          isDraggingScrollBar = true;
          double value = Math.max(0.0, Math.min(1.0, (mouseY - sy - scrollBarSize / 2) / (cy18 - scrollBarSize)));
          if (signY == -1) value = 1.0 - value;
          scrolled = value * (totalRows - countY);
        }
      }
    }
    // super.jsmacros_mouseClicked(mouseX, mouseY, button);
  }`)

  .addMethod(`public void jsmacros_mouseDragged(double mouseX, double mouseY, int button, double deltaX, double deltaY) {
    if (button == 0) {
      if (isDraggingScrollBar) {
        int sy = startY - 1;
        if (signY == -1) sy -= cy18 - 18;
        double value = Math.max(0.0, Math.min(1.0, (mouseY - sy - scrollBarSize / 2) / (cy18 - scrollBarSize)));
        if (signY == -1) value = 1.0 - value;
        scrolled = value * (totalRows - countY);
      }
      if (isDraggingScroll) scrolled -= signY * deltaY / 18;
    }
    if (0 <= button && button < 10 && clickingItem[button] != -1
      && getHoveredIndex(mouseX, mouseY) != clickingItem[button]) clickingItem[button] = -1;
    // super.jsmacros_mouseDragged(mouseX, mouseY, button, deltaX, deltaY);
  }`)

  .addMethod(`public void jsmacros_mouseReleased(double mouseX, double mouseY, int button) {
    if (button == 0) {
      isDraggingScrollBar = false;
      isDraggingScroll = false;
    }
    if (0 <= button && button < 10 && clickingItem[button] != -1) {
      if (getHoveredIndex(mouseX, mouseY) == clickingItem[button]) {
        if (onClickItem != null) {
          try {
            onClickItem.apply((Integer) displayedItems.get(clickingItem[button]), Integer.valueOf(button));
          } catch (Throwable e) {
            Chat.log("[StorageViewScreen] Error in onClickItem: " + e.getLocalizedMessage());
            // ${Core}.getInstance().profile.logError(e);
            onClickItem = null;
          }
        }
      }
      clickingItem[button] = -1;
    }
    // super.jsmacros_mouseReleased(mouseX, mouseY, button);
  }`)

  .addMethod(`public boolean ${mouseScrolled}(double mouseX, double mouseY, double amount) {
    if (${Screen}.${hasShiftDown}()) amount *= 4.0;
    if (${Screen}.${hasControlDown}()) amount *= 2.0;
    scrolled += -amount * signY;
    return true;
  }`)

  .addMethod(`public void ${render}(${DrawContext} context, int mouseX, int mouseY, float tickDelta) {
    if (destroyed) {
      ${close}();
      return;
    }
    super.${render}(context, mouseX, mouseY, tickDelta);
    countX = 0;
    if (itemGetter == null) return;

    filterAndSort();
    ${List} items = ${List}.copyOf(displayedItems);

    ${Vec2D} vec = null;
    if (itemsPositionFunction != null) {
      try {
        vec = (${Vec2D}) itemsPositionFunction.apply(new ${Pos2D}((double) ${width}, (double) ${height}));
      } catch (Throwable e) {
        Chat.log("[StorageViewScreen] Error in itemsPositionFunction: " + e.getLocalizedMessage());
        // ${Core}.getInstance().profile.logError(e);
        itemsPositionFunction = null;
      }
    }
    if (vec == null) vec = defaultItemsPosition(${width}, ${height});
    vec.x1 = Math.floor(vec.x1);
    vec.y1 = Math.floor(vec.y1);
    vec.x2 = Math.ceil(vec.x2);
    vec.y2 = Math.ceil(vec.y2);

    if (items.isEmpty()) {
      addLabel(vec, NO_ITEM_TEXT, context, mouseX, mouseY, tickDelta);
      return;
    }

    signY = vec.y1 > vec.y2 ? -1 : 1;
    if (scrolled < 0) scrolled = 0;

    if (Math.abs(vec.x1 - vec.x2) < 18 || Math.abs(vec.y1 - vec.y2) < 18) {
      addLabel(vec, NOT_ENOUGH_SPACE_TEXT, context, mouseX, mouseY, tickDelta);
      return;
    }

    signX = vec.x1 > vec.x2 ? -1 : 1;
    countX = (int) Math.floor(Math.abs(vec.x1 - vec.x2) / 18);
    countY = (int) Math.floor(Math.abs(vec.y1 - vec.y2) / 18);
    startX = (int) (Math.floor((vec.x1 + vec.x2) / 2) + ((signX * (1 - countX)) - 1) * 9 + 1);
    // startY = (int) (Math.floor((vec.y1 + vec.y2) / 2) + ((signY * (1 - countY)) - 1) * 9 + 1);
    startY = (int) vec.y1 + signY * 9 - 8;
    int deltaX = signX * 18;
    int deltaY = signY * 18;
    cy18 = countY * 18;

    scrolled = Math.min(scrolled, Math.max(0.0, Math.ceil((double) items.size() / (double) countX) - countY));

    if (items.size() > countX * countY) {
      scrollBarX = startX + signX * (countX * 18 - 5) + 7;
      totalRows = (int) Math.ceil((double) items.size() / (double) countX);
      scrollBarSize = Math.max((int) Math.floor((double) countY / (double) totalRows * cy18), 2);
      int y = startY + signY * (int) Math.floor((cy18 - scrollBarSize) * (scrolled / (totalRows - countY)));
      if (signY == -1) y += 19 - scrollBarSize;
      scrollBar.setPos(scrollBarX, y, scrollBarX + 1, y + scrollBarSize);
      scrollBar.${render}(context, mouseX, mouseY, tickDelta);
    }

    flooredScrolled = (int) Math.floor(scrolled);

    int end = Math.min((flooredScrolled + countY) * countX, items.size());

    ${Map} loadedItems = ${Map}.copyOf(loadedItems);

    double guiScale = Options.getVideoOptions().getGuiScale();
    double textScale = Math.ceil((double) guiScale / 2.0) / guiScale;
    itemText.setScale(textScale);

    int textDY = 8 + (int) Math.floor((1 - textScale) * 8);

    for (int i = flooredScrolled * countX; i < end; ++i) {
      ${ItemStackHelper} item;
      if (itemCache.containsKey(items.get(i))) item = (${ItemStackHelper}) itemCache.get(items.get(i));
      else try {
        item = (${ItemStackHelper}) itemGetter.apply(items.get(i));
      } catch (Throwable e) {
        if (!errorLogged) {
          Chat.log("[StorageViewScreen] Error in itemGetter: " + e.getLocalizedMessage());
          // ${Core}.getInstance().profile.logError(e);
          errorLogged = true;
        }
        continue;
      }
      if (item == null) continue;
      int x = startX + deltaX * (i % countX);
      int y = startY + deltaY * (i / countX - flooredScrolled);
      itemRender.setItem(item).setPos(x, y).${render}(context, mouseX, mouseY, tickDelta);
      long itemCount = ((Long) loadedItems.get((Integer) items.get(i))).longValue();
      String countText = itemCount == 1L ? "" : formatNumber(itemCount);
      if (!countText.isBlank()) {
        itemText.text = ${Text}.${literal}(countText);
        itemText.width = mc.${textRenderer}.${getWidth}(itemText.text);
        itemText.setPos(x + 17 - (int) Math.ceil(itemText.width * textScale), y + textDY);
        itemText.${render}(context, mouseX, mouseY, tickDelta);
      }
    }

    int hovered = getHoveredIndex(mouseX, mouseY);
    tooltipConverter.tooltips.clear();
    if (hovered != -1) {
      Integer key = (Integer) items.get(hovered);
      if (tooltipFunction != null) {
        try {
          tooltipConverter.setTooltip((Object[]) tooltipFunction.apply(key));
          if (!tooltipConverter.tooltips.isEmpty()) {
            context.${drawTooltip}(mc.${textRenderer}, tooltipConverter.tooltips, mouseX + 4, mouseY + 4);
          }
          tooltipConverter.tooltips.clear();
        } catch (Throwable e) {
          Chat.log("[StorageViewScreen] Error in tooltipFunction: " + e.getLocalizedMessage());
          // ${Core}.getInstance().profile.logError(e);
          tooltipFunction = null;
        }
      }
      if (tooltipFunction == null) {
        ${ItemStackHelper} item = (${ItemStackHelper}) itemCache.get(key);
        if (item != null) {
          long itemCount = ((Long) loadedItems.get(key)).longValue();
          if (itemCount >= 10000L) {
            tooltipConverter.addTooltip("§7Count: " + localeNumber(itemCount));
          }
          if (extraTooltipFunction != null) {
            try {
              Object[] extras = (Object[]) extraTooltipFunction.apply(key);
              if (extras != null && extras.length > 0) {
                ${List} temp = tooltipConverter.tooltips;
                tooltipConverter.setTooltip(extras);
                temp.addAll(tooltipConverter.tooltips);
                tooltipConverter.tooltips = temp;
              }
            } catch (Throwable e) {
              Chat.log("[StorageViewScreen] Error in extraTooltipFunction: " + e.getLocalizedMessage());
              // ${Core}.getInstance().profile.logError(e);
              extraTooltipFunction = null;
            }
          }
          if (tooltipConverter.tooltips.isEmpty()) {
            context.${drawItemTooltip}(mc.${textRenderer}, (${ItemStack}) item.getRaw(), mouseX + 4, mouseY + 4);
          } else {
            contextProxy.drawItemTooltipWithExtra(mc.${textRenderer}, (${ItemStack}) item.getRaw(), mouseX + 4, mouseY + 4, context, tooltipConverter.tooltips);
          }
        }
      }
    }
  }`)

  return builder.finishBuildAndFreeze()
})()

class StorageViewScreen {

  static searchText = 'currently is an useless searchbar'

  /**
   * @param {IScreen?} parent
   * @param {DataManager} profile 
   */
  static async open(parent, profile) {
    logger.debug?.('StorageViewScreen.open()')
    const screen = new StorageViewScreenClass(JavaWrapper.methodToJava(i => profile.getItem(i)))
    screen.setParent(parent)
    screen.drawTitle = false

    const isCurrentWorld = World.isWorldLoaded() && profile.profileName === DataManager.getProfileIndex(World.getWorldIdentifier())
    const loadingLabel = new Text('', 0, 0, 0xFFFFFF, 0, true, 1, 0)
    /** @type {ItemsLoader} */
    let loader

    let firstInit = true

    screen.setOnInit(await Threads.wrapCallback(s => {
      const screenSize = PositionCommon.createPos(s.getWidth(), s.getHeight())
      loadingLabel.setPos(8, screenSize.y - 16)
      const inputPos = searchBarPosition.apply(screenSize)
      s.reAddElement(loadingLabel)
      s.addTextInput(
        Math.floor(inputPos.x1),
        Math.floor(inputPos.y1),
        Math.floor(inputPos.x2),
        Math.floor(inputPos.y2),
        this.searchText,
        JavaWrapper.methodToJavaAsync(() => {
          //
        })
      )
      // if (firstInit) {
      //   // loader?.stop()
      //   // loader = new ItemsLoader(screen, profile, null, loadingLabel, LoadMethod.RENDER_DISTANCE, null)
      //   // screen.addItem(18, profile.getItem(18), 128)
      //   // screen.addItem(19, profile.getItem(19), 128)
      //   // loader.load()
      // }
      // firstInit = false
    }, { loadingLabel, searchBarPosition: await Threads.wrapCallback(searchBarPosition) }))

    screen.setItemsPositionFunction(await Threads.wrapCallback(itemsPosition))
    screen.setSortComparator(await Threads.wrapCallback((a, b) => {
      const count = Math.sign(screen.getLoadedCount(a) - screen.getLoadedCount(b))
      if (count) return count
      const name1 = screen.getCache(a)?.getName()?.getStringStripFormatting() || ''
      const name2 = screen.getCache(b)?.getName()?.getStringStripFormatting() || ''
      if (name1 !== name2) return name1 > name2 ? -1 : 1
      return 0
    }, { screen }))
    screen.setOnClickItem(await Threads.wrapCallback((i, btn) => { // currently bugged because of guest object variables
      logger.log(`Clicked item: [${i}]: ${profile.getItem(i)?.getItemId()}, button: ${btn}`)
    }, { logger, profile }))
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
      firstInit = true
      // loader.stop()
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
    // await Threads.escapeThread()
    const chunks = this.profile.getChunksInRenderDistance() // TODO: more load methods
    for (const index in chunks) {
      await Threads.escapeThread()
      this.loadingLabel.setText(`Loading Chunk ${chunks[index]} (${index}/${chunks.length})...`)
      if (this.#checkStop()) break
      const items = this.profile.getItemsInChunk(chunks[index], this.unpackShulker)
      if (!items) continue
      if (this.#checkStop()) break
      for (const item of items.keySet()) {
        if (this.#checkStop()) break
        this.screen.addItem(item, this.profile.getItem(item), items.get(item) ?? 0)
      }
    }
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
 * @prop {(method: MethodWrapper<int, int, int>) => void} setSortComparator
 * @prop {(item: int) => number} getLoadedCount
 * @prop {() => void} filterAndSort
 * @prop {() => void} destroy
 * @prop {() => boolean} isDestroyed
 * @prop {boolean} sortReversed
 */
