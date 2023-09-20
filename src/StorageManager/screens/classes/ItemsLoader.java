
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
// import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;
import xyz.wagyourtail.jsmacros.client.api.classes.math.Pos3D;
import xyz.wagyourtail.jsmacros.client.api.classes.render.components.Text as JsmText;
import xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper;
import xyz.wagyourtail.jsmacros.client.api.helpers.world.BlockPosHelper;
import xyz.wagyourtail.jsmacros.client.api.helpers.NBTElementHelper;
import xyz.wagyourtail.Pair;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.function.Function;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import from_script ItemData;
import from_script StorageViewScreen;

//# Imports: Fabric
import net.minecraft.class_2487 as NbtCompound;
import net.minecraft.class_2499 as NbtList;
import net.minecraft.class_2520 as NbtElement;

const get          = method_10534;
const getString    = method_10558;
const getCompound  = method_10562;
const put          = method_10566;
const putByte      = method_10567;
const getByte      = method_10571;
const contains     = method_10573;
const putString    = method_10582;
const getHeldType  = method_10601;
const getCompound2 = method_10602;
const copy         = method_10707;
const getType      = method_10711;

class ItemsLoader {
  private static final Long LONG_ZERO = Long.valueOf(0L);
  private final StorageViewScreen screen;
  private final ArrayList nbtItems;
  private final int[] fastIndex; // index: indexof nbtItems, value: indexof screen.loadedItems | -1: null | -2: unpacked shulker
  private final boolean unpackShulker;
  private final Pair[] shulkerIndex; // index: indexof nbtItems, value: Pair<ItemData[], count[]>
  private final List unpackedItems; // list of ItemData from unpacked shulker so unpacking can be faster
  private final List nonIndexed;
  private final Path path;
  private final String[] chunks;
  private final Pos3D ppos;
  private final JsmText loadingLabel;

  private boolean loaded = false;

  public ItemsLoader(StorageViewScreen screen, ArrayList nbtItems, boolean unpackShulker, Path chestsPath, String[] chunks, Pos3D playerPos, JsmText loadingLabel) {
    this.screen = screen;
    this.nbtItems = (ArrayList) nbtItems.clone();
    this.unpackShulker = unpackShulker;
    this.path = chestsPath;
    this.chunks = chunks;
    this.ppos = playerPos;
    this.loadingLabel = loadingLabel;

    fastIndex = new int[nbtItems.size()];
    Arrays.fill(fastIndex, -1);
    if (unpackShulker) {
      shulkerIndex = new Pair[nbtItems.size()];
      unpackedItems = new ArrayList();
      nonIndexed = new ArrayList();
    }
  }

  private Function parseReader;
  public void setParser(Function parser) {
    parseReader = parser;
  }

  private boolean unpack(ItemData item) {
    if (!unpackShulker) return false;
    String id = item.item.getItemId();
    if (!id.startsWith("minecraft:") || !id.endsWith("shulker_box")) return false;

    NBTElementHelper nbt1 = item.item.getNBT();
    if (nbt1 == null) return false;
    NBTElementHelper nbt2 = nbt1.asCompoundHelper().get("BlockEntityTag");
    if (nbt2 == null || !nbt2.isCompound()) return false;
    NBTElementHelper nbt3 = nbt2.asCompoundHelper().get("Items");
    if (nbt3 == null || ((NbtElement) nbt3.getRaw()).$getType() != 9) return false;
    NbtList list = (NbtList) nbt3.getRaw();
    if (list.$getHeldType() != 10) return false;

    HashMap items = new HashMap();
    int i = -1;
    while (true) {
      try {
        list.$get(++i);
      } catch (Throwable e) {
        break;
      }
      NbtCompound onbt = list.$getCompound2(i);
      if (!onbt.$contains("id", 8)) return false;
      byte count = onbt.$getByte("Count");
      if (count == 0) continue;
      NbtCompound nbt = new NbtCompound();
      nbt.$putString("id", onbt.$getString("id"));
      nbt.$putByte("Count", (byte) 1);
      if (onbt.$contains("tag", 10)) nbt.$put("tag", (NbtCompound) onbt.$getCompound("tag").$copy());

      if (items.containsKey(nbt)) {
        items.put(nbt, Long.valueOf(((Long) items.get(nbt)).longValue() + count));
      } else {
        items.put(nbt, Long.valueOf((long) count));
      }
    }
    if (items.isEmpty()) return false;

    int size = items.size();
    ItemData[] itemArr = new ItemData[size];
    long[] countArr = new long[size];
    Object[] keys = items.keySet().toArray();
    for (int i = 0; i < size; i++) {
      countArr[i] = ((Long) items.get(keys[i])).longValue();
      ItemData item;
      try {
        item = new ItemData((NbtCompound) keys[i]);
      } catch (Throwable e) {
        return false;
      }
      int index;
      if ((index = unpackedItems.indexOf(item)) != -1) {
        item = (ItemData) ((ItemData) unpackedItems.get(index)).merge(item);
      } else if ((index = screen.loadedItems.indexOf(item)) != -1) {
        item = (ItemData) ((ItemData) screen.loadedItems.get(index)).merge(item);
        unpackedItems.add(item);
      } else {
        unpackedItems.add(item);
        nonIndexed.add(item);
        synchronized (screen.loadedItems) {
          screen.loadedItems.add(item);
        }
      }
      itemArr[i] = item;
    }
    fastIndex[item.index] = -2;
    shulkerIndex[item.index] = new Pair(itemArr, countArr);

    for (int i = 0; i < size; i++) {
      itemArr[i].addCount(countArr[i] * item.count);
      itemArr[i].foundAt(item.nearest, item.distance);
    }

    return true;
  }

  private void addItem(int index, long count, double distance, BlockPosHelper pos) {
    if (index <= 0) return;
    index--;
    int fi = fastIndex[index];
    if (fi != -1) {
      if (fi >= 0) {
        ItemData item = (ItemData) screen.loadedItems.get(fi);
        item.addCount(count);
        item.foundAt(pos, distance);
      } else if (fi == -2) {
        Pair pair = shulkerIndex[index];
        Object[] items = (Object[]) pair.getT();
        long[] counts = (long[]) pair.getU();
        for (int i = 0; i < items.length; i++) {
          ItemData item = (ItemData) items[i];
          item.addCount(counts[i] * count);
          item.foundAt(pos, distance);
        }
      }
    } else {
      ItemData item;
      try {
        item = new ItemData((NbtCompound) nbtItems.get(index));
      } catch (Throwable e) {
        return;
      }
      item.setCount(count);
      item.foundAt(pos, distance);
      item.index = index;
      if (!unpack(item)) {
        int i = nonIndexed == null ? -1 : nonIndexed.indexOf(item);
        if (i != -1) {
          ItemData it = (ItemData) nonIndexed.get(i);
          it.merge(item);
          nonIndexed.remove(i);
          fastIndex[it.index] = screen.loadedItems.indexOf(it);
        } else {
          fastIndex[item.index] = screen.loadedItems.size();
          synchronized (screen.loadedItems) {
            screen.loadedItems.add(item);
          }
        }
      }
    }
    screen.markDirty();
    return;
  }

  private void decodeItems(int[] itemIndexes, int[] counts, BlockPosHelper pos) {
    int countIndex = 0;
    Map items = new HashMap();
    for (int i = 0; i < itemIndexes.length; i++) {
      if (itemIndexes[i] == 0) continue;
      Integer ii = Integer.valueOf(itemIndexes[i]);
      items.put(ii, Long.valueOf(((Long) items.getOrDefault(ii, LONG_ZERO)).longValue() + counts[countIndex++]));
    }
    double distance = pos.distanceTo(ppos);
    Object[] keys = items.keySet().toArray();
    for (int i = 0; i < keys.length; i++) {
      if (screen.isDestroyed()) return;
      Integer key = (Integer) keys[i];
      addItem(key.intValue(), ((Long) items.get(key)).longValue(), distance, pos);
    }
  }

  private int[] convertToIntArray(JsonElement element) {
    if (!element.isJsonArray()) return null;
    JsonArray jarr = element.getAsJsonArray();
    int len = jarr.size();
    int[] arr = new int[len];
    for (int i = 0; i < len; i++) {
      JsonElement e = jarr.get(i);
      if (!e.isJsonPrimitive()) return null;
      JsonPrimitive p = e.getAsJsonPrimitive();
      if (!p.isNumber()) return null;
      arr[i] = p.getAsInt();
    }
    return arr;
  }

  private BlockPosHelper convertToBlockPos(String pos) {
    String[] split = pos.split(",");
    if (split.length != 3) return null;
    try {
      return new BlockPosHelper(Integer.parseInt(split[0]), Integer.parseInt(split[1]), Integer.parseInt(split[2]));
    } catch (Throwable ignored) {
      return null;
    }
  }

  private JsonObject readJson(File file) {
    FileReader reader = null;
    try {
      reader = new FileReader(file, StandardCharsets.UTF_8);
      JsonElement element = (JsonElement) parseReader.apply(reader);
      if (element.isJsonObject()) return element.getAsJsonObject();
      else return null;
    } finally {
      if (reader != null) reader.close();
    }
  }

  private void loadItemsInChunk(String cpos) {
    File file = path.resolve(cpos + ".json").toFile();
    if (!file.isFile()) return;
    JsonObject chunk = readJson(file);
    if (chunk == null || !chunk.has("chests")) return;
    JsonElement chestsE = chunk.get("chests");
    if (!chestsE.isJsonObject()) return;
    JsonObject chests = chestsE.getAsJsonObject();
    Object[] keys = chests.keySet().toArray();
    for (int i = 0; i < keys.length; i++) {
      if (screen.isDestroyed()) return;
      BlockPosHelper pos = convertToBlockPos((String) keys[i]);
      if (pos == null) continue;
      JsonElement chestE = chests.get((String) keys[i]);
      if (!chestE.isJsonObject()) continue;
      JsonObject chest = chestE.getAsJsonObject();
      if (!chest.has("items") || !chest.has("counts")) continue;
      int[] items = convertToIntArray(chest.get("items"));
      if (items == null) continue;
      int[] counts = convertToIntArray(chest.get("counts"));
      if (counts == null) continue;
      decodeItems(items, counts, pos);
    }
  }

  public void load() {
    if (loaded) return;
    loaded = true;
    for (int i = 0; i < chunks.length; i++) {
      if (screen.isDestroyed()) return;
      loadingLabel.setText(String.format("Loading Chunk %s (%s/%s)", new String[]{ chunks[i], Integer.toString(i + 1), Integer.toString(chunks.length) }));
      screen.setLoadProgress((double) (i + 1) / chunks.length);
      loadItemsInChunk(chunks[i]);
    }
    screen.setLoadProgress(1.1);
    loadingLabel.setText("");
  }

}
