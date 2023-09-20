
// this is needed to make it access itself

import xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper;
import xyz.wagyourtail.jsmacros.client.api.helpers.world.BlockPosHelper;

class IItemData {
  public final ItemStackHelper item;
  public int index = -1;
  public long count = 0L;
  public double distance = -1.0;
  public BlockPosHelper nearest = null;

  public IItemData(ItemStackHelper item) {
    this.item = item;
  }

}
