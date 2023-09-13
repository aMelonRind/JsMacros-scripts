
import xyz.wagyourtail.jsmacros.core.Core;
import xyz.wagyourtail.jsmacros.core.MethodWrapper;
import xyz.wagyourtail.jsmacros.client.api.classes.math.Pos2D;
import xyz.wagyourtail.jsmacros.client.api.classes.math.Vec2D;
import xyz.wagyourtail.jsmacros.client.api.classes.render.components.Item;
import xyz.wagyourtail.jsmacros.client.api.classes.render.components.Rect;
import xyz.wagyourtail.jsmacros.client.api.classes.render.ScriptScreen;
import xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper;
import xyz.wagyourtail.jsmacros.client.api.helpers.screen.ClickableWidgetHelper;
import xyz.wagyourtail.jsmacros.client.api.helpers.OptionsHelper;
import xyz.wagyourtail.jsmacros.client.api.library.impl.FChat;

import org.lwjgl.glfw.GLFW;

import java.util.Collections;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import from_script DrawContextProxy;
import from_script ItemTextOverlay;
import from_script SearchBar;

//# Imports: Fabric
import net.minecraft.class_310  as MinecraftClient;
import net.minecraft.class_332  as DrawContext;
import net.minecraft.class_437  as Screen;
import net.minecraft.class_1799 as ItemStack;
import net.minecraft.class_2561 as Text;

const options         = field_1690;
const children        = field_22786;
const width           = field_22789;
const height          = field_22790;
const textRenderer    = field_22793;

const getInstance     = method_1551;
const focusOn         = method_20086;
const tick            = method_25393;
const render          = method_25394;
const getFocused      = method_25399;
const mouseScrolled   = method_25401;
const mouseClicked    = method_25402;
const keyPressed      = method_25404;
const close           = method_25419;
const init            = method_25426;
const hasControlDown  = method_25441;
const hasShiftDown    = method_25442;
const getWidth        = method_27525;
const literal         = method_43470;
const drawTooltip     = method_51434;
const drawItemTooltip = method_51446;

class StorageViewScreen extends ScriptScreen {
  private static final MinecraftClient mc = MinecraftClient.$getInstance();
  private static final FChat Chat = new FChat();
  private static final OptionsHelper Options = new OptionsHelper(mc.$options);
  private static final Text NO_ITEM_TEXT = Text.$literal("No item");
  private static final Text NOT_ENOUGH_SPACE_TEXT = Text.$literal("No Space. Check positionSettings.js");

  private final Set elements = new LinkedHashSet();
  private final List $children = new ArrayList();
  private final DrawContextProxy contextProxy = new DrawContextProxy();
  private final Rect scrollBar = new Rect(0, 0, 0, 0, 0xAAAAAA, 0.0f, 0);
  private SearchBar searchBar;
  private final Item itemRender = new Item(0, 0, 0, "minecraft:air", true, 1.0, 0.0f).setOverlayText("");
  private final ClickableWidgetHelper tooltipConverter = new ClickableWidgetHelper(null);
  private final ItemTextOverlay itemText = new ItemTextOverlay("", 0, 0, 0xFFFFFF, 0, true, 1.0, 0.0f);
  private final HashMap loadedItems = new HashMap();
  private final ArrayList displayedItems = new ArrayList();
  private final HashMap itemCache = new HashMap();
  private HashMap loadedItemsBuffer = new HashMap();
  private MethodWrapper filterer = null;
  private MethodWrapper sortMethod = null;
  private MethodWrapper onClickItem = null;
  private MethodWrapper tooltipFunction = null;
  private MethodWrapper extraTooltipFunction = null;
  private MethodWrapper itemsPositionFunction = null;
  private MethodWrapper searchBarPositionFunction = null;
  private boolean errorLogged = false;
  public boolean sortReversed = false;
  private boolean isDraggingScrollBar = false;
  private boolean isDraggingScroll = false;
  private boolean dirty = false;
  private boolean destroyed = false;
  private double scrolled = 0.0;
  private int[] clickingItem = new int[] {-1, -1, -1, -1, -1, -1, -1, -1, -1, -1}; // i don't think any mouse has more than 10 keys but anyways

  public StorageViewScreen() {
    super("Storage Viewer", false);
  }

  protected void $init() {
    searchBar = new SearchBar($textRenderer);
  }

  public void $tick() {
    super.$tick();
    searchBar.tick();
  }

  public boolean $keyPressed(int keyCode, int scanCode, int modifiers) {
    if (keyCode == GLFW.GLFW_KEY_TAB) {
      $focusOn(searchBar.isFocused() ? null : searchBar);
      return true;
    }
    if (keyCode == GLFW.GLFW_KEY_E && !searchBar.isFocused()) {
      $close();
      return true;
    }
    return super.$keyPressed(keyCode, scanCode, modifiers);
  }

  public void setLoadProgress(double progress) {
    if (searchBar != null) searchBar.loadProgress = progress;
  }

  private void putLoaded(int item, long count) {
    synchronized (loadedItemsBuffer) {
      loadedItemsBuffer.put(Integer.valueOf(item), Long.valueOf(count));
    }
    dirty = true;
  }

  private long getLoaded(int item) {
    synchronized (loadedItemsBuffer) {
      Long value = (Long) loadedItemsBuffer.get(Integer.valueOf(item));
      return value == null ? 0L : value.longValue();
    }
  }

  public long getLoadedCount(int item) {
    synchronized (loadedItems) {
      Long value = (Long) loadedItems.get(Integer.valueOf(item));
      return value == null ? 0L : value.longValue();
    }
  }

  private boolean loadedContains(int item) {
    synchronized (loadedItemsBuffer) {
      return loadedItemsBuffer.containsKey(Integer.valueOf(item));
    }
  }

  private void addDisplayed(int item) {
    synchronized (displayedItems) {
      displayedItems.add(Integer.valueOf(item));
    }
  }

  public void addItem(int item, ItemStackHelper itemStack, long count) {
    synchronized (loadedItemsBuffer) {
      if (!loadedContains(item)) {
        putLoaded(item, count);
      } else putLoaded(item, getLoaded(item) + count);
      itemCache.put(Integer.valueOf(item), itemStack);
      dirty = true;
    }
  }

  public ItemStackHelper getCache(int item) {
    return (ItemStackHelper) itemCache.get(Integer.valueOf(item));
  }

  public void destroy() {
    destroyed = true;
  }

  public boolean isDestroyed() {
    return destroyed;
  }

  public void clearItems() {
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
  }

  public void setFilterer(MethodWrapper filterer) {
    this.filterer = filterer;
    dirty = true;
  }

  public void setTooltipFunction(MethodWrapper tooltipFunction) {
    this.tooltipFunction = tooltipFunction;
  }

  public void setExtraTooltipFunction(MethodWrapper extraTooltipFunction) {
    this.extraTooltipFunction = extraTooltipFunction;
  }

  public void setOnClickItem(MethodWrapper onClickItem) {
    this.onClickItem = onClickItem;
  }

  public void setItemsPositionFunction(MethodWrapper itemsPositionFunction) {
    this.itemsPositionFunction = itemsPositionFunction;
  }

  public void setSearchBarPositionFunction(MethodWrapper searchBarPositionFunction) {
    this.searchBarPositionFunction = searchBarPositionFunction;
  }

  public void setSortComparator(MethodWrapper method) {
    sortMethod = method;
    dirty = true;
  }

  public void filterAndSort() {
    if (!dirty && loadedItemsBuffer.isEmpty()) return;
    if (!loadedItemsBuffer.isEmpty()) {
      synchronized (loadedItemsBuffer) {
        HashMap buf = loadedItemsBuffer;
        loadedItemsBuffer = new HashMap();
        List keyList = new ArrayList(buf.keySet());
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
      List keyList = new ArrayList(loadedItems.keySet());
      int size = keyList.size();
      try {
        for (int i = 0; i < size; i++) {
          Integer item = (Integer) keyList.get(i);
          if (filterer.test(item)) displayedItems.add(item);
        }
      } catch (Throwable e) {
        Chat.log("[StorageViewScreen] Error in filterer: " + e.getLocalizedMessage());
        // Core.getInstance().profile.logError(e);
        filterer = null;
      }
    }
    if (filterer == null) {
      displayedItems.clear();
      displayedItems.addAll(loadedItems.keySet());
    }
    if (sortMethod != null) {
      try {
        Collections.sort(displayedItems, sortMethod);
        if (sortReversed) Collections.reverse(displayedItems);
      } catch (Throwable e) {
        Chat.log("[StorageViewScreen] Error in sortMethod: " + e.getLocalizedMessage());
        // Core.getInstance().profile.logError(e);
        sortMethod = null;
      }
    }
    isDraggingScroll = false;
    isDraggingScrollBar = false;
    for (int i = 0; i < 10; i++) clickingItem[i] = -1;
    dirty = false;
  }

  private static String formatNumber(long num) {
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
  }
  
  private void addLabel(Vec2D vec, Text text, DrawContext context, int mouseX, int mouseY, float tickDelta) {
    itemText.setScale(1.0);
    itemText.text = text;
    itemText.width = $textRenderer.$getWidth(text);
    itemText.setPos(
      (int) Math.floor((vec.x1 + vec.x2) / 2 - (double) itemText.width / 2),
      (int) Math.floor((vec.y1 + vec.y2) / 2 - 4)
    );
    itemText.$render(context, mouseX, mouseY, tickDelta);
  }

  private static Vec2D defaultItemsPosition(int w, int h) {
    w /= 2;
    h /= 2;
    return new Vec2D(w - 90.0, h - 80.0, w + 90.0, h + 101.0);
  }

  private static Vec2D defaultSearchBarPosition(int w, int h) {
    return new Vec2D(w / 2.0 - 88.0, h / 2.0 - 100.0, 176.0, 16.0);
  }

  private static String localeNumber(long num) {
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
  }

  private byte signX = 1;
  private byte signY = 1;
  private int startX = 0;
  private int startY = 0;
  private int countX = 0;
  private int countY = 0;
  private int cy18 = 0;
  private int scrollBarX = -1;
  private int scrollBarSize = 0;
  private int totalRows = 0;
  private int flooredScrolled = 0;

  private int searchBarX = 0;
  private int searchBarY = 0;
  private int searchBarW = 0;
  private int searchBarH = 0;

  private int getHoveredIndex(int mouseX, int mouseY) {
    if (countX == 0) return -1;
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
  }

  private int getHoveredIndex(double mouseX, double mouseY) {
    return getHoveredIndex((int) Math.floor(mouseX), (int) Math.floor(mouseY));
  }

  // button 01234: left right mid prev next
  public void jsmacros_mouseClicked(double mouseX, double mouseY, int button) {
    int x = (int) Math.floor(mouseX);
    int y = (int) Math.floor(mouseY);
    boolean searchFocused = false;
    boolean handled = false;
    int hovered = getHoveredIndex(x, y);
    if (hovered != -1) {
      isDraggingScroll = true;
      if (0 <= button && button < 10) {
        clickingItem[button] = hovered;
      }
      handled = true;
    } else {
      if (button == 0 && displayedItems.size() > countX * countY) {
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
            handled = true;
          }
        }
      }
      if (button == 0 || button == 1 || button == 2) {
        if (searchBarX <= x && x < searchBarX + searchBarW && searchBarY <= y && y < searchBarY + searchBarH) {
          searchFocused = true;
          handled = true;
        }
      }
    }
    if (searchFocused || button == 0 || button == 1 || button == 2) {
      searchBar.setFocused(searchFocused);
      if (searchFocused) {
        $focusOn(searchBar);
        searchBar.mouseClicked(mouseX, mouseY, button);
        handled = true;
      } else if ($getFocused() == searchBar) {
        $focusOn(null);
        handled = true;
      }
    }
    if (!handled) super.$mouseClicked(mouseX, mouseY, button);
  }

  public void jsmacros_mouseDragged(double mouseX, double mouseY, int button, double deltaX, double deltaY) {
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
  }

  public void jsmacros_mouseReleased(double mouseX, double mouseY, int button) {
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
            // Core.getInstance().profile.logError(e);
            onClickItem = null;
          }
        }
      }
      clickingItem[button] = -1;
    }
    // super.jsmacros_mouseReleased(mouseX, mouseY, button);
  }

  public boolean $mouseScrolled(double mouseX, double mouseY, double amount) {
    if (Screen.$hasShiftDown()) amount *= 4.0;
    if (Screen.$hasControlDown()) amount *= 2.0;
    scrolled += -amount * signY;
    return true;
  }

  public void $render(DrawContext context, int mouseX, int mouseY, float tickDelta) {
    if (destroyed) {
      $close();
      return;
    }
    super.$render(context, mouseX, mouseY, tickDelta);
    countX = 0;

    filterAndSort();
    List items = List.copyOf(displayedItems);

    Vec2D searchVec = null;
    if (searchBarPositionFunction != null) {
      try {
        searchVec = (Vec2D) searchBarPositionFunction.apply(new Pos2D((double) $width, (double) $height));
      } catch (Throwable e) {
        Chat.log("[StorageViewScreen] Error in searchBarPositionFunction: " + e.getLocalizedMessage());
        // Core.getInstance().profile.logError(e);
        searchBarPositionFunction = null;
      }
    }
    if (searchVec == null) searchVec = defaultSearchBarPosition($width, $height);
    searchVec.x1 = searchBarX = (int) Math.floor(searchVec.x1);
    searchVec.y1 = searchBarY = (int) Math.floor(searchVec.y1);
    searchVec.x2 = searchBarW = (int) Math.floor(searchVec.x2);
    searchVec.y2 = searchBarH = (int) Math.floor(searchVec.y2);
    searchBar.setPos(searchBarX, searchBarY, searchBarW, searchBarH);
    searchBar.render(context, mouseX, mouseY, tickDelta);

    Vec2D itemsVec = null;
    if (itemsPositionFunction != null) {
      try {
        itemsVec = (Vec2D) itemsPositionFunction.apply(new Pos2D((double) $width, (double) $height));
      } catch (Throwable e) {
        Chat.log("[StorageViewScreen] Error in itemsPositionFunction: " + e.getLocalizedMessage());
        // Core.getInstance().profile.logError(e);
        itemsPositionFunction = null;
      }
    }
    if (itemsVec == null) itemsVec = defaultItemsPosition($width, $height);
    itemsVec.x1 = Math.floor(itemsVec.x1);
    itemsVec.y1 = Math.floor(itemsVec.y1);
    itemsVec.x2 = Math.ceil(itemsVec.x2);
    itemsVec.y2 = Math.ceil(itemsVec.y2);

    if (items.isEmpty()) {
      addLabel(itemsVec, NO_ITEM_TEXT, context, mouseX, mouseY, tickDelta);
      return;
    }

    signY = itemsVec.y1 > itemsVec.y2 ? -1 : 1;
    if (scrolled < 0) scrolled = 0;

    if (Math.abs(itemsVec.x1 - itemsVec.x2) < 18 || Math.abs(itemsVec.y1 - itemsVec.y2) < 18) {
      addLabel(itemsVec, NOT_ENOUGH_SPACE_TEXT, context, mouseX, mouseY, tickDelta);
      return;
    }

    signX = itemsVec.x1 > itemsVec.x2 ? -1 : 1;
    countX = (int) Math.floor(Math.abs(itemsVec.x1 - itemsVec.x2) / 18);
    countY = (int) Math.floor(Math.abs(itemsVec.y1 - itemsVec.y2) / 18);
    startX = (int) (Math.floor((itemsVec.x1 + itemsVec.x2) / 2) + ((signX * (1 - countX)) - 1) * 9 + 1);
    // startY = (int) (Math.floor((itemsVec.y1 + itemsVec.y2) / 2) + ((signY * (1 - countY)) - 1) * 9 + 1);
    startY = (int) itemsVec.y1 + signY * 9 - 8;
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
      scrollBar.$render(context, mouseX, mouseY, tickDelta);
    }

    flooredScrolled = (int) Math.floor(scrolled);

    int end = Math.min((flooredScrolled + countY) * countX, items.size());

    Map loadedItems = Map.copyOf(loadedItems);

    double guiScale = Options.getVideoOptions().getGuiScale();
    double textScale = Math.ceil((double) guiScale / 2.0) / guiScale;
    itemText.setScale(textScale);

    int textDY = 8 + (int) Math.floor((1 - textScale) * 8);

    for (int i = flooredScrolled * countX; i < end; ++i) {
      ItemStackHelper item = (ItemStackHelper) itemCache.get(items.get(i));
      if (item == null) continue;
      int x = startX + deltaX * (i % countX);
      int y = startY + deltaY * (i / countX - flooredScrolled);
      itemRender.setItem(item).setPos(x, y).$render(context, mouseX, mouseY, tickDelta);
      long itemCount = ((Long) loadedItems.get((Integer) items.get(i))).longValue();
      String countText = itemCount == 1L ? "" : formatNumber(itemCount);
      if (!countText.isBlank()) {
        itemText.text = Text.$literal(countText);
        itemText.width = $textRenderer.$getWidth(itemText.text);
        itemText.setPos(x + 17 - (int) Math.ceil(itemText.width * textScale), y + textDY);
        itemText.$render(context, mouseX, mouseY, tickDelta);
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
            context.$drawTooltip($textRenderer, tooltipConverter.tooltips, mouseX + 4, mouseY + 4);
          }
          tooltipConverter.tooltips.clear();
        } catch (Throwable e) {
          Chat.log("[StorageViewScreen] Error in tooltipFunction: " + e.getLocalizedMessage());
          // Core.getInstance().profile.logError(e);
          tooltipFunction = null;
        }
      }
      if (tooltipFunction == null) {
        ItemStackHelper item = (ItemStackHelper) itemCache.get(key);
        if (item != null) {
          long itemCount = ((Long) loadedItems.get(key)).longValue();
          if (itemCount >= 10000L) {
            tooltipConverter.addTooltip("§7Count: " + localeNumber(itemCount));
          }
          if (extraTooltipFunction != null) {
            try {
              Object[] extras = (Object[]) extraTooltipFunction.apply(key);
              if (extras != null && extras.length > 0) {
                List temp = tooltipConverter.tooltips;
                tooltipConverter.setTooltip(extras);
                temp.addAll(tooltipConverter.tooltips);
                tooltipConverter.tooltips = temp;
              }
            } catch (Throwable e) {
              Chat.log("[StorageViewScreen] Error in extraTooltipFunction: " + e.getLocalizedMessage());
              // Core.getInstance().profile.logError(e);
              extraTooltipFunction = null;
            }
          }
          if (tooltipConverter.tooltips.isEmpty()) {
            context.$drawItemTooltip($textRenderer, (ItemStack) item.getRaw(), mouseX + 4, mouseY + 4);
          } else {
            contextProxy.drawItemTooltipWithExtra($textRenderer, (ItemStack) item.getRaw(), mouseX + 4, mouseY + 4, context, tooltipConverter.tooltips);
          }
        }
      }
    }
  }

}
