
import xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper;
import xyz.wagyourtail.jsmacros.client.api.helpers.world.BlockPosHelper;
import xyz.wagyourtail.jsmacros.client.api.helpers.NBTElementHelper;

import java.util.ArrayList;
import java.util.List;

import from_script IItemData;

//# Imports: Fabric
import net.minecraft.class_2561 as Text;

const literal = method_43470;

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
  private final Object infoSync = new Object();
  // public final ItemStackHelper item;
  // public int index = -1;
  // public long count = 0L;
  // public long distance = 0L;
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

  public ItemData(ItemStackHelper item) {
    super(item);
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

  public void foundAt(BlockPosHelper pos, long distance) {
    synchronized (infoSync) {
      if (this.distance != -1L && distance >= this.distance) return;
      this.distance = distance;
      nearest = pos;
    }
  }

  public void merge(IItemData other) {
    addCount(other.count);
    foundAt(other.nearest, other.distance);
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
    return (count - other.count < 0L) ? -2 : 2;
  }

  public int compareName(IItemData other) {
    int c = item.getName().getString().compareTo(other.item.getName().getString());
    if (c == 0) return 0;
    return c < 0 ? -2 : 2;
  }

  public int compareDistance(IItemData other) {
    if (distance == other.distance) return 0;
    if (distance == -1L) return 2;
    if (other.distance == -1L) return -2;
    return (distance - other.distance < 0L) ? -2 : 2;
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
