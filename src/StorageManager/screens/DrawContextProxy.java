
import java.util.Optional;
import java.util.List;

//# Imports: Fabric
import net.minecraft.class_310  as MinecraftClient;
import net.minecraft.class_327  as TextRenderer;
import net.minecraft.class_332  as DrawContext;
import net.minecraft.class_1799 as ItemStack;
import net.minecraft.class_4587 as MatrixStack;
import net.minecraft.class_4597 as VertexConsumerProvider;
import class_4598 as Immediate;

const matrices           = field_44657;
const vertexConsumers    = field_44658;
const getInstance        = method_1551;
const drawTooltip        = method_51437;
const drawItemTooltip    = method_51446;
const getMatrices        = method_51448;
const getVertexConsumers = method_51450;

class DrawContextProxy extends DrawContext {

  private DrawContext parent;
  private MatrixStack $matrices;
  private VertexConsumerProvider.Immediate $vertexConsumers;

  private List extraTooltips;

  public DrawContextProxy() {
    super(MinecraftClient.$getInstance(), null);
  }

  public void drawItemTooltipWithExtra(TextRenderer textRenderer, ItemStack stack, int x, int y, DrawContext parent, List extra) {
    this.parent = parent;
    this.$matrices = parent.$getMatrices();
    this.$vertexConsumers = parent.$getVertexConsumers();
    this.extraTooltips = extra;
    this.$drawItemTooltip(textRenderer, stack, x, y);
  }

  public void $drawTooltip(TextRenderer textRenderer, List text, Optional data, int x, int y) {
    text.addAll(extraTooltips);
    parent.$drawTooltip(textRenderer, text, data, x, y);
  }

}
