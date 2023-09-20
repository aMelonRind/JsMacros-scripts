
import xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper;
import xyz.wagyourtail.jsmacros.client.api.helpers.world.BlockPosHelper;
import xyz.wagyourtail.jsmacros.client.api.helpers.NBTElementHelper;

import java.util.ArrayList;
import java.util.List;

import from_script IItemData;

//# Imports: Fabric
import net.minecraft.class_1799 as ItemStack;
import net.minecraft.class_2487 as NbtCompound;
import net.minecraft.class_2499 as NbtList;
import net.minecraft.class_2520 as NbtElement;
import net.minecraft.class_2561 as Text;

const STRING_TYPE    = field_33258;
const LIST_TYPE      = field_33259;
const COMPOUND_TYPE  = field_33260;
const INT_ARRAY_TYPE = field_33261;

const fromNbt      = method_7915;
const get          = method_10534;
const getType      = method_10540;
const getKeys      = method_10541;
const remove       = method_10551;
const getList      = method_10554;
const getString    = method_10558;
const getCompound  = method_10562;
const getCompound2 = method_10602;
const containsUuid = method_25928;
const literal      = method_43470;

class ItemData extends IItemData {
  private static final Text[] smallCountTexts = new Text[] {
    Text.$literal("0"),
    null,
    Text.$literal("2"),
    Text.$literal("3"),
    Text.$literal("4"),
    Text.$literal("5"),
    Text.$literal("6"),
    Text.$literal("7"),
    Text.$literal("8"),
    Text.$literal("9")
  };
  private static final String units = "KMBTQ";
  public static final Object infoSync = new Object();
  // public final ItemStackHelper item;
  // public int index = -1;
  // public long count = 0L;
  // public double distance = -1.0;
  // public BlockPosHelper nearest = null;

  private boolean generatedCountText = false;
  private Text countText = null;
  private boolean countIsShort = false;

  private boolean generatedTooltip = false;
  private List extraTooltip = null;

  private String search_tooltip;
  private String search_tag;
  private String search_identifier;
  private String search_modid;

  public static String localeNumber(long num) {
    if (-1000L < num && num < 1000L) return Long.toString(num);
    StringBuilder str = new StringBuilder(Long.toString(num));
    int i = str.indexOf(".");
    if (i == -1) i = str.length();
    int stop = str.charAt(0) == '-' ? 2 : 1;
    while ((i -= 3) >= stop) str.insert(i, ",");
    return str.toString();
  }

  public static NbtCompound cleanUUID(NbtCompound nbt) {
    List keys = new ArrayList(nbt.$getKeys());
    int size = keys.size();
    for (int i = 0; i < size; i++) {
      String key = (String) keys.get(i);
      if (key.length() == 4) {
        String lc = key.toLowerCase();
        if (lc.equals("text")) continue;
        if (lc.equals("uuid")) {
          nbt.$remove(key);
          continue;
        }
      }
      switch (nbt.$getType(key)) {
        case NbtElement.$STRING_TYPE: {
          String str = nbt.$getString(key);
          int len = str.length();
          if (len != 32 && !(len == 36 &&
            str.charAt(8) == '-' && str.charAt(13) == '-' && str.charAt(18) == '-' && str.charAt(23) == '-')) continue;
          if (len == 36) str = new StringBuilder(str).deleteCharAt(8).deleteCharAt(12).deleteCharAt(16).deleteCharAt(20).toString();
          int j = 0;
          for (; j < 32; j++) {
            char c = str.charAt(j);
            if (!(('0' <= c && c <= '9') || ('a' <= c && c <= 'f') || ('A' <= c && c <= 'F'))) break;
          }
          if (j == 32) nbt.$remove(key);
          break;
        }
        case NbtElement.$INT_ARRAY_TYPE: {
          if (nbt.$containsUuid(key)) nbt.$remove(key);
          break;
        }
        case NbtElement.$COMPOUND_TYPE: {
          cleanUUID(nbt.$getCompound(key));
          break;
        }
        case NbtElement.$LIST_TYPE: {
          NbtList list = nbt.$getList(key, 10);
          int j = 0;
          while (true) {
            try {
              list.$get(j);
            } catch (Throwable e) {
              break;
            }
            cleanUUID(list.$getCompound2(j));
            j++;
          }
          break;
        }
      }
    }
    return nbt;
  }

  public ItemData(ItemStackHelper item) {
    super(item);
  }

  public ItemData(NbtCompound nbt) {
    this(new ItemStackHelper(ItemStack.$fromNbt(nbt)));
  }

  public void setCount(long count) {
    synchronized (infoSync) {
      generatedCountText = false;
      generatedTooltip = false;
      this.count = count;
    }
  }

  public long addCount(long count) {
    synchronized (infoSync) {
      generatedCountText = false;
      generatedTooltip = false;
      if (this.count + count < this.count && count >= 0L) return this.count = Long.MAX_VALUE;
      return this.count += count;
    }
  }

  public void foundAt(BlockPosHelper pos, double distance) {
    synchronized (infoSync) {
      if (this.distance != -1.0 && distance >= this.distance) return;
      this.distance = distance;
      nearest = pos;
    }
  }

  public IItemData merge(IItemData other) {
    addCount(other.count);
    foundAt(other.nearest, other.distance);
    if (index == -1) index = other.index;
    return this;
  }

  public Text getCountText(double textScale) {
    synchronized (infoSync) {
      if (generatedCountText) return countText;
      generatedCountText = true;
      generatedTooltip = false;
      countIsShort = false;
      if (count < 10L && count >= 0L) return countText = smallCountTexts[(int) count];
      String str = Long.toString(count);
      if (count < 10000L && count > 0L) return countText = Text.$literal(str);
      boolean isLarge = textScale > 0.6;
      int len = str.length();
      int unit = Math.min(5, (len - (str.startsWith("-") ? 1 : 0) - (isLarge ? 1 : 2)) / 3);
      String res = "";
      if (unit == 0) res += str;
      else {
        countIsShort = true;
        res += str.substring(0, len - unit * 3);
        if (res.length() < (isLarge ? 3 : 4)) res += "." + str.charAt(len - unit * 3);
        res += units.charAt(unit - 1);
      }
      return countText = Text.$literal(res.startsWith("-") ? "§c" + res : res);
    }
  }

  public List getExtraTooltip() {
    synchronized (infoSync) {
      if (generatedTooltip) return extraTooltip != null ? new ArrayList(extraTooltip) : null;
      generatedTooltip = true;
      List tooltips = new ArrayList();

      if (countIsShort) tooltips.add(Text.$literal("§7Count: " + localeNumber(count)));

      extraTooltip = (tooltips.isEmpty() ? null : tooltips);
      return extraTooltip != null ? new ArrayList(extraTooltip) : null;
    }
  }

  public int compareCount(IItemData other) {
    if (count == other.count) return 0;
    return (count - other.count < 0L) ? -1 : 1;
  }

  public int compareName(IItemData other) {
    int c = item.getName().getString().compareTo(other.item.getName().getString());
    if (c == 0) return 0;
    return c < 0 ? -1 : 1;
  }

  public int compareDistance(IItemData other) {
    if (distance == other.distance) return 0;
    if (distance == -1.0) return 1;
    if (other.distance == -1.0) return -1;
    return (distance - other.distance < 0.0) ? -1 : 1;
  }

  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof IItemData)) return false;
    IItemData oi = (IItemData) o;
    if (index != -1 && oi.index != -1) return index == oi.index;
    if (!item.getItemId().equals(oi.item.getItemId())) return false;
    NBTElementHelper nbta = item.getNBT();
    NBTElementHelper nbtb = oi.item.getNBT();
    if (nbta == nbtb) return true;
    if (nbta == null || nbtb == null) return false;
    return nbta.getRaw().equals(nbtb.getRaw());
  }

}
