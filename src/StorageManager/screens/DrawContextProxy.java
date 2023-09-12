
import java.util.Optional;
import java.util.List;

import net.minecraft.class_310 as MinecraftClient;
import net.minecraft.class_327 as TextRenderer;
import net.minecraft.class_332 as DrawContext;
import net.minecraft.class_1799 as ItemStack;

//# Imports: Fabric
const getInstance     = method_1551;
const drawTooltip     = method_51437;
const drawItemTooltip = method_51446;

class DrawContextProxy extends DrawContext {

  private DrawContext parent;
  private List extraTooltips;

  public DrawContextProxy() {
    super(MinecraftClient.$getInstance(), null);
  }

  public void drawItemTooltipWithExtra(TextRenderer textRenderer, ItemStack stack, int x, int y, DrawContext parent, List extra) {
    this.parent = parent;
    this.extraTooltips = extra;
    this.$drawItemTooltip(textRenderer, stack, x, y);
  }

  public void $drawTooltip(TextRenderer textRenderer, List text, Optional data, int x, int y) {
    text.addAll(extraTooltips);
    parent.$drawTooltip(textRenderer, text, data, x, y);
  }

}
