
import xyz.wagyourtail.jsmacros.client.api.library.impl.FChat;

import org.lwjgl.glfw.GLFW;

import java.lang.reflect.Field;
import java.util.List;

//# Imports: Fabric
import net.minecraft.class_327  as TextRenderer;
import net.minecraft.class_332  as DrawContext;
import net.minecraft.class_342  as TextFieldWidget;
import net.minecraft.class_1921 as RenderLayer;
import net.minecraft.class_2561 as Text;
import net.minecraft.class_2583 as Style;
import net.minecraft.class_5251 as TextColor;
import net.minecraft.class_5481 as OrderedText;

const width                      = field_22758;
const height                     = field_22759;
const EMPTY                      = field_24360;

const getWidth                   = method_1727;
const setText                    = method_1852;
const setDrawsBackground         = method_1858;
const onChanged                  = method_1874;
const setMaxLength               = method_1880;
const getText                    = method_1882;
const setCursor                  = method_1883;
const setStyle                   = method_10862;
const fill                       = method_25294;
const drawStringWithShadow       = method_25303;
const setFocused                 = method_25365;
const isFocused                  = method_25370;
const render                     = method_25394;
const charTyped                  = method_25400;
const mouseClicked               = method_25402;
const keyPressed                 = method_25404;
const trimToWidth                = method_27523;
const drawCenteredTextWithShadow = method_27534;
const withColor                  = method_27703;
const fromRgb                    = method_27717;
const literal                    = method_43470;
const setY                       = method_46419;
const setX                       = method_46421;
const getX                       = method_46426;
const getY                       = method_46427;
const setPlaceHolder             = method_47404;
const renderButton               = method_48579;
const setShaderColor             = method_51422;
const drawTooltip                = method_51434;
const fillInLayer                = method_51739;
const getGuiOverlay              = method_51785;
const getGuiTextHighlight        = method_51786;

class SearchBar extends TextFieldWidget {
  // private static final FChat Chat = new FChat();

  private static final Field firstCharacterIndexF = TextFieldWidget.class.getDeclaredField("field_2103");
  private static final Field selectionStartF = TextFieldWidget.class.getDeclaredField("field_2102");
  private static final Field selectionEndF = TextFieldWidget.class.getDeclaredField("field_2101");

  private static Text textWithColor(String text, int color) {
    return Text.$literal(text).$setStyle(Style.$EMPTY.$withColor(TextColor.$fromRgb(color)));
  }

  private static final List tooltip = List.of(
    Text.$literal("Prefixes:"),
    textWithColor(" #Tooltip", 0xffbf7f),
    textWithColor(" $Tag", 0x7fffff),
    textWithColor(" *Identifier", 0x9f9fff),
    textWithColor(" @Mod", 0xff7fff)
  );
  private static final Text placeholder = Text.$literal("Search.. not implemented");
  public static String searchText = "";
  public static String convertedText = "";

  public TextRenderer textRenderer;
  public boolean changed = false;
  public int barColor = 0xFFEEEEEE;
  public double searchProgress = 0.0;
  public double loadProgress = 0.0;
  private int loadDoneTicks = 0;
  private int searchDoneTicks = 0;
  private int cursorTicks = 0;
  private int tooltipTicks = 0;
  private int barTicks = 4;

  private int startIndex = 0;
  private int cursor = 0;

  private void setFirstCharacterIndex(int fci) { return firstCharacterIndexF.setInt(this, fci); }

  public SearchBar(TextRenderer textRenderer) {
    super(textRenderer, 0, 0, 10, 0, Text.$literal("Item viewer's search bar"));
    this.textRenderer = textRenderer;
    $setMaxLength(128);
    $setText(searchText);
    $setDrawsBackground(false);
    $setPlaceHolder(placeholder);

    firstCharacterIndexF.setAccessible(true);
    selectionStartF.setAccessible(true);
    selectionEndF.setAccessible(true);
  }

  public int getFirstCharacterIndex() { return firstCharacterIndexF.getInt(this); }
  public int getSelectionStart() { return selectionStartF.getInt(this); }
  public int getSelectionEnd() { return selectionEndF.getInt(this); }

  public void setFocused(boolean focused) { $setFocused(focused); }
  public boolean isFocused() { return $isFocused(); }
  public String getText() { return $getText(); }
  public void render(DrawContext context, int mouseX, int mouseY, float tickDelta) {
    super.$render(context, mouseX, mouseY, tickDelta);
  }

  public void setPos(int x, int y, int w, int h) {
    $setX(x);
    $setY(y);
    if (w < 10) w = 10;
    if ($width != w) {
      $width = w;
      int l = Math.min(searchText.length(), getSelectionStart() + 5);
      setFirstCharacterIndex(l - textRenderer.$trimToWidth(new StringBuilder(searchText.substring(0, l)).reverse().toString(), w).length());
    }
    $height = h;
  }

  public void tick() {
    ++loadDoneTicks;
    ++searchDoneTicks;
    ++cursorTicks;
    ++tooltipTicks;
    if (barTicks < 4) ++barTicks;
  }

  public void $setCursor(int cursor) {
    cursorTicks = 0;
    super.$setCursor(cursor);
  }

  protected void onChanged() {
    searchText = $getText();
    changed = true;
  }

  public void $setFocused(boolean focused) {
    if (!focused && $getText().isBlank()) $setText("");
    if (focused || $isFocused()) barTicks = 0;
    super.$setFocused(focused);
    cursorTicks = 0;
  }

  public void $setText(String text) {
    super.$setText(text);
    if (!searchText.equals($getText())) onChanged();
  }

  public void mouseClicked(double mouseX, double mouseY, int button) {
    if (button == 1) super.$setText("");
    $setDrawsBackground(false);
    $mouseClicked(mouseX, mouseY, button);
    if (!searchText.equals($getText())) onChanged();
  }

  public boolean $keyPressed(int keyCode, int scanCode, int modifiers) {
    boolean res = super.$keyPressed(keyCode, scanCode, modifiers);
    if (res) onChanged();
    return res;
  }

  public boolean $charTyped(char chr, int modifiers) {
    boolean res = super.$charTyped(chr, modifiers);
    if (res) onChanged();
    return res;
  }

  private void renderBar(DrawContext context, int x1, int x2, int y, boolean dim) {
    if (loadProgress > 0.0) {
      if (loadProgress > 1.0) {
        if (loadDoneTicks < 16) {
          context.$fill(x1, y + 1, x2, y + 2, 0xff00eeee - loadDoneTicks * 0x10000000);
        }
      } else {
        int lx2 = x1 + (int) Math.floor((x2 - x1) * loadProgress);
        if (lx2 == x1) ++lx2;
        context.$fill(x1, y + 1, lx2, y + 2, 0xff00eeee);
        loadDoneTicks = 0;
      }
    }
    if (dim) context.$setShaderColor(0.75f, 0.75f, 0.75f, 1.0f);
    context.$fill(x1, y, x2, y + 1, barColor);
    if (searchProgress > 0.0) {
      if (searchProgress > 1.0) {
        if (searchDoneTicks < 16) {
          context.$fill(x1, y, x2, y + 1, 0xff00ff00 - searchDoneTicks * 0x10000000);
        }
      } else {
        int sx2 = x1 + (int) Math.floor((x2 - x1) * searchProgress);
        if (sx2 == x1) ++sx2;
        context.$fill(x1, y, sx2, y + 1, 0xff00ff00);
        searchDoneTicks = 0;
      }
    }
  }

  private int getColor(char c) {
    switch (c) {
      case '#': return 0xffbf7f;
      case '$': return 0x7fffff;
      case '*': return 0x9f9fff;
      case '@': return 0xff7fff;
    }
    return 0xffffff;
  }

  public void $renderButton(DrawContext context, int mouseX, int mouseY, float delta) {
    if ($isFocused()) {
      renderBar(context, $getX() + 3 - barTicks, $getX() + $width - 3 + barTicks, $getY() + $height, false);
    } else {
      renderBar(context, $getX() - 1 + barTicks, $getX() + $width + 1 - barTicks, $getY() + $height, true);
    }
    if ($isFocused() || !searchText.isEmpty()) {
      if (searchText.isEmpty()) {
        if (cursorTicks % 12 < 6) {
          context.$drawStringWithShadow(textRenderer, "_", $getX(), $getY() + $height / 2 - 5, 0xffffff);
        }
      } else {
        int fci = getFirstCharacterIndex();
        int selStart = getSelectionStart() - fci;
        int selEnd = getSelectionEnd() - fci;
        String txt = textRenderer.$trimToWidth(searchText.substring(fci), $width);
        boolean cursorInTxt = 0 <= selStart && selStart <= txt.length();
        boolean cursorVisible = cursorInTxt && $isFocused() && cursorTicks % 12 < 6;
        int y = $getY() + $height / 2 - 5;
        if (selEnd > txt.length()) selEnd = txt.length();

        int color = 0xffffff;
        int li = searchText.lastIndexOf(" ", fci);
        if (li == -1) {
          color = getColor(searchText.charAt(0));
        } else if (li < fci) {
          color = getColor(searchText.charAt(li + 1));
        }

        int x = $getX();
        int index = 0;
        int index2;
        while (index < txt.length()) {
          index2 = txt.indexOf(" ", index);
          if (index2 == -1 || index2 == txt.length() - 1) {
            x = context.$drawStringWithShadow(textRenderer, txt.substring(index), x, y, color);
            break;
          }
          x = context.$drawStringWithShadow(textRenderer, txt.substring(index, index2 + 1), x, y, color) - 1;
          index = index2 + 1;
          color = getColor(txt.charAt(index));
        }

        if (cursorVisible || selStart != selEnd) {
          if (selStart > txt.length()) selStart = txt.length();
          int x1 = $getX() + textRenderer.$getWidth(txt.substring(0, selStart));
          if (cursorVisible) {
            if (selStart != selEnd || fci + selStart != searchText.length()) {
              context.$fillInLayer(RenderLayer.$getGuiOverlay(), x1, y - 1, x1 + 1, y + 10, 0xffd0d0d0);
            } else {
              context.$drawStringWithShadow(textRenderer, "_", x1, y, 0xFFFFFF);
            }
          }
          if (selStart != selEnd) {
            int x2 = $getX() + textRenderer.$getWidth(txt.substring(0, selEnd));
            if (x1 > x2) {
              int t = x1;
              x1 = x2;
              x2 = t;
            }
            if (x1 < $getX()) x1 = $getX();
            if (x2 > $getX() + $width) x2 = $getX() + $width;
            context.$fillInLayer(RenderLayer.$getGuiTextHighlight(), x1, y - 1, x2, y + 10, 0xff0000ff);
          }
        }
      }
    } else {
      context.$drawCenteredTextWithShadow(textRenderer, placeholder, $getX() + $width / 2, $getY() + $height / 2 - 5, 0xdddddd);
    }
    context.$setShaderColor(1.0f, 1.0f, 1.0f, 1.0f);

    if ($getX() <= mouseX && mouseX < $getX() + $width && $getY() <= mouseY && mouseY < $getY() + $height) {
      if (tooltipTicks > 12) context.$drawTooltip(textRenderer, tooltip, $getX() + $width - 8, $getY() + 15);
    } else tooltipTicks = 0;
  }

}
