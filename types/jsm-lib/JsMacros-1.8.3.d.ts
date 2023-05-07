/**
 * The global context
 * If you're trying to access the context in {@link JsMacros.on},
 * use the second param of callback
 */
declare const context: EventContainer;
/**
 * Cast event in javascript:
 * Remove the `\` between `*` and `///` because jsdoc doesn't escape it
 * ```js
 * /** @type {Events.Service} *\/// @ts-ignore
 * ```
 * ```js
 * const e = event;
 * ```
 * Cast event in typescript:
 * ```ts
 * const e = event as Events.Service;
 * ```
 */
declare const event: Events.BaseEvent;
declare const file: Packages.java.io.File;

declare namespace Events {
  // personally i don't really use object method on events so..
  interface BaseEvent {
    // extends JavaObject

    getEventName(): string;
  }

  interface AirChange extends BaseEvent {
    readonly air: number;
  }

  interface ArmorChange extends BaseEvent {
    readonly slot: ArmorSlot;
    readonly item: ItemStackHelper;
    readonly oldItem: ItemStackHelper;
  }

  interface AttackBlock extends BaseEvent {
    readonly block: BlockDataHelper;
    readonly side: Side;
  }

  interface AttackEntity extends BaseEvent {
    readonly entity: EntityHelper;
  }

  interface BlockUpdate extends BaseEvent {
    readonly block: BlockDataHelper;
    readonly updateType: BlockUpdateType;
  }

  interface Bossbar extends BaseEvent {
    readonly bossBar: BossBarHelper;
    readonly uuid: string;
    readonly type: BossBarUpdateType;
  }

  interface ChunkLoad extends BaseEvent {
    readonly x: number;
    readonly z: number;
    readonly isFull: boolean;
  }

  interface ChunkUnload extends BaseEvent {
    readonly x: number;
    readonly z: number;
  }

  interface ClickSlot extends BaseEvent {
    /**
     * <a href="https://wiki.vg/Protocol#Click_Window" target="_blank">https://wiki.vg/Protocol#Click_Window</a>
     */
    readonly mode: Septit;
    readonly button: ClickSlotButton;
    readonly slot: number;

    /**
     * set to `true` to prevent the default action
     */
    cancel: boolean;

    /**
     * @return inventory associated with the event
     */
    getInventory(): Inventory<any>;
  }

  interface Damage extends BaseEvent {
    readonly attacker: EntityHelper;
    readonly source: DamageSource;
    readonly health: number;
    readonly change: number;
  }

  interface Death extends BaseEvent {}

  interface DimensionChange extends BaseEvent {
    readonly dimension: Dimension;
  }

  interface Disconnect extends BaseEvent {
    /** @since 1.6.4 */
    readonly message: TextHelper;
  }

  interface DropSlot extends BaseEvent {
    readonly slot: number;

    /**
     * whether it's all or a single item being dropped
     */
    readonly all: boolean;

    /**
     * set to `true` to cancel the default action
     */
    cancel: boolean;

    /**
     * @return inventory associated with the event
     */
    getInventory(): Inventory<any>;
  }

  interface EntityDamaged extends BaseEvent {
    readonly entity: EntityHelper;

    /** @since 1.6.5 */
    readonly health: number;
    readonly damage: number;
  }

  interface EntityHealed extends BaseEvent {
    readonly entity: EntityHelper;
    readonly health: number;
    readonly damage: number;
  }

  interface EntityLoad extends BaseEvent {
    readonly entity: EntityHelper;
  }

  interface EntityUnload extends BaseEvent {
    readonly entity: EntityHelper;
    readonly reason: EntityUnloadReason;
  }

  interface EXPChange extends BaseEvent {
    readonly progress: number;
    readonly total: number;
    readonly level: number;

    /** @since 1.6.5 */
    readonly prevProgress: number;

    /** @since 1.6.5 */
    readonly prevTotal: number;

    /** @since 1.6.5 */
    readonly prevLevel: number;
  }

  interface FallFlying extends BaseEvent {
    readonly state: boolean;
  }

  interface Heal extends BaseEvent {
    readonly source: HealSource;
    readonly health: number;
    readonly change: number;
  }

  interface HeldItemChange extends BaseEvent {
    readonly offHand: boolean;
    readonly item: ItemStackHelper;
    readonly oldItem: ItemStackHelper;
  }

  interface HungerChange extends BaseEvent {
    readonly foodLevel: number;
  }

  interface InteractBlock extends BaseEvent {
    readonly offhand: boolean;
    readonly result: ActionResult;
    readonly block: BlockDataHelper;
    readonly side: Side;
  }

  interface InteractEntity extends BaseEvent {
    readonly offhand: boolean;
    readonly result: ActionResult;
    readonly entity: EntityHelper;
  }

  interface ItemDamage extends BaseEvent {
    readonly item: ItemStackHelper;
    readonly damage: number;
  }

  interface ItemPickup extends BaseEvent {
    readonly item: ItemStackHelper;
  }

  interface JoinedKey extends BaseEvent {
    cancel: boolean;
  }

  interface JoinedTick extends BaseEvent {}

  interface JoinServer extends BaseEvent {
    readonly player: ClientPlayerEntityHelper;
    readonly address: string;
  }

  interface Key extends BaseEvent {
    readonly action: Bit;
    readonly key: Key;
    readonly mods: KeyMods;
  }

  interface OpenContainer extends BaseEvent {
    readonly inventory: Inventory<any>;
    readonly screen: IScreen;
    cancelled: boolean;
  }

  interface OpenScreen extends BaseEvent {
    readonly screen: IScreen;
    readonly screenName: ScreenName;
  }

  interface PlayerJoin extends BaseEvent {
    readonly UUID: string;
    readonly player: PlayerListEntryHelper;
  }

  interface PlayerLeave extends BaseEvent {
    readonly UUID: string;
    readonly player: PlayerListEntryHelper;
  }

  interface RecvMessage extends BaseEvent {
    text: TextHelper;

    /** @since 1.8.2 */
    signature: number[];

    /** @since 1.8.2 */
    messageType: string;
  }

  interface ResourcePackLoaded extends BaseEvent {
    readonly isGameStart: boolean;
    readonly loadedPacks: JavaList<string>;
  }

  interface Riding extends BaseEvent {
    readonly state: boolean;
    readonly entity: EntityHelper;
  }

  interface SendMessage extends BaseEvent {
    message: string;
  }

  interface SignEdit extends BaseEvent {
    readonly pos: PositionCommon$Pos3D;
    closeScreen: boolean;
    signText: JavaList<string>;
  }

  interface Sound extends BaseEvent {
    readonly sound: SoundId;
    readonly volume: number;
    readonly pitch: number;
    readonly position: PositionCommon$Pos3D;
  }

  interface Tick extends BaseEvent {}

  interface Title extends BaseEvent {
    readonly type: TitleType;
    message: TextHelper;
  }

  interface CommandContext extends BaseEvent {
    /**
     * @param name
     * @return
     * @since 1.4.2
     * @throws CommandSyntaxException
     */
    getArg(name: string): any;
    getChild(): CommandContextHelper;
    getRange(): Packages.com.mojang.brigadier.context.StringRange;
    getInput(): string;
  }

  interface CodeRender extends BaseEvent {
    readonly cursor: SelectCursor;
    readonly code: string;
    readonly language: string;
    readonly screen: EditorScreen;

    /**
     * you are expected to fill this in with text styling, if not filled, nothing will render
     *  if the code is an empty string, you are still expected to put an empty string as the first line here
     */
    readonly textLines: JavaList<TextHelper>;

    /**
     * you are expected to fill this with suggestions for autocomplete created using
     *  {@link createSuggestion}
     */
    readonly autoCompleteSuggestions: JavaList<AutoCompleteSuggestion>;

    /**
     * you are expected to fill this with a method to create right click actions.
     *  method should be `(index:number) => Map&lt;string,() => void&gt;`,
     *  meaning it accepts a character index and returns a map of names to actions.
     */
    rightClickActions: MethodWrapper<
      number,
      any,
      JavaMap<string, MethodWrapper<any, any, any, any>>,
      any
    >;

    /**
     * @return <a target="_blank" href="https://github.com/noties/Prism4j/blob/75ac3dae6f8eff5b1b0396df3b806f44ce86c484/prism4j/src/main/java/io/noties/prism4j/Prism4j.java#L54">Prism4j's
     *      node list</a> you don't have to use it but if you're not compiling your own...
     *      peek at the code of {@link TextStyleCompiler} for the default impl for walking the node tree.
     */
    genPrismNodes(): JavaList<Packages.io.noties.prism4j.Prism4j$Node>;

    /**
     * Easy access to the {@link Map} object for use with {@link rightClickActions}
     * @return specifically a {@link LinkedHashMap}
     */
    createMap(): JavaMap<any, any>;

    /**
     * more convenient access to TextBuilder
     * @return new instance for use with {@link textLines}
     */
    createTextBuilder(): TextBuilder;
    createSuggestion(
      startIndex: number,
      suggestion: string
    ): AutoCompleteSuggestion;

    /**
     * @param startIndex index that is where the suggestion starts from before the already typed part
     * @param suggestion complete suggestion including the already typed part
     * @param displayText how the text should be displayed in the dropdown, default is suggestion text
     * @return a new suggestion object
     */
    createSuggestion(
      startIndex: number,
      suggestion: string,
      displayText: TextHelper
    ): AutoCompleteSuggestion;

    /**
     * prefix tree data structure written for you, it's a bit intensive to add things to, especially how I wrote it, but
     *  lookup times are much better at least on larger data sets,
     *  so create a single copy of this for your static autocompletes and don't be re-creating this every time, store it
     *  in `globalvars`, probably per language
     *
     *  or just don't use it, I'm not forcing you to.
     * @return a new {@link StringHashTrie}
     */
    createPrefixTree(): StringHashTrie;

    /**
     * @return {@code key -> hex integer} values for theme data points, this can be used with the prism data for
     *      coloring, just have to use {@link TextBuilder#withColor(int, int, int)}
     *      on 1.15 and older versions the integer values with be the default color's index so you can directly pass it
     *      to {@link TextBuilder#withColor(int)}
     */
    getThemeData(): JavaMap<string, number[]>;
  }

  interface Custom extends BaseEvent {
    eventName: string;

    /**
     * Triggers the event.
     *  Try not to cause infinite looping by triggering the same {@link EventCustom} from its own listeners.
     * @since 1.2.8
     */
    trigger(): void;

    /**
     * trigger the event listeners, then run `callback` when they finish.
     * @since 1.3.1
     * @param callback used as a {@link Runnable}, so no args, no return value.
     */
    trigger(callback: MethodWrapper<any, any, any, any>): void;

    /**
     * Triggers the event and waits for it to complete.
     *  In languages with threading issues (js/jep) this may cause circular waiting when triggered from the same thread as
     *  the `jsmacros.on` registration for the event
     * @since 1.2.8
     */
    triggerJoin(): void;

    /**
     * Put an Integer into the event.
     * @param name
     * @param i
     * @return
     * @since 1.2.8
     */
    putInt(name: string, i: number): number;

    /**
     * put a String into the event.
     * @param name
     * @param str
     * @return
     * @since 1.2.8
     */
    putString(name: string, str: string): string;

    /**
     * put a Double into the event.
     * @param name
     * @param d
     * @return
     * @since 1.2.8
     */
    putDouble(name: string, d: number): number;

    /**
     * put a Boolean into the event.
     * @param name
     * @param b
     * @return
     * @since 1.2.8
     */
    putBoolean(name: string, b: boolean): boolean;

    /**
     * put anything else into the event.
     * @param name
     * @param o
     * @return
     * @since 1.2.8
     */
    putObject(name: string, o: any): any;

    /**
     * Returns the type of the defined item in the event as a string.
     * @param name
     * @return
     * @since 1.2.8
     */
    getType(name: string): string;

    /**
     * Gets an Integer from the event.
     * @param name
     * @return
     * @since 1.2.8
     */
    getInt(name: string): number;

    /**
     * Gets a String from the event
     * @param name
     * @return
     * @since 1.2.8
     */
    getString(name: string): string;

    /**
     * Gets a Double from the event.
     * @param name
     * @return
     * @since 1.2.8
     */
    getDouble(name: string): number;

    /**
     * Gets a Boolean from the event.
     * @param name
     * @return
     * @since 1.2.8
     */
    getBoolean(name: string): boolean;

    /**
     * Gets an Object from the event.
     * @param name
     * @return
     * @since 1.2.8
     */
    getObject(name: string): any;

    /**
     * @since 1.6.4
     * @return map backing the event
     */
    getUnderlyingMap(): JavaMap<string, any>;

    /**
     * registers event so you can see it in the gui
     * @since 1.3.0
     */
    registerEvent(): void;
  }

  interface ProfileLoad extends BaseEvent {
    readonly profileName: string;
  }

  interface WrappedScript extends BaseEvent {
    readonly arg1: T;
    readonly arg2: U;
    result: R;

    setReturnBoolean(b: boolean): void;
    setReturnInt(i: number): void;
    setReturnDouble(d: number): void;
    setReturnString(s: string): void;
    setReturnObject(o: any): void;
  }

  interface Service extends BaseEvent {
    readonly serviceName: string;

    /**
     * when this service is stopped, this is run...
     */
    stopListener: MethodWrapper<any, any, any, any>;

    /**
     * Put an Integer into the global variable space.
     * @param name
     * @param i
     * @return
     * @since 1.6.5
     */
    putInt(name: string, i: number): number;

    /**
     * put a String into the global variable space.
     * @param name
     * @param str
     * @return
     * @since 1.6.5
     */
    putString(name: string, str: string): string;

    /**
     * put a Double into the global variable space.
     * @param name
     * @param d
     * @return
     * @since 1.6.5
     */
    putDouble(name: string, d: number): number;

    /**
     * put a Boolean into the global variable space.
     * @param name
     * @param b
     * @return
     * @since 1.6.5
     */
    putBoolean(name: string, b: boolean): boolean;

    /**
     * put anything else into the global variable space.
     * @param name
     * @param o
     * @return
     * @since 1.6.5
     */
    putObject(name: string, o: any): any;

    /**
     * Returns the type of the defined item in the global variable space as a string.
     * @param name
     * @return
     * @since 1.6.5
     */
    getType(name: string): string;

    /**
     * Gets an Integer from the global variable space.
     * @param name
     * @return
     * @since 1.6.5
     */
    getInt(name: string): number;

    /**
     * Gets an Integer from the global variable space. and then increment it there.
     * @param name
     * @return
     * @since 1.6.5
     */
    getAndIncrementInt(name: string): number;

    /**
     * Gets an integer from the global variable pace. and then decrement it there.
     * @param name
     * @return
     * @since 1.6.5
     */
    getAndDecrementInt(name: string): number;

    /**
     * increment an Integer in the global variable space. then return it.
     * @param name
     * @return
     * @since 1.6.5
     */
    incrementAndGetInt(name: string): number;

    /**
     * decrement an Integer in the global variable space. then return it.
     * @param name
     * @return
     * @since 1.6.5
     */
    decrementAndGetInt(name: string): number;

    /**
     * Gets a String from the global variable space
     * @param name
     * @return
     * @since 1.6.5
     */
    getString(name: string): string;

    /**
     * Gets a Double from the global variable space.
     * @param name
     * @return
     * @since 1.6.5
     */
    getDouble(name: string): number;

    /**
     * Gets a Boolean from the global variable space.
     * @param name
     * @return
     * @since 1.6.5
     */
    getBoolean(name: string): boolean;

    /**
     * toggles a global boolean and returns its new value
     * @param name
     * @return
     * @since 1.6.5
     */
    toggleBoolean(name: string): boolean;

    /**
     * Gets an Object from the global variable space.
     * @param name
     * @return
     * @since 1.6.5
     */
    getObject(name: string): any;

    /**
     * removes a key from the global varaible space.
     * @param key
     * @since 1.6.5
     */
    remove(key: string): void;
    getRaw(): JavaMap<string, any>;
  }
}

interface Events {
  AirChange: Events.AirChange;
  ArmorChange: Events.ArmorChange;
  AttackBlock: Events.AttackBlock;
  AttackEntity: Events.AttackEntity;
  BlockUpdate: Events.BlockUpdate;
  Bossbar: Events.Bossbar;
  ChunkLoad: Events.ChunkLoad;
  ChunkUnload: Events.ChunkUnload;
  ClickSlot: Events.ClickSlot;
  Damage: Events.Damage;
  Death: Events.Death;
  DimensionChange: Events.DimensionChange;
  Disconnect: Events.Disconnect;
  DropSlot: Events.DropSlot;
  EntityDamaged: Events.EntityDamaged;
  EntityHealed: Events.EntityHealed;
  EntityLoad: Events.EntityLoad;
  EntityUnload: Events.EntityUnload;
  EXPChange: Events.EXPChange;
  FallFlying: Events.FallFlying;
  Heal: Events.Heal;
  HeldItemChange: Events.HeldItemChange;
  HungerChange: Events.HungerChange;
  InteractBlock: Events.InteractBlock;
  InteractEntity: Events.InteractEntity;
  ItemDamage: Events.ItemDamage;
  ItemPickup: Events.ItemPickup;
  JoinedKey: Events.JoinedKey;
  JoinedTick: Events.JoinedTick;
  JoinServer: Events.JoinServer;
  Key: Events.Key;
  OpenContainer: Events.OpenContainer;
  OpenScreen: Events.OpenScreen;
  PlayerJoin: Events.PlayerJoin;
  PlayerLeave: Events.PlayerLeave;
  RecvMessage: Events.RecvMessage;
  ResourcePackLoaded: Events.ResourcePackLoaded;
  Riding: Events.Riding;
  SendMessage: Events.SendMessage;
  SignEdit: Events.SignEdit;
  Sound: Events.Sound;
  Tick: Events.Tick;
  Title: Events.Title;
  CommandContext: Events.CommandContext;
  CodeRender: Events.CodeRender;
  Custom: Events.Custom;
  ProfileLoad: Events.ProfileLoad;
  WrappedScript: Events.WrappedScript;
  Service: Events.Service;
}

/**
 * Functions for interacting with chat.
 *
 * @author Wagyourtail
 */
declare namespace Chat {
  /**
   * Log to player chat.
   * @since 1.1.3
   * @param message
   */
  function log(message: any): void;

  /**
   * @param message
   * @param await should wait for message to actually be sent to chat to continue.
   * @throws InterruptedException
   */
  function log(message: any, await: boolean): void;

  /**
   * Say to server as player.
   * @since 1.0.0
   * @param message
   */
  function say(message: string): void;

  /**
   * Say to server as player.
   * @param message
   * @param await
   * @since 1.3.1
   * @throws InterruptedException
   */
  function say(message: string, await: boolean): void;

  /**
   * open the chat input box with specific text already typed.
   * @since 1.6.4
   * @param message the message to start the chat screen with
   */
  function open(message: string): void;

  /**
   * open the chat input box with specific text already typed.
   *  hint: you can combine with {@link JsMacros.waitForEvent} or
   *  {@link JsMacros.once} to wait for the chat screen
   *  to close and/or the to wait for the sent message
   * @since 1.6.4
   * @param message the message to start the chat screen with
   * @param await
   */
  function open(message: string, await: boolean): void;

  /**
   * Display a Title to the player.
   * @since 1.2.1
   * @param title
   * @param subtitle
   * @param fadeIn
   * @param remain
   * @param fadeOut
   */
  function title(
    title: any,
    subtitle: any,
    fadeIn: number,
    remain: number,
    fadeOut: number
  ): void;

  /**
   * @since 1.8.1
   * @param text
   */
  function actionbar(text: any): void;

  /**
   * Display the smaller title that's above the actionbar.
   * @since 1.2.1
   * @param text
   * @param tinted
   */
  function actionbar(text: any, tinted: boolean): void;

  /**
   * Display a toast.
   * @since 1.2.5
   * @param title
   * @param desc
   */
  function toast(title: any, desc: any): void;

  /**
   * Creates a {@link TextHelper} for use where you need one and not a string.
   * @since 1.1.3
   * @param content
   * @return a new {@link TextHelper}
   */
  function createTextHelperFromString(content: string): TextHelper;

  /**
   * @since 1.5.2
   * @return
   */
  function getLogger(): Packages.org.slf4j.Logger;

  /**
   * returns a log4j logger, for logging to console only.
   * @since 1.5.2
   * @param name
   * @return
   */
  function getLogger(name: string): Packages.org.slf4j.Logger;

  /**
   * Create a  {@link TextHelper} for use where you need one and not a string.
   * @since 1.1.3
   * @param json
   * @return a new {@link TextHelper TextHelper}
   */
  function createTextHelperFromJSON(json: string): TextHelper;

  /**
   * @since 1.3.0
   * @return a new builder
   */
  function createTextBuilder(): TextBuilder;

  /**
   * @param name name of command
   * @since 1.4.2
   * @return
   * @deprecated
   */
  function createCommandBuilder(name: string): CommandBuilder;

  /**
   * @param name
   * @since 1.6.5
   * @deprecated
   */
  function unregisterCommand(name: string): CommandNodeHelper;

  /**
   * @since 1.6.5
   * @param node
   * @deprecated
   */
  function reRegisterCommand(node: CommandNodeHelper): void;

  /**
   * @since 1.7.0
   * @return
   */
  function getCommandManager(): CommandManager;

  /**
   * @since 1.7.0
   * @return
   */
  function getHistory(): ChatHistoryManager;

  /**
   * @param string
   * @since 1.6.5
   * @return &#167; -> &amp;
   */
  function sectionSymbolToAmpersand(string: string): string;

  /**
   * @param string
   * @since 1.6.5
   * @return &amp; -> &#167;
   */
  function ampersandToSectionSymbol(string: string): string;

  /**
   * @param string
   * @since 1.6.5
   * @return
   */
  function stripFormatting(string: string): string;
}

/**
 * Functions that interact with minecraft that don't fit into their own module.
 *
 * @author Wagyourtail
 * @since 1.2.9
 */
declare namespace Client {
  /**
   * @since 1.0.0 (was in the {@code jsmacros} library until 1.2.9)
   * @return the raw minecraft client class, it may be useful to use <a target="_blank" href="https://wagyourtail.xyz/Projects/Minecraft%20Mappings%20Viewer/App">Minecraft Mappings Viewer</a> for this.
   */
  function getMinecraft(): /* minecraft class */ any;

  /**
   * Run your task on the main minecraft thread
   * @param runnable task to run
   * @since 1.4.0
   */
  function runOnMainThread(runnable: MethodWrapper<any, any, any, any>): void;

  /**
   * @since 1.6.5
   * @param runnable
   * @param watchdogMaxTime max time for the watchdog to wait before killing the script
   */
  function runOnMainThread(
    runnable: MethodWrapper<any, any, any, any>,
    watchdogMaxTime: number
  ): void;

  /**
   * @since 1.1.7 (was in the {@code jsmacros} library until 1.2.9)
   * @return an {@link OptionsHelper OptionsHelper} for the game options.
   */
  function getGameOptions(): OptionsHelper;

  /**
   * @return the current minecraft version as a {@link java.lang.String String}.
   * @since 1.1.2 (was in the {@code jsmacros} library until 1.2.9)
   */
  function mcVersion(): string;

  /**
   * @since 1.2.0 (was in the {@code jsmacros} library until 1.2.9)
   * @return the fps debug string from minecraft.
   */
  function getFPS(): string;

  /**
   * Join singleplayer world
   * @since 1.6.6
   * @param folderName
   */
  function loadWorld(folderName: string): void;

  /**
   * @since 1.2.3 (was in the {@code jsmacros} library until 1.2.9)
   * @param ip
   */
  function connect(ip: string): void;

  /**
   * Connect to a server
   * @since 1.2.3 (was in the {@code jsmacros} library until 1.2.9)
   * @param ip
   * @param port
   */
  function connect(ip: string, port: number): void;

  /** @since 1.2.3 (was in the {@code jsmacros} library until 1.2.9) */
  function disconnect(): void;

  /**
   * Disconnect from a server with callback.
   * @since 1.2.3 (was in the {@code jsmacros} library until 1.2.9)
   *
   *  {@code callback} defaults to {@code null}
   * @param callback calls your method as a {@link java.util.function.Consumer Consumer}&lt;{@link java.lang.Boolean Boolean}&gt;
   */
  function disconnect(callback: MethodWrapper<boolean, any, any, any>): void;

  /**
   * Closes the client (stops the game).
   *  Waits until the game has stopped, meaning no further code is executed (for obvious reasons).
   *  Warning: this does not wait on joined threads, so your script may stop at an undefined point.
   * @since 1.6.0
   */
  function shutdown(): void;

  /**
   * @since 1.2.4
   * @throws InterruptedException
   */
  function waitTick(): void;

  /**
   * waits the specified number of client ticks.
   *  don't use this on an event that the main thread waits on (joins)... that'll cause circular waiting.
   * @since 1.2.6
   * @param i
   * @throws InterruptedException
   */
  function waitTick(i: number): void;

  /**
   * @param ip
   * @return
   * @since 1.6.5
   * @throws UnknownHostException
   * @throws InterruptedException
   */
  function ping(ip: string): ServerInfoHelper;

  /**
   * @param ip
   * @param callback
   * @since 1.6.5
   * @throws UnknownHostException
   */
  function pingAsync(
    ip: string,
    callback: MethodWrapper<
      ServerInfoHelper,
      Packages.java.io.IOException,
      any,
      any
    >
  ): void;

  /** @since 1.6.5 */
  function cancelAllPings(): void;
}

/**
 * Functions for displaying stuff in 2 to 3 dimensions
 *
 * @since 1.0.5
 * @author Wagyourtail
 */
declare namespace Hud {
  /**
   * @since 1.0.5
   * @param title
   * @param dirtBG boolean of whether to use a dirt background or not.
   * @return a new {@link IScreen IScreen} Object.
   */
  function createScreen(title: string, dirtBG: boolean): ScriptScreen;

  /**
   * Opens a {@link IScreen} Object.
   * @since 1.0.5
   * @param s
   */
  function openScreen(s: IScreen): void;

  /**
   * @since 1.2.7
   * @return the currently open Screen as an {@link IScreen IScreen}
   */
  function getOpenScreen(): IScreen;

  /**
   * @since 1.0.5, renamed from {@code getOpenScreen} in 1.2.7
   * @return The name of the currently open screen.
   */
  function getOpenScreenName(): ScreenName;

  /**
   * @since 1.1.2
   * @return a {@link java.lang.Boolean boolean} denoting if the currently open screen is a container.
   */
  function isContainer(): boolean;

  /**
   * @since 1.0.5
   * @return
   */
  function createDraw2D(): Draw2D;

  /**
   * @since 1.0.5
   *
   *  Registers an {@link IDraw2D IDraw2D} to be rendered.
   * @deprecated since 1.6.5, use {@link Draw2D#register()} instead.
   * @param overlay
   */
  function registerDraw2D(overlay: IDraw2D<Draw2D>): void;

  /**
   * @since 1.0.5
   *
   *  Unregisters an {@link IDraw2D IDraw2D} to stop it being rendered.
   * @deprecated since 1.6.5, use {@link Draw2D#unregister()} instead.
   * @param overlay
   */
  function unregisterDraw2D(overlay: IDraw2D<Draw2D>): void;

  /**
   * @since 1.0.5
   * @return A list of current {@link IDraw2D IDraw2Ds}.
   */
  function listDraw2Ds(): JavaList<IDraw2D<Draw2D>>;

  /**
   * @since 1.0.5
   *
   *  clears the Draw2D render list.
   */
  function clearDraw2Ds(): void;

  /**
   * @since 1.0.6
   * @return a new {@link Draw3D Draw3D}.
   */
  function createDraw3D(): Draw3D;

  /**
   * @since 1.0.6
   *
   *  Registers an {@link Draw3D Draw3D} to be rendered.
   * @deprecated since 1.6.5 use {@link Draw3D#register()} instead.
   * @param draw
   */
  function registerDraw3D(draw: Draw3D): void;

  /**
   * @since 1.0.6
   *
   *  Unregisters an {@link Draw3D Draw3D} to stop it being rendered.
   * @since 1.6.5 use {@link Draw3D#unregister()} instead.
   * @param draw
   * @deprecated
   */
  function unregisterDraw3D(draw: Draw3D): void;

  /**
   * @since 1.0.6
   * @return A list of current {@link Draw3D Draw3D}.
   */
  function listDraw3Ds(): JavaList<Draw3D>;

  /**
   * @since 1.0.6
   *
   *  clears the Draw2D render list.
   */
  function clearDraw3Ds(): void;

  /**
   * @since 1.1.3
   * @return the current X coordinate of the mouse
   */
  function getMouseX(): number;

  /**
   * @since 1.1.3
   * @return the current Y coordinate of the mouse
   */
  function getMouseY(): number;
}

/**
 * Functions for getting and modifying key pressed states.
 *
 * @author Wagyourtail
 */
declare namespace KeyBind {
  /**
   * Dont use this one... get the raw minecraft keycode class.
   * @param keyName
   * @return the raw minecraft keycode class
   */
  function getKeyCode(keyName: Key): /* minecraft class */ any;

  /**
   * @since 1.2.2
   * @return A {@link java.util.Map Map} of all the minecraft keybinds.
   */
  function getKeyBindings(): JavaMap<Bind, Key>;

  /**
   * Sets a minecraft keybind to the specified key.
   * @since 1.2.2
   * @param bind
   * @param key
   */
  function setKeyBind(bind: Bind, key: Key): void;

  /**
   * Set a key-state for a key.
   * @param keyName
   * @param keyState
   */
  function key(keyName: Key, keyState: boolean): void;

  /**
   * Set a key-state using the name of the keybind rather than the name of the key.
   *
   *  This is probably the one you should use.
   * @since 1.2.2
   * @param keyBind
   * @param keyState
   */
  function keyBind(keyBind: Bind, keyState: boolean): void;

  /**
   * @since 1.2.6 (turned into set instead of list in 1.6.5)
   * @return a set of currently pressed keys.
   */
  function getPressedKeys(): JavaSet<Key>;
}

/**
 * Functions for getting and modifying the player's state.
 *
 * @author Wagyourtail
 */
declare namespace Player {
  /**
   * @return the Inventory handler
   */
  function openInventory(): Inventory<any>;

  /**
   * @return the player entity wrapper.
   * @since 1.0.3
   */
  function getPlayer(): ClientPlayerEntityHelper;

  /**
   * @return the player's current gamemode.
   * @since 1.0.9
   */
  function getGameMode(): Gamemode;

  /**
   * @param distance
   * @param fluid
   * @return the block/liquid the player is currently looking at.
   * @since 1.0.5
   */
  function rayTraceBlock(distance: number, fluid: boolean): BlockDataHelper;

  /**
   * @return the entity the camera is currently looking at.
   * @since 1.0.5
   */
  function rayTraceEntity(): EntityHelper;

  /**
   * @param distance
   * @since 1.8.3
   * @return entity the player entity is currently looking at (if any).
   */
  function rayTraceEntity(distance: number): EntityHelper;

  /**
   * Write to a sign screen if a sign screen is currently open.
   * @param l1
   * @param l2
   * @param l3
   * @param l4
   * @return of success.
   * @since 1.2.2
   */
  function writeSign(l1: string, l2: string, l3: string, l4: string): boolean;

  /**
   * @param folder
   * @param callback calls your method as a {@link Consumer}&lt;{@link TextHelper}&gt;
   * @since 1.2.6
   */
  function takeScreenshot(
    folder: string,
    callback: MethodWrapper<TextHelper, any, any, any>
  ): void;
  function getStatistics(): StatsHelper;

  /**
   * Take a screenshot and save to a file.
   *
   *  `file` is the optional one, typescript doesn't like it not being the last one that's optional
   * @param folder
   * @param file
   * @param callback calls your method as a {@link Consumer}&lt;{@link TextHelper}&gt;
   * @since 1.2.6
   */
  function takeScreenshot(
    folder: string,
    file: string,
    callback: MethodWrapper<TextHelper, any, any, any>
  ): void;

  /**
   * Creates a new PlayerInput object.
   * @since 1.4.0
   */
  function createPlayerInput(): PlayerInput;

  /**
   * Creates a new PlayerInput object.
   * @since 1.4.0
   */
  function createPlayerInput(
    movementForward: number,
    movementSideways: number,
    yaw: number
  ): PlayerInput;

  /**
   * Creates a new PlayerInput object.
   * @since 1.4.0
   */
  function createPlayerInput(
    movementForward: number,
    yaw: number,
    jumping: boolean,
    sprinting: boolean
  ): PlayerInput;

  /**
   * Creates a new PlayerInput object.
   * @param movementForward 1 = forward input (W); 0 = no input; -1 = backward input (S)
   * @param movementSideways 1 = left input (A); 0 = no input; -1 = right input (D)
   * @param yaw yaw of the player
   * @param pitch pitch of the player
   * @param jumping jump input
   * @param sneaking sneak input
   * @param sprinting sprint input
   * @since 1.4.0
   */
  function createPlayerInput(
    movementForward: number,
    movementSideways: number,
    yaw: number,
    pitch: number,
    jumping: boolean,
    sneaking: boolean,
    sprinting: boolean
  ): PlayerInput;

  /**
   * Parses each row of CSV string into a `PlayerInput`.
   *  The capitalization of the header matters.<br>
   *  About the columns:
   *  <ul>
   *    <li> `movementForward` and `movementSideways` as a number</li>
   *    <li>`yaw` and `pitch` as an absolute number</li>
   *    <li>`jumping`, `sneaking` and `sprinting` have to be boolean</li>
   *  </ul>
   *
   *  The separation must be a "," it's a csv...(but spaces don't matter)<br>
   *  Quoted values don't work
   * @param csv CSV string to be parsed
   * @since 1.4.0
   */
  function createPlayerInputsFromCsv(csv: string): JavaList<PlayerInput>;

  /**
   * Parses a JSON string into a `PlayerInput` Object
   *  For details see `PlayerInput.fromCsv()`, on what has to be present.<br>
   *  Capitalization of the keys matters.
   * @param json JSON string to be parsed
   * @return The JSON parsed into a {@code PlayerInput}
   * @since 1.4.0
   */
  function createPlayerInputsFromJson(json: string): PlayerInput;

  /**
   * Creates a new `PlayerInput` object with the current inputs of the player.
   * @since 1.4.0
   */
  function getCurrentPlayerInput(): PlayerInput;

  /**
   * Adds a new `PlayerInput` to `MovementQueue` to be executed
   * @param input the PlayerInput to be executed
   * @since 1.4.0
   */
  function addInput(input: PlayerInput): void;

  /**
   * Adds multiple new `PlayerInput` to `MovementQueue` to be executed
   * @param inputs the PlayerInputs to be executed
   * @since 1.4.0
   */
  function addInputs(inputs: PlayerInput[]): void;

  /**
   * Clears all inputs in the `MovementQueue`
   * @since 1.4.0
   */
  function clearInputs(): void;
  function setDrawPredictions(val: boolean): void;

  /**
   * Predicts where one tick with a `PlayerInput` as input would lead to.
   * @param input the PlayerInput for the prediction
   * @return the position after the input
   * @since 1.4.0
   */
  function predictInput(input: PlayerInput): PositionCommon$Pos3D;

  /**
   * Predicts where one tick with a `PlayerInput` as input would lead to.
   * @param input the PlayerInput for the prediction
   * @param draw whether to visualize the result or not
   * @return the position after the input
   * @since 1.4.0
   */
  function predictInput(
    input: PlayerInput,
    draw: boolean
  ): PositionCommon$Pos3D;

  /**
   * Predicts where each `PlayerInput` executed in a row would lead
   *  without drawing it.
   * @param inputs the PlayerInputs for each tick for the prediction
   * @return the position after each input
   * @since 1.4.0
   */
  function predictInputs(inputs: PlayerInput[]): JavaList<PositionCommon$Pos3D>;

  /**
   * @since 1.8.0
   * @return
   */
  function isBreakingBlock(): boolean;

  /**
   * Predicts where each `PlayerInput` executed in a row would lead
   * @param inputs the PlayerInputs for each tick for the prediction
   * @param draw whether to visualize the result or not
   * @return the position after each input
   * @since 1.4.0
   */
  function predictInputs(
    inputs: PlayerInput[],
    draw: boolean
  ): JavaList<PositionCommon$Pos3D>;

  /**
   * Adds a forward movement with a relative yaw value to the MovementQueue.
   * @param yaw the relative yaw for the player
   * @since 1.4.0
   */
  function moveForward(yaw: number): void;

  /**
   * Adds a backward movement with a relative yaw value to the MovementQueue.
   * @param yaw the relative yaw for the player
   * @since 1.4.0
   */
  function moveBackward(yaw: number): void;

  /**
   * Adds sideways movement with a relative yaw value to the MovementQueue.
   * @param yaw the relative yaw for the player
   * @since 1.4.2
   */
  function moveStrafeLeft(yaw: number): void;

  /**
   * Adds sideways movement with a relative yaw value to the MovementQueue.
   * @param yaw the relative yaw for the player
   * @since 1.4.2
   */
  function moveStrafeRight(yaw: number): void;
}

/**
 * position helper classes
 * @since 1.6.3
 */
declare namespace PositionCommon {
  /**
   * create a new vector object
   * @since 1.6.3
   * @param x1
   * @param y1
   * @param z1
   * @param x2
   * @param y2
   * @param z2
   * @return
   */
  function createVec(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
  ): PositionCommon$Vec3D;

  /**
   * @since 1.6.3
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   * @return
   */
  function createVec(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): PositionCommon$Vec2D;

  /**
   * @since 1.6.3
   * @param x
   * @param y
   * @param z
   * @return
   */
  function createPos(x: number, y: number, z: number): PositionCommon$Pos3D;

  /**
   * @since 1.6.3
   * @param x
   * @param y
   * @return
   */
  function createPos(x: number, y: number): PositionCommon$Pos2D;
}

/**
 * Functions for getting and using world data.
 *
 * @author Wagyourtail
 */
declare namespace World {
  /**
   * returns whether a world is currently loaded
   * @since 1.3.0
   * @return
   */
  function isWorldLoaded(): boolean;

  /**
   * @return players within render distance.
   */
  function getLoadedPlayers(): JavaList<PlayerEntityHelper>;

  /**
   * @return players on the tablist.
   */
  function getPlayers(): JavaList<PlayerListEntryHelper>;

  /**
   * @param x
   * @param y
   * @param z
   * @return The block at that position.
   */
  function getBlock(x: number, y: number, z: number): BlockDataHelper;
  function getBlock(pos: PositionCommon$Pos3D): BlockDataHelper;
  function getBlock(pos: BlockPosHelper): BlockDataHelper;

  /**
   * Usage: <br>
   *  This will return all blocks that are facing south, don't require a tool to break,
   *  have a hardness of 10 or less and whose name contains either chest or barrel.
   *  ```
   *  World.getWorldScanner()
   *      .withBlockFilter("getHardness").is("<=", 10)
   *      .andStringBlockFilter().contains("chest", "barrel")
   *      .withStringStateFilter().contains("facing=south")
   *      .andStateFilter("isToolRequired").is(false)
   *      .build()
   *  ```
   * @return a builder to create a WorldScanner
   * @since 1.6.5
   */
  function getWorldScanner(): WorldScannerBuilder;

  /**
   * @return a scanner for the current world
   * @since 1.6.5
   */
  function getWorldScanner(
    blockFilter: MethodWrapper<BlockHelper, any, boolean, any>,
    stateFilter: MethodWrapper<BlockStateHelper, any, boolean, any>
  ): WorldScanner;

  /**
   * @since 1.6.4
   * @param id
   * @param chunkrange
   * @return
   */
  function findBlocksMatching(
    centerX: number,
    centerZ: number,
    id: BlockId,
    chunkrange: number
  ): JavaList<PositionCommon$Pos3D>;

  /**
   * @since 1.6.4
   * @param id
   * @param chunkrange
   * @return
   */
  function findBlocksMatching(
    id: BlockId,
    chunkrange: number
  ): JavaList<PositionCommon$Pos3D>;

  /**
   * @since 1.6.4
   * @param ids
   * @param chunkrange
   * @return
   */
  function findBlocksMatching(
    ids: BlockId[],
    chunkrange: number
  ): JavaList<PositionCommon$Pos3D>;

  /**
   * @since 1.6.4
   * @param centerX
   * @param centerZ
   * @param ids
   * @param chunkrange
   * @return
   */
  function findBlocksMatching(
    centerX: number,
    centerZ: number,
    ids: BlockId[],
    chunkrange: number
  ): JavaList<PositionCommon$Pos3D>;

  /**
   * @since 1.6.4
   * @param blockFilter
   * @param stateFilter
   * @param chunkrange
   * @return
   */
  function findBlocksMatching(
    blockFilter: MethodWrapper<BlockHelper, any, boolean, any>,
    stateFilter: MethodWrapper<BlockStateHelper, any, boolean, any>,
    chunkrange: number
  ): JavaList<PositionCommon$Pos3D>;

  /**
   * @since 1.6.4
   * @param chunkX
   * @param chunkZ
   * @param blockFilter
   * @param stateFilter
   * @param chunkrange
   * @return
   */
  function findBlocksMatching(
    chunkX: number,
    chunkZ: number,
    blockFilter: MethodWrapper<BlockHelper, any, boolean, any>,
    stateFilter: MethodWrapper<BlockStateHelper, any, boolean, any>,
    chunkrange: number
  ): JavaList<PositionCommon$Pos3D>;

  /**
   * @since 1.2.9
   * @return a helper for the scoreboards provided to the client.
   */
  function getScoreboards(): ScoreboardsHelper;

  /**
   * @return all entities in the render distance.
   */
  function getEntities(): JavaList<EntityHelper>;

  /**
   * raytrace between two points returning the first block hit.
   * @since 1.6.5
   * @param x1
   * @param y1
   * @param z1
   * @param x2
   * @param y2
   * @param z2
   * @param fluid
   * @return
   */
  function rayTraceBlock(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number,
    fluid: boolean
  ): BlockDataHelper;

  /**
   * raytrace between two points returning the first entity hit.
   * @since 1.8.3
   * @param x1
   * @param y1
   * @param z1
   * @param x2
   * @param y2
   * @param z2
   * @return
   */
  function rayTraceEntity(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
  ): EntityHelper;

  /**
   * @since 1.1.2
   * @return the current dimension.
   */
  function getDimension(): Dimension;

  /**
   * @since 1.1.5
   * @return the current biome.
   */
  function getBiome(): Biome;

  /**
   * @since 1.1.5
   * @return the current world time.
   */
  function getTime(): number;

  /**
   * This is supposed to be time of day, but it appears to be the same as {@link World.getTime} to me...
   * @since 1.1.5
   * @return the current world time of day.
   */
  function getTimeOfDay(): number;

  /**
   * @since 1.2.6
   * @return respawn position.
   */
  function getRespawnPos(): BlockPosHelper;

  /**
   * @since 1.2.6
   * @return world difficulty as an {@link java.lang.Integer Integer}.
   */
  function getDifficulty(): Difficulty;

  /**
   * @since 1.2.6
   * @return moon phase as an {@link java.lang.Integer Integer}.
   */
  function getMoonPhase(): number;

  /**
   * @since 1.1.2
   * @param x
   * @param y
   * @param z
   * @return sky light as an {@link java.lang.Integer Integer}.
   */
  function getSkyLight(x: number, y: number, z: number): number;

  /**
   * @since 1.1.2
   * @param x
   * @param y
   * @param z
   * @return block light as an {@link java.lang.Integer Integer}.
   */
  function getBlockLight(x: number, y: number, z: number): number;

  /**
   * plays a sound file using javax's sound stuff.
   * @since 1.1.7
   * @param file
   * @param volume
   * @return
   * @throws LineUnavailableException
   * @throws IOException
   * @throws UnsupportedAudioFileException
   */
  function playSoundFile(
    file: string,
    volume: number
  ): Packages.javax.sound.sampled.Clip;

  /**
   * @since 1.1.7
   * @param id
   */
  function playSound(id: string): void;

  /**
   * @since 1.1.7
   * @param id
   * @param volume
   */
  function playSound(id: string, volume: number): void;

  /**
   * @since 1.1.7
   * @param id
   * @param volume
   * @param pitch
   */
  function playSound(id: string, volume: number, pitch: number): void;

  /**
   * plays a minecraft sound using the internal system.
   * @since 1.1.7
   * @param id
   * @param volume
   * @param pitch
   * @param x
   * @param y
   * @param z
   */
  function playSound(
    id: string,
    volume: number,
    pitch: number,
    x: number,
    y: number,
    z: number
  ): void;

  /**
   * @since 1.2.1
   * @return a map of boss bars by the boss bar's UUID.
   */
  function getBossBars(): JavaMap<string, BossBarHelper>;

  /**
   * Check whether a chunk is within the render distance and loaded.
   * @since 1.2.2
   * @param chunkX
   * @param chunkZ
   * @return
   */
  function isChunkLoaded(chunkX: number, chunkZ: number): boolean;

  /**
   * @since 1.2.2
   * @return the current server address as a string ({@code server.address/server.ip:port}).
   */
  function getCurrentServerAddress(): string;

  /**
   * @since 1.2.2 [Citation Needed]
   * @param x
   * @param z
   * @return biome at specified location, only works if the block/chunk is loaded.
   */
  function getBiomeAt(x: number, z: number): Biome;

  /**
   * @since 1.2.7
   * @return best attempt to measure and give the server tps with various timings.
   */
  function getServerTPS(): string;

  /**
   * @since 1.3.1
   * @return text helper for the top part of the tab list (above the players)
   */
  function getTabListHeader(): TextHelper;

  /**
   * @since 1.3.1
   * @return text helper for the bottom part of the tab list (below the players)
   */
  function getTabListFooter(): TextHelper;

  /**
   * @since 1.2.7
   * @return best attempt to measure and give the server tps.
   */
  function getServerInstantTPS(): number;

  /**
   * @since 1.2.7
   * @return best attempt to measure and give the server tps over the previous 1 minute average.
   */
  function getServer1MAverageTPS(): number;

  /**
   * @since 1.2.7
   * @return best attempt to measure and give the server tps over the previous 5 minute average.
   */
  function getServer5MAverageTPS(): number;

  /**
   * @since 1.2.7
   * @return best attempt to measure and give the server tps over the previous 15 minute average.
   */
  function getServer15MAverageTPS(): number;
}

/**
 * {@link FunctionalInterface} implementation for wrapping methods to match the language spec.
 *  <br><br>
 *  <br><br>
 *  Javascript:
 *  language spec requires that only one thread can hold an instance of the language at a time,
 *  so this implementation uses a non-preemptive priority queue for the threads that call the resulting {@link MethodWrapper}.
 *  <br><br>
 *  JEP:
 *  language spec requires everything to be on the same thread, on the java end, so all calls to {@link MethodWrapper}
 *  call back to JEP's starting thread and wait for the call to complete.
 *  <br><br>
 *  Jython:
 *  no limitations
 *  <br><br>
 *  LUA:
 *  no limitations
 * @since 1.2.5, re-named from {@code consumer} in 1.3.2
 * @author Wagyourtail
 */
declare namespace JavaWrapper {
  /**
   * @since 1.4.0
   * @param c
   * @return a new {@link MethodWrapper MethodWrapper}
   */
  function methodToJava<A, B, R>(
    c: (arg0?: A, arg1?: B) => R | void
  ): MethodWrapper<A, B, R, any>;

  /**
   * @since 1.4.0
   * @param c
   * @return a new {@link MethodWrapper MethodWrapper}
   */
  function methodToJavaAsync<A, B, R>(
    c: (arg0?: A, arg1?: B) => R | void
  ): MethodWrapper<A, B, R, any>;

  /**
   * JS/JEP ONLY
   *  allows you to set the position of the thread in the queue. you can use this for return value one's too...
   * @since 1.8.0
   * @param priority
   * @param c
   * @return
   * @param <A>
   * @param <B>
   * @param <R>
   */
  function methodToJavaAsync<A, B, R>(
    priority: number,
    c: (arg0?: A, arg1?: B) => R | void
  ): MethodWrapper<A, B, R, any>;

  /**
   * JS/JEP only, puts current task at end of queue.
   *  use with caution, don't accidentally cause circular waiting.
   * @throws InterruptedException
   * @since 1.4.0 [citation needed]
   */
  function deferCurrentTask(): void;

  /**
   * JS/JEP only, puts current task at end of queue.
   *  use with caution, don't accidentally cause circular waiting.
   * @since 1.8.0
   * @throws InterruptedException
   * @param priorityAdjust the amount to adjust the priority by
   */
  function deferCurrentTask(priorityAdjust: number): void;

  /**
   * JS/JEP only, get priority of current task.
   * @throws InterruptedException
   * @since 1.8.0
   */
  function getCurrentPriority(): number;

  /**
   * Close the current context
   * @since 1.2.2
   */
  function stop(): void;
}

/**
 * Better File-System functions.
 *
 * @since 1.1.8
 * @author Wagyourtail
 */
declare namespace FS {
  /**
   * List files in path.
   * @since 1.1.8
   * @param path relative to the script's folder.
   * @return An array of file names as {@link java.lang.String Strings}.
   */
  function list(path: string): string[];

  /**
   * Check if a file exists.
   * @since 1.1.8
   * @param path relative to the script's folder.
   * @return
   */
  function exists(path: string): boolean;

  /**
   * Check if a file is a directory.
   * @since 1.1.8
   * @param path relative to the script's folder.
   * @return
   */
  function isDir(path: string): boolean;

  /**
   * Get the last part (name) of a file.
   * @since 1.1.8
   * @param path relative to the script's folder.
   * @return a {@link java.lang.String String} of the file name.
   */
  function getName(path: string): string;

  /**
   * Make a directory.
   * @since 1.1.8
   * @param path relative to the script's folder.
   * @return a {@link java.lang.Boolean boolean} for success.
   */
  function makeDir(path: string): boolean;

  /**
   * Move a file.
   * @since 1.1.8
   * @param from relative to the script's folder.
   * @param to relative to the script's folder.
   * @throws IOException
   */
  function move(from: string, to: string): void;

  /**
   * Copy a file.
   * @since 1.1.8
   * @param from relative to the script's folder.
   * @param to relative to the script's folder.
   * @throws IOException
   */
  function copy(from: string, to: string): void;

  /**
   * Delete a file.
   * @since 1.2.9
   * @param path relative to the script's folder.
   * @return a {@link java.lang.Boolean boolean} for success.
   */
  function unlink(path: string): boolean;

  /**
   * Combine 2 paths.
   * @since 1.1.8
   * @param patha path is relative to the script's folder.
   * @param pathb
   * @return a {@link java.lang.String String} of the combined path.
   * @throws IOException
   */
  function combine(patha: string, pathb: string): string;

  /**
   * Gets the directory part of a file path, or the parent directory of a folder.
   * @since 1.1.8
   * @param path relative to the script's folder.
   * @return a {@link java.lang.String String} of the combined path.
   * @throws IOException
   */
  function getDir(path: string): string;

  /**
   * Open a FileHandler for the file at the specified path.
   * @since 1.1.8
   * @param path relative to the script's folder.
   * @return a {@link FileHandler FileHandler} for the file path.
   */
  function open(path: string): FileHandler;
}

/**
 * "Global" variables for passing to other contexts.
 *
 * @author Wagyourtail
 * @since 1.0.4
 */
declare namespace GlobalVars {
  /**
   * Put an Integer into the global variable space.
   * @param name
   * @param i
   * @return
   * @since 1.0.4
   */
  function putInt(name: string, i: number): number;

  /**
   * put a String into the global variable space.
   * @param name
   * @param str
   * @return
   * @since 1.0.4
   */
  function putString(name: string, str: string): string;

  /**
   * put a Double into the global variable space.
   * @param name
   * @param d
   * @return
   * @since 1.0.8
   */
  function putDouble(name: string, d: number): number;

  /**
   * put a Boolean into the global variable space.
   * @param name
   * @param b
   * @return
   * @since 1.1.7
   */
  function putBoolean(name: string, b: boolean): boolean;

  /**
   * put anything else into the global variable space.
   * @param name
   * @param o
   * @return
   * @since 1.1.7
   */
  function putObject(name: string, o: any): any;

  /**
   * Returns the type of the defined item in the global variable space as a string.
   * @param name
   * @return
   * @since 1.0.4
   */
  function getType(name: string): string;

  /**
   * Gets an Integer from the global variable space.
   * @param name
   * @return
   * @since 1.0.4
   */
  function getInt(name: string): number;

  /**
   * Gets an Integer from the global variable space. and then increment it there.
   * @param name
   * @return
   * @since 1.6.5
   */
  function getAndIncrementInt(name: string): number;

  /**
   * Gets an integer from the global variable pace. and then decrement it there.
   * @param name
   * @return
   * @since 1.6.5
   */
  function getAndDecrementInt(name: string): number;

  /**
   * increment an Integer in the global variable space. then return it.
   * @param name
   * @return
   * @since 1.6.5
   */
  function incrementAndGetInt(name: string): number;

  /**
   * decrement an Integer in the global variable space. then return it.
   * @param name
   * @return
   * @since 1.6.5
   */
  function decrementAndGetInt(name: string): number;

  /**
   * Gets a String from the global variable space
   * @param name
   * @return
   * @since 1.0.4
   */
  function getString(name: string): string;

  /**
   * Gets a Double from the global variable space.
   * @param name
   * @return
   * @since 1.0.8
   */
  function getDouble(name: string): number;

  /**
   * Gets a Boolean from the global variable space.
   * @param name
   * @return
   * @since 1.1.7
   */
  function getBoolean(name: string): boolean;

  /**
   * toggles a global boolean and returns its new value
   * @param name
   * @return
   * @since 1.6.5
   */
  function toggleBoolean(name: string): boolean;

  /**
   * Gets an Object from the global variable space.
   * @param name
   * @return
   * @since 1.1.7
   */
  function getObject(name: string): any;

  /**
   * removes a key from the global varaible space.
   * @param key
   * @since 1.2.0
   */
  function remove(key: string): void;
  function getRaw(): JavaMap<string, any>;
}

/**
 * Functions that interact directly with JsMacros or Events.
 *
 * @author Wagyourtail
 */
declare namespace JsMacros {
  /**
   * @return the JsMacros profile class.
   */
  function getProfile(): BaseProfile;

  /**
   * @return the JsMacros config management class.
   */
  function getConfig(): ConfigManager;

  /**
   * services are background scripts designed to run full time and are mainly noticed by their side effects.
   * @since 1.6.3
   * @return for managing services.
   */
  function getServiceManager(): ServiceManager;

  /**
   * @return list of non-garbage-collected ScriptContext's
   * @since 1.4.0
   */
  function getOpenContexts(): JavaList<BaseScriptContext<any>>;

  /**
   * @since 1.1.5
   * @param file
   * @return
   */
  function runScript(file: string): EventContainer<any>;

  /**
   * @since 1.6.3
   * @param file
   * @param fakeEvent you probably actually want to pass an instance created by {@link createCustomEvent}
   * @return
   */
  function runScript(
    file: string,
    fakeEvent: Events.BaseEvent
  ): EventContainer<any>;

  /**
   * runs a script with a eventCustom to be able to pass args
   * @since 1.6.3 (1.1.5 - 1.6.3 didn't have fakeEvent)
   * @param file
   * @param fakeEvent
   * @param callback
   * @return container the script is running on.
   */
  function runScript(
    file: string,
    fakeEvent: Events.BaseEvent,
    callback: MethodWrapper<Packages.java.lang.Throwable, any, any, any>
  ): EventContainer<any>;

  /**
   * @since 1.2.4
   * @param language
   * @param script
   * @return
   */
  function runScript(language: string, script: string): EventContainer<any>;

  /**
   * Runs a string as a script.
   * @since 1.2.4
   * @param language
   * @param script
   * @param callback calls your method as a {@link java.util.function.Consumer Consumer}&lt;{@link String}&gt;
   * @return the {@link EventContainer} the script is running on.
   */
  function runScript(
    language: string,
    script: string,
    callback: MethodWrapper<Packages.java.lang.Throwable, any, any, any>
  ): EventContainer<any>;

  /**
   * @since 1.6.0
   * @param language
   * @param script
   * @param file
   * @param callback
   * @return
   */
  function runScript(
    language: string,
    script: string,
    file: string,
    callback: MethodWrapper<Packages.java.lang.Throwable, any, any, any>
  ): EventContainer<any>;

  /**
   * @since 1.7.0
   * @param language
   * @param script
   * @param file
   * @param event
   * @param callback
   * @return
   */
  function runScript(
    language: string,
    script: string,
    file: string,
    event: Events.BaseEvent,
    callback: MethodWrapper<Packages.java.lang.Throwable, any, any, any>
  ): EventContainer<any>;

  /**
   * @since 1.7.0
   * @param file
   * @return
   * @param <T>
   * @param <U>
   * @param <R>
   */
  function wrapScriptRun<T, U, R>(file: string): MethodWrapper<T, U, R, any>;

  /**
   * @since 1.7.0
   * @param language
   * @param script
   * @return
   * @param <T>
   * @param <U>
   * @param <R>
   */
  function wrapScriptRun<T, U, R>(
    language: string,
    script: string
  ): MethodWrapper<T, U, R, any>;

  /**
   * @since 1.7.0
   * @param language
   * @param script
   * @param file
   * @return
   * @param <T>
   * @param <U>
   * @param <R>
   */
  function wrapScriptRun<T, U, R>(
    language: string,
    script: string,
    file: string
  ): MethodWrapper<T, U, R, any>;

  /**
   * @since 1.7.0
   * @param file
   * @return
   * @param <T>
   * @param <U>
   * @param <R>
   */
  function wrapScriptRunAsync<T, U, R>(
    file: string
  ): MethodWrapper<T, U, R, any>;

  /**
   * @since 1.7.0
   * @param language
   * @param script
   * @return
   * @param <T>
   * @param <U>
   * @param <R>
   */
  function wrapScriptRunAsync<T, U, R>(
    language: string,
    script: string
  ): MethodWrapper<T, U, R, any>;

  /**
   * @since 1.7.0
   * @param language
   * @param script
   * @param file
   * @return
   * @param <T>
   * @param <U>
   * @param <R>
   */
  function wrapScriptRunAsync<T, U, R>(
    language: string,
    script: string,
    file: string
  ): MethodWrapper<T, U, R, any>;

  /**
   * Opens a file with the default system program.
   * @since 1.1.8
   * @param path relative to the script's folder.
   */
  function open(path: string): void;

  /**
   * @since 1.6.0
   * @param url
   * @throws MalformedURLException
   */
  function openUrl(url: string): void;

  /**
   * Creates a listener for an event, this function can be more efficient that running a script file when used properly.
   * @since 1.2.7
   * @param event
   * @param callback calls your method as a {@link java.util.function.BiConsumer BiConsumer}&lt;{@link BaseEvent}, {@link EventContainer}&gt;
   * @return
   */
  function on<E extends keyof Events>(
    event: E,
    callback: MethodWrapper<Events[E], EventContainer, any, any>
  ): IEventListener;

  /**
   * Creates a single-run listener for an event, this function can be more efficient that running a script file when used properly.
   * @since 1.2.7
   * @param event
   * @param callback calls your method as a {@link java.util.function.BiConsumer BiConsumer}&lt;{@link BaseEvent}, {@link EventContainer}&gt;
   * @return the listener.
   */
  function once<E extends keyof Events>(
    event: E,
    callback: MethodWrapper<Events[E], EventContainer, any, any>
  ): IEventListener;

  /**
   * @since 1.2.3
   * @param listener
   * @return
   */
  function off(listener: IEventListener): boolean;

  /**
   * Removes a {@link IEventListener} from an event.
   * @since 1.2.3
   * @param event
   * @param listener
   * @return
   */
  function off<E extends keyof Events>(
    event: E,
    listener: IEventListener
  ): boolean;

  /**
   * @param event event to wait for
   * @since 1.5.0
   * @return a event and a new context if the event you're waiting for was joined, to leave it early.
   * @throws InterruptedException
   */
  function waitForEvent<E extends keyof Events>(
    event: E
  ): FJsMacros$EventAndContext<E>;

  /**
   * @param event
   * @return
   * @throws InterruptedException
   */
  function waitForEvent<E extends keyof Events>(
    event: E,
    filter: MethodWrapper<Events[E], any, boolean, any>
  ): FJsMacros$EventAndContext<E>;

  /**
   * waits for an event. if this thread is bound to an event already, this will release current lock.
   * @param event event to wait for
   * @param filter filter the event until it has the proper values or whatever.
   * @param runBeforeWaiting runs as a {@link Runnable}, run before waiting, this is a thread-safety thing to prevent "interrupts" from going in between this and things like deferCurrentTask
   * @since 1.5.0
   * @return a event and a new context if the event you're waiting for was joined, to leave it early.
   * @throws InterruptedException
   */
  function waitForEvent<E extends keyof Events>(
    event: E,
    filter: MethodWrapper<Events[E], any, boolean, any>,
    runBeforeWaiting: MethodWrapper<any, any, any, any>
  ): FJsMacros$EventAndContext<E>;

  /**
   * @since 1.2.3
   * @param event
   * @return a list of script-added listeners.
   */
  function listeners(event: keyof Events): JavaList<IEventListener>;

  /**
   * create a custom event object that can trigger a event. It's recommended to use
   *  {@link EventCustom#registerEvent} to set up the event to be visible in the GUI.
   * @param eventName name of the event. please don't use an existing one... your scripts might not like that.
   * @since 1.2.8
   * @return
   */
  function createCustomEvent(eventName: string): EventCustom;
}

/**
 * Functions for getting and using raw java classes, methods and functions.
 *
 * @author Wagyourtail
 * @since 1.2.3
 */
declare namespace Reflection {
  /**
   * @param name name of class like {@code path.to.class}
   * @return resolved class
   * @throws ClassNotFoundException
   * @since 1.2.3
   */
  function getClass(
    name:
      | "boolean"
      | "byte"
      | "short"
      | "int"
      | "long"
      | "float"
      | "double"
      | "char"
      | "void"
  ): JavaClass<any>;
  function getClass<C extends string>(name: C): GetJavaTypeClass<C>;
  function getClass<C extends JavaTypeList>(name: C): GetJavaTypeClass<C>;

  /**
   * Use this to specify a class with intermediary and yarn names of classes for cleaner code. also has support for
   *  java primitives by using their name in lower case.
   * @param name first try
   * @param name2 second try
   * @return a {@link java.lang.Class Class} reference.
   * @throws ClassNotFoundException
   * @since 1.2.3
   */
  function getClass<C extends string>(
    name: C,
    name2: string
  ): GetJavaTypeClass<C>;
  function getClass<C extends JavaTypeList>(
    name: C,
    name2: JavaTypeList
  ): GetJavaTypeClass<C>;

  /**
   * @param c
   * @param name
   * @param parameterTypes
   * @return
   * @throws NoSuchMethodException
   * @throws SecurityException
   * @since 1.2.3
   */
  function getDeclaredMethod(
    c: JavaClass<any>,
    name: string,
    ...parameterTypes: JavaClass<any>[]
  ): Packages.java.lang.reflect.Method;

  /**
   * Use this to specify a method with intermediary and yarn names of classes for cleaner code.
   * @param c
   * @param name
   * @param name2
   * @param parameterTypes
   * @return a {@link java.lang.reflect.Method Method} reference.
   * @throws NoSuchMethodException
   * @throws SecurityException
   * @since 1.2.3
   */
  function getDeclaredMethod(
    c: JavaClass<any>,
    name: string,
    name2: string,
    ...parameterTypes: JavaClass<any>[]
  ): Packages.java.lang.reflect.Method;

  /**
   * @since 1.6.0
   * @param c
   * @param name
   * @param name2
   * @param parameterTypes
   * @return
   * @throws NoSuchMethodException
   */
  function getMethod(
    c: JavaClass<any>,
    name: string,
    name2: string,
    ...parameterTypes: JavaClass<any>[]
  ): Packages.java.lang.reflect.Method;

  /**
   * @since 1.6.0
   * @param c
   * @param name
   * @param parameterTypes
   * @return
   * @throws NoSuchMethodException
   */
  function getMethod(
    c: JavaClass<any>,
    name: string,
    ...parameterTypes: JavaClass<any>[]
  ): Packages.java.lang.reflect.Method;

  /**
   * @param c
   * @param name
   * @return
   * @throws NoSuchFieldException
   * @throws SecurityException
   * @since 1.2.3
   */
  function getDeclaredField(
    c: JavaClass<any>,
    name: string
  ): Packages.java.lang.reflect.Field;

  /**
   * Use this to specify a field with intermediary and yarn names of classes for cleaner code.
   * @param c
   * @param name
   * @param name2
   * @return a {@link java.lang.reflect.Field Field} reference.
   * @throws NoSuchFieldException
   * @throws SecurityException
   * @since 1.2.3
   */
  function getDeclaredField(
    c: JavaClass<any>,
    name: string,
    name2: string
  ): Packages.java.lang.reflect.Field;

  /**
   * @since 1.6.0
   * @param c
   * @param name
   * @return
   * @throws NoSuchFieldException
   */
  function getField(
    c: JavaClass<any>,
    name: string
  ): Packages.java.lang.reflect.Field;

  /**
   * @since 1.6.0
   * @param c
   * @param name
   * @param name2
   * @return
   * @throws NoSuchFieldException
   */
  function getField(
    c: JavaClass<any>,
    name: string,
    name2: string
  ): Packages.java.lang.reflect.Field;

  /**
   * Invoke a method on an object with auto type coercion for numbers.
   * @param m method
   * @param c object (can be {@code null} for statics)
   * @param objects
   * @return
   * @throws IllegalAccessException
   * @throws IllegalArgumentException
   * @throws InvocationTargetException
   * @since 1.2.3
   */
  function invokeMethod(
    m: Packages.java.lang.reflect.Method,
    c: any,
    ...objects: any[]
  ): any;

  /**
   * Attempts to create a new instance of a class. You probably don't have to use this one and can just call `
   *  new` on a {@link java.lang.Class} unless you're in LUA, but then you also have the (kinda poorly
   *  doccumented, can someone find a better docs link for me)
   *  <a target="_blank" href="http://luaj.sourceforge.net/api/3.2/org/luaj/vm2/lib/jse/LuajavaLib.html">LuaJava Library</a>.
   * @param c
   * @param objects
   * @return
   * @since 1.2.7
   */
  function newInstance<T>(c: JavaClass<T>, ...objects: any[]): T;

  /**
   * proxy for extending java classes in the guest language with proper threading support.
   * @param clazz
   * @param interfaces
   * @param <T>
   * @since 1.6.0
   * @return
   */
  function createClassProxyBuilder<T>(
    clazz: JavaClass<T>,
    ...interfaces: JavaClass<any>[]
  ): ProxyBuilder<T>;

  /**
   * @param cName
   * @param clazz
   * @param interfaces
   * @param <T>
   * @since 1.6.5
   * @return
   * @throws NotFoundException
   * @throws CannotCompileException
   */
  function createClassBuilder<T>(
    cName: string,
    clazz: JavaClass<T>,
    ...interfaces: JavaClass<any>[]
  ): ClassBuilder<T>;

  /**
   * @param cName
   * @since 1.6.5
   * @return
   * @throws ClassNotFoundException
   */
  function getClassFromClassBuilderResult(cName: string): JavaClass<any>;
  function createLibraryBuilder(
    name: string,
    perExec: boolean,
    ...acceptedLangs: string[]
  ): LibraryBuilder;

  /**
   * Loads a jar file to be accessible with this library.
   * @param file relative to the script's folder.
   * @return success value
   * @throws IOException
   * @since 1.2.6
   */
  function loadJarFile(file: string): boolean;

  /**
   * @since 1.3.1
   * @return the previous mapping helper generated with {@link loadMappingHelper}
   */
  function loadCurrentMappingHelper(): Mappings;

  /**
   * @param o class you want the name of
   * @since 1.3.1
   * @return the fully qualified class name (with "."'s not "/"'s)
   */
  function getClassName(o: any): string;

  /**
   * @param urlorfile a url or file path the the yarn mappings {@code -v2.jar} file, or {@code .tiny} file. for example {@code https://maven.fabricmc.net/net/fabricmc/yarn/1.16.5%2Bbuild.3/yarn-1.16.5%2Bbuild.3-v2.jar}, if same url/path as previous this will load from cache.
   * @since 1.3.1
   * @return the associated mapping helper.
   */
  function loadMappingHelper(urlorfile: string): Mappings;

  /**
   * @since 1.6.5
   * @param instance
   * @param <T>
   * @return
   */
  function wrapInstace<T>(instance: T): WrappedClassInstance<T>;

  /**
   * @since 1.6.5
   * @param className
   * @return
   * @throws ClassNotFoundException
   */
  function getWrappedClass(className: string): WrappedClassInstance<any>;
}

/**
 * Functions for getting and using raw java classes, methods and functions.
 *
 * @since 1.1.8
 * @author Wagyourtail
 */
declare namespace Request {
  /**
   * create a HTTPRequest handler to the specified URL
   * @since 1.1.8
   * @param url
   * @return Request Wrapper
   * @throws IOException
   */
  function create(url: string): HTTPRequest;

  /**
   * @since 1.1.8
   * @param url
   * @return
   * @throws IOException
   */
  function get(url: string): HTTPRequest$Response;

  /**
   * send a GET request to the specified URL.
   * @since 1.1.8
   * @param url
   * @param headers
   * @return Response Data
   * @throws IOException
   */
  function get(
    url: string,
    headers: JavaMap<string, string>
  ): HTTPRequest$Response;

  /**
   * @since 1.1.8
   * @param url
   * @param data
   * @return
   * @throws IOException
   */
  function post(url: string, data: string): HTTPRequest$Response;

  /**
   * send a POST request to the specified URL.
   * @since 1.1.8
   * @param url
   * @param data
   * @param headers
   * @return Response Data
   * @throws IOException
   */
  function post(
    url: string,
    data: string,
    headers: JavaMap<string, string>
  ): HTTPRequest$Response;

  /**
   * Create a Websocket handler.
   * @since 1.2.7
   * @param url
   * @return
   * @throws IOException
   */
  function createWS(url: string): Websocket;

  /**
   * Create a Websocket handler.
   * @since 1.1.9
   * @deprecated 1.2.7
   * @param url
   * @return
   * @throws IOException
   */
  function createWS2(url: string): Websocket;
}

/**
 * Functions for getting and using raw java classes, methods and functions.
 *
 * @author Wagyourtail
 */
declare namespace Time {
  /**
   * @return current time in MS.
   */
  function time(): number;

  /**
   * Sleeps the current thread for the specified time in MS.
   * @param millis
   * @throws InterruptedException
   */
  function sleep(millis: number): void;
}

declare namespace Packages {
  namespace xyz.wagyourtail {
    /**
     * Is this even faster than just iterating through a LinkedHashSet / HashSet at this point?
     *  also should the node-length just always be 1?
     * @author Wagyourtail
     */
    const StringHashTrie: JavaClassStatics<[StringHashTrie]>;
    interface StringHashTrie extends JavaCollection<string> {
      size(): number;
      isEmpty(): boolean;
      contains(o: any): boolean;
      iterator(): java.util.Iterator<string>;
      toArray(): string[];
      toArray<T>(a: T[]): T[];
      toArray<T>(arg0: java.util.function.IntFunction<T[]>): T[];
      add(s: string): boolean;

      /**
       * this can make the StringHashTrie sparse, this can cause extra steps in lookup that are no longer needed,
       *  at some point it would be best to rebase the StringHashTrie with `new StringHashTrie().addAll(current.getAll())`
       * @param o
       * @return
       */
      remove(o: any): boolean;
      containsAll(c: JavaCollection<any>): boolean;
      containsAll(...o: string[]): boolean;
      addAll(c: JavaCollection<any>): boolean;
      addAll(...o: string[]): boolean;
      removeAll(c: JavaCollection<any>): boolean;
      removeAll(...o: string[]): boolean;
      retainAll(c: JavaCollection<any>): boolean;
      retainAll(...o: string[]): boolean;
      clear(): void;

      /**
       * @param prefix prefix to search with
       * @return all elements that start with the given prefix
       */
      getAllWithPrefix(prefix: string): JavaSet<string>;

      /**
       * @param prefix prefix to search with
       * @return all elements that start with the given prefix (case insensitive)
       */
      getAllWithPrefixCaseInsensitive(prefix: string): JavaSet<string>;

      /**
       * all contained elements as a {@link Set}
       * @return
       */
      getAll(): JavaSet<string>;

      /**
       * @return json representation, mainly for debugging.
       */
      toString(): string;
    }

    namespace jsmacros {
      namespace core {
        /**
         * Wraps most of the important functional interfaces.
         * @author Wagyourtail
         * @param <T>
         * @param <U>
         * @param <R>
         */
        const MethodWrapper: JavaClassStatics<{
          new <T, U, R, C>(containingContext: C): MethodWrapper<T, U, R, C>;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }>;
        interface MethodWrapper<T, U, R, C extends BaseScriptContext<any>>
          extends java.util.function.Consumer<T>,
            java.util.function.BiConsumer<T, U>,
            java.util.function.Function<T, R>,
            java.util.function.BiFunction<T, U, R>,
            java.util.function.Predicate<T>,
            java.util.function.BiPredicate<T, U>,
            java.lang.Runnable,
            java.util.function.Supplier<R>,
            java.util.Comparator<T> {
          getCtx(): C;
          accept(t: T): void;
          accept(t: T, u: U): void;
          apply(t: T): R;
          apply(t: T, u: U): R;
          test(t: T): boolean;
          test(t: T, u: U): boolean;

          /**
           * override to return true if the method can't join to the thread it was wrapped/created in, ie for languages that don't allow multithreading.
           */
          preventSameThreadJoin(): boolean;

          /**
           * make return something to override the thread set in {@link JsMacros.on}
           *  (hi jep)
           */
          overrideThread(): java.lang.Thread;

          /**
           * Makes {@link Function} and {@link BiFunction} work together.
           *  Extended so it's called on every type not just those 2.
           * @param after put a {@link MethodWrapper} here when using in scripts.
           */
          andThen<V>(
            after: java.util.function.Function<any, any>
          ): MethodWrapper<T, U, V, C>;
          andThen(
            arg0: java.util.function.Consumer<any>
          ): java.util.function.Consumer<T>;
          andThen(
            arg0: java.util.function.BiConsumer<any, any>
          ): java.util.function.BiConsumer<T, U>;

          /**
           * Makes {@link Predicate} and {@link BiPredicate} work together
           */
          negate(): MethodWrapper<T, U, R, C>;
        }

        const Core: JavaClassStatics<false> & {
          /**
           * static reference to instance created by {@link Core.createInstance}
           */
          getInstance(): Core<any, any>;

          /**
           * start by running this function, supplying implementations of {@link BaseEventRegistry} and {@link BaseProfile} and a {@link Supplier} for
           *  creating the config manager with the folder paths it needs.
           * @param eventRegistryFunction
           * @param profileFunction
           * @param configFolder
           * @param macroFolder
           * @param logger
           * @return
           */
          createInstance<V, R>(
            eventRegistryFunction: java.util.function.Function<Core<V, R>, R>,
            profileFunction: java.util.function.BiFunction<
              Core<V, R>,
              org.slf4j.Logger,
              V
            >,
            configFolder: java.io.File,
            macroFolder: java.io.File,
            logger: org.slf4j.Logger
          ): Core<V, R>;
        };
        interface Core<T extends BaseProfile, U extends BaseEventRegistry>
          extends JavaObject {
          readonly libraryRegistry: LibraryRegistry;
          readonly eventRegistry: BaseEventRegistry;
          readonly extensions: ExtensionLoader;
          readonly profile: T;
          readonly config: ConfigManager;
          readonly services: ServiceManager;

          deferredInit(): void;

          /**
           * @param container
           */
          addContext(container: EventContainer<any>): void;

          /**
           * @return
           */
          getContexts(): JavaSet<BaseScriptContext<any>>;

          /**
           * executes an {@link BaseEvent} on a ${@link ScriptTrigger}
           * @param macro
           * @param event
           * @return
           */
          exec(
            macro: ScriptTrigger,
            event: Events.BaseEvent
          ): EventContainer<any>;

          /**
           * Executes an {@link BaseEvent} on a ${@link ScriptTrigger} with callback.
           * @param macro
           * @param event
           * @param then
           * @param catcher
           * @return
           */
          exec(
            macro: ScriptTrigger,
            event: Events.BaseEvent,
            then: java.lang.Runnable,
            catcher: java.util.function.Consumer<java.lang.Throwable>
          ): EventContainer<any>;

          /**
           * @since 1.7.0
           * @param lang
           * @param script
           * @param fakeFile
           * @param event
           * @param then
           * @param catcher
           * @return
           */
          exec(
            lang: string,
            script: string,
            fakeFile: java.io.File,
            event: Events.BaseEvent,
            then: java.lang.Runnable,
            catcher: java.util.function.Consumer<java.lang.Throwable>
          ): EventContainer<any>;

          /**
           * wraps an exception for more uniform parsing between languages, also extracts useful info.
           * @param ex exception to wrap.
           * @return
           */
          wrapException(ex: java.lang.Throwable): BaseWrappedException<any>;
        }

        namespace language {
          /**
           * @since 1.4.0
           * @param <T>
           */
          const BaseScriptContext: JavaClassStatics<{
            new <T>(
              event: Events.BaseEvent,
              file: java.io.File
            ): BaseScriptContext<T>;

            /** @deprecated */ Symbol: unknown;
            /** @deprecated */ apply: unknown;
            /** @deprecated */ arguments: unknown;
            /** @deprecated */ bind: unknown;
            /** @deprecated */ call: unknown;
            /** @deprecated */ caller: unknown;
            /** @deprecated */ length: unknown;
            /** @deprecated */ name: unknown;
            /** @deprecated */ prototype: unknown;
          }>;
          interface BaseScriptContext<T> extends JavaObject {
            readonly startTime: number;
            readonly syncObject: java.lang.ref.WeakReference<any>;
            readonly triggeringEvent: Events.BaseEvent;
            hasMethodWrapperBeenInvoked: boolean;

            /**
             * this object should only be weak referenced unless we want to prevent the context from closing when syncObject is cleared.
             */
            getSyncObject(): any;
            clearSyncObject(): void;

            /**
             * @since 1.6.0
             * @return
             */
            getBoundEvents(): JavaMap<java.lang.Thread, EventContainer<any>>;

            /**
             * @since 1.6.0
             * @param th
             * @param event
             */
            bindEvent(
              th: java.lang.Thread,
              event: EventContainer<BaseScriptContext<T>>
            ): void;

            /**
             * @since 1.6.0
             * @param thread
             * @return
             */
            releaseBoundEventIfPresent(thread: java.lang.Thread): boolean;
            getContext(): T;

            /**
             * @since 1.5.0
             * @return
             */
            getMainThread(): java.lang.Thread;

            /**
             * @since 1.6.0
             * @param t
             * @return is a newly bound thread
             */
            bindThread(t: java.lang.Thread): boolean;

            /**
             * @since 1.6.0
             * @param t
             */
            unbindThread(t: java.lang.Thread): void;

            /**
             * @since 1.6.0
             * @return
             */
            getBoundThreads(): JavaSet<java.lang.Thread>;

            /**
             * @since 1.5.0
             * @param t
             */
            setMainThread(t: java.lang.Thread): void;

            /** @since 1.5.0 */
            getTriggeringEvent(): Events.BaseEvent;
            setContext(context: T): void;
            isContextClosed(): boolean;
            closeContext(): void;

            /**
             * @since 1.6.0
             * @return
             */
            getFile(): java.io.File;

            /**
             * @since 1.6.0
             * @return
             */
            getContainedFolder(): java.io.File;
            isMultiThreaded(): boolean;
            wrapSleep(sleep: BaseScriptContext$SleepRunnable): void;
          }

          /**
           * @param <T>
           * @since 1.4.0
           */
          const EventContainer: JavaClassStatics<{
            new <T>(ctx: T): EventContainer<T>;

            /** @deprecated */ Symbol: unknown;
            /** @deprecated */ apply: unknown;
            /** @deprecated */ arguments: unknown;
            /** @deprecated */ bind: unknown;
            /** @deprecated */ call: unknown;
            /** @deprecated */ caller: unknown;
            /** @deprecated */ length: unknown;
            /** @deprecated */ name: unknown;
            /** @deprecated */ prototype: unknown;
          }>;
          interface EventContainer<T extends BaseScriptContext<any>>
            extends JavaObject {
            isLocked(): boolean;
            setLockThread(lockThread: java.lang.Thread): void;
            getCtx(): T;
            getLockThread(): java.lang.Thread;

            /**
             * careful with this one it can cause deadlocks if used in scripts incorrectly.
             * @param then must be a {@link MethodWrapper} when called from a script.
             * @throws InterruptedException
             * @since 1.4.0
             */
            awaitLock(then: java.lang.Runnable): void;

            /**
             * can be released earlier in a script or language impl.
             * @since 1.4.0
             */
            releaseLock(): void;
          }

          const BaseScriptContext$SleepRunnable: JavaInterfaceStatics;
          interface BaseScriptContext$SleepRunnable extends JavaObject {
            run(): void;
          }

          const BaseWrappedException: JavaClassStatics<{
            new <T>(
              exception: T,
              message: string,
              location: BaseWrappedException$SourceLocation,
              next: BaseWrappedException<any>
            ): BaseWrappedException<T>;

            /** @deprecated */ Symbol: unknown;
            /** @deprecated */ apply: unknown;
            /** @deprecated */ arguments: unknown;
            /** @deprecated */ bind: unknown;
            /** @deprecated */ call: unknown;
            /** @deprecated */ caller: unknown;
            /** @deprecated */ length: unknown;
            /** @deprecated */ name: unknown;
            /** @deprecated */ prototype: unknown;
          }> & {
            wrapHostElement(
              t: java.lang.StackTraceElement,
              next: BaseWrappedException<any>
            ): BaseWrappedException<java.lang.StackTraceElement>;
          };
          interface BaseWrappedException<T> extends JavaObject {
            readonly stackFrame: T;
            readonly location: BaseWrappedException$SourceLocation;
            readonly message: string;
            readonly next: BaseWrappedException<any>;
          }

          /**
           * Language class for languages to be implemented on top of.
           * @since 1.1.3
           */
          const BaseLanguage: JavaClassStatics<{
            new <U, T>(
              extension: Extension,
              runner: Core<any, any>
            ): BaseLanguage<U, T>;

            /** @deprecated */ Symbol: unknown;
            /** @deprecated */ apply: unknown;
            /** @deprecated */ arguments: unknown;
            /** @deprecated */ bind: unknown;
            /** @deprecated */ call: unknown;
            /** @deprecated */ caller: unknown;
            /** @deprecated */ length: unknown;
            /** @deprecated */ name: unknown;
            /** @deprecated */ prototype: unknown;
          }>;
          interface BaseLanguage<U, T extends BaseScriptContext<U>>
            extends JavaObject {
            readonly extension: Extension;
            preThread: java.lang.Runnable;

            trigger(
              macro: ScriptTrigger,
              event: Events.BaseEvent,
              then: java.lang.Runnable,
              catcher: java.util.function.Consumer<java.lang.Throwable>
            ): EventContainer<T>;
            trigger(
              lang: string,
              script: string,
              fakeFile: java.io.File,
              event: Events.BaseEvent,
              then: java.lang.Runnable,
              catcher: java.util.function.Consumer<java.lang.Throwable>
            ): EventContainer<T>;
            retrieveLibs(context: T): JavaMap<string, BaseLibrary>;
            retrieveOnceLibs(): JavaMap<string, BaseLibrary>;
            retrievePerExecLibs(context: T): JavaMap<string, BaseLibrary>;
            createContext(event: Events.BaseEvent, file: java.io.File): T;
          }

          const BaseWrappedException$SourceLocation: JavaClassStatics<
            [BaseWrappedException$SourceLocation]
          >;
          interface BaseWrappedException$SourceLocation extends JavaObject {}

          export {
            BaseScriptContext,
            EventContainer,
            BaseScriptContext$SleepRunnable,
            BaseWrappedException,
            BaseLanguage,
            BaseWrappedException$SourceLocation,
          };
        }

        namespace library {
          const BaseLibrary: JavaClassStatics<[BaseLibrary]>;
          interface BaseLibrary extends JavaObject {}

          const LibraryRegistry: JavaClassStatics<[LibraryRegistry]>;
          interface LibraryRegistry extends JavaObject {
            readonly libraries: JavaMap<Library, BaseLibrary>;
            readonly perExec: JavaMap<Library, JavaClass<any>>;
            readonly perLanguage: JavaMap<
              JavaClass<any>,
              JavaMap<Library, PerLanguageLibrary>
            >;
            readonly perExecLanguage: JavaMap<
              JavaClass<any>,
              JavaMap<Library, JavaClass<any>>
            >;

            getLibraries(
              language: BaseLanguage<any, any>,
              context: BaseScriptContext<any>
            ): JavaMap<string, BaseLibrary>;
            getOnceLibraries(
              language: BaseLanguage<any, any>
            ): JavaMap<string, BaseLibrary>;
            getPerExecLibraries(
              language: BaseLanguage<any, any>,
              context: BaseScriptContext<any>
            ): JavaMap<string, BaseLibrary>;
            addLibrary(clazz: JavaClass<any>): void;
          }

          /**
           * Base Function interface.
           * @author Wagyourtail
           */
          const Library: JavaInterfaceStatics;
          interface Library extends java.lang.annotation.Annotation {
            value(): string;
            languages(): JavaClass<any>[];
          }

          const PerLanguageLibrary: JavaClassStatics<
            [PerLanguageLibrary],
            [language: JavaClass<any>]
          >;
          interface PerLanguageLibrary extends BaseLibrary {}

          namespace impl {
            const FJsMacros$EventAndContext: JavaClassStatics<
              [FJsMacros$EventAndContext],
              [event: Events.BaseEvent, context: EventContainer<any>]
            >;
            interface FJsMacros$EventAndContext extends JavaObject {
              readonly event: Events.BaseEvent;
              readonly context: EventContainer<any>;
            }

            namespace classes {
              /**
               * @author Wagyourtail, R3alCl0ud
               */
              const Websocket: JavaClassStatics<{
                new (address: string): Websocket;
                new (address: java.net.URL): Websocket;

                /** @deprecated */ Symbol: unknown;
                /** @deprecated */ apply: unknown;
                /** @deprecated */ arguments: unknown;
                /** @deprecated */ bind: unknown;
                /** @deprecated */ call: unknown;
                /** @deprecated */ caller: unknown;
                /** @deprecated */ length: unknown;
                /** @deprecated */ name: unknown;
                /** @deprecated */ prototype: unknown;
              }>;
              interface Websocket extends JavaObject {
                /**
                 * calls your method as a {@link java.util.function.Consumer}&lt;{@link WebSocket}, {@link List}&lt;{@link String}&gt;&gt;
                 */
                onConnect: MethodWrapper<
                  com.neovisionaries.ws.client.WebSocket,
                  JavaMap<string, JavaList<string>>,
                  any,
                  any
                >;

                /**
                 * calls your method as a {@link java.util.function.BiConsumer}&lt;{@link WebSocket}, {@link String}&gt;
                 */
                onTextMessage: MethodWrapper<
                  com.neovisionaries.ws.client.WebSocket,
                  string,
                  any,
                  any
                >;

                /**
                 * calls your method as a {@link java.util.function.BiConsumer}&lt;{@link WebSocket}, {@link Disconnected}&gt;
                 */
                onDisconnect: MethodWrapper<
                  com.neovisionaries.ws.client.WebSocket,
                  Websocket$Disconnected,
                  any,
                  any
                >;

                /**
                 * calls your method as a {@link java.util.function.BiConsumer}&lt;{@link WebSocket}, {@link WebSocketException}&gt;
                 */
                onError: MethodWrapper<
                  com.neovisionaries.ws.client.WebSocket,
                  com.neovisionaries.ws.client.WebSocketException,
                  any,
                  any
                >;

                /**
                 * calls your method as a {@link java.util.function.BiConsumer}&lt;{@link WebSocket}, {@link WebSocketFrame}&gt;
                 */
                onFrame: MethodWrapper<
                  com.neovisionaries.ws.client.WebSocket,
                  com.neovisionaries.ws.client.WebSocketFrame,
                  any,
                  any
                >;

                /**
                 * @since 1.1.9
                 * @return
                 * @throws WebSocketException
                 */
                connect(): Websocket;

                /**
                 * @since 1.1.9
                 * @return
                 */
                getWs(): com.neovisionaries.ws.client.WebSocket;

                /**
                 * @since 1.1.9
                 * @param text
                 * @return
                 */
                sendText(text: string): Websocket;

                /**
                 * @since 1.1.9
                 * @return
                 */
                close(): Websocket;

                /**
                 * @since 1.1.9
                 * @param closeCode
                 * @return
                 */
                close(closeCode: number): Websocket;
              }

              /**
               * @param <T>
               * @author Wagyourtail
               * @since 1.6.0
               */
              const ProxyBuilder: JavaClassStatics<{
                new <T>(
                  clazz: JavaClass<T>,
                  interfaces: JavaClass<any>[]
                ): ProxyBuilder<T>;

                /** @deprecated */ Symbol: unknown;
                /** @deprecated */ apply: unknown;
                /** @deprecated */ arguments: unknown;
                /** @deprecated */ bind: unknown;
                /** @deprecated */ call: unknown;
                /** @deprecated */ caller: unknown;
                /** @deprecated */ length: unknown;
                /** @deprecated */ name: unknown;
                /** @deprecated */ prototype: unknown;
              }>;
              interface ProxyBuilder<T> extends JavaObject {
                readonly factory: javassist.util.proxy.ProxyFactory;
                readonly proxiedMethods: JavaMap<
                  ProxyBuilder$MethodSigParts,
                  MethodWrapper<ProxyBuilder$ProxyReference<T>, any[], any, any>
                >;
                readonly proxiedMethodDefaults: JavaMap<
                  string,
                  MethodWrapper<ProxyBuilder$ProxyReference<T>, any[], any, any>
                >;

                /**
                 * @param methodNameOrSig name of method or sig (the usual format)
                 * @param proxyMethod
                 * @since 1.6.0
                 * @return self for chaining
                 */
                addMethod(
                  methodNameOrSig: string,
                  proxyMethod: MethodWrapper<
                    ProxyBuilder$ProxyReference<T>,
                    any[],
                    any,
                    any
                  >
                ): ProxyBuilder<T>;

                /**
                 * @param constructorArgs args for the super constructor
                 * @since 1.6.0
                 * @return new instance of the constructor
                 * @throws InvocationTargetException
                 * @throws NoSuchMethodException
                 * @throws InstantiationException
                 * @throws IllegalAccessException
                 */
                buildInstance(constructorArgs: any[]): T;

                /**
                 * @param constructorSig string signature (you can skip the &lt;init&gt; part)
                 * @param constructorArgs args for the super constructor
                 * @since 1.6.0
                 * @return new instance of the constructor
                 * @throws InvocationTargetException
                 * @throws NoSuchMethodException
                 * @throws InstantiationException
                 * @throws IllegalAccessException
                 * @throws ClassNotFoundException
                 */
                buildInstance(
                  constructorSig: string,
                  constructorArgs: any[]
                ): T;

                /**
                 * @param constructorSig string signature (you can skip the &lt;init&gt; part)
                 * @param constructorArgs args for the super constructor
                 * @since 1.6.0
                 * @return new instance of the constructor
                 * @throws InvocationTargetException
                 * @throws NoSuchMethodException
                 * @throws InstantiationException
                 * @throws IllegalAccessException
                 * @throws ClassNotFoundException
                 */
                buildInstance(
                  constructorSig: JavaClass<any>[],
                  constructorArgs: any[]
                ): T;
              }

              /**
               * @since 1.6.5
               * @author Wagyourtail
               */
              const LibraryBuilder: JavaClassStatics<
                [LibraryBuilder],
                [name: string, perExec: boolean, ...allowedLangs: string[]]
              >;
              interface LibraryBuilder extends ClassBuilder<BaseLibrary> {
                /**
                 * constructor, if perExec run every context, if per language run once for each lang;
                 *  params are context and language class
                 *  if not per exec, param will be skipped
                 *  ie:
                 *  BaseLibrary: no params
                 *  PerExecLibrary: context
                 *  PerExecLanguageLibrary: context, language
                 *  PerLanguageLibrary: language
                 *
                 *  Don't do other constructors...
                 * @return
                 * @throws NotFoundException
                 */
                addConstructor(): ClassBuilder$ConstructorBuilder;
                addConstructor(
                  ...params: JavaClass<any>[]
                ): ClassBuilder$ConstructorBuilder;
                finishBuildAndFreeze(): JavaClass<any>;
              }

              /**
               * @author Wagyourtail
               * @since 1.1.8
               */
              const HTTPRequest$Response: JavaClassStatics<
                [HTTPRequest$Response],
                [
                  inputStream: java.io.InputStream,
                  responseCode: number,
                  headers: JavaMap<string, JavaList<string>>
                ]
              >;
              interface HTTPRequest$Response extends JavaObject {
                headers: JavaMap<string, JavaList<string>>;
                responseCode: number;

                /**
                 * @since 1.1.8
                 * @return
                 */
                text(): string;

                /**
                 * Don't use this. Parse {@link HTTPRequest.Response#text} in the guest language
                 * @since 1.1.8
                 * @deprecated
                 * @return
                 */
                json(): any;

                /**
                 * @since 1.2.2
                 * @return
                 * @throws IOException
                 */
                byteArray(): number[];
              }

              /**
               * @author Wagyourtail
               * @since 1.1.8
               */
              const FileHandler: JavaClassStatics<{
                new (path: string): FileHandler;
                new (path: java.io.File): FileHandler;

                /** @deprecated */ Symbol: unknown;
                /** @deprecated */ apply: unknown;
                /** @deprecated */ arguments: unknown;
                /** @deprecated */ bind: unknown;
                /** @deprecated */ call: unknown;
                /** @deprecated */ caller: unknown;
                /** @deprecated */ length: unknown;
                /** @deprecated */ name: unknown;
                /** @deprecated */ prototype: unknown;
              }>;
              interface FileHandler extends JavaObject {
                /**
                 * writes a string to the file. this is a destructive operation that replaces the file contents.
                 * @since 1.1.8
                 * @param s
                 * @return
                 * @throws IOException
                 */
                write(s: string): FileHandler;

                /**
                 * writes a byte array to the file. this is a destructive operation that replaces the file contents.
                 * @since 1.1.8
                 * @param b
                 * @return
                 * @throws IOException
                 */
                write(b: number[]): FileHandler;

                /**
                 * @since 1.1.8
                 * @return
                 * @throws IOException
                 */
                read(): string;

                /**
                 * @since 1.2.6
                 * @return
                 * @throws IOException
                 */
                readBytes(): number[];

                /**
                 * @since 1.1.8
                 * @param s
                 * @return
                 * @throws IOException
                 */
                append(s: string): FileHandler;

                /**
                 * @since 1.2.6
                 * @param b
                 * @return
                 * @throws IOException
                 */
                append(b: number[]): FileHandler;
                getFile(): java.io.File;
              }

              /**
               * @author Wagyourtail
               * @since 1.1.8
               */
              const HTTPRequest: JavaClassStatics<[HTTPRequest], [url: string]>;
              interface HTTPRequest extends JavaObject {
                headers: JavaMap<string, string>;
                conn: java.net.URL;

                /**
                 * @since 1.1.8
                 * @param key
                 * @param value
                 * @return
                 */
                addHeader(key: string, value: string): HTTPRequest;

                /**
                 * @since 1.1.8
                 * @return
                 * @throws IOException
                 */
                get(): HTTPRequest$Response;

                /**
                 * @since 1.1.8
                 * @param data
                 * @return
                 * @throws IOException
                 */
                post(data: string): HTTPRequest$Response;
              }

              /**
               * @param <T>
               * @since 1.6.5
               */
              const ClassBuilder: JavaClassStatics<{
                new <T>(
                  name: string,
                  parent: JavaClass<T>,
                  ...interfaces: JavaClass<any>[]
                ): ClassBuilder<T>;

                /** @deprecated */ Symbol: unknown;
                /** @deprecated */ apply: unknown;
                /** @deprecated */ arguments: unknown;
                /** @deprecated */ bind: unknown;
                /** @deprecated */ call: unknown;
                /** @deprecated */ caller: unknown;
                /** @deprecated */ length: unknown;
                /** @deprecated */ name: unknown;
                /** @deprecated */ prototype: unknown;
              }> & {
                readonly methodWrappers: JavaMap<
                  string,
                  MethodWrapper<any, any, any, any>
                >;
              };
              interface ClassBuilder<T> extends JavaObject {
                readonly ctClass: javassist.CtClass;

                addField(
                  fieldType: JavaClass<any>,
                  name: string
                ): ClassBuilder$FieldBuilder;
                addMethod(
                  returnType: JavaClass<any>,
                  name: string,
                  ...params: JavaClass<any>[]
                ): ClassBuilder$MethodBuilder;
                addConstructor(
                  ...params: JavaClass<any>[]
                ): ClassBuilder$ConstructorBuilder;
                addClinit(): ClassBuilder$ConstructorBuilder;
                addAnnotation(
                  type: JavaClass<any>
                ): ClassBuilder$AnnotationBuilder<ClassBuilder<T>>;
                finishBuildAndFreeze(): JavaClass<any>;
              }

              const ProxyBuilder$MethodSigParts: JavaClassStatics<false>;
              interface ProxyBuilder$MethodSigParts extends JavaObject {
                readonly name: string;
                readonly params: JavaClass<any>[];
                readonly returnType: JavaClass<any>;
              }

              const ClassBuilder$FieldBuilder: JavaClassStatics<
                [ClassBuilder$FieldBuilder],
                [fieldType: javassist.CtClass, name: string]
              >;
              interface ClassBuilder$FieldBuilder extends JavaObject {
                fieldInitializer: javassist.CtField$Initializer;

                compile(code: string): ClassBuilder<T>;
                rename(name: string): ClassBuilder$FieldBuilder;
                makePrivate(): ClassBuilder$FieldBuilder;
                makePublic(): ClassBuilder$FieldBuilder;
                makeProtected(): ClassBuilder$FieldBuilder;
                makePackagePrivate(): ClassBuilder$FieldBuilder;
                toggleStatic(): ClassBuilder$FieldBuilder;
                toggleFinal(): ClassBuilder$FieldBuilder;
                getMods(): number;
                getModString(): string;
                addAnnotation(
                  type: JavaClass<any>
                ): ClassBuilder$AnnotationBuilder<ClassBuilder$FieldBuilder>;
                initializer(): ClassBuilder$FieldBuilder$FieldInitializerBuilder;
                end(): ClassBuilder<T>;
              }

              /**
               * @author Perry "R3alCl0ud" Berman
               */
              const Websocket$Disconnected: JavaClassStatics<{
                /**
                 * @param serverFrame
                 * @param clientFrame
                 * @param isServer
                 */
                new (
                  serverFrame: com.neovisionaries.ws.client.WebSocketFrame,
                  clientFrame: com.neovisionaries.ws.client.WebSocketFrame,
                  isServer: boolean
                ): Websocket$Disconnected;

                /** @deprecated */ Symbol: unknown;
                /** @deprecated */ apply: unknown;
                /** @deprecated */ arguments: unknown;
                /** @deprecated */ bind: unknown;
                /** @deprecated */ call: unknown;
                /** @deprecated */ caller: unknown;
                /** @deprecated */ length: unknown;
                /** @deprecated */ name: unknown;
                /** @deprecated */ prototype: unknown;
              }>;
              interface Websocket$Disconnected extends JavaObject {
                serverFrame: com.neovisionaries.ws.client.WebSocketFrame;
                clientFrame: com.neovisionaries.ws.client.WebSocketFrame;
                isServer: boolean;
              }

              const ClassBuilder$MethodBuilder: JavaClassStatics<
                [ClassBuilder$MethodBuilder],
                [
                  methodReturnType: javassist.CtClass,
                  methodName: string,
                  ...params: javassist.CtClass[]
                ]
              >;
              interface ClassBuilder$MethodBuilder extends JavaObject {
                compile(code: string): ClassBuilder<T>;
                makePrivate(): ClassBuilder$MethodBuilder;
                makePublic(): ClassBuilder$MethodBuilder;
                makeProtected(): ClassBuilder$MethodBuilder;
                makePackagePrivate(): ClassBuilder$MethodBuilder;
                toggleStatic(): ClassBuilder$MethodBuilder;
                rename(newName: string): ClassBuilder$MethodBuilder;
                exceptions(
                  ...exceptions: JavaClass<any>[]
                ): ClassBuilder$MethodBuilder;
                body(code_src: string): ClassBuilder<T>;
                guestBody(
                  methodBody: MethodWrapper<any, any, any, any>
                ): ClassBuilder<T>;
                buildBody(): ClassBuilder$BodyBuilder;
                body(
                  buildBody: MethodWrapper<
                    javassist.CtClass,
                    javassist.CtBehavior,
                    any,
                    any
                  >
                ): ClassBuilder<T>;
                endAbstract(): ClassBuilder<T>;
                addAnnotation(
                  type: JavaClass<any>
                ): ClassBuilder$AnnotationBuilder<ClassBuilder$MethodBuilder>;
              }

              const ProxyBuilder$ProxyReference: JavaClassStatics<{
                new <T>(
                  self: T,
                  parent: java.util.function.Function<any[], any>
                ): ProxyBuilder$ProxyReference<T>;

                /** @deprecated */ Symbol: unknown;
                /** @deprecated */ apply: unknown;
                /** @deprecated */ arguments: unknown;
                /** @deprecated */ bind: unknown;
                /** @deprecated */ call: unknown;
                /** @deprecated */ caller: unknown;
                /** @deprecated */ length: unknown;
                /** @deprecated */ name: unknown;
                /** @deprecated */ prototype: unknown;
              }>;
              interface ProxyBuilder$ProxyReference<T> extends JavaObject {
                /**
                 * "this" value, but like python because "this" is a keyword in java...
                 */
                readonly self: T;

                /**
                 * "super" value, but that's also a keyword so...
                 */
                readonly parent: java.util.function.Function<any[], any>;
              }

              const ClassBuilder$AnnotationBuilder: JavaClassStatics<false>;
              interface ClassBuilder$AnnotationBuilder<T> extends JavaObject {
                putString(
                  key: string,
                  value: string
                ): ClassBuilder$AnnotationBuilder<T>;
                putBoolean(
                  key: string,
                  value: boolean
                ): ClassBuilder$AnnotationBuilder<T>;
                putByte(
                  key: string,
                  value: number
                ): ClassBuilder$AnnotationBuilder<T>;
                putChar(
                  key: string,
                  value: number
                ): ClassBuilder$AnnotationBuilder<T>;
                putShort(
                  key: string,
                  value: number
                ): ClassBuilder$AnnotationBuilder<T>;
                putInt(
                  key: string,
                  value: number
                ): ClassBuilder$AnnotationBuilder<T>;
                putLong(
                  key: string,
                  value: number
                ): ClassBuilder$AnnotationBuilder<T>;
                putFloat(
                  key: string,
                  value: number
                ): ClassBuilder$AnnotationBuilder<T>;
                putDouble(
                  key: string,
                  value: number
                ): ClassBuilder$AnnotationBuilder<T>;
                putClass(
                  key: string,
                  value: JavaClass<any>
                ): ClassBuilder$AnnotationBuilder<T>;
                putEnum(
                  key: string,
                  value: java.lang.Enum<any>
                ): ClassBuilder$AnnotationBuilder<T>;
                putAnnotation(
                  key: string,
                  annotationClass: JavaClass<any>
                ): ClassBuilder$AnnotationBuilder<
                  ClassBuilder$AnnotationBuilder<T>
                >;
                putArray(
                  key: string,
                  annotationClass: JavaClass<any>
                ): ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<
                  ClassBuilder$AnnotationBuilder<T>
                >;
                finish(): T;
              }

              const ClassBuilder$ConstructorBuilder: JavaClassStatics<
                [ClassBuilder$ConstructorBuilder],
                [params: javassist.CtClass[], clInit: boolean]
              >;
              interface ClassBuilder$ConstructorBuilder
                extends ClassBuilder$MethodBuilder {
                body(code_src: string): ClassBuilder<T>;
                guestBody(
                  methodBody: MethodWrapper<any, any, any, any>
                ): ClassBuilder<T>;
                buildBody(): ClassBuilder$BodyBuilder;
                body(
                  buildBody: MethodWrapper<
                    javassist.CtClass,
                    javassist.CtBehavior,
                    any,
                    any
                  >
                ): ClassBuilder<T>;
                endAbstract(): ClassBuilder<T>;
              }

              const ClassBuilder$FieldBuilder$FieldInitializerBuilder: JavaClassStatics<
                [ClassBuilder$FieldBuilder$FieldInitializerBuilder]
              >;
              interface ClassBuilder$FieldBuilder$FieldInitializerBuilder
                extends JavaObject {
                setInt(value: number): ClassBuilder$FieldBuilder;
                setLong(value: number): ClassBuilder$FieldBuilder;
                setFloat(value: number): ClassBuilder$FieldBuilder;
                setDouble(value: number): ClassBuilder$FieldBuilder;
                setChar(value: number): ClassBuilder$FieldBuilder;
                setString(value: string): ClassBuilder$FieldBuilder;
                setBoolean(value: boolean): ClassBuilder$FieldBuilder;
                setByte(value: number): ClassBuilder$FieldBuilder;
                setShort(value: number): ClassBuilder$FieldBuilder;
                compile(code: string): ClassBuilder$FieldBuilder;
                initClass(
                  clazz: JavaClass<any>,
                  ...code_arg: string[]
                ): ClassBuilder$FieldBuilder;
                callStaticMethod(
                  clazz: JavaClass<any>,
                  methodName: string,
                  ...code_arg: string[]
                ): ClassBuilder$FieldBuilder;
                callStaticMethodInThisClass(
                  methodName: string,
                  ...code_arg: string[]
                ): ClassBuilder$FieldBuilder;
              }

              const ClassBuilder$BodyBuilder: JavaClassStatics<false>;
              interface ClassBuilder$BodyBuilder extends JavaObject {
                appendJavaCode(code: string): ClassBuilder$BodyBuilder;

                /**
                 * @param code
                 * @param argsAsObjects
                 * @param tokenBefore ie, "return", "Object wasd = " etc
                 * @return
                 */
                appendGuestCode(
                  code: MethodWrapper<any, any, any, any>,
                  argsAsObjects: string,
                  tokenBefore: string
                ): ClassBuilder$BodyBuilder;
                finish(): ClassBuilder<T>;
              }

              const ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder: JavaClassStatics<{
                new <U>(
                  parent: U,
                  constPool: javassist.bytecode.ConstPool
                ): ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>;

                /** @deprecated */ Symbol: unknown;
                /** @deprecated */ apply: unknown;
                /** @deprecated */ arguments: unknown;
                /** @deprecated */ bind: unknown;
                /** @deprecated */ call: unknown;
                /** @deprecated */ caller: unknown;
                /** @deprecated */ length: unknown;
                /** @deprecated */ name: unknown;
                /** @deprecated */ prototype: unknown;
              }>;
              interface ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>
                extends JavaObject {
                putString(
                  value: string
                ): ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>;
                putBoolean(
                  value: boolean
                ): ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>;
                putByte(
                  value: number
                ): ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>;
                putChar(
                  value: number
                ): ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>;
                putShort(
                  value: number
                ): ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>;
                putInt(
                  value: number
                ): ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>;
                putLong(
                  value: number
                ): ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>;
                putFloat(
                  value: number
                ): ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>;
                putDouble(
                  value: number
                ): ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>;
                putClass(
                  value: JavaClass<any>
                ): ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>;
                putEnum(
                  value: java.lang.Enum<any>
                ): ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>;
                putAnnotation(
                  annotationClass: JavaClass<any>
                ): ClassBuilder$AnnotationBuilder<
                  ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>
                >;
                putArray(
                  annotationClass: JavaClass<any>
                ): ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<
                  ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>
                >;
                finish(): U;
              }

              export {
                Websocket,
                ProxyBuilder,
                LibraryBuilder,
                HTTPRequest$Response,
                FileHandler,
                HTTPRequest,
                ClassBuilder,
                ProxyBuilder$MethodSigParts,
                ClassBuilder$FieldBuilder,
                Websocket$Disconnected,
                ClassBuilder$MethodBuilder,
                ProxyBuilder$ProxyReference,
                ClassBuilder$AnnotationBuilder,
                ClassBuilder$ConstructorBuilder,
                ClassBuilder$FieldBuilder$FieldInitializerBuilder,
                ClassBuilder$BodyBuilder,
                ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder,
              };
            }

            export { FJsMacros$EventAndContext, classes };
          }

          export {
            BaseLibrary,
            LibraryRegistry,
            Library,
            PerLanguageLibrary,
            impl,
          };
        }

        namespace config {
          const ConfigManager: JavaClassStatics<
            [ConfigManager],
            [
              configFolder: java.io.File,
              macroFolder: java.io.File,
              logger: org.slf4j.Logger
            ]
          >;
          interface ConfigManager extends JavaObject {
            readonly optionClasses: JavaMap<string, JavaClass<any>>;
            readonly options: JavaMap<JavaClass<any>, any>;
            readonly configFolder: java.io.File;
            readonly macroFolder: java.io.File;
            readonly configFile: java.io.File;
            readonly LOGGER: org.slf4j.Logger;
            rawOptions: com.google.gson.JsonObject;

            reloadRawConfigFromFile(): void;
            convertConfigFormat(): void;
            convertConfigFormat(clazz: JavaClass<any>): void;
            getOptions<T>(optionClass: JavaClass<T>): T;
            addOptions(key: string, optionClass: JavaClass<any>): void;
            loadConfig(): void;
            loadDefaults(): void;
            saveConfig(): void;
          }

          const ScriptTrigger: JavaClassStatics<{
            new (
              triggerType: ScriptTrigger$TriggerType,
              event: string,
              scriptFile: java.io.File,
              enabled: boolean
            ): ScriptTrigger;
            /** @deprecated */
            new (
              triggerType: ScriptTrigger$TriggerType,
              event: string,
              scriptFile: string,
              enabled: boolean
            ): ScriptTrigger;

            /** @deprecated */ Symbol: unknown;
            /** @deprecated */ apply: unknown;
            /** @deprecated */ arguments: unknown;
            /** @deprecated */ bind: unknown;
            /** @deprecated */ call: unknown;
            /** @deprecated */ caller: unknown;
            /** @deprecated */ length: unknown;
            /** @deprecated */ name: unknown;
            /** @deprecated */ prototype: unknown;
          }> & {
            copy(m: ScriptTrigger): ScriptTrigger;
          };
          interface ScriptTrigger extends JavaObject {
            triggerType: ScriptTrigger$TriggerType;
            event: string;
            scriptFile: string;
            enabled: boolean;

            equals(macro: ScriptTrigger): boolean;
            equals(arg0: any): boolean;
            copy(): ScriptTrigger;

            /**
             * @since 1.2.7
             * @return
             */
            getTriggerType(): ScriptTrigger$TriggerType;

            /**
             * @since 1.2.7
             * @return
             */
            getEvent(): string;

            /**
             * @since 1.2.7
             * @return
             */
            getScriptFile(): string;

            /**
             * @since 1.2.7
             * @return
             */
            getEnabled(): boolean;
          }

          /**
           * @author Wagyourtail
           * @since 1.2.7
           */
          const BaseProfile: JavaClassStatics<
            [BaseProfile],
            [runner: Core, logger: org.slf4j.Logger]
          >;
          interface BaseProfile extends JavaObject {
            readonly LOGGER: org.slf4j.Logger;
            readonly joinedThreadStack: JavaSet<java.lang.Thread>;
            profileName: string;

            logError(ex: java.lang.Throwable): void;

            /**
             * @since 1.1.2 [citation needed]
             * @return
             * @deprecated
             */
            getRegistry(): BaseEventRegistry;

            /** @since 1.6.0 */
            checkJoinedThreadStack(): boolean;

            /**
             * @since 1.1.2 [citation needed]
             * @param profileName
             */
            loadOrCreateProfile(profileName: string): void;

            /** @since 1.0.8 [citation needed] */
            saveProfile(): void;

            /**
             * @since 1.2.7
             * @param event
             */
            triggerEvent(event: Events.BaseEvent): void;

            /**
             * @since 1.2.7
             * @param event
             */
            triggerEventJoin(event: Events.BaseEvent): void;

            /**
             * @since 1.2.7
             * @param event
             */
            triggerEventNoAnything(event: Events.BaseEvent): void;

            /**
             * @since 1.2.7
             * @param event
             */
            triggerEventJoinNoAnything(event: Events.BaseEvent): void;
            init(defaultProfile: string): void;
            getCurrentProfileName(): string;
            renameCurrentProfile(profile: string): void;
          }

          /**
           * @since 1.0.0 [citation needed]
           * @author Wagyourtail
           */
          const ScriptTrigger$TriggerType: JavaClassStatics<false> & {
            readonly KEY_FALLING: ScriptTrigger$TriggerType;
            readonly KEY_RISING: ScriptTrigger$TriggerType;
            readonly KEY_BOTH: ScriptTrigger$TriggerType;
            readonly EVENT: ScriptTrigger$TriggerType;

            values(): ScriptTrigger$TriggerType[];
            valueOf(name: string): ScriptTrigger$TriggerType;
          };
          interface ScriptTrigger$TriggerType
            extends java.lang.Enum<ScriptTrigger$TriggerType> {}

          export {
            ConfigManager,
            ScriptTrigger,
            BaseProfile,
            ScriptTrigger$TriggerType,
          };
        }

        namespace service {
          /**
           * @author Wagyourtail
           * @since 1.6.3
           */
          const ServiceManager: JavaClassStatics<
            [ServiceManager],
            [runner: Core<any, any>]
          >;
          interface ServiceManager extends JavaObject {
            /**
             * @param name
             * @param pathToFile relative to macro folder
             * @return false if service with that name is already registered
             */
            registerService(name: string, pathToFile: string): boolean;

            /**
             * @param name
             * @param pathToFile relative to macro folder
             * @param enabled
             * @return false if service with that name is already registered
             */
            registerService(
              name: string,
              pathToFile: string,
              enabled: boolean
            ): boolean;

            /**
             * @param name
             * @param trigger
             * @return false if service with that name already registered
             */
            registerService(name: string, trigger: ServiceTrigger): boolean;

            /**
             * @param name
             * @return
             */
            unregisterService(name: string): boolean;

            /**
             * @param oldName
             * @param newName
             * @return false if service with new name already registered or old name doesn't exist
             */
            renameService(oldName: string, newName: string): boolean;

            /**
             * @return registered service names
             */
            getServices(): JavaSet<string>;

            /**
             * starts service once
             * @param name service name
             * @return previous state (or {@link ServiceStatus#UNKNOWN} if unknown service)
             */
            startService(name: string): ServiceManager$ServiceStatus;

            /**
             * @param name service name
             * @return previous state (or {@link ServiceStatus#UNKNOWN} if unknown service)
             */
            stopService(name: string): ServiceManager$ServiceStatus;

            /**
             * @param name service name
             * @return state before "restarting" (or {@link ServiceStatus#UNKNOWN} if unknown service)
             */
            restartService(name: string): ServiceManager$ServiceStatus;

            /**
             * @param name service name
             * @return previous state (or {@link ServiceStatus#UNKNOWN} if unknown service)
             */
            enableService(name: string): ServiceManager$ServiceStatus;

            /**
             * @param name service name
             * @return previous state (or {@link ServiceStatus#UNKNOWN} if unknown service)
             */
            disableService(name: string): ServiceManager$ServiceStatus;

            /**
             * @param name service name
             * @return {@link ServiceStatus#UNKNOWN} if unknown service, {@link ServiceStatus#RUNNING} if disabled and running, {@link ServiceStatus#DISABLED} if disabled and stopped, {@link ServiceStatus#STOPPED} if enabled and stopped, {@link ServiceStatus#ENABLED} if enabled and running.
             */
            status(name: string): ServiceManager$ServiceStatus;

            /**
             * this might throw if the service is not running...
             * @param name
             * @since 1.6.5
             * @return the event that is current for the service
             */
            getServiceData(name: string): EventService;

            /**
             * @param name
             * @since 1.6.5 [named getServiceData previously]
             * @return
             */
            getTrigger(name: string): ServiceTrigger;

            /**
             * load services from config
             */
            load(): void;

            /**
             * save current registered services & enabled/disabled status to config
             */
            save(): void;
          }

          /** @since 1.6.4 */
          const EventService: JavaClassStatics<[EventService], [name: string]>;
          interface EventService extends Events.BaseEvent {
            readonly serviceName: string;

            /**
             * when this service is stopped, this is run...
             */
            stopListener: MethodWrapper<any, any, any, any>;

            /**
             * Put an Integer into the global variable space.
             * @param name
             * @param i
             * @return
             * @since 1.6.5
             */
            putInt(name: string, i: number): number;

            /**
             * put a String into the global variable space.
             * @param name
             * @param str
             * @return
             * @since 1.6.5
             */
            putString(name: string, str: string): string;

            /**
             * put a Double into the global variable space.
             * @param name
             * @param d
             * @return
             * @since 1.6.5
             */
            putDouble(name: string, d: number): number;

            /**
             * put a Boolean into the global variable space.
             * @param name
             * @param b
             * @return
             * @since 1.6.5
             */
            putBoolean(name: string, b: boolean): boolean;

            /**
             * put anything else into the global variable space.
             * @param name
             * @param o
             * @return
             * @since 1.6.5
             */
            putObject(name: string, o: any): any;

            /**
             * Returns the type of the defined item in the global variable space as a string.
             * @param name
             * @return
             * @since 1.6.5
             */
            getType(name: string): string;

            /**
             * Gets an Integer from the global variable space.
             * @param name
             * @return
             * @since 1.6.5
             */
            getInt(name: string): number;

            /**
             * Gets an Integer from the global variable space. and then increment it there.
             * @param name
             * @return
             * @since 1.6.5
             */
            getAndIncrementInt(name: string): number;

            /**
             * Gets an integer from the global variable pace. and then decrement it there.
             * @param name
             * @return
             * @since 1.6.5
             */
            getAndDecrementInt(name: string): number;

            /**
             * increment an Integer in the global variable space. then return it.
             * @param name
             * @return
             * @since 1.6.5
             */
            incrementAndGetInt(name: string): number;

            /**
             * decrement an Integer in the global variable space. then return it.
             * @param name
             * @return
             * @since 1.6.5
             */
            decrementAndGetInt(name: string): number;

            /**
             * Gets a String from the global variable space
             * @param name
             * @return
             * @since 1.6.5
             */
            getString(name: string): string;

            /**
             * Gets a Double from the global variable space.
             * @param name
             * @return
             * @since 1.6.5
             */
            getDouble(name: string): number;

            /**
             * Gets a Boolean from the global variable space.
             * @param name
             * @return
             * @since 1.6.5
             */
            getBoolean(name: string): boolean;

            /**
             * toggles a global boolean and returns its new value
             * @param name
             * @return
             * @since 1.6.5
             */
            toggleBoolean(name: string): boolean;

            /**
             * Gets an Object from the global variable space.
             * @param name
             * @return
             * @since 1.6.5
             */
            getObject(name: string): any;

            /**
             * removes a key from the global varaible space.
             * @param key
             * @since 1.6.5
             */
            remove(key: string): void;
            getRaw(): JavaMap<string, any>;
          }

          const ServiceManager$ServiceStatus: JavaClassStatics<false> & {
            readonly ENABLED: ServiceManager$ServiceStatus;
            readonly DISABLED: ServiceManager$ServiceStatus;
            readonly RUNNING: ServiceManager$ServiceStatus;
            readonly STOPPED: ServiceManager$ServiceStatus;
            readonly UNKNOWN: ServiceManager$ServiceStatus;

            values(): ServiceManager$ServiceStatus[];
            valueOf(name: string): ServiceManager$ServiceStatus;
          };
          interface ServiceManager$ServiceStatus
            extends java.lang.Enum<ServiceManager$ServiceStatus> {}

          const ServiceTrigger: JavaClassStatics<
            [ServiceTrigger],
            [file: java.io.File, enabled: boolean]
          >;
          interface ServiceTrigger extends JavaObject {
            file: string;
            enabled: boolean;

            toScriptTrigger(): ScriptTrigger;
          }

          export {
            ServiceManager,
            EventService,
            ServiceManager$ServiceStatus,
            ServiceTrigger,
          };
        }

        namespace event {
          const IEventListener: JavaInterfaceStatics;
          interface IEventListener extends JavaObject {
            trigger(event: BaseEvent): EventContainer<any>;
          }

          const BaseEvent: JavaInterfaceStatics & {
            readonly profile: BaseProfile;
          };
          interface BaseEvent extends JavaObject {
            getEventName(): string;
          }

          /**
           * @author Wagyourtail
           * @since 1.2.7
           */
          const BaseEventRegistry: JavaClassStatics<
            [BaseEventRegistry],
            [runner: Core]
          >;
          interface BaseEventRegistry extends JavaObject {
            readonly oldEvents: JavaMap<string, string>;
            readonly events: JavaSet<string>;

            clearMacros(): void;

            /**
             * @since 1.1.2 [citation needed]
             * @param rawmacro
             */
            addScriptTrigger(rawmacro: ScriptTrigger): void;

            /**
             * @since 1.2.3
             * @param event
             * @param listener
             */
            addListener(event: string, listener: IEventListener): void;

            /**
             * @since 1.2.3
             * @param event
             * @param listener
             * @return
             */
            removeListener(event: string, listener: IEventListener): boolean;

            /**
             * @since 1.2.3
             * @param listener
             * @return
             * @deprecated
             */
            removeListener(listener: IEventListener): boolean;

            /**
             * @since 1.1.2 [citation needed]
             * @param rawmacro
             * @return
             */
            removeScriptTrigger(rawmacro: ScriptTrigger): boolean;

            /**
             * @since 1.2.3
             * @return
             */
            getListeners(): JavaMap<string, JavaSet<IEventListener>>;

            /**
             * @since 1.2.3
             * @param key
             * @return
             */
            getListeners(key: string): JavaSet<IEventListener>;

            /**
             * @since 1.1.2 [citation needed]
             * @return
             */
            getScriptTriggers(): JavaList<ScriptTrigger>;

            /**
             * @since 1.1.2 [citation needed]
             * @param eventName
             */
            addEvent(eventName: string): void;
            addEvent(clazz: JavaClass<any>): void;
          }

          namespace impl {
            /**
             * Custom Events
             * @author Wagyourtail
             * @since 1.2.8
             */
            const EventCustom: JavaClassStatics<{
              /**
               * @param eventName name of the event. please don't use an existing one... your scripts might not like that.
               */
              new (eventName: string): EventCustom;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface EventCustom extends Events.BaseEvent {
              eventName: string;

              /**
               * Triggers the event.
               *  Try not to cause infinite looping by triggering the same {@link EventCustom} from its own listeners.
               * @since 1.2.8
               */
              trigger(): void;

              /**
               * trigger the event listeners, then run `callback` when they finish.
               * @since 1.3.1
               * @param callback used as a {@link Runnable}, so no args, no return value.
               */
              trigger(callback: MethodWrapper<any, any, any, any>): void;

              /**
               * Triggers the event and waits for it to complete.
               *  In languages with threading issues (js/jep) this may cause circular waiting when triggered from the same thread as
               *  the `jsmacros.on` registration for the event
               * @since 1.2.8
               */
              triggerJoin(): void;

              /**
               * Put an Integer into the event.
               * @param name
               * @param i
               * @return
               * @since 1.2.8
               */
              putInt(name: string, i: number): number;

              /**
               * put a String into the event.
               * @param name
               * @param str
               * @return
               * @since 1.2.8
               */
              putString(name: string, str: string): string;

              /**
               * put a Double into the event.
               * @param name
               * @param d
               * @return
               * @since 1.2.8
               */
              putDouble(name: string, d: number): number;

              /**
               * put a Boolean into the event.
               * @param name
               * @param b
               * @return
               * @since 1.2.8
               */
              putBoolean(name: string, b: boolean): boolean;

              /**
               * put anything else into the event.
               * @param name
               * @param o
               * @return
               * @since 1.2.8
               */
              putObject(name: string, o: any): any;

              /**
               * Returns the type of the defined item in the event as a string.
               * @param name
               * @return
               * @since 1.2.8
               */
              getType(name: string): string;

              /**
               * Gets an Integer from the event.
               * @param name
               * @return
               * @since 1.2.8
               */
              getInt(name: string): number;

              /**
               * Gets a String from the event
               * @param name
               * @return
               * @since 1.2.8
               */
              getString(name: string): string;

              /**
               * Gets a Double from the event.
               * @param name
               * @return
               * @since 1.2.8
               */
              getDouble(name: string): number;

              /**
               * Gets a Boolean from the event.
               * @param name
               * @return
               * @since 1.2.8
               */
              getBoolean(name: string): boolean;

              /**
               * Gets an Object from the event.
               * @param name
               * @return
               * @since 1.2.8
               */
              getObject(name: string): any;

              /**
               * @since 1.6.4
               * @return map backing the event
               */
              getUnderlyingMap(): JavaMap<string, any>;

              /**
               * registers event so you can see it in the gui
               * @since 1.3.0
               */
              registerEvent(): void;
            }

            export { EventCustom };
          }

          export { IEventListener, BaseEvent, BaseEventRegistry, impl };
        }

        namespace classes {
          /**
           * @since 1.6.5
           * @param <T> the type of the wrapped class
           */
          const WrappedClassInstance: JavaClassStatics<{
            new <T>(instance: T): WrappedClassInstance<T>;
            new <T>(
              instanceNullable: T,
              tClass: JavaClass<T>
            ): WrappedClassInstance<T>;

            /** @deprecated */ Symbol: unknown;
            /** @deprecated */ apply: unknown;
            /** @deprecated */ arguments: unknown;
            /** @deprecated */ bind: unknown;
            /** @deprecated */ call: unknown;
            /** @deprecated */ caller: unknown;
            /** @deprecated */ length: unknown;
            /** @deprecated */ name: unknown;
            /** @deprecated */ prototype: unknown;
          }>;
          interface WrappedClassInstance<T> extends JavaObject {
            getFieldValue(fieldName: string): any;
            getFieldValueAsClass(asClass: string, fieldName: string): any;
            setFieldValue(fieldName: string, fieldValue: any): void;
            setFieldValueAsClass(
              asClass: string,
              fieldName: string,
              fieldValue: any
            ): void;
            invokeMethod(methodNameOrSig: string, ...params: any[]): any;
            invokeMethodAsClass(
              asClass: string,
              methodNameOrSig: string,
              ...params: any[]
            ): any;

            /**
             * @since 1.6.5
             * @return
             */
            getRawInstance(): T;

            /**
             * @since 1.6.5
             * @return
             */
            getRawClass(): JavaClass<T>;
          }

          /**
           * @author Wagyourtail
           * @since 1.3.1
           */
          const Mappings: JavaClassStatics<[Mappings], [mappingsource: string]>;
          interface Mappings extends JavaObject {
            readonly mappingsource: string;

            /**
             * @return mappings from Intermediary to Named
             * @since 1.3.1
             * @throws IOException will throw if malformed url/path
             */
            getMappings(): JavaMap<string, Mappings$ClassData>;

            /**
             * @return mappings from Named to Intermediary
             * @since 1.3.1
             * @throws IOException will throw if malformed url/path
             */
            getReversedMappings(): JavaMap<string, Mappings$ClassData>;

            /**
             * @since 1.6.0
             * @return
             */
            remapClass<T>(instance: T): Mappings$MappedClass<T>;

            /**
             * gets the class without instance, so can only access static methods/fields
             * @param className
             * @return
             * @throws IOException
             * @throws ClassNotFoundException
             */
            getClass(className: string): Mappings$MappedClass<any>;
          }

          const Mappings$ClassData: JavaClassStatics<
            [Mappings$ClassData],
            [name: string]
          >;
          interface Mappings$ClassData extends JavaObject {
            readonly methods: JavaMap<string, Mappings$MethodData>;
            readonly fields: JavaMap<string, string>;
            readonly name: string;
          }

          /**
           * @since 1.6.0
           * @param <T>
           */
          const Mappings$MappedClass: JavaClassStatics<{
            new <T>(instance: T): Mappings$MappedClass<T>;
            new <T>(instance: T, type: JavaClass<T>): Mappings$MappedClass<T>;

            /** @deprecated */ Symbol: unknown;
            /** @deprecated */ apply: unknown;
            /** @deprecated */ arguments: unknown;
            /** @deprecated */ bind: unknown;
            /** @deprecated */ call: unknown;
            /** @deprecated */ caller: unknown;
            /** @deprecated */ length: unknown;
            /** @deprecated */ name: unknown;
            /** @deprecated */ prototype: unknown;
          }>;
          interface Mappings$MappedClass<T> extends WrappedClassInstance<T> {}

          const Mappings$MethodData: JavaClassStatics<
            [Mappings$MethodData],
            [name: string, sig: java.util.function.Supplier<string>]
          >;
          interface Mappings$MethodData extends JavaObject {
            readonly name: string;
            readonly sig: java.util.function.Supplier<string>;
          }

          export {
            WrappedClassInstance,
            Mappings,
            Mappings$ClassData,
            Mappings$MappedClass,
            Mappings$MethodData,
          };
        }

        namespace helpers {
          const BaseHelper: JavaClassStatics<{
            new <T>(base: T): BaseHelper<T>;

            /** @deprecated */ Symbol: unknown;
            /** @deprecated */ apply: unknown;
            /** @deprecated */ arguments: unknown;
            /** @deprecated */ bind: unknown;
            /** @deprecated */ call: unknown;
            /** @deprecated */ caller: unknown;
            /** @deprecated */ length: unknown;
            /** @deprecated */ name: unknown;
            /** @deprecated */ prototype: unknown;
          }>;
          interface BaseHelper<T> extends JavaObject {
            getRaw(): T;
          }

          export { BaseHelper };
        }

        namespace extensions {
          const ExtensionLoader: JavaClassStatics<
            [ExtensionLoader],
            [core: Core<any, any>]
          >;
          interface ExtensionLoader extends JavaObject {
            isExtensionLoaded(name: string): boolean;
            notLoaded(): boolean;
            getHighestPriorityExtension(): Extension;
            getAllExtensions(): JavaSet<Extension>;
            getExtensionForFile(file: java.io.File): Extension;
            getExtensionForName(lang: string): Extension;
            loadExtensions(): void;
            isGuestObject(obj: any): boolean;
          }

          const Extension: JavaInterfaceStatics & {
            getDependenciesInternal(
              clazz: JavaClass<any>,
              fname: string
            ): JavaSet<java.net.URL>;
            getTranslationsInternal(
              clazz: JavaClass<any>,
              fname: string
            ): JavaMap<string, string>;
          };
          interface Extension extends JavaObject {
            init(): void;
            getPriority(): number;
            getLanguageImplName(): string;
            extensionMatch(file: java.io.File): Extension$ExtMatch;
            defaultFileExtension(): string;

            /**
             * @return a single static instance of the language definition
             */
            getLanguage(runner: Core<any, any>): BaseLanguage<any, any>;
            getLibraries(): JavaSet<JavaClass<any>>;
            getDependencies(): JavaSet<java.net.URL>;
            wrapException(t: java.lang.Throwable): BaseWrappedException<any>;
            getTranslations(lang: string): JavaMap<string, string>;
            isGuestObject(o: any): boolean;
          }

          const Extension$ExtMatch: JavaClassStatics<false> & {
            readonly NOT_MATCH: Extension$ExtMatch;
            readonly MATCH: Extension$ExtMatch;
            readonly MATCH_WITH_NAME: Extension$ExtMatch;

            values(): Extension$ExtMatch[];
            valueOf(name: string): Extension$ExtMatch;
          };
          interface Extension$ExtMatch
            extends java.lang.Enum<Extension$ExtMatch> {
            isMatch(): boolean;
          }

          export { ExtensionLoader, Extension, Extension$ExtMatch };
        }

        export {
          MethodWrapper,
          Core,
          language,
          library,
          config,
          service,
          event,
          classes,
          helpers,
          extensions,
        };
      }

      namespace client {
        namespace api {
          namespace helpers {
            /**
             * @author Etheradon
             * @since 1.6.5
             */
            const BlockHelper: JavaClassStatics<
              [BlockHelper],
              [base: /* minecraft class */ any]
            >;
            interface BlockHelper extends BaseHelper {
              /**
               * @return the default state of the block.
               * @since 1.6.5
               */
              getDefaultState(): BlockStateHelper;

              /**
               * @return the default item stack of the block.
               * @since 1.6.5
               */
              getDefaultItemStack(): ItemStackHelper;
              canMobSpawnInside(): boolean;

              /**
               * @return {@code true} if the block has dynamic bounds.
               * @since 1.6.5
               */
              hasDynamicBounds(): boolean;

              /**
               * @return the blast resistance.
               * @since 1.6.5
               */
              getBlastResistance(): number;

              /**
               * @return the jump velocity multiplier.
               * @since 1.6.5
               */
              getJumpVelocityMultiplier(): number;

              /**
               * @return the slipperiness.
               * @since 1.6.5
               */
              getSlipperiness(): number;

              /**
               * @return the hardness.
               * @since 1.6.5
               */
              getHardness(): number;

              /**
               * @return the velocity multiplier.
               * @since 1.6.5
               */
              getVelocityMultiplier(): number;

              /**
               * @return all tags of the block as an {@link java.util.ArrayList ArrayList}.
               * @since 1.6.5
               */
              getTags(): JavaList<BlockTag>;

              /**
               * @return all possible block states of the block.
               * @since 1.6.5
               */
              getStates(): JavaList<BlockStateHelper>;

              /**
               * @return the identifier of the block.
               * @since 1.6.5
               */
              getId(): BlockId;
            }

            /**
             * @author Wagyourtail
             * @since 1.1.7
             */
            const OptionsHelper: JavaClassStatics<
              [OptionsHelper],
              [options: /* minecraft class */ any]
            >;
            interface OptionsHelper extends BaseHelper {
              /**
               * @since 1.1.7
               * @return 0: off, 2: fancy
               */
              getCloudMode(): number;

              /**
               * @since 1.1.7
               * @param mode 0: off, 2: fancy
               * @return
               */
              setCloudMode(mode: number): OptionsHelper;

              /**
               * @since 1.1.7
               * @return
               */
              getGraphicsMode(): number;

              /**
               * @since 1.1.7
               * @param mode 0: fast, 2: fabulous
               * @return
               */
              setGraphicsMode(mode: number): OptionsHelper;

              /**
               * @since 1.1.7
               * @return list of names of resource packs.
               */
              getResourcePacks(): JavaList<string>;

              /**
               * @since 1.2.0
               * @return list of names of enabled resource packs.
               */
              getEnabledResourcePacks(): JavaList<string>;

              /**
               * Set the enabled resource packs to the provided list.
               * @since 1.2.0
               * @param enabled
               * @return
               */
              setEnabledResourcePacks(enabled: string[]): OptionsHelper;

              /**
               * @since 1.8.3
               * @param state false to put it back
               */
              removeServerResourcePack(state: boolean): void;

              /**
               * @since 1.1.7
               * @return
               */
              isRightHanded(): boolean;

              /**
               * @since 1.1.7
               * @param val
               */
              setRightHanded(val: boolean): void;

              /**
               * @since 1.1.7
               * @return
               */
              getFov(): number;

              /**
               * @since 1.1.7
               * @param fov (int since 1.7.0)
               * @return
               */
              setFov(fov: number): OptionsHelper;

              /**
               * @since 1.1.7
               * @return
               */
              getRenderDistance(): number;

              /**
               * @since 1.1.7
               * @param d
               */
              setRenderDistance(d: number): void;

              /**
               * @since 1.2.6
               * @return
               */
              getWidth(): number;

              /**
               * @since 1.2.6
               * @return
               */
              getHeight(): number;

              /**
               * @since 1.2.6
               * @param w
               */
              setWidth(w: number): void;

              /**
               * @since 1.2.6
               * @param h
               */
              setHeight(h: number): void;

              /**
               * @since 1.2.6
               * @param w
               * @param h
               */
              setSize(w: number, h: number): void;

              /**
               * @since 1.3.0
               *  normal values for gamam are between {@code 0} and {@code 1}
               */
              getGamma(): number;

              /**
               * @since 1.3.0
               *  normal values for gamma are between {@code 0} and {@code 1}
               */
              setGamma(gamma: number): void;

              /**
               * @since 1.3.1
               * @param vol
               */
              setVolume(vol: number): void;

              /**
               * set volume by category.
               * @since 1.3.1
               * @param category
               * @param volume
               */
              setVolume(category: string, volume: number): void;

              /**
               * @since 1.3.1
               * @return
               */
              getVolumes(): JavaMap<string, number>;

              /**
               * sets gui scale, `0` for auto.
               * @since 1.3.1
               * @param scale
               */
              setGuiScale(scale: number): void;

              /**
               * @since 1.3.1
               * @return gui scale, {@code 0} for auto.
               */
              getGuiScale(): number;

              /**
               * @param category
               * @since 1.3.1
               * @return
               */
              getVolume(category: string): number;

              /**
               * @since 1.5.0
               * @return
               */
              getSmoothCamera(): boolean;

              /**
               * @param val
               * @since 1.5.0
               */
              setSmoothCamera(val: boolean): void;

              /**
               * @since 1.5.0
               * @return 0 for 1st person, 2 for in front.
               */
              getCameraMode(): number;

              /**
               * @param mode 0: first, 2: front
               * @since 1.5.0
               */
              setCameraMode(mode: number): void;
            }

            /** @since 1.6.5 */
            const ServerInfoHelper: JavaClassStatics<
              [ServerInfoHelper],
              [base: /* minecraft class */ any]
            >;
            interface ServerInfoHelper extends BaseHelper {
              getName(): string;
              getAddress(): string;
              getPlayerCountLabel(): TextHelper;
              getLabel(): TextHelper;
              getPing(): number;
              getProtocolVersion(): number;
              getVersion(): TextHelper;
              getPlayerListSummary(): JavaList<TextHelper>;
              resourcePackPolicy(): string;
              getIcon(): string;
              isOnline(): boolean;
              isLocal(): boolean;
              getNbt(): NBTElementHelper;
            }

            const CommandNodeHelper: JavaClassStatics<
              [CommandNodeHelper],
              [
                base: com.mojang.brigadier.tree.CommandNode,
                fabric: com.mojang.brigadier.tree.CommandNode
              ]
            >;
            interface CommandNodeHelper
              extends BaseHelper<com.mojang.brigadier.tree.CommandNode<any>> {
              readonly fabric: com.mojang.brigadier.tree.CommandNode;
            }

            /**
             * @author Wagyourtail
             */
            const PlayerEntityHelper: JavaClassStatics<{
              new <T>(e: T): PlayerEntityHelper<T>;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface PlayerEntityHelper<T = /* minecraft class */ any>
              extends LivingEntityHelper<T> {
              /**
               * @since 1.0.3
               * @return
               */
              getAbilities(): PlayerAbilitiesHelper;

              /** @since 1.2.0 */
              getMainHand(): ItemStackHelper;

              /** @since 1.2.0 */
              getOffHand(): ItemStackHelper;

              /** @since 1.2.0 */
              getHeadArmor(): ItemStackHelper;

              /** @since 1.2.0 */
              getChestArmor(): ItemStackHelper;

              /** @since 1.2.0 */
              getLegArmor(): ItemStackHelper;

              /** @since 1.2.0 */
              getFootArmor(): ItemStackHelper;

              /**
               * @since 1.2.5 [citation needed]
               * @return
               */
              getXP(): number;

              /**
               * @since 1.6.5
               * @return
               */
              getXPLevel(): number;

              /**
               * @since 1.6.5
               * @return
               */
              getXPProgress(): number;

              /**
               * @since 1.6.5
               * @return
               */
              getXPToLevelUp(): number;

              /**
               * @since 1.2.5 [citation needed]
               * @return
               */
              isSleeping(): boolean;

              /**
               * @since 1.2.5 [citation needed]
               * @return if the player has slept the minimum ammount of time to pass the night.
               */
              isSleepingLongEnough(): boolean;
            }

            /**
             * @author Wagyourtail
             * @since 1.2.6
             */
            const BlockPosHelper: JavaClassStatics<{
              new (b: /* minecraft class */ any): BlockPosHelper;
              new (x: number, y: number, z: number): BlockPosHelper;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface BlockPosHelper extends BaseHelper {
              /**
               * @since 1.2.6
               * @return the {@code x} value of the block.
               */
              getX(): number;

              /**
               * @since 1.2.6
               * @return the {@code y} value of the block.
               */
              getY(): number;

              /**
               * @since 1.2.6
               * @return the {@code z} value of the block.
               */
              getZ(): number;

              /**
               * @return the block above.
               * @since 1.6.5
               */
              up(): BlockPosHelper;

              /**
               * @param distance
               * @return the block n-th block above.
               * @since 1.6.5
               */
              up(distance: number): BlockPosHelper;

              /**
               * @return the block below.
               * @since 1.6.5
               */
              down(): BlockPosHelper;

              /**
               * @param distance
               * @return the block n-th block below.
               * @since 1.6.5
               */
              down(distance: number): BlockPosHelper;

              /**
               * @return the block to the north.
               * @since 1.6.5
               */
              north(): BlockPosHelper;

              /**
               * @param distance
               * @return the n-th block to the north.
               * @since 1.6.5
               */
              north(distance: number): BlockPosHelper;

              /**
               * @return the block to the south.
               * @since 1.6.5
               */
              south(): BlockPosHelper;

              /**
               * @param distance
               * @return the n-th block to the south.
               * @since 1.6.5
               */
              south(distance: number): BlockPosHelper;

              /**
               * @return the block to the east.
               * @since 1.6.5
               */
              east(): BlockPosHelper;

              /**
               * @param distance
               * @return the n-th block to the east.
               * @since 1.6.5
               */
              east(distance: number): BlockPosHelper;

              /**
               * @return the block to the west.
               * @since 1.6.5
               */
              west(): BlockPosHelper;

              /**
               * @param distance
               * @return the n-th block to the west.
               * @since 1.6.5
               */
              west(distance: number): BlockPosHelper;

              /**
               * @param direction 0-5 in order: [DOWN, UP, NORTH, SOUTH, WEST, EAST];
               * @return the block offset by the given direction.
               * @since 1.6.5
               */
              offset(direction: string): BlockPosHelper;

              /**
               * @param direction 0-5 in order: [DOWN, UP, NORTH, SOUTH, WEST, EAST];
               * @param distance
               * @return the n-th block offset by the given direction.
               * @since 1.6.5
               */
              offset(direction: string, distance: number): BlockPosHelper;
            }

            /**
             * @author Etheradon
             * @since 1.6.5
             */
            const BlockStateHelper: JavaClassStatics<
              [BlockStateHelper],
              [base: /* minecraft class */ any]
            >;
            interface BlockStateHelper extends BaseHelper {
              /**
               * @return a map of the state properties with its identifier and value.
               * @since 1.6.5
               */
              toMap(): JavaMap<string, string>;

              /**
               * @return the block the state belongs to.
               * @since 1.6.5
               */
              getBlock(): BlockHelper;

              /**
               * @return the hardness.
               * @since 1.6.5
               */
              getHardness(): number;

              /**
               * @return the luminance.
               * @since 1.6.5
               */
              getLuminance(): number;

              /**
               * @return {@code true} if the state emits redstone power.
               * @since 1.6.5
               */
              emitsRedstonePower(): boolean;

              /**
               * @return {@code true} if the shape of the state is a cube.
               * @since 1.6.5
               */
              exceedsCube(): boolean;

              /**
               * @return {@code true} if the state is air.
               * @since 1.6.5
               */
              isAir(): boolean;

              /**
               * @return {@code true} if the state is opaque.
               * @since 1.6.5
               */
              isOpaque(): boolean;

              /**
               * @return {@code true} if a tool is required to mine the block.
               * @since 1.6.5
               */
              isToolRequired(): boolean;

              /**
               * @return {@code true} if the state has a block entity.
               * @since 1.6.5
               */
              hasBlockEntity(): boolean;

              /**
               * @return {@code true} if the state can be random ticked.
               * @since 1.6.5
               */
              hasRandomTicks(): boolean;

              /**
               * @return {@code true} if the state has a comparator output.
               * @since 1.6.5
               */
              hasComparatorOutput(): boolean;

              /**
               * @return the piston behaviour of the state.
               * @since 1.6.5
               */
              getPistonBehaviour(): PistonBehaviour;

              /**
               * @return {@code true} if the state blocks light.
               * @since 1.6.5
               */
              blocksLight(): boolean;

              /**
               * @return {@code true} if the state blocks the movement of entities.
               * @since 1.6.5
               */
              blocksMovement(): boolean;

              /**
               * @return {@code true} if the state is burnable.
               * @since 1.6.5
               */
              isBurnable(): boolean;

              /**
               * @return {@code true} if the state is a liquid.
               * @since 1.6.5* @since 1.6.5
               */
              isLiquid(): boolean;

              /**
               * @return {@code true} if the state is solid.
               * @since 1.6.5* @since 1.6.5
               */
              isSolid(): boolean;

              /**
               * This will return true for blocks like air and grass, that can be replaced
               *  without breaking them first.
               * @return {@code true} if the state can be replaced.
               * @since 1.6.5
               */
              isReplaceable(): boolean;

              /**
               * @param pos
               * @param entity
               * @return {@code true} if the entity can spawn on this block state at the given position in the current world.
               * @since 1.6.5
               */
              allowsSpawning(pos: BlockPosHelper, entity: string): boolean;

              /**
               * @param pos
               * @return {@code true} if an entity can suffocate in this block state at the given position in the current world.
               * @since 1.6.5
               */
              shouldSuffocate(pos: BlockPosHelper): boolean;
            }

            /**
             * @author Wagyourtail
             */
            const EntityHelper: JavaClassStatics<false> & {
              /**
               * mostly for internal use.
               * @param e mc entity.
               * @return correct subclass of this.
               */
              create(e: /* minecraft class */ any): EntityHelper;
            };
            interface EntityHelper<T = /* minecraft class */ any>
              extends BaseHelper<T> {
              /**
               * @return entity position.
               */
              getPos(): PositionCommon$Pos3D;

              /**
               * @return entity block position.
               * @since 1.6.5
               */
              getBlockPos(): PositionCommon$Pos3D;

              /**
               * @return entity chunk coordinates. Since Pos2D only has x and y fields, z coord is y.
               * @since 1.6.5
               */
              getChunkPos(): PositionCommon$Pos2D;

              /**
               * @since 1.0.8
               * @return the {@code x} value of the entity.
               */
              getX(): number;

              /**
               * @since 1.0.8
               * @return the {@code y} value of the entity.
               */
              getY(): number;

              /**
               * @since 1.0.8
               * @return the {@code z} value of the entity.
               */
              getZ(): number;

              /**
               * @since 1.2.8
               * @return the current eye height offset for the entitye.
               */
              getEyeHeight(): number;

              /**
               * @since 1.0.8
               * @return the {@code pitch} value of the entity.
               */
              getPitch(): number;

              /**
               * @since 1.0.8
               * @return the {@code yaw} value of the entity.
               */
              getYaw(): number;

              /**
               * @return the name of the entity.
               * @since 1.0.8 [citation needed], returned string until 1.6.4
               */
              getName(): TextHelper;

              /**
               * @return the type of the entity.
               */
              getType(): EntityId;

              /**
               * @since 1.1.9
               * @return if the entity has the glowing effect.
               */
              isGlowing(): boolean;

              /**
               * @since 1.1.9
               * @return if the entity is in lava.
               */
              isInLava(): boolean;

              /**
               * @since 1.1.9
               * @return if the entity is on fire.
               */
              isOnFire(): boolean;

              /**
               * @since 1.1.8 [citation needed]
               * @return the vehicle of the entity.
               */
              getVehicle(): EntityHelper;

              /**
               * @since 1.1.8 [citation needed]
               * @return the entity passengers.
               */
              getPassengers(): JavaList<EntityHelper>;

              /**
               * @since 1.2.8, was a {@link String} until 1.5.0
               * @return
               */
              getNBT(): NBTElementHelper;

              /**
               * @since 1.6.4
               * @param name
               */
              setCustomName(name: TextHelper): void;

              /**
               * sets the name to always display
               * @since 1.8.0
               * @param b
               */
              setCustomNameVisible(b: boolean): void;

              /**
               * @param color
               */
              setGlowingColor(color: number): void;

              /**
               */
              resetGlowingColor(): void;

              /**
               * warning: affected by setGlowingColor
               * @since 1.8.2
               * @return glow color
               */
              getGlowingColor(): number;

              /**
               * Sets whether the entity is glowing.
               * @since 1.1.9
               * @param val
               * @return
               */
              setGlowing(val: boolean): EntityHelper<T>;

              /**
               * reset the glowing effect to proper value.
               * @since 1.6.3
               * @return
               */
              resetGlowing(): EntityHelper<T>;

              /**
               * Checks if the entity is still alive.
               * @since 1.2.8
               * @return
               */
              isAlive(): boolean;

              /**
               * @since 1.6.5
               * @return UUID of the entity, random* if not a player, otherwise the player's uuid.
               */
              getUUID(): string;

              /**
               * @since 1.6.3
               * @return cast of this entity helper (mainly for typescript)
               */
              asClientPlayer(): ClientPlayerEntityHelper;

              /**
               * @since 1.6.3
               * @return cast of this entity helper (mainly for typescript)
               */
              asPlayer(): PlayerEntityHelper;

              /**
               * @since 1.6.3
               * @return cast of this entity helper (mainly for typescript)
               */
              asVillager(): VillagerEntityHelper;

              /**
               * @since 1.6.3
               * @return cast of this entity helper (mainly for typescript)
               */
              asMerchant(): MerchantEntityHelper;

              /**
               * @since 1.6.3
               * @return cast of this entity helper (mainly for typescript)
               */
              asLiving(): LivingEntityHelper;

              /**
               * @since 1.6.3
               * @return cast of this entity helper (mainly for typescript)
               */
              asItem(): ItemEntityHelper;
            }

            const StatsHelper: JavaClassStatics<
              [StatsHelper],
              [base: /* minecraft class */ any]
            >;
            interface StatsHelper extends BaseHelper {
              getStatList(): JavaList<string>;
              getStatText(statKey: string): /* minecraft class */ any;
              getRawStatValue(statKey: string): number;
              getFormattedStatValue(statKey: string): string;
              getFormattedStatMap(): JavaMap<string, string>;
              getRawStatMap(): JavaMap<string, number>;
            }

            /**
             * @author Wagyourtail
             * @since 1.0.3
             */
            const ClientPlayerEntityHelper: JavaClassStatics<{
              new <T>(e: T): ClientPlayerEntityHelper<T>;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface ClientPlayerEntityHelper<T = /* minecraft class */ any>
              extends PlayerEntityHelper<T> {
              /**
               * @param yaw (was pitch prior to 1.2.6)
               * @param pitch (was yaw prior to 1.2.6)
               * @return
               * @since 1.0.3
               */
              lookAt(yaw: number, pitch: number): ClientPlayerEntityHelper<T>;

              /**
               * look at the specified coordinates.
               * @param x
               * @param y
               * @param z
               * @return
               * @since 1.2.8
               */
              lookAt(
                x: number,
                y: number,
                z: number
              ): ClientPlayerEntityHelper<T>;

              /**
               * @param entity
               * @since 1.5.0
               */
              attack(entity: EntityHelper): ClientPlayerEntityHelper<T>;

              /**
               * @since 1.6.0
               * @param await
               * @param entity
               */
              attack(
                entity: EntityHelper,
                await: boolean
              ): ClientPlayerEntityHelper<T>;

              /**
               * @param x
               * @param y
               * @param z
               * @param direction 0-5 in order: [DOWN, UP, NORTH, SOUTH, WEST, EAST];
               * @since 1.5.0
               */
              attack(
                x: number,
                y: number,
                z: number,
                direction: number
              ): ClientPlayerEntityHelper<T>;

              /**
               * @since 1.6.0
               * @param x
               * @param y
               * @param z
               * @param direction 0-5 in order: [DOWN, UP, NORTH, SOUTH, WEST, EAST];
               * @param await
               * @throws InterruptedException
               */
              attack(
                x: number,
                y: number,
                z: number,
                direction: number,
                await: boolean
              ): ClientPlayerEntityHelper<T>;

              /**
               * @param entity
               * @param offHand
               * @since 1.5.0, renamed from {@code interact} in 1.6.0
               */
              interactEntity(
                entity: EntityHelper,
                offHand: boolean
              ): ClientPlayerEntityHelper<T>;

              /**
               * @param entity
               * @param offHand
               * @param await
               * @since 1.6.0
               * @throws InterruptedException
               */
              interactEntity(
                entity: EntityHelper,
                offHand: boolean,
                await: boolean
              ): ClientPlayerEntityHelper<T>;

              /**
               * @param offHand
               * @since 1.5.0, renamed from {@code interact} in 1.6.0
               */
              interactItem(offHand: boolean): ClientPlayerEntityHelper<T>;

              /**
               * @since 1.6.0
               * @param offHand
               * @param await
               */
              interactItem(
                offHand: boolean,
                await: boolean
              ): ClientPlayerEntityHelper<T>;

              /**
               * @param x
               * @param y
               * @param z
               * @param direction 0-5 in order: [DOWN, UP, NORTH, SOUTH, WEST, EAST];
               * @param offHand
               * @since 1.5.0, renamed from {@code interact} in 1.6.0
               */
              interactBlock(
                x: number,
                y: number,
                z: number,
                direction: number,
                offHand: boolean
              ): ClientPlayerEntityHelper<T>;
              interactBlock(
                x: number,
                y: number,
                z: number,
                direction: number,
                offHand: boolean,
                await: boolean
              ): ClientPlayerEntityHelper<T>;

              /** @since 1.5.0 */
              interact(): ClientPlayerEntityHelper<T>;

              /**
               * @since 1.6.0
               * @param await
               */
              interact(await: boolean): ClientPlayerEntityHelper<T>;

              /** @since 1.5.0 */
              attack(): ClientPlayerEntityHelper<T>;

              /**
               * @since 1.6.0
               * @param await
               */
              attack(await: boolean): ClientPlayerEntityHelper<T>;

              /**
               * @param stop
               * @since 1.6.3
               * @return
               */
              setLongAttack(stop: boolean): ClientPlayerEntityHelper<T>;

              /**
               * @param stop
               * @since 1.6.3
               * @return
               */
              setLongInteract(stop: boolean): ClientPlayerEntityHelper<T>;

              /**
               * @since 1.6.5
               * @return
               */
              getItemCooldownsRemainingTicks(): JavaMap<ItemId, number>;

              /**
               * @param item
               * @since 1.6.5
               * @return
               */
              getItemCooldownRemainingTicks(item: ItemId): number;

              /**
               * @since 1.6.5
               * @return
               */
              getTicksSinceCooldownsStart(): JavaMap<ItemId, number>;

              /**
               * @param item
               * @since 1.6.5
               * @return
               */
              getTicksSinceCooldownStart(item: ItemId): number;

              /**
               * @return
               * @since 1.1.2
               */
              getFoodLevel(): number;
            }

            /** @since 1.4.2 */
            const CommandContextHelper: JavaClassStatics<
              [CommandContextHelper],
              [base: com.mojang.brigadier.context.CommandContext<any>]
            >;
            interface CommandContextHelper
              extends BaseHelper<
                  com.mojang.brigadier.context.CommandContext<any>
                >,
                Events.BaseEvent {
              /**
               * @param name
               * @return
               * @since 1.4.2
               * @throws CommandSyntaxException
               */
              getArg(name: string): any;
              getChild(): CommandContextHelper;
              getRange(): com.mojang.brigadier.context.StringRange;
              getInput(): string;
            }

            /**
             * @author Wagyourtail
             */
            const BlockDataHelper: JavaClassStatics<
              [BlockDataHelper],
              [
                b: /* minecraft class */ any,
                e: /* minecraft class */ any,
                bp: /* minecraft class */ any
              ]
            >;
            interface BlockDataHelper extends BaseHelper {
              /**
               * @since 1.1.7
               * @return the {@code x} value of the block.
               */
              getX(): number;

              /**
               * @since 1.1.7
               * @return the {@code y} value of the block.
               */
              getY(): number;

              /**
               * @since 1.1.7
               * @return the {@code z} value of the block.
               */
              getZ(): number;

              /**
               * @return the item ID of the block.
               */
              getId(): BlockId;

              /**
               * @return the translated name of the block. (was string before 1.6.5)
               */
              getName(): TextHelper;

              /**
               * @return
               * @since 1.5.1, used to be a {@link Map}&lt;{@link String}, {@link String}&gt;
               */
              getNBT(): NBTElementHelper;

              /**
               * @return
               * @since 1.6.5
               */
              getBlockStateHelper(): BlockStateHelper;

              /**
               * @return
               * @since 1.6.5
               */
              getBlockHelper(): BlockHelper;

              /**
               * @since 1.1.7
               * @return block state data as a {@link Map}.
               */
              getBlockState(): JavaMap<string, string>;

              /**
               * @since 1.2.7
               * @return the block pos.
               */
              getBlockPos(): BlockPosHelper;
              getRawBlock(): /* minecraft class */ any;
              getRawBlockState(): /* minecraft class */ any;
              getRawBlockEntity(): /* minecraft class */ any;
            }

            /**
             * @author Wagyourtail
             * @since 1.0.2
             */
            const PlayerListEntryHelper: JavaClassStatics<
              [PlayerListEntryHelper],
              [p: /* minecraft class */ any]
            >;
            interface PlayerListEntryHelper extends BaseHelper {
              /**
               * @since 1.1.9
               * @return
               */
              getUUID(): string;

              /**
               * @since 1.0.2
               * @return
               */
              getName(): string;

              /**
               * @since 1.6.5
               * @return
               */
              getPing(): number;

              /**
               * @since 1.6.5
               * @return null if unknown
               */
              getGamemode(): Gamemode;

              /**
               * @since 1.1.9
               * @return
               */
              getDisplayText(): TextHelper;

              /**
               * @since 1.8.2
               * @return
               */
              getPublicKey(): number[];
            }

            /**
             * @since 1.2.9
             * @author Wagyourtail
             */
            const ScoreboardsHelper: JavaClassStatics<
              [ScoreboardsHelper],
              [board: /* minecraft class */ any]
            >;
            interface ScoreboardsHelper extends BaseHelper {
              /**
               * @param index
               * @since 1.2.9
               * @return
               */
              getObjectiveForTeamColorIndex(
                index: number
              ): ScoreboardObjectiveHelper;

              /**
               * `0` is tab list, `1` or `3 + getPlayerTeamColorIndex()` is sidebar, `2` should be below name.
               *  therefore max slot number is 18.
               * @param slot
               * @since 1.2.9
               * @return
               */
              getObjectiveSlot(slot: number): ScoreboardObjectiveHelper;

              /**
               * @param entity
               * @since 1.2.9
               * @return
               */
              getPlayerTeamColorIndex(entity: PlayerEntityHelper): number;

              /**
               * @since 1.6.5
               * @return team index for client player
               */
              getPlayerTeamColorIndex(): number;

              /**
               * @since 1.3.0
               * @return
               */
              getTeams(): JavaList<TeamHelper>;

              /**
               * @param p
               * @since 1.3.0
               * @return
               */
              getPlayerTeam(p: PlayerEntityHelper): TeamHelper;

              /**
               * @since 1.6.5
               * @return team for client player
               */
              getPlayerTeam(): TeamHelper;

              /**
               * @since 1.2.9
               * @return the {@link ScoreboardObjectiveHelper} for the currently displayed sidebar scoreboard.
               */
              getCurrentScoreboard(): ScoreboardObjectiveHelper;
            }

            /**
             * @author Wagyourtail
             * @since 1.0.8
             */
            const TextHelper: JavaClassStatics<
              [TextHelper],
              [t: /* minecraft class */ any]
            >;
            interface TextHelper extends BaseHelper {
              /**
               * replace the text in this class with JSON data.
               * @since 1.0.8
               * @param json
               * @return
               */
              replaceFromJson(json: string): TextHelper;

              /**
               * replace the text in this class with {@link java.lang.String} data.
               * @since 1.0.8
               * @param content
               * @return
               */
              replaceFromString(content: string): TextHelper;

              /**
               * @since 1.2.7
               * @return JSON data representation.
               */
              getJson(): string;

              /**
               * @since 1.2.7
               * @return the text content.
               */
              getString(): string;

              /**
               * @since 1.6.5
               * @return the text content. stripped formatting when servers send it the (super) old way due to shitty coders.
               */
              getStringStripFormatting(): string;

              /**
               * @param visitor function with 2 args, no return.
               * @since 1.6.5
               */
              visit(
                visitor: MethodWrapper<StyleHelper, string, any, any>
              ): void;

              /**
               * @since 1.0.8
               * @deprecated confusing name.
               * @return
               */
              toJson(): string;

              /**
               * @since 1.0.8, this used to do the same as {@link #getString}
               * @return String representation of text helper.
               */
              toString(): string;
            }

            /**
             * @author Wagyourtail
             * @since 1.2.1
             */
            const BossBarHelper: JavaClassStatics<
              [BossBarHelper],
              [b: /* minecraft class */ any]
            >;
            interface BossBarHelper extends BaseHelper {
              /**
               * @since 1.2.1
               * @return boss bar uuid.
               */
              getUUID(): string;

              /**
               * @since 1.2.1
               * @return percent of boss bar remaining.
               */
              getPercent(): number;

              /**
               * @since 1.2.1
               * @return boss bar color.
               */
              getColor(): BossBarColor;

              /**
               * @since 1.2.1
               * @return boss bar notch style.
               */
              getStyle(): BossBarStyle;

              /**
               * @since 1.2.1
               * @return name of boss bar
               */
              getName(): TextHelper;
            }

            /**
             * @author Wagyourtail
             */
            const ItemStackHelper: JavaClassStatics<
              [ItemStackHelper],
              [i: /* minecraft class */ any]
            >;
            interface ItemStackHelper extends BaseHelper {
              /**
               * Sets the item damage value.
               *
               *  You may want to use {@link ItemStackHelper#copy} first.
               * @since 1.2.0
               * @param damage
               * @return
               */
              setDamage(damage: number): ItemStackHelper;

              /**
               * @since 1.2.0
               * @return
               */
              isDamageable(): boolean;

              /**
               * @since 1.2.0
               * @return
               */
              isEnchantable(): boolean;

              /**
               * @return
               */
              getDamage(): number;

              /**
               * @return
               */
              getMaxDamage(): number;

              /**
               * @since 1.2.0
               * @return was string before 1.6.5
               */
              getDefaultName(): TextHelper;

              /**
               * @return was string before 1.6.5
               */
              getName(): TextHelper;

              /**
               * @return
               */
              getCount(): number;

              /**
               * @return
               */
              getMaxCount(): number;

              /**
               * @since 1.1.6, was a {@link String} until 1.5.1
               * @return
               */
              getNBT(): NBTElementHelper;

              /**
               * @since 1.1.3
               * @return
               */
              getCreativeTab(): string;

              /**
               * @return
               * @deprecated
               */
              getItemID(): string;

              /**
               * @since 1.6.4
               * @return
               */
              getItemId(): ItemId;

              /**
               * @since 1.8.2
               * @return
               */
              getTags(): JavaList<ItemTag>;

              /**
               * @since 1.8.2
               * @return
               */
              isFood(): boolean;

              /**
               * @since 1.8.2
               * @return
               */
              isTool(): boolean;

              /**
               * @since 1.8.2
               * @return
               */
              isWearable(): boolean;

              /**
               * @since 1.8.2
               * @return
               */
              getMiningLevel(): number;

              /**
               * @return
               */
              isEmpty(): boolean;

              /**
               * @since 1.1.3 [citation needed]
               * @param ish
               * @return
               */
              equals(ish: ItemStackHelper): boolean;

              /**
               * @since 1.1.3 [citation needed]
               * @param is
               * @return
               */
              equals(is: /* minecraft class */ any): boolean;
              equals(arg0: any): boolean;

              /**
               * @since 1.1.3 [citation needed]
               * @param ish
               * @return
               */
              isItemEqual(ish: ItemStackHelper): boolean;

              /**
               * @since 1.1.3 [citation needed]
               * @param is
               * @return
               */
              isItemEqual(is: /* minecraft class */ any): boolean;

              /**
               * @since 1.1.3 [citation needed]
               * @param ish
               * @return
               */
              isItemEqualIgnoreDamage(ish: ItemStackHelper): boolean;

              /**
               * @since 1.1.3 [citation needed]
               * @param is
               * @return
               */
              isItemEqualIgnoreDamage(is: /* minecraft class */ any): boolean;

              /**
               * @since 1.1.3 [citation needed]
               * @param ish
               * @return
               */
              isNBTEqual(ish: ItemStackHelper): boolean;

              /**
               * @since 1.1.3 [citation needed]
               * @param is
               * @return
               */
              isNBTEqual(is: /* minecraft class */ any): boolean;

              /**
               * @since 1.6.5
               * @return
               */
              isOnCooldown(): boolean;

              /**
               * @since 1.6.5
               * @return
               */
              getCooldownProgress(): number;

              /**
               * @since 1.2.0
               * @return
               */
              copy(): ItemStackHelper;
            }

            /** @since 1.6.3 */
            const VillagerEntityHelper: JavaClassStatics<
              [VillagerEntityHelper],
              [e: /* minecraft class */ any]
            >;
            interface VillagerEntityHelper extends MerchantEntityHelper {
              /**
               * @since 1.6.3
               * @return
               */
              getProfession(): VillagerProfession;

              /**
               * @since 1.6.3
               * @return
               */
              getStyle(): VillagerStyle;

              /**
               * @since 1.6.3
               * @return
               */
              getLevel(): number;
            }

            /** @since 1.5.1 */
            const NBTElementHelper: JavaClassStatics<false> & {
              /** @since 1.5.1 */
              resolve(element: /* minecraft class */ any): NBTElementHelper;
            };
            interface NBTElementHelper<T = /* minecraft class */ any>
              extends BaseHelper<T> {
              /** @since 1.5.1 */
              getType(): number;

              /** @since 1.5.1 */
              isNull(): boolean;

              /** @since 1.5.1 */
              isNumber(): boolean;

              /** @since 1.5.1 */
              isString(): boolean;

              /** @since 1.5.1 */
              isList(): boolean;

              /** @since 1.5.1 */
              isCompound(): boolean;

              /**
               * if element is a string, returns value.
               *  otherwise returns toString representation.
               * @since 1.5.1
               */
              asString(): string;

              /**
               * check with {@link #isNumber} first
               * @since 1.5.1
               */
              asNumberHelper(): NBTElementHelper$NBTNumberHelper;

              /**
               * check with {@link #isList} first
               * @since 1.5.1
               */
              asListHelper(): NBTElementHelper$NBTListHelper;

              /**
               * check with {@link #isCompound} first
               * @since 1.5.1
               */
              asCompoundHelper(): NBTElementHelper$NBTCompoundHelper;
            }

            /**
             * @author Wagyourtail
             * @since 1.2.9
             */
            const ScoreboardObjectiveHelper: JavaClassStatics<
              [ScoreboardObjectiveHelper],
              [o: /* minecraft class */ any]
            >;
            interface ScoreboardObjectiveHelper extends BaseHelper {
              /**
               * @return player name to score map
               */
              getPlayerScores(): JavaMap<string, number>;

              /**
               * @since 1.8.0
               * @return
               */
              scoreToDisplayName(): JavaMap<number, TextHelper>;

              /**
               * @since 1.7.0
               * @return
               */
              getKnownPlayers(): JavaList<string>;

              /**
               * @since 1.8.0
               * @return
               */
              getKnownPlayersDisplayNames(): JavaList<TextHelper>;

              /**
               * @return name of scoreboard
               * @since 1.2.9
               */
              getName(): string;

              /**
               * @return name of scoreboard
               * @since 1.2.9
               */
              getDisplayName(): TextHelper;
            }

            /**
             * @author Wagyourtail
             * @since 1.3.0
             */
            const TeamHelper: JavaClassStatics<
              [TeamHelper],
              [t: /* minecraft class */ any]
            >;
            interface TeamHelper extends BaseHelper {
              /**
               * @since 1.3.0
               * @return
               */
              getName(): string;

              /**
               * @since 1.3.0
               * @return
               */
              getDisplayName(): TextHelper;

              /**
               * @since 1.3.0
               * @return
               */
              getPlayerList(): JavaList<string>;

              /**
               * @since 1.3.0
               * @return
               */
              getColor(): number;

              /**
               * @since 1.3.0
               * @return
               */
              getPrefix(): TextHelper;

              /**
               * @since 1.3.0
               * @return
               */
              getSuffix(): TextHelper;

              /**
               * @since 1.3.0
               * @return
               */
              getCollisionRule(): string;

              /**
               * @since 1.3.0
               * @return
               */
              isFriendlyFire(): boolean;

              /**
               * @since 1.3.0
               * @return
               */
              showFriendlyInvisibles(): boolean;

              /**
               * @since 1.3.0
               * @return
               */
              nametagVisibility(): string;

              /**
               * @since 1.3.0
               * @return
               */
              deathMessageVisibility(): string;
            }

            /**
             * @author Wagyourtail
             * @since 1.6.5
             */
            const StyleHelper: JavaClassStatics<
              [StyleHelper],
              [base: /* minecraft class */ any]
            >;
            interface StyleHelper extends BaseHelper {
              hasColor(): boolean;
              getColor(): number;
              hasCustomColor(): boolean;
              getCustomColor(): number;
              bold(): boolean;
              italic(): boolean;
              underlined(): boolean;
              strikethrough(): boolean;
              obfuscated(): boolean;
              getClickAction(): TextClickAction;
              getClickValue(): string;
              getCustomClickValue(): java.lang.Runnable;
              getHoverAction(): TextHoverAction;
              getHoverValue(): any;
              getInsertion(): string;
            }

            const LivingEntityHelper: JavaClassStatics<{
              new <T>(e: T): LivingEntityHelper<T>;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface LivingEntityHelper<T = /* minecraft class */ any>
              extends EntityHelper<T> {
              /**
               * @since 1.2.7
               * @return entity status effects.
               */
              getStatusEffects(): JavaList<StatusEffectHelper>;

              /**
               * @since 1.2.7
               * @return the item in the entity's main hand.
               */
              getMainHand(): ItemStackHelper;

              /**
               * @since 1.2.7
               * @return the item in the entity's off hand.
               */
              getOffHand(): ItemStackHelper;

              /**
               * @since 1.2.7
               * @return the item in the entity's head armor slot.
               */
              getHeadArmor(): ItemStackHelper;

              /**
               * @since 1.2.7
               * @return the item in the entity's chest armor slot.
               */
              getChestArmor(): ItemStackHelper;

              /**
               * @since 1.2.7
               * @return the item in the entity's leg armor slot.
               */
              getLegArmor(): ItemStackHelper;

              /**
               * @since 1.2.7
               * @return the item in the entity's foot armor slot.
               */
              getFootArmor(): ItemStackHelper;

              /**
               * @since 1.3.1
               * @return entity's health
               */
              getHealth(): number;

              /**
               * @since 1.6.5
               * @return entity's max health
               */
              getMaxHealth(): number;

              /**
               * @since 1.2.7
               * @return if the entity is in a bed.
               */
              isSleeping(): boolean;

              /**
               * @since 1.5.0
               * @return if the entity has elytra deployed
               */
              isFallFlying(): boolean;
            }

            /**
             * @author Wagyourtail
             * @since 1.0.3
             */
            const PlayerAbilitiesHelper: JavaClassStatics<
              [PlayerAbilitiesHelper],
              [a: /* minecraft class */ any]
            >;
            interface PlayerAbilitiesHelper extends BaseHelper {
              /**
               * @since 1.0.3
               * @return whether the player can be damaged.
               */
              getInvulnerable(): boolean;

              /**
               * @since 1.0.3
               * @return if the player is currently flying.
               */
              getFlying(): boolean;

              /**
               * @since 1.0.3
               * @return if the player is allowed to fly.
               */
              getAllowFlying(): boolean;

              /**
               * @since 1.0.3
               * @return if the player is in creative.
               */
              getCreativeMode(): boolean;

              /**
               * set the player flying state.
               * @since 1.0.3
               * @param b
               * @return
               */
              setFlying(b: boolean): PlayerAbilitiesHelper;

              /**
               * set the player allow flying state.
               * @since 1.0.3
               * @param b
               * @return
               */
              setAllowFlying(b: boolean): PlayerAbilitiesHelper;

              /**
               * @since 1.0.3
               * @return the player fly speed multiplier.
               */
              getFlySpeed(): number;

              /**
               * set the player fly speed multiplier.
               * @since 1.0.3
               * @param flySpeed
               * @return
               */
              setFlySpeed(flySpeed: number): PlayerAbilitiesHelper;
            }

            const MerchantEntityHelper: JavaClassStatics<{
              new <T>(e: T): MerchantEntityHelper<T>;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface MerchantEntityHelper<T = /* minecraft class */ any>
              extends LivingEntityHelper<T> {
              /**
               * these might not work... depends on the data the server sends, maybe just singleplayer.
               * @return
               */
              getTrades(): JavaList<TradeOfferHelper>;
              refreshTrades(): JavaList<TradeOfferHelper>;

              /**
               * @return
               */
              getExperience(): number;

              /**
               * @return
               */
              hasCustomer(): boolean;
            }

            const ItemEntityHelper: JavaClassStatics<
              [ItemEntityHelper],
              [e: /* minecraft class */ any]
            >;
            interface ItemEntityHelper extends EntityHelper {
              getContainedItemStack(): ItemStackHelper;
            }

            const TradeOfferHelper: JavaClassStatics<
              [TradeOfferHelper],
              [
                base: /* minecraft class */ any,
                index: number,
                inv: VillagerInventory
              ]
            >;
            interface TradeOfferHelper extends BaseHelper {
              /**
               * @return list of input items required
               */
              getInput(): JavaList<ItemStackHelper>;

              /**
               * @return output item that will be recieved
               */
              getOutput(): ItemStackHelper;

              /**
               * select trade offer on screen
               */
              select(): void;

              /**
               * @return
               */
              isAvailable(): boolean;

              /**
               * @return trade offer as nbt tag
               */
              getNBT(): NBTElementHelper;

              /**
               * @return current number of uses
               */
              getUses(): number;

              /**
               * @return max uses before it locks
               */
              getMaxUses(): number;

              /**
               * @return experience gained for trade
               */
              getExperience(): number;

              /**
               * @return current price adjustment, negative is discount.
               */
              getCurrentPriceAdjustment(): number;
            }

            /** @since 1.5.1 */
            const NBTElementHelper$NBTNumberHelper: JavaClassStatics<false>;
            interface NBTElementHelper$NBTNumberHelper
              extends NBTElementHelper {
              /** @since 1.5.1 */
              asLong(): number;

              /** @since 1.5.1 */
              asInt(): number;

              /** @since 1.5.1 */
              asShort(): number;

              /** @since 1.5.1 */
              asByte(): number;

              /** @since 1.5.1 */
              asFloat(): number;

              /** @since 1.5.1 */
              asDouble(): number;

              /** @since 1.5.1 */
              asNumber(): java.lang.Number;
            }

            /** @since 1.5.1 */
            const NBTElementHelper$NBTCompoundHelper: JavaClassStatics<false>;
            interface NBTElementHelper$NBTCompoundHelper
              extends NBTElementHelper {
              /**
               * @since 1.6.0
               * @return
               */
              getKeys(): JavaSet<string>;

              /** @since 1.5.1 */
              getType(key: string): number;

              /** @since 1.5.1 */
              getType(): number;

              /** @since 1.5.1 */
              has(key: string): boolean;

              /** @since 1.5.1 */
              get(key: string): NBTElementHelper;

              /** @since 1.5.1 */
              asString(key: string): string;
            }

            /** @since 1.5.1 */
            const NBTElementHelper$NBTListHelper: JavaClassStatics<false>;
            interface NBTElementHelper$NBTListHelper extends NBTElementHelper {
              /**
               * @since 1.8.3
               * @return
               */
              isPossiblyUUID(): boolean;

              /**
               * @since 1.8.3
               * @return
               */
              asUUID(): java.util.UUID;

              /**
               * @since 1.5.1
               * @return
               */
              length(): number;

              /** @since 1.5.1 */
              get(index: number): NBTElementHelper;

              /** @since 1.5.1 */
              getHeldType(): number;
            }

            /**
             * @author Wagyourtail
             * @since 1.2.4
             */
            const StatusEffectHelper: JavaClassStatics<
              [StatusEffectHelper],
              [s: /* minecraft class */ any]
            >;
            interface StatusEffectHelper extends BaseHelper {
              /**
               * @since 1.2.4
               * @return
               */
              getId(): StatusEffectId;

              /**
               * @since 1.2.4
               * @return
               */
              getStrength(): number;

              /**
               * @since 1.2.4
               * @return
               */
              getTime(): number;
            }

            /**
             * F
             * @author Wagyourtail
             * @since 1.0.5
             */
            const TextFieldWidgetHelper: JavaClassStatics<{
              new (t: /* minecraft class */ any): TextFieldWidgetHelper;
              new (
                t: /* minecraft class */ any,
                zIndex: number
              ): TextFieldWidgetHelper;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface TextFieldWidgetHelper extends ButtonWidgetHelper {
              /**
               * @since 1.0.5
               * @return the currently entered {@link java.lang.String String}.
               */
              getText(): string;

              /**
               * @since 1.0.5
               * @param text
               * @return
               */
              setText(text: string): TextFieldWidgetHelper;

              /**
               * set the currently entered {@link java.lang.String}.
               * @param text
               * @param await
               * @return
               * @since 1.3.1
               * @throws InterruptedException
               */
              setText(text: string, await: boolean): TextFieldWidgetHelper;

              /**
               * @since 1.0.5
               * @param color
               * @return
               */
              setEditableColor(color: number): TextFieldWidgetHelper;

              /**
               * @since 1.0.5
               * @param edit
               * @return
               */
              setEditable(edit: boolean): TextFieldWidgetHelper;

              /**
               * @since 1.0.5
               * @param color
               * @return
               */
              setUneditableColor(color: number): TextFieldWidgetHelper;
            }

            /**
             * @author Wagyourtail
             * @since 1.3.1
             */
            const RecipeHelper: JavaClassStatics<
              [RecipeHelper],
              [base: /* minecraft class */ any, syncId: number]
            >;
            interface RecipeHelper extends BaseHelper {
              /**
               * @since 1.3.1
               * @return
               */
              getId(): RecipeId;

              /**
               * get ingredients list
               * @since 1.8.3
               * @return
               */
              getIngredients(): JavaList<JavaList<ItemStackHelper>>;

              /**
               * @since 1.3.1
               * @return
               */
              getOutput(): ItemStackHelper;

              /**
               * @since 1.3.1
               * @param craftAll
               */
              craft(craftAll: boolean): void;
            }

            /**
             * @author Wagyourtail
             * @since 1.0.5
             */
            const ButtonWidgetHelper: JavaClassStatics<{
              new <T>(btn: T): ButtonWidgetHelper<T>;
              new <T>(btn: T, zIndex: number): ButtonWidgetHelper<T>;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface ButtonWidgetHelper<T = /* minecraft class */ any>
              extends BaseHelper<T>,
                RenderCommon$RenderElement {
              zIndex: number;

              /**
               * @since 1.0.5
               * @return the {@code x} coordinate of the button.
               */
              getX(): number;

              /**
               * @since 1.0.5
               * @return the {@code y} coordinate of the button.
               */
              getY(): number;

              /**
               * Set the button position.
               * @since 1.0.5
               * @param x
               * @param y
               * @return
               */
              setPos(x: number, y: number): ButtonWidgetHelper<T>;

              /**
               * @since 1.0.5
               * @return
               */
              getWidth(): number;

              /**
               * change the text.
               * @since 1.0.5, renamed from {@code setText} in 1.3.1
               * @deprecated only deprecated in buttonWidgetHelper for confusing name.
               * @param label
               * @return
               */
              setLabel(label: string): ButtonWidgetHelper<T>;

              /**
               * change the text.
               * @since 1.3.1
               * @param helper
               * @return
               */
              setLabel(helper: TextHelper): ButtonWidgetHelper<T>;

              /**
               * @since 1.2.3, renamed fro {@code getText} in 1.3.1
               * @return current button text.
               */
              getLabel(): TextHelper;

              /**
               * @since 1.0.5
               * @return button clickable state.
               */
              getActive(): boolean;

              /**
               * set the button clickable state.
               * @since 1.0.5
               * @param t
               * @return
               */
              setActive(t: boolean): ButtonWidgetHelper<T>;

              /**
               * set the button width.
               * @since 1.0.5
               * @param width
               * @return
               */
              setWidth(width: number): ButtonWidgetHelper<T>;

              /**
               * clicks button
               * @since 1.3.1
               */
              click(): ButtonWidgetHelper<T>;

              /**
               * clicks button
               * @param await should wait for button to finish clicking.
               * @since 1.3.1
               */
              click(await: boolean): ButtonWidgetHelper<T>;
              getZIndex(): number;
            }

            const ChatHudLineHelper: JavaClassStatics<
              [ChatHudLineHelper],
              [base: /* minecraft class */ any, hud: /* minecraft class */ any]
            >;
            interface ChatHudLineHelper extends BaseHelper {
              getText(): TextHelper;
              getCreationTick(): number;
              deleteById(): void;
            }

            /** @since 1.6.5 */
            const SuggestionsBuilderHelper: JavaClassStatics<
              [SuggestionsBuilderHelper],
              [base: com.mojang.brigadier.suggestion.SuggestionsBuilder]
            >;
            interface SuggestionsBuilderHelper
              extends BaseHelper<com.mojang.brigadier.suggestion.SuggestionsBuilder> {
              getInput(): string;
              getStart(): number;
              getRemaining(): string;
              getRemainingLowerCase(): string;
              suggest(suggestion: string): SuggestionsBuilderHelper;
              suggest(value: number): SuggestionsBuilderHelper;
              suggestWithTooltip(
                suggestion: string,
                tooltip: TextHelper
              ): SuggestionsBuilderHelper;
              suggestWithTooltip(
                value: number,
                tooltip: TextHelper
              ): SuggestionsBuilderHelper;
            }

            export {
              BlockHelper,
              OptionsHelper,
              ServerInfoHelper,
              CommandNodeHelper,
              PlayerEntityHelper,
              BlockPosHelper,
              BlockStateHelper,
              EntityHelper,
              StatsHelper,
              ClientPlayerEntityHelper,
              CommandContextHelper,
              BlockDataHelper,
              PlayerListEntryHelper,
              ScoreboardsHelper,
              TextHelper,
              BossBarHelper,
              ItemStackHelper,
              VillagerEntityHelper,
              NBTElementHelper,
              ScoreboardObjectiveHelper,
              TeamHelper,
              StyleHelper,
              LivingEntityHelper,
              PlayerAbilitiesHelper,
              MerchantEntityHelper,
              ItemEntityHelper,
              TradeOfferHelper,
              NBTElementHelper$NBTNumberHelper,
              NBTElementHelper$NBTCompoundHelper,
              NBTElementHelper$NBTListHelper,
              StatusEffectHelper,
              TextFieldWidgetHelper,
              RecipeHelper,
              ButtonWidgetHelper,
              ChatHudLineHelper,
              SuggestionsBuilderHelper,
            };
          }

          namespace classes {
            /**
             * usage: `builder.append("hello,").withColor(0xc).append(" World!").withColor(0x6)`
             * @author Wagyourtail
             * @since 1.3.0
             */
            const TextBuilder: JavaClassStatics<[TextBuilder]>;
            interface TextBuilder extends JavaObject {
              /**
               * move on to next section and set it's text.
               * @param text a {@link String}, {@link TextHelper} or {@link TextBuilder}
               * @since 1.3.0
               * @return
               */
              append(text: any): TextBuilder;

              /**
               * set current section's color by color code as hex, like `0x6` for gold
               *  and `0xc` for red.
               * @param color
               * @since 1.3.0
               * @return
               */
              withColor(color: number): TextBuilder;

              /**
               * Add text with custom colors.
               * @since 1.3.1
               * @param r red {@code 0-255}
               * @param g green {@code 0-255}
               * @param b blue {@code 0-255}
               * @return
               */
              withColor(r: number, g: number, b: number): TextBuilder;

              /**
               * set other formatting options for the current section
               * @param underline
               * @param bold
               * @param italic
               * @param strikethrough
               * @param magic
               * @since 1.3.0
               * @return
               */
              withFormatting(
                underline: boolean,
                bold: boolean,
                italic: boolean,
                strikethrough: boolean,
                magic: boolean
              ): TextBuilder;

              /**
               * set current section's hover event to show text
               * @param text
               * @since 1.3.0
               * @return
               */
              withShowTextHover(text: TextHelper): TextBuilder;

              /**
               * set current section's hover event to show an item
               * @param item
               * @since 1.3.0
               * @return
               */
              withShowItemHover(item: ItemStackHelper): TextBuilder;

              /**
               * set current section's hover event to show an entity
               * @param entity
               * @since 1.3.0
               * @return
               */
              withShowEntityHover(entity: EntityHelper): TextBuilder;

              /**
               * custom click event.
               * @param action
               * @since 1.3.0
               * @return
               */
              withCustomClickEvent(
                action: MethodWrapper<any, any, any, any>
              ): TextBuilder;

              /**
               * normal click events like: `open_url`, `open_file`, `run_command`, `suggest_command`, `change_page`, and `copy_to_clipboard`
               * @param action
               * @param value
               * @since 1.3.0
               * @return
               */
              withClickEvent(
                action: TextClickAction,
                value: string
              ): TextBuilder;
              withStyle(style: StyleHelper): TextBuilder;

              /**
               * Build to a {@link TextHelper}
               * @since 1.3.0
               * @return
               */
              build(): TextHelper;
            }

            /** @since 1.7.0 */
            const CommandManager: JavaClassStatics<[CommandManager]> & {
              instance: CommandManager;
            };
            interface CommandManager extends JavaObject {
              /**
               * @since 1.7.0
               * @return list of commands
               */
              getValidCommands(): JavaList<string>;

              /**
               * @param name
               * @since 1.7.0
               * @return
               */
              createCommandBuilder(name: string): CommandBuilder;

              /**
               * @param command
               * @return
               * @since 1.7.0
               * @throws IllegalAccessException
               */
              unregisterCommand(command: string): CommandNodeHelper;

              /**
               * warning: this method is hacky
               * @since 1.7.0
               * @param node
               */
              reRegisterCommand(node: CommandNodeHelper): void;

              /**
               * @since 1.8.2
               * @param commandPart
               */
              getArgumentAutocompleteOptions(
                commandPart: string,
                callback: MethodWrapper<JavaList<string>, any, any, any>
              ): void;
            }

            /** @since 1.6.0 */
            const ChatHistoryManager: JavaClassStatics<
              [ChatHistoryManager],
              [hud: /* minecraft class */ any]
            >;
            interface ChatHistoryManager extends JavaObject {
              /**
               * @param index
               * @since 1.6.0
               * @return
               */
              getRecvLine(index: number): ChatHudLineHelper;

              /**
               * @since 1.6.0
               * @param index
               * @param line
               */
              insertRecvText(index: number, line: TextHelper): void;

              /**
               * you should probably run {@link #refreshVisible} after...
               * @param index
               * @param line
               * @param timeTicks
               * @since 1.6.0
               */
              insertRecvText(
                index: number,
                line: TextHelper,
                timeTicks: number
              ): void;

              /**
               * @param index
               * @param line
               * @param timeTicks
               * @param await
               * @since 1.6.0
               * @throws InterruptedException
               */
              insertRecvText(
                index: number,
                line: TextHelper,
                timeTicks: number,
                await: boolean
              ): void;

              /**
               * @since 1.6.0
               * @param index
               */
              removeRecvText(index: number): void;

              /**
               * @param index
               * @param await
               * @since 1.6.0
               * @throws InterruptedException
               */
              removeRecvText(index: number, await: boolean): void;

              /**
               * @since 1.6.0
               * @param text
               */
              removeRecvTextMatching(text: TextHelper): void;

              /**
               * @param text
               * @param await
               * @since 1.6.0
               * @throws InterruptedException
               */
              removeRecvTextMatching(text: TextHelper, await: boolean): void;

              /**
               * @since 1.6.0
               * @param filter
               */
              removeRecvTextMatchingFilter(
                filter: MethodWrapper<ChatHudLineHelper, any, boolean, any>
              ): void;

              /**
               * @param filter
               * @param await
               * @since 1.6.0
               * @throws InterruptedException
               */
              removeRecvTextMatchingFilter(
                filter: MethodWrapper<ChatHudLineHelper, any, boolean, any>,
                await: boolean
              ): void;

              /**
               * this will reset the view of visible messages
               * @since 1.6.0
               */
              refreshVisible(): void;

              /**
               * @param await
               * @since 1.6.0
               * @throws InterruptedException
               */
              refreshVisible(await: boolean): void;

              /** @since 1.6.0 */
              clearRecv(): void;

              /**
               * @param await
               * @since 1.6.0
               * @throws InterruptedException
               */
              clearRecv(await: boolean): void;

              /**
               * @since 1.6.0
               * @return direct reference to sent message history list. modifications will affect the list.
               */
              getSent(): JavaList<string>;

              /** @since 1.6.0 */
              clearSent(): void;

              /**
               * @param await
               * @since 1.6.0
               * @throws InterruptedException
               */
              clearSent(await: boolean): void;
            }

            /**
             * @author Wagyourtail
             * @since 1.0.5
             */
            const Draw2D: JavaClassStatics<[Draw2D]>;
            interface Draw2D
              extends /* supressed minecraft class */ JavaObject,
                IDraw2D<Draw2D> {
              /**
               * @since 1.0.5
               * @deprecated please use {@link Draw2D#setOnInit(MethodWrapper)}
               */
              onInit: MethodWrapper<Draw2D, any, any, any>;

              /**
               * @since 1.1.9 [citation needed]
               * @deprecated please use {@link Draw2D#setOnFailInit(MethodWrapper)}
               */
              catchInit: MethodWrapper<string, any, any, any>;

              /** @since 1.0.5 */
              getWidth(): number;

              /** @since 1.0.5 */
              getHeight(): number;

              /** @since 1.0.5 */
              getTexts(): JavaList<RenderCommon$Text>;

              /** @since 1.0.5 */
              getRects(): JavaList<RenderCommon$Rect>;

              /** @since 1.0.5 */
              getItems(): JavaList<RenderCommon$Item>;

              /** @since 1.2.3 */
              getImages(): JavaList<RenderCommon$Image>;
              getElements(): JavaList<RenderCommon$RenderElement>;
              removeElement(e: RenderCommon$RenderElement): Draw2D;
              reAddElement(
                e: RenderCommon$RenderElement
              ): RenderCommon$RenderElement;

              /** @since 1.0.5 */
              addText(
                text: string,
                x: number,
                y: number,
                color: number,
                shadow: boolean
              ): RenderCommon$Text;
              addText(
                text: string,
                x: number,
                y: number,
                color: number,
                zIndex: number,
                shadow: boolean
              ): RenderCommon$Text;

              /** @since 1.2.6 */
              addText(
                text: string,
                x: number,
                y: number,
                color: number,
                shadow: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Text;
              addText(
                text: string,
                x: number,
                y: number,
                color: number,
                zIndex: number,
                shadow: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Text;
              addText(
                text: TextHelper,
                x: number,
                y: number,
                color: number,
                shadow: boolean
              ): RenderCommon$Text;
              addText(
                text: TextHelper,
                x: number,
                y: number,
                color: number,
                zIndex: number,
                shadow: boolean
              ): RenderCommon$Text;
              addText(
                text: TextHelper,
                x: number,
                y: number,
                color: number,
                shadow: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Text;
              addText(
                text: TextHelper,
                x: number,
                y: number,
                color: number,
                zIndex: number,
                shadow: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Text;

              /** @since 1.0.5 */
              removeText(t: RenderCommon$Text): Draw2D;

              /** @since 1.2.3 */
              addImage(
                x: number,
                y: number,
                width: number,
                height: number,
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number
              ): RenderCommon$Image;
              addImage(
                x: number,
                y: number,
                width: number,
                height: number,
                zIndex: number,
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number
              ): RenderCommon$Image;

              /** @since 1.2.6 */
              addImage(
                x: number,
                y: number,
                width: number,
                height: number,
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number,
                rotation: number
              ): RenderCommon$Image;

              /** @since 1.4.0 */
              addImage(
                x: number,
                y: number,
                width: number,
                height: number,
                zIndex: number,
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number,
                rotation: number
              ): RenderCommon$Image;

              /** @since 1.6.5 */
              addImage(
                x: number,
                y: number,
                width: number,
                height: number,
                zIndex: number,
                color: number,
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number,
                rotation: number
              ): RenderCommon$Image;

              /** @since 1.6.5 */
              addImage(
                x: number,
                y: number,
                width: number,
                height: number,
                zIndex: number,
                alpha: number,
                color: number,
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number,
                rotation: number
              ): RenderCommon$Image;

              /** @since 1.2.3 */
              removeImage(i: RenderCommon$Image): Draw2D;

              /** @since 1.0.5 */
              addRect(
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: number
              ): RenderCommon$Rect;

              /** @since 1.1.8 */
              addRect(
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: number,
                alpha: number
              ): RenderCommon$Rect;

              /** @since 1.2.6 */
              addRect(
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: number,
                alpha: number,
                rotation: number
              ): RenderCommon$Rect;
              addRect(
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: number,
                alpha: number,
                rotation: number,
                zIndex: number
              ): RenderCommon$Rect;

              /** @since 1.0.5 */
              removeRect(r: RenderCommon$Rect): Draw2D;

              /** @since 1.0.5 */
              addItem(x: number, y: number, id: ItemId): RenderCommon$Item;
              addItem(
                x: number,
                y: number,
                zIndex: number,
                id: ItemId
              ): RenderCommon$Item;

              /** @since 1.2.0 */
              addItem(
                x: number,
                y: number,
                id: ItemId,
                overlay: boolean
              ): RenderCommon$Item;
              addItem(
                x: number,
                y: number,
                zIndex: number,
                id: ItemId,
                overlay: boolean
              ): RenderCommon$Item;

              /** @since 1.2.0 */
              addItem(
                x: number,
                y: number,
                id: ItemId,
                overlay: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Item;
              addItem(
                x: number,
                y: number,
                zIndex: number,
                id: ItemId,
                overlay: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Item;

              /** @since 1.0.5 */
              addItem(
                x: number,
                y: number,
                Item: ItemStackHelper
              ): RenderCommon$Item;
              addItem(
                x: number,
                y: number,
                zIndex: number,
                item: ItemStackHelper
              ): RenderCommon$Item;

              /** @since 1.2.0 */
              addItem(
                x: number,
                y: number,
                Item: ItemStackHelper,
                overlay: boolean
              ): RenderCommon$Item;
              addItem(
                x: number,
                y: number,
                zIndex: number,
                item: ItemStackHelper,
                overlay: boolean
              ): RenderCommon$Item;

              /** @since 1.2.6 */
              addItem(
                x: number,
                y: number,
                item: ItemStackHelper,
                overlay: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Item;
              addItem(
                x: number,
                y: number,
                zIndex: number,
                item: ItemStackHelper,
                overlay: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Item;

              /** @since 1.0.5 */
              removeItem(i: RenderCommon$Item): Draw2D;
              init(): void;
              render(matrixStack: /* minecraft class */ any): void;

              /**
               * init function, called when window is resized or screen/draw2d is registered.
               *  clears all previous elements when called.
               * @since 1.2.7
               * @param onInit calls your method as a {@link java.util.function.Consumer Consumer}&lt;{@link Draw2D}&gt;
               */
              setOnInit(onInit: MethodWrapper<Draw2D, any, any, any>): Draw2D;

              /**
               * @since 1.2.7
               * @param catchInit calls your method as a {@link java.util.function.Consumer Consumer}&lt;{@link java.lang.String String}&gt;
               */
              setOnFailInit(
                catchInit: MethodWrapper<string, any, any, any>
              ): Draw2D;

              /**
               * register so the overlay actually renders
               * @since 1.6.5
               * @return self for chaining
               */
              register(): Draw2D;

              /**
               * unregister so the overlay stops rendering
               * @since 1.6.5
               * @return self for chaining
               */
              unregister(): Draw2D;
            }

            /**
             * just go look at {@link IScreen}
             *  since all the methods are done through a mixin...
             * @author Wagyourtail
             * @since 1.0.5
             */
            const ScriptScreen: JavaClassStatics<
              [ScriptScreen],
              [title: string, dirt: boolean]
            >;
            interface ScriptScreen extends BaseScreen {
              /**
               * @param parent parent screen to go to when this one exits.
               * @since 1.4.0
               */
              setParent(parent: IScreen): void;
              setParent(parent: /* minecraft class */ any): void;

              /**
               * add custom stuff to the render function on the main thread.
               * @param onRender pos3d elements are mousex, mousey, tickDelta
               * @since 1.4.0
               */
              setOnRender(
                onRender: MethodWrapper<
                  PositionCommon$Pos3D,
                  /* minecraft class */ any,
                  any,
                  any
                >
              ): void;
            }

            /** @since 1.3.1 */
            const VillagerInventory: JavaClassStatics<false>;
            interface VillagerInventory extends Inventory {
              /**
               * select the trade by it's index
               * @param index
               * @return self for chaining
               * @since 1.3.1
               */
              selectTrade(index: number): VillagerInventory;

              /**
               * @return
               * @since 1.3.1
               */
              getExperience(): number;

              /**
               * @return
               * @since 1.3.1
               */
              getLevelProgress(): number;

              /**
               * @return
               * @since 1.3.1
               */
              getMerchantRewardedExperience(): number;

              /**
               * @return
               * @since 1.3.1
               */
              canRefreshTrades(): boolean;

              /**
               * @return
               * @since 1.3.1
               */
              isLeveled(): boolean;

              /**
               * @return list of trade offers
               * @since 1.3.1
               */
              getTrades(): JavaList<TradeOfferHelper>;
            }

            /**
             * @author Wagyourtail
             * @since 1.0.8
             */
            const Inventory: JavaClassStatics<false> & {
              create(): Inventory<any>;
              create(s: /* minecraft class */ any): Inventory<any>;
            };
            interface Inventory<T = /* minecraft class */ any>
              extends JavaObject {
              /**
               * @param slot
               * @since 1.5.0
               * @return
               */
              click(slot: number): Inventory<T>;

              /**
               * Clicks a slot with a mouse button.~~if the slot is a container, it will click the first slot in the container
               * @since 1.0.8
               * @param slot
               * @param mousebutton
               * @return
               */
              click(slot: number, mousebutton: Bit): Inventory<T>;

              /**
               * Does a drag-click with a mouse button. (the slots don't have to be in order or even adjacent, but when vanilla minecraft calls the underlying function they're always sorted...)
               * @param slots
               * @param mousebutton
               * @return
               */
              dragClick(slots: number[], mousebutton: Bit): Inventory<T>;

              /**
               * @since 1.5.0
               * @param slot
               */
              dropSlot(slot: number): Inventory<T>;

              /**
               * @since 1.2.5
               * @return the index of the selected hotbar slot.
               */
              getSelectedHotbarSlotIndex(): HotbarSlot;

              /**
               * @since 1.2.5
               * @param index
               */
              setSelectedHotbarSlotIndex(index: HotbarSlot): void;

              /**
               * closes the inventory, (if the inventory/container is visible it will close the gui). also drops any "held on mouse" items.
               * @return
               */
              closeAndDrop(): Inventory<T>;

              /**
               * Closes the inventory, and open gui if applicable.
               */
              close(): void;

              /**
               * simulates a shift-click on a slot.
               *  It should be safe to chain these without {@link Client.waitTick} at least for a bunch of the same item.
               * @param slot
               * @return
               */
              quick(slot: number): Inventory<T>;

              /**
               * @param slot
               * @since 1.7.0
               * @return
               */
              quickAll(slot: number): number;

              /**
               * quicks all that match the slot
               * @param slot a slot from the section you want to move items from
               * @param button
               * @since 1.7.0
               * @return number of items that matched
               */
              quickAll(slot: number, button: Bit): number;

              /**
               * @return the held (by the mouse) item.
               */
              getHeld(): ItemStackHelper;

              /**
               * @param slot
               * @return the item in the slot.
               */
              getSlot(slot: number): ItemStackHelper;

              /**
               * @return the size of the container/inventory.
               */
              getTotalSlots(): number;

              /**
               * Splits the held stack into two slots. can be alternatively done with {@link Inventory#dragClick} if this one has issues on some servers.
               * @param slot1
               * @param slot2
               * @return
               * @throws Exception
               */
              split(slot1: number, slot2: number): Inventory<T>;

              /**
               * Does that double click thingy to turn a incomplete stack pickup into a complete stack pickup if you have more in your inventory.
               * @param slot
               * @return
               */
              grabAll(slot: number): Inventory<T>;

              /**
               * swaps the items in two slots.
               * @param slot1
               * @param slot2
               * @return
               */
              swap(slot1: number, slot2: number): Inventory<T>;

              /**
               * equivelent to hitting the numbers or f for swapping slots to hotbar
               * @param slot
               * @param hotbarSlot 0-8 or 40 for offhand
               * @since 1.6.5 [citation needed]
               * @return
               */
              swapHotbar(
                slot: number,
                hotbarSlot: HotbarSlot | OffhandSlot
              ): Inventory<T>;

              /** @since 1.2.8 */
              openGui(): void;

              /**
               * @since 1.1.3
               * @return the id of the slot under the mouse.
               */
              getSlotUnderMouse(): number;

              /**
               * @since 1.1.3
               * @return the part of the mapping the slot is in.
               */
              getType(): InventoryType;

              /**
               * @since 1.1.3
               * @return the inventory mappings different depending on the type of open container/inventory.
               */
              getMap(): JavaMap<string, number[]>;

              /**
               * @since 1.1.3
               * @param slotNum
               * @return returns the part of the mapping the slot is in.
               */
              getLocation(slotNum: number): string;

              /**
               * @since 1.3.1
               * @return all craftable recipes
               */
              getCraftableRecipes(): JavaList<RecipeHelper>;

              /**
               * @since 1.2.3
               * @return
               */
              getContainerTitle(): string;
              getRawContainer(): T;

              /**
               * @since 1.6.0
               * @return
               */
              getCurrentSyncId(): number;
            }

            /**
             * An object, that combines all possible player inputs
             * @author NotSomeBot
             * @since 1.4.0
             */
            const PlayerInput: JavaClassStatics<{
              /**
               * Creates a new `PlayerInput` Object with all values set either to 0 or false
               * @since 1.4.0
               */
              new (): PlayerInput;

              /**
               * Creates a new `PlayerInput` Object with all other values set either to 0 or false
               * @param movementForward 1 = forward input (W); 0 = no input; -1 = backward input (S)
               * @param movementSideways 1 = left input (A); 0 = no input; -1 = right input (D)
               * @param yaw yaw of the player
               * @since 1.4.0
               */
              new (
                movementForward: number,
                movementSideways: number,
                yaw: number
              ): PlayerInput;

              /**
               * Creates a new `PlayerInput` Object with all other values set either to 0 or false
               * @param movementForward 1 = forward input (W); 0 = no input; -1 = backward input (S)
               * @param yaw yaw of the player
               * @param jumping jump input
               * @param sprinting sprint input
               * @since 1.4.0
               */
              new (
                movementForward: number,
                yaw: number,
                jumping: boolean,
                sprinting: boolean
              ): PlayerInput;

              /**
               * Creates a new `PlayerInput` Object from a minecraft input with the missing values extra
               * @param input Minecraft Input to be converted.
               * @param yaw yaw of the player
               * @param pitch pitch of the player
               * @param sprinting sprint input
               * @since 1.4.0
               */
              new (
                input: /* minecraft class */ any,
                yaw: number,
                pitch: number,
                sprinting: boolean
              ): PlayerInput;

              /**
               * Creates a new `PlayerInput` Object with all double values converted to floats
               * @param movementForward 1 = forward input (W); 0 = no input; -1 = backward input (S)
               * @param movementSideways 1 = left input (A); 0 = no input; -1 = right input (D)
               * @param yaw yaw of the player
               * @param pitch pitch of the player
               * @param jumping jump input
               * @param sneaking sneak input
               * @param sprinting sprint input
               * @since 1.4.0
               */
              new (
                movementForward: number,
                movementSideways: number,
                yaw: number,
                pitch: number,
                jumping: boolean,
                sneaking: boolean,
                sprinting: boolean
              ): PlayerInput;

              /**
               * Creates a new `PlayerInput` Object
               * @param movementForward 1 = forward input (W); 0 = no input; -1 = backward input (S)
               * @param movementSideways 1 = left input (A); 0 = no input; -1 = right input (D)
               * @param yaw yaw of the player
               * @param pitch pitch of the player
               * @param jumping jump input
               * @param sneaking sneak input
               * @param sprinting sprint input
               * @since 1.4.0
               */
              new (
                movementForward: number,
                movementSideways: number,
                yaw: number,
                pitch: number,
                jumping: boolean,
                sneaking: boolean,
                sprinting: boolean
              ): PlayerInput;

              /**
               * Creates a clone `PlayerInput` Object
               * @param input the {@code PlayerInput} object to be cloned
               * @since 1.4.0
               */
              new (input: PlayerInput): PlayerInput;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }> & {
              /**
               * Parses each row of CSV string into a `PlayerInput`.
               *  The capitalization of the header matters.<br>
               *  About the columns:
               *  <ul>
               *    <li> `movementForward` and `movementSideways` as a number</li>
               *    <li>`yaw` and `pitch` as an absolute number</li>
               *    <li>`jumping`, `sneaking` and `sprinting` have to be boolean</li>
               *  </ul>
               *
               *  The separation must be a "," it's a csv...(but spaces don't matter)<br>
               *  Quoted values don't work
               * @param csv CSV string to be parsed
               * @return {@code List<PlayerInput>} Each row parsed as a {@code PlayerInput}
               * @since 1.4.0
               */
              fromCsv(csv: string): JavaList<PlayerInput>;

              /**
               * Parses a JSON string into a `PlayerInput` Object<br>
               *  Capitalization of the keys matters.
               * @param json JSON string to be parsed
               * @return The JSON parsed into a {@code PlayerInput}
               * @since 1.4.0
               */
              fromJson(json: string): PlayerInput;
            };
            interface PlayerInput extends JavaObject {
              movementForward: number;
              movementSideways: number;
              yaw: number;
              pitch: number;
              jumping: boolean;
              sneaking: boolean;
              sprinting: boolean;

              /**
               * Converts the current object into a string.
               *  This can be used to convert current inputs created using `Player.getCurrentPlayerInput()`
               *  to either JSON or CSV.
               *
               *  The output can be converted into a PlayerInput object again by using either
               *  `fromCsv(String, String)` or `fromJson(String)`.
               * @param varNames whether to include variable Names(=JSON) or not(=CSV)
               * @return The {@code PlayerInput} object as a string
               * @since 1.4.0
               */
              toString(varNames: boolean): string;
              toString(): string;
              clone(): PlayerInput;
            }

            /** @since 1.4.2 */
            const CommandBuilder: JavaClassStatics<[CommandBuilder]>;
            interface CommandBuilder extends JavaObject {
              literalArg(name: string): CommandBuilder;
              angleArg(name: string): CommandBuilder;
              blockArg(name: string): CommandBuilder;
              booleanArg(name: string): CommandBuilder;
              colorArg(name: string): CommandBuilder;
              doubleArg(name: string): CommandBuilder;
              doubleArg(name: string, min: number, max: number): CommandBuilder;
              floatRangeArg(name: string): CommandBuilder;
              longArg(name: string): CommandBuilder;
              longArg(name: string, min: number, max: number): CommandBuilder;
              identifierArg(name: string): CommandBuilder;
              intArg(name: string): CommandBuilder;
              intArg(name: string, min: number, max: number): CommandBuilder;
              intRangeArg(name: string): CommandBuilder;
              itemArg(name: string): CommandBuilder;
              nbtArg(name: string): CommandBuilder;
              greedyStringArg(name: string): CommandBuilder;
              quotedStringArg(name: string): CommandBuilder;
              wordArg(name: string): CommandBuilder;
              textArgType(name: string): CommandBuilder;
              uuidArgType(name: string): CommandBuilder;
              regexArgType(
                name: string,
                regex: string,
                flags: string
              ): CommandBuilder;

              /**
               * it is recomended to use {@link JsMacros.runScript}
               *  in the callback if you expect to actually do anything complicated with waits.
               *
               *  the {@link CommandContextHelper} arg is an {@link BaseEvent}
               *  so you can pass it directly to {@link JsMacros.runScript}.
               *
               *  make sure your callback returns a boolean success = true.
               * @param callback
               * @return
               */
              executes(
                callback: MethodWrapper<CommandContextHelper, any, any, any>
              ): CommandBuilder;

              /**
               * @since 1.6.5
               * @param suggestions
               * @return
               */
              suggestMatching(...suggestions: string[]): CommandBuilder;

              /**
               * @since 1.6.5
               * @param suggestions
               * @return
               */
              suggestIdentifier(...suggestions: string[]): CommandBuilder;

              /**
               * @since 1.6.5
               * @param callback
               * @return
               */
              suggest(
                callback: MethodWrapper<
                  CommandContextHelper,
                  SuggestionsBuilderHelper,
                  any,
                  any
                >
              ): CommandBuilder;
              or(): CommandBuilder;

              /**
               * name overload for {@link #or} to work around language keyword restrictions
               * @since 1.5.2
               * @return
               */
              otherwise(): CommandBuilder;
              or(argumentLevel: number): CommandBuilder;

              /**
               * name overload for {@link #or} to work around language keyword restrictions
               * @since 1.5.2
               * @param argLevel
               * @return
               */
              otherwise(argLevel: number): CommandBuilder;
              register(): void;

              /**
               * @since 1.6.5
               *  removes this command
               */
              unregister(): void;
            }

            /**
             * {@link Draw2D} is cool
             * @author Wagyourtail
             * @since 1.0.6
             */
            const Draw3D: JavaClassStatics<[Draw3D]>;
            interface Draw3D extends JavaObject {
              /**
               * @return
               * @since 1.0.6
               */
              getBoxes(): JavaList<Draw3D$Box>;

              /**
               * @return
               * @since 1.0.6
               */
              getLines(): JavaList<Draw3D$Line>;

              /**
               * @return
               * @since 1.6.5
               */
              getDraw2Ds(): JavaList<Draw3D$Surface>;

              /**
               * @param x1
               * @param y1
               * @param z1
               * @param x2
               * @param y2
               * @param z2
               * @param color
               * @param fillColor
               * @param fill
               * @return The {@link Box} you added.
               * @since 1.0.6
               */
              addBox(
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number,
                color: number,
                fillColor: number,
                fill: boolean
              ): Draw3D$Box;

              /**
               * @param x1
               * @param y1
               * @param z1
               * @param x2
               * @param y2
               * @param z2
               * @param color
               * @param fillColor
               * @param fill
               * @param cull
               * @return
               * @since 1.3.1
               */
              addBox(
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number,
                color: number,
                fillColor: number,
                fill: boolean,
                cull: boolean
              ): Draw3D$Box;

              /**
               * @param x1
               * @param y1
               * @param z1
               * @param x2
               * @param y2
               * @param z2
               * @param color
               * @param alpha
               * @param fillColor
               * @param fillAlpha
               * @param fill
               * @return the {@link Box} you added.
               * @since 1.1.8
               */
              addBox(
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number,
                color: number,
                alpha: number,
                fillColor: number,
                fillAlpha: number,
                fill: boolean
              ): Draw3D$Box;
              addBox(
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number,
                color: number,
                alpha: number,
                fillColor: number,
                fillAlpha: number,
                fill: boolean,
                cull: boolean
              ): Draw3D$Box;

              /**
               * @param b
               * @return
               * @since 1.0.6
               */
              removeBox(b: Draw3D$Box): Draw3D;

              /**
               * @param x1
               * @param y1
               * @param z1
               * @param x2
               * @param y2
               * @param z2
               * @param color
               * @return the {@link Line} you added.
               * @since 1.0.6
               */
              addLine(
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number,
                color: number
              ): Draw3D$Line;

              /**
               * @param x1
               * @param y1
               * @param z1
               * @param x2
               * @param y2
               * @param z2
               * @param color
               * @param cull
               * @return
               * @since 1.3.1
               */
              addLine(
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number,
                color: number,
                cull: boolean
              ): Draw3D$Line;

              /**
               * @param x1
               * @param y1
               * @param z1
               * @param x2
               * @param y2
               * @param z2
               * @param color
               * @param alpha
               * @return the {@link Line} you added.
               * @since 1.1.8
               */
              addLine(
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number,
                color: number,
                alpha: number
              ): Draw3D$Line;

              /**
               * @param x1
               * @param y1
               * @param z1
               * @param x2
               * @param y2
               * @param z2
               * @param color
               * @param alpha
               * @param cull
               * @return
               * @since 1.3.1
               */
              addLine(
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number,
                color: number,
                alpha: number,
                cull: boolean
              ): Draw3D$Line;

              /**
               * @param l
               * @return
               * @since 1.0.6
               */
              removeLine(l: Draw3D$Line): Draw3D;

              /**
               * Draws a cube({@link Box}) with a specific radius(`side length = 2*radius`)
               * @param point the center point
               * @param radius 1/2 of the side length of the cube
               * @param color point color
               * @return the {@link Box} generated, and visualized
               * @since 1.4.0
               */
              addPoint(
                point: PositionCommon$Pos3D,
                radius: number,
                color: number
              ): Draw3D$Box;

              /**
               * Draws a cube({@link Box}) with a specific radius(`side length = 2*radius`)
               * @param x x value of the center point
               * @param y y value of the center point
               * @param z z value of the center point
               * @param radius 1/2 of the side length of the cube
               * @param color point color
               * @return the {@link Box} generated, and visualized
               * @since 1.4.0
               */
              addPoint(
                x: number,
                y: number,
                z: number,
                radius: number,
                color: number
              ): Draw3D$Box;

              /**
               * Draws a cube({@link Box}) with a specific radius(`side length = 2*radius`)
               * @param x x value of the center point
               * @param y y value of the center point
               * @param z z value of the center point
               * @param radius 1/2 of the side length of the cube
               * @param color point color
               * @param alpha alpha of the point
               * @param cull whether to cull the point or not
               * @return the {@link Box} generated, and visualized
               * @since 1.4.0
               */
              addPoint(
                x: number,
                y: number,
                z: number,
                radius: number,
                color: number,
                alpha: number,
                cull: boolean
              ): Draw3D$Box;

              /**
               * @param x top left
               * @param y
               * @param z
               * @since 1.6.5
               * @return
               */
              addDraw2D(x: number, y: number, z: number): Draw3D$Surface;

              /**
               * @param x
               * @param y
               * @param z
               * @param width
               * @param height
               * @since 1.6.5
               * @return
               */
              addDraw2D(
                x: number,
                y: number,
                z: number,
                width: number,
                height: number
              ): Draw3D$Surface;

              /**
               * @param x
               * @param y
               * @param z
               * @param xRot
               * @param yRot
               * @param zRot
               * @since 1.6.5
               * @return
               */
              addDraw2D(
                x: number,
                y: number,
                z: number,
                xRot: number,
                yRot: number,
                zRot: number
              ): Draw3D$Surface;

              /**
               * @param x
               * @param y
               * @param z
               * @param xRot
               * @param yRot
               * @param zRot
               * @param width
               * @param height
               * @since 1.6.5
               * @return
               */
              addDraw2D(
                x: number,
                y: number,
                z: number,
                xRot: number,
                yRot: number,
                zRot: number,
                width: number,
                height: number
              ): Draw3D$Surface;

              /**
               * @param x
               * @param y
               * @param z
               * @param xRot
               * @param yRot
               * @param zRot
               * @param width
               * @param height
               * @param minSubdivisions
               * @since 1.6.5
               * @return
               */
              addDraw2D(
                x: number,
                y: number,
                z: number,
                xRot: number,
                yRot: number,
                zRot: number,
                width: number,
                height: number,
                minSubdivisions: number
              ): Draw3D$Surface;

              /**
               * @param x
               * @param y
               * @param z
               * @param xRot
               * @param yRot
               * @param zRot
               * @param width
               * @param height
               * @param minSubdivisions
               * @param renderBack
               * @since 1.6.5
               * @return
               */
              addDraw2D(
                x: number,
                y: number,
                z: number,
                xRot: number,
                yRot: number,
                zRot: number,
                width: number,
                height: number,
                minSubdivisions: number,
                renderBack: boolean
              ): Draw3D$Surface;

              /**
               * @param x top left
               * @param y
               * @param z
               * @param xRot
               * @param yRot
               * @param zRot
               * @param width
               * @param height
               * @param minSubdivisions
               * @param renderBack
               * @since 1.6.5
               * @return
               */
              addDraw2D(
                x: number,
                y: number,
                z: number,
                xRot: number,
                yRot: number,
                zRot: number,
                width: number,
                height: number,
                minSubdivisions: number,
                renderBack: boolean,
                cull: boolean
              ): Draw3D$Surface;

              /** @since 1.6.5 */
              removeDraw2D(surface: Draw3D$Surface): void;

              /**
               * register so it actually shows up
               * @return self for chaining
               * @since 1.6.5
               */
              register(): Draw3D;

              /**
               * @return self for chaining
               * @since 1.6.5
               */
              unregister(): Draw3D;
              render(matrixStack: /* minecraft class */ any): void;
            }

            /** @since 1.6.5 */
            const Draw3D$Surface: JavaClassStatics<
              [Draw3D$Surface],
              [
                pos: PositionCommon$Pos3D,
                rotations: PositionCommon$Pos3D,
                sizes: PositionCommon$Pos2D,
                minSubdivisions: number,
                renderBack: boolean,
                cull: boolean
              ]
            >;
            interface Draw3D$Surface extends Draw2D {
              readonly pos: PositionCommon$Pos3D;
              readonly rotations: PositionCommon$Pos3D;

              /**
               * scale that zIndex is multiplied by to get the actual offset (in blocks) for rendering
               *  default: `1/1000`
               *  if there is still z-fighting, increase this value
               * @since 1.6.5
               */
              zIndexScale: number;
              renderBack: boolean;
              cull: boolean;

              setPos(x: number, y: number, z: number): void;
              setRotations(x: number, y: number, z: number): void;
              setSizes(x: number, y: number): void;
              getSizes(): PositionCommon$Pos2D;
              setMinSubdivisions(minSubdivisions: number): void;
              getMinSubdivisions(): number;
              getHeight(): number;
              getWidth(): number;
              init(): void;
              render3D(matrixStack: /* minecraft class */ any): void;
              render(matrixStack: /* minecraft class */ any): void;
            }

            const Draw3D$Box: JavaClassStatics<{
              new (
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number,
                color: number,
                fillColor: number,
                fill: boolean,
                cull: boolean
              ): Draw3D$Box;
              new (
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number,
                color: number,
                alpha: number,
                fillColor: number,
                fillAlpha: number,
                fill: boolean,
                cull: boolean
              ): Draw3D$Box;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface Draw3D$Box extends JavaObject {
              pos: PositionCommon$Vec3D;
              color: number;
              fillColor: number;
              fill: boolean;
              cull: boolean;

              /**
               * @param x1
               * @param y1
               * @param z1
               * @param x2
               * @param y2
               * @param z2
               * @since 1.0.6
               */
              setPos(
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number
              ): void;

              /**
               * @param color
               * @since 1.0.6
               */
              setColor(color: number): void;

              /**
               * @param fillColor
               * @since 1.0.6
               */
              setFillColor(fillColor: number): void;

              /**
               * @param color
               * @param alpha
               * @since 1.1.8
               */
              setColor(color: number, alpha: number): void;

              /**
               * @param alpha
               * @since 1.1.8
               */
              setAlpha(alpha: number): void;

              /**
               * @param fillColor
               * @param alpha
               * @since 1.1.8
               */
              setFillColor(fillColor: number, alpha: number): void;

              /**
               * @param alpha
               * @since 1.1.8
               */
              setFillAlpha(alpha: number): void;

              /**
               * @param fill
               * @since 1.0.6
               */
              setFill(fill: boolean): void;
              render(matrixStack: /* minecraft class */ any): void;
            }

            const Draw3D$Line: JavaClassStatics<{
              new (
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number,
                color: number,
                cull: boolean
              ): Draw3D$Line;
              new (
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number,
                color: number,
                alpha: number,
                cull: boolean
              ): Draw3D$Line;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface Draw3D$Line extends JavaObject {
              pos: PositionCommon$Vec3D;
              color: number;
              cull: boolean;

              /**
               * @param x1
               * @param y1
               * @param z1
               * @param x2
               * @param y2
               * @param z2
               * @since 1.0.6
               */
              setPos(
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number
              ): void;

              /**
               * @param color
               * @since 1.0.6
               */
              setColor(color: number): void;

              /**
               * @param color
               * @param alpha
               * @since 1.1.8
               */
              setColor(color: number, alpha: number): void;

              /**
               * @param alpha
               * @since 1.1.8
               */
              setAlpha(alpha: number): void;
              render(matrixStack: /* minecraft class */ any): void;
            }

            namespace worldscanner {
              /**
               * The builder can be used to create a world scanner with native java functions. This is especially useful for languages like javascript that
               *  don't support multithreading, which causes streams to run sequential instead of parallel.
               *  The builder has two filters for the block and the block state, which need to be configured separately.
               *  If one function is not defined, it will just be ignored when building the scanner.<br>
               *  The block and block state filters have to start with a 'with' command like {@link #withStateFilter} or {@link #withStringBlockFilter}.
               *  This will overwrite all previous filters of the same type. To add more commands, it's possible to use commands with the prefix 'and', 'or', 'xor'.
               *  The 'not' command will just negate the whole block or block state filter and doesn't need any arguments.<br>
               *
               *  All other commands need some arguments to work. For String functions, it's one of these functions: 'equals', 'contains', 'startsWith', 'endsWith' or 'matches'.
               *  The strings to match are passed as vararg parameters (as many as needed, separated by a comma `is("chest", "barrel", "ore"`) and the filter acts
               *  like a logical or, so only one of the arguments needs to match the criteria. It should be noted, that string functions call the toString method, so
               *  comparing a block with something like "minecraft:stone" will always return false, because the toString method gives "{minecraft:stone}". For doing this
               *  use either contains or the equals method with 'getId', as shown later.<br>
               *  This will match any block that includes 'stone' or 'diorit' in its name:
               *  ```
               *  withStringBlockFilter().contains("stone") //create new block filter, check if it contains stone
               *  .orStringBlockFilter().contains("diorit") //append new block filter with or and check if it contains diorit
               *  ```
               *
               *  For non String functions, the method name must be passed when creating the filter. The names can be any method in {@link BlockStateHelper} or {@link BlockHelper}.
               *  For more complex filters, use the MethodWrapper function {@link World.getWorldScanner}.
               *  Depending on the return type of the method, the following parameters must be passed to 'is' or 'test'. There are two methods, because 'is' is a keyword in some languages.<br>
               *  ```
               *  For any number:
               *    - is(operation, number) with operation = '>', '>=', '<', '<=', '==', '!=' and the number that should be compared to,
               *      i.e. is(">=", 8) returns true if the returned number is greater or equal to 8.
               *  For any String:
               *    - is(method, string) with method = 'EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH', 'MATCHES' and the string is the one to compare the returned value to,
               *      i.e. is("ENDS_WITH", "ore") checks if the returned string ends with ore (can be used with withBlockFilter("getId")).
               *  For any Boolean:
               *    - is(val) with val either `true` or `false`
               *      is(false) returns true if the returned boolean value is false
               *  ```
               * @author Etheradon
               * @since 1.6.5
               */
              const WorldScannerBuilder: JavaClassStatics<
                [WorldScannerBuilder]
              >;
              interface WorldScannerBuilder extends JavaObject {
                withStateFilter(
                  method: BooStrNumMethod<BlockStateHelper>
                ): WorldScannerBuilder;
                andStateFilter(
                  method: BooStrNumMethod<BlockStateHelper>
                ): WorldScannerBuilder;
                orStateFilter(
                  method: BooStrNumMethod<BlockStateHelper>
                ): WorldScannerBuilder;
                notStateFilter(): WorldScannerBuilder;
                withBlockFilter(
                  method: BooStrNumMethod<BlockHelper>
                ): WorldScannerBuilder;
                andBlockFilter(
                  method: BooStrNumMethod<BlockHelper>
                ): WorldScannerBuilder;
                orBlockFilter(
                  method: BooStrNumMethod<BlockHelper>
                ): WorldScannerBuilder;
                notBlockFilter(): WorldScannerBuilder;
                withStringBlockFilter(): WorldScannerBuilder;
                andStringBlockFilter(): WorldScannerBuilder;
                orStringBlockFilter(): WorldScannerBuilder;
                withStringStateFilter(): WorldScannerBuilder;
                andStringStateFilter(): WorldScannerBuilder;
                orStringStateFilter(): WorldScannerBuilder;
                /**
                 * for boolean value
                 */
                is(value: boolean): WorldScannerBuilder;
                /**
                 * for string value
                 */
                is(
                  method: StringFilterMethod,
                  value: string
                ): WorldScannerBuilder;
                /**
                 * for char value
                 */
                is(value: string): WorldScannerBuilder;
                /**
                 * for number value
                 */
                is(
                  operation: NumberFilterOperation,
                  value: number
                ): WorldScannerBuilder;
                /**
                 * for boolean value
                 */
                is(
                  methodArgs: any[],
                  filterArgs: [boolean]
                ): WorldScannerBuilder;
                /**
                 * for string value
                 */
                is(
                  methodArgs: any[],
                  filterArgs: [StringFilterMethod, string]
                ): WorldScannerBuilder;
                /**
                 * for char value
                 */
                is(
                  methodArgs: any[],
                  filterArgs: [string]
                ): WorldScannerBuilder;
                /**
                 * for number value
                 */
                is(
                  methodArgs: any[],
                  filterArgs: [NumberFilterOperation, number]
                ): WorldScannerBuilder;
                /**
                 * for boolean value
                 */
                test(value: boolean): WorldScannerBuilder;
                /**
                 * for string value
                 */
                test(
                  method: StringFilterMethod,
                  value: string
                ): WorldScannerBuilder;
                /**
                 * for char value
                 */
                test(value: string): WorldScannerBuilder;
                /**
                 * for number value
                 */
                test(
                  operation: NumberFilterOperation,
                  value: number
                ): WorldScannerBuilder;
                /**
                 * for boolean value
                 */
                test(
                  methodArgs: any[],
                  filterArgs: [boolean]
                ): WorldScannerBuilder;
                /**
                 * for string value
                 */
                test(
                  methodArgs: any[],
                  filterArgs: [StringFilterMethod, string]
                ): WorldScannerBuilder;
                /**
                 * for char value
                 */
                test(
                  methodArgs: any[],
                  filterArgs: [string]
                ): WorldScannerBuilder;
                /**
                 * for number value
                 */
                test(
                  methodArgs: any[],
                  filterArgs: [NumberFilterOperation, number]
                ): WorldScannerBuilder;
                equals(...args: string[]): WorldScannerBuilder;
                equals(arg0: any): boolean;
                contains(...args: string[]): WorldScannerBuilder;
                startsWith(...args: string[]): WorldScannerBuilder;
                endsWith(...args: string[]): WorldScannerBuilder;
                matches(...args: string[]): WorldScannerBuilder;
                build(): WorldScanner;
              }

              /**
               * A class to scan the world for certain blocks. The results of the filters are cached,
               *  so it's a good idea to reuse an instance of this if possible.
               *  The scanner can either return a list of all block positions or
               *  a list of blocks and their respective count for every block / state matching the filters criteria.
               * @author Etheradon
               * @since 1.6.5
               */
              const WorldScanner: JavaClassStatics<{
                /**
                 * Creates a new World scanner with for the given world. It accepts two boolean functions,
                 *  one for {@link BlockHelper} and the other for {@link BlockStateHelper}.
                 * @param world
                 * @param blockFilter
                 * @param stateFilter
                 */
                new (
                  world: /* minecraft class */ any,
                  blockFilter: java.util.function.Function<
                    BlockHelper,
                    boolean
                  >,
                  stateFilter: java.util.function.Function<
                    BlockStateHelper,
                    boolean
                  >
                ): WorldScanner;

                /** @deprecated */ Symbol: unknown;
                /** @deprecated */ apply: unknown;
                /** @deprecated */ arguments: unknown;
                /** @deprecated */ bind: unknown;
                /** @deprecated */ call: unknown;
                /** @deprecated */ caller: unknown;
                /** @deprecated */ length: unknown;
                /** @deprecated */ name: unknown;
                /** @deprecated */ prototype: unknown;
              }>;
              interface WorldScanner extends JavaObject {
                /**
                 * Gets a list of all chunks in the given range around the center chunk.
                 * @param centerX
                 * @param centerZ
                 * @param chunkrange
                 * @return
                 */
                getChunkRange(
                  centerX: number,
                  centerZ: number,
                  chunkrange: number
                ): JavaList</* minecraft class */ any>;

                /**
                 * Scans all chunks in the given range around the player and returns a list of all block positions, for blocks matching the filter.
                 *  This will scan in a square with length 2*range + 1. So range = 0 for example will only scan the chunk the player
                 *  is standing in, while range = 1 will scan in a 3x3 area.
                 * @param range
                 * @return
                 */
                scanAroundPlayer(range: number): JavaList<PositionCommon$Pos3D>;

                /**
                 * Scans all chunks in the given range around the center chunk and returns a list of all block positions, for blocks matching the filter.
                 *  This will scan in a square with length 2*range + 1. So range = 0 for example will only scan the specified chunk,
                 *  while range = 1 will scan in a 3x3 area.
                 * @param centerX
                 * @param centerZ
                 * @param chunkrange
                 * @return the list
                 */
                scanChunkRange(
                  centerX: number,
                  centerZ: number,
                  chunkrange: number
                ): JavaList<PositionCommon$Pos3D>;

                /**
                 * Gets the amount of all blocks matching the criteria inside the chunk.
                 * @param chunkX
                 * @param chunkZ
                 * @param ignoreState whether multiple states should be combined to a single block
                 * @return
                 */
                getBlocksInChunk(
                  chunkX: number,
                  chunkZ: number,
                  ignoreState: boolean
                ): JavaMap<string, number>;

                /**
                 * Gets the amount of all blocks matching the criteria inside square around the center chunk
                 *  with radius chunkrange/2.
                 * @param centerX
                 * @param centerZ
                 * @param chunkrange
                 * @param ignoreState whether multiple states should be combined to a single block
                 * @return
                 */
                getBlocksInChunks(
                  centerX: number,
                  centerZ: number,
                  chunkrange: number,
                  ignoreState: boolean
                ): JavaMap<string, number>;

                /**
                 * Get the amount of cached block states. This will normally be around 200 - 400.
                 * @return
                 */
                getCachedAmount(): number;
              }

              export { WorldScannerBuilder, WorldScanner };
            }

            export {
              TextBuilder,
              CommandManager,
              ChatHistoryManager,
              Draw2D,
              ScriptScreen,
              VillagerInventory,
              Inventory,
              PlayerInput,
              CommandBuilder,
              Draw3D,
              Draw3D$Surface,
              Draw3D$Box,
              Draw3D$Line,
              worldscanner,
            };
          }

          namespace sharedinterfaces {
            /**
             * @author Wagyourtail
             * @since 1.2.7
             */
            const IScreen: JavaInterfaceStatics;
            interface IScreen extends IDraw2D<IScreen> {
              /**
               * @since 1.2.7
               * @return
               */
              getScreenClassName(): ScreenClass;

              /**
               * @since 1.0.5
               * @return
               */
              getTitleText(): string;

              /**
               * in `1.3.1` updated to work with all button widgets not just ones added by scripts.
               * @since 1.0.5
               * @return
               */
              getButtonWidgets(): JavaList<ButtonWidgetHelper>;

              /**
               * in `1.3.1` updated to work with all text fields not just ones added by scripts.
               * @since 1.0.5
               * @return
               */
              getTextFields(): JavaList<TextFieldWidgetHelper>;

              /**
               * @since 1.0.5
               * @param x
               * @param y
               * @param width
               * @param height
               * @param text
               * @param callback calls your method as a {@link Consumer}&lt;{@link ButtonWidgetHelper}&gt;
               * @return
               */
              addButton(
                x: number,
                y: number,
                width: number,
                height: number,
                text: string,
                callback: MethodWrapper<ButtonWidgetHelper, IScreen, any, any>
              ): ButtonWidgetHelper;

              /**
               * @since 1.4.0
               * @param x
               * @param y
               * @param width
               * @param height
               * @param zIndex
               * @param text
               * @param callback calls your method as a {@link Consumer}&lt;{@link ButtonWidgetHelper}&gt;
               * @return
               */
              addButton(
                x: number,
                y: number,
                width: number,
                height: number,
                zIndex: number,
                text: string,
                callback: MethodWrapper<ButtonWidgetHelper, IScreen, any, any>
              ): ButtonWidgetHelper;

              /**
               * @since 1.0.5
               * @param btn
               * @return
               * @deprecated
               */
              removeButton(btn: ButtonWidgetHelper): IScreen;

              /**
               * @since 1.0.5
               * @param x
               * @param y
               * @param width
               * @param height
               * @param message
               * @param onChange calls your method as a {@link Consumer}&lt;{@link String}&gt;
               * @return
               */
              addTextInput(
                x: number,
                y: number,
                width: number,
                height: number,
                message: string,
                onChange: MethodWrapper<string, IScreen, any, any>
              ): TextFieldWidgetHelper;

              /**
               * @since 1.0.5
               * @param x
               * @param y
               * @param width
               * @param height
               * @param zIndex
               * @param message
               * @param onChange calls your method as a {@link Consumer}&lt;{@link String}&gt;
               * @return
               */
              addTextInput(
                x: number,
                y: number,
                width: number,
                height: number,
                zIndex: number,
                message: string,
                onChange: MethodWrapper<string, IScreen, any, any>
              ): TextFieldWidgetHelper;

              /**
               * @since 1.0.5
               * @param inp
               * @return
               * @deprecated
               */
              removeTextInput(inp: TextFieldWidgetHelper): IScreen;

              /**
               * @since 1.2.7
               * @param onMouseDown calls your method as a {@link BiConsumer}&lt;{@link PositionCommon.Pos2D}, {@link Integer}&gt;
               * @return
               */
              setOnMouseDown(
                onMouseDown: MethodWrapper<
                  PositionCommon$Pos2D,
                  number,
                  any,
                  any
                >
              ): IScreen;

              /**
               * @since 1.2.7
               * @param onMouseDrag calls your method as a {@link BiConsumer}&lt;{@link PositionCommon.Vec2D}, {@link Integer}&gt;
               * @return
               */
              setOnMouseDrag(
                onMouseDrag: MethodWrapper<
                  PositionCommon$Vec2D,
                  number,
                  any,
                  any
                >
              ): IScreen;

              /**
               * @since 1.2.7
               * @param onMouseUp calls your method as a {@link BiConsumer}&lt;{@link PositionCommon.Pos2D}, {@link Integer}&gt;
               * @return
               */
              setOnMouseUp(
                onMouseUp: MethodWrapper<PositionCommon$Pos2D, number, any, any>
              ): IScreen;

              /**
               * @since 1.2.7
               * @param onScroll calls your method as a {@link BiConsumer}&lt;{@link PositionCommon.Pos2D}, {@link Double}&gt;
               * @return
               */
              setOnScroll(
                onScroll: MethodWrapper<PositionCommon$Pos2D, number, any, any>
              ): IScreen;

              /**
               * @since 1.2.7
               * @param onKeyPressed calls your method as a {@link BiConsumer}&lt;{@link Integer}, {@link Integer}&gt;
               * @return
               */
              setOnKeyPressed(
                onKeyPressed: MethodWrapper<number, number, any, any>
              ): IScreen;

              /**
               * @since 1.2.7
               * @param onClose calls your method as a {@link Consumer}&lt;{@link IScreen}&gt;
               * @return
               */
              setOnClose(
                onClose: MethodWrapper<IScreen, any, any, any>
              ): IScreen;

              /** @since 1.1.9 */
              close(): void;

              /** @since 1.2.0 */
              addRect(
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: number
              ): RenderCommon$Rect;

              /** @since 1.2.0 */
              addRect(
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: number,
                alpha: number
              ): RenderCommon$Rect;

              /** @since 1.2.0 */
              addRect(
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: number,
                alpha: number,
                rotation: number
              ): RenderCommon$Rect;

              /**
               * @since 1.4.0
               * @param x1
               * @param y1
               * @param x2
               * @param y2
               * @param color as hex
               * @param alpha alpha channel 0-255
               * @param rotation as degrees
               * @param zIndex z-index
               * @return added rect
               */
              addRect(
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: number,
                alpha: number,
                rotation: number,
                zIndex: number
              ): RenderCommon$Rect;

              /**
               * @since 1.2.0
               * @deprecated
               */
              removeRect(r: RenderCommon$Rect): IScreen;

              /** @since 1.2.0 */
              addItem(x: number, y: number, id: ItemId): RenderCommon$Item;

              /** @since 1.2.0 */
              addItem(
                x: number,
                y: number,
                id: ItemId,
                overlay: boolean
              ): RenderCommon$Item;

              /** @since 1.2.0 */
              addItem(
                x: number,
                y: number,
                id: ItemId,
                overlay: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Item;

              /** @since 1.2.0 */
              addItem(
                x: number,
                y: number,
                item: ItemStackHelper
              ): RenderCommon$Item;

              /** @since 1.2.0 */
              addItem(
                x: number,
                y: number,
                item: ItemStackHelper,
                overlay: boolean
              ): RenderCommon$Item;

              /** @since 1.2.0 */
              addItem(
                x: number,
                y: number,
                item: ItemStackHelper,
                overlay: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Item;

              /**
               * @since 1.4.0
               * @param x left most corner
               * @param y top most corner
               * @param zIndex z-index
               * @param id item id
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                zIndex: number,
                id: string
              ): RenderCommon$Item;

              /**
               * @since 1.4.0
               * @param x left most corner
               * @param y top most corner
               * @param zIndex z-index
               * @param id item id
               * @param overlay should include overlay health and count
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                zIndex: number,
                id: string,
                overlay: boolean
              ): RenderCommon$Item;

              /**
               * @since 1.4.0
               * @param x left most corner
               * @param y top most corner
               * @param zIndex z-index
               * @param id item id
               * @param overlay should include overlay health and count
               * @param scale scale of item
               * @param rotation rotation of item
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                zIndex: number,
                id: string,
                overlay: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Item;

              /**
               * @since 1.4.0
               * @param x left most corner
               * @param y top most corner
               * @param zIndex z-index
               * @param item from inventory as helper
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                zIndex: number,
                item: ItemStackHelper
              ): RenderCommon$Item;

              /**
               * @since 1.4.0
               * @param x left most corner
               * @param y top most corner
               * @param zIndex z-index
               * @param item from inventory as helper
               * @param overlay should include overlay health and count
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                zIndex: number,
                item: ItemStackHelper,
                overlay: boolean
              ): RenderCommon$Item;

              /**
               * @since 1.4.0
               * @param x left most corner
               * @param y top most corner
               * @param zIndex z-index
               * @param item from inventory as helper
               * @param overlay should include overlay health and count
               * @param scale scale of item
               * @param rotation rotation of item
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                zIndex: number,
                item: ItemStackHelper,
                overlay: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Item;

              /**
               * @since 1.2.0
               * @deprecated
               */
              removeItem(i: RenderCommon$Item): IScreen;

              /**
               * calls the screen's init function re-loading it.
               * @since 1.2.7
               */
              reloadScreen(): IScreen;

              /**
               * DON'T TOUCH
               * @since 1.4.1
               */
              onRenderInternal(
                matrices: /* minecraft class */ any,
                mouseX: number,
                mouseY: number,
                delta: number
              ): void;
              getOnClose(): MethodWrapper<IScreen, any, any, any>;
            }

            /**
             * @author Wagyourtail
             * @since 1.2.7
             * @param <T>
             */
            const IDraw2D: JavaInterfaceStatics;
            interface IDraw2D<T> extends JavaObject {
              /**
               * @since 1.2.7
               * @return screen width
               */
              getWidth(): number;

              /**
               * @since 1.2.7
               * @return screen height
               */
              getHeight(): number;

              /**
               * @since 1.2.7
               * @return text elements
               * @deprecated
               */
              getTexts(): JavaList<RenderCommon$Text>;

              /**
               * @since 1.2.7
               * @return rect elements
               * @deprecated
               */
              getRects(): JavaList<RenderCommon$Rect>;

              /**
               * @since 1.2.7
               * @return item elements
               * @deprecated
               */
              getItems(): JavaList<RenderCommon$Item>;

              /**
               * @since 1.2.7
               * @return image elements
               * @deprecated
               */
              getImages(): JavaList<RenderCommon$Image>;

              /**
               * @since 1.2.9
               * @return a read only copy of the list of all elements added by scripts.
               */
              getElements(): JavaList<RenderCommon$RenderElement>;

              /**
               * removes any element regardless of type.
               * @since 1.2.9
               * @return self for chaining
               */
              removeElement(e: RenderCommon$RenderElement): T;

              /**
               * re-add an element you removed with {@link #removeElement}
               * @since 1.2.9
               * @return self for chaining
               */
              reAddElement(
                e: RenderCommon$RenderElement
              ): RenderCommon$RenderElement;

              /**
               * @since 1.2.7
               * @param text
               * @param x screen x
               * @param y screen y
               * @param color text color
               * @param shadow include shadow layer
               * @return added text
               */
              addText(
                text: string,
                x: number,
                y: number,
                color: number,
                shadow: boolean
              ): RenderCommon$Text;

              /**
               * @since 1.4.0
               * @param text
               * @param x screen x
               * @param y screen y
               * @param color text color
               * @param zIndex z-index
               * @param shadow include shadow layer
               * @return added text
               */
              addText(
                text: string,
                x: number,
                y: number,
                color: number,
                zIndex: number,
                shadow: boolean
              ): RenderCommon$Text;

              /**
               * @since 1.2.7
               * @param text
               * @param x screen x
               * @param y screen y
               * @param color text color
               * @param shadow include shadow layer
               * @param scale text scale (as double)
               * @param rotation text rotation (as degrees)
               * @return added text
               */
              addText(
                text: string,
                x: number,
                y: number,
                color: number,
                shadow: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Text;

              /**
               * @since 1.4.0
               * @param text
               * @param x screen x
               * @param y screen y
               * @param color text color
               * @param zIndex z-index
               * @param shadow include shadow layer
               * @param scale text scale (as double)
               * @param rotation text rotation (as degrees)
               * @return added text
               */
              addText(
                text: string,
                x: number,
                y: number,
                color: number,
                zIndex: number,
                shadow: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Text;

              /**
               * @since 1.2.7
               * @param text
               * @param x screen x
               * @param y screen y
               * @param color text color
               * @param shadow include shadow layer
               * @return added text
               */
              addText(
                text: TextHelper,
                x: number,
                y: number,
                color: number,
                shadow: boolean
              ): RenderCommon$Text;

              /**
               * @since 1.4.0
               * @param text
               * @param x screen x
               * @param y screen y
               * @param color text color
               * @param zIndex z-index
               * @param shadow include shadow layer
               * @return added text
               */
              addText(
                text: TextHelper,
                x: number,
                y: number,
                color: number,
                zIndex: number,
                shadow: boolean
              ): RenderCommon$Text;

              /**
               * @since 1.2.7
               * @param text
               * @param x screen x
               * @param y screen y
               * @param color text color
               * @param shadow include shadow layer
               * @param scale text scale (as double)
               * @param rotation text rotation (as degrees)
               * @return added text
               */
              addText(
                text: TextHelper,
                x: number,
                y: number,
                color: number,
                shadow: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Text;

              /**
               * @since 1.4.0
               * @param text
               * @param x screen x
               * @param y screen y
               * @param color text color
               * @param zIndex z-index
               * @param shadow include shadow layer
               * @param scale text scale (as double)
               * @param rotation text rotation (as degrees)
               * @return added text
               */
              addText(
                text: TextHelper,
                x: number,
                y: number,
                color: number,
                zIndex: number,
                shadow: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Text;

              /**
               * @since 1.2.7
               * @param t
               * @return self for chaining
               * @deprecated
               */
              removeText(t: RenderCommon$Text): T;

              /**
               * @since 1.2.7
               * @param x screen x, top left corner
               * @param y screen y, top left corner
               * @param width width on screen
               * @param height height on screen
               * @param id image id, in the form {@code minecraft:textures} path'd as found in texture packs, ie {@code assets/minecraft/textures/gui/recipe_book.png} becomes {@code minecraft:textures/gui/recipe_book.png}
               * @param imageX the left-most coordinate of the texture region
               * @param imageY the top-most coordinate of the texture region
               * @param regionWidth the width the texture region
               * @param regionHeight the height the texture region
               * @param textureWidth the width of the entire texture
               * @param textureHeight the height of the entire texture
               * @return added image
               */
              addImage(
                x: number,
                y: number,
                width: number,
                height: number,
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number
              ): RenderCommon$Image;

              /**
               * @since 1.4.0
               * @param x screen x, top left corner
               * @param y screen y, top left corner
               * @param width width on screen
               * @param height height on screen
               * @param zIndex z-index
               * @param id image id, in the form {@code minecraft:textures} path'd as found in texture packs, ie {@code assets/minecraft/textures/gui/recipe_book.png} becomes {@code minecraft:textures/gui/recipe_book.png}
               * @param imageX the left-most coordinate of the texture region
               * @param imageY the top-most coordinate of the texture region
               * @param regionWidth the width the texture region
               * @param regionHeight the height the texture region
               * @param textureWidth the width of the entire texture
               * @param textureHeight the height of the entire texture
               * @return added image
               */
              addImage(
                x: number,
                y: number,
                width: number,
                height: number,
                zIndex: number,
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number
              ): RenderCommon$Image;

              /**
               * @since 1.2.7
               * @param x screen x, top left corner
               * @param y screen y, top left corner
               * @param width width on screen
               * @param height height on screen
               * @param id image id, in the form {@code minecraft:textures} path'd as found in texture packs, ie {@code assets/minecraft/textures/gui/recipe_book.png} becomes {@code minecraft:textures/gui/recipe_book.png}
               * @param imageX the left-most coordinate of the texture region
               * @param imageY the top-most coordinate of the texture region
               * @param regionWidth the width the texture region
               * @param regionHeight the height the texture region
               * @param textureWidth the width of the entire texture
               * @param textureHeight the height of the entire texture
               * @param rotation the rotation of the texture (as degrees)
               * @return added image
               */
              addImage(
                x: number,
                y: number,
                width: number,
                height: number,
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number,
                rotation: number
              ): RenderCommon$Image;

              /**
               * @since 1.4.0
               * @param x screen x, top left corner
               * @param y screen y, top left corner
               * @param width width on screen
               * @param height height on screen
               * @param zIndex z-index
               * @param id image id, in the form {@code minecraft:textures} path'd as found in texture packs, ie {@code assets/minecraft/textures/gui/recipe_book.png} becomes {@code minecraft:textures/gui/recipe_book.png}
               * @param imageX the left-most coordinate of the texture region
               * @param imageY the top-most coordinate of the texture region
               * @param regionWidth the width the texture region
               * @param regionHeight the height the texture region
               * @param textureWidth the width of the entire texture
               * @param textureHeight the height of the entire texture
               * @param rotation the rotation of the texture (as degrees)
               * @return added image
               */
              addImage(
                x: number,
                y: number,
                width: number,
                height: number,
                zIndex: number,
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number,
                rotation: number
              ): RenderCommon$Image;

              /**
               * @param x
               * @param y
               * @param width
               * @param height
               * @param zIndex
               * @param color
               * @param id
               * @param imageX
               * @param imageY
               * @param regionWidth
               * @param regionHeight
               * @param textureWidth
               * @param textureHeight
               * @param rotation
               * @since 1.6.5
               * @return
               */
              addImage(
                x: number,
                y: number,
                width: number,
                height: number,
                zIndex: number,
                color: number,
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number,
                rotation: number
              ): RenderCommon$Image;

              /**
               * @param x
               * @param y
               * @param width
               * @param height
               * @param zIndex
               * @param alpha
               * @param color
               * @param id
               * @param imageX
               * @param imageY
               * @param regionWidth
               * @param regionHeight
               * @param textureWidth
               * @param textureHeight
               * @param rotation
               * @since 1.6.5
               * @return
               */
              addImage(
                x: number,
                y: number,
                width: number,
                height: number,
                zIndex: number,
                alpha: number,
                color: number,
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number,
                rotation: number
              ): RenderCommon$Image;

              /**
               * @since 1.2.7
               * @param i
               * @return self for chaining
               * @deprecated
               */
              removeImage(i: RenderCommon$Image): T;

              /**
               * @since 1.2.7
               * @param x1
               * @param y1
               * @param x2
               * @param y2
               * @param color as hex, with alpha channel
               * @return added rect
               */
              addRect(
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: number
              ): RenderCommon$Rect;

              /**
               * @since 1.2.7
               * @param x1
               * @param y1
               * @param x2
               * @param y2
               * @param color as hex
               * @param alpha alpha channel 0-255
               * @return added rect
               */
              addRect(
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: number,
                alpha: number
              ): RenderCommon$Rect;

              /**
               * @since 1.2.7
               * @param x1
               * @param y1
               * @param x2
               * @param y2
               * @param color as hex
               * @param alpha alpha channel 0-255
               * @param rotation as degrees
               * @return added rect
               */
              addRect(
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: number,
                alpha: number,
                rotation: number
              ): RenderCommon$Rect;

              /**
               * @since 1.4.0
               * @param x1
               * @param y1
               * @param x2
               * @param y2
               * @param color as hex
               * @param alpha alpha channel 0-255
               * @param rotation as degrees
               * @param zIndex z-index
               * @return added rect
               */
              addRect(
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: number,
                alpha: number,
                rotation: number,
                zIndex: number
              ): RenderCommon$Rect;

              /**
               * @since 1.2.7
               * @param r
               * @return self for chaining
               * @deprecated
               */
              removeRect(r: RenderCommon$Rect): T;

              /**
               * @since 1.2.7
               * @param x left most corner
               * @param y top most corner
               * @param id item id
               * @return added item
               */
              addItem(x: number, y: number, id: string): RenderCommon$Item;

              /**
               * @since 1.4.0
               * @param x left most corner
               * @param y top most corner
               * @param zIndex z-index
               * @param id item id
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                zIndex: number,
                id: string
              ): RenderCommon$Item;

              /**
               * @since 1.2.7
               * @param x left most corner
               * @param y top most corner
               * @param id item id
               * @param overlay should include overlay health and count
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                id: string,
                overlay: boolean
              ): RenderCommon$Item;

              /**
               * @since 1.4.0
               * @param x left most corner
               * @param y top most corner
               * @param zIndex z-index
               * @param id item id
               * @param overlay should include overlay health and count
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                zIndex: number,
                id: string,
                overlay: boolean
              ): RenderCommon$Item;

              /**
               * @since 1.2.7
               * @param x left most corner
               * @param y top most corner
               * @param id item id
               * @param overlay should include overlay health and count
               * @param scale scale of item
               * @param rotation rotation of item
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                id: string,
                overlay: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Item;

              /**
               * @since 1.4.0
               * @param x left most corner
               * @param y top most corner
               * @param zIndex z-index
               * @param id item id
               * @param overlay should include overlay health and count
               * @param scale scale of item
               * @param rotation rotation of item
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                zIndex: number,
                id: string,
                overlay: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Item;

              /**
               * @since 1.2.7
               * @param x left most corner
               * @param y top most corner
               * @param item from inventory as helper
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                item: ItemStackHelper
              ): RenderCommon$Item;

              /**
               * @since 1.4.0
               * @param x left most corner
               * @param y top most corner
               * @param zIndex z-index
               * @param item from inventory as helper
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                zIndex: number,
                item: ItemStackHelper
              ): RenderCommon$Item;

              /**
               * @since 1.2.7
               * @param x left most corner
               * @param y top most corner
               * @param item from inventory as helper
               * @param overlay should include overlay health and count
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                item: ItemStackHelper,
                overlay: boolean
              ): RenderCommon$Item;

              /**
               * @since 1.4.0
               * @param x left most corner
               * @param y top most corner
               * @param zIndex z-index
               * @param item from inventory as helper
               * @param overlay should include overlay health and count
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                zIndex: number,
                item: ItemStackHelper,
                overlay: boolean
              ): RenderCommon$Item;

              /**
               * @since 1.2.7
               * @param x left most corner
               * @param y top most corner
               * @param item from inventory as helper
               * @param overlay should include overlay health and count
               * @param scale scale of item
               * @param rotation rotation of item
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                item: ItemStackHelper,
                overlay: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Item;

              /**
               * @since 1.4.0
               * @param x left most corner
               * @param y top most corner
               * @param zIndex z-index
               * @param item from inventory as helper
               * @param overlay should include overlay health and count
               * @param scale scale of item
               * @param rotation rotation of item
               * @return added item
               */
              addItem(
                x: number,
                y: number,
                zIndex: number,
                item: ItemStackHelper,
                overlay: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Item;

              /**
               * @since 1.2.7
               * @param i
               * @return self for chaining
               * @deprecated
               */
              removeItem(i: RenderCommon$Item): T;

              /**
               * @since 1.2.7
               * @param onInit calls your method as a {@link Consumer}&lt;{@link T}&gt;
               * @return self for chaining
               */
              setOnInit(onInit: MethodWrapper<T, any, any, any>): T;

              /**
               * @since 1.2.7
               * @param catchInit calls your method as a {@link Consumer}&lt;{@link String}&gt;
               * @return self for chaining
               */
              setOnFailInit(catchInit: MethodWrapper<string, any, any, any>): T;

              /**
               * internal
               * @param matrixStack
               */
              render(matrixStack: /* minecraft class */ any): void;
            }

            export { IScreen, IDraw2D };
          }

          namespace sharedclasses {
            /**
             * @author Wagyourtail
             * @since 1.2.6 [citation needed]
             */
            const PositionCommon$Pos3D: JavaClassStatics<{
              new (vec: /* minecraft class */ any): PositionCommon$Pos3D;
              new (x: number, y: number, z: number): PositionCommon$Pos3D;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }> & {
              readonly ZERO: PositionCommon$Pos3D;
            };
            interface PositionCommon$Pos3D extends PositionCommon$Pos2D {
              z: number;

              getZ(): number;
              add(pos: PositionCommon$Pos3D): PositionCommon$Pos3D;

              /**
               * @since 1.6.3
               * @param x
               * @param y
               * @param z
               * @return
               */
              add(x: number, y: number, z: number): PositionCommon$Pos3D;
              add(pos: PositionCommon$Pos2D): PositionCommon$Pos2D;

              /**
               * @since 1.6.3
               * @param x
               * @param y
               * @return
               */
              add(x: number, y: number): PositionCommon$Pos2D;
              multiply(pos: PositionCommon$Pos3D): PositionCommon$Pos3D;

              /**
               * @since 1.6.3
               * @param x
               * @param y
               * @param z
               * @return
               */
              multiply(x: number, y: number, z: number): PositionCommon$Pos3D;
              multiply(pos: PositionCommon$Pos2D): PositionCommon$Pos2D;

              /**
               * @since 1.6.3
               * @param x
               * @param y
               * @return
               */
              multiply(x: number, y: number): PositionCommon$Pos2D;

              /**
               * @since 1.6.3
               * @param scale
               * @return
               */
              scale(scale: number): PositionCommon$Pos3D;
              toVector(): PositionCommon$Vec3D;

              /**
               * @since 1.6.4
               * @param start_pos
               * @return
               */
              toVector(start_pos: PositionCommon$Pos2D): PositionCommon$Vec3D;

              /**
               * @since 1.6.4
               * @param start_pos
               * @return
               */
              toVector(start_pos: PositionCommon$Pos3D): PositionCommon$Vec3D;

              /**
               * @since 1.6.4
               * @param start_x
               * @param start_y
               * @param start_z
               * @return
               */
              toVector(
                start_x: number,
                start_y: number,
                start_z: number
              ): PositionCommon$Vec3D;

              /**
               * @since 1.6.4
               * @param start_x
               * @param start_y
               * @return
               */
              toVector(start_x: number, start_y: number): PositionCommon$Vec2D;

              /**
               * @since 1.6.4
               * @return
               */
              toReverseVector(): PositionCommon$Vec3D;
              toReverseVector(
                end_pos: PositionCommon$Pos2D
              ): PositionCommon$Vec3D;

              /**
               * @since 1.6.4
               * @param end_pos
               * @return
               */
              toReverseVector(
                end_pos: PositionCommon$Pos3D
              ): PositionCommon$Vec3D;

              /**
               * @since 1.6.4
               * @param end_x
               * @param end_y
               * @param end_z
               * @return
               */
              toReverseVector(
                end_x: number,
                end_y: number,
                end_z: number
              ): PositionCommon$Vec3D;

              /**
               * @since 1.6.4
               * @param end_x
               * @param end_y
               * @return
               */
              toReverseVector(
                end_x: number,
                end_y: number
              ): PositionCommon$Vec2D;

              /**
               * @since 1.8.0
               * @return
               */
              toBlockPos(): BlockPosHelper;

              /**
               * @since 1.8.0
               * @return
               */
              toRawBlockPos(): /* minecraft class */ any;
            }

            /**
             * @author Wagyourtail
             * @since 1.2.6 [citation needed]
             */
            const PositionCommon$Vec3D: JavaClassStatics<{
              new (
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number
              ): PositionCommon$Vec3D;
              new (
                start: PositionCommon$Pos3D,
                end: PositionCommon$Pos3D
              ): PositionCommon$Vec3D;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface PositionCommon$Vec3D extends PositionCommon$Vec2D {
              z1: number;
              z2: number;

              getZ1(): number;
              getZ2(): number;
              getDeltaZ(): number;
              getStart(): PositionCommon$Pos3D;
              getEnd(): PositionCommon$Pos3D;
              getMagnitude(): number;
              getMagnitudeSq(): number;
              add(vec: PositionCommon$Vec3D): PositionCommon$Vec3D;
              add(vec: PositionCommon$Vec2D): PositionCommon$Vec2D;

              /**
               * @since 1.6.3
               * @param x1
               * @param y1
               * @param x2
               * @param y2
               * @return
               */
              add(
                x1: number,
                y1: number,
                x2: number,
                y2: number
              ): PositionCommon$Vec2D;

              /**
               * @since 1.6.4
               * @param pos
               * @return
               */
              addStart(pos: PositionCommon$Pos3D): PositionCommon$Vec3D;

              /**
               * @since 1.6.4
               * @param pos
               * @return
               */
              addEnd(pos: PositionCommon$Pos3D): PositionCommon$Vec3D;

              /**
               * @since 1.6.4
               * @param x
               * @param y
               * @param z
               * @return
               */
              addStart(x: number, y: number, z: number): PositionCommon$Vec3D;

              /**
               * @since 1.6.4
               * @param x
               * @param y
               * @param z
               * @return
               */
              addEnd(x: number, y: number, z: number): PositionCommon$Vec3D;

              /**
               * @since 1.6.3
               * @param x1
               * @param y1
               * @param z1
               * @param x2
               * @param y2
               * @param z2
               * @return
               */
              add(
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number
              ): PositionCommon$Vec3D;
              multiply(vec: PositionCommon$Vec3D): PositionCommon$Vec3D;

              /**
               * @since 1.6.3
               * @param x1
               * @param y1
               * @param z1
               * @param x2
               * @param y2
               * @param z2
               * @return
               */
              multiply(
                x1: number,
                y1: number,
                z1: number,
                x2: number,
                y2: number,
                z2: number
              ): PositionCommon$Vec3D;
              multiply(vec: PositionCommon$Vec2D): PositionCommon$Vec2D;

              /**
               * @since 1.6.3
               * @param x1
               * @param y1
               * @param x2
               * @param y2
               * @return
               */
              multiply(
                x1: number,
                y1: number,
                x2: number,
                y2: number
              ): PositionCommon$Vec2D;

              /**
               * @since 1.6.3
               * @param scale
               * @return
               */
              scale(scale: number): PositionCommon$Vec3D;

              /**
               * @since 1.6.5
               * @return
               */
              normalize(): PositionCommon$Vec3D;
              getPitch(): number;
              getYaw(): number;
              dotProduct(vec: PositionCommon$Vec3D): number;
              dotProduct(vec: PositionCommon$Vec2D): number;
              crossProduct(vec: PositionCommon$Vec3D): PositionCommon$Vec3D;
              reverse(): PositionCommon$Vec3D;

              /**
               * @since 1.6.5
               * @return
               */
              toMojangFloatVector(): /* minecraft class */ any;
            }

            /**
             * @author Wagyourtail
             * @since 1.2.6 [citation needed]
             */
            const PositionCommon$Vec2D: JavaClassStatics<{
              new (
                x1: number,
                y1: number,
                x2: number,
                y2: number
              ): PositionCommon$Vec2D;
              new (
                start: PositionCommon$Pos2D,
                end: PositionCommon$Pos2D
              ): PositionCommon$Vec2D;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface PositionCommon$Vec2D extends JavaObject {
              x1: number;
              y1: number;
              x2: number;
              y2: number;

              getX1(): number;
              getY1(): number;
              getX2(): number;
              getY2(): number;
              getDeltaX(): number;
              getDeltaY(): number;
              getStart(): PositionCommon$Pos2D;
              getEnd(): PositionCommon$Pos2D;
              getMagnitude(): number;

              /**
               * @since 1.6.5
               * @return magnitude squared
               */
              getMagnitudeSq(): number;
              add(vec: PositionCommon$Vec2D): PositionCommon$Vec2D;

              /**
               * @since 1.6.3
               * @param x1
               * @param y1
               * @param x2
               * @param y2
               * @return
               */
              add(
                x1: number,
                y1: number,
                x2: number,
                y2: number
              ): PositionCommon$Vec2D;
              multiply(vec: PositionCommon$Vec2D): PositionCommon$Vec2D;

              /**
               * @since 1.6.3
               * @param x1
               * @param y1
               * @param x2
               * @param y2
               * @return
               */
              multiply(
                x1: number,
                y1: number,
                x2: number,
                y2: number
              ): PositionCommon$Vec2D;

              /**
               * @since 1.6.3
               * @param scale
               * @return
               */
              scale(scale: number): PositionCommon$Vec2D;
              dotProduct(vec: PositionCommon$Vec2D): number;
              reverse(): PositionCommon$Vec2D;

              /**
               * @return a new Vec2D with the same direction but a magnitude of 1
               * @since 1.6.5
               */
              normalize(): PositionCommon$Vec2D;
              to3D(): PositionCommon$Vec3D;
            }

            /**
             * @author Wagyourtail
             * @since 1.2.6 [citation needed]
             */
            const PositionCommon$Pos2D: JavaClassStatics<
              [PositionCommon$Pos2D],
              [x: number, y: number]
            > & {
              readonly ZERO: PositionCommon$Pos2D;
            };
            interface PositionCommon$Pos2D extends JavaObject {
              x: number;
              y: number;

              getX(): number;
              getY(): number;
              add(pos: PositionCommon$Pos2D): PositionCommon$Pos2D;

              /**
               * @since 1.6.3
               * @param x
               * @param y
               * @return
               */
              add(x: number, y: number): PositionCommon$Pos2D;
              multiply(pos: PositionCommon$Pos2D): PositionCommon$Pos2D;

              /**
               * @since 1.6.3
               * @param x
               * @param y
               * @return
               */
              multiply(x: number, y: number): PositionCommon$Pos2D;

              /**
               * @since 1.6.3
               * @param scale
               * @return
               */
              scale(scale: number): PositionCommon$Pos2D;
              to3D(): PositionCommon$Pos3D;
              toVector(): PositionCommon$Vec2D;

              /**
               * @since 1.6.4
               * @param start_pos
               * @return
               */
              toVector(start_pos: PositionCommon$Pos2D): PositionCommon$Vec2D;

              /**
               * @since 1.6.4
               * @param start_x
               * @param start_y
               * @return
               */
              toVector(start_x: number, start_y: number): PositionCommon$Vec2D;

              /**
               * @since 1.6.4
               * @return
               */
              toReverseVector(): PositionCommon$Vec2D;

              /**
               * @since 1.6.4
               * @param end_pos
               * @return
               */
              toReverseVector(
                end_pos: PositionCommon$Pos2D
              ): PositionCommon$Vec2D;

              /**
               * @since 1.6.4
               * @param end_x
               * @param end_y
               * @return
               */
              toReverseVector(
                end_x: number,
                end_y: number
              ): PositionCommon$Vec2D;
            }

            const RenderCommon$RenderElement: JavaInterfaceStatics;
            interface RenderCommon$RenderElement extends JavaObject {
              getZIndex(): number;
              render3D(
                matrices: /* minecraft class */ any,
                mouseX: number,
                mouseY: number,
                delta: number
              ): void;
            }

            /**
             * @author Wagyourtail
             * @since 1.0.5
             */
            const RenderCommon$Item: JavaClassStatics<{
              new (
                x: number,
                y: number,
                zIndex: number,
                id: string,
                overlay: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Item;
              new (
                x: number,
                y: number,
                zIndex: number,
                i: ItemStackHelper,
                overlay: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Item;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface RenderCommon$Item extends RenderCommon$RenderElement {
              item: /* minecraft class */ any;
              ovText: string;
              overlay: boolean;
              scale: number;
              rotation: number;
              x: number;
              y: number;
              zIndex: number;

              /**
               * @since 1.0.5
               * @param x
               * @param y
               * @return
               */
              setPos(x: number, y: number): RenderCommon$Item;

              /**
               * @since 1.2.6
               * @param scale
               * @return
               * @throws Exception
               */
              setScale(scale: number): RenderCommon$Item;

              /**
               * @since 1.2.6
               * @param rotation
               * @return
               */
              setRotation(rotation: number): RenderCommon$Item;

              /**
               * @since 1.2.0
               * @param overlay
               * @return
               */
              setOverlay(overlay: boolean): RenderCommon$Item;

              /**
               * @since 1.2.0
               * @param ovText
               * @return
               */
              setOverlayText(ovText: string): RenderCommon$Item;

              /**
               * @since 1.0.5 [citation needed]
               * @param i
               * @return
               */
              setItem(i: ItemStackHelper): RenderCommon$Item;

              /**
               * @since 1.0.5 [citation needed]
               * @param id
               * @param count
               * @return
               */
              setItem(id: ItemId, count: number): RenderCommon$Item;

              /**
               * @since 1.0.5 [citation needed]
               * @return
               */
              getItem(): ItemStackHelper;
              render3D(
                matrices: /* minecraft class */ any,
                mouseX: number,
                mouseY: number,
                delta: number
              ): void;
              getZIndex(): number;
            }

            /**
             * @author Wagyourtail
             * @since 1.0.5
             */
            const RenderCommon$Text: JavaClassStatics<{
              new (
                text: string,
                x: number,
                y: number,
                color: number,
                zIndex: number,
                shadow: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Text;
              new (
                text: TextHelper,
                x: number,
                y: number,
                color: number,
                zIndex: number,
                shadow: boolean,
                scale: number,
                rotation: number
              ): RenderCommon$Text;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface RenderCommon$Text extends RenderCommon$RenderElement {
              text: /* minecraft class */ any;
              scale: number;
              rotation: number;
              x: number;
              y: number;
              color: number;
              width: number;
              shadow: boolean;
              zIndex: number;

              /**
               * @since 1.0.5
               * @param scale
               * @return
               * @throws Exception
               */
              setScale(scale: number): RenderCommon$Text;

              /**
               * @since 1.0.5
               * @param rotation
               * @return
               */
              setRotation(rotation: number): RenderCommon$Text;

              /**
               * @since 1.0.5
               * @param x
               * @param y
               * @return
               */
              setPos(x: number, y: number): RenderCommon$Text;

              /**
               * @since 1.0.5
               * @param text
               * @return
               */
              setText(text: string): RenderCommon$Text;

              /**
               * @since 1.2.7
               * @param text
               * @return
               */
              setText(text: TextHelper): RenderCommon$Text;

              /**
               * @since 1.2.7
               * @return
               */
              getText(): TextHelper;

              /**
               * @since 1.0.5
               * @return
               */
              getWidth(): number;
              render3D(
                matrices: /* minecraft class */ any,
                mouseX: number,
                mouseY: number,
                delta: number
              ): void;
              getZIndex(): number;
            }

            /**
             * @author Wagyourtail
             * @since 1.0.5
             */
            const RenderCommon$Rect: JavaClassStatics<{
              new (
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: number,
                rotation: number,
                zIndex: number
              ): RenderCommon$Rect;
              new (
                x1: number,
                y1: number,
                x2: number,
                y2: number,
                color: number,
                alpha: number,
                rotation: number,
                zIndex: number
              ): RenderCommon$Rect;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface RenderCommon$Rect extends RenderCommon$RenderElement {
              rotation: number;
              x1: number;
              y1: number;
              x2: number;
              y2: number;
              color: number;
              zIndex: number;

              /**
               * @since 1.0.5
               * @param color
               * @return
               */
              setColor(color: number): RenderCommon$Rect;

              /**
               * @since 1.1.8
               * @param color
               * @param alpha
               * @return
               */
              setColor(color: number, alpha: number): RenderCommon$Rect;

              /**
               * @since 1.1.8
               * @param alpha
               * @return
               */
              setAlpha(alpha: number): RenderCommon$Rect;

              /**
               * @since 1.1.8
               * @param x1
               * @param y1
               * @param x2
               * @param y2
               * @return
               */
              setPos(
                x1: number,
                y1: number,
                x2: number,
                y2: number
              ): RenderCommon$Rect;

              /**
               * @since 1.2.6
               * @param rotation
               * @return
               */
              setRotation(rotation: number): RenderCommon$Rect;
              getZIndex(): number;
            }

            /**
             * @author Wagyourtail
             * @since 1.2.3
             */
            const RenderCommon$Image: JavaClassStatics<{
              new (
                x: number,
                y: number,
                width: number,
                height: number,
                zIndex: number,
                color: number,
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number,
                rotation: number
              ): RenderCommon$Image;
              new (
                x: number,
                y: number,
                width: number,
                height: number,
                zIndex: number,
                alpha: number,
                color: number,
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number,
                rotation: number
              ): RenderCommon$Image;

              /** @deprecated */ Symbol: unknown;
              /** @deprecated */ apply: unknown;
              /** @deprecated */ arguments: unknown;
              /** @deprecated */ bind: unknown;
              /** @deprecated */ call: unknown;
              /** @deprecated */ caller: unknown;
              /** @deprecated */ length: unknown;
              /** @deprecated */ name: unknown;
              /** @deprecated */ prototype: unknown;
            }>;
            interface RenderCommon$Image extends RenderCommon$RenderElement {
              rotation: number;
              x: number;
              y: number;
              width: number;
              height: number;
              imageX: number;
              imageY: number;
              regionWidth: number;
              regionHeight: number;
              textureWidth: number;
              textureHeight: number;
              color: number;
              zIndex: number;

              /**
               * @since 1.6.5
               * @param color
               * @return
               */
              setColor(color: number): RenderCommon$Image;

              /**
               * @since 1.6.5
               * @param color
               * @param alpha
               * @return
               */
              setColor(color: number, alpha: number): RenderCommon$Image;

              /**
               * @since 1.2.3
               * @param x
               * @param y
               * @param width
               * @param height
               */
              setPos(x: number, y: number, width: number, height: number): void;

              /**
               * @since 1.2.6
               * @param rotation
               * @return
               */
              setRotation(rotation: number): RenderCommon$Image;

              /**
               * @since 1.2.3
               * @param id
               * @param imageX
               * @param imageY
               * @param regionWidth
               * @param regionHeight
               * @param textureWidth
               * @param textureHeight
               */
              setImage(
                id: string,
                imageX: number,
                imageY: number,
                regionWidth: number,
                regionHeight: number,
                textureWidth: number,
                textureHeight: number
              ): void;

              /**
               * @since 1.2.3
               * @return
               */
              getImage(): string;
              getZIndex(): number;
            }

            export {
              PositionCommon$Pos3D,
              PositionCommon$Vec3D,
              PositionCommon$Vec2D,
              PositionCommon$Pos2D,
              RenderCommon$RenderElement,
              RenderCommon$Item,
              RenderCommon$Text,
              RenderCommon$Rect,
              RenderCommon$Image,
            };
          }
        }

        namespace gui {
          namespace editor {
            const SelectCursor: JavaClassStatics<
              [SelectCursor],
              [defaultStyle: /* minecraft class */ any]
            >;
            interface SelectCursor extends JavaObject {
              onChange: java.util.function.Consumer<SelectCursor>;
              defaultStyle: /* minecraft class */ any;
              startLine: number;
              endLine: number;
              startIndex: number;
              endIndex: number;
              startLineIndex: number;
              endLineIndex: number;
              dragStartIndex: number;
              arrowLineIndex: number;
              arrowEnd: boolean;
              startCol: number;
              endCol: number;

              updateStartIndex(startIndex: number, current: string): void;
              updateEndIndex(endIndex: number, current: string): void;
            }

            /**
             */
            const History: JavaClassStatics<
              [History],
              [start: string, cursor: SelectCursor]
            >;
            interface History extends JavaObject {
              onChange: java.util.function.Consumer<string>;
              current: string;

              /**
               * @param position
               * @param content
               * @return is new step.
               */
              addChar(position: number, content: number): boolean;
              add(position: number, content: string): boolean;

              /**
               * @param position
               * @return is new step.
               */
              deletePos(position: number, length: number): boolean;

              /**
               * @param position
               * @return is new step
               */
              bkspacePos(position: number, length: number): boolean;
              shiftLine(
                startLine: number,
                lines: number,
                shiftDown: boolean
              ): boolean;
              replace(position: number, length: number, content: string): void;
              tabLines(
                startLine: number,
                lineCount: number,
                reverse: boolean
              ): void;
              tabLinesKeepCursor(
                startLine: number,
                startLineIndex: number,
                endLineIndex: number,
                lineCount: number,
                reverse: boolean
              ): void;

              /**
               * @return position of step. -1 if nothing to undo.
               */
              undo(): number;

              /**
               * @return position of step. -1 if nothing to redo.
               */
              redo(): number;
            }

            namespace highlighting {
              const AutoCompleteSuggestion: JavaClassStatics<{
                new (
                  startIndex: number,
                  suggestion: string
                ): AutoCompleteSuggestion;
                new (
                  startIndex: number,
                  suggestion: string,
                  displayText: /* minecraft class */ any
                ): AutoCompleteSuggestion;

                /** @deprecated */ Symbol: unknown;
                /** @deprecated */ apply: unknown;
                /** @deprecated */ arguments: unknown;
                /** @deprecated */ bind: unknown;
                /** @deprecated */ call: unknown;
                /** @deprecated */ caller: unknown;
                /** @deprecated */ length: unknown;
                /** @deprecated */ name: unknown;
                /** @deprecated */ prototype: unknown;
              }>;
              interface AutoCompleteSuggestion extends JavaObject {
                readonly startIndex: number;
                readonly suggestion: string;
                readonly displayText: /* minecraft class */ any;
              }

              const AbstractRenderCodeCompiler: JavaClassStatics<
                [AbstractRenderCodeCompiler],
                [language: string, screen: EditorScreen]
              >;
              interface AbstractRenderCodeCompiler extends JavaObject {
                recompileRenderedText(text: string): void;
                getRightClickOptions(
                  index: number
                ): JavaMap<string, java.lang.Runnable>;
                getRenderedText(): /* minecraft class */ any[];
                getSuggestions(): JavaList<AutoCompleteSuggestion>;
              }

              export { AutoCompleteSuggestion, AbstractRenderCodeCompiler };
            }

            export { SelectCursor, History, highlighting };
          }

          namespace screens {
            const EditorScreen: JavaClassStatics<
              [EditorScreen],
              [parent: /* minecraft class */ any, file: java.io.File]
            > & {
              readonly langs: JavaList<string>;
              defaultStyle: /* minecraft class */ any;

              openAndScrollToIndex(
                file: java.io.File,
                startIndex: number,
                endIndex: number
              ): void;
              openAndScrollToLine(
                file: java.io.File,
                line: number,
                col: number,
                endCol: number
              ): void;
            };
            interface EditorScreen extends BaseScreen {
              readonly history: History;
              readonly cursor: SelectCursor;
              blockFirst: boolean;
              textRenderTime: number;
              prevChar: number;
              language: string;
              codeCompiler: AbstractRenderCodeCompiler;

              getDefaultLanguage(): string;
              setScroll(pages: number): void;
              setLanguage(language: string): void;
              copyToClipboard(): void;
              pasteFromClipboard(): void;
              cutToClipboard(): void;
              scrollToCursor(): void;
              save(): void;
              needSave(): boolean;
              openParent(): void;
              selectWordAtCursor(): void;
              updateSettings(): void;
            }

            export { EditorScreen };
          }
        }
      }
    }

    namespace wagyourgui {
      const BaseScreen: JavaClassStatics<false> & {
        trimmed(
          textRenderer: /* minecraft class */ any,
          str: /* minecraft class */ any,
          width: number
        ): /* minecraft class */ any;
      };
      interface BaseScreen
        extends /* supressed minecraft class */ JavaObject,
          IOverlayParent,
          IScreen {
        setParent(parent: /* minecraft class */ any): void;
        reload(): void;
        openOverlay(overlay: OverlayContainer): void;
        getFirstOverlayParent(): IOverlayParent;
        getChildOverlay(): OverlayContainer;
        openOverlay(overlay: OverlayContainer, disableButtons: boolean): void;
        closeOverlay(overlay: OverlayContainer): void;
        updateSettings(): void;
        openParent(): void;
      }

      namespace overlays {
        const OverlayContainer: JavaClassStatics<
          [OverlayContainer],
          [
            x: number,
            y: number,
            width: number,
            height: number,
            textRenderer: /* minecraft class */ any,
            parent: IOverlayParent
          ]
        >;
        interface OverlayContainer
          extends MultiElementContainer<IOverlayParent>,
            IOverlayParent {
          savedBtnStates: JavaMap</* minecraft class */ any, boolean>;
          scroll: Scrollbar;

          remove(btn: /* minecraft class */ any): void;
          openOverlay(overlay: OverlayContainer): void;
          getFirstOverlayParent(): IOverlayParent;
          openOverlay(overlay: OverlayContainer, disableButtons: boolean): void;
          getChildOverlay(): OverlayContainer;
          closeOverlay(overlay: OverlayContainer): void;
          setFocused(focused: /* minecraft class */ any): void;
          onClick(mouseX: number, mouseY: number, button: number): void;

          /**
           * @return true if should be handled by overlay
           */
          keyPressed(
            keyCode: number,
            scanCode: number,
            modifiers: number
          ): boolean;
          close(): void;
          onClose(): void;
          renderBackground(matrices: /* minecraft class */ any): void;
          render(
            matrices: /* minecraft class */ any,
            mouseX: number,
            mouseY: number,
            delta: number
          ): void;
        }

        const IOverlayParent: JavaInterfaceStatics;
        interface IOverlayParent extends IContainerParent {
          closeOverlay(overlay: OverlayContainer): void;
          setFocused(focused: /* minecraft class */ any): void;
          getChildOverlay(): OverlayContainer;
        }

        export { OverlayContainer, IOverlayParent };
      }

      namespace containers {
        const MultiElementContainer: JavaClassStatics<{
          new <T>(
            x: number,
            y: number,
            width: number,
            height: number,
            textRenderer: /* minecraft class */ any,
            parent: T
          ): MultiElementContainer<T>;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }>;
        interface MultiElementContainer<T extends IContainerParent>
          extends /* supressed minecraft class */ JavaObject,
            IContainerParent {
          readonly parent: T;
          x: number;
          y: number;
          width: number;
          height: number;

          init(): void;
          getVisible(): boolean;
          setVisible(visible: boolean): void;
          addDrawableChild<T>(drawableElement: T): T;
          getButtons(): JavaList</* minecraft class */ any>;
          setPos(x: number, y: number, width: number, height: number): void;
          openOverlay(overlay: OverlayContainer): void;
          openOverlay(overlay: OverlayContainer, disableButtons: boolean): void;
          remove(button: /* minecraft class */ any): void;
          getFirstOverlayParent(): IOverlayParent;
          render(
            matrices: /* minecraft class */ any,
            mouseX: number,
            mouseY: number,
            delta: number
          ): void;
        }

        const IContainerParent: JavaInterfaceStatics;
        interface IContainerParent extends JavaObject {
          addDrawableChild<T>(drawableElement: T): T;
          remove(button: /* minecraft class */ any): void;
          openOverlay(overlay: OverlayContainer): void;
          openOverlay(overlay: OverlayContainer, disableButtons: boolean): void;
          getFirstOverlayParent(): IOverlayParent;
        }

        export { MultiElementContainer, IContainerParent };
      }

      namespace elements {
        const Scrollbar: JavaClassStatics<
          [Scrollbar],
          [
            x: number,
            y: number,
            width: number,
            height: number,
            color: number,
            borderColor: number,
            hilightColor: number,
            scrollPages: number,
            onChange: java.util.function.Consumer<number>
          ]
        >;
        interface Scrollbar extends /* supressed minecraft class */ JavaObject {
          setPos(
            x: number,
            y: number,
            width: number,
            height: number
          ): Scrollbar;
          setScrollPages(scrollPages: number): void;
          scrollToPercent(percent: number): void;
          onChange(): void;
        }

        export { Scrollbar };
      }

      export { BaseScreen, overlays, containers, elements };
    }

    export { StringHashTrie, jsmacros, wagyourgui };
  }

  namespace com {
    namespace mojang.brigadier {
      const Message: JavaInterfaceStatics;
      interface Message extends JavaObject {
        getString(): string;
      }

      const StringReader: JavaClassStatics<{
        new (arg0: StringReader): StringReader;
        new (arg0: string): StringReader;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        isAllowedNumber(arg0: number): boolean;
        isQuotedStringStart(arg0: number): boolean;
        isAllowedInUnquotedString(arg0: number): boolean;
      };
      interface StringReader extends ImmutableStringReader {
        getString(): string;
        setCursor(arg0: number): void;
        getRemainingLength(): number;
        getTotalLength(): number;
        getCursor(): number;
        getRead(): string;
        getRemaining(): string;
        canRead(arg0: number): boolean;
        canRead(): boolean;
        peek(): number;
        peek(arg0: number): number;
        read(): number;
        skip(): void;
        skipWhitespace(): void;
        readInt(): number;
        readLong(): number;
        readDouble(): number;
        readFloat(): number;
        readUnquotedString(): string;
        readQuotedString(): string;
        readStringUntil(arg0: number): string;
        readString(): string;
        readBoolean(): boolean;
        expect(arg0: number): void;
      }

      const RedirectModifier: JavaInterfaceStatics;
      interface RedirectModifier<S> extends JavaObject {
        apply(
          arg0: com.mojang.brigadier.context.CommandContext<S>
        ): JavaCollection<S>;
      }

      const ImmutableStringReader: JavaInterfaceStatics;
      interface ImmutableStringReader extends JavaObject {
        getString(): string;
        getRemainingLength(): number;
        getTotalLength(): number;
        getCursor(): number;
        getRead(): string;
        getRemaining(): string;
        canRead(arg0: number): boolean;
        canRead(): boolean;
        peek(): number;
        peek(arg0: number): number;
      }

      const AmbiguityConsumer: JavaInterfaceStatics;
      interface AmbiguityConsumer<S> extends JavaObject {
        ambiguous(
          arg0: com.mojang.brigadier.tree.CommandNode<S>,
          arg1: com.mojang.brigadier.tree.CommandNode<S>,
          arg2: com.mojang.brigadier.tree.CommandNode<S>,
          arg3: JavaCollection<string>
        ): void;
      }

      const Command: JavaInterfaceStatics & {
        readonly SINGLE_SUCCESS: number;
      };
      interface Command<S> extends JavaObject {
        run(arg0: com.mojang.brigadier.context.CommandContext<S>): number;
      }

      const CommandDispatcher: JavaClassStatics<{
        new <S>(
          arg0: com.mojang.brigadier.tree.RootCommandNode<S>
        ): CommandDispatcher<S>;
        new <S>(): CommandDispatcher<S>;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        readonly ARGUMENT_SEPARATOR: string;
        readonly ARGUMENT_SEPARATOR_CHAR: number;
      };
      interface CommandDispatcher<S> extends JavaObject {
        register(
          arg0: com.mojang.brigadier.builder.LiteralArgumentBuilder<S>
        ): com.mojang.brigadier.tree.LiteralCommandNode<S>;
        setConsumer(arg0: ResultConsumer<S>): void;
        execute(arg0: string, arg1: S): number;
        execute(arg0: StringReader, arg1: S): number;
        execute(arg0: ParseResults<S>): number;
        parse(arg0: string, arg1: S): ParseResults<S>;
        parse(arg0: StringReader, arg1: S): ParseResults<S>;
        getAllUsage(
          arg0: com.mojang.brigadier.tree.CommandNode<S>,
          arg1: S,
          arg2: boolean
        ): string[];
        getSmartUsage(
          arg0: com.mojang.brigadier.tree.CommandNode<S>,
          arg1: S
        ): JavaMap<com.mojang.brigadier.tree.CommandNode<S>, string>;
        getCompletionSuggestions(
          arg0: ParseResults<S>
        ): java.util.concurrent.CompletableFuture<com.mojang.brigadier.suggestion.Suggestions>;
        getCompletionSuggestions(
          arg0: ParseResults<S>,
          arg1: number
        ): java.util.concurrent.CompletableFuture<com.mojang.brigadier.suggestion.Suggestions>;
        getRoot(): com.mojang.brigadier.tree.RootCommandNode<S>;
        getPath(
          arg0: com.mojang.brigadier.tree.CommandNode<S>
        ): JavaCollection<string>;
        findNode(
          arg0: JavaCollection<string>
        ): com.mojang.brigadier.tree.CommandNode<S>;
        findAmbiguities(arg0: AmbiguityConsumer<S>): void;
      }

      const ResultConsumer: JavaInterfaceStatics;
      interface ResultConsumer<S> extends JavaObject {
        onCommandComplete(
          arg0: com.mojang.brigadier.context.CommandContext<S>,
          arg1: boolean,
          arg2: number
        ): void;
      }

      const SingleRedirectModifier: JavaInterfaceStatics;
      interface SingleRedirectModifier<S> extends JavaObject {
        apply(arg0: com.mojang.brigadier.context.CommandContext<S>): S;
      }

      const ParseResults: JavaClassStatics<{
        new <S>(
          arg0: com.mojang.brigadier.context.CommandContextBuilder<S>,
          arg1: ImmutableStringReader,
          arg2: JavaMap<
            com.mojang.brigadier.tree.CommandNode<S>,
            com.mojang.brigadier.exceptions.CommandSyntaxException
          >
        ): ParseResults<S>;
        new <S>(
          arg0: com.mojang.brigadier.context.CommandContextBuilder<S>
        ): ParseResults<S>;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface ParseResults<S> extends JavaObject {
        getContext(): com.mojang.brigadier.context.CommandContextBuilder<S>;
        getReader(): ImmutableStringReader;
        getExceptions(): JavaMap<
          com.mojang.brigadier.tree.CommandNode<S>,
          com.mojang.brigadier.exceptions.CommandSyntaxException
        >;
      }

      namespace context {
        const StringRange: JavaClassStatics<
          [StringRange],
          [arg0: number, arg1: number]
        > & {
          at(arg0: number): StringRange;
          between(arg0: number, arg1: number): StringRange;
          encompassing(arg0: StringRange, arg1: StringRange): StringRange;
        };
        interface StringRange extends JavaObject {
          getStart(): number;
          getEnd(): number;
          get(arg0: com.mojang.brigadier.ImmutableStringReader): string;
          get(arg0: string): string;
          isEmpty(): boolean;
          getLength(): number;
        }

        const CommandContext: JavaClassStatics<{
          new <S>(
            arg0: S,
            arg1: string,
            arg2: JavaMap<string, ParsedArgument<S, any>>,
            arg3: com.mojang.brigadier.Command<S>,
            arg4: com.mojang.brigadier.tree.CommandNode<S>,
            arg5: JavaList<ParsedCommandNode<S>>,
            arg6: StringRange,
            arg7: CommandContext<S>,
            arg8: com.mojang.brigadier.RedirectModifier<S>,
            arg9: boolean
          ): CommandContext<S>;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }>;
        interface CommandContext<S> extends JavaObject {
          copyFor(arg0: S): CommandContext<S>;
          getChild(): CommandContext<S>;
          getLastChild(): CommandContext<S>;
          getCommand(): com.mojang.brigadier.Command<S>;
          getSource(): S;
          getArgument<V>(arg0: string, arg1: JavaClass<V>): V;
          getRedirectModifier(): com.mojang.brigadier.RedirectModifier<S>;
          getRange(): StringRange;
          getInput(): string;
          getRootNode(): com.mojang.brigadier.tree.CommandNode<S>;
          getNodes(): JavaList<ParsedCommandNode<S>>;
          hasNodes(): boolean;
          isForked(): boolean;
        }

        const CommandContextBuilder: JavaClassStatics<{
          new <S>(
            arg0: com.mojang.brigadier.CommandDispatcher<S>,
            arg1: S,
            arg2: com.mojang.brigadier.tree.CommandNode<S>,
            arg3: number
          ): CommandContextBuilder<S>;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }>;
        interface CommandContextBuilder<S> extends JavaObject {
          withSource(arg0: S): CommandContextBuilder<S>;
          getSource(): S;
          getRootNode(): com.mojang.brigadier.tree.CommandNode<S>;
          withArgument(
            arg0: string,
            arg1: ParsedArgument<S, any>
          ): CommandContextBuilder<S>;
          getArguments(): JavaMap<string, ParsedArgument<S, any>>;
          withCommand(
            arg0: com.mojang.brigadier.Command<S>
          ): CommandContextBuilder<S>;
          withNode(
            arg0: com.mojang.brigadier.tree.CommandNode<S>,
            arg1: StringRange
          ): CommandContextBuilder<S>;
          copy(): CommandContextBuilder<S>;
          withChild(arg0: CommandContextBuilder<S>): CommandContextBuilder<S>;
          getChild(): CommandContextBuilder<S>;
          getLastChild(): CommandContextBuilder<S>;
          getCommand(): com.mojang.brigadier.Command<S>;
          getNodes(): JavaList<ParsedCommandNode<S>>;
          build(arg0: string): CommandContext<S>;
          getDispatcher(): com.mojang.brigadier.CommandDispatcher<S>;
          getRange(): StringRange;
          findSuggestionContext(arg0: number): SuggestionContext<S>;
        }

        const SuggestionContext: JavaClassStatics<{
          new <S>(
            arg0: com.mojang.brigadier.tree.CommandNode<S>,
            arg1: number
          ): SuggestionContext<S>;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }>;
        interface SuggestionContext<S> extends JavaObject {
          readonly parent: com.mojang.brigadier.tree.CommandNode<S>;
          readonly startPos: number;
        }

        const ParsedCommandNode: JavaClassStatics<{
          new <S>(
            arg0: com.mojang.brigadier.tree.CommandNode<S>,
            arg1: StringRange
          ): ParsedCommandNode<S>;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }>;
        interface ParsedCommandNode<S> extends JavaObject {
          getNode(): com.mojang.brigadier.tree.CommandNode<S>;
          getRange(): StringRange;
        }

        const ParsedArgument: JavaClassStatics<{
          new <S, T>(arg0: number, arg1: number, arg2: T): ParsedArgument<S, T>;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }>;
        interface ParsedArgument<S, T> extends JavaObject {
          getRange(): StringRange;
          getResult(): T;
        }

        export {
          StringRange,
          CommandContext,
          CommandContextBuilder,
          SuggestionContext,
          ParsedCommandNode,
          ParsedArgument,
        };
      }

      namespace tree {
        const CommandNode: JavaClassStatics<false>;
        interface CommandNode<S> extends java.lang.Comparable<CommandNode<S>> {
          getCommand(): com.mojang.brigadier.Command<S>;
          getChildren(): JavaCollection<CommandNode<S>>;
          getChild(arg0: string): CommandNode<S>;
          getRedirect(): CommandNode<S>;
          getRedirectModifier(): com.mojang.brigadier.RedirectModifier<S>;
          canUse(arg0: S): boolean;
          addChild(arg0: CommandNode<S>): void;
          findAmbiguities(
            arg0: com.mojang.brigadier.AmbiguityConsumer<S>
          ): void;
          getRequirement(): java.util.function.Predicate<S>;
          getName(): string;
          getUsageText(): string;
          parse(
            arg0: com.mojang.brigadier.StringReader,
            arg1: com.mojang.brigadier.context.CommandContextBuilder<S>
          ): void;
          listSuggestions(
            arg0: com.mojang.brigadier.context.CommandContext<S>,
            arg1: com.mojang.brigadier.suggestion.SuggestionsBuilder
          ): java.util.concurrent.CompletableFuture<com.mojang.brigadier.suggestion.Suggestions>;
          createBuilder(): com.mojang.brigadier.builder.ArgumentBuilder<S, any>;
          getRelevantNodes(
            arg0: com.mojang.brigadier.StringReader
          ): JavaCollection<any>;
          compareTo(arg0: CommandNode<S>): number;
          isFork(): boolean;
          getExamples(): JavaCollection<string>;
        }

        const RootCommandNode: JavaClassStatics<{
          new <S>(): RootCommandNode<S>;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }>;
        interface RootCommandNode<S> extends CommandNode<S> {
          getName(): string;
          getUsageText(): string;
          parse(
            arg0: com.mojang.brigadier.StringReader,
            arg1: com.mojang.brigadier.context.CommandContextBuilder<S>
          ): void;
          listSuggestions(
            arg0: com.mojang.brigadier.context.CommandContext<S>,
            arg1: com.mojang.brigadier.suggestion.SuggestionsBuilder
          ): java.util.concurrent.CompletableFuture<com.mojang.brigadier.suggestion.Suggestions>;
          isValidInput(arg0: string): boolean;
          createBuilder(): com.mojang.brigadier.builder.ArgumentBuilder<S, any>;
          getExamples(): JavaCollection<string>;
        }

        const LiteralCommandNode: JavaClassStatics<{
          new <S>(
            arg0: string,
            arg1: com.mojang.brigadier.Command<S>,
            arg2: java.util.function.Predicate<S>,
            arg3: CommandNode<S>,
            arg4: com.mojang.brigadier.RedirectModifier<S>,
            arg5: boolean
          ): LiteralCommandNode<S>;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }>;
        interface LiteralCommandNode<S> extends CommandNode<S> {
          getLiteral(): string;
          getName(): string;
          parse(
            arg0: com.mojang.brigadier.StringReader,
            arg1: com.mojang.brigadier.context.CommandContextBuilder<S>
          ): void;
          listSuggestions(
            arg0: com.mojang.brigadier.context.CommandContext<S>,
            arg1: com.mojang.brigadier.suggestion.SuggestionsBuilder
          ): java.util.concurrent.CompletableFuture<com.mojang.brigadier.suggestion.Suggestions>;
          isValidInput(arg0: string): boolean;
          getUsageText(): string;
          createBuilder(): com.mojang.brigadier.builder.LiteralArgumentBuilder<S>;
          getExamples(): JavaCollection<string>;
        }

        export { CommandNode, RootCommandNode, LiteralCommandNode };
      }

      namespace suggestion {
        const Suggestions: JavaClassStatics<
          [Suggestions],
          [
            arg0: com.mojang.brigadier.context.StringRange,
            arg1: JavaList<Suggestion>
          ]
        > & {
          empty(): java.util.concurrent.CompletableFuture<Suggestions>;
          merge(arg0: string, arg1: JavaCollection<Suggestions>): Suggestions;
          create(arg0: string, arg1: JavaCollection<Suggestion>): Suggestions;
        };
        interface Suggestions extends JavaObject {
          getRange(): com.mojang.brigadier.context.StringRange;
          getList(): JavaList<Suggestion>;
          isEmpty(): boolean;
        }

        const SuggestionsBuilder: JavaClassStatics<{
          new (arg0: string, arg1: string, arg2: number): SuggestionsBuilder;
          new (arg0: string, arg1: number): SuggestionsBuilder;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }>;
        interface SuggestionsBuilder extends JavaObject {
          getInput(): string;
          getStart(): number;
          getRemaining(): string;
          getRemainingLowerCase(): string;
          build(): Suggestions;
          buildFuture(): java.util.concurrent.CompletableFuture<Suggestions>;
          suggest(arg0: string): SuggestionsBuilder;
          suggest(
            arg0: string,
            arg1: com.mojang.brigadier.Message
          ): SuggestionsBuilder;
          suggest(arg0: number): SuggestionsBuilder;
          suggest(
            arg0: number,
            arg1: com.mojang.brigadier.Message
          ): SuggestionsBuilder;
          add(arg0: SuggestionsBuilder): SuggestionsBuilder;
          createOffset(arg0: number): SuggestionsBuilder;
          restart(): SuggestionsBuilder;
        }

        const Suggestion: JavaClassStatics<{
          new (
            arg0: com.mojang.brigadier.context.StringRange,
            arg1: string
          ): Suggestion;
          new (
            arg0: com.mojang.brigadier.context.StringRange,
            arg1: string,
            arg2: com.mojang.brigadier.Message
          ): Suggestion;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }>;
        interface Suggestion extends java.lang.Comparable<Suggestion> {
          getRange(): com.mojang.brigadier.context.StringRange;
          getText(): string;
          getTooltip(): com.mojang.brigadier.Message;
          apply(arg0: string): string;
          compareTo(arg0: Suggestion): number;
          compareToIgnoreCase(arg0: Suggestion): number;
          expand(
            arg0: string,
            arg1: com.mojang.brigadier.context.StringRange
          ): Suggestion;
        }

        export { Suggestions, SuggestionsBuilder, Suggestion };
      }

      namespace builder {
        const LiteralArgumentBuilder: JavaClassStatics<false> & {
          literal<S>(arg0: string): LiteralArgumentBuilder<S>;
        };
        interface LiteralArgumentBuilder<S>
          extends ArgumentBuilder<S, LiteralArgumentBuilder<S>> {
          getLiteral(): string;
          build(): com.mojang.brigadier.tree.LiteralCommandNode<S>;
        }

        const ArgumentBuilder: JavaClassStatics<{
          new <S, T>(): ArgumentBuilder<S, T>;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }>;
        interface ArgumentBuilder<S, T extends ArgumentBuilder<S, T>>
          extends JavaObject {
          then(arg0: ArgumentBuilder<S, any>): T;
          then(arg0: com.mojang.brigadier.tree.CommandNode<S>): T;
          getArguments(): JavaCollection<
            com.mojang.brigadier.tree.CommandNode<S>
          >;
          executes(arg0: com.mojang.brigadier.Command<S>): T;
          getCommand(): com.mojang.brigadier.Command<S>;
          requires(arg0: java.util.function.Predicate<S>): T;
          getRequirement(): java.util.function.Predicate<S>;
          redirect(arg0: com.mojang.brigadier.tree.CommandNode<S>): T;
          redirect(
            arg0: com.mojang.brigadier.tree.CommandNode<S>,
            arg1: com.mojang.brigadier.SingleRedirectModifier<S>
          ): T;
          fork(
            arg0: com.mojang.brigadier.tree.CommandNode<S>,
            arg1: com.mojang.brigadier.RedirectModifier<S>
          ): T;
          forward(
            arg0: com.mojang.brigadier.tree.CommandNode<S>,
            arg1: com.mojang.brigadier.RedirectModifier<S>,
            arg2: boolean
          ): T;
          getRedirect(): com.mojang.brigadier.tree.CommandNode<S>;
          getRedirectModifier(): com.mojang.brigadier.RedirectModifier<S>;
          isFork(): boolean;
          build(): com.mojang.brigadier.tree.CommandNode<S>;
        }

        export { LiteralArgumentBuilder, ArgumentBuilder };
      }

      namespace exceptions {
        const CommandSyntaxException: JavaClassStatics<{
          new (
            arg0: CommandExceptionType,
            arg1: com.mojang.brigadier.Message
          ): CommandSyntaxException;
          new (
            arg0: CommandExceptionType,
            arg1: com.mojang.brigadier.Message,
            arg2: string,
            arg3: number
          ): CommandSyntaxException;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }> & {
          readonly CONTEXT_AMOUNT: number;
          ENABLE_COMMAND_STACK_TRACES: boolean;
          BUILT_IN_EXCEPTIONS: BuiltInExceptionProvider;
        };
        interface CommandSyntaxException extends java.lang.Exception {
          getMessage(): string;
          getRawMessage(): com.mojang.brigadier.Message;
          getContext(): string;
          getType(): CommandExceptionType;
          getInput(): string;
          getCursor(): number;
        }

        const BuiltInExceptionProvider: JavaInterfaceStatics;
        interface BuiltInExceptionProvider extends JavaObject {
          doubleTooLow(): Dynamic2CommandExceptionType;
          doubleTooHigh(): Dynamic2CommandExceptionType;
          floatTooLow(): Dynamic2CommandExceptionType;
          floatTooHigh(): Dynamic2CommandExceptionType;
          integerTooLow(): Dynamic2CommandExceptionType;
          integerTooHigh(): Dynamic2CommandExceptionType;
          longTooLow(): Dynamic2CommandExceptionType;
          longTooHigh(): Dynamic2CommandExceptionType;
          literalIncorrect(): DynamicCommandExceptionType;
          readerExpectedStartOfQuote(): SimpleCommandExceptionType;
          readerExpectedEndOfQuote(): SimpleCommandExceptionType;
          readerInvalidEscape(): DynamicCommandExceptionType;
          readerInvalidBool(): DynamicCommandExceptionType;
          readerInvalidInt(): DynamicCommandExceptionType;
          readerExpectedInt(): SimpleCommandExceptionType;
          readerInvalidLong(): DynamicCommandExceptionType;
          readerExpectedLong(): SimpleCommandExceptionType;
          readerInvalidDouble(): DynamicCommandExceptionType;
          readerExpectedDouble(): SimpleCommandExceptionType;
          readerInvalidFloat(): DynamicCommandExceptionType;
          readerExpectedFloat(): SimpleCommandExceptionType;
          readerExpectedBool(): SimpleCommandExceptionType;
          readerExpectedSymbol(): DynamicCommandExceptionType;
          dispatcherUnknownCommand(): SimpleCommandExceptionType;
          dispatcherUnknownArgument(): SimpleCommandExceptionType;
          dispatcherExpectedArgumentSeparator(): SimpleCommandExceptionType;
          dispatcherParseException(): DynamicCommandExceptionType;
        }

        const CommandExceptionType: JavaInterfaceStatics;
        interface CommandExceptionType extends JavaObject {}

        const SimpleCommandExceptionType: JavaClassStatics<
          [SimpleCommandExceptionType],
          [arg0: com.mojang.brigadier.Message]
        >;
        interface SimpleCommandExceptionType extends CommandExceptionType {
          create(): CommandSyntaxException;
          createWithContext(
            arg0: com.mojang.brigadier.ImmutableStringReader
          ): CommandSyntaxException;
        }

        const Dynamic2CommandExceptionType: JavaClassStatics<
          [Dynamic2CommandExceptionType],
          [arg0: Dynamic2CommandExceptionType$Function]
        >;
        interface Dynamic2CommandExceptionType extends CommandExceptionType {
          create(arg0: any, arg1: any): CommandSyntaxException;
          createWithContext(
            arg0: com.mojang.brigadier.ImmutableStringReader,
            arg1: any,
            arg2: any
          ): CommandSyntaxException;
        }

        const DynamicCommandExceptionType: JavaClassStatics<
          [DynamicCommandExceptionType],
          [arg0: java.util.function.Function<any, com.mojang.brigadier.Message>]
        >;
        interface DynamicCommandExceptionType extends CommandExceptionType {
          create(arg0: any): CommandSyntaxException;
          createWithContext(
            arg0: com.mojang.brigadier.ImmutableStringReader,
            arg1: any
          ): CommandSyntaxException;
        }

        const Dynamic2CommandExceptionType$Function: JavaInterfaceStatics;
        interface Dynamic2CommandExceptionType$Function extends JavaObject {
          apply(arg0: any, arg1: any): com.mojang.brigadier.Message;
        }

        export {
          CommandSyntaxException,
          BuiltInExceptionProvider,
          CommandExceptionType,
          SimpleCommandExceptionType,
          Dynamic2CommandExceptionType,
          DynamicCommandExceptionType,
          Dynamic2CommandExceptionType$Function,
        };
      }

      export {
        Message,
        StringReader,
        RedirectModifier,
        ImmutableStringReader,
        AmbiguityConsumer,
        Command,
        CommandDispatcher,
        ResultConsumer,
        SingleRedirectModifier,
        ParseResults,
        context,
        tree,
        suggestion,
        builder,
        exceptions,
      };
    }

    namespace neovisionaries.ws.client {
      const WebSocket: JavaClassStatics<false>;
      interface WebSocket extends JavaObject {
        recreate(): WebSocket;
        recreate(arg0: number): WebSocket;
        getState(): WebSocketState;
        isOpen(): boolean;
        addProtocol(arg0: string): WebSocket;
        removeProtocol(arg0: string): WebSocket;
        clearProtocols(): WebSocket;
        addExtension(arg0: WebSocketExtension): WebSocket;
        addExtension(arg0: string): WebSocket;
        removeExtension(arg0: WebSocketExtension): WebSocket;
        removeExtensions(arg0: string): WebSocket;
        clearExtensions(): WebSocket;
        addHeader(arg0: string, arg1: string): WebSocket;
        removeHeaders(arg0: string): WebSocket;
        clearHeaders(): WebSocket;
        setUserInfo(arg0: string): WebSocket;
        setUserInfo(arg0: string, arg1: string): WebSocket;
        clearUserInfo(): WebSocket;
        isExtended(): boolean;
        setExtended(arg0: boolean): WebSocket;
        isAutoFlush(): boolean;
        setAutoFlush(arg0: boolean): WebSocket;
        isMissingCloseFrameAllowed(): boolean;
        setMissingCloseFrameAllowed(arg0: boolean): WebSocket;
        isDirectTextMessage(): boolean;
        setDirectTextMessage(arg0: boolean): WebSocket;
        flush(): WebSocket;
        getFrameQueueSize(): number;
        setFrameQueueSize(arg0: number): WebSocket;
        getMaxPayloadSize(): number;
        setMaxPayloadSize(arg0: number): WebSocket;
        getPingInterval(): number;
        setPingInterval(arg0: number): WebSocket;
        getPongInterval(): number;
        setPongInterval(arg0: number): WebSocket;
        getPingPayloadGenerator(): PayloadGenerator;
        setPingPayloadGenerator(arg0: PayloadGenerator): WebSocket;
        getPongPayloadGenerator(): PayloadGenerator;
        setPongPayloadGenerator(arg0: PayloadGenerator): WebSocket;
        getPingSenderName(): string;
        setPingSenderName(arg0: string): WebSocket;
        getPongSenderName(): string;
        setPongSenderName(arg0: string): WebSocket;
        addListener(arg0: WebSocketListener): WebSocket;
        addListeners(arg0: JavaList<WebSocketListener>): WebSocket;
        removeListener(arg0: WebSocketListener): WebSocket;
        removeListeners(arg0: JavaList<WebSocketListener>): WebSocket;
        clearListeners(): WebSocket;
        getSocket(): java.net.Socket;
        getConnectedSocket(): java.net.Socket;
        getURI(): java.net.URI;
        connect(): WebSocket;
        connect(
          arg0: java.util.concurrent.ExecutorService
        ): java.util.concurrent.Future<WebSocket>;
        connectable(): java.util.concurrent.Callable<WebSocket>;
        connectAsynchronously(): WebSocket;
        disconnect(): WebSocket;
        disconnect(arg0: number): WebSocket;
        disconnect(arg0: string): WebSocket;
        disconnect(arg0: number, arg1: string): WebSocket;
        disconnect(arg0: number, arg1: string, arg2: number): WebSocket;
        getAgreedExtensions(): JavaList<WebSocketExtension>;
        getAgreedProtocol(): string;
        sendFrame(arg0: WebSocketFrame): WebSocket;
        sendContinuation(): WebSocket;
        sendContinuation(arg0: boolean): WebSocket;
        sendContinuation(arg0: string): WebSocket;
        sendContinuation(arg0: string, arg1: boolean): WebSocket;
        sendContinuation(arg0: number[]): WebSocket;
        sendContinuation(arg0: number[], arg1: boolean): WebSocket;
        sendText(arg0: string): WebSocket;
        sendText(arg0: string, arg1: boolean): WebSocket;
        sendBinary(arg0: number[]): WebSocket;
        sendBinary(arg0: number[], arg1: boolean): WebSocket;
        sendClose(): WebSocket;
        sendClose(arg0: number): WebSocket;
        sendClose(arg0: number, arg1: string): WebSocket;
        sendPing(): WebSocket;
        sendPing(arg0: number[]): WebSocket;
        sendPing(arg0: string): WebSocket;
        sendPong(): WebSocket;
        sendPong(arg0: number[]): WebSocket;
        sendPong(arg0: string): WebSocket;
      }

      const WebSocketException: JavaClassStatics<{
        new (arg0: WebSocketError): WebSocketException;
        new (arg0: WebSocketError, arg1: string): WebSocketException;
        new (
          arg0: WebSocketError,
          arg1: java.lang.Throwable
        ): WebSocketException;
        new (
          arg0: WebSocketError,
          arg1: string,
          arg2: java.lang.Throwable
        ): WebSocketException;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface WebSocketException extends java.lang.Exception {
        getError(): WebSocketError;
      }

      const WebSocketFrame: JavaClassStatics<[WebSocketFrame]> & {
        createContinuationFrame(): WebSocketFrame;
        createContinuationFrame(arg0: number[]): WebSocketFrame;
        createContinuationFrame(arg0: string): WebSocketFrame;
        createTextFrame(arg0: string): WebSocketFrame;
        createBinaryFrame(arg0: number[]): WebSocketFrame;
        createCloseFrame(): WebSocketFrame;
        createCloseFrame(arg0: number): WebSocketFrame;
        createCloseFrame(arg0: number, arg1: string): WebSocketFrame;
        createPingFrame(): WebSocketFrame;
        createPingFrame(arg0: number[]): WebSocketFrame;
        createPingFrame(arg0: string): WebSocketFrame;
        createPongFrame(): WebSocketFrame;
        createPongFrame(arg0: number[]): WebSocketFrame;
        createPongFrame(arg0: string): WebSocketFrame;
      };
      interface WebSocketFrame extends JavaObject {
        getFin(): boolean;
        setFin(arg0: boolean): WebSocketFrame;
        getRsv1(): boolean;
        setRsv1(arg0: boolean): WebSocketFrame;
        getRsv2(): boolean;
        setRsv2(arg0: boolean): WebSocketFrame;
        getRsv3(): boolean;
        setRsv3(arg0: boolean): WebSocketFrame;
        getOpcode(): number;
        setOpcode(arg0: number): WebSocketFrame;
        isContinuationFrame(): boolean;
        isTextFrame(): boolean;
        isBinaryFrame(): boolean;
        isCloseFrame(): boolean;
        isPingFrame(): boolean;
        isPongFrame(): boolean;
        isDataFrame(): boolean;
        isControlFrame(): boolean;
        hasPayload(): boolean;
        getPayloadLength(): number;
        getPayload(): number[];
        getPayloadText(): string;
        setPayload(arg0: number[]): WebSocketFrame;
        setPayload(arg0: string): WebSocketFrame;
        setCloseFramePayload(arg0: number, arg1: string): WebSocketFrame;
        getCloseCode(): number;
        getCloseReason(): string;
      }

      const WebSocketError: JavaClassStatics<false> & {
        readonly NOT_IN_CREATED_STATE: WebSocketError;
        readonly SOCKET_INPUT_STREAM_FAILURE: WebSocketError;
        readonly SOCKET_OUTPUT_STREAM_FAILURE: WebSocketError;
        readonly OPENING_HAHDSHAKE_REQUEST_FAILURE: WebSocketError;
        readonly OPENING_HANDSHAKE_RESPONSE_FAILURE: WebSocketError;
        readonly STATUS_LINE_EMPTY: WebSocketError;
        readonly STATUS_LINE_BAD_FORMAT: WebSocketError;
        readonly NOT_SWITCHING_PROTOCOLS: WebSocketError;
        readonly HTTP_HEADER_FAILURE: WebSocketError;
        readonly NO_UPGRADE_HEADER: WebSocketError;
        readonly NO_WEBSOCKET_IN_UPGRADE_HEADER: WebSocketError;
        readonly NO_CONNECTION_HEADER: WebSocketError;
        readonly NO_UPGRADE_IN_CONNECTION_HEADER: WebSocketError;
        readonly NO_SEC_WEBSOCKET_ACCEPT_HEADER: WebSocketError;
        readonly UNEXPECTED_SEC_WEBSOCKET_ACCEPT_HEADER: WebSocketError;
        readonly EXTENSION_PARSE_ERROR: WebSocketError;
        readonly UNSUPPORTED_EXTENSION: WebSocketError;
        readonly EXTENSIONS_CONFLICT: WebSocketError;
        readonly UNSUPPORTED_PROTOCOL: WebSocketError;
        readonly INSUFFICENT_DATA: WebSocketError;
        readonly INVALID_PAYLOAD_LENGTH: WebSocketError;
        readonly TOO_LONG_PAYLOAD: WebSocketError;
        readonly INSUFFICIENT_MEMORY_FOR_PAYLOAD: WebSocketError;
        readonly INTERRUPTED_IN_READING: WebSocketError;
        readonly IO_ERROR_IN_READING: WebSocketError;
        readonly IO_ERROR_IN_WRITING: WebSocketError;
        readonly FLUSH_ERROR: WebSocketError;
        readonly NON_ZERO_RESERVED_BITS: WebSocketError;
        readonly UNEXPECTED_RESERVED_BIT: WebSocketError;
        readonly FRAME_MASKED: WebSocketError;
        readonly UNKNOWN_OPCODE: WebSocketError;
        readonly FRAGMENTED_CONTROL_FRAME: WebSocketError;
        readonly UNEXPECTED_CONTINUATION_FRAME: WebSocketError;
        readonly CONTINUATION_NOT_CLOSED: WebSocketError;
        readonly TOO_LONG_CONTROL_FRAME_PAYLOAD: WebSocketError;
        readonly MESSAGE_CONSTRUCTION_ERROR: WebSocketError;
        readonly TEXT_MESSAGE_CONSTRUCTION_ERROR: WebSocketError;
        readonly UNEXPECTED_ERROR_IN_READING_THREAD: WebSocketError;
        readonly UNEXPECTED_ERROR_IN_WRITING_THREAD: WebSocketError;
        readonly PERMESSAGE_DEFLATE_UNSUPPORTED_PARAMETER: WebSocketError;
        readonly PERMESSAGE_DEFLATE_INVALID_MAX_WINDOW_BITS: WebSocketError;
        readonly COMPRESSION_ERROR: WebSocketError;
        readonly DECOMPRESSION_ERROR: WebSocketError;
        readonly SOCKET_CONNECT_ERROR: WebSocketError;
        readonly PROXY_HANDSHAKE_ERROR: WebSocketError;
        readonly SOCKET_OVERLAY_ERROR: WebSocketError;
        readonly SSL_HANDSHAKE_ERROR: WebSocketError;
        readonly NO_MORE_FRAME: WebSocketError;
        readonly HOSTNAME_UNVERIFIED: WebSocketError;

        values(): WebSocketError[];
        valueOf(arg0: string): WebSocketError;
      };
      interface WebSocketError extends java.lang.Enum<WebSocketError> {}

      const WebSocketListener: JavaInterfaceStatics;
      interface WebSocketListener extends JavaObject {
        onStateChanged(arg0: WebSocket, arg1: WebSocketState): void;
        onConnected(
          arg0: WebSocket,
          arg1: JavaMap<string, JavaList<string>>
        ): void;
        onConnectError(arg0: WebSocket, arg1: WebSocketException): void;
        onDisconnected(
          arg0: WebSocket,
          arg1: WebSocketFrame,
          arg2: WebSocketFrame,
          arg3: boolean
        ): void;
        onFrame(arg0: WebSocket, arg1: WebSocketFrame): void;
        onContinuationFrame(arg0: WebSocket, arg1: WebSocketFrame): void;
        onTextFrame(arg0: WebSocket, arg1: WebSocketFrame): void;
        onBinaryFrame(arg0: WebSocket, arg1: WebSocketFrame): void;
        onCloseFrame(arg0: WebSocket, arg1: WebSocketFrame): void;
        onPingFrame(arg0: WebSocket, arg1: WebSocketFrame): void;
        onPongFrame(arg0: WebSocket, arg1: WebSocketFrame): void;
        onTextMessage(arg0: WebSocket, arg1: string): void;
        onTextMessage(arg0: WebSocket, arg1: number[]): void;
        onBinaryMessage(arg0: WebSocket, arg1: number[]): void;
        onSendingFrame(arg0: WebSocket, arg1: WebSocketFrame): void;
        onFrameSent(arg0: WebSocket, arg1: WebSocketFrame): void;
        onFrameUnsent(arg0: WebSocket, arg1: WebSocketFrame): void;
        onThreadCreated(
          arg0: WebSocket,
          arg1: ThreadType,
          arg2: java.lang.Thread
        ): void;
        onThreadStarted(
          arg0: WebSocket,
          arg1: ThreadType,
          arg2: java.lang.Thread
        ): void;
        onThreadStopping(
          arg0: WebSocket,
          arg1: ThreadType,
          arg2: java.lang.Thread
        ): void;
        onError(arg0: WebSocket, arg1: WebSocketException): void;
        onFrameError(
          arg0: WebSocket,
          arg1: WebSocketException,
          arg2: WebSocketFrame
        ): void;
        onMessageError(
          arg0: WebSocket,
          arg1: WebSocketException,
          arg2: JavaList<WebSocketFrame>
        ): void;
        onMessageDecompressionError(
          arg0: WebSocket,
          arg1: WebSocketException,
          arg2: number[]
        ): void;
        onTextMessageError(
          arg0: WebSocket,
          arg1: WebSocketException,
          arg2: number[]
        ): void;
        onSendError(
          arg0: WebSocket,
          arg1: WebSocketException,
          arg2: WebSocketFrame
        ): void;
        onUnexpectedError(arg0: WebSocket, arg1: WebSocketException): void;
        handleCallbackError(arg0: WebSocket, arg1: java.lang.Throwable): void;
        onSendingHandshake(
          arg0: WebSocket,
          arg1: string,
          arg2: JavaList<string[]>
        ): void;
      }

      const WebSocketState: JavaClassStatics<false> & {
        readonly CREATED: WebSocketState;
        readonly CONNECTING: WebSocketState;
        readonly OPEN: WebSocketState;
        readonly CLOSING: WebSocketState;
        readonly CLOSED: WebSocketState;

        values(): WebSocketState[];
        valueOf(arg0: string): WebSocketState;
      };
      interface WebSocketState extends java.lang.Enum<WebSocketState> {}

      const WebSocketExtension: JavaClassStatics<{
        new (arg0: string): WebSocketExtension;
        new (arg0: WebSocketExtension): WebSocketExtension;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        readonly PERMESSAGE_DEFLATE: string;

        parse(arg0: string): WebSocketExtension;
      };
      interface WebSocketExtension extends JavaObject {
        getName(): string;
        getParameters(): JavaMap<string, string>;
        containsParameter(arg0: string): boolean;
        getParameter(arg0: string): string;
        setParameter(arg0: string, arg1: string): WebSocketExtension;
      }

      const PayloadGenerator: JavaInterfaceStatics;
      interface PayloadGenerator extends JavaObject {
        generate(): number[];
      }

      const ThreadType: JavaClassStatics<false> & {
        readonly READING_THREAD: ThreadType;
        readonly WRITING_THREAD: ThreadType;
        readonly CONNECT_THREAD: ThreadType;
        readonly FINISH_THREAD: ThreadType;

        values(): ThreadType[];
        valueOf(arg0: string): ThreadType;
      };
      interface ThreadType extends java.lang.Enum<ThreadType> {}

      export {
        WebSocket,
        WebSocketException,
        WebSocketFrame,
        WebSocketError,
        WebSocketListener,
        WebSocketState,
        WebSocketExtension,
        PayloadGenerator,
        ThreadType,
      };
    }

    namespace google.gson {
      const JsonObject: JavaClassStatics<[JsonObject]>;
      interface JsonObject extends JsonElement {
        deepCopy(): JsonObject;
        add(arg0: string, arg1: JsonElement): void;
        remove(arg0: string): JsonElement;
        addProperty(arg0: string, arg1: string): void;
        addProperty(arg0: string, arg1: java.lang.Number): void;
        addProperty(arg0: string, arg1: boolean): void;
        addProperty(arg0: string, arg1: number): void;
        entrySet(): JavaSet<java.util.Map$Entry<string, JsonElement>>;
        keySet(): JavaSet<string>;
        size(): number;
        has(arg0: string): boolean;
        get(arg0: string): JsonElement;
        getAsJsonPrimitive(arg0: string): JsonPrimitive;
        getAsJsonPrimitive(): JsonPrimitive;
        getAsJsonArray(arg0: string): JsonArray;
        getAsJsonArray(): JsonArray;
        getAsJsonObject(arg0: string): JsonObject;
      }

      const JsonElement: JavaClassStatics<[JsonElement]>;
      interface JsonElement extends JavaObject {
        deepCopy(): JsonElement;
        isJsonArray(): boolean;
        isJsonObject(): boolean;
        isJsonPrimitive(): boolean;
        isJsonNull(): boolean;
        getAsJsonObject(): JsonObject;
        getAsJsonArray(): JsonArray;
        getAsJsonPrimitive(): JsonPrimitive;
        getAsJsonNull(): JsonNull;
        getAsBoolean(): boolean;
        getAsNumber(): java.lang.Number;
        getAsString(): string;
        getAsDouble(): number;
        getAsFloat(): number;
        getAsLong(): number;
        getAsInt(): number;
        getAsByte(): number;
        /** @deprecated */
        getAsCharacter(): number;
        getAsBigDecimal(): java.math.BigDecimal;
        getAsBigInteger(): java.math.BigInteger;
        getAsShort(): number;
      }

      const JsonArray: JavaClassStatics<{
        new (): JsonArray;
        new (arg0: number): JsonArray;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface JsonArray extends JsonElement, java.lang.Iterable<JsonElement> {
        deepCopy(): JsonArray;
        add(arg0: boolean): void;
        add(arg0: number): void;
        add(arg0: java.lang.Number): void;
        add(arg0: string): void;
        add(arg0: JsonElement): void;
        addAll(arg0: JsonArray): void;
        set(arg0: number, arg1: JsonElement): JsonElement;
        remove(arg0: JsonElement): boolean;
        remove(arg0: number): JsonElement;
        contains(arg0: JsonElement): boolean;
        size(): number;
        isEmpty(): boolean;
        iterator(): java.util.Iterator<JsonElement>;
        get(arg0: number): JsonElement;
        getAsNumber(): java.lang.Number;
        getAsString(): string;
        getAsDouble(): number;
        getAsBigDecimal(): java.math.BigDecimal;
        getAsBigInteger(): java.math.BigInteger;
        getAsFloat(): number;
        getAsLong(): number;
        getAsInt(): number;
        getAsByte(): number;
        getAsCharacter(): number;
        getAsShort(): number;
        getAsBoolean(): boolean;
      }

      const JsonPrimitive: JavaClassStatics<{
        new (arg0: boolean): JsonPrimitive;
        new (arg0: java.lang.Number): JsonPrimitive;
        new (arg0: string): JsonPrimitive;
        new (arg0: number): JsonPrimitive;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface JsonPrimitive extends JsonElement {
        deepCopy(): JsonPrimitive;
        isBoolean(): boolean;
        getAsBoolean(): boolean;
        isNumber(): boolean;
        getAsNumber(): java.lang.Number;
        isString(): boolean;
        getAsString(): string;
        getAsDouble(): number;
        getAsBigDecimal(): java.math.BigDecimal;
        getAsBigInteger(): java.math.BigInteger;
        getAsFloat(): number;
        getAsLong(): number;
        getAsShort(): number;
        getAsInt(): number;
        getAsByte(): number;
        getAsCharacter(): number;
      }

      const JsonNull: JavaClassStatics<{
        /** @deprecated */
        new (): JsonNull;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        readonly INSTANCE: JsonNull;
      };
      interface JsonNull extends JsonElement {
        deepCopy(): JsonNull;
      }

      export { JsonObject, JsonElement, JsonArray, JsonPrimitive, JsonNull };
    }
  }

  namespace io.noties.prism4j {
    const Prism4j$Node: JavaInterfaceStatics;
    interface Prism4j$Node extends JavaObject {
      textLength(): number;
      isSyntax(): boolean;
    }

    export { Prism4j$Node };
  }

  namespace org.slf4j {
    const Logger: JavaInterfaceStatics & {
      readonly ROOT_LOGGER_NAME: string;
    };
    interface Logger extends JavaObject {
      getName(): string;
      isTraceEnabled(): boolean;
      trace(arg0: string): void;
      trace(arg0: string, arg1: any): void;
      trace(arg0: string, arg1: any, arg2: any): void;
      trace(arg0: string, ...arg1: any[]): void;
      trace(arg0: string, arg1: java.lang.Throwable): void;
      isTraceEnabled(arg0: Marker): boolean;
      trace(arg0: Marker, arg1: string): void;
      trace(arg0: Marker, arg1: string, arg2: any): void;
      trace(arg0: Marker, arg1: string, arg2: any, arg3: any): void;
      trace(arg0: Marker, arg1: string, ...arg2: any[]): void;
      trace(arg0: Marker, arg1: string, arg2: java.lang.Throwable): void;
      isDebugEnabled(): boolean;
      debug(arg0: string): void;
      debug(arg0: string, arg1: any): void;
      debug(arg0: string, arg1: any, arg2: any): void;
      debug(arg0: string, ...arg1: any[]): void;
      debug(arg0: string, arg1: java.lang.Throwable): void;
      isDebugEnabled(arg0: Marker): boolean;
      debug(arg0: Marker, arg1: string): void;
      debug(arg0: Marker, arg1: string, arg2: any): void;
      debug(arg0: Marker, arg1: string, arg2: any, arg3: any): void;
      debug(arg0: Marker, arg1: string, ...arg2: any[]): void;
      debug(arg0: Marker, arg1: string, arg2: java.lang.Throwable): void;
      isInfoEnabled(): boolean;
      info(arg0: string): void;
      info(arg0: string, arg1: any): void;
      info(arg0: string, arg1: any, arg2: any): void;
      info(arg0: string, ...arg1: any[]): void;
      info(arg0: string, arg1: java.lang.Throwable): void;
      isInfoEnabled(arg0: Marker): boolean;
      info(arg0: Marker, arg1: string): void;
      info(arg0: Marker, arg1: string, arg2: any): void;
      info(arg0: Marker, arg1: string, arg2: any, arg3: any): void;
      info(arg0: Marker, arg1: string, ...arg2: any[]): void;
      info(arg0: Marker, arg1: string, arg2: java.lang.Throwable): void;
      isWarnEnabled(): boolean;
      warn(arg0: string): void;
      warn(arg0: string, arg1: any): void;
      warn(arg0: string, ...arg1: any[]): void;
      warn(arg0: string, arg1: any, arg2: any): void;
      warn(arg0: string, arg1: java.lang.Throwable): void;
      isWarnEnabled(arg0: Marker): boolean;
      warn(arg0: Marker, arg1: string): void;
      warn(arg0: Marker, arg1: string, arg2: any): void;
      warn(arg0: Marker, arg1: string, arg2: any, arg3: any): void;
      warn(arg0: Marker, arg1: string, ...arg2: any[]): void;
      warn(arg0: Marker, arg1: string, arg2: java.lang.Throwable): void;
      isErrorEnabled(): boolean;
      error(arg0: string): void;
      error(arg0: string, arg1: any): void;
      error(arg0: string, arg1: any, arg2: any): void;
      error(arg0: string, ...arg1: any[]): void;
      error(arg0: string, arg1: java.lang.Throwable): void;
      isErrorEnabled(arg0: Marker): boolean;
      error(arg0: Marker, arg1: string): void;
      error(arg0: Marker, arg1: string, arg2: any): void;
      error(arg0: Marker, arg1: string, arg2: any, arg3: any): void;
      error(arg0: Marker, arg1: string, ...arg2: any[]): void;
      error(arg0: Marker, arg1: string, arg2: java.lang.Throwable): void;
    }

    const Marker: JavaInterfaceStatics & {
      readonly ANY_MARKER: string;
      readonly ANY_NON_NULL_MARKER: string;
    };
    interface Marker extends java.io.Serializable {
      getName(): string;
      add(arg0: Marker): void;
      remove(arg0: Marker): boolean;
      /** @deprecated */
      hasChildren(): boolean;
      hasReferences(): boolean;
      iterator(): java.util.Iterator<Marker>;
      contains(arg0: Marker): boolean;
      contains(arg0: string): boolean;
    }

    export { Logger, Marker };
  }

  namespace java {
    namespace io {
      const IOException: JavaClassStatics<{
        new (): IOException;
        new (arg0: string): IOException;
        new (arg0: string, arg1: java.lang.Throwable): IOException;
        new (arg0: java.lang.Throwable): IOException;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface IOException extends java.lang.Exception {}

      const Closeable: JavaInterfaceStatics;
      interface Closeable extends java.lang.AutoCloseable {
        close(): void;
      }

      const InputStream: JavaClassStatics<[InputStream]> & {
        nullInputStream(): InputStream;
      };
      interface InputStream extends Closeable {
        read(): number;
        read(arg0: number[]): number;
        read(arg0: number[], arg1: number, arg2: number): number;
        readAllBytes(): number[];
        readNBytes(arg0: number): number[];
        readNBytes(arg0: number[], arg1: number, arg2: number): number;
        skip(arg0: number): number;
        skipNBytes(arg0: number): void;
        available(): number;
        close(): void;
        mark(arg0: number): void;
        reset(): void;
        markSupported(): boolean;
        transferTo(arg0: OutputStream): number;
      }

      const OutputStream: JavaClassStatics<[OutputStream]> & {
        nullOutputStream(): OutputStream;
      };
      interface OutputStream extends Closeable, Flushable {
        write(arg0: number): void;
        write(arg0: number[]): void;
        write(arg0: number[], arg1: number, arg2: number): void;
        flush(): void;
        close(): void;
      }

      const Flushable: JavaInterfaceStatics;
      interface Flushable extends JavaObject {
        flush(): void;
      }

      const DataInputStream: JavaClassStatics<
        [DataInputStream],
        [arg0: InputStream]
      > & {
        readUTF(arg0: DataInput): string;
      };
      interface DataInputStream extends FilterInputStream, DataInput {
        read(arg0: number[]): number;
        read(arg0: number[], arg1: number, arg2: number): number;
        read(): number;
        readFully(arg0: number[]): void;
        readFully(arg0: number[], arg1: number, arg2: number): void;
        skipBytes(arg0: number): number;
        readBoolean(): boolean;
        readByte(): number;
        readUnsignedByte(): number;
        readShort(): number;
        readUnsignedShort(): number;
        readChar(): number;
        readInt(): number;
        readLong(): number;
        readFloat(): number;
        readDouble(): number;
        /** @deprecated */
        readLine(): string;
        readUTF(): string;
      }

      const DataOutputStream: JavaClassStatics<
        [DataOutputStream],
        [arg0: OutputStream]
      >;
      interface DataOutputStream extends FilterOutputStream, DataOutput {
        write(arg0: number): void;
        write(arg0: number[], arg1: number, arg2: number): void;
        write(arg0: number[]): void;
        flush(): void;
        writeBoolean(arg0: boolean): void;
        writeByte(arg0: number): void;
        writeShort(arg0: number): void;
        writeChar(arg0: number): void;
        writeInt(arg0: number): void;
        writeLong(arg0: number): void;
        writeFloat(arg0: number): void;
        writeDouble(arg0: number): void;
        writeBytes(arg0: string): void;
        writeChars(arg0: string): void;
        writeUTF(arg0: string): void;
        size(): number;
      }

      const PrintStream: JavaClassStatics<{
        new (arg0: OutputStream): PrintStream;
        new (arg0: OutputStream, arg1: boolean): PrintStream;
        new (arg0: OutputStream, arg1: boolean, arg2: string): PrintStream;
        new (
          arg0: OutputStream,
          arg1: boolean,
          arg2: java.nio.charset.Charset
        ): PrintStream;
        new (arg0: string): PrintStream;
        new (arg0: string, arg1: string): PrintStream;
        new (arg0: string, arg1: java.nio.charset.Charset): PrintStream;
        new (arg0: File): PrintStream;
        new (arg0: File, arg1: string): PrintStream;
        new (arg0: File, arg1: java.nio.charset.Charset): PrintStream;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface PrintStream
        extends FilterOutputStream,
          java.lang.Appendable,
          Closeable {
        flush(): void;
        close(): void;
        checkError(): boolean;
        write(arg0: number): void;
        write(arg0: number[], arg1: number, arg2: number): void;
        write(arg0: number[]): void;
        writeBytes(arg0: number[]): void;
        print(arg0: boolean): void;
        print(arg0: number): void;
        print(arg0: number): void;
        print(arg0: number): void;
        print(arg0: number): void;
        print(arg0: number): void;
        print(arg0: number[]): void;
        print(arg0: string): void;
        print(arg0: any): void;
        println(): void;
        println(arg0: boolean): void;
        println(arg0: number): void;
        println(arg0: number): void;
        println(arg0: number): void;
        println(arg0: number): void;
        println(arg0: number): void;
        println(arg0: number[]): void;
        println(arg0: string): void;
        println(arg0: any): void;
        printf(arg0: string, ...arg1: any[]): PrintStream;
        printf(
          arg0: java.util.Locale,
          arg1: string,
          ...arg2: any[]
        ): PrintStream;
        format(arg0: string, ...arg1: any[]): PrintStream;
        format(
          arg0: java.util.Locale,
          arg1: string,
          ...arg2: any[]
        ): PrintStream;
        append(arg0: java.lang.CharSequence): PrintStream;
        append(
          arg0: java.lang.CharSequence,
          arg1: number,
          arg2: number
        ): PrintStream;
        append(arg0: number): PrintStream;
      }

      const PrintWriter: JavaClassStatics<{
        new (arg0: Writer): PrintWriter;
        new (arg0: Writer, arg1: boolean): PrintWriter;
        new (arg0: OutputStream): PrintWriter;
        new (arg0: OutputStream, arg1: boolean): PrintWriter;
        new (
          arg0: OutputStream,
          arg1: boolean,
          arg2: java.nio.charset.Charset
        ): PrintWriter;
        new (arg0: string): PrintWriter;
        new (arg0: string, arg1: string): PrintWriter;
        new (arg0: string, arg1: java.nio.charset.Charset): PrintWriter;
        new (arg0: File): PrintWriter;
        new (arg0: File, arg1: string): PrintWriter;
        new (arg0: File, arg1: java.nio.charset.Charset): PrintWriter;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface PrintWriter extends Writer {
        flush(): void;
        close(): void;
        checkError(): boolean;
        write(arg0: number): void;
        write(arg0: number[], arg1: number, arg2: number): void;
        write(arg0: number[]): void;
        write(arg0: string, arg1: number, arg2: number): void;
        write(arg0: string): void;
        print(arg0: boolean): void;
        print(arg0: number): void;
        print(arg0: number): void;
        print(arg0: number): void;
        print(arg0: number): void;
        print(arg0: number): void;
        print(arg0: number[]): void;
        print(arg0: string): void;
        print(arg0: any): void;
        println(): void;
        println(arg0: boolean): void;
        println(arg0: number): void;
        println(arg0: number): void;
        println(arg0: number): void;
        println(arg0: number): void;
        println(arg0: number): void;
        println(arg0: number[]): void;
        println(arg0: string): void;
        println(arg0: any): void;
        printf(arg0: string, ...arg1: any[]): PrintWriter;
        printf(
          arg0: java.util.Locale,
          arg1: string,
          ...arg2: any[]
        ): PrintWriter;
        format(arg0: string, ...arg1: any[]): PrintWriter;
        format(
          arg0: java.util.Locale,
          arg1: string,
          ...arg2: any[]
        ): PrintWriter;
        append(arg0: java.lang.CharSequence): PrintWriter;
        append(
          arg0: java.lang.CharSequence,
          arg1: number,
          arg2: number
        ): PrintWriter;
        append(arg0: number): PrintWriter;
      }

      const Writer: JavaClassStatics<false> & {
        nullWriter(): Writer;
      };
      interface Writer extends java.lang.Appendable, Closeable, Flushable {
        write(arg0: number): void;
        write(arg0: number[]): void;
        write(arg0: number[], arg1: number, arg2: number): void;
        write(arg0: string): void;
        write(arg0: string, arg1: number, arg2: number): void;
        append(arg0: java.lang.CharSequence): Writer;
        append(
          arg0: java.lang.CharSequence,
          arg1: number,
          arg2: number
        ): Writer;
        append(arg0: number): Writer;
        flush(): void;
        close(): void;
      }

      const DataOutput: JavaInterfaceStatics;
      interface DataOutput extends JavaObject {
        write(arg0: number): void;
        write(arg0: number[]): void;
        write(arg0: number[], arg1: number, arg2: number): void;
        writeBoolean(arg0: boolean): void;
        writeByte(arg0: number): void;
        writeShort(arg0: number): void;
        writeChar(arg0: number): void;
        writeInt(arg0: number): void;
        writeLong(arg0: number): void;
        writeFloat(arg0: number): void;
        writeDouble(arg0: number): void;
        writeBytes(arg0: string): void;
        writeChars(arg0: string): void;
        writeUTF(arg0: string): void;
      }

      const FilterOutputStream: JavaClassStatics<
        [FilterOutputStream],
        [arg0: OutputStream]
      >;
      interface FilterOutputStream extends OutputStream {
        write(arg0: number): void;
        write(arg0: number[]): void;
        write(arg0: number[], arg1: number, arg2: number): void;
        flush(): void;
        close(): void;
      }

      const DataInput: JavaInterfaceStatics;
      interface DataInput extends JavaObject {
        readFully(arg0: number[]): void;
        readFully(arg0: number[], arg1: number, arg2: number): void;
        skipBytes(arg0: number): number;
        readBoolean(): boolean;
        readByte(): number;
        readUnsignedByte(): number;
        readShort(): number;
        readUnsignedShort(): number;
        readChar(): number;
        readInt(): number;
        readLong(): number;
        readFloat(): number;
        readDouble(): number;
        readLine(): string;
        readUTF(): string;
      }

      const FilterInputStream: JavaClassStatics<false>;
      interface FilterInputStream extends InputStream {
        read(): number;
        read(arg0: number[]): number;
        read(arg0: number[], arg1: number, arg2: number): number;
        skip(arg0: number): number;
        available(): number;
        close(): void;
        mark(arg0: number): void;
        reset(): void;
        markSupported(): boolean;
      }

      const Reader: JavaClassStatics<false> & {
        nullReader(): Reader;
      };
      interface Reader extends java.lang.Readable, Closeable {
        read(arg0: java.nio.CharBuffer): number;
        read(): number;
        read(arg0: number[]): number;
        read(arg0: number[], arg1: number, arg2: number): number;
        skip(arg0: number): number;
        ready(): boolean;
        markSupported(): boolean;
        mark(arg0: number): void;
        reset(): void;
        close(): void;
        transferTo(arg0: Writer): number;
      }

      export {
        IOException,
        Closeable,
        InputStream,
        OutputStream,
        Flushable,
        DataInputStream,
        DataOutputStream,
        PrintStream,
        PrintWriter,
        Writer,
        DataOutput,
        FilterOutputStream,
        DataInput,
        FilterInputStream,
        Reader,
      };
    }

    namespace lang {
      const AutoCloseable: JavaInterfaceStatics;
      interface AutoCloseable extends JavaObject {
        close(): void;
      }

      const Comparable: JavaInterfaceStatics;
      interface Comparable<T extends Object> extends JavaObject {
        compareTo(arg0: T): number;
      }

      const Runnable: JavaInterfaceStatics;
      interface Runnable extends JavaObject {
        run(): void;
      }

      const Thread: JavaClassStatics<{
        new (): Thread;
        new (arg0: Runnable): Thread;
        new (arg0: ThreadGroup, arg1: Runnable): Thread;
        new (arg0: String): Thread;
        new (arg0: ThreadGroup, arg1: String): Thread;
        new (arg0: Runnable, arg1: String): Thread;
        new (arg0: ThreadGroup, arg1: Runnable, arg2: String): Thread;
        new (
          arg0: ThreadGroup,
          arg1: Runnable,
          arg2: String,
          arg3: number
        ): Thread;
        new (
          arg0: ThreadGroup,
          arg1: Runnable,
          arg2: String,
          arg3: number,
          arg4: boolean
        ): Thread;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        readonly MIN_PRIORITY: number;
        readonly NORM_PRIORITY: number;
        readonly MAX_PRIORITY: number;

        currentThread(): Thread;
        yield(): void;
        sleep(arg0: number): void;
        sleep(arg0: number, arg1: number): void;
        onSpinWait(): void;
        interrupted(): boolean;
        activeCount(): number;
        enumerate(arg0: Thread[]): number;
        dumpStack(): void;
        holdsLock(arg0: Object): boolean;
        getAllStackTraces(): JavaMap<Thread, StackTraceElement[]>;
        setDefaultUncaughtExceptionHandler(
          arg0: Thread$UncaughtExceptionHandler
        ): void;
        getDefaultUncaughtExceptionHandler(): Thread$UncaughtExceptionHandler;
      };
      interface Thread extends Object, Runnable {
        start(): void;
        run(): void;
        /** @deprecated */
        stop(): void;
        interrupt(): void;
        isInterrupted(): boolean;
        isAlive(): boolean;
        /** @deprecated */
        suspend(): void;
        /** @deprecated */
        resume(): void;
        setPriority(arg0: number): void;
        getPriority(): number;
        setName(arg0: String): void;
        getName(): String;
        getThreadGroup(): ThreadGroup;
        /** @deprecated */
        countStackFrames(): number;
        join(arg0: number): void;
        join(arg0: number, arg1: number): void;
        join(): void;
        setDaemon(arg0: boolean): void;
        isDaemon(): boolean;
        /** @deprecated */
        checkAccess(): void;
        getContextClassLoader(): ClassLoader;
        setContextClassLoader(arg0: ClassLoader): void;
        getStackTrace(): StackTraceElement[];
        getId(): number;
        getState(): Thread$State;
        getUncaughtExceptionHandler(): Thread$UncaughtExceptionHandler;
        setUncaughtExceptionHandler(
          arg0: Thread$UncaughtExceptionHandler
        ): void;
      }

      const Number: JavaClassStatics<[Number]>;
      interface Number extends Object, java.io.Serializable {
        intValue(): number;
        longValue(): number;
        floatValue(): number;
        doubleValue(): number;
        byteValue(): number;
        shortValue(): number;
      }

      const Enum: JavaClassStatics<false> & {
        valueOf<T>(arg0: JavaClass<T>, arg1: String): T;
      };
      interface Enum<E extends Enum<E>>
        extends Object,
          java.lang.constant.Constable,
          Comparable<E>,
          java.io.Serializable {
        name(): String;
        ordinal(): number;
        compareTo(arg0: E): number;
        getDeclaringClass(): JavaClass<E>;
        describeConstable(): java.util.Optional<Enum$EnumDesc<E>>;
      }

      const ClassLoader: JavaClassStatics<false> & {
        getSystemResource(arg0: String): java.net.URL;
        getSystemResources(arg0: String): java.util.Enumeration<java.net.URL>;
        getSystemResourceAsStream(arg0: String): java.io.InputStream;
        getPlatformClassLoader(): ClassLoader;
        getSystemClassLoader(): ClassLoader;
      };
      interface ClassLoader extends Object {
        getName(): String;
        loadClass(arg0: String): JavaClass<any>;
        getResource(arg0: String): java.net.URL;
        getResources(arg0: String): java.util.Enumeration<java.net.URL>;
        resources(arg0: String): java.util.stream.Stream<java.net.URL>;
        isRegisteredAsParallelCapable(): boolean;
        getResourceAsStream(arg0: String): java.io.InputStream;
        getParent(): ClassLoader;
        getUnnamedModule(): Module;
        getDefinedPackage(arg0: String): Package;
        getDefinedPackages(): Package[];
        setDefaultAssertionStatus(arg0: boolean): void;
        setPackageAssertionStatus(arg0: String, arg1: boolean): void;
        setClassAssertionStatus(arg0: String, arg1: boolean): void;
        clearAssertionStatus(): void;
      }

      const Enum$EnumDesc: JavaClassStatics<false> & {
        of<E>(
          arg0: java.lang.constant.ClassDesc,
          arg1: String
        ): Enum$EnumDesc<E>;
      };
      interface Enum$EnumDesc<E extends Enum<E>>
        extends java.lang.constant.DynamicConstantDesc<E> {
        resolveConstantDesc(arg0: java.lang.invoke.MethodHandles$Lookup): E;
      }

      const ThreadGroup: JavaClassStatics<{
        new (arg0: String): ThreadGroup;
        new (arg0: ThreadGroup, arg1: String): ThreadGroup;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface ThreadGroup extends Object, Thread$UncaughtExceptionHandler {
        getName(): String;
        getParent(): ThreadGroup;
        getMaxPriority(): number;
        /** @deprecated */
        isDaemon(): boolean;
        /** @deprecated */
        isDestroyed(): boolean;
        /** @deprecated */
        setDaemon(arg0: boolean): void;
        setMaxPriority(arg0: number): void;
        parentOf(arg0: ThreadGroup): boolean;
        /** @deprecated */
        checkAccess(): void;
        activeCount(): number;
        enumerate(arg0: Thread[]): number;
        enumerate(arg0: Thread[], arg1: boolean): number;
        activeGroupCount(): number;
        enumerate(arg0: ThreadGroup[]): number;
        enumerate(arg0: ThreadGroup[], arg1: boolean): number;
        /** @deprecated */
        stop(): void;
        interrupt(): void;
        /** @deprecated */
        suspend(): void;
        /** @deprecated */
        resume(): void;
        /** @deprecated */
        destroy(): void;
        list(): void;
        uncaughtException(arg0: Thread, arg1: Throwable): void;
        /** @deprecated */
        allowThreadSuspension(arg0: boolean): boolean;
      }

      const Thread$UncaughtExceptionHandler: JavaInterfaceStatics;
      interface Thread$UncaughtExceptionHandler extends JavaObject {
        uncaughtException(arg0: Thread, arg1: Throwable): void;
      }

      const Thread$State: JavaClassStatics<false> & {
        readonly NEW: Thread$State;
        readonly RUNNABLE: Thread$State;
        readonly BLOCKED: Thread$State;
        readonly WAITING: Thread$State;
        readonly TIMED_WAITING: Thread$State;
        readonly TERMINATED: Thread$State;

        values(): Thread$State[];
        valueOf(arg0: String): Thread$State;
      };
      interface Thread$State extends Enum<Thread$State> {}

      const String: JavaClassStatics<{
        new (): String;
        new (arg0: String): String;
        new (arg0: number[]): String;
        new (arg0: number[], arg1: number, arg2: number): String;
        new (arg0: number[], arg1: number, arg2: number): String;
        /** @deprecated */
        new (arg0: number[], arg1: number, arg2: number, arg3: number): String;
        /** @deprecated */
        new (arg0: number[], arg1: number): String;
        new (arg0: number[], arg1: number, arg2: number, arg3: String): String;
        new (
          arg0: number[],
          arg1: number,
          arg2: number,
          arg3: java.nio.charset.Charset
        ): String;
        new (arg0: number[], arg1: String): String;
        new (arg0: number[], arg1: java.nio.charset.Charset): String;
        new (arg0: number[], arg1: number, arg2: number): String;
        new (arg0: number[]): String;
        new (arg0: StringBuffer): String;
        new (arg0: StringBuilder): String;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        readonly CASE_INSENSITIVE_ORDER: java.util.Comparator<String>;

        join(arg0: CharSequence, ...arg1: CharSequence[]): String;
        join(arg0: CharSequence, arg1: Iterable<any>): String;
        format(arg0: String, ...arg1: Object[]): String;
        format(arg0: java.util.Locale, arg1: String, ...arg2: Object[]): String;
        valueOf(arg0: Object): String;
        valueOf(arg0: number[]): String;
        valueOf(arg0: number[], arg1: number, arg2: number): String;
        copyValueOf(arg0: number[], arg1: number, arg2: number): String;
        copyValueOf(arg0: number[]): String;
        valueOf(arg0: boolean): String;
        valueOf(arg0: number): String;
        valueOf(arg0: number): String;
        valueOf(arg0: number): String;
        valueOf(arg0: number): String;
        valueOf(arg0: number): String;
      };
      interface String
        extends Object,
          java.io.Serializable,
          Comparable<String>,
          CharSequence,
          java.lang.constant.Constable,
          java.lang.constant.ConstantDesc {
        length(): number;
        isEmpty(): boolean;
        charAt(arg0: number): number;
        codePointAt(arg0: number): number;
        codePointBefore(arg0: number): number;
        codePointCount(arg0: number, arg1: number): number;
        offsetByCodePoints(arg0: number, arg1: number): number;
        getChars(
          arg0: number,
          arg1: number,
          arg2: number[],
          arg3: number
        ): void;
        /** @deprecated */
        getBytes(
          arg0: number,
          arg1: number,
          arg2: number[],
          arg3: number
        ): void;
        getBytes(arg0: String): number[];
        getBytes(arg0: java.nio.charset.Charset): number[];
        getBytes(): number[];
        contentEquals(arg0: StringBuffer): boolean;
        contentEquals(arg0: CharSequence): boolean;
        equalsIgnoreCase(arg0: String): boolean;
        compareTo(arg0: String): number;
        compareToIgnoreCase(arg0: String): number;
        regionMatches(
          arg0: number,
          arg1: String,
          arg2: number,
          arg3: number
        ): boolean;
        regionMatches(
          arg0: boolean,
          arg1: number,
          arg2: String,
          arg3: number,
          arg4: number
        ): boolean;
        startsWith(arg0: String, arg1: number): boolean;
        startsWith(arg0: String): boolean;
        endsWith(arg0: String): boolean;
        indexOf(arg0: number): number;
        indexOf(arg0: number, arg1: number): number;
        lastIndexOf(arg0: number): number;
        lastIndexOf(arg0: number, arg1: number): number;
        indexOf(arg0: String): number;
        indexOf(arg0: String, arg1: number): number;
        lastIndexOf(arg0: String): number;
        lastIndexOf(arg0: String, arg1: number): number;
        substring(arg0: number): String;
        substring(arg0: number, arg1: number): String;
        subSequence(arg0: number, arg1: number): CharSequence;
        concat(arg0: String): String;
        replace(arg0: number, arg1: number): String;
        matches(arg0: String): boolean;
        contains(arg0: CharSequence): boolean;
        replaceFirst(arg0: String, arg1: String): String;
        replaceAll(arg0: String, arg1: String): String;
        replace(arg0: CharSequence, arg1: CharSequence): String;
        split(arg0: String, arg1: number): String[];
        split(arg0: String): String[];
        toLowerCase(arg0: java.util.Locale): String;
        toLowerCase(): String;
        toUpperCase(arg0: java.util.Locale): String;
        toUpperCase(): String;
        trim(): String;
        strip(): String;
        stripLeading(): String;
        stripTrailing(): String;
        isBlank(): boolean;
        lines(): java.util.stream.Stream<String>;
        indent(arg0: number): String;
        stripIndent(): String;
        translateEscapes(): String;
        transform<R>(arg0: java.util.function.Function<any, any>): R;
        chars(): java.util.stream.IntStream;
        codePoints(): java.util.stream.IntStream;
        toCharArray(): number[];
        formatted(...arg0: Object[]): String;
        intern(): String;
        repeat(arg0: number): String;
        describeConstable(): java.util.Optional<String>;
        resolveConstantDesc(
          arg0: java.lang.invoke.MethodHandles$Lookup
        ): String;
      }

      const StringBuilder: JavaClassStatics<{
        new (): StringBuilder;
        new (arg0: number): StringBuilder;
        new (arg0: String): StringBuilder;
        new (arg0: CharSequence): StringBuilder;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface StringBuilder
        extends AbstractStringBuilder,
          java.io.Serializable,
          Comparable<StringBuilder>,
          CharSequence {
        compareTo(arg0: StringBuilder): number;
        append(arg0: Object): StringBuilder;
        append(arg0: String): StringBuilder;
        append(arg0: StringBuffer): StringBuilder;
        append(arg0: CharSequence): StringBuilder;
        append(arg0: CharSequence, arg1: number, arg2: number): StringBuilder;
        append(arg0: number[]): StringBuilder;
        append(arg0: number[], arg1: number, arg2: number): StringBuilder;
        append(arg0: boolean): StringBuilder;
        append(arg0: number): StringBuilder;
        append(arg0: number): StringBuilder;
        append(arg0: number): StringBuilder;
        append(arg0: number): StringBuilder;
        append(arg0: number): StringBuilder;
        appendCodePoint(arg0: number): StringBuilder;
        delete(arg0: number, arg1: number): StringBuilder;
        deleteCharAt(arg0: number): StringBuilder;
        replace(arg0: number, arg1: number, arg2: String): StringBuilder;
        insert(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): StringBuilder;
        insert(arg0: number, arg1: Object): StringBuilder;
        insert(arg0: number, arg1: String): StringBuilder;
        insert(arg0: number, arg1: number[]): StringBuilder;
        insert(arg0: number, arg1: CharSequence): StringBuilder;
        insert(
          arg0: number,
          arg1: CharSequence,
          arg2: number,
          arg3: number
        ): StringBuilder;
        insert(arg0: number, arg1: boolean): StringBuilder;
        insert(arg0: number, arg1: number): StringBuilder;
        insert(arg0: number, arg1: number): StringBuilder;
        insert(arg0: number, arg1: number): StringBuilder;
        insert(arg0: number, arg1: number): StringBuilder;
        insert(arg0: number, arg1: number): StringBuilder;
        indexOf(arg0: String): number;
        indexOf(arg0: String, arg1: number): number;
        lastIndexOf(arg0: String): number;
        lastIndexOf(arg0: String, arg1: number): number;
        reverse(): StringBuilder;
      }

      const Package: JavaClassStatics<false> & {
        /** @deprecated */
        getPackage(arg0: String): Package;
        getPackages(): Package[];
      };
      interface Package
        extends NamedPackage,
          java.lang.reflect.AnnotatedElement {
        getName(): String;
        getSpecificationTitle(): String;
        getSpecificationVersion(): String;
        getSpecificationVendor(): String;
        getImplementationTitle(): String;
        getImplementationVersion(): String;
        getImplementationVendor(): String;
        isSealed(): boolean;
        isSealed(arg0: java.net.URL): boolean;
        isCompatibleWith(arg0: String): boolean;
        getAnnotation<A>(arg0: JavaClass<A>): A;
        isAnnotationPresent(arg0: JavaClass<any>): boolean;
        getAnnotationsByType<A>(arg0: JavaClass<A>): A[];
        getAnnotations(): java.lang.annotation.Annotation[];
        getDeclaredAnnotation<A>(arg0: JavaClass<A>): A;
        getDeclaredAnnotationsByType<A>(arg0: JavaClass<A>): A[];
        getDeclaredAnnotations(): java.lang.annotation.Annotation[];
      }

      const CharSequence: JavaInterfaceStatics & {
        compare(arg0: CharSequence, arg1: CharSequence): number;
      };
      interface CharSequence extends JavaObject {
        length(): number;
        charAt(arg0: number): number;
        isEmpty(): boolean;
        subSequence(arg0: number, arg1: number): CharSequence;
        chars(): java.util.stream.IntStream;
        codePoints(): java.util.stream.IntStream;
      }

      const StringBuffer: JavaClassStatics<{
        new (): StringBuffer;
        new (arg0: number): StringBuffer;
        new (arg0: String): StringBuffer;
        new (arg0: CharSequence): StringBuffer;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface StringBuffer
        extends AbstractStringBuilder,
          java.io.Serializable,
          Comparable<StringBuffer>,
          CharSequence {
        compareTo(arg0: StringBuffer): number;
        length(): number;
        capacity(): number;
        ensureCapacity(arg0: number): void;
        trimToSize(): void;
        setLength(arg0: number): void;
        charAt(arg0: number): number;
        codePointAt(arg0: number): number;
        codePointBefore(arg0: number): number;
        codePointCount(arg0: number, arg1: number): number;
        offsetByCodePoints(arg0: number, arg1: number): number;
        getChars(
          arg0: number,
          arg1: number,
          arg2: number[],
          arg3: number
        ): void;
        setCharAt(arg0: number, arg1: number): void;
        append(arg0: Object): StringBuffer;
        append(arg0: String): StringBuffer;
        append(arg0: StringBuffer): StringBuffer;
        append(arg0: CharSequence): StringBuffer;
        append(arg0: CharSequence, arg1: number, arg2: number): StringBuffer;
        append(arg0: number[]): StringBuffer;
        append(arg0: number[], arg1: number, arg2: number): StringBuffer;
        append(arg0: boolean): StringBuffer;
        append(arg0: number): StringBuffer;
        append(arg0: number): StringBuffer;
        appendCodePoint(arg0: number): StringBuffer;
        append(arg0: number): StringBuffer;
        append(arg0: number): StringBuffer;
        append(arg0: number): StringBuffer;
        delete(arg0: number, arg1: number): StringBuffer;
        deleteCharAt(arg0: number): StringBuffer;
        replace(arg0: number, arg1: number, arg2: String): StringBuffer;
        substring(arg0: number): String;
        subSequence(arg0: number, arg1: number): CharSequence;
        substring(arg0: number, arg1: number): String;
        insert(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): StringBuffer;
        insert(arg0: number, arg1: Object): StringBuffer;
        insert(arg0: number, arg1: String): StringBuffer;
        insert(arg0: number, arg1: number[]): StringBuffer;
        insert(arg0: number, arg1: CharSequence): StringBuffer;
        insert(
          arg0: number,
          arg1: CharSequence,
          arg2: number,
          arg3: number
        ): StringBuffer;
        insert(arg0: number, arg1: boolean): StringBuffer;
        insert(arg0: number, arg1: number): StringBuffer;
        insert(arg0: number, arg1: number): StringBuffer;
        insert(arg0: number, arg1: number): StringBuffer;
        insert(arg0: number, arg1: number): StringBuffer;
        insert(arg0: number, arg1: number): StringBuffer;
        indexOf(arg0: String): number;
        indexOf(arg0: String, arg1: number): number;
        lastIndexOf(arg0: String): number;
        lastIndexOf(arg0: String, arg1: number): number;
        reverse(): StringBuffer;
      }

      const Module: JavaClassStatics<false>;
      interface Module extends Object, java.lang.reflect.AnnotatedElement {
        isNamed(): boolean;
        getName(): String;
        getClassLoader(): ClassLoader;
        getDescriptor(): java.lang.module.ModuleDescriptor;
        getLayer(): ModuleLayer;
        canRead(arg0: Module): boolean;
        addReads(arg0: Module): Module;
        isExported(arg0: String, arg1: Module): boolean;
        isOpen(arg0: String, arg1: Module): boolean;
        isExported(arg0: String): boolean;
        isOpen(arg0: String): boolean;
        addExports(arg0: String, arg1: Module): Module;
        addOpens(arg0: String, arg1: Module): Module;
        addUses(arg0: JavaClass<any>): Module;
        canUse(arg0: JavaClass<any>): boolean;
        getPackages(): JavaSet<String>;
        getAnnotation<T>(arg0: JavaClass<T>): T;
        getAnnotations(): java.lang.annotation.Annotation[];
        getDeclaredAnnotations(): java.lang.annotation.Annotation[];
        getResourceAsStream(arg0: String): java.io.InputStream;
      }

      const ModuleLayer: JavaClassStatics<false> & {
        defineModulesWithOneLoader(
          arg0: java.lang.module.Configuration,
          arg1: JavaList<ModuleLayer>,
          arg2: ClassLoader
        ): ModuleLayer$Controller;
        defineModulesWithManyLoaders(
          arg0: java.lang.module.Configuration,
          arg1: JavaList<ModuleLayer>,
          arg2: ClassLoader
        ): ModuleLayer$Controller;
        defineModules(
          arg0: java.lang.module.Configuration,
          arg1: JavaList<ModuleLayer>,
          arg2: java.util.function.Function<String, ClassLoader>
        ): ModuleLayer$Controller;
        empty(): ModuleLayer;
        boot(): ModuleLayer;
      };
      interface ModuleLayer extends Object {
        defineModulesWithOneLoader(
          arg0: java.lang.module.Configuration,
          arg1: ClassLoader
        ): ModuleLayer;
        defineModulesWithManyLoaders(
          arg0: java.lang.module.Configuration,
          arg1: ClassLoader
        ): ModuleLayer;
        defineModules(
          arg0: java.lang.module.Configuration,
          arg1: java.util.function.Function<String, ClassLoader>
        ): ModuleLayer;
        configuration(): java.lang.module.Configuration;
        parents(): JavaList<ModuleLayer>;
        modules(): JavaSet<Module>;
        findModule(arg0: String): java.util.Optional<Module>;
        findLoader(arg0: String): ClassLoader;
      }

      const NamedPackage: JavaClassStatics<false>;
      interface NamedPackage extends Object {}

      const AbstractStringBuilder: JavaClassStatics<false>;
      interface AbstractStringBuilder extends Object, Appendable, CharSequence {
        length(): number;
        capacity(): number;
        ensureCapacity(arg0: number): void;
        trimToSize(): void;
        setLength(arg0: number): void;
        charAt(arg0: number): number;
        codePointAt(arg0: number): number;
        codePointBefore(arg0: number): number;
        codePointCount(arg0: number, arg1: number): number;
        offsetByCodePoints(arg0: number, arg1: number): number;
        getChars(
          arg0: number,
          arg1: number,
          arg2: number[],
          arg3: number
        ): void;
        setCharAt(arg0: number, arg1: number): void;
        append(arg0: Object): AbstractStringBuilder;
        append(arg0: String): AbstractStringBuilder;
        append(arg0: StringBuffer): AbstractStringBuilder;
        append(arg0: CharSequence): AbstractStringBuilder;
        append(
          arg0: CharSequence,
          arg1: number,
          arg2: number
        ): AbstractStringBuilder;
        append(arg0: number[]): AbstractStringBuilder;
        append(
          arg0: number[],
          arg1: number,
          arg2: number
        ): AbstractStringBuilder;
        append(arg0: boolean): AbstractStringBuilder;
        append(arg0: number): AbstractStringBuilder;
        append(arg0: number): AbstractStringBuilder;
        append(arg0: number): AbstractStringBuilder;
        append(arg0: number): AbstractStringBuilder;
        append(arg0: number): AbstractStringBuilder;
        delete(arg0: number, arg1: number): AbstractStringBuilder;
        appendCodePoint(arg0: number): AbstractStringBuilder;
        deleteCharAt(arg0: number): AbstractStringBuilder;
        replace(
          arg0: number,
          arg1: number,
          arg2: String
        ): AbstractStringBuilder;
        substring(arg0: number): String;
        subSequence(arg0: number, arg1: number): CharSequence;
        substring(arg0: number, arg1: number): String;
        insert(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): AbstractStringBuilder;
        insert(arg0: number, arg1: Object): AbstractStringBuilder;
        insert(arg0: number, arg1: String): AbstractStringBuilder;
        insert(arg0: number, arg1: number[]): AbstractStringBuilder;
        insert(arg0: number, arg1: CharSequence): AbstractStringBuilder;
        insert(
          arg0: number,
          arg1: CharSequence,
          arg2: number,
          arg3: number
        ): AbstractStringBuilder;
        insert(arg0: number, arg1: boolean): AbstractStringBuilder;
        insert(arg0: number, arg1: number): AbstractStringBuilder;
        insert(arg0: number, arg1: number): AbstractStringBuilder;
        insert(arg0: number, arg1: number): AbstractStringBuilder;
        insert(arg0: number, arg1: number): AbstractStringBuilder;
        insert(arg0: number, arg1: number): AbstractStringBuilder;
        indexOf(arg0: String): number;
        indexOf(arg0: String, arg1: number): number;
        lastIndexOf(arg0: String): number;
        lastIndexOf(arg0: String, arg1: number): number;
        reverse(): AbstractStringBuilder;
        chars(): java.util.stream.IntStream;
        codePoints(): java.util.stream.IntStream;
      }

      const Appendable: JavaInterfaceStatics;
      interface Appendable extends JavaObject {
        append(arg0: CharSequence): Appendable;
        append(arg0: CharSequence, arg1: number, arg2: number): Appendable;
        append(arg0: number): Appendable;
      }

      const ModuleLayer$Controller: JavaClassStatics<false>;
      interface ModuleLayer$Controller extends Object {
        layer(): ModuleLayer;
        addReads(arg0: Module, arg1: Module): ModuleLayer$Controller;
        addExports(
          arg0: Module,
          arg1: String,
          arg2: Module
        ): ModuleLayer$Controller;
        addOpens(
          arg0: Module,
          arg1: String,
          arg2: Module
        ): ModuleLayer$Controller;
      }

      const Exception: JavaClassStatics<{
        new (): Exception;
        new (arg0: String): Exception;
        new (arg0: String, arg1: Throwable): Exception;
        new (arg0: Throwable): Exception;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface Exception extends Throwable {}

      const Cloneable: JavaInterfaceStatics;
      interface Cloneable extends JavaObject {}

      const Readable: JavaInterfaceStatics;
      interface Readable extends JavaObject {
        read(arg0: java.nio.CharBuffer): number;
      }

      const Void: JavaClassStatics<false> & {
        readonly TYPE: JavaClass<Void>;
      };
      interface Void extends Object {}

      namespace reflect {
        const Method: JavaClassStatics<false>;
        interface Method extends Executable {
          setAccessible(arg0: boolean): void;
          getDeclaringClass(): JavaClass<any>;
          getName(): string;
          getModifiers(): number;
          getTypeParameters(): TypeVariable<Method>[];
          getReturnType(): JavaClass<any>;
          getGenericReturnType(): Type;
          getParameterTypes(): JavaClass<any>[];
          getParameterCount(): number;
          getGenericParameterTypes(): Type[];
          getExceptionTypes(): JavaClass<any>[];
          getGenericExceptionTypes(): Type[];
          toGenericString(): string;
          invoke(arg0: any, ...arg1: any[]): any;
          isBridge(): boolean;
          isVarArgs(): boolean;
          isSynthetic(): boolean;
          isDefault(): boolean;
          getDefaultValue(): any;
          getAnnotation<T>(arg0: JavaClass<T>): T;
          getDeclaredAnnotations(): java.lang.annotation.Annotation[];
          getParameterAnnotations(): java.lang.annotation.Annotation[][];
          getAnnotatedReturnType(): AnnotatedType;
        }

        const Field: JavaClassStatics<false>;
        interface Field extends AccessibleObject, Member {
          setAccessible(arg0: boolean): void;
          getDeclaringClass(): JavaClass<any>;
          getName(): string;
          getModifiers(): number;
          isEnumConstant(): boolean;
          isSynthetic(): boolean;
          getType(): JavaClass<any>;
          getGenericType(): Type;
          toGenericString(): string;
          get(arg0: any): any;
          getBoolean(arg0: any): boolean;
          getByte(arg0: any): number;
          getChar(arg0: any): number;
          getShort(arg0: any): number;
          getInt(arg0: any): number;
          getLong(arg0: any): number;
          getFloat(arg0: any): number;
          getDouble(arg0: any): number;
          set(arg0: any, arg1: any): void;
          setBoolean(arg0: any, arg1: boolean): void;
          setByte(arg0: any, arg1: number): void;
          setChar(arg0: any, arg1: number): void;
          setShort(arg0: any, arg1: number): void;
          setInt(arg0: any, arg1: number): void;
          setLong(arg0: any, arg1: number): void;
          setFloat(arg0: any, arg1: number): void;
          setDouble(arg0: any, arg1: number): void;
          getAnnotation<T>(arg0: JavaClass<T>): T;
          getAnnotationsByType<T>(arg0: JavaClass<T>): T[];
          getDeclaredAnnotations(): java.lang.annotation.Annotation[];
          getAnnotatedType(): AnnotatedType;
        }

        const Type: JavaInterfaceStatics;
        interface Type extends JavaObject {
          getTypeName(): string;
        }

        const AccessibleObject: JavaClassStatics<false> & {
          setAccessible(arg0: AccessibleObject[], arg1: boolean): void;
        };
        interface AccessibleObject extends AnnotatedElement {
          setAccessible(arg0: boolean): void;
          trySetAccessible(): boolean;
          /** @deprecated */
          isAccessible(): boolean;
          canAccess(arg0: any): boolean;
          getAnnotation<T>(arg0: JavaClass<T>): T;
          isAnnotationPresent(arg0: JavaClass<any>): boolean;
          getAnnotationsByType<T>(arg0: JavaClass<T>): T[];
          getAnnotations(): java.lang.annotation.Annotation[];
          getDeclaredAnnotation<T>(arg0: JavaClass<T>): T;
          getDeclaredAnnotationsByType<T>(arg0: JavaClass<T>): T[];
          getDeclaredAnnotations(): java.lang.annotation.Annotation[];
        }

        const AnnotatedElement: JavaInterfaceStatics;
        interface AnnotatedElement extends JavaObject {
          isAnnotationPresent(arg0: JavaClass<any>): boolean;
          getAnnotation<T>(arg0: JavaClass<T>): T;
          getAnnotations(): java.lang.annotation.Annotation[];
          getAnnotationsByType<T>(arg0: JavaClass<T>): T[];
          getDeclaredAnnotation<T>(arg0: JavaClass<T>): T;
          getDeclaredAnnotationsByType<T>(arg0: JavaClass<T>): T[];
          getDeclaredAnnotations(): java.lang.annotation.Annotation[];
        }

        const TypeVariable: JavaInterfaceStatics;
        interface TypeVariable<D extends GenericDeclaration>
          extends Type,
            AnnotatedElement {
          getBounds(): Type[];
          getGenericDeclaration(): D;
          getName(): string;
          getAnnotatedBounds(): AnnotatedType[];
        }

        const Executable: JavaClassStatics<false>;
        interface Executable
          extends AccessibleObject,
            Member,
            GenericDeclaration {
          getDeclaringClass(): JavaClass<any>;
          getName(): string;
          getModifiers(): number;
          getTypeParameters(): TypeVariable<any>[];
          getParameterTypes(): JavaClass<any>[];
          getParameterCount(): number;
          getGenericParameterTypes(): Type[];
          getParameters(): Parameter[];
          getExceptionTypes(): JavaClass<any>[];
          getGenericExceptionTypes(): Type[];
          toGenericString(): string;
          isVarArgs(): boolean;
          isSynthetic(): boolean;
          getParameterAnnotations(): java.lang.annotation.Annotation[][];
          getAnnotation<T>(arg0: JavaClass<T>): T;
          getAnnotationsByType<T>(arg0: JavaClass<T>): T[];
          getDeclaredAnnotations(): java.lang.annotation.Annotation[];
          getAnnotatedReturnType(): AnnotatedType;
          getAnnotatedReceiverType(): AnnotatedType;
          getAnnotatedParameterTypes(): AnnotatedType[];
          getAnnotatedExceptionTypes(): AnnotatedType[];
        }

        const AnnotatedType: JavaInterfaceStatics;
        interface AnnotatedType extends AnnotatedElement {
          getAnnotatedOwnerType(): AnnotatedType;
          getType(): Type;
          getAnnotation<T>(arg0: JavaClass<T>): T;
          getAnnotations(): java.lang.annotation.Annotation[];
          getDeclaredAnnotations(): java.lang.annotation.Annotation[];
        }

        const GenericDeclaration: JavaInterfaceStatics;
        interface GenericDeclaration extends AnnotatedElement {
          getTypeParameters(): TypeVariable<any>[];
        }

        const Member: JavaInterfaceStatics & {
          readonly PUBLIC: number;
          readonly DECLARED: number;
        };
        interface Member extends JavaObject {
          getDeclaringClass(): JavaClass<any>;
          getName(): string;
          getModifiers(): number;
          isSynthetic(): boolean;
        }

        const Parameter: JavaClassStatics<false>;
        interface Parameter extends AnnotatedElement {
          isNamePresent(): boolean;
          getDeclaringExecutable(): Executable;
          getModifiers(): number;
          getName(): string;
          getParameterizedType(): Type;
          getType(): JavaClass<any>;
          getAnnotatedType(): AnnotatedType;
          isImplicit(): boolean;
          isSynthetic(): boolean;
          isVarArgs(): boolean;
          getAnnotation<T>(arg0: JavaClass<T>): T;
          getAnnotationsByType<T>(arg0: JavaClass<T>): T[];
          getDeclaredAnnotations(): java.lang.annotation.Annotation[];
          getDeclaredAnnotation<T>(arg0: JavaClass<T>): T;
          getDeclaredAnnotationsByType<T>(arg0: JavaClass<T>): T[];
          getAnnotations(): java.lang.annotation.Annotation[];
        }

        const Constructor: JavaClassStatics<false>;
        interface Constructor<T> extends Executable {
          setAccessible(arg0: boolean): void;
          getDeclaringClass(): JavaClass<T>;
          getName(): string;
          getModifiers(): number;
          getTypeParameters(): TypeVariable<Constructor<T>>[];
          getParameterTypes(): JavaClass<any>[];
          getParameterCount(): number;
          getGenericParameterTypes(): Type[];
          getExceptionTypes(): JavaClass<any>[];
          getGenericExceptionTypes(): Type[];
          toGenericString(): string;
          newInstance(...arg0: any[]): T;
          isVarArgs(): boolean;
          isSynthetic(): boolean;
          getAnnotation<T>(arg0: JavaClass<T>): T;
          getDeclaredAnnotations(): java.lang.annotation.Annotation[];
          getParameterAnnotations(): java.lang.annotation.Annotation[][];
          getAnnotatedReturnType(): AnnotatedType;
          getAnnotatedReceiverType(): AnnotatedType;
        }

        export {
          Method,
          Field,
          Type,
          AccessibleObject,
          AnnotatedElement,
          TypeVariable,
          Executable,
          AnnotatedType,
          GenericDeclaration,
          Member,
          Parameter,
          Constructor,
        };
      }

      namespace ref {
        const WeakReference: JavaClassStatics<{
          new <T>(arg0: T): WeakReference<T>;
          new <T>(arg0: T, arg1: ReferenceQueue<any>): WeakReference<T>;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }>;
        interface WeakReference<T> extends Reference<T> {}

        const ReferenceQueue: JavaClassStatics<{
          new <T>(): ReferenceQueue<T>;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }>;
        interface ReferenceQueue<T> extends JavaObject {
          poll(): Reference<any>;
          remove(arg0: number): Reference<any>;
          remove(): Reference<any>;
        }

        const Reference: JavaClassStatics<false> & {
          reachabilityFence(arg0: any): void;
        };
        interface Reference<T> extends JavaObject {
          get(): T;
          refersTo(arg0: T): boolean;
          clear(): void;
          /** @deprecated */
          isEnqueued(): boolean;
          enqueue(): boolean;
        }

        export { WeakReference, ReferenceQueue, Reference };
      }

      namespace constant {
        const Constable: JavaInterfaceStatics;
        interface Constable extends JavaObject {
          describeConstable(): java.util.Optional<any>;
        }

        const ConstantDesc: JavaInterfaceStatics;
        interface ConstantDesc extends JavaObject {
          resolveConstantDesc(arg0: java.lang.invoke.MethodHandles$Lookup): any;
        }

        const ClassDesc: JavaInterfaceStatics & {
          of(arg0: string): ClassDesc;
          of(arg0: string, arg1: string): ClassDesc;
          ofDescriptor(arg0: string): ClassDesc;
        };
        interface ClassDesc
          extends ConstantDesc,
            java.lang.invoke.TypeDescriptor$OfField<ClassDesc> {
          arrayType(): ClassDesc;
          arrayType(arg0: number): ClassDesc;
          nested(arg0: string): ClassDesc;
          nested(arg0: string, ...arg1: string[]): ClassDesc;
          isArray(): boolean;
          isPrimitive(): boolean;
          isClassOrInterface(): boolean;
          componentType(): ClassDesc;
          packageName(): string;
          displayName(): string;
          descriptorString(): string;
        }

        const DynamicConstantDesc: JavaClassStatics<false> & {
          ofCanonical<T>(
            arg0: DirectMethodHandleDesc,
            arg1: string,
            arg2: ClassDesc,
            arg3: ConstantDesc[]
          ): ConstantDesc;
          ofNamed<T>(
            arg0: DirectMethodHandleDesc,
            arg1: string,
            arg2: ClassDesc,
            ...arg3: ConstantDesc[]
          ): DynamicConstantDesc<T>;
          of<T>(
            arg0: DirectMethodHandleDesc,
            ...arg1: ConstantDesc[]
          ): DynamicConstantDesc<T>;
          of<T>(arg0: DirectMethodHandleDesc): DynamicConstantDesc<T>;
        };
        interface DynamicConstantDesc<T> extends ConstantDesc {
          constantName(): string;
          constantType(): ClassDesc;
          bootstrapMethod(): DirectMethodHandleDesc;
          bootstrapArgs(): ConstantDesc[];
          bootstrapArgsList(): JavaList<ConstantDesc>;
          resolveConstantDesc(arg0: java.lang.invoke.MethodHandles$Lookup): T;
        }

        const DirectMethodHandleDesc: JavaInterfaceStatics;
        interface DirectMethodHandleDesc extends MethodHandleDesc {
          kind(): DirectMethodHandleDesc$Kind;
          refKind(): number;
          isOwnerInterface(): boolean;
          owner(): ClassDesc;
          methodName(): string;
          lookupDescriptor(): string;
        }

        const MethodHandleDesc: JavaInterfaceStatics & {
          of(
            arg0: DirectMethodHandleDesc$Kind,
            arg1: ClassDesc,
            arg2: string,
            arg3: string
          ): DirectMethodHandleDesc;
          ofMethod(
            arg0: DirectMethodHandleDesc$Kind,
            arg1: ClassDesc,
            arg2: string,
            arg3: MethodTypeDesc
          ): DirectMethodHandleDesc;
          ofField(
            arg0: DirectMethodHandleDesc$Kind,
            arg1: ClassDesc,
            arg2: string,
            arg3: ClassDesc
          ): DirectMethodHandleDesc;
          ofConstructor(
            arg0: ClassDesc,
            ...arg1: ClassDesc[]
          ): DirectMethodHandleDesc;
        };
        interface MethodHandleDesc extends ConstantDesc {
          asType(arg0: MethodTypeDesc): MethodHandleDesc;
          invocationType(): MethodTypeDesc;
        }

        const DirectMethodHandleDesc$Kind: JavaClassStatics<false> & {
          readonly STATIC: DirectMethodHandleDesc$Kind;
          readonly INTERFACE_STATIC: DirectMethodHandleDesc$Kind;
          readonly VIRTUAL: DirectMethodHandleDesc$Kind;
          readonly INTERFACE_VIRTUAL: DirectMethodHandleDesc$Kind;
          readonly SPECIAL: DirectMethodHandleDesc$Kind;
          readonly INTERFACE_SPECIAL: DirectMethodHandleDesc$Kind;
          readonly CONSTRUCTOR: DirectMethodHandleDesc$Kind;
          readonly GETTER: DirectMethodHandleDesc$Kind;
          readonly SETTER: DirectMethodHandleDesc$Kind;
          readonly STATIC_GETTER: DirectMethodHandleDesc$Kind;
          readonly STATIC_SETTER: DirectMethodHandleDesc$Kind;

          values(): DirectMethodHandleDesc$Kind[];
          valueOf(arg0: string): DirectMethodHandleDesc$Kind;
          valueOf(arg0: number): DirectMethodHandleDesc$Kind;
          valueOf(arg0: number, arg1: boolean): DirectMethodHandleDesc$Kind;
        };
        interface DirectMethodHandleDesc$Kind
          extends java.lang.Enum<DirectMethodHandleDesc$Kind> {
          readonly refKind: number;
          readonly isInterface: boolean;
        }

        const MethodTypeDesc: JavaInterfaceStatics & {
          ofDescriptor(arg0: string): MethodTypeDesc;
          of(arg0: ClassDesc, ...arg1: ClassDesc[]): MethodTypeDesc;
        };
        interface MethodTypeDesc
          extends ConstantDesc,
            java.lang.invoke.TypeDescriptor$OfMethod<
              ClassDesc,
              MethodTypeDesc
            > {
          returnType(): ClassDesc;
          parameterCount(): number;
          parameterType(arg0: number): ClassDesc;
          parameterList(): JavaList<ClassDesc>;
          parameterArray(): ClassDesc[];
          changeReturnType(arg0: ClassDesc): MethodTypeDesc;
          changeParameterType(arg0: number, arg1: ClassDesc): MethodTypeDesc;
          dropParameterTypes(arg0: number, arg1: number): MethodTypeDesc;
          insertParameterTypes(
            arg0: number,
            ...arg1: ClassDesc[]
          ): MethodTypeDesc;
          descriptorString(): string;
          displayDescriptor(): string;
        }

        export {
          Constable,
          ConstantDesc,
          ClassDesc,
          DynamicConstantDesc,
          DirectMethodHandleDesc,
          MethodHandleDesc,
          DirectMethodHandleDesc$Kind,
          MethodTypeDesc,
        };
      }

      namespace annotation {
        const Annotation: JavaInterfaceStatics;
        interface Annotation extends JavaObject {
          annotationType(): JavaClass<any>;
        }

        export { Annotation };
      }

      namespace invoke {
        const TypeDescriptor$OfField: JavaInterfaceStatics;
        interface TypeDescriptor$OfField<F extends TypeDescriptor$OfField<F>>
          extends TypeDescriptor {
          isArray(): boolean;
          isPrimitive(): boolean;
          componentType(): F;
          arrayType(): F;
        }

        const MethodHandles$Lookup: JavaClassStatics<false> & {
          readonly PUBLIC: number;
          readonly PRIVATE: number;
          readonly PROTECTED: number;
          readonly PACKAGE: number;
          readonly MODULE: number;
          readonly UNCONDITIONAL: number;
          readonly ORIGINAL: number;
        };
        interface MethodHandles$Lookup extends JavaObject {
          lookupClass(): JavaClass<any>;
          previousLookupClass(): JavaClass<any>;
          lookupModes(): number;
          in(arg0: JavaClass<any>): MethodHandles$Lookup;
          dropLookupMode(arg0: number): MethodHandles$Lookup;
          defineClass(arg0: number[]): JavaClass<any>;
          defineHiddenClass(
            arg0: number[],
            arg1: boolean,
            ...arg2: MethodHandles$Lookup$ClassOption[]
          ): MethodHandles$Lookup;
          defineHiddenClassWithClassData(
            arg0: number[],
            arg1: any,
            arg2: boolean,
            ...arg3: MethodHandles$Lookup$ClassOption[]
          ): MethodHandles$Lookup;
          findStatic(
            arg0: JavaClass<any>,
            arg1: string,
            arg2: MethodType
          ): MethodHandle;
          findVirtual(
            arg0: JavaClass<any>,
            arg1: string,
            arg2: MethodType
          ): MethodHandle;
          findConstructor(arg0: JavaClass<any>, arg1: MethodType): MethodHandle;
          findClass(arg0: string): JavaClass<any>;
          ensureInitialized(arg0: JavaClass<any>): JavaClass<any>;
          accessClass(arg0: JavaClass<any>): JavaClass<any>;
          findSpecial(
            arg0: JavaClass<any>,
            arg1: string,
            arg2: MethodType,
            arg3: JavaClass<any>
          ): MethodHandle;
          findGetter(
            arg0: JavaClass<any>,
            arg1: string,
            arg2: JavaClass<any>
          ): MethodHandle;
          findSetter(
            arg0: JavaClass<any>,
            arg1: string,
            arg2: JavaClass<any>
          ): MethodHandle;
          findVarHandle(
            arg0: JavaClass<any>,
            arg1: string,
            arg2: JavaClass<any>
          ): VarHandle;
          findStaticGetter(
            arg0: JavaClass<any>,
            arg1: string,
            arg2: JavaClass<any>
          ): MethodHandle;
          findStaticSetter(
            arg0: JavaClass<any>,
            arg1: string,
            arg2: JavaClass<any>
          ): MethodHandle;
          findStaticVarHandle(
            arg0: JavaClass<any>,
            arg1: string,
            arg2: JavaClass<any>
          ): VarHandle;
          bind(arg0: any, arg1: string, arg2: MethodType): MethodHandle;
          unreflect(arg0: java.lang.reflect.Method): MethodHandle;
          unreflectSpecial(
            arg0: java.lang.reflect.Method,
            arg1: JavaClass<any>
          ): MethodHandle;
          unreflectConstructor(
            arg0: java.lang.reflect.Constructor<any>
          ): MethodHandle;
          unreflectGetter(arg0: java.lang.reflect.Field): MethodHandle;
          unreflectSetter(arg0: java.lang.reflect.Field): MethodHandle;
          unreflectVarHandle(arg0: java.lang.reflect.Field): VarHandle;
          revealDirect(arg0: MethodHandle): MethodHandleInfo;
          /** @deprecated */
          hasPrivateAccess(): boolean;
          hasFullPrivilegeAccess(): boolean;
        }

        const TypeDescriptor$OfMethod: JavaInterfaceStatics;
        interface TypeDescriptor$OfMethod<
          F extends TypeDescriptor$OfField<F>,
          M extends TypeDescriptor$OfMethod<F, M>
        > extends TypeDescriptor {
          parameterCount(): number;
          parameterType(arg0: number): F;
          returnType(): F;
          parameterArray(): F[];
          parameterList(): JavaList<F>;
          changeReturnType(arg0: F): M;
          changeParameterType(arg0: number, arg1: F): M;
          dropParameterTypes(arg0: number, arg1: number): M;
          insertParameterTypes(arg0: number, ...arg1: F[]): M;
        }

        const TypeDescriptor: JavaInterfaceStatics;
        interface TypeDescriptor extends JavaObject {
          descriptorString(): string;
        }

        const MethodHandles$Lookup$ClassOption: JavaClassStatics<false> & {
          readonly NESTMATE: MethodHandles$Lookup$ClassOption;
          readonly STRONG: MethodHandles$Lookup$ClassOption;

          values(): MethodHandles$Lookup$ClassOption[];
          valueOf(arg0: string): MethodHandles$Lookup$ClassOption;
        };
        interface MethodHandles$Lookup$ClassOption
          extends java.lang.Enum<MethodHandles$Lookup$ClassOption> {}

        const MethodHandleInfo: JavaInterfaceStatics & {
          readonly REF_getField: number;
          readonly REF_getStatic: number;
          readonly REF_putField: number;
          readonly REF_putStatic: number;
          readonly REF_invokeVirtual: number;
          readonly REF_invokeStatic: number;
          readonly REF_invokeSpecial: number;
          readonly REF_newInvokeSpecial: number;
          readonly REF_invokeInterface: number;

          referenceKindToString(arg0: number): string;
          toString(
            arg0: number,
            arg1: JavaClass<any>,
            arg2: string,
            arg3: MethodType
          ): string;
        };
        interface MethodHandleInfo extends JavaObject {
          getReferenceKind(): number;
          getDeclaringClass(): JavaClass<any>;
          getName(): string;
          getMethodType(): MethodType;
          reflectAs<T>(arg0: JavaClass<T>, arg1: MethodHandles$Lookup): T;
          getModifiers(): number;
          isVarArgs(): boolean;
        }

        const MethodHandle: JavaClassStatics<false>;
        interface MethodHandle extends java.lang.constant.Constable {
          type(): MethodType;
          invokeExact(...arg0: any[]): any;
          invoke(...arg0: any[]): any;
          invokeWithArguments(...arg0: any[]): any;
          invokeWithArguments(arg0: JavaList<any>): any;
          asType(arg0: MethodType): MethodHandle;
          asSpreader(arg0: JavaClass<any>, arg1: number): MethodHandle;
          asSpreader(
            arg0: number,
            arg1: JavaClass<any>,
            arg2: number
          ): MethodHandle;
          withVarargs(arg0: boolean): MethodHandle;
          asCollector(arg0: JavaClass<any>, arg1: number): MethodHandle;
          asCollector(
            arg0: number,
            arg1: JavaClass<any>,
            arg2: number
          ): MethodHandle;
          asVarargsCollector(arg0: JavaClass<any>): MethodHandle;
          isVarargsCollector(): boolean;
          asFixedArity(): MethodHandle;
          bindTo(arg0: any): MethodHandle;
          describeConstable(): java.util.Optional<java.lang.constant.MethodHandleDesc>;
        }

        const VarHandle: JavaClassStatics<false> & {
          fullFence(): void;
          acquireFence(): void;
          releaseFence(): void;
          loadLoadFence(): void;
          storeStoreFence(): void;
        };
        interface VarHandle extends java.lang.constant.Constable {
          hasInvokeExactBehavior(): boolean;
          get(...arg0: any[]): any;
          set(...arg0: any[]): void;
          getVolatile(...arg0: any[]): any;
          setVolatile(...arg0: any[]): void;
          getOpaque(...arg0: any[]): any;
          setOpaque(...arg0: any[]): void;
          getAcquire(...arg0: any[]): any;
          setRelease(...arg0: any[]): void;
          compareAndSet(...arg0: any[]): boolean;
          compareAndExchange(...arg0: any[]): any;
          compareAndExchangeAcquire(...arg0: any[]): any;
          compareAndExchangeRelease(...arg0: any[]): any;
          weakCompareAndSetPlain(...arg0: any[]): boolean;
          weakCompareAndSet(...arg0: any[]): boolean;
          weakCompareAndSetAcquire(...arg0: any[]): boolean;
          weakCompareAndSetRelease(...arg0: any[]): boolean;
          getAndSet(...arg0: any[]): any;
          getAndSetAcquire(...arg0: any[]): any;
          getAndSetRelease(...arg0: any[]): any;
          getAndAdd(...arg0: any[]): any;
          getAndAddAcquire(...arg0: any[]): any;
          getAndAddRelease(...arg0: any[]): any;
          getAndBitwiseOr(...arg0: any[]): any;
          getAndBitwiseOrAcquire(...arg0: any[]): any;
          getAndBitwiseOrRelease(...arg0: any[]): any;
          getAndBitwiseAnd(...arg0: any[]): any;
          getAndBitwiseAndAcquire(...arg0: any[]): any;
          getAndBitwiseAndRelease(...arg0: any[]): any;
          getAndBitwiseXor(...arg0: any[]): any;
          getAndBitwiseXorAcquire(...arg0: any[]): any;
          getAndBitwiseXorRelease(...arg0: any[]): any;
          withInvokeExactBehavior(): VarHandle;
          withInvokeBehavior(): VarHandle;
          varType(): JavaClass<any>;
          coordinateTypes(): JavaList<JavaClass<any>>;
          accessModeType(arg0: VarHandle$AccessMode): MethodType;
          isAccessModeSupported(arg0: VarHandle$AccessMode): boolean;
          toMethodHandle(arg0: VarHandle$AccessMode): MethodHandle;
          describeConstable(): java.util.Optional<VarHandle$VarHandleDesc>;
        }

        const MethodType: JavaClassStatics<false> & {
          methodType(arg0: JavaClass<any>, arg1: JavaClass<any>[]): MethodType;
          methodType(
            arg0: JavaClass<any>,
            arg1: JavaList<JavaClass<any>>
          ): MethodType;
          methodType(
            arg0: JavaClass<any>,
            arg1: JavaClass<any>,
            ...arg2: JavaClass<any>[]
          ): MethodType;
          methodType(arg0: JavaClass<any>): MethodType;
          methodType(arg0: JavaClass<any>, arg1: JavaClass<any>): MethodType;
          methodType(arg0: JavaClass<any>, arg1: MethodType): MethodType;
          genericMethodType(arg0: number, arg1: boolean): MethodType;
          genericMethodType(arg0: number): MethodType;
          fromMethodDescriptorString(
            arg0: string,
            arg1: java.lang.ClassLoader
          ): MethodType;
        };
        interface MethodType
          extends java.lang.constant.Constable,
            TypeDescriptor$OfMethod<JavaClass<any>, MethodType>,
            java.io.Serializable {
          changeParameterType(arg0: number, arg1: JavaClass<any>): MethodType;
          insertParameterTypes(
            arg0: number,
            ...arg1: JavaClass<any>[]
          ): MethodType;
          appendParameterTypes(...arg0: JavaClass<any>[]): MethodType;
          insertParameterTypes(
            arg0: number,
            arg1: JavaList<JavaClass<any>>
          ): MethodType;
          appendParameterTypes(arg0: JavaList<JavaClass<any>>): MethodType;
          dropParameterTypes(arg0: number, arg1: number): MethodType;
          changeReturnType(arg0: JavaClass<any>): MethodType;
          hasPrimitives(): boolean;
          hasWrappers(): boolean;
          erase(): MethodType;
          generic(): MethodType;
          wrap(): MethodType;
          unwrap(): MethodType;
          parameterType(arg0: number): JavaClass<any>;
          parameterCount(): number;
          returnType(): JavaClass<any>;
          parameterList(): JavaList<JavaClass<any>>;
          lastParameterType(): JavaClass<any>;
          parameterArray(): JavaClass<any>[];
          toMethodDescriptorString(): string;
          descriptorString(): string;
          describeConstable(): java.util.Optional<java.lang.constant.MethodTypeDesc>;
        }

        const VarHandle$AccessMode: JavaClassStatics<false> & {
          readonly GET: VarHandle$AccessMode;
          readonly SET: VarHandle$AccessMode;
          readonly GET_VOLATILE: VarHandle$AccessMode;
          readonly SET_VOLATILE: VarHandle$AccessMode;
          readonly GET_ACQUIRE: VarHandle$AccessMode;
          readonly SET_RELEASE: VarHandle$AccessMode;
          readonly GET_OPAQUE: VarHandle$AccessMode;
          readonly SET_OPAQUE: VarHandle$AccessMode;
          readonly COMPARE_AND_SET: VarHandle$AccessMode;
          readonly COMPARE_AND_EXCHANGE: VarHandle$AccessMode;
          readonly COMPARE_AND_EXCHANGE_ACQUIRE: VarHandle$AccessMode;
          readonly COMPARE_AND_EXCHANGE_RELEASE: VarHandle$AccessMode;
          readonly WEAK_COMPARE_AND_SET_PLAIN: VarHandle$AccessMode;
          readonly WEAK_COMPARE_AND_SET: VarHandle$AccessMode;
          readonly WEAK_COMPARE_AND_SET_ACQUIRE: VarHandle$AccessMode;
          readonly WEAK_COMPARE_AND_SET_RELEASE: VarHandle$AccessMode;
          readonly GET_AND_SET: VarHandle$AccessMode;
          readonly GET_AND_SET_ACQUIRE: VarHandle$AccessMode;
          readonly GET_AND_SET_RELEASE: VarHandle$AccessMode;
          readonly GET_AND_ADD: VarHandle$AccessMode;
          readonly GET_AND_ADD_ACQUIRE: VarHandle$AccessMode;
          readonly GET_AND_ADD_RELEASE: VarHandle$AccessMode;
          readonly GET_AND_BITWISE_OR: VarHandle$AccessMode;
          readonly GET_AND_BITWISE_OR_RELEASE: VarHandle$AccessMode;
          readonly GET_AND_BITWISE_OR_ACQUIRE: VarHandle$AccessMode;
          readonly GET_AND_BITWISE_AND: VarHandle$AccessMode;
          readonly GET_AND_BITWISE_AND_RELEASE: VarHandle$AccessMode;
          readonly GET_AND_BITWISE_AND_ACQUIRE: VarHandle$AccessMode;
          readonly GET_AND_BITWISE_XOR: VarHandle$AccessMode;
          readonly GET_AND_BITWISE_XOR_RELEASE: VarHandle$AccessMode;
          readonly GET_AND_BITWISE_XOR_ACQUIRE: VarHandle$AccessMode;

          values(): VarHandle$AccessMode[];
          valueOf(arg0: string): VarHandle$AccessMode;
          valueFromMethodName(arg0: string): VarHandle$AccessMode;
        };
        interface VarHandle$AccessMode
          extends java.lang.Enum<VarHandle$AccessMode> {
          methodName(): string;
        }

        const VarHandle$VarHandleDesc: JavaClassStatics<false> & {
          ofField(
            arg0: java.lang.constant.ClassDesc,
            arg1: string,
            arg2: java.lang.constant.ClassDesc
          ): VarHandle$VarHandleDesc;
          ofStaticField(
            arg0: java.lang.constant.ClassDesc,
            arg1: string,
            arg2: java.lang.constant.ClassDesc
          ): VarHandle$VarHandleDesc;
          ofArray(arg0: java.lang.constant.ClassDesc): VarHandle$VarHandleDesc;
        };
        interface VarHandle$VarHandleDesc
          extends java.lang.constant.DynamicConstantDesc<VarHandle> {
          varType(): java.lang.constant.ClassDesc;
          resolveConstantDesc(arg0: MethodHandles$Lookup): VarHandle;
        }

        export {
          TypeDescriptor$OfField,
          MethodHandles$Lookup,
          TypeDescriptor$OfMethod,
          TypeDescriptor,
          MethodHandles$Lookup$ClassOption,
          MethodHandleInfo,
          MethodHandle,
          VarHandle,
          MethodType,
          VarHandle$AccessMode,
          VarHandle$VarHandleDesc,
        };
      }

      namespace module {
        const ModuleDescriptor: JavaClassStatics<false> & {
          newModule(
            arg0: string,
            arg1: JavaSet<ModuleDescriptor$Modifier>
          ): ModuleDescriptor$Builder;
          newModule(arg0: string): ModuleDescriptor$Builder;
          newOpenModule(arg0: string): ModuleDescriptor$Builder;
          newAutomaticModule(arg0: string): ModuleDescriptor$Builder;
          read(
            arg0: java.io.InputStream,
            arg1: java.util.function.Supplier<JavaSet<string>>
          ): ModuleDescriptor;
          read(arg0: java.io.InputStream): ModuleDescriptor;
          read(
            arg0: java.nio.ByteBuffer,
            arg1: java.util.function.Supplier<JavaSet<string>>
          ): ModuleDescriptor;
          read(arg0: java.nio.ByteBuffer): ModuleDescriptor;
        };
        interface ModuleDescriptor
          extends java.lang.Comparable<ModuleDescriptor> {
          name(): string;
          modifiers(): JavaSet<ModuleDescriptor$Modifier>;
          isOpen(): boolean;
          isAutomatic(): boolean;
          requires(): JavaSet<ModuleDescriptor$Requires>;
          exports(): JavaSet<ModuleDescriptor$Exports>;
          opens(): JavaSet<ModuleDescriptor$Opens>;
          uses(): JavaSet<string>;
          provides(): JavaSet<ModuleDescriptor$Provides>;
          version(): java.util.Optional<ModuleDescriptor$Version>;
          rawVersion(): java.util.Optional<string>;
          toNameAndVersion(): string;
          mainClass(): java.util.Optional<string>;
          packages(): JavaSet<string>;
          compareTo(arg0: ModuleDescriptor): number;
        }

        const ModuleDescriptor$Provides: JavaClassStatics<false>;
        interface ModuleDescriptor$Provides
          extends java.lang.Comparable<ModuleDescriptor$Provides> {
          service(): string;
          providers(): JavaList<string>;
          compareTo(arg0: ModuleDescriptor$Provides): number;
        }

        const ModuleDescriptor$Version: JavaClassStatics<false> & {
          parse(arg0: string): ModuleDescriptor$Version;
        };
        interface ModuleDescriptor$Version
          extends java.lang.Comparable<ModuleDescriptor$Version> {
          compareTo(arg0: ModuleDescriptor$Version): number;
        }

        const ModuleDescriptor$Modifier: JavaClassStatics<false> & {
          readonly OPEN: ModuleDescriptor$Modifier;
          readonly AUTOMATIC: ModuleDescriptor$Modifier;
          readonly SYNTHETIC: ModuleDescriptor$Modifier;
          readonly MANDATED: ModuleDescriptor$Modifier;

          values(): ModuleDescriptor$Modifier[];
          valueOf(arg0: string): ModuleDescriptor$Modifier;
        };
        interface ModuleDescriptor$Modifier
          extends java.lang.Enum<ModuleDescriptor$Modifier> {}

        const ModuleDescriptor$Builder: JavaClassStatics<false>;
        interface ModuleDescriptor$Builder extends JavaObject {
          requires(arg0: ModuleDescriptor$Requires): ModuleDescriptor$Builder;
          requires(
            arg0: JavaSet<ModuleDescriptor$Requires$Modifier>,
            arg1: string,
            arg2: ModuleDescriptor$Version
          ): ModuleDescriptor$Builder;
          requires(
            arg0: JavaSet<ModuleDescriptor$Requires$Modifier>,
            arg1: string
          ): ModuleDescriptor$Builder;
          requires(arg0: string): ModuleDescriptor$Builder;
          exports(arg0: ModuleDescriptor$Exports): ModuleDescriptor$Builder;
          exports(
            arg0: JavaSet<ModuleDescriptor$Exports$Modifier>,
            arg1: string,
            arg2: JavaSet<string>
          ): ModuleDescriptor$Builder;
          exports(
            arg0: JavaSet<ModuleDescriptor$Exports$Modifier>,
            arg1: string
          ): ModuleDescriptor$Builder;
          exports(
            arg0: string,
            arg1: JavaSet<string>
          ): ModuleDescriptor$Builder;
          exports(arg0: string): ModuleDescriptor$Builder;
          opens(arg0: ModuleDescriptor$Opens): ModuleDescriptor$Builder;
          opens(
            arg0: JavaSet<ModuleDescriptor$Opens$Modifier>,
            arg1: string,
            arg2: JavaSet<string>
          ): ModuleDescriptor$Builder;
          opens(
            arg0: JavaSet<ModuleDescriptor$Opens$Modifier>,
            arg1: string
          ): ModuleDescriptor$Builder;
          opens(arg0: string, arg1: JavaSet<string>): ModuleDescriptor$Builder;
          opens(arg0: string): ModuleDescriptor$Builder;
          uses(arg0: string): ModuleDescriptor$Builder;
          provides(arg0: ModuleDescriptor$Provides): ModuleDescriptor$Builder;
          provides(
            arg0: string,
            arg1: JavaList<string>
          ): ModuleDescriptor$Builder;
          packages(arg0: JavaSet<string>): ModuleDescriptor$Builder;
          version(arg0: ModuleDescriptor$Version): ModuleDescriptor$Builder;
          version(arg0: string): ModuleDescriptor$Builder;
          mainClass(arg0: string): ModuleDescriptor$Builder;
          build(): ModuleDescriptor;
        }

        const ModuleDescriptor$Exports: JavaClassStatics<false>;
        interface ModuleDescriptor$Exports
          extends java.lang.Comparable<ModuleDescriptor$Exports> {
          modifiers(): JavaSet<ModuleDescriptor$Exports$Modifier>;
          isQualified(): boolean;
          source(): string;
          targets(): JavaSet<string>;
          compareTo(arg0: ModuleDescriptor$Exports): number;
        }

        const ModuleDescriptor$Opens: JavaClassStatics<false>;
        interface ModuleDescriptor$Opens
          extends java.lang.Comparable<ModuleDescriptor$Opens> {
          modifiers(): JavaSet<ModuleDescriptor$Opens$Modifier>;
          isQualified(): boolean;
          source(): string;
          targets(): JavaSet<string>;
          compareTo(arg0: ModuleDescriptor$Opens): number;
        }

        const ModuleDescriptor$Requires: JavaClassStatics<false>;
        interface ModuleDescriptor$Requires
          extends java.lang.Comparable<ModuleDescriptor$Requires> {
          modifiers(): JavaSet<ModuleDescriptor$Requires$Modifier>;
          name(): string;
          compiledVersion(): java.util.Optional<ModuleDescriptor$Version>;
          rawCompiledVersion(): java.util.Optional<string>;
          compareTo(arg0: ModuleDescriptor$Requires): number;
        }

        const ModuleDescriptor$Exports$Modifier: JavaClassStatics<false> & {
          readonly SYNTHETIC: ModuleDescriptor$Exports$Modifier;
          readonly MANDATED: ModuleDescriptor$Exports$Modifier;

          values(): ModuleDescriptor$Exports$Modifier[];
          valueOf(arg0: string): ModuleDescriptor$Exports$Modifier;
        };
        interface ModuleDescriptor$Exports$Modifier
          extends java.lang.Enum<ModuleDescriptor$Exports$Modifier> {}

        const ModuleDescriptor$Opens$Modifier: JavaClassStatics<false> & {
          readonly SYNTHETIC: ModuleDescriptor$Opens$Modifier;
          readonly MANDATED: ModuleDescriptor$Opens$Modifier;

          values(): ModuleDescriptor$Opens$Modifier[];
          valueOf(arg0: string): ModuleDescriptor$Opens$Modifier;
        };
        interface ModuleDescriptor$Opens$Modifier
          extends java.lang.Enum<ModuleDescriptor$Opens$Modifier> {}

        const ModuleDescriptor$Requires$Modifier: JavaClassStatics<false> & {
          readonly TRANSITIVE: ModuleDescriptor$Requires$Modifier;
          readonly STATIC: ModuleDescriptor$Requires$Modifier;
          readonly SYNTHETIC: ModuleDescriptor$Requires$Modifier;
          readonly MANDATED: ModuleDescriptor$Requires$Modifier;

          values(): ModuleDescriptor$Requires$Modifier[];
          valueOf(arg0: string): ModuleDescriptor$Requires$Modifier;
        };
        interface ModuleDescriptor$Requires$Modifier
          extends java.lang.Enum<ModuleDescriptor$Requires$Modifier> {}

        const Configuration: JavaClassStatics<false> & {
          resolve(
            arg0: ModuleFinder,
            arg1: JavaList<Configuration>,
            arg2: ModuleFinder,
            arg3: JavaCollection<string>
          ): Configuration;
          resolveAndBind(
            arg0: ModuleFinder,
            arg1: JavaList<Configuration>,
            arg2: ModuleFinder,
            arg3: JavaCollection<string>
          ): Configuration;
          empty(): Configuration;
        };
        interface Configuration extends JavaObject {
          resolve(
            arg0: ModuleFinder,
            arg1: ModuleFinder,
            arg2: JavaCollection<string>
          ): Configuration;
          resolveAndBind(
            arg0: ModuleFinder,
            arg1: ModuleFinder,
            arg2: JavaCollection<string>
          ): Configuration;
          parents(): JavaList<Configuration>;
          modules(): JavaSet<ResolvedModule>;
          findModule(arg0: string): java.util.Optional<ResolvedModule>;
        }

        const ResolvedModule: JavaClassStatics<false>;
        interface ResolvedModule extends JavaObject {
          configuration(): Configuration;
          reference(): ModuleReference;
          name(): string;
          reads(): JavaSet<ResolvedModule>;
        }

        const ModuleFinder: JavaInterfaceStatics & {
          ofSystem(): ModuleFinder;
          of(...arg0: java.nio.file.Path[]): ModuleFinder;
          compose(...arg0: ModuleFinder[]): ModuleFinder;
        };
        interface ModuleFinder extends JavaObject {
          find(arg0: string): java.util.Optional<ModuleReference>;
          findAll(): JavaSet<ModuleReference>;
        }

        const ModuleReference: JavaClassStatics<false>;
        interface ModuleReference extends JavaObject {
          descriptor(): ModuleDescriptor;
          location(): java.util.Optional<java.net.URI>;
          open(): ModuleReader;
        }

        const ModuleReader: JavaInterfaceStatics;
        interface ModuleReader extends java.io.Closeable {
          find(arg0: string): java.util.Optional<java.net.URI>;
          open(arg0: string): java.util.Optional<java.io.InputStream>;
          read(arg0: string): java.util.Optional<java.nio.ByteBuffer>;
          release(arg0: java.nio.ByteBuffer): void;
          list(): java.util.stream.Stream<string>;
          close(): void;
        }

        export {
          ModuleDescriptor,
          ModuleDescriptor$Provides,
          ModuleDescriptor$Version,
          ModuleDescriptor$Modifier,
          ModuleDescriptor$Builder,
          ModuleDescriptor$Exports,
          ModuleDescriptor$Opens,
          ModuleDescriptor$Requires,
          ModuleDescriptor$Exports$Modifier,
          ModuleDescriptor$Opens$Modifier,
          ModuleDescriptor$Requires$Modifier,
          Configuration,
          ResolvedModule,
          ModuleFinder,
          ModuleReference,
          ModuleReader,
        };
      }

      export {
        AutoCloseable,
        Comparable,
        Runnable,
        Thread,
        Number,
        Enum,
        ClassLoader,
        Enum$EnumDesc,
        ThreadGroup,
        Thread$UncaughtExceptionHandler,
        Thread$State,
        String,
        StringBuilder,
        Package,
        CharSequence,
        StringBuffer,
        Module,
        ModuleLayer,
        NamedPackage,
        AbstractStringBuilder,
        Appendable,
        ModuleLayer$Controller,
        Exception,
        Cloneable,
        Readable,
        Void,
        reflect,
        ref,
        constant,
        annotation,
        invoke,
        module,
      };
    }

    namespace util {
      const UUID: JavaClassStatics<[UUID], [arg0: number, arg1: number]> & {
        randomUUID(): UUID;
        nameUUIDFromBytes(arg0: number[]): UUID;
        fromString(arg0: string): UUID;
      };
      interface UUID extends java.io.Serializable, java.lang.Comparable<UUID> {
        getLeastSignificantBits(): number;
        getMostSignificantBits(): number;
        version(): number;
        variant(): number;
        timestamp(): number;
        clockSequence(): number;
        node(): number;
        compareTo(arg0: UUID): number;
      }

      const Optional: JavaClassStatics<false> & {
        empty<T>(): Optional<T>;
        of<T>(arg0: T): Optional<T>;
        ofNullable<T>(arg0: T): Optional<T>;
      };
      interface Optional<T> extends JavaObject {
        get(): T;
        isPresent(): boolean;
        isEmpty(): boolean;
        ifPresent(arg0: java.util.function.Consumer<any>): void;
        ifPresentOrElse(
          arg0: java.util.function.Consumer<any>,
          arg1: java.lang.Runnable
        ): void;
        filter(arg0: java.util.function.Predicate<any>): Optional<T>;
        map<U>(arg0: java.util.function.Function<any, any>): Optional<U>;
        flatMap<U>(arg0: java.util.function.Function<any, any>): Optional<U>;
        or(arg0: java.util.function.Supplier<any>): Optional<T>;
        stream(): java.util.stream.Stream<T>;
        orElse(arg0: T): T;
        orElseGet(arg0: java.util.function.Supplier<any>): T;
        orElseThrow(): T;
        orElseThrow<X>(arg0: java.util.function.Supplier<any>): T;
      }

      const Locale: JavaClassStatics<{
        new (arg0: string, arg1: string, arg2: string): Locale;
        new (arg0: string, arg1: string): Locale;
        new (arg0: string): Locale;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        readonly ENGLISH: Locale;
        readonly FRENCH: Locale;
        readonly GERMAN: Locale;
        readonly ITALIAN: Locale;
        readonly JAPANESE: Locale;
        readonly KOREAN: Locale;
        readonly CHINESE: Locale;
        readonly SIMPLIFIED_CHINESE: Locale;
        readonly TRADITIONAL_CHINESE: Locale;
        readonly FRANCE: Locale;
        readonly GERMANY: Locale;
        readonly ITALY: Locale;
        readonly JAPAN: Locale;
        readonly KOREA: Locale;
        readonly UK: Locale;
        readonly US: Locale;
        readonly CANADA: Locale;
        readonly CANADA_FRENCH: Locale;
        readonly ROOT: Locale;
        readonly CHINA: Locale;
        readonly PRC: Locale;
        readonly TAIWAN: Locale;
        readonly PRIVATE_USE_EXTENSION: number;
        readonly UNICODE_LOCALE_EXTENSION: number;

        getDefault(): Locale;
        getDefault(arg0: Locale$Category): Locale;
        setDefault(arg0: Locale): void;
        setDefault(arg0: Locale$Category, arg1: Locale): void;
        getAvailableLocales(): Locale[];
        getISOCountries(): string[];
        getISOCountries(arg0: Locale$IsoCountryCode): JavaSet<string>;
        getISOLanguages(): string[];
        forLanguageTag(arg0: string): Locale;
        filter(
          arg0: JavaList<Locale$LanguageRange>,
          arg1: JavaCollection<Locale>,
          arg2: Locale$FilteringMode
        ): JavaList<Locale>;
        filter(
          arg0: JavaList<Locale$LanguageRange>,
          arg1: JavaCollection<Locale>
        ): JavaList<Locale>;
        filterTags(
          arg0: JavaList<Locale$LanguageRange>,
          arg1: JavaCollection<string>,
          arg2: Locale$FilteringMode
        ): JavaList<string>;
        filterTags(
          arg0: JavaList<Locale$LanguageRange>,
          arg1: JavaCollection<string>
        ): JavaList<string>;
        lookup(
          arg0: JavaList<Locale$LanguageRange>,
          arg1: JavaCollection<Locale>
        ): Locale;
        lookupTag(
          arg0: JavaList<Locale$LanguageRange>,
          arg1: JavaCollection<string>
        ): string;
      };
      interface Locale extends java.lang.Cloneable, java.io.Serializable {
        getLanguage(): string;
        getScript(): string;
        getCountry(): string;
        getVariant(): string;
        hasExtensions(): boolean;
        stripExtensions(): Locale;
        getExtension(arg0: number): string;
        getExtensionKeys(): JavaSet<number>;
        getUnicodeLocaleAttributes(): JavaSet<string>;
        getUnicodeLocaleType(arg0: string): string;
        getUnicodeLocaleKeys(): JavaSet<string>;
        toLanguageTag(): string;
        getISO3Language(): string;
        getISO3Country(): string;
        getDisplayLanguage(): string;
        getDisplayLanguage(arg0: Locale): string;
        getDisplayScript(): string;
        getDisplayScript(arg0: Locale): string;
        getDisplayCountry(): string;
        getDisplayCountry(arg0: Locale): string;
        getDisplayVariant(): string;
        getDisplayVariant(arg0: Locale): string;
        getDisplayName(): string;
        getDisplayName(arg0: Locale): string;
        clone(): any;
      }

      const EventObject: JavaClassStatics<[EventObject], [arg0: any]>;
      interface EventObject extends java.io.Serializable {
        getSource(): any;
      }

      const Iterator: JavaInterfaceStatics;
      interface Iterator<E> extends JavaObject {
        hasNext(): boolean;
        next(): E;
        remove(): void;
        forEachRemaining(arg0: java.util.function.Consumer<any>): void;
      }

      const Enumeration: JavaInterfaceStatics;
      interface Enumeration<E> extends JavaObject {
        hasMoreElements(): boolean;
        nextElement(): E;
        asIterator(): Iterator<E>;
      }

      const EventListener: JavaInterfaceStatics;
      interface EventListener extends JavaObject {}

      const Comparator: JavaInterfaceStatics & {
        reverseOrder<T>(): Comparator<T>;
        naturalOrder<T>(): Comparator<T>;
        nullsFirst<T>(arg0: Comparator<any>): Comparator<T>;
        nullsLast<T>(arg0: Comparator<any>): Comparator<T>;
        comparing<T, U>(
          arg0: java.util.function.Function<any, any>,
          arg1: Comparator<any>
        ): Comparator<T>;
        comparing<T, U>(
          arg0: java.util.function.Function<any, any>
        ): Comparator<T>;
        comparingInt<T>(
          arg0: java.util.function.ToIntFunction<any>
        ): Comparator<T>;
        comparingLong<T>(
          arg0: java.util.function.ToLongFunction<any>
        ): Comparator<T>;
        comparingDouble<T>(
          arg0: java.util.function.ToDoubleFunction<any>
        ): Comparator<T>;
      };
      interface Comparator<T> extends JavaObject {
        compare(arg0: T, arg1: T): number;
        reversed(): Comparator<T>;
        thenComparing(arg0: Comparator<any>): Comparator<T>;
        thenComparing<U>(
          arg0: java.util.function.Function<any, any>,
          arg1: Comparator<any>
        ): Comparator<T>;
        thenComparing<U>(
          arg0: java.util.function.Function<any, any>
        ): Comparator<T>;
        thenComparingInt(
          arg0: java.util.function.ToIntFunction<any>
        ): Comparator<T>;
        thenComparingLong(
          arg0: java.util.function.ToLongFunction<any>
        ): Comparator<T>;
        thenComparingDouble(
          arg0: java.util.function.ToDoubleFunction<any>
        ): Comparator<T>;
      }

      const OptionalInt: JavaClassStatics<false> & {
        empty(): OptionalInt;
        of(arg0: number): OptionalInt;
      };
      interface OptionalInt extends JavaObject {
        getAsInt(): number;
        isPresent(): boolean;
        isEmpty(): boolean;
        ifPresent(arg0: java.util.function.IntConsumer): void;
        ifPresentOrElse(
          arg0: java.util.function.IntConsumer,
          arg1: java.lang.Runnable
        ): void;
        stream(): java.util.stream.IntStream;
        orElse(arg0: number): number;
        orElseGet(arg0: java.util.function.IntSupplier): number;
        orElseThrow(): number;
        orElseThrow<X>(arg0: java.util.function.Supplier<any>): number;
      }

      const Spliterator$OfLong: JavaInterfaceStatics;
      interface Spliterator$OfLong
        extends Spliterator$OfPrimitive<
          number,
          java.util.function.LongConsumer,
          Spliterator$OfLong
        > {
        trySplit(): Spliterator$OfLong;
        tryAdvance(arg0: java.util.function.LongConsumer): boolean;
        forEachRemaining(arg0: java.util.function.LongConsumer): void;
        tryAdvance(arg0: java.util.function.Consumer<any>): boolean;
        forEachRemaining(arg0: java.util.function.Consumer<any>): void;
      }

      const Locale$IsoCountryCode: JavaClassStatics<false> & {
        readonly PART1_ALPHA2: Locale$IsoCountryCode;
        readonly PART1_ALPHA3: Locale$IsoCountryCode;
        readonly PART3: Locale$IsoCountryCode;

        values(): Locale$IsoCountryCode[];
        valueOf(arg0: string): Locale$IsoCountryCode;
      };
      interface Locale$IsoCountryCode
        extends java.lang.Enum<Locale$IsoCountryCode> {}

      const Spliterator$OfDouble: JavaInterfaceStatics;
      interface Spliterator$OfDouble
        extends Spliterator$OfPrimitive<
          number,
          java.util.function.DoubleConsumer,
          Spliterator$OfDouble
        > {
        trySplit(): Spliterator$OfDouble;
        tryAdvance(arg0: java.util.function.DoubleConsumer): boolean;
        forEachRemaining(arg0: java.util.function.DoubleConsumer): void;
        tryAdvance(arg0: java.util.function.Consumer<any>): boolean;
        forEachRemaining(arg0: java.util.function.Consumer<any>): void;
      }

      const IntSummaryStatistics: JavaClassStatics<{
        new (): IntSummaryStatistics;
        new (
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: number
        ): IntSummaryStatistics;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface IntSummaryStatistics extends java.util.function.IntConsumer {
        accept(arg0: number): void;
        combine(arg0: IntSummaryStatistics): void;
        getCount(): number;
        getSum(): number;
        getMin(): number;
        getMax(): number;
        getAverage(): number;
      }

      const Locale$Category: JavaClassStatics<false> & {
        readonly DISPLAY: Locale$Category;
        readonly FORMAT: Locale$Category;

        values(): Locale$Category[];
        valueOf(arg0: string): Locale$Category;
      };
      interface Locale$Category extends java.lang.Enum<Locale$Category> {}

      const DoubleSummaryStatistics: JavaClassStatics<{
        new (): DoubleSummaryStatistics;
        new (
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: number
        ): DoubleSummaryStatistics;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface DoubleSummaryStatistics
        extends java.util.function.DoubleConsumer {
        accept(arg0: number): void;
        combine(arg0: DoubleSummaryStatistics): void;
        getCount(): number;
        getSum(): number;
        getMin(): number;
        getMax(): number;
        getAverage(): number;
      }

      const Locale$FilteringMode: JavaClassStatics<false> & {
        readonly AUTOSELECT_FILTERING: Locale$FilteringMode;
        readonly EXTENDED_FILTERING: Locale$FilteringMode;
        readonly IGNORE_EXTENDED_RANGES: Locale$FilteringMode;
        readonly MAP_EXTENDED_RANGES: Locale$FilteringMode;
        readonly REJECT_EXTENDED_RANGES: Locale$FilteringMode;

        values(): Locale$FilteringMode[];
        valueOf(arg0: string): Locale$FilteringMode;
      };
      interface Locale$FilteringMode
        extends java.lang.Enum<Locale$FilteringMode> {}

      const PrimitiveIterator$OfDouble: JavaInterfaceStatics;
      interface PrimitiveIterator$OfDouble
        extends PrimitiveIterator<number, java.util.function.DoubleConsumer> {
        nextDouble(): number;
        forEachRemaining(arg0: java.util.function.DoubleConsumer): void;
        next(): number;
        forEachRemaining(arg0: java.util.function.Consumer<any>): void;
      }

      const Spliterator$OfInt: JavaInterfaceStatics;
      interface Spliterator$OfInt
        extends Spliterator$OfPrimitive<
          number,
          java.util.function.IntConsumer,
          Spliterator$OfInt
        > {
        trySplit(): Spliterator$OfInt;
        tryAdvance(arg0: java.util.function.IntConsumer): boolean;
        forEachRemaining(arg0: java.util.function.IntConsumer): void;
        tryAdvance(arg0: java.util.function.Consumer<any>): boolean;
        forEachRemaining(arg0: java.util.function.Consumer<any>): void;
      }

      const OptionalDouble: JavaClassStatics<false> & {
        empty(): OptionalDouble;
        of(arg0: number): OptionalDouble;
      };
      interface OptionalDouble extends JavaObject {
        getAsDouble(): number;
        isPresent(): boolean;
        isEmpty(): boolean;
        ifPresent(arg0: java.util.function.DoubleConsumer): void;
        ifPresentOrElse(
          arg0: java.util.function.DoubleConsumer,
          arg1: java.lang.Runnable
        ): void;
        stream(): java.util.stream.DoubleStream;
        orElse(arg0: number): number;
        orElseGet(arg0: java.util.function.DoubleSupplier): number;
        orElseThrow(): number;
        orElseThrow<X>(arg0: java.util.function.Supplier<any>): number;
      }

      const Spliterator: JavaInterfaceStatics & {
        readonly ORDERED: number;
        readonly DISTINCT: number;
        readonly SORTED: number;
        readonly SIZED: number;
        readonly NONNULL: number;
        readonly IMMUTABLE: number;
        readonly CONCURRENT: number;
        readonly SUBSIZED: number;
      };
      interface Spliterator<T> extends JavaObject {
        tryAdvance(arg0: java.util.function.Consumer<any>): boolean;
        forEachRemaining(arg0: java.util.function.Consumer<any>): void;
        trySplit(): Spliterator<T>;
        estimateSize(): number;
        getExactSizeIfKnown(): number;
        characteristics(): number;
        hasCharacteristics(arg0: number): boolean;
        getComparator(): Comparator<any>;
      }

      const Locale$LanguageRange: JavaClassStatics<{
        new (arg0: string): Locale$LanguageRange;
        new (arg0: string, arg1: number): Locale$LanguageRange;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        readonly MAX_WEIGHT: number;
        readonly MIN_WEIGHT: number;

        parse(arg0: string): JavaList<Locale$LanguageRange>;
        parse(
          arg0: string,
          arg1: JavaMap<string, JavaList<string>>
        ): JavaList<Locale$LanguageRange>;
        mapEquivalents(
          arg0: JavaList<Locale$LanguageRange>,
          arg1: JavaMap<string, JavaList<string>>
        ): JavaList<Locale$LanguageRange>;
      };
      interface Locale$LanguageRange extends JavaObject {
        getRange(): string;
        getWeight(): number;
      }

      const PrimitiveIterator$OfLong: JavaInterfaceStatics;
      interface PrimitiveIterator$OfLong
        extends PrimitiveIterator<number, java.util.function.LongConsumer> {
        nextLong(): number;
        forEachRemaining(arg0: java.util.function.LongConsumer): void;
        next(): number;
        forEachRemaining(arg0: java.util.function.Consumer<any>): void;
      }

      const LongSummaryStatistics: JavaClassStatics<{
        new (): LongSummaryStatistics;
        new (
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: number
        ): LongSummaryStatistics;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface LongSummaryStatistics
        extends java.util.function.LongConsumer,
          java.util.function.IntConsumer {
        accept(arg0: number): void;
        accept(arg0: number): void;
        combine(arg0: LongSummaryStatistics): void;
        getCount(): number;
        getSum(): number;
        getMin(): number;
        getMax(): number;
        getAverage(): number;
      }

      const OptionalLong: JavaClassStatics<false> & {
        empty(): OptionalLong;
        of(arg0: number): OptionalLong;
      };
      interface OptionalLong extends JavaObject {
        getAsLong(): number;
        isPresent(): boolean;
        isEmpty(): boolean;
        ifPresent(arg0: java.util.function.LongConsumer): void;
        ifPresentOrElse(
          arg0: java.util.function.LongConsumer,
          arg1: java.lang.Runnable
        ): void;
        stream(): java.util.stream.LongStream;
        orElse(arg0: number): number;
        orElseGet(arg0: java.util.function.LongSupplier): number;
        orElseThrow(): number;
        orElseThrow<X>(arg0: java.util.function.Supplier<any>): number;
      }

      const PrimitiveIterator$OfInt: JavaInterfaceStatics;
      interface PrimitiveIterator$OfInt
        extends PrimitiveIterator<number, java.util.function.IntConsumer> {
        nextInt(): number;
        forEachRemaining(arg0: java.util.function.IntConsumer): void;
        next(): number;
        forEachRemaining(arg0: java.util.function.Consumer<any>): void;
      }

      const PrimitiveIterator: JavaInterfaceStatics;
      interface PrimitiveIterator<T, T_CONS> extends Iterator<T> {
        forEachRemaining(arg0: T_CONS): void;
      }

      const Spliterator$OfPrimitive: JavaInterfaceStatics;
      interface Spliterator$OfPrimitive<
        T,
        T_CONS,
        T_SPLITR extends Spliterator$OfPrimitive<T, T_CONS, T_SPLITR>
      > extends Spliterator<T> {
        trySplit(): T_SPLITR;
        tryAdvance(arg0: T_CONS): boolean;
        tryAdvance(arg0: java.util.function.Consumer<any>): boolean;
        forEachRemaining(arg0: T_CONS): void;
      }

      const SortedMap: JavaInterfaceStatics;
      interface SortedMap<K, V> extends JavaMap<K, V> {
        comparator(): Comparator<any>;
        subMap(arg0: K, arg1: K): SortedMap<K, V>;
        headMap(arg0: K): SortedMap<K, V>;
        tailMap(arg0: K): SortedMap<K, V>;
        firstKey(): K;
        lastKey(): K;
        keySet(): JavaSet<K>;
        values(): JavaCollection<V>;
        entrySet(): JavaSet<Map$Entry<K, V>>;
      }

      const Map$Entry: JavaInterfaceStatics & {
        comparingByKey<K, V>(): Comparator<Map$Entry<K, V>>;
        comparingByValue<K, V>(): Comparator<Map$Entry<K, V>>;
        comparingByKey<K, V>(
          arg0: Comparator<any>
        ): Comparator<Map$Entry<K, V>>;
        comparingByValue<K, V>(
          arg0: Comparator<any>
        ): Comparator<Map$Entry<K, V>>;
        copyOf<K, V>(arg0: Map$Entry<any, any>): Map$Entry<K, V>;
      };
      interface Map$Entry<K, V> extends JavaObject {
        getKey(): K;
        getValue(): V;
        setValue(arg0: V): V;
      }

      const Random: JavaClassStatics<{
        new (): Random;
        new (arg0: number): Random;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface Random
        extends java.util.random.RandomGenerator,
          java.io.Serializable {
        setSeed(arg0: number): void;
        nextBytes(arg0: number[]): void;
        nextInt(): number;
        nextInt(arg0: number): number;
        nextInt(arg0: number, arg1: number): number;
        nextLong(): number;
        nextLong(arg0: number): number;
        nextLong(arg0: number, arg1: number): number;
        nextBoolean(): boolean;
        nextFloat(): number;
        nextFloat(arg0: number): number;
        nextFloat(arg0: number, arg1: number): number;
        nextDouble(): number;
        nextDouble(arg0: number): number;
        nextDouble(arg0: number, arg1: number): number;
        nextGaussian(): number;
        nextGaussian(arg0: number, arg1: number): number;
        ints(arg0: number): java.util.stream.IntStream;
        ints(): java.util.stream.IntStream;
        ints(
          arg0: number,
          arg1: number,
          arg2: number
        ): java.util.stream.IntStream;
        ints(arg0: number, arg1: number): java.util.stream.IntStream;
        longs(arg0: number): java.util.stream.LongStream;
        longs(): java.util.stream.LongStream;
        longs(
          arg0: number,
          arg1: number,
          arg2: number
        ): java.util.stream.LongStream;
        longs(arg0: number, arg1: number): java.util.stream.LongStream;
        doubles(arg0: number): java.util.stream.DoubleStream;
        doubles(): java.util.stream.DoubleStream;
        doubles(
          arg0: number,
          arg1: number,
          arg2: number
        ): java.util.stream.DoubleStream;
        doubles(arg0: number, arg1: number): java.util.stream.DoubleStream;
      }

      const HashMap: JavaClassStatics<{
        new <K, V>(arg0: number, arg1: number): HashMap<K, V>;
        new <K, V>(arg0: number): HashMap<K, V>;
        new <K, V>(): HashMap<K, V>;
        new <K, V>(arg0: JavaMap<any, any>): HashMap<K, V>;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface HashMap<K, V>
        extends AbstractMap<K, V>,
          JavaMap<K, V>,
          java.lang.Cloneable,
          java.io.Serializable {
        size(): number;
        isEmpty(): boolean;
        get(arg0: any): V;
        containsKey(arg0: any): boolean;
        put(arg0: K, arg1: V): V;
        putAll(arg0: JavaMap<any, any>): void;
        remove(arg0: any): V;
        clear(): void;
        containsValue(arg0: any): boolean;
        keySet(): JavaSet<K>;
        values(): JavaCollection<V>;
        entrySet(): JavaSet<Map$Entry<K, V>>;
        getOrDefault(arg0: any, arg1: V): V;
        putIfAbsent(arg0: K, arg1: V): V;
        remove(arg0: any, arg1: any): boolean;
        replace(arg0: K, arg1: V, arg2: V): boolean;
        replace(arg0: K, arg1: V): V;
        computeIfAbsent(
          arg0: K,
          arg1: java.util.function.Function<any, any>
        ): V;
        computeIfPresent(
          arg0: K,
          arg1: java.util.function.BiFunction<any, any, any>
        ): V;
        compute(arg0: K, arg1: java.util.function.BiFunction<any, any, any>): V;
        merge(
          arg0: K,
          arg1: V,
          arg2: java.util.function.BiFunction<any, any, any>
        ): V;
        forEach(arg0: java.util.function.BiConsumer<any, any>): void;
        replaceAll(arg0: java.util.function.BiFunction<any, any, any>): void;
        clone(): any;
      }

      const AbstractMap: JavaClassStatics<false>;
      interface AbstractMap<K, V> extends JavaMap<K, V> {
        size(): number;
        isEmpty(): boolean;
        containsValue(arg0: any): boolean;
        containsKey(arg0: any): boolean;
        get(arg0: any): V;
        put(arg0: K, arg1: V): V;
        remove(arg0: any): V;
        remove(arg0: any, arg1: any): boolean;
        putAll(arg0: JavaMap<any, any>): void;
        clear(): void;
        keySet(): JavaSet<K>;
        values(): JavaCollection<V>;
        entrySet(): JavaSet<Map$Entry<K, V>>;
      }

      const Hashtable: JavaClassStatics<{
        new <K, V>(arg0: number, arg1: number): Hashtable<K, V>;
        new <K, V>(arg0: number): Hashtable<K, V>;
        new <K, V>(): Hashtable<K, V>;
        new <K, V>(arg0: JavaMap<any, any>): Hashtable<K, V>;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface Hashtable<K, V>
        extends Dictionary<K, V>,
          JavaMap<K, V>,
          java.lang.Cloneable,
          java.io.Serializable {
        size(): number;
        isEmpty(): boolean;
        keys(): Enumeration<K>;
        elements(): Enumeration<V>;
        contains(arg0: any): boolean;
        containsValue(arg0: any): boolean;
        containsKey(arg0: any): boolean;
        get(arg0: any): V;
        put(arg0: K, arg1: V): V;
        remove(arg0: any): V;
        putAll(arg0: JavaMap<any, any>): void;
        clear(): void;
        clone(): any;
        keySet(): JavaSet<K>;
        entrySet(): JavaSet<Map$Entry<K, V>>;
        values(): JavaCollection<V>;
        getOrDefault(arg0: any, arg1: V): V;
        forEach(arg0: java.util.function.BiConsumer<any, any>): void;
        replaceAll(arg0: java.util.function.BiFunction<any, any, any>): void;
        putIfAbsent(arg0: K, arg1: V): V;
        remove(arg0: any, arg1: any): boolean;
        replace(arg0: K, arg1: V, arg2: V): boolean;
        replace(arg0: K, arg1: V): V;
        computeIfAbsent(
          arg0: K,
          arg1: java.util.function.Function<any, any>
        ): V;
        computeIfPresent(
          arg0: K,
          arg1: java.util.function.BiFunction<any, any, any>
        ): V;
        compute(arg0: K, arg1: java.util.function.BiFunction<any, any, any>): V;
        merge(
          arg0: K,
          arg1: V,
          arg2: java.util.function.BiFunction<any, any, any>
        ): V;
      }

      const Properties: JavaClassStatics<{
        new (): Properties;
        new (arg0: number): Properties;
        new (arg0: Properties): Properties;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface Properties extends Hashtable<any, any> {
        setProperty(arg0: string, arg1: string): any;
        load(arg0: java.io.Reader): void;
        load(arg0: java.io.InputStream): void;
        /** @deprecated */
        save(arg0: java.io.OutputStream, arg1: string): void;
        store(arg0: java.io.Writer, arg1: string): void;
        store(arg0: java.io.OutputStream, arg1: string): void;
        loadFromXML(arg0: java.io.InputStream): void;
        storeToXML(arg0: java.io.OutputStream, arg1: string): void;
        storeToXML(
          arg0: java.io.OutputStream,
          arg1: string,
          arg2: string
        ): void;
        storeToXML(
          arg0: java.io.OutputStream,
          arg1: string,
          arg2: java.nio.charset.Charset
        ): void;
        getProperty(arg0: string): string;
        getProperty(arg0: string, arg1: string): string;
        propertyNames(): Enumeration<any>;
        stringPropertyNames(): JavaSet<string>;
        list(arg0: java.io.PrintStream): void;
        list(arg0: java.io.PrintWriter): void;
        size(): number;
        isEmpty(): boolean;
        keys(): Enumeration<any>;
        elements(): Enumeration<any>;
        contains(arg0: any): boolean;
        containsValue(arg0: any): boolean;
        containsKey(arg0: any): boolean;
        get(arg0: any): any;
        put(arg0: any, arg1: any): any;
        remove(arg0: any): any;
        putAll(arg0: JavaMap<any, any>): void;
        clear(): void;
        keySet(): JavaSet<any>;
        values(): JavaCollection<any>;
        entrySet(): JavaSet<Map$Entry<any, any>>;
        getOrDefault(arg0: any, arg1: any): any;
        forEach(arg0: java.util.function.BiConsumer<any, any>): void;
        replaceAll(arg0: java.util.function.BiFunction<any, any, any>): void;
        putIfAbsent(arg0: any, arg1: any): any;
        remove(arg0: any, arg1: any): boolean;
        replace(arg0: any, arg1: any, arg2: any): boolean;
        replace(arg0: any, arg1: any): any;
        computeIfAbsent(
          arg0: any,
          arg1: java.util.function.Function<any, any>
        ): any;
        computeIfPresent(
          arg0: any,
          arg1: java.util.function.BiFunction<any, any, any>
        ): any;
        compute(
          arg0: any,
          arg1: java.util.function.BiFunction<any, any, any>
        ): any;
        merge(
          arg0: any,
          arg1: any,
          arg2: java.util.function.BiFunction<any, any, any>
        ): any;
        clone(): any;
      }

      const Dictionary: JavaClassStatics<{
        new <K, V>(): Dictionary<K, V>;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface Dictionary<K, V> extends JavaObject {
        size(): number;
        isEmpty(): boolean;
        keys(): Enumeration<K>;
        elements(): Enumeration<V>;
        get(arg0: any): V;
        put(arg0: K, arg1: V): V;
        remove(arg0: any): V;
      }

      const Date: JavaClassStatics<{
        new (): Date;
        new (arg0: number): Date;
        /** @deprecated */
        new (arg0: number, arg1: number, arg2: number): Date;
        /** @deprecated */
        new (
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: number,
          arg4: number
        ): Date;
        /** @deprecated */
        new (
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: number,
          arg4: number,
          arg5: number
        ): Date;
        /** @deprecated */
        new (arg0: string): Date;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        /** @deprecated */
        UTC(
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: number,
          arg4: number,
          arg5: number
        ): number;
        /** @deprecated */
        parse(arg0: string): number;
        from(arg0: java.time.Instant): Date;
      };
      interface Date
        extends java.io.Serializable,
          java.lang.Cloneable,
          java.lang.Comparable<Date> {
        clone(): any;
        /** @deprecated */
        getYear(): number;
        /** @deprecated */
        setYear(arg0: number): void;
        /** @deprecated */
        getMonth(): number;
        /** @deprecated */
        setMonth(arg0: number): void;
        /** @deprecated */
        getDate(): number;
        /** @deprecated */
        setDate(arg0: number): void;
        /** @deprecated */
        getDay(): number;
        /** @deprecated */
        getHours(): number;
        /** @deprecated */
        setHours(arg0: number): void;
        /** @deprecated */
        getMinutes(): number;
        /** @deprecated */
        setMinutes(arg0: number): void;
        /** @deprecated */
        getSeconds(): number;
        /** @deprecated */
        setSeconds(arg0: number): void;
        getTime(): number;
        setTime(arg0: number): void;
        before(arg0: Date): boolean;
        after(arg0: Date): boolean;
        compareTo(arg0: Date): number;
        /** @deprecated */
        toLocaleString(): string;
        /** @deprecated */
        toGMTString(): string;
        /** @deprecated */
        getTimezoneOffset(): number;
        toInstant(): java.time.Instant;
      }

      namespace _function {
        const DoublePredicate: JavaInterfaceStatics;
        interface DoublePredicate extends JavaObject {
          test(arg0: number): boolean;
          and(arg0: DoublePredicate): DoublePredicate;
          negate(): DoublePredicate;
          or(arg0: DoublePredicate): DoublePredicate;
        }

        const DoubleFunction: JavaInterfaceStatics;
        interface DoubleFunction<R> extends JavaObject {
          apply(arg0: number): R;
        }

        const UnaryOperator: JavaInterfaceStatics & {
          identity<T>(): UnaryOperator<T>;
        };
        interface UnaryOperator<T> extends Function<T, T> {}

        const ObjIntConsumer: JavaInterfaceStatics;
        interface ObjIntConsumer<T> extends JavaObject {
          accept(arg0: T, arg1: number): void;
        }

        const LongSupplier: JavaInterfaceStatics;
        interface LongSupplier extends JavaObject {
          getAsLong(): number;
        }

        const ToLongFunction: JavaInterfaceStatics;
        interface ToLongFunction<T> extends JavaObject {
          applyAsLong(arg0: T): number;
        }

        const LongConsumer: JavaInterfaceStatics;
        interface LongConsumer extends JavaObject {
          accept(arg0: number): void;
          andThen(arg0: LongConsumer): LongConsumer;
        }

        const BinaryOperator: JavaInterfaceStatics & {
          minBy<T>(arg0: java.util.Comparator<any>): BinaryOperator<T>;
          maxBy<T>(arg0: java.util.Comparator<any>): BinaryOperator<T>;
        };
        interface BinaryOperator<T> extends BiFunction<T, T, T> {}

        const ToDoubleFunction: JavaInterfaceStatics;
        interface ToDoubleFunction<T> extends JavaObject {
          applyAsDouble(arg0: T): number;
        }

        const IntSupplier: JavaInterfaceStatics;
        interface IntSupplier extends JavaObject {
          getAsInt(): number;
        }

        const IntBinaryOperator: JavaInterfaceStatics;
        interface IntBinaryOperator extends JavaObject {
          applyAsInt(arg0: number, arg1: number): number;
        }

        const DoubleToIntFunction: JavaInterfaceStatics;
        interface DoubleToIntFunction extends JavaObject {
          applyAsInt(arg0: number): number;
        }

        const DoubleBinaryOperator: JavaInterfaceStatics;
        interface DoubleBinaryOperator extends JavaObject {
          applyAsDouble(arg0: number, arg1: number): number;
        }

        const IntToLongFunction: JavaInterfaceStatics;
        interface IntToLongFunction extends JavaObject {
          applyAsLong(arg0: number): number;
        }

        const ToIntFunction: JavaInterfaceStatics;
        interface ToIntFunction<T> extends JavaObject {
          applyAsInt(arg0: T): number;
        }

        const ObjLongConsumer: JavaInterfaceStatics;
        interface ObjLongConsumer<T> extends JavaObject {
          accept(arg0: T, arg1: number): void;
        }

        const BiConsumer: JavaInterfaceStatics;
        interface BiConsumer<T, U> extends JavaObject {
          accept(arg0: T, arg1: U): void;
          andThen(arg0: BiConsumer<any, any>): BiConsumer<T, U>;
        }

        const IntUnaryOperator: JavaInterfaceStatics & {
          identity(): IntUnaryOperator;
        };
        interface IntUnaryOperator extends JavaObject {
          applyAsInt(arg0: number): number;
          compose(arg0: IntUnaryOperator): IntUnaryOperator;
          andThen(arg0: IntUnaryOperator): IntUnaryOperator;
        }

        const Predicate: JavaInterfaceStatics & {
          isEqual<T>(arg0: any): Predicate<T>;
          not<T>(arg0: Predicate<any>): Predicate<T>;
        };
        interface Predicate<T> extends JavaObject {
          test(arg0: T): boolean;
          and(arg0: Predicate<any>): Predicate<T>;
          negate(): Predicate<T>;
          or(arg0: Predicate<any>): Predicate<T>;
        }

        const LongBinaryOperator: JavaInterfaceStatics;
        interface LongBinaryOperator extends JavaObject {
          applyAsLong(arg0: number, arg1: number): number;
        }

        const IntConsumer: JavaInterfaceStatics;
        interface IntConsumer extends JavaObject {
          accept(arg0: number): void;
          andThen(arg0: IntConsumer): IntConsumer;
        }

        const LongToIntFunction: JavaInterfaceStatics;
        interface LongToIntFunction extends JavaObject {
          applyAsInt(arg0: number): number;
        }

        const IntFunction: JavaInterfaceStatics;
        interface IntFunction<R> extends JavaObject {
          apply(arg0: number): R;
        }

        const DoubleUnaryOperator: JavaInterfaceStatics & {
          identity(): DoubleUnaryOperator;
        };
        interface DoubleUnaryOperator extends JavaObject {
          applyAsDouble(arg0: number): number;
          compose(arg0: DoubleUnaryOperator): DoubleUnaryOperator;
          andThen(arg0: DoubleUnaryOperator): DoubleUnaryOperator;
        }

        const DoubleConsumer: JavaInterfaceStatics;
        interface DoubleConsumer extends JavaObject {
          accept(arg0: number): void;
          andThen(arg0: DoubleConsumer): DoubleConsumer;
        }

        const ObjDoubleConsumer: JavaInterfaceStatics;
        interface ObjDoubleConsumer<T> extends JavaObject {
          accept(arg0: T, arg1: number): void;
        }

        const Consumer: JavaInterfaceStatics;
        interface Consumer<T> extends JavaObject {
          accept(arg0: T): void;
          andThen(arg0: Consumer<any>): Consumer<T>;
        }

        const IntToDoubleFunction: JavaInterfaceStatics;
        interface IntToDoubleFunction extends JavaObject {
          applyAsDouble(arg0: number): number;
        }

        const DoubleSupplier: JavaInterfaceStatics;
        interface DoubleSupplier extends JavaObject {
          getAsDouble(): number;
        }

        const IntPredicate: JavaInterfaceStatics;
        interface IntPredicate extends JavaObject {
          test(arg0: number): boolean;
          and(arg0: IntPredicate): IntPredicate;
          negate(): IntPredicate;
          or(arg0: IntPredicate): IntPredicate;
        }

        const Function: JavaInterfaceStatics & {
          identity<T>(): Function<T, T>;
        };
        interface Function<T, R> extends JavaObject {
          apply(arg0: T): R;
          compose<V>(arg0: Function<any, any>): Function<V, R>;
          andThen<V>(arg0: Function<any, any>): Function<T, V>;
        }

        const LongUnaryOperator: JavaInterfaceStatics & {
          identity(): LongUnaryOperator;
        };
        interface LongUnaryOperator extends JavaObject {
          applyAsLong(arg0: number): number;
          compose(arg0: LongUnaryOperator): LongUnaryOperator;
          andThen(arg0: LongUnaryOperator): LongUnaryOperator;
        }

        const DoubleToLongFunction: JavaInterfaceStatics;
        interface DoubleToLongFunction extends JavaObject {
          applyAsLong(arg0: number): number;
        }

        const Supplier: JavaInterfaceStatics;
        interface Supplier<T> extends JavaObject {
          get(): T;
        }

        const LongFunction: JavaInterfaceStatics;
        interface LongFunction<R> extends JavaObject {
          apply(arg0: number): R;
        }

        const LongToDoubleFunction: JavaInterfaceStatics;
        interface LongToDoubleFunction extends JavaObject {
          applyAsDouble(arg0: number): number;
        }

        const BiPredicate: JavaInterfaceStatics;
        interface BiPredicate<T, U> extends JavaObject {
          test(arg0: T, arg1: U): boolean;
          and(arg0: BiPredicate<any, any>): BiPredicate<T, U>;
          negate(): BiPredicate<T, U>;
          or(arg0: BiPredicate<any, any>): BiPredicate<T, U>;
        }

        const LongPredicate: JavaInterfaceStatics;
        interface LongPredicate extends JavaObject {
          test(arg0: number): boolean;
          and(arg0: LongPredicate): LongPredicate;
          negate(): LongPredicate;
          or(arg0: LongPredicate): LongPredicate;
        }

        const BiFunction: JavaInterfaceStatics;
        interface BiFunction<T, U, R> extends JavaObject {
          apply(arg0: T, arg1: U): R;
          andThen<V>(arg0: Function<any, any>): BiFunction<T, U, V>;
        }

        export {
          DoublePredicate,
          DoubleFunction,
          UnaryOperator,
          ObjIntConsumer,
          LongSupplier,
          ToLongFunction,
          LongConsumer,
          BinaryOperator,
          ToDoubleFunction,
          IntSupplier,
          IntBinaryOperator,
          DoubleToIntFunction,
          DoubleBinaryOperator,
          IntToLongFunction,
          ToIntFunction,
          ObjLongConsumer,
          BiConsumer,
          IntUnaryOperator,
          Predicate,
          LongBinaryOperator,
          IntConsumer,
          LongToIntFunction,
          IntFunction,
          DoubleUnaryOperator,
          DoubleConsumer,
          ObjDoubleConsumer,
          Consumer,
          IntToDoubleFunction,
          DoubleSupplier,
          IntPredicate,
          Function,
          LongUnaryOperator,
          DoubleToLongFunction,
          Supplier,
          LongFunction,
          LongToDoubleFunction,
          BiPredicate,
          LongPredicate,
          BiFunction,
        };
      }

      namespace stream {
        const Stream: JavaInterfaceStatics & {
          builder<T>(): Stream$Builder<T>;
          empty<T>(): Stream<T>;
          of<T>(arg0: T): Stream<T>;
          ofNullable<T>(arg0: T): Stream<T>;
          of<T>(...arg0: T[]): Stream<T>;
          iterate<T>(
            arg0: T,
            arg1: java.util.function.UnaryOperator<T>
          ): Stream<T>;
          iterate<T>(
            arg0: T,
            arg1: java.util.function.Predicate<any>,
            arg2: java.util.function.UnaryOperator<T>
          ): Stream<T>;
          generate<T>(arg0: java.util.function.Supplier<any>): Stream<T>;
          concat<T>(arg0: Stream<any>, arg1: Stream<any>): Stream<T>;
        };
        interface Stream<T> extends BaseStream<T, Stream<T>> {
          filter(arg0: java.util.function.Predicate<any>): Stream<T>;
          map<R>(arg0: java.util.function.Function<any, any>): Stream<R>;
          mapToInt(arg0: java.util.function.ToIntFunction<any>): IntStream;
          mapToLong(arg0: java.util.function.ToLongFunction<any>): LongStream;
          mapToDouble(
            arg0: java.util.function.ToDoubleFunction<any>
          ): DoubleStream;
          flatMap<R>(arg0: java.util.function.Function<any, any>): Stream<R>;
          flatMapToInt(arg0: java.util.function.Function<any, any>): IntStream;
          flatMapToLong(
            arg0: java.util.function.Function<any, any>
          ): LongStream;
          flatMapToDouble(
            arg0: java.util.function.Function<any, any>
          ): DoubleStream;
          mapMulti<R>(arg0: java.util.function.BiConsumer<any, any>): Stream<R>;
          mapMultiToInt(
            arg0: java.util.function.BiConsumer<any, any>
          ): IntStream;
          mapMultiToLong(
            arg0: java.util.function.BiConsumer<any, any>
          ): LongStream;
          mapMultiToDouble(
            arg0: java.util.function.BiConsumer<any, any>
          ): DoubleStream;
          distinct(): Stream<T>;
          sorted(): Stream<T>;
          sorted(arg0: java.util.Comparator<any>): Stream<T>;
          peek(arg0: java.util.function.Consumer<any>): Stream<T>;
          limit(arg0: number): Stream<T>;
          skip(arg0: number): Stream<T>;
          takeWhile(arg0: java.util.function.Predicate<any>): Stream<T>;
          dropWhile(arg0: java.util.function.Predicate<any>): Stream<T>;
          forEach(arg0: java.util.function.Consumer<any>): void;
          forEachOrdered(arg0: java.util.function.Consumer<any>): void;
          toArray(): any[];
          toArray<A>(arg0: java.util.function.IntFunction<A[]>): A[];
          reduce(arg0: T, arg1: java.util.function.BinaryOperator<T>): T;
          reduce(
            arg0: java.util.function.BinaryOperator<T>
          ): java.util.Optional<T>;
          reduce<U>(
            arg0: U,
            arg1: java.util.function.BiFunction<U, any, U>,
            arg2: java.util.function.BinaryOperator<U>
          ): U;
          collect<R>(
            arg0: java.util.function.Supplier<R>,
            arg1: java.util.function.BiConsumer<R, any>,
            arg2: java.util.function.BiConsumer<R, R>
          ): R;
          collect<R, A>(arg0: Collector<any, A, R>): R;
          toList(): JavaList<T>;
          min(arg0: java.util.Comparator<any>): java.util.Optional<T>;
          max(arg0: java.util.Comparator<any>): java.util.Optional<T>;
          count(): number;
          anyMatch(arg0: java.util.function.Predicate<any>): boolean;
          allMatch(arg0: java.util.function.Predicate<any>): boolean;
          noneMatch(arg0: java.util.function.Predicate<any>): boolean;
          findFirst(): java.util.Optional<T>;
          findAny(): java.util.Optional<T>;
        }

        const IntStream: JavaInterfaceStatics & {
          builder(): IntStream$Builder;
          empty(): IntStream;
          of(arg0: number): IntStream;
          of(...arg0: number[]): IntStream;
          iterate(
            arg0: number,
            arg1: java.util.function.IntUnaryOperator
          ): IntStream;
          iterate(
            arg0: number,
            arg1: java.util.function.IntPredicate,
            arg2: java.util.function.IntUnaryOperator
          ): IntStream;
          generate(arg0: java.util.function.IntSupplier): IntStream;
          range(arg0: number, arg1: number): IntStream;
          rangeClosed(arg0: number, arg1: number): IntStream;
          concat(arg0: IntStream, arg1: IntStream): IntStream;
        };
        interface IntStream extends BaseStream<number, IntStream> {
          filter(arg0: java.util.function.IntPredicate): IntStream;
          map(arg0: java.util.function.IntUnaryOperator): IntStream;
          mapToObj<U>(arg0: java.util.function.IntFunction<any>): Stream<U>;
          mapToLong(arg0: java.util.function.IntToLongFunction): LongStream;
          mapToDouble(
            arg0: java.util.function.IntToDoubleFunction
          ): DoubleStream;
          flatMap(arg0: java.util.function.IntFunction<any>): IntStream;
          mapMulti(arg0: IntStream$IntMapMultiConsumer): IntStream;
          distinct(): IntStream;
          sorted(): IntStream;
          peek(arg0: java.util.function.IntConsumer): IntStream;
          limit(arg0: number): IntStream;
          skip(arg0: number): IntStream;
          takeWhile(arg0: java.util.function.IntPredicate): IntStream;
          dropWhile(arg0: java.util.function.IntPredicate): IntStream;
          forEach(arg0: java.util.function.IntConsumer): void;
          forEachOrdered(arg0: java.util.function.IntConsumer): void;
          toArray(): number[];
          reduce(
            arg0: number,
            arg1: java.util.function.IntBinaryOperator
          ): number;
          reduce(
            arg0: java.util.function.IntBinaryOperator
          ): java.util.OptionalInt;
          collect<R>(
            arg0: java.util.function.Supplier<R>,
            arg1: java.util.function.ObjIntConsumer<R>,
            arg2: java.util.function.BiConsumer<R, R>
          ): R;
          sum(): number;
          min(): java.util.OptionalInt;
          max(): java.util.OptionalInt;
          count(): number;
          average(): java.util.OptionalDouble;
          summaryStatistics(): java.util.IntSummaryStatistics;
          anyMatch(arg0: java.util.function.IntPredicate): boolean;
          allMatch(arg0: java.util.function.IntPredicate): boolean;
          noneMatch(arg0: java.util.function.IntPredicate): boolean;
          findFirst(): java.util.OptionalInt;
          findAny(): java.util.OptionalInt;
          asLongStream(): LongStream;
          asDoubleStream(): DoubleStream;
          boxed(): Stream<number>;
          sequential(): IntStream;
          parallel(): IntStream;
          iterator(): java.util.PrimitiveIterator$OfInt;
          spliterator(): java.util.Spliterator$OfInt;
        }

        const Stream$Builder: JavaInterfaceStatics;
        interface Stream$Builder<T> extends java.util.function.Consumer<T> {
          accept(arg0: T): void;
          add(arg0: T): Stream$Builder<T>;
          build(): Stream<T>;
        }

        const Collector: JavaInterfaceStatics & {
          of<T, R>(
            arg0: java.util.function.Supplier<R>,
            arg1: java.util.function.BiConsumer<R, T>,
            arg2: java.util.function.BinaryOperator<R>,
            ...arg3: Collector$Characteristics[]
          ): Collector<T, R, R>;
          of<T, A, R>(
            arg0: java.util.function.Supplier<A>,
            arg1: java.util.function.BiConsumer<A, T>,
            arg2: java.util.function.BinaryOperator<A>,
            arg3: java.util.function.Function<A, R>,
            ...arg4: Collector$Characteristics[]
          ): Collector<T, A, R>;
        };
        interface Collector<T, A, R> extends JavaObject {
          supplier(): java.util.function.Supplier<A>;
          accumulator(): java.util.function.BiConsumer<A, T>;
          combiner(): java.util.function.BinaryOperator<A>;
          finisher(): java.util.function.Function<A, R>;
          characteristics(): JavaSet<Collector$Characteristics>;
        }

        const LongStream: JavaInterfaceStatics & {
          builder(): LongStream$Builder;
          empty(): LongStream;
          of(arg0: number): LongStream;
          of(...arg0: number[]): LongStream;
          iterate(
            arg0: number,
            arg1: java.util.function.LongUnaryOperator
          ): LongStream;
          iterate(
            arg0: number,
            arg1: java.util.function.LongPredicate,
            arg2: java.util.function.LongUnaryOperator
          ): LongStream;
          generate(arg0: java.util.function.LongSupplier): LongStream;
          range(arg0: number, arg1: number): LongStream;
          rangeClosed(arg0: number, arg1: number): LongStream;
          concat(arg0: LongStream, arg1: LongStream): LongStream;
        };
        interface LongStream extends BaseStream<number, LongStream> {
          filter(arg0: java.util.function.LongPredicate): LongStream;
          map(arg0: java.util.function.LongUnaryOperator): LongStream;
          mapToObj<U>(arg0: java.util.function.LongFunction<any>): Stream<U>;
          mapToInt(arg0: java.util.function.LongToIntFunction): IntStream;
          mapToDouble(
            arg0: java.util.function.LongToDoubleFunction
          ): DoubleStream;
          flatMap(arg0: java.util.function.LongFunction<any>): LongStream;
          mapMulti(arg0: LongStream$LongMapMultiConsumer): LongStream;
          distinct(): LongStream;
          sorted(): LongStream;
          peek(arg0: java.util.function.LongConsumer): LongStream;
          limit(arg0: number): LongStream;
          skip(arg0: number): LongStream;
          takeWhile(arg0: java.util.function.LongPredicate): LongStream;
          dropWhile(arg0: java.util.function.LongPredicate): LongStream;
          forEach(arg0: java.util.function.LongConsumer): void;
          forEachOrdered(arg0: java.util.function.LongConsumer): void;
          toArray(): number[];
          reduce(
            arg0: number,
            arg1: java.util.function.LongBinaryOperator
          ): number;
          reduce(
            arg0: java.util.function.LongBinaryOperator
          ): java.util.OptionalLong;
          collect<R>(
            arg0: java.util.function.Supplier<R>,
            arg1: java.util.function.ObjLongConsumer<R>,
            arg2: java.util.function.BiConsumer<R, R>
          ): R;
          sum(): number;
          min(): java.util.OptionalLong;
          max(): java.util.OptionalLong;
          count(): number;
          average(): java.util.OptionalDouble;
          summaryStatistics(): java.util.LongSummaryStatistics;
          anyMatch(arg0: java.util.function.LongPredicate): boolean;
          allMatch(arg0: java.util.function.LongPredicate): boolean;
          noneMatch(arg0: java.util.function.LongPredicate): boolean;
          findFirst(): java.util.OptionalLong;
          findAny(): java.util.OptionalLong;
          asDoubleStream(): DoubleStream;
          boxed(): Stream<number>;
          sequential(): LongStream;
          parallel(): LongStream;
          iterator(): java.util.PrimitiveIterator$OfLong;
          spliterator(): java.util.Spliterator$OfLong;
        }

        const DoubleStream: JavaInterfaceStatics & {
          builder(): DoubleStream$Builder;
          empty(): DoubleStream;
          of(arg0: number): DoubleStream;
          of(...arg0: number[]): DoubleStream;
          iterate(
            arg0: number,
            arg1: java.util.function.DoubleUnaryOperator
          ): DoubleStream;
          iterate(
            arg0: number,
            arg1: java.util.function.DoublePredicate,
            arg2: java.util.function.DoubleUnaryOperator
          ): DoubleStream;
          generate(arg0: java.util.function.DoubleSupplier): DoubleStream;
          concat(arg0: DoubleStream, arg1: DoubleStream): DoubleStream;
        };
        interface DoubleStream extends BaseStream<number, DoubleStream> {
          filter(arg0: java.util.function.DoublePredicate): DoubleStream;
          map(arg0: java.util.function.DoubleUnaryOperator): DoubleStream;
          mapToObj<U>(arg0: java.util.function.DoubleFunction<any>): Stream<U>;
          mapToInt(arg0: java.util.function.DoubleToIntFunction): IntStream;
          mapToLong(arg0: java.util.function.DoubleToLongFunction): LongStream;
          flatMap(arg0: java.util.function.DoubleFunction<any>): DoubleStream;
          mapMulti(arg0: DoubleStream$DoubleMapMultiConsumer): DoubleStream;
          distinct(): DoubleStream;
          sorted(): DoubleStream;
          peek(arg0: java.util.function.DoubleConsumer): DoubleStream;
          limit(arg0: number): DoubleStream;
          skip(arg0: number): DoubleStream;
          takeWhile(arg0: java.util.function.DoublePredicate): DoubleStream;
          dropWhile(arg0: java.util.function.DoublePredicate): DoubleStream;
          forEach(arg0: java.util.function.DoubleConsumer): void;
          forEachOrdered(arg0: java.util.function.DoubleConsumer): void;
          toArray(): number[];
          reduce(
            arg0: number,
            arg1: java.util.function.DoubleBinaryOperator
          ): number;
          reduce(
            arg0: java.util.function.DoubleBinaryOperator
          ): java.util.OptionalDouble;
          collect<R>(
            arg0: java.util.function.Supplier<R>,
            arg1: java.util.function.ObjDoubleConsumer<R>,
            arg2: java.util.function.BiConsumer<R, R>
          ): R;
          sum(): number;
          min(): java.util.OptionalDouble;
          max(): java.util.OptionalDouble;
          count(): number;
          average(): java.util.OptionalDouble;
          summaryStatistics(): java.util.DoubleSummaryStatistics;
          anyMatch(arg0: java.util.function.DoublePredicate): boolean;
          allMatch(arg0: java.util.function.DoublePredicate): boolean;
          noneMatch(arg0: java.util.function.DoublePredicate): boolean;
          findFirst(): java.util.OptionalDouble;
          findAny(): java.util.OptionalDouble;
          boxed(): Stream<number>;
          sequential(): DoubleStream;
          parallel(): DoubleStream;
          iterator(): java.util.PrimitiveIterator$OfDouble;
          spliterator(): java.util.Spliterator$OfDouble;
        }

        const BaseStream: JavaInterfaceStatics;
        interface BaseStream<T, S extends BaseStream<T, S>>
          extends java.lang.AutoCloseable {
          iterator(): java.util.Iterator<T>;
          spliterator(): java.util.Spliterator<T>;
          isParallel(): boolean;
          sequential(): S;
          parallel(): S;
          unordered(): S;
          onClose(arg0: java.lang.Runnable): S;
          close(): void;
        }

        const IntStream$IntMapMultiConsumer: JavaInterfaceStatics;
        interface IntStream$IntMapMultiConsumer extends JavaObject {
          accept(arg0: number, arg1: java.util.function.IntConsumer): void;
        }

        const IntStream$Builder: JavaInterfaceStatics;
        interface IntStream$Builder extends java.util.function.IntConsumer {
          accept(arg0: number): void;
          add(arg0: number): IntStream$Builder;
          build(): IntStream;
        }

        const DoubleStream$Builder: JavaInterfaceStatics;
        interface DoubleStream$Builder
          extends java.util.function.DoubleConsumer {
          accept(arg0: number): void;
          add(arg0: number): DoubleStream$Builder;
          build(): DoubleStream;
        }

        const Collector$Characteristics: JavaClassStatics<false> & {
          readonly CONCURRENT: Collector$Characteristics;
          readonly UNORDERED: Collector$Characteristics;
          readonly IDENTITY_FINISH: Collector$Characteristics;

          values(): Collector$Characteristics[];
          valueOf(arg0: string): Collector$Characteristics;
        };
        interface Collector$Characteristics
          extends java.lang.Enum<Collector$Characteristics> {}

        const LongStream$LongMapMultiConsumer: JavaInterfaceStatics;
        interface LongStream$LongMapMultiConsumer extends JavaObject {
          accept(arg0: number, arg1: java.util.function.LongConsumer): void;
        }

        const DoubleStream$DoubleMapMultiConsumer: JavaInterfaceStatics;
        interface DoubleStream$DoubleMapMultiConsumer extends JavaObject {
          accept(arg0: number, arg1: java.util.function.DoubleConsumer): void;
        }

        const LongStream$Builder: JavaInterfaceStatics;
        interface LongStream$Builder extends java.util.function.LongConsumer {
          accept(arg0: number): void;
          add(arg0: number): LongStream$Builder;
          build(): LongStream;
        }

        export {
          Stream,
          IntStream,
          Stream$Builder,
          Collector,
          LongStream,
          DoubleStream,
          BaseStream,
          IntStream$IntMapMultiConsumer,
          IntStream$Builder,
          DoubleStream$Builder,
          Collector$Characteristics,
          LongStream$LongMapMultiConsumer,
          DoubleStream$DoubleMapMultiConsumer,
          LongStream$Builder,
        };
      }

      namespace concurrent {
        const Future: JavaInterfaceStatics;
        interface Future<V> extends JavaObject {
          cancel(arg0: boolean): boolean;
          isCancelled(): boolean;
          isDone(): boolean;
          get(): V;
          get(arg0: number, arg1: TimeUnit): V;
        }

        const TimeUnit: JavaClassStatics<false> & {
          readonly NANOSECONDS: TimeUnit;
          readonly MICROSECONDS: TimeUnit;
          readonly MILLISECONDS: TimeUnit;
          readonly SECONDS: TimeUnit;
          readonly MINUTES: TimeUnit;
          readonly HOURS: TimeUnit;
          readonly DAYS: TimeUnit;

          values(): TimeUnit[];
          valueOf(arg0: string): TimeUnit;
          of(arg0: java.time.temporal.ChronoUnit): TimeUnit;
        };
        interface TimeUnit extends java.lang.Enum<TimeUnit> {
          convert(arg0: number, arg1: TimeUnit): number;
          convert(arg0: java.time.Duration): number;
          toNanos(arg0: number): number;
          toMicros(arg0: number): number;
          toMillis(arg0: number): number;
          toSeconds(arg0: number): number;
          toMinutes(arg0: number): number;
          toHours(arg0: number): number;
          toDays(arg0: number): number;
          timedWait(arg0: any, arg1: number): void;
          timedJoin(arg0: java.lang.Thread, arg1: number): void;
          sleep(arg0: number): void;
          toChronoUnit(): java.time.temporal.ChronoUnit;
        }

        const ExecutorService: JavaInterfaceStatics;
        interface ExecutorService extends Executor {
          shutdown(): void;
          shutdownNow(): JavaList<java.lang.Runnable>;
          isShutdown(): boolean;
          isTerminated(): boolean;
          awaitTermination(arg0: number, arg1: TimeUnit): boolean;
          submit<T>(arg0: Callable<T>): Future<T>;
          submit<T>(arg0: java.lang.Runnable, arg1: T): Future<T>;
          submit(arg0: java.lang.Runnable): Future<any>;
          invokeAll<T>(arg0: JavaCollection<any>): JavaList<Future<T>>;
          invokeAll<T>(
            arg0: JavaCollection<any>,
            arg1: number,
            arg2: TimeUnit
          ): JavaList<Future<T>>;
          invokeAny<T>(arg0: JavaCollection<any>): T;
          invokeAny<T>(
            arg0: JavaCollection<any>,
            arg1: number,
            arg2: TimeUnit
          ): T;
        }

        const Executor: JavaInterfaceStatics;
        interface Executor extends JavaObject {
          execute(arg0: java.lang.Runnable): void;
        }

        const Callable: JavaInterfaceStatics;
        interface Callable<V> extends JavaObject {
          call(): V;
        }

        const CompletableFuture: JavaClassStatics<{
          new <T>(): CompletableFuture<T>;

          /** @deprecated */ Symbol: unknown;
          /** @deprecated */ apply: unknown;
          /** @deprecated */ arguments: unknown;
          /** @deprecated */ bind: unknown;
          /** @deprecated */ call: unknown;
          /** @deprecated */ caller: unknown;
          /** @deprecated */ length: unknown;
          /** @deprecated */ name: unknown;
          /** @deprecated */ prototype: unknown;
        }> & {
          supplyAsync<U>(
            arg0: java.util.function.Supplier<U>
          ): CompletableFuture<U>;
          supplyAsync<U>(
            arg0: java.util.function.Supplier<U>,
            arg1: Executor
          ): CompletableFuture<U>;
          runAsync(arg0: java.lang.Runnable): CompletableFuture<java.lang.Void>;
          runAsync(
            arg0: java.lang.Runnable,
            arg1: Executor
          ): CompletableFuture<java.lang.Void>;
          completedFuture<U>(arg0: U): CompletableFuture<U>;
          allOf(
            ...arg0: CompletableFuture<any>[]
          ): CompletableFuture<java.lang.Void>;
          anyOf(...arg0: CompletableFuture<any>[]): CompletableFuture<any>;
          delayedExecutor(
            arg0: number,
            arg1: TimeUnit,
            arg2: Executor
          ): Executor;
          delayedExecutor(arg0: number, arg1: TimeUnit): Executor;
          completedStage<U>(arg0: U): CompletionStage<U>;
          failedFuture<U>(arg0: java.lang.Throwable): CompletableFuture<U>;
          failedStage<U>(arg0: java.lang.Throwable): CompletionStage<U>;
        };
        interface CompletableFuture<T> extends Future<T>, CompletionStage<T> {
          isDone(): boolean;
          get(): T;
          get(arg0: number, arg1: TimeUnit): T;
          join(): T;
          getNow(arg0: T): T;
          complete(arg0: T): boolean;
          completeExceptionally(arg0: java.lang.Throwable): boolean;
          thenApply<U>(
            arg0: java.util.function.Function<any, any>
          ): CompletableFuture<U>;
          thenApplyAsync<U>(
            arg0: java.util.function.Function<any, any>
          ): CompletableFuture<U>;
          thenApplyAsync<U>(
            arg0: java.util.function.Function<any, any>,
            arg1: Executor
          ): CompletableFuture<U>;
          thenAccept(
            arg0: java.util.function.Consumer<any>
          ): CompletableFuture<java.lang.Void>;
          thenAcceptAsync(
            arg0: java.util.function.Consumer<any>
          ): CompletableFuture<java.lang.Void>;
          thenAcceptAsync(
            arg0: java.util.function.Consumer<any>,
            arg1: Executor
          ): CompletableFuture<java.lang.Void>;
          thenRun(arg0: java.lang.Runnable): CompletableFuture<java.lang.Void>;
          thenRunAsync(
            arg0: java.lang.Runnable
          ): CompletableFuture<java.lang.Void>;
          thenRunAsync(
            arg0: java.lang.Runnable,
            arg1: Executor
          ): CompletableFuture<java.lang.Void>;
          thenCombine<U, V>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.BiFunction<any, any, any>
          ): CompletableFuture<V>;
          thenCombineAsync<U, V>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.BiFunction<any, any, any>
          ): CompletableFuture<V>;
          thenCombineAsync<U, V>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.BiFunction<any, any, any>,
            arg2: Executor
          ): CompletableFuture<V>;
          thenAcceptBoth<U>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.BiConsumer<any, any>
          ): CompletableFuture<java.lang.Void>;
          thenAcceptBothAsync<U>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.BiConsumer<any, any>
          ): CompletableFuture<java.lang.Void>;
          thenAcceptBothAsync<U>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.BiConsumer<any, any>,
            arg2: Executor
          ): CompletableFuture<java.lang.Void>;
          runAfterBoth(
            arg0: CompletionStage<any>,
            arg1: java.lang.Runnable
          ): CompletableFuture<java.lang.Void>;
          runAfterBothAsync(
            arg0: CompletionStage<any>,
            arg1: java.lang.Runnable
          ): CompletableFuture<java.lang.Void>;
          runAfterBothAsync(
            arg0: CompletionStage<any>,
            arg1: java.lang.Runnable,
            arg2: Executor
          ): CompletableFuture<java.lang.Void>;
          applyToEither<U>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.Function<any, U>
          ): CompletableFuture<U>;
          applyToEitherAsync<U>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.Function<any, U>
          ): CompletableFuture<U>;
          applyToEitherAsync<U>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.Function<any, U>,
            arg2: Executor
          ): CompletableFuture<U>;
          acceptEither(
            arg0: CompletionStage<any>,
            arg1: java.util.function.Consumer<any>
          ): CompletableFuture<java.lang.Void>;
          acceptEitherAsync(
            arg0: CompletionStage<any>,
            arg1: java.util.function.Consumer<any>
          ): CompletableFuture<java.lang.Void>;
          acceptEitherAsync(
            arg0: CompletionStage<any>,
            arg1: java.util.function.Consumer<any>,
            arg2: Executor
          ): CompletableFuture<java.lang.Void>;
          runAfterEither(
            arg0: CompletionStage<any>,
            arg1: java.lang.Runnable
          ): CompletableFuture<java.lang.Void>;
          runAfterEitherAsync(
            arg0: CompletionStage<any>,
            arg1: java.lang.Runnable
          ): CompletableFuture<java.lang.Void>;
          runAfterEitherAsync(
            arg0: CompletionStage<any>,
            arg1: java.lang.Runnable,
            arg2: Executor
          ): CompletableFuture<java.lang.Void>;
          thenCompose<U>(
            arg0: java.util.function.Function<any, any>
          ): CompletableFuture<U>;
          thenComposeAsync<U>(
            arg0: java.util.function.Function<any, any>
          ): CompletableFuture<U>;
          thenComposeAsync<U>(
            arg0: java.util.function.Function<any, any>,
            arg1: Executor
          ): CompletableFuture<U>;
          whenComplete(
            arg0: java.util.function.BiConsumer<any, any>
          ): CompletableFuture<T>;
          whenCompleteAsync(
            arg0: java.util.function.BiConsumer<any, any>
          ): CompletableFuture<T>;
          whenCompleteAsync(
            arg0: java.util.function.BiConsumer<any, any>,
            arg1: Executor
          ): CompletableFuture<T>;
          handle<U>(
            arg0: java.util.function.BiFunction<any, java.lang.Throwable, any>
          ): CompletableFuture<U>;
          handleAsync<U>(
            arg0: java.util.function.BiFunction<any, java.lang.Throwable, any>
          ): CompletableFuture<U>;
          handleAsync<U>(
            arg0: java.util.function.BiFunction<any, java.lang.Throwable, any>,
            arg1: Executor
          ): CompletableFuture<U>;
          toCompletableFuture(): CompletableFuture<T>;
          exceptionally(
            arg0: java.util.function.Function<java.lang.Throwable, any>
          ): CompletableFuture<T>;
          exceptionallyAsync(
            arg0: java.util.function.Function<java.lang.Throwable, any>
          ): CompletableFuture<T>;
          exceptionallyAsync(
            arg0: java.util.function.Function<java.lang.Throwable, any>,
            arg1: Executor
          ): CompletableFuture<T>;
          exceptionallyCompose(
            arg0: java.util.function.Function<java.lang.Throwable, any>
          ): CompletableFuture<T>;
          exceptionallyComposeAsync(
            arg0: java.util.function.Function<java.lang.Throwable, any>
          ): CompletableFuture<T>;
          exceptionallyComposeAsync(
            arg0: java.util.function.Function<java.lang.Throwable, any>,
            arg1: Executor
          ): CompletableFuture<T>;
          cancel(arg0: boolean): boolean;
          isCancelled(): boolean;
          isCompletedExceptionally(): boolean;
          obtrudeValue(arg0: T): void;
          obtrudeException(arg0: java.lang.Throwable): void;
          getNumberOfDependents(): number;
          newIncompleteFuture<U>(): CompletableFuture<U>;
          defaultExecutor(): Executor;
          copy(): CompletableFuture<T>;
          minimalCompletionStage(): CompletionStage<T>;
          completeAsync(
            arg0: java.util.function.Supplier<any>,
            arg1: Executor
          ): CompletableFuture<T>;
          completeAsync(
            arg0: java.util.function.Supplier<any>
          ): CompletableFuture<T>;
          orTimeout(arg0: number, arg1: TimeUnit): CompletableFuture<T>;
          completeOnTimeout(
            arg0: T,
            arg1: number,
            arg2: TimeUnit
          ): CompletableFuture<T>;
        }

        const CompletionStage: JavaInterfaceStatics;
        interface CompletionStage<T> extends JavaObject {
          thenApply<U>(
            arg0: java.util.function.Function<any, any>
          ): CompletionStage<U>;
          thenApplyAsync<U>(
            arg0: java.util.function.Function<any, any>
          ): CompletionStage<U>;
          thenApplyAsync<U>(
            arg0: java.util.function.Function<any, any>,
            arg1: Executor
          ): CompletionStage<U>;
          thenAccept(
            arg0: java.util.function.Consumer<any>
          ): CompletionStage<java.lang.Void>;
          thenAcceptAsync(
            arg0: java.util.function.Consumer<any>
          ): CompletionStage<java.lang.Void>;
          thenAcceptAsync(
            arg0: java.util.function.Consumer<any>,
            arg1: Executor
          ): CompletionStage<java.lang.Void>;
          thenRun(arg0: java.lang.Runnable): CompletionStage<java.lang.Void>;
          thenRunAsync(
            arg0: java.lang.Runnable
          ): CompletionStage<java.lang.Void>;
          thenRunAsync(
            arg0: java.lang.Runnable,
            arg1: Executor
          ): CompletionStage<java.lang.Void>;
          thenCombine<U, V>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.BiFunction<any, any, any>
          ): CompletionStage<V>;
          thenCombineAsync<U, V>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.BiFunction<any, any, any>
          ): CompletionStage<V>;
          thenCombineAsync<U, V>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.BiFunction<any, any, any>,
            arg2: Executor
          ): CompletionStage<V>;
          thenAcceptBoth<U>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.BiConsumer<any, any>
          ): CompletionStage<java.lang.Void>;
          thenAcceptBothAsync<U>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.BiConsumer<any, any>
          ): CompletionStage<java.lang.Void>;
          thenAcceptBothAsync<U>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.BiConsumer<any, any>,
            arg2: Executor
          ): CompletionStage<java.lang.Void>;
          runAfterBoth(
            arg0: CompletionStage<any>,
            arg1: java.lang.Runnable
          ): CompletionStage<java.lang.Void>;
          runAfterBothAsync(
            arg0: CompletionStage<any>,
            arg1: java.lang.Runnable
          ): CompletionStage<java.lang.Void>;
          runAfterBothAsync(
            arg0: CompletionStage<any>,
            arg1: java.lang.Runnable,
            arg2: Executor
          ): CompletionStage<java.lang.Void>;
          applyToEither<U>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.Function<any, U>
          ): CompletionStage<U>;
          applyToEitherAsync<U>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.Function<any, U>
          ): CompletionStage<U>;
          applyToEitherAsync<U>(
            arg0: CompletionStage<any>,
            arg1: java.util.function.Function<any, U>,
            arg2: Executor
          ): CompletionStage<U>;
          acceptEither(
            arg0: CompletionStage<any>,
            arg1: java.util.function.Consumer<any>
          ): CompletionStage<java.lang.Void>;
          acceptEitherAsync(
            arg0: CompletionStage<any>,
            arg1: java.util.function.Consumer<any>
          ): CompletionStage<java.lang.Void>;
          acceptEitherAsync(
            arg0: CompletionStage<any>,
            arg1: java.util.function.Consumer<any>,
            arg2: Executor
          ): CompletionStage<java.lang.Void>;
          runAfterEither(
            arg0: CompletionStage<any>,
            arg1: java.lang.Runnable
          ): CompletionStage<java.lang.Void>;
          runAfterEitherAsync(
            arg0: CompletionStage<any>,
            arg1: java.lang.Runnable
          ): CompletionStage<java.lang.Void>;
          runAfterEitherAsync(
            arg0: CompletionStage<any>,
            arg1: java.lang.Runnable,
            arg2: Executor
          ): CompletionStage<java.lang.Void>;
          thenCompose<U>(
            arg0: java.util.function.Function<any, any>
          ): CompletionStage<U>;
          thenComposeAsync<U>(
            arg0: java.util.function.Function<any, any>
          ): CompletionStage<U>;
          thenComposeAsync<U>(
            arg0: java.util.function.Function<any, any>,
            arg1: Executor
          ): CompletionStage<U>;
          handle<U>(
            arg0: java.util.function.BiFunction<any, java.lang.Throwable, any>
          ): CompletionStage<U>;
          handleAsync<U>(
            arg0: java.util.function.BiFunction<any, java.lang.Throwable, any>
          ): CompletionStage<U>;
          handleAsync<U>(
            arg0: java.util.function.BiFunction<any, java.lang.Throwable, any>,
            arg1: Executor
          ): CompletionStage<U>;
          whenComplete(
            arg0: java.util.function.BiConsumer<any, any>
          ): CompletionStage<T>;
          whenCompleteAsync(
            arg0: java.util.function.BiConsumer<any, any>
          ): CompletionStage<T>;
          whenCompleteAsync(
            arg0: java.util.function.BiConsumer<any, any>,
            arg1: Executor
          ): CompletionStage<T>;
          exceptionally(
            arg0: java.util.function.Function<java.lang.Throwable, any>
          ): CompletionStage<T>;
          exceptionallyAsync(
            arg0: java.util.function.Function<java.lang.Throwable, any>
          ): CompletionStage<T>;
          exceptionallyAsync(
            arg0: java.util.function.Function<java.lang.Throwable, any>,
            arg1: Executor
          ): CompletionStage<T>;
          exceptionallyCompose(
            arg0: java.util.function.Function<java.lang.Throwable, any>
          ): CompletionStage<T>;
          exceptionallyComposeAsync(
            arg0: java.util.function.Function<java.lang.Throwable, any>
          ): CompletionStage<T>;
          exceptionallyComposeAsync(
            arg0: java.util.function.Function<java.lang.Throwable, any>,
            arg1: Executor
          ): CompletionStage<T>;
          toCompletableFuture(): CompletableFuture<T>;
        }

        export {
          Future,
          TimeUnit,
          ExecutorService,
          Executor,
          Callable,
          CompletableFuture,
          CompletionStage,
        };
      }

      namespace random {
        const RandomGenerator: JavaInterfaceStatics & {
          of(arg0: string): RandomGenerator;
          getDefault(): RandomGenerator;
        };
        interface RandomGenerator extends JavaObject {
          isDeprecated(): boolean;
          doubles(): java.util.stream.DoubleStream;
          doubles(arg0: number, arg1: number): java.util.stream.DoubleStream;
          doubles(arg0: number): java.util.stream.DoubleStream;
          doubles(
            arg0: number,
            arg1: number,
            arg2: number
          ): java.util.stream.DoubleStream;
          ints(): java.util.stream.IntStream;
          ints(arg0: number, arg1: number): java.util.stream.IntStream;
          ints(arg0: number): java.util.stream.IntStream;
          ints(
            arg0: number,
            arg1: number,
            arg2: number
          ): java.util.stream.IntStream;
          longs(): java.util.stream.LongStream;
          longs(arg0: number, arg1: number): java.util.stream.LongStream;
          longs(arg0: number): java.util.stream.LongStream;
          longs(
            arg0: number,
            arg1: number,
            arg2: number
          ): java.util.stream.LongStream;
          nextBoolean(): boolean;
          nextBytes(arg0: number[]): void;
          nextFloat(): number;
          nextFloat(arg0: number): number;
          nextFloat(arg0: number, arg1: number): number;
          nextDouble(): number;
          nextDouble(arg0: number): number;
          nextDouble(arg0: number, arg1: number): number;
          nextInt(): number;
          nextInt(arg0: number): number;
          nextInt(arg0: number, arg1: number): number;
          nextLong(): number;
          nextLong(arg0: number): number;
          nextLong(arg0: number, arg1: number): number;
          nextGaussian(): number;
          nextGaussian(arg0: number, arg1: number): number;
          nextExponential(): number;
        }

        export { RandomGenerator };
      }

      export {
        UUID,
        Optional,
        Locale,
        EventObject,
        Iterator,
        Enumeration,
        EventListener,
        Comparator,
        OptionalInt,
        Spliterator$OfLong,
        Locale$IsoCountryCode,
        Spliterator$OfDouble,
        IntSummaryStatistics,
        Locale$Category,
        DoubleSummaryStatistics,
        Locale$FilteringMode,
        PrimitiveIterator$OfDouble,
        Spliterator$OfInt,
        OptionalDouble,
        Spliterator,
        Locale$LanguageRange,
        PrimitiveIterator$OfLong,
        LongSummaryStatistics,
        OptionalLong,
        PrimitiveIterator$OfInt,
        PrimitiveIterator,
        Spliterator$OfPrimitive,
        SortedMap,
        Map$Entry,
        Random,
        HashMap,
        AbstractMap,
        Hashtable,
        Properties,
        Dictionary,
        Date,
        _function as function,
        stream,
        concurrent,
        random,
      };
    }

    namespace nio {
      const ByteBuffer: JavaClassStatics<false> & {
        allocateDirect(arg0: number): ByteBuffer;
        allocate(arg0: number): ByteBuffer;
        wrap(arg0: number[], arg1: number, arg2: number): ByteBuffer;
        wrap(arg0: number[]): ByteBuffer;
      };
      interface ByteBuffer extends Buffer, java.lang.Comparable<ByteBuffer> {
        slice(): ByteBuffer;
        slice(arg0: number, arg1: number): ByteBuffer;
        duplicate(): ByteBuffer;
        asReadOnlyBuffer(): ByteBuffer;
        get(): number;
        put(arg0: number): ByteBuffer;
        get(arg0: number): number;
        put(arg0: number, arg1: number): ByteBuffer;
        get(arg0: number[], arg1: number, arg2: number): ByteBuffer;
        get(arg0: number[]): ByteBuffer;
        get(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): ByteBuffer;
        get(arg0: number, arg1: number[]): ByteBuffer;
        put(arg0: ByteBuffer): ByteBuffer;
        put(
          arg0: number,
          arg1: ByteBuffer,
          arg2: number,
          arg3: number
        ): ByteBuffer;
        put(arg0: number[], arg1: number, arg2: number): ByteBuffer;
        put(arg0: number[]): ByteBuffer;
        put(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): ByteBuffer;
        put(arg0: number, arg1: number[]): ByteBuffer;
        hasArray(): boolean;
        array(): number[];
        arrayOffset(): number;
        position(arg0: number): ByteBuffer;
        position(): number;
        limit(arg0: number): ByteBuffer;
        limit(): number;
        mark(): ByteBuffer;
        reset(): ByteBuffer;
        clear(): ByteBuffer;
        flip(): ByteBuffer;
        rewind(): ByteBuffer;
        compact(): ByteBuffer;
        isDirect(): boolean;
        compareTo(arg0: ByteBuffer): number;
        mismatch(arg0: ByteBuffer): number;
        order(): ByteOrder;
        order(arg0: ByteOrder): ByteBuffer;
        alignmentOffset(arg0: number, arg1: number): number;
        alignedSlice(arg0: number): ByteBuffer;
        getChar(): number;
        putChar(arg0: number): ByteBuffer;
        getChar(arg0: number): number;
        putChar(arg0: number, arg1: number): ByteBuffer;
        asCharBuffer(): CharBuffer;
        getShort(): number;
        putShort(arg0: number): ByteBuffer;
        getShort(arg0: number): number;
        putShort(arg0: number, arg1: number): ByteBuffer;
        asShortBuffer(): ShortBuffer;
        getInt(): number;
        putInt(arg0: number): ByteBuffer;
        getInt(arg0: number): number;
        putInt(arg0: number, arg1: number): ByteBuffer;
        asIntBuffer(): IntBuffer;
        getLong(): number;
        putLong(arg0: number): ByteBuffer;
        getLong(arg0: number): number;
        putLong(arg0: number, arg1: number): ByteBuffer;
        asLongBuffer(): LongBuffer;
        getFloat(): number;
        putFloat(arg0: number): ByteBuffer;
        getFloat(arg0: number): number;
        putFloat(arg0: number, arg1: number): ByteBuffer;
        asFloatBuffer(): FloatBuffer;
        getDouble(): number;
        putDouble(arg0: number): ByteBuffer;
        getDouble(arg0: number): number;
        putDouble(arg0: number, arg1: number): ByteBuffer;
        asDoubleBuffer(): DoubleBuffer;
      }

      const Buffer: JavaClassStatics<false>;
      interface Buffer extends JavaObject {
        capacity(): number;
        position(): number;
        position(arg0: number): Buffer;
        limit(): number;
        limit(arg0: number): Buffer;
        mark(): Buffer;
        reset(): Buffer;
        clear(): Buffer;
        flip(): Buffer;
        rewind(): Buffer;
        remaining(): number;
        hasRemaining(): boolean;
        isReadOnly(): boolean;
        hasArray(): boolean;
        array(): any;
        arrayOffset(): number;
        isDirect(): boolean;
        slice(): Buffer;
        slice(arg0: number, arg1: number): Buffer;
        duplicate(): Buffer;
      }

      const FloatBuffer: JavaClassStatics<false> & {
        allocate(arg0: number): FloatBuffer;
        wrap(arg0: number[], arg1: number, arg2: number): FloatBuffer;
        wrap(arg0: number[]): FloatBuffer;
      };
      interface FloatBuffer extends Buffer, java.lang.Comparable<FloatBuffer> {
        slice(): FloatBuffer;
        slice(arg0: number, arg1: number): FloatBuffer;
        duplicate(): FloatBuffer;
        asReadOnlyBuffer(): FloatBuffer;
        get(): number;
        put(arg0: number): FloatBuffer;
        get(arg0: number): number;
        put(arg0: number, arg1: number): FloatBuffer;
        get(arg0: number[], arg1: number, arg2: number): FloatBuffer;
        get(arg0: number[]): FloatBuffer;
        get(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): FloatBuffer;
        get(arg0: number, arg1: number[]): FloatBuffer;
        put(arg0: FloatBuffer): FloatBuffer;
        put(
          arg0: number,
          arg1: FloatBuffer,
          arg2: number,
          arg3: number
        ): FloatBuffer;
        put(arg0: number[], arg1: number, arg2: number): FloatBuffer;
        put(arg0: number[]): FloatBuffer;
        put(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): FloatBuffer;
        put(arg0: number, arg1: number[]): FloatBuffer;
        hasArray(): boolean;
        array(): number[];
        arrayOffset(): number;
        position(arg0: number): FloatBuffer;
        position(): number;
        limit(arg0: number): FloatBuffer;
        limit(): number;
        mark(): FloatBuffer;
        reset(): FloatBuffer;
        clear(): FloatBuffer;
        flip(): FloatBuffer;
        rewind(): FloatBuffer;
        compact(): FloatBuffer;
        isDirect(): boolean;
        compareTo(arg0: FloatBuffer): number;
        mismatch(arg0: FloatBuffer): number;
        order(): ByteOrder;
      }

      const LongBuffer: JavaClassStatics<false> & {
        allocate(arg0: number): LongBuffer;
        wrap(arg0: number[], arg1: number, arg2: number): LongBuffer;
        wrap(arg0: number[]): LongBuffer;
      };
      interface LongBuffer extends Buffer, java.lang.Comparable<LongBuffer> {
        slice(): LongBuffer;
        slice(arg0: number, arg1: number): LongBuffer;
        duplicate(): LongBuffer;
        asReadOnlyBuffer(): LongBuffer;
        get(): number;
        put(arg0: number): LongBuffer;
        get(arg0: number): number;
        put(arg0: number, arg1: number): LongBuffer;
        get(arg0: number[], arg1: number, arg2: number): LongBuffer;
        get(arg0: number[]): LongBuffer;
        get(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): LongBuffer;
        get(arg0: number, arg1: number[]): LongBuffer;
        put(arg0: LongBuffer): LongBuffer;
        put(
          arg0: number,
          arg1: LongBuffer,
          arg2: number,
          arg3: number
        ): LongBuffer;
        put(arg0: number[], arg1: number, arg2: number): LongBuffer;
        put(arg0: number[]): LongBuffer;
        put(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): LongBuffer;
        put(arg0: number, arg1: number[]): LongBuffer;
        hasArray(): boolean;
        array(): number[];
        arrayOffset(): number;
        position(arg0: number): LongBuffer;
        position(): number;
        limit(arg0: number): LongBuffer;
        limit(): number;
        mark(): LongBuffer;
        reset(): LongBuffer;
        clear(): LongBuffer;
        flip(): LongBuffer;
        rewind(): LongBuffer;
        compact(): LongBuffer;
        isDirect(): boolean;
        compareTo(arg0: LongBuffer): number;
        mismatch(arg0: LongBuffer): number;
        order(): ByteOrder;
      }

      const ByteOrder: JavaClassStatics<false> & {
        readonly BIG_ENDIAN: ByteOrder;
        readonly LITTLE_ENDIAN: ByteOrder;

        nativeOrder(): ByteOrder;
      };
      interface ByteOrder extends JavaObject {}

      const DoubleBuffer: JavaClassStatics<false> & {
        allocate(arg0: number): DoubleBuffer;
        wrap(arg0: number[], arg1: number, arg2: number): DoubleBuffer;
        wrap(arg0: number[]): DoubleBuffer;
      };
      interface DoubleBuffer
        extends Buffer,
          java.lang.Comparable<DoubleBuffer> {
        slice(): DoubleBuffer;
        slice(arg0: number, arg1: number): DoubleBuffer;
        duplicate(): DoubleBuffer;
        asReadOnlyBuffer(): DoubleBuffer;
        get(): number;
        put(arg0: number): DoubleBuffer;
        get(arg0: number): number;
        put(arg0: number, arg1: number): DoubleBuffer;
        get(arg0: number[], arg1: number, arg2: number): DoubleBuffer;
        get(arg0: number[]): DoubleBuffer;
        get(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): DoubleBuffer;
        get(arg0: number, arg1: number[]): DoubleBuffer;
        put(arg0: DoubleBuffer): DoubleBuffer;
        put(
          arg0: number,
          arg1: DoubleBuffer,
          arg2: number,
          arg3: number
        ): DoubleBuffer;
        put(arg0: number[], arg1: number, arg2: number): DoubleBuffer;
        put(arg0: number[]): DoubleBuffer;
        put(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): DoubleBuffer;
        put(arg0: number, arg1: number[]): DoubleBuffer;
        hasArray(): boolean;
        array(): number[];
        arrayOffset(): number;
        position(arg0: number): DoubleBuffer;
        position(): number;
        limit(arg0: number): DoubleBuffer;
        limit(): number;
        mark(): DoubleBuffer;
        reset(): DoubleBuffer;
        clear(): DoubleBuffer;
        flip(): DoubleBuffer;
        rewind(): DoubleBuffer;
        compact(): DoubleBuffer;
        isDirect(): boolean;
        compareTo(arg0: DoubleBuffer): number;
        mismatch(arg0: DoubleBuffer): number;
        order(): ByteOrder;
      }

      const ShortBuffer: JavaClassStatics<false> & {
        allocate(arg0: number): ShortBuffer;
        wrap(arg0: number[], arg1: number, arg2: number): ShortBuffer;
        wrap(arg0: number[]): ShortBuffer;
      };
      interface ShortBuffer extends Buffer, java.lang.Comparable<ShortBuffer> {
        slice(): ShortBuffer;
        slice(arg0: number, arg1: number): ShortBuffer;
        duplicate(): ShortBuffer;
        asReadOnlyBuffer(): ShortBuffer;
        get(): number;
        put(arg0: number): ShortBuffer;
        get(arg0: number): number;
        put(arg0: number, arg1: number): ShortBuffer;
        get(arg0: number[], arg1: number, arg2: number): ShortBuffer;
        get(arg0: number[]): ShortBuffer;
        get(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): ShortBuffer;
        get(arg0: number, arg1: number[]): ShortBuffer;
        put(arg0: ShortBuffer): ShortBuffer;
        put(
          arg0: number,
          arg1: ShortBuffer,
          arg2: number,
          arg3: number
        ): ShortBuffer;
        put(arg0: number[], arg1: number, arg2: number): ShortBuffer;
        put(arg0: number[]): ShortBuffer;
        put(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): ShortBuffer;
        put(arg0: number, arg1: number[]): ShortBuffer;
        hasArray(): boolean;
        array(): number[];
        arrayOffset(): number;
        position(arg0: number): ShortBuffer;
        position(): number;
        limit(arg0: number): ShortBuffer;
        limit(): number;
        mark(): ShortBuffer;
        reset(): ShortBuffer;
        clear(): ShortBuffer;
        flip(): ShortBuffer;
        rewind(): ShortBuffer;
        compact(): ShortBuffer;
        isDirect(): boolean;
        compareTo(arg0: ShortBuffer): number;
        mismatch(arg0: ShortBuffer): number;
        order(): ByteOrder;
      }

      const IntBuffer: JavaClassStatics<false> & {
        allocate(arg0: number): IntBuffer;
        wrap(arg0: number[], arg1: number, arg2: number): IntBuffer;
        wrap(arg0: number[]): IntBuffer;
      };
      interface IntBuffer extends Buffer, java.lang.Comparable<IntBuffer> {
        slice(): IntBuffer;
        slice(arg0: number, arg1: number): IntBuffer;
        duplicate(): IntBuffer;
        asReadOnlyBuffer(): IntBuffer;
        get(): number;
        put(arg0: number): IntBuffer;
        get(arg0: number): number;
        put(arg0: number, arg1: number): IntBuffer;
        get(arg0: number[], arg1: number, arg2: number): IntBuffer;
        get(arg0: number[]): IntBuffer;
        get(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): IntBuffer;
        get(arg0: number, arg1: number[]): IntBuffer;
        put(arg0: IntBuffer): IntBuffer;
        put(
          arg0: number,
          arg1: IntBuffer,
          arg2: number,
          arg3: number
        ): IntBuffer;
        put(arg0: number[], arg1: number, arg2: number): IntBuffer;
        put(arg0: number[]): IntBuffer;
        put(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): IntBuffer;
        put(arg0: number, arg1: number[]): IntBuffer;
        hasArray(): boolean;
        array(): number[];
        arrayOffset(): number;
        position(arg0: number): IntBuffer;
        position(): number;
        limit(arg0: number): IntBuffer;
        limit(): number;
        mark(): IntBuffer;
        reset(): IntBuffer;
        clear(): IntBuffer;
        flip(): IntBuffer;
        rewind(): IntBuffer;
        compact(): IntBuffer;
        isDirect(): boolean;
        compareTo(arg0: IntBuffer): number;
        mismatch(arg0: IntBuffer): number;
        order(): ByteOrder;
      }

      const CharBuffer: JavaClassStatics<false> & {
        allocate(arg0: number): CharBuffer;
        wrap(arg0: number[], arg1: number, arg2: number): CharBuffer;
        wrap(arg0: number[]): CharBuffer;
        wrap(
          arg0: java.lang.CharSequence,
          arg1: number,
          arg2: number
        ): CharBuffer;
        wrap(arg0: java.lang.CharSequence): CharBuffer;
      };
      interface CharBuffer
        extends Buffer,
          java.lang.Comparable<CharBuffer>,
          java.lang.Appendable,
          java.lang.CharSequence,
          java.lang.Readable {
        read(arg0: CharBuffer): number;
        slice(): CharBuffer;
        slice(arg0: number, arg1: number): CharBuffer;
        duplicate(): CharBuffer;
        asReadOnlyBuffer(): CharBuffer;
        get(): number;
        put(arg0: number): CharBuffer;
        get(arg0: number): number;
        put(arg0: number, arg1: number): CharBuffer;
        get(arg0: number[], arg1: number, arg2: number): CharBuffer;
        get(arg0: number[]): CharBuffer;
        get(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): CharBuffer;
        get(arg0: number, arg1: number[]): CharBuffer;
        put(arg0: CharBuffer): CharBuffer;
        put(
          arg0: number,
          arg1: CharBuffer,
          arg2: number,
          arg3: number
        ): CharBuffer;
        put(arg0: number[], arg1: number, arg2: number): CharBuffer;
        put(arg0: number[]): CharBuffer;
        put(
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): CharBuffer;
        put(arg0: number, arg1: number[]): CharBuffer;
        put(arg0: string, arg1: number, arg2: number): CharBuffer;
        put(arg0: string): CharBuffer;
        hasArray(): boolean;
        array(): number[];
        arrayOffset(): number;
        position(arg0: number): CharBuffer;
        position(): number;
        limit(arg0: number): CharBuffer;
        limit(): number;
        mark(): CharBuffer;
        reset(): CharBuffer;
        clear(): CharBuffer;
        flip(): CharBuffer;
        rewind(): CharBuffer;
        compact(): CharBuffer;
        isDirect(): boolean;
        compareTo(arg0: CharBuffer): number;
        mismatch(arg0: CharBuffer): number;
        length(): number;
        isEmpty(): boolean;
        charAt(arg0: number): number;
        subSequence(arg0: number, arg1: number): CharBuffer;
        append(arg0: java.lang.CharSequence): CharBuffer;
        append(
          arg0: java.lang.CharSequence,
          arg1: number,
          arg2: number
        ): CharBuffer;
        append(arg0: number): CharBuffer;
        order(): ByteOrder;
        chars(): java.util.stream.IntStream;
      }

      const MappedByteBuffer: JavaClassStatics<false>;
      interface MappedByteBuffer extends ByteBuffer {
        isLoaded(): boolean;
        load(): MappedByteBuffer;
        force(): MappedByteBuffer;
        force(arg0: number, arg1: number): MappedByteBuffer;
        position(arg0: number): MappedByteBuffer;
        position(): number;
        limit(arg0: number): MappedByteBuffer;
        limit(): number;
        mark(): MappedByteBuffer;
        reset(): MappedByteBuffer;
        clear(): MappedByteBuffer;
        flip(): MappedByteBuffer;
        rewind(): MappedByteBuffer;
        slice(): MappedByteBuffer;
        slice(arg0: number, arg1: number): MappedByteBuffer;
        duplicate(): MappedByteBuffer;
        compact(): MappedByteBuffer;
      }

      namespace charset {
        const Charset: JavaClassStatics<false> & {
          isSupported(arg0: string): boolean;
          forName(arg0: string): Charset;
          availableCharsets(): java.util.SortedMap<string, Charset>;
          defaultCharset(): Charset;
        };
        interface Charset extends java.lang.Comparable<Charset> {
          name(): string;
          aliases(): JavaSet<string>;
          displayName(): string;
          isRegistered(): boolean;
          displayName(arg0: java.util.Locale): string;
          contains(arg0: Charset): boolean;
          newDecoder(): CharsetDecoder;
          newEncoder(): CharsetEncoder;
          canEncode(): boolean;
          decode(arg0: java.nio.ByteBuffer): java.nio.CharBuffer;
          encode(arg0: java.nio.CharBuffer): java.nio.ByteBuffer;
          encode(arg0: string): java.nio.ByteBuffer;
          compareTo(arg0: Charset): number;
        }

        const CharsetEncoder: JavaClassStatics<false>;
        interface CharsetEncoder extends JavaObject {
          charset(): Charset;
          replacement(): number[];
          replaceWith(arg0: number[]): CharsetEncoder;
          isLegalReplacement(arg0: number[]): boolean;
          malformedInputAction(): CodingErrorAction;
          onMalformedInput(arg0: CodingErrorAction): CharsetEncoder;
          unmappableCharacterAction(): CodingErrorAction;
          onUnmappableCharacter(arg0: CodingErrorAction): CharsetEncoder;
          averageBytesPerChar(): number;
          maxBytesPerChar(): number;
          encode(
            arg0: java.nio.CharBuffer,
            arg1: java.nio.ByteBuffer,
            arg2: boolean
          ): CoderResult;
          flush(arg0: java.nio.ByteBuffer): CoderResult;
          reset(): CharsetEncoder;
          encode(arg0: java.nio.CharBuffer): java.nio.ByteBuffer;
          canEncode(arg0: number): boolean;
          canEncode(arg0: java.lang.CharSequence): boolean;
        }

        const CharsetDecoder: JavaClassStatics<false>;
        interface CharsetDecoder extends JavaObject {
          charset(): Charset;
          replacement(): string;
          replaceWith(arg0: string): CharsetDecoder;
          malformedInputAction(): CodingErrorAction;
          onMalformedInput(arg0: CodingErrorAction): CharsetDecoder;
          unmappableCharacterAction(): CodingErrorAction;
          onUnmappableCharacter(arg0: CodingErrorAction): CharsetDecoder;
          averageCharsPerByte(): number;
          maxCharsPerByte(): number;
          decode(
            arg0: java.nio.ByteBuffer,
            arg1: java.nio.CharBuffer,
            arg2: boolean
          ): CoderResult;
          flush(arg0: java.nio.CharBuffer): CoderResult;
          reset(): CharsetDecoder;
          decode(arg0: java.nio.ByteBuffer): java.nio.CharBuffer;
          isAutoDetecting(): boolean;
          isCharsetDetected(): boolean;
          detectedCharset(): Charset;
        }

        const CodingErrorAction: JavaClassStatics<false> & {
          readonly IGNORE: CodingErrorAction;
          readonly REPLACE: CodingErrorAction;
          readonly REPORT: CodingErrorAction;
        };
        interface CodingErrorAction extends JavaObject {}

        const CoderResult: JavaClassStatics<false> & {
          readonly UNDERFLOW: CoderResult;
          readonly OVERFLOW: CoderResult;

          malformedForLength(arg0: number): CoderResult;
          unmappableForLength(arg0: number): CoderResult;
        };
        interface CoderResult extends JavaObject {
          isUnderflow(): boolean;
          isOverflow(): boolean;
          isError(): boolean;
          isMalformed(): boolean;
          isUnmappable(): boolean;
          length(): number;
          throwException(): void;
        }

        export {
          Charset,
          CharsetEncoder,
          CharsetDecoder,
          CodingErrorAction,
          CoderResult,
        };
      }

      namespace file {
        const Path: JavaInterfaceStatics & {
          of(arg0: string, ...arg1: string[]): Path;
          of(arg0: java.net.URI): Path;
        };
        interface Path
          extends java.lang.Comparable<Path>,
            java.lang.Iterable<Path>,
            Watchable {
          getFileSystem(): FileSystem;
          isAbsolute(): boolean;
          getRoot(): Path;
          getFileName(): Path;
          getParent(): Path;
          getNameCount(): number;
          getName(arg0: number): Path;
          subpath(arg0: number, arg1: number): Path;
          startsWith(arg0: Path): boolean;
          startsWith(arg0: string): boolean;
          endsWith(arg0: Path): boolean;
          endsWith(arg0: string): boolean;
          normalize(): Path;
          resolve(arg0: Path): Path;
          resolve(arg0: string): Path;
          resolveSibling(arg0: Path): Path;
          resolveSibling(arg0: string): Path;
          relativize(arg0: Path): Path;
          toUri(): java.net.URI;
          toAbsolutePath(): Path;
          toRealPath(...arg0: LinkOption[]): Path;
          toFile(): java.io.File;
          register(
            arg0: WatchService,
            arg1: WatchEvent$Kind<any>[],
            ...arg2: WatchEvent$Modifier[]
          ): WatchKey;
          register(
            arg0: WatchService,
            ...arg1: WatchEvent$Kind<any>[]
          ): WatchKey;
          iterator(): java.util.Iterator<Path>;
          compareTo(arg0: Path): number;
        }

        const WatchEvent$Kind: JavaInterfaceStatics;
        interface WatchEvent$Kind<T> extends JavaObject {
          name(): string;
          type(): JavaClass<T>;
        }

        const FileSystem: JavaClassStatics<false>;
        interface FileSystem extends java.io.Closeable {
          provider(): java.nio.file.spi.FileSystemProvider;
          close(): void;
          isOpen(): boolean;
          isReadOnly(): boolean;
          getSeparator(): string;
          getRootDirectories(): java.lang.Iterable<Path>;
          getFileStores(): java.lang.Iterable<FileStore>;
          supportedFileAttributeViews(): JavaSet<string>;
          getPath(arg0: string, ...arg1: string[]): Path;
          getPathMatcher(arg0: string): PathMatcher;
          getUserPrincipalLookupService(): java.nio.file.attribute.UserPrincipalLookupService;
          newWatchService(): WatchService;
        }

        const WatchEvent$Modifier: JavaInterfaceStatics;
        interface WatchEvent$Modifier extends JavaObject {
          name(): string;
        }

        const Watchable: JavaInterfaceStatics;
        interface Watchable extends JavaObject {
          register(
            arg0: WatchService,
            arg1: WatchEvent$Kind<any>[],
            ...arg2: WatchEvent$Modifier[]
          ): WatchKey;
          register(
            arg0: WatchService,
            ...arg1: WatchEvent$Kind<any>[]
          ): WatchKey;
        }

        const WatchService: JavaInterfaceStatics;
        interface WatchService extends java.io.Closeable {
          close(): void;
          poll(): WatchKey;
          poll(arg0: number, arg1: java.util.concurrent.TimeUnit): WatchKey;
          take(): WatchKey;
        }

        const WatchKey: JavaInterfaceStatics;
        interface WatchKey extends JavaObject {
          isValid(): boolean;
          pollEvents(): JavaList<WatchEvent<any>>;
          reset(): boolean;
          cancel(): void;
          watchable(): Watchable;
        }

        const LinkOption: JavaClassStatics<false> & {
          readonly NOFOLLOW_LINKS: LinkOption;

          values(): LinkOption[];
          valueOf(arg0: string): LinkOption;
        };
        interface LinkOption
          extends java.lang.Enum<LinkOption>,
            OpenOption,
            CopyOption {}

        const OpenOption: JavaInterfaceStatics;
        interface OpenOption extends JavaObject {}

        const WatchEvent: JavaInterfaceStatics;
        interface WatchEvent<T> extends JavaObject {
          kind(): WatchEvent$Kind<T>;
          count(): number;
          context(): T;
        }

        const DirectoryStream: JavaInterfaceStatics;
        interface DirectoryStream<T>
          extends java.io.Closeable,
            java.lang.Iterable<T> {
          iterator(): java.util.Iterator<T>;
        }

        const FileStore: JavaClassStatics<false>;
        interface FileStore extends JavaObject {
          name(): string;
          type(): string;
          isReadOnly(): boolean;
          getTotalSpace(): number;
          getUsableSpace(): number;
          getUnallocatedSpace(): number;
          getBlockSize(): number;
          supportsFileAttributeView(arg0: JavaClass<any>): boolean;
          supportsFileAttributeView(arg0: string): boolean;
          getFileStoreAttributeView<V>(arg0: JavaClass<V>): V;
          getAttribute(arg0: string): any;
        }

        const DirectoryStream$Filter: JavaInterfaceStatics;
        interface DirectoryStream$Filter<T> extends JavaObject {
          accept(arg0: T): boolean;
        }

        const PathMatcher: JavaInterfaceStatics;
        interface PathMatcher extends JavaObject {
          matches(arg0: Path): boolean;
        }

        const AccessMode: JavaClassStatics<false> & {
          readonly READ: AccessMode;
          readonly WRITE: AccessMode;
          readonly EXECUTE: AccessMode;

          values(): AccessMode[];
          valueOf(arg0: string): AccessMode;
        };
        interface AccessMode extends java.lang.Enum<AccessMode> {}

        const CopyOption: JavaInterfaceStatics;
        interface CopyOption extends JavaObject {}

        namespace spi {
          const FileSystemProvider: JavaClassStatics<false> & {
            installedProviders(): JavaList<FileSystemProvider>;
          };
          interface FileSystemProvider extends JavaObject {
            getScheme(): string;
            newFileSystem(
              arg0: java.net.URI,
              arg1: JavaMap<string, any>
            ): java.nio.file.FileSystem;
            getFileSystem(arg0: java.net.URI): java.nio.file.FileSystem;
            getPath(arg0: java.net.URI): java.nio.file.Path;
            newFileSystem(
              arg0: java.nio.file.Path,
              arg1: JavaMap<string, any>
            ): java.nio.file.FileSystem;
            newInputStream(
              arg0: java.nio.file.Path,
              ...arg1: java.nio.file.OpenOption[]
            ): java.io.InputStream;
            newOutputStream(
              arg0: java.nio.file.Path,
              ...arg1: java.nio.file.OpenOption[]
            ): java.io.OutputStream;
            newFileChannel(
              arg0: java.nio.file.Path,
              arg1: JavaSet<any>,
              ...arg2: java.nio.file.attribute.FileAttribute<any>[]
            ): java.nio.channels.FileChannel;
            newAsynchronousFileChannel(
              arg0: java.nio.file.Path,
              arg1: JavaSet<any>,
              arg2: java.util.concurrent.ExecutorService,
              ...arg3: java.nio.file.attribute.FileAttribute<any>[]
            ): java.nio.channels.AsynchronousFileChannel;
            newByteChannel(
              arg0: java.nio.file.Path,
              arg1: JavaSet<any>,
              ...arg2: java.nio.file.attribute.FileAttribute<any>[]
            ): java.nio.channels.SeekableByteChannel;
            newDirectoryStream(
              arg0: java.nio.file.Path,
              arg1: java.nio.file.DirectoryStream$Filter<any>
            ): java.nio.file.DirectoryStream<java.nio.file.Path>;
            createDirectory(
              arg0: java.nio.file.Path,
              ...arg1: java.nio.file.attribute.FileAttribute<any>[]
            ): void;
            createSymbolicLink(
              arg0: java.nio.file.Path,
              arg1: java.nio.file.Path,
              ...arg2: java.nio.file.attribute.FileAttribute<any>[]
            ): void;
            createLink(
              arg0: java.nio.file.Path,
              arg1: java.nio.file.Path
            ): void;
            delete(arg0: java.nio.file.Path): void;
            deleteIfExists(arg0: java.nio.file.Path): boolean;
            readSymbolicLink(arg0: java.nio.file.Path): java.nio.file.Path;
            copy(
              arg0: java.nio.file.Path,
              arg1: java.nio.file.Path,
              ...arg2: java.nio.file.CopyOption[]
            ): void;
            move(
              arg0: java.nio.file.Path,
              arg1: java.nio.file.Path,
              ...arg2: java.nio.file.CopyOption[]
            ): void;
            isSameFile(
              arg0: java.nio.file.Path,
              arg1: java.nio.file.Path
            ): boolean;
            isHidden(arg0: java.nio.file.Path): boolean;
            getFileStore(arg0: java.nio.file.Path): java.nio.file.FileStore;
            checkAccess(
              arg0: java.nio.file.Path,
              ...arg1: java.nio.file.AccessMode[]
            ): void;
            getFileAttributeView<V>(
              arg0: java.nio.file.Path,
              arg1: JavaClass<V>,
              ...arg2: java.nio.file.LinkOption[]
            ): V;
            readAttributes<A>(
              arg0: java.nio.file.Path,
              arg1: JavaClass<A>,
              ...arg2: java.nio.file.LinkOption[]
            ): A;
            readAttributes(
              arg0: java.nio.file.Path,
              arg1: string,
              ...arg2: java.nio.file.LinkOption[]
            ): JavaMap<string, any>;
            setAttribute(
              arg0: java.nio.file.Path,
              arg1: string,
              arg2: any,
              ...arg3: java.nio.file.LinkOption[]
            ): void;
          }

          export { FileSystemProvider };
        }

        namespace attribute {
          const UserPrincipalLookupService: JavaClassStatics<false>;
          interface UserPrincipalLookupService extends JavaObject {
            lookupPrincipalByName(arg0: string): UserPrincipal;
            lookupPrincipalByGroupName(arg0: string): GroupPrincipal;
          }

          const UserPrincipal: JavaInterfaceStatics;
          interface UserPrincipal extends java.security.Principal {}

          const GroupPrincipal: JavaInterfaceStatics;
          interface GroupPrincipal extends UserPrincipal {}

          const FileAttribute: JavaInterfaceStatics;
          interface FileAttribute<T> extends JavaObject {
            name(): string;
            value(): T;
          }

          export {
            UserPrincipalLookupService,
            UserPrincipal,
            GroupPrincipal,
            FileAttribute,
          };
        }

        export {
          Path,
          WatchEvent$Kind,
          FileSystem,
          WatchEvent$Modifier,
          Watchable,
          WatchService,
          WatchKey,
          LinkOption,
          OpenOption,
          WatchEvent,
          DirectoryStream,
          FileStore,
          DirectoryStream$Filter,
          PathMatcher,
          AccessMode,
          CopyOption,
          spi,
          attribute,
        };
      }

      namespace channels {
        const SeekableByteChannel: JavaInterfaceStatics;
        interface SeekableByteChannel extends ByteChannel {
          read(arg0: java.nio.ByteBuffer): number;
          write(arg0: java.nio.ByteBuffer): number;
          position(): number;
          position(arg0: number): SeekableByteChannel;
          size(): number;
          truncate(arg0: number): SeekableByteChannel;
        }

        const FileChannel: JavaClassStatics<false> & {
          open(
            arg0: java.nio.file.Path,
            arg1: JavaSet<any>,
            ...arg2: java.nio.file.attribute.FileAttribute<any>[]
          ): FileChannel;
          open(
            arg0: java.nio.file.Path,
            ...arg1: java.nio.file.OpenOption[]
          ): FileChannel;
        };
        interface FileChannel
          extends java.nio.channels.spi.AbstractInterruptibleChannel,
            SeekableByteChannel,
            GatheringByteChannel,
            ScatteringByteChannel {
          read(arg0: java.nio.ByteBuffer): number;
          read(arg0: java.nio.ByteBuffer[], arg1: number, arg2: number): number;
          read(arg0: java.nio.ByteBuffer[]): number;
          write(arg0: java.nio.ByteBuffer): number;
          write(
            arg0: java.nio.ByteBuffer[],
            arg1: number,
            arg2: number
          ): number;
          write(arg0: java.nio.ByteBuffer[]): number;
          position(): number;
          position(arg0: number): FileChannel;
          size(): number;
          truncate(arg0: number): FileChannel;
          force(arg0: boolean): void;
          transferTo(
            arg0: number,
            arg1: number,
            arg2: WritableByteChannel
          ): number;
          transferFrom(
            arg0: ReadableByteChannel,
            arg1: number,
            arg2: number
          ): number;
          read(arg0: java.nio.ByteBuffer, arg1: number): number;
          write(arg0: java.nio.ByteBuffer, arg1: number): number;
          map(
            arg0: FileChannel$MapMode,
            arg1: number,
            arg2: number
          ): java.nio.MappedByteBuffer;
          lock(arg0: number, arg1: number, arg2: boolean): FileLock;
          lock(): FileLock;
          tryLock(arg0: number, arg1: number, arg2: boolean): FileLock;
          tryLock(): FileLock;
        }

        const AsynchronousFileChannel: JavaClassStatics<false> & {
          open(
            arg0: java.nio.file.Path,
            arg1: JavaSet<any>,
            arg2: java.util.concurrent.ExecutorService,
            ...arg3: java.nio.file.attribute.FileAttribute<any>[]
          ): AsynchronousFileChannel;
          open(
            arg0: java.nio.file.Path,
            ...arg1: java.nio.file.OpenOption[]
          ): AsynchronousFileChannel;
        };
        interface AsynchronousFileChannel extends AsynchronousChannel {
          size(): number;
          truncate(arg0: number): AsynchronousFileChannel;
          force(arg0: boolean): void;
          lock<A>(
            arg0: number,
            arg1: number,
            arg2: boolean,
            arg3: A,
            arg4: CompletionHandler<FileLock, any>
          ): void;
          lock<A>(arg0: A, arg1: CompletionHandler<FileLock, any>): void;
          lock(
            arg0: number,
            arg1: number,
            arg2: boolean
          ): java.util.concurrent.Future<FileLock>;
          lock(): java.util.concurrent.Future<FileLock>;
          tryLock(arg0: number, arg1: number, arg2: boolean): FileLock;
          tryLock(): FileLock;
          read<A>(
            arg0: java.nio.ByteBuffer,
            arg1: number,
            arg2: A,
            arg3: CompletionHandler<number, any>
          ): void;
          read(
            arg0: java.nio.ByteBuffer,
            arg1: number
          ): java.util.concurrent.Future<number>;
          write<A>(
            arg0: java.nio.ByteBuffer,
            arg1: number,
            arg2: A,
            arg3: CompletionHandler<number, any>
          ): void;
          write(
            arg0: java.nio.ByteBuffer,
            arg1: number
          ): java.util.concurrent.Future<number>;
        }

        const FileChannel$MapMode: JavaClassStatics<false> & {
          readonly READ_ONLY: FileChannel$MapMode;
          readonly READ_WRITE: FileChannel$MapMode;
          readonly PRIVATE: FileChannel$MapMode;
        };
        interface FileChannel$MapMode extends JavaObject {}

        const ReadableByteChannel: JavaInterfaceStatics;
        interface ReadableByteChannel extends Channel {
          read(arg0: java.nio.ByteBuffer): number;
        }

        const WritableByteChannel: JavaInterfaceStatics;
        interface WritableByteChannel extends Channel {
          write(arg0: java.nio.ByteBuffer): number;
        }

        const Channel: JavaInterfaceStatics;
        interface Channel extends java.io.Closeable {
          isOpen(): boolean;
          close(): void;
        }

        const AsynchronousChannel: JavaInterfaceStatics;
        interface AsynchronousChannel extends Channel {
          close(): void;
        }

        const CompletionHandler: JavaInterfaceStatics;
        interface CompletionHandler<V, A> extends JavaObject {
          completed(arg0: V, arg1: A): void;
          failed(arg0: java.lang.Throwable, arg1: A): void;
        }

        const ByteChannel: JavaInterfaceStatics;
        interface ByteChannel
          extends ReadableByteChannel,
            WritableByteChannel {}

        const InterruptibleChannel: JavaInterfaceStatics;
        interface InterruptibleChannel extends Channel {
          close(): void;
        }

        const GatheringByteChannel: JavaInterfaceStatics;
        interface GatheringByteChannel extends WritableByteChannel {
          write(
            arg0: java.nio.ByteBuffer[],
            arg1: number,
            arg2: number
          ): number;
          write(arg0: java.nio.ByteBuffer[]): number;
        }

        const ScatteringByteChannel: JavaInterfaceStatics;
        interface ScatteringByteChannel extends ReadableByteChannel {
          read(arg0: java.nio.ByteBuffer[], arg1: number, arg2: number): number;
          read(arg0: java.nio.ByteBuffer[]): number;
        }

        const FileLock: JavaClassStatics<false>;
        interface FileLock extends java.lang.AutoCloseable {
          channel(): FileChannel;
          acquiredBy(): Channel;
          position(): number;
          size(): number;
          isShared(): boolean;
          overlaps(arg0: number, arg1: number): boolean;
          isValid(): boolean;
          release(): void;
          close(): void;
        }

        const SocketChannel: JavaClassStatics<false> & {
          open(): SocketChannel;
          open(arg0: java.net.ProtocolFamily): SocketChannel;
          open(arg0: java.net.SocketAddress): SocketChannel;
        };
        interface SocketChannel
          extends java.nio.channels.spi.AbstractSelectableChannel,
            ByteChannel,
            ScatteringByteChannel,
            GatheringByteChannel,
            NetworkChannel {
          validOps(): number;
          bind(arg0: java.net.SocketAddress): SocketChannel;
          setOption<T>(arg0: java.net.SocketOption<T>, arg1: T): SocketChannel;
          shutdownInput(): SocketChannel;
          shutdownOutput(): SocketChannel;
          socket(): java.net.Socket;
          isConnected(): boolean;
          isConnectionPending(): boolean;
          connect(arg0: java.net.SocketAddress): boolean;
          finishConnect(): boolean;
          getRemoteAddress(): java.net.SocketAddress;
          read(arg0: java.nio.ByteBuffer): number;
          read(arg0: java.nio.ByteBuffer[], arg1: number, arg2: number): number;
          read(arg0: java.nio.ByteBuffer[]): number;
          write(arg0: java.nio.ByteBuffer): number;
          write(
            arg0: java.nio.ByteBuffer[],
            arg1: number,
            arg2: number
          ): number;
          write(arg0: java.nio.ByteBuffer[]): number;
          getLocalAddress(): java.net.SocketAddress;
        }

        const Selector: JavaClassStatics<false> & {
          open(): Selector;
        };
        interface Selector extends java.io.Closeable {
          isOpen(): boolean;
          provider(): java.nio.channels.spi.SelectorProvider;
          keys(): JavaSet<SelectionKey>;
          selectedKeys(): JavaSet<SelectionKey>;
          selectNow(): number;
          select(arg0: number): number;
          select(): number;
          select(
            arg0: java.util.function.Consumer<SelectionKey>,
            arg1: number
          ): number;
          select(arg0: java.util.function.Consumer<SelectionKey>): number;
          selectNow(arg0: java.util.function.Consumer<SelectionKey>): number;
          wakeup(): Selector;
          close(): void;
        }

        const DatagramChannel: JavaClassStatics<false> & {
          open(): DatagramChannel;
          open(arg0: java.net.ProtocolFamily): DatagramChannel;
        };
        interface DatagramChannel
          extends java.nio.channels.spi.AbstractSelectableChannel,
            ByteChannel,
            ScatteringByteChannel,
            GatheringByteChannel,
            MulticastChannel {
          validOps(): number;
          bind(arg0: java.net.SocketAddress): DatagramChannel;
          setOption<T>(
            arg0: java.net.SocketOption<T>,
            arg1: T
          ): DatagramChannel;
          socket(): java.net.DatagramSocket;
          isConnected(): boolean;
          connect(arg0: java.net.SocketAddress): DatagramChannel;
          disconnect(): DatagramChannel;
          getRemoteAddress(): java.net.SocketAddress;
          receive(arg0: java.nio.ByteBuffer): java.net.SocketAddress;
          send(arg0: java.nio.ByteBuffer, arg1: java.net.SocketAddress): number;
          read(arg0: java.nio.ByteBuffer): number;
          read(arg0: java.nio.ByteBuffer[], arg1: number, arg2: number): number;
          read(arg0: java.nio.ByteBuffer[]): number;
          write(arg0: java.nio.ByteBuffer): number;
          write(
            arg0: java.nio.ByteBuffer[],
            arg1: number,
            arg2: number
          ): number;
          write(arg0: java.nio.ByteBuffer[]): number;
          getLocalAddress(): java.net.SocketAddress;
        }

        const SelectionKey: JavaClassStatics<false> & {
          readonly OP_READ: number;
          readonly OP_WRITE: number;
          readonly OP_CONNECT: number;
          readonly OP_ACCEPT: number;
        };
        interface SelectionKey extends JavaObject {
          channel(): SelectableChannel;
          selector(): Selector;
          isValid(): boolean;
          cancel(): void;
          interestOps(): number;
          interestOps(arg0: number): SelectionKey;
          interestOpsOr(arg0: number): number;
          interestOpsAnd(arg0: number): number;
          readyOps(): number;
          isReadable(): boolean;
          isWritable(): boolean;
          isConnectable(): boolean;
          isAcceptable(): boolean;
          attach(arg0: any): any;
          attachment(): any;
        }

        const SelectableChannel: JavaClassStatics<false>;
        interface SelectableChannel
          extends java.nio.channels.spi.AbstractInterruptibleChannel,
            Channel {
          provider(): java.nio.channels.spi.SelectorProvider;
          validOps(): number;
          isRegistered(): boolean;
          keyFor(arg0: Selector): SelectionKey;
          register(arg0: Selector, arg1: number, arg2: any): SelectionKey;
          register(arg0: Selector, arg1: number): SelectionKey;
          configureBlocking(arg0: boolean): SelectableChannel;
          isBlocking(): boolean;
          blockingLock(): any;
        }

        const Pipe: JavaClassStatics<false> & {
          open(): Pipe;
        };
        interface Pipe extends JavaObject {
          source(): Pipe$SourceChannel;
          sink(): Pipe$SinkChannel;
        }

        const ServerSocketChannel: JavaClassStatics<false> & {
          open(): ServerSocketChannel;
          open(arg0: java.net.ProtocolFamily): ServerSocketChannel;
        };
        interface ServerSocketChannel
          extends java.nio.channels.spi.AbstractSelectableChannel,
            NetworkChannel {
          validOps(): number;
          bind(arg0: java.net.SocketAddress): ServerSocketChannel;
          bind(arg0: java.net.SocketAddress, arg1: number): ServerSocketChannel;
          setOption<T>(
            arg0: java.net.SocketOption<T>,
            arg1: T
          ): ServerSocketChannel;
          socket(): java.net.ServerSocket;
          accept(): SocketChannel;
          getLocalAddress(): java.net.SocketAddress;
        }

        const NetworkChannel: JavaInterfaceStatics;
        interface NetworkChannel extends Channel {
          bind(arg0: java.net.SocketAddress): NetworkChannel;
          getLocalAddress(): java.net.SocketAddress;
          setOption<T>(arg0: java.net.SocketOption<T>, arg1: T): NetworkChannel;
          getOption<T>(arg0: java.net.SocketOption<T>): T;
          supportedOptions(): JavaSet<java.net.SocketOption<any>>;
        }

        const Pipe$SourceChannel: JavaClassStatics<false>;
        interface Pipe$SourceChannel
          extends java.nio.channels.spi.AbstractSelectableChannel,
            ReadableByteChannel,
            ScatteringByteChannel {
          validOps(): number;
        }

        const MulticastChannel: JavaInterfaceStatics;
        interface MulticastChannel extends NetworkChannel {
          close(): void;
          join(
            arg0: java.net.InetAddress,
            arg1: java.net.NetworkInterface
          ): MembershipKey;
          join(
            arg0: java.net.InetAddress,
            arg1: java.net.NetworkInterface,
            arg2: java.net.InetAddress
          ): MembershipKey;
        }

        const Pipe$SinkChannel: JavaClassStatics<false>;
        interface Pipe$SinkChannel
          extends java.nio.channels.spi.AbstractSelectableChannel,
            WritableByteChannel,
            GatheringByteChannel {
          validOps(): number;
        }

        const MembershipKey: JavaClassStatics<false>;
        interface MembershipKey extends JavaObject {
          isValid(): boolean;
          drop(): void;
          block(arg0: java.net.InetAddress): MembershipKey;
          unblock(arg0: java.net.InetAddress): MembershipKey;
          channel(): MulticastChannel;
          group(): java.net.InetAddress;
          networkInterface(): java.net.NetworkInterface;
          sourceAddress(): java.net.InetAddress;
        }

        namespace spi {
          const AbstractInterruptibleChannel: JavaClassStatics<false>;
          interface AbstractInterruptibleChannel
            extends java.nio.channels.Channel,
              java.nio.channels.InterruptibleChannel {
            close(): void;
            isOpen(): boolean;
          }

          const AbstractSelectableChannel: JavaClassStatics<false>;
          interface AbstractSelectableChannel
            extends java.nio.channels.SelectableChannel {
            provider(): SelectorProvider;
            isRegistered(): boolean;
            keyFor(
              arg0: java.nio.channels.Selector
            ): java.nio.channels.SelectionKey;
            register(
              arg0: java.nio.channels.Selector,
              arg1: number,
              arg2: any
            ): java.nio.channels.SelectionKey;
            register(
              arg0: java.nio.channels.Selector,
              arg1: number
            ): java.nio.channels.SelectionKey;
            isBlocking(): boolean;
            blockingLock(): any;
            configureBlocking(
              arg0: boolean
            ): java.nio.channels.SelectableChannel;
          }

          const SelectorProvider: JavaClassStatics<false> & {
            provider(): SelectorProvider;
          };
          interface SelectorProvider extends JavaObject {
            openDatagramChannel(): java.nio.channels.DatagramChannel;
            openDatagramChannel(
              arg0: java.net.ProtocolFamily
            ): java.nio.channels.DatagramChannel;
            openPipe(): java.nio.channels.Pipe;
            openSelector(): AbstractSelector;
            openServerSocketChannel(): java.nio.channels.ServerSocketChannel;
            openSocketChannel(): java.nio.channels.SocketChannel;
            inheritedChannel(): java.nio.channels.Channel;
            openSocketChannel(
              arg0: java.net.ProtocolFamily
            ): java.nio.channels.SocketChannel;
            openServerSocketChannel(
              arg0: java.net.ProtocolFamily
            ): java.nio.channels.ServerSocketChannel;
          }

          const AbstractSelector: JavaClassStatics<false>;
          interface AbstractSelector extends java.nio.channels.Selector {
            close(): void;
            isOpen(): boolean;
            provider(): SelectorProvider;
          }

          export {
            AbstractInterruptibleChannel,
            AbstractSelectableChannel,
            SelectorProvider,
            AbstractSelector,
          };
        }

        export {
          SeekableByteChannel,
          FileChannel,
          AsynchronousFileChannel,
          FileChannel$MapMode,
          ReadableByteChannel,
          WritableByteChannel,
          Channel,
          AsynchronousChannel,
          CompletionHandler,
          ByteChannel,
          InterruptibleChannel,
          GatheringByteChannel,
          ScatteringByteChannel,
          FileLock,
          SocketChannel,
          Selector,
          DatagramChannel,
          SelectionKey,
          SelectableChannel,
          Pipe,
          ServerSocketChannel,
          NetworkChannel,
          Pipe$SourceChannel,
          MulticastChannel,
          Pipe$SinkChannel,
          MembershipKey,
          spi,
        };
      }

      export {
        ByteBuffer,
        Buffer,
        FloatBuffer,
        LongBuffer,
        ByteOrder,
        DoubleBuffer,
        ShortBuffer,
        IntBuffer,
        CharBuffer,
        MappedByteBuffer,
        charset,
        file,
        channels,
      };
    }

    namespace security {
      const Principal: JavaInterfaceStatics;
      interface Principal extends JavaObject {
        getName(): string;
        implies(arg0: javax.security.auth.Subject): boolean;
      }

      const PrivilegedAction: JavaInterfaceStatics;
      interface PrivilegedAction<T> extends JavaObject {
        run(): T;
      }

      const PrivilegedExceptionAction: JavaInterfaceStatics;
      interface PrivilegedExceptionAction<T> extends JavaObject {
        run(): T;
      }

      /** @deprecated */
      const AccessControlContext: JavaClassStatics<{
        new (arg0: ProtectionDomain[]): AccessControlContext;
        new (
          arg0: AccessControlContext,
          arg1: DomainCombiner
        ): AccessControlContext;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface AccessControlContext extends JavaObject {
        getDomainCombiner(): DomainCombiner;
        checkPermission(arg0: Permission): void;
      }

      const ProtectionDomain: JavaClassStatics<{
        new (arg0: CodeSource, arg1: PermissionCollection): ProtectionDomain;
        new (
          arg0: CodeSource,
          arg1: PermissionCollection,
          arg2: java.lang.ClassLoader,
          arg3: Principal[]
        ): ProtectionDomain;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface ProtectionDomain extends JavaObject {
        getCodeSource(): CodeSource;
        getClassLoader(): java.lang.ClassLoader;
        getPrincipals(): Principal[];
        getPermissions(): PermissionCollection;
        staticPermissionsOnly(): boolean;
        implies(arg0: Permission): boolean;
      }

      const PermissionCollection: JavaClassStatics<[PermissionCollection]>;
      interface PermissionCollection extends java.io.Serializable {
        add(arg0: Permission): void;
        implies(arg0: Permission): boolean;
        elements(): java.util.Enumeration<Permission>;
        elementsAsStream(): java.util.stream.Stream<Permission>;
        setReadOnly(): void;
        isReadOnly(): boolean;
      }

      const CodeSource: JavaClassStatics<{
        new (
          arg0: java.net.URL,
          arg1: java.security.cert.Certificate[]
        ): CodeSource;
        new (arg0: java.net.URL, arg1: CodeSigner[]): CodeSource;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface CodeSource extends java.io.Serializable {
        getLocation(): java.net.URL;
        getCertificates(): java.security.cert.Certificate[];
        getCodeSigners(): CodeSigner[];
        implies(arg0: CodeSource): boolean;
      }

      const Permission: JavaClassStatics<[Permission], [arg0: string]>;
      interface Permission extends Guard, java.io.Serializable {
        checkGuard(arg0: any): void;
        implies(arg0: Permission): boolean;
        getName(): string;
        getActions(): string;
        newPermissionCollection(): PermissionCollection;
      }

      /** @deprecated */
      const DomainCombiner: JavaInterfaceStatics;
      interface DomainCombiner extends JavaObject {
        combine(
          arg0: ProtectionDomain[],
          arg1: ProtectionDomain[]
        ): ProtectionDomain[];
      }

      const CodeSigner: JavaClassStatics<
        [CodeSigner],
        [arg0: java.security.cert.CertPath, arg1: Timestamp]
      >;
      interface CodeSigner extends java.io.Serializable {
        getSignerCertPath(): java.security.cert.CertPath;
        getTimestamp(): Timestamp;
      }

      const Guard: JavaInterfaceStatics;
      interface Guard extends JavaObject {
        checkGuard(arg0: any): void;
      }

      const Provider: JavaClassStatics<false>;
      interface Provider extends java.util.Properties {
        configure(arg0: string): Provider;
        isConfigured(): boolean;
        getName(): string;
        /** @deprecated */
        getVersion(): number;
        getVersionStr(): string;
        getInfo(): string;
        clear(): void;
        load(arg0: java.io.InputStream): void;
        load(arg0: java.io.Reader): void;
        putAll(arg0: JavaMap<any, any>): void;
        entrySet(): JavaSet<java.util.Map$Entry<any, any>>;
        keySet(): JavaSet<any>;
        values(): JavaCollection<any>;
        put(arg0: any, arg1: any): any;
        putIfAbsent(arg0: any, arg1: any): any;
        remove(arg0: any): any;
        remove(arg0: any, arg1: any): boolean;
        replace(arg0: any, arg1: any, arg2: any): boolean;
        replace(arg0: any, arg1: any): any;
        replaceAll(arg0: java.util.function.BiFunction<any, any, any>): void;
        compute(
          arg0: any,
          arg1: java.util.function.BiFunction<any, any, any>
        ): any;
        computeIfAbsent(
          arg0: any,
          arg1: java.util.function.Function<any, any>
        ): any;
        computeIfPresent(
          arg0: any,
          arg1: java.util.function.BiFunction<any, any, any>
        ): any;
        merge(
          arg0: any,
          arg1: any,
          arg2: java.util.function.BiFunction<any, any, any>
        ): any;
        get(arg0: any): any;
        getOrDefault(arg0: any, arg1: any): any;
        forEach(arg0: java.util.function.BiConsumer<any, any>): void;
        keys(): java.util.Enumeration<any>;
        elements(): java.util.Enumeration<any>;
        getProperty(arg0: string): string;
        getProperty(arg0: string, arg1: string): string;
        getService(arg0: string, arg1: string): Provider$Service;
        getServices(): JavaSet<Provider$Service>;
      }

      const PublicKey: JavaInterfaceStatics & {
        /** @deprecated */
        readonly serialVersionUID: number;
      };
      interface PublicKey extends Key {}

      const Key: JavaInterfaceStatics & {
        /** @deprecated */
        readonly serialVersionUID: number;
      };
      interface Key extends java.io.Serializable {
        getAlgorithm(): string;
        getFormat(): string;
        getEncoded(): number[];
      }

      const Provider$Service: JavaClassStatics<
        [Provider$Service],
        [
          arg0: Provider,
          arg1: string,
          arg2: string,
          arg3: string,
          arg4: JavaList<string>,
          arg5: JavaMap<string, string>
        ]
      >;
      interface Provider$Service extends JavaObject {
        getType(): string;
        getAlgorithm(): string;
        getProvider(): Provider;
        getClassName(): string;
        getAttribute(arg0: string): string;
        newInstance(arg0: any): any;
        supportsParameter(arg0: any): boolean;
      }

      const Timestamp: JavaClassStatics<
        [Timestamp],
        [arg0: java.util.Date, arg1: java.security.cert.CertPath]
      >;
      interface Timestamp extends java.io.Serializable {
        getTimestamp(): java.util.Date;
        getSignerCertPath(): java.security.cert.CertPath;
      }

      namespace cert {
        const Certificate: JavaClassStatics<false>;
        interface Certificate extends java.io.Serializable {
          getType(): string;
          getEncoded(): number[];
          verify(arg0: java.security.PublicKey): void;
          verify(arg0: java.security.PublicKey, arg1: string): void;
          verify(
            arg0: java.security.PublicKey,
            arg1: java.security.Provider
          ): void;
          getPublicKey(): java.security.PublicKey;
        }

        const CertPath: JavaClassStatics<false>;
        interface CertPath extends java.io.Serializable {
          getType(): string;
          getEncodings(): java.util.Iterator<string>;
          getEncoded(): number[];
          getEncoded(arg0: string): number[];
          getCertificates(): JavaList<any>;
        }

        export { Certificate, CertPath };
      }

      export {
        Principal,
        PrivilegedAction,
        PrivilegedExceptionAction,
        AccessControlContext,
        ProtectionDomain,
        PermissionCollection,
        CodeSource,
        Permission,
        DomainCombiner,
        CodeSigner,
        Guard,
        Provider,
        PublicKey,
        Key,
        Provider$Service,
        Timestamp,
        cert,
      };
    }

    namespace time {
      const Duration: JavaClassStatics<false> & {
        readonly ZERO: Duration;

        ofDays(arg0: number): Duration;
        ofHours(arg0: number): Duration;
        ofMinutes(arg0: number): Duration;
        ofSeconds(arg0: number): Duration;
        ofSeconds(arg0: number, arg1: number): Duration;
        ofMillis(arg0: number): Duration;
        ofNanos(arg0: number): Duration;
        of(arg0: number, arg1: java.time.temporal.TemporalUnit): Duration;
        from(arg0: java.time.temporal.TemporalAmount): Duration;
        parse(arg0: java.lang.CharSequence): Duration;
        between(
          arg0: java.time.temporal.Temporal,
          arg1: java.time.temporal.Temporal
        ): Duration;
      };
      interface Duration
        extends java.time.temporal.TemporalAmount,
          java.lang.Comparable<Duration>,
          java.io.Serializable {
        get(arg0: java.time.temporal.TemporalUnit): number;
        getUnits(): JavaList<java.time.temporal.TemporalUnit>;
        isZero(): boolean;
        isNegative(): boolean;
        getSeconds(): number;
        getNano(): number;
        withSeconds(arg0: number): Duration;
        withNanos(arg0: number): Duration;
        plus(arg0: Duration): Duration;
        plus(arg0: number, arg1: java.time.temporal.TemporalUnit): Duration;
        plusDays(arg0: number): Duration;
        plusHours(arg0: number): Duration;
        plusMinutes(arg0: number): Duration;
        plusSeconds(arg0: number): Duration;
        plusMillis(arg0: number): Duration;
        plusNanos(arg0: number): Duration;
        minus(arg0: Duration): Duration;
        minus(arg0: number, arg1: java.time.temporal.TemporalUnit): Duration;
        minusDays(arg0: number): Duration;
        minusHours(arg0: number): Duration;
        minusMinutes(arg0: number): Duration;
        minusSeconds(arg0: number): Duration;
        minusMillis(arg0: number): Duration;
        minusNanos(arg0: number): Duration;
        multipliedBy(arg0: number): Duration;
        dividedBy(arg0: number): Duration;
        dividedBy(arg0: Duration): number;
        negated(): Duration;
        abs(): Duration;
        addTo(arg0: java.time.temporal.Temporal): java.time.temporal.Temporal;
        subtractFrom(
          arg0: java.time.temporal.Temporal
        ): java.time.temporal.Temporal;
        toDays(): number;
        toHours(): number;
        toMinutes(): number;
        toSeconds(): number;
        toMillis(): number;
        toNanos(): number;
        toDaysPart(): number;
        toHoursPart(): number;
        toMinutesPart(): number;
        toSecondsPart(): number;
        toMillisPart(): number;
        toNanosPart(): number;
        truncatedTo(arg0: java.time.temporal.TemporalUnit): Duration;
        compareTo(arg0: Duration): number;
      }

      const Instant: JavaClassStatics<false> & {
        readonly EPOCH: Instant;
        readonly MIN: Instant;
        readonly MAX: Instant;

        now(): Instant;
        now(arg0: Clock): Instant;
        ofEpochSecond(arg0: number): Instant;
        ofEpochSecond(arg0: number, arg1: number): Instant;
        ofEpochMilli(arg0: number): Instant;
        from(arg0: java.time.temporal.TemporalAccessor): Instant;
        parse(arg0: java.lang.CharSequence): Instant;
      };
      interface Instant
        extends java.time.temporal.Temporal,
          java.time.temporal.TemporalAdjuster,
          java.lang.Comparable<Instant>,
          java.io.Serializable {
        isSupported(arg0: java.time.temporal.TemporalField): boolean;
        isSupported(arg0: java.time.temporal.TemporalUnit): boolean;
        range(
          arg0: java.time.temporal.TemporalField
        ): java.time.temporal.ValueRange;
        get(arg0: java.time.temporal.TemporalField): number;
        getLong(arg0: java.time.temporal.TemporalField): number;
        getEpochSecond(): number;
        getNano(): number;
        with(arg0: java.time.temporal.TemporalAdjuster): Instant;
        with(arg0: java.time.temporal.TemporalField, arg1: number): Instant;
        truncatedTo(arg0: java.time.temporal.TemporalUnit): Instant;
        plus(arg0: java.time.temporal.TemporalAmount): Instant;
        plus(arg0: number, arg1: java.time.temporal.TemporalUnit): Instant;
        plusSeconds(arg0: number): Instant;
        plusMillis(arg0: number): Instant;
        plusNanos(arg0: number): Instant;
        minus(arg0: java.time.temporal.TemporalAmount): Instant;
        minus(arg0: number, arg1: java.time.temporal.TemporalUnit): Instant;
        minusSeconds(arg0: number): Instant;
        minusMillis(arg0: number): Instant;
        minusNanos(arg0: number): Instant;
        query<R>(arg0: java.time.temporal.TemporalQuery<R>): R;
        adjustInto(
          arg0: java.time.temporal.Temporal
        ): java.time.temporal.Temporal;
        until(
          arg0: java.time.temporal.Temporal,
          arg1: java.time.temporal.TemporalUnit
        ): number;
        atOffset(arg0: ZoneOffset): OffsetDateTime;
        atZone(arg0: ZoneId): ZonedDateTime;
        toEpochMilli(): number;
        compareTo(arg0: Instant): number;
        isAfter(arg0: Instant): boolean;
        isBefore(arg0: Instant): boolean;
      }

      const ZoneOffset: JavaClassStatics<false> & {
        readonly UTC: ZoneOffset;
        readonly MIN: ZoneOffset;
        readonly MAX: ZoneOffset;

        of(arg0: string): ZoneOffset;
        ofHours(arg0: number): ZoneOffset;
        ofHoursMinutes(arg0: number, arg1: number): ZoneOffset;
        ofHoursMinutesSeconds(
          arg0: number,
          arg1: number,
          arg2: number
        ): ZoneOffset;
        from(arg0: java.time.temporal.TemporalAccessor): ZoneOffset;
        ofTotalSeconds(arg0: number): ZoneOffset;
      };
      interface ZoneOffset
        extends ZoneId,
          java.time.temporal.TemporalAccessor,
          java.time.temporal.TemporalAdjuster,
          java.lang.Comparable<ZoneOffset>,
          java.io.Serializable {
        getTotalSeconds(): number;
        getId(): string;
        getRules(): java.time.zone.ZoneRules;
        isSupported(arg0: java.time.temporal.TemporalField): boolean;
        range(
          arg0: java.time.temporal.TemporalField
        ): java.time.temporal.ValueRange;
        get(arg0: java.time.temporal.TemporalField): number;
        getLong(arg0: java.time.temporal.TemporalField): number;
        query<R>(arg0: java.time.temporal.TemporalQuery<R>): R;
        adjustInto(
          arg0: java.time.temporal.Temporal
        ): java.time.temporal.Temporal;
        compareTo(arg0: ZoneOffset): number;
      }

      const ZonedDateTime: JavaClassStatics<false> & {
        now(): ZonedDateTime;
        now(arg0: ZoneId): ZonedDateTime;
        now(arg0: Clock): ZonedDateTime;
        of(arg0: LocalDate, arg1: LocalTime, arg2: ZoneId): ZonedDateTime;
        of(arg0: LocalDateTime, arg1: ZoneId): ZonedDateTime;
        of(
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: number,
          arg4: number,
          arg5: number,
          arg6: number,
          arg7: ZoneId
        ): ZonedDateTime;
        ofLocal(
          arg0: LocalDateTime,
          arg1: ZoneId,
          arg2: ZoneOffset
        ): ZonedDateTime;
        ofInstant(arg0: Instant, arg1: ZoneId): ZonedDateTime;
        ofInstant(
          arg0: LocalDateTime,
          arg1: ZoneOffset,
          arg2: ZoneId
        ): ZonedDateTime;
        ofStrict(
          arg0: LocalDateTime,
          arg1: ZoneOffset,
          arg2: ZoneId
        ): ZonedDateTime;
        from(arg0: java.time.temporal.TemporalAccessor): ZonedDateTime;
        parse(arg0: java.lang.CharSequence): ZonedDateTime;
        parse(
          arg0: java.lang.CharSequence,
          arg1: java.time.format.DateTimeFormatter
        ): ZonedDateTime;
      };
      interface ZonedDateTime
        extends java.time.temporal.Temporal,
          java.time.chrono.ChronoZonedDateTime<LocalDate>,
          java.io.Serializable {
        isSupported(arg0: java.time.temporal.TemporalField): boolean;
        isSupported(arg0: java.time.temporal.TemporalUnit): boolean;
        range(
          arg0: java.time.temporal.TemporalField
        ): java.time.temporal.ValueRange;
        get(arg0: java.time.temporal.TemporalField): number;
        getLong(arg0: java.time.temporal.TemporalField): number;
        getOffset(): ZoneOffset;
        withEarlierOffsetAtOverlap(): ZonedDateTime;
        withLaterOffsetAtOverlap(): ZonedDateTime;
        getZone(): ZoneId;
        withZoneSameLocal(arg0: ZoneId): ZonedDateTime;
        withZoneSameInstant(arg0: ZoneId): ZonedDateTime;
        withFixedOffsetZone(): ZonedDateTime;
        toLocalDateTime(): LocalDateTime;
        toLocalDate(): LocalDate;
        getYear(): number;
        getMonthValue(): number;
        getMonth(): Month;
        getDayOfMonth(): number;
        getDayOfYear(): number;
        getDayOfWeek(): DayOfWeek;
        toLocalTime(): LocalTime;
        getHour(): number;
        getMinute(): number;
        getSecond(): number;
        getNano(): number;
        with(arg0: java.time.temporal.TemporalAdjuster): ZonedDateTime;
        with(
          arg0: java.time.temporal.TemporalField,
          arg1: number
        ): ZonedDateTime;
        withYear(arg0: number): ZonedDateTime;
        withMonth(arg0: number): ZonedDateTime;
        withDayOfMonth(arg0: number): ZonedDateTime;
        withDayOfYear(arg0: number): ZonedDateTime;
        withHour(arg0: number): ZonedDateTime;
        withMinute(arg0: number): ZonedDateTime;
        withSecond(arg0: number): ZonedDateTime;
        withNano(arg0: number): ZonedDateTime;
        truncatedTo(arg0: java.time.temporal.TemporalUnit): ZonedDateTime;
        plus(arg0: java.time.temporal.TemporalAmount): ZonedDateTime;
        plus(
          arg0: number,
          arg1: java.time.temporal.TemporalUnit
        ): ZonedDateTime;
        plusYears(arg0: number): ZonedDateTime;
        plusMonths(arg0: number): ZonedDateTime;
        plusWeeks(arg0: number): ZonedDateTime;
        plusDays(arg0: number): ZonedDateTime;
        plusHours(arg0: number): ZonedDateTime;
        plusMinutes(arg0: number): ZonedDateTime;
        plusSeconds(arg0: number): ZonedDateTime;
        plusNanos(arg0: number): ZonedDateTime;
        minus(arg0: java.time.temporal.TemporalAmount): ZonedDateTime;
        minus(
          arg0: number,
          arg1: java.time.temporal.TemporalUnit
        ): ZonedDateTime;
        minusYears(arg0: number): ZonedDateTime;
        minusMonths(arg0: number): ZonedDateTime;
        minusWeeks(arg0: number): ZonedDateTime;
        minusDays(arg0: number): ZonedDateTime;
        minusHours(arg0: number): ZonedDateTime;
        minusMinutes(arg0: number): ZonedDateTime;
        minusSeconds(arg0: number): ZonedDateTime;
        minusNanos(arg0: number): ZonedDateTime;
        query<R>(arg0: java.time.temporal.TemporalQuery<R>): R;
        until(
          arg0: java.time.temporal.Temporal,
          arg1: java.time.temporal.TemporalUnit
        ): number;
        format(arg0: java.time.format.DateTimeFormatter): string;
        toOffsetDateTime(): OffsetDateTime;
      }

      const OffsetDateTime: JavaClassStatics<false> & {
        readonly MIN: OffsetDateTime;
        readonly MAX: OffsetDateTime;

        timeLineOrder(): java.util.Comparator<OffsetDateTime>;
        now(): OffsetDateTime;
        now(arg0: ZoneId): OffsetDateTime;
        now(arg0: Clock): OffsetDateTime;
        of(arg0: LocalDate, arg1: LocalTime, arg2: ZoneOffset): OffsetDateTime;
        of(arg0: LocalDateTime, arg1: ZoneOffset): OffsetDateTime;
        of(
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: number,
          arg4: number,
          arg5: number,
          arg6: number,
          arg7: ZoneOffset
        ): OffsetDateTime;
        ofInstant(arg0: Instant, arg1: ZoneId): OffsetDateTime;
        from(arg0: java.time.temporal.TemporalAccessor): OffsetDateTime;
        parse(arg0: java.lang.CharSequence): OffsetDateTime;
        parse(
          arg0: java.lang.CharSequence,
          arg1: java.time.format.DateTimeFormatter
        ): OffsetDateTime;
      };
      interface OffsetDateTime
        extends java.time.temporal.Temporal,
          java.time.temporal.TemporalAdjuster,
          java.lang.Comparable<OffsetDateTime>,
          java.io.Serializable {
        isSupported(arg0: java.time.temporal.TemporalField): boolean;
        isSupported(arg0: java.time.temporal.TemporalUnit): boolean;
        range(
          arg0: java.time.temporal.TemporalField
        ): java.time.temporal.ValueRange;
        get(arg0: java.time.temporal.TemporalField): number;
        getLong(arg0: java.time.temporal.TemporalField): number;
        getOffset(): ZoneOffset;
        withOffsetSameLocal(arg0: ZoneOffset): OffsetDateTime;
        withOffsetSameInstant(arg0: ZoneOffset): OffsetDateTime;
        toLocalDateTime(): LocalDateTime;
        toLocalDate(): LocalDate;
        getYear(): number;
        getMonthValue(): number;
        getMonth(): Month;
        getDayOfMonth(): number;
        getDayOfYear(): number;
        getDayOfWeek(): DayOfWeek;
        toLocalTime(): LocalTime;
        getHour(): number;
        getMinute(): number;
        getSecond(): number;
        getNano(): number;
        with(arg0: java.time.temporal.TemporalAdjuster): OffsetDateTime;
        with(
          arg0: java.time.temporal.TemporalField,
          arg1: number
        ): OffsetDateTime;
        withYear(arg0: number): OffsetDateTime;
        withMonth(arg0: number): OffsetDateTime;
        withDayOfMonth(arg0: number): OffsetDateTime;
        withDayOfYear(arg0: number): OffsetDateTime;
        withHour(arg0: number): OffsetDateTime;
        withMinute(arg0: number): OffsetDateTime;
        withSecond(arg0: number): OffsetDateTime;
        withNano(arg0: number): OffsetDateTime;
        truncatedTo(arg0: java.time.temporal.TemporalUnit): OffsetDateTime;
        plus(arg0: java.time.temporal.TemporalAmount): OffsetDateTime;
        plus(
          arg0: number,
          arg1: java.time.temporal.TemporalUnit
        ): OffsetDateTime;
        plusYears(arg0: number): OffsetDateTime;
        plusMonths(arg0: number): OffsetDateTime;
        plusWeeks(arg0: number): OffsetDateTime;
        plusDays(arg0: number): OffsetDateTime;
        plusHours(arg0: number): OffsetDateTime;
        plusMinutes(arg0: number): OffsetDateTime;
        plusSeconds(arg0: number): OffsetDateTime;
        plusNanos(arg0: number): OffsetDateTime;
        minus(arg0: java.time.temporal.TemporalAmount): OffsetDateTime;
        minus(
          arg0: number,
          arg1: java.time.temporal.TemporalUnit
        ): OffsetDateTime;
        minusYears(arg0: number): OffsetDateTime;
        minusMonths(arg0: number): OffsetDateTime;
        minusWeeks(arg0: number): OffsetDateTime;
        minusDays(arg0: number): OffsetDateTime;
        minusHours(arg0: number): OffsetDateTime;
        minusMinutes(arg0: number): OffsetDateTime;
        minusSeconds(arg0: number): OffsetDateTime;
        minusNanos(arg0: number): OffsetDateTime;
        query<R>(arg0: java.time.temporal.TemporalQuery<R>): R;
        adjustInto(
          arg0: java.time.temporal.Temporal
        ): java.time.temporal.Temporal;
        until(
          arg0: java.time.temporal.Temporal,
          arg1: java.time.temporal.TemporalUnit
        ): number;
        format(arg0: java.time.format.DateTimeFormatter): string;
        atZoneSameInstant(arg0: ZoneId): ZonedDateTime;
        atZoneSimilarLocal(arg0: ZoneId): ZonedDateTime;
        toOffsetTime(): OffsetTime;
        toZonedDateTime(): ZonedDateTime;
        toInstant(): Instant;
        toEpochSecond(): number;
        compareTo(arg0: OffsetDateTime): number;
        isAfter(arg0: OffsetDateTime): boolean;
        isBefore(arg0: OffsetDateTime): boolean;
        isEqual(arg0: OffsetDateTime): boolean;
      }

      const Clock: JavaClassStatics<false> & {
        systemUTC(): Clock;
        systemDefaultZone(): Clock;
        system(arg0: ZoneId): Clock;
        tickMillis(arg0: ZoneId): Clock;
        tickSeconds(arg0: ZoneId): Clock;
        tickMinutes(arg0: ZoneId): Clock;
        tick(arg0: Clock, arg1: Duration): Clock;
        fixed(arg0: Instant, arg1: ZoneId): Clock;
        offset(arg0: Clock, arg1: Duration): Clock;
      };
      interface Clock extends InstantSource {
        getZone(): ZoneId;
        withZone(arg0: ZoneId): Clock;
        millis(): number;
        instant(): Instant;
      }

      const ZoneId: JavaClassStatics<false> & {
        readonly SHORT_IDS: JavaMap<string, string>;

        systemDefault(): ZoneId;
        getAvailableZoneIds(): JavaSet<string>;
        of(arg0: string, arg1: JavaMap<string, string>): ZoneId;
        of(arg0: string): ZoneId;
        ofOffset(arg0: string, arg1: ZoneOffset): ZoneId;
        from(arg0: java.time.temporal.TemporalAccessor): ZoneId;
      };
      interface ZoneId extends java.io.Serializable {
        getId(): string;
        getDisplayName(
          arg0: java.time.format.TextStyle,
          arg1: java.util.Locale
        ): string;
        getRules(): java.time.zone.ZoneRules;
        normalized(): ZoneId;
      }

      const LocalTime: JavaClassStatics<false> & {
        readonly MIN: LocalTime;
        readonly MAX: LocalTime;
        readonly MIDNIGHT: LocalTime;
        readonly NOON: LocalTime;

        now(): LocalTime;
        now(arg0: ZoneId): LocalTime;
        now(arg0: Clock): LocalTime;
        of(arg0: number, arg1: number): LocalTime;
        of(arg0: number, arg1: number, arg2: number): LocalTime;
        of(arg0: number, arg1: number, arg2: number, arg3: number): LocalTime;
        ofInstant(arg0: Instant, arg1: ZoneId): LocalTime;
        ofSecondOfDay(arg0: number): LocalTime;
        ofNanoOfDay(arg0: number): LocalTime;
        from(arg0: java.time.temporal.TemporalAccessor): LocalTime;
        parse(arg0: java.lang.CharSequence): LocalTime;
        parse(
          arg0: java.lang.CharSequence,
          arg1: java.time.format.DateTimeFormatter
        ): LocalTime;
      };
      interface LocalTime
        extends java.time.temporal.Temporal,
          java.time.temporal.TemporalAdjuster,
          java.lang.Comparable<LocalTime>,
          java.io.Serializable {
        isSupported(arg0: java.time.temporal.TemporalField): boolean;
        isSupported(arg0: java.time.temporal.TemporalUnit): boolean;
        range(
          arg0: java.time.temporal.TemporalField
        ): java.time.temporal.ValueRange;
        get(arg0: java.time.temporal.TemporalField): number;
        getLong(arg0: java.time.temporal.TemporalField): number;
        getHour(): number;
        getMinute(): number;
        getSecond(): number;
        getNano(): number;
        with(arg0: java.time.temporal.TemporalAdjuster): LocalTime;
        with(arg0: java.time.temporal.TemporalField, arg1: number): LocalTime;
        withHour(arg0: number): LocalTime;
        withMinute(arg0: number): LocalTime;
        withSecond(arg0: number): LocalTime;
        withNano(arg0: number): LocalTime;
        truncatedTo(arg0: java.time.temporal.TemporalUnit): LocalTime;
        plus(arg0: java.time.temporal.TemporalAmount): LocalTime;
        plus(arg0: number, arg1: java.time.temporal.TemporalUnit): LocalTime;
        plusHours(arg0: number): LocalTime;
        plusMinutes(arg0: number): LocalTime;
        plusSeconds(arg0: number): LocalTime;
        plusNanos(arg0: number): LocalTime;
        minus(arg0: java.time.temporal.TemporalAmount): LocalTime;
        minus(arg0: number, arg1: java.time.temporal.TemporalUnit): LocalTime;
        minusHours(arg0: number): LocalTime;
        minusMinutes(arg0: number): LocalTime;
        minusSeconds(arg0: number): LocalTime;
        minusNanos(arg0: number): LocalTime;
        query<R>(arg0: java.time.temporal.TemporalQuery<R>): R;
        adjustInto(
          arg0: java.time.temporal.Temporal
        ): java.time.temporal.Temporal;
        until(
          arg0: java.time.temporal.Temporal,
          arg1: java.time.temporal.TemporalUnit
        ): number;
        format(arg0: java.time.format.DateTimeFormatter): string;
        atDate(arg0: LocalDate): LocalDateTime;
        atOffset(arg0: ZoneOffset): OffsetTime;
        toSecondOfDay(): number;
        toNanoOfDay(): number;
        toEpochSecond(arg0: LocalDate, arg1: ZoneOffset): number;
        compareTo(arg0: LocalTime): number;
        isAfter(arg0: LocalTime): boolean;
        isBefore(arg0: LocalTime): boolean;
      }

      const LocalDateTime: JavaClassStatics<false> & {
        readonly MIN: LocalDateTime;
        readonly MAX: LocalDateTime;

        now(): LocalDateTime;
        now(arg0: ZoneId): LocalDateTime;
        now(arg0: Clock): LocalDateTime;
        of(
          arg0: number,
          arg1: Month,
          arg2: number,
          arg3: number,
          arg4: number
        ): LocalDateTime;
        of(
          arg0: number,
          arg1: Month,
          arg2: number,
          arg3: number,
          arg4: number,
          arg5: number
        ): LocalDateTime;
        of(
          arg0: number,
          arg1: Month,
          arg2: number,
          arg3: number,
          arg4: number,
          arg5: number,
          arg6: number
        ): LocalDateTime;
        of(
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: number,
          arg4: number
        ): LocalDateTime;
        of(
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: number,
          arg4: number,
          arg5: number
        ): LocalDateTime;
        of(
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: number,
          arg4: number,
          arg5: number,
          arg6: number
        ): LocalDateTime;
        of(arg0: LocalDate, arg1: LocalTime): LocalDateTime;
        ofInstant(arg0: Instant, arg1: ZoneId): LocalDateTime;
        ofEpochSecond(
          arg0: number,
          arg1: number,
          arg2: ZoneOffset
        ): LocalDateTime;
        from(arg0: java.time.temporal.TemporalAccessor): LocalDateTime;
        parse(arg0: java.lang.CharSequence): LocalDateTime;
        parse(
          arg0: java.lang.CharSequence,
          arg1: java.time.format.DateTimeFormatter
        ): LocalDateTime;
      };
      interface LocalDateTime
        extends java.time.temporal.Temporal,
          java.time.temporal.TemporalAdjuster,
          java.time.chrono.ChronoLocalDateTime<LocalDate>,
          java.io.Serializable {
        isSupported(arg0: java.time.temporal.TemporalField): boolean;
        isSupported(arg0: java.time.temporal.TemporalUnit): boolean;
        range(
          arg0: java.time.temporal.TemporalField
        ): java.time.temporal.ValueRange;
        get(arg0: java.time.temporal.TemporalField): number;
        getLong(arg0: java.time.temporal.TemporalField): number;
        toLocalDate(): LocalDate;
        getYear(): number;
        getMonthValue(): number;
        getMonth(): Month;
        getDayOfMonth(): number;
        getDayOfYear(): number;
        getDayOfWeek(): DayOfWeek;
        toLocalTime(): LocalTime;
        getHour(): number;
        getMinute(): number;
        getSecond(): number;
        getNano(): number;
        with(arg0: java.time.temporal.TemporalAdjuster): LocalDateTime;
        with(
          arg0: java.time.temporal.TemporalField,
          arg1: number
        ): LocalDateTime;
        withYear(arg0: number): LocalDateTime;
        withMonth(arg0: number): LocalDateTime;
        withDayOfMonth(arg0: number): LocalDateTime;
        withDayOfYear(arg0: number): LocalDateTime;
        withHour(arg0: number): LocalDateTime;
        withMinute(arg0: number): LocalDateTime;
        withSecond(arg0: number): LocalDateTime;
        withNano(arg0: number): LocalDateTime;
        truncatedTo(arg0: java.time.temporal.TemporalUnit): LocalDateTime;
        plus(arg0: java.time.temporal.TemporalAmount): LocalDateTime;
        plus(
          arg0: number,
          arg1: java.time.temporal.TemporalUnit
        ): LocalDateTime;
        plusYears(arg0: number): LocalDateTime;
        plusMonths(arg0: number): LocalDateTime;
        plusWeeks(arg0: number): LocalDateTime;
        plusDays(arg0: number): LocalDateTime;
        plusHours(arg0: number): LocalDateTime;
        plusMinutes(arg0: number): LocalDateTime;
        plusSeconds(arg0: number): LocalDateTime;
        plusNanos(arg0: number): LocalDateTime;
        minus(arg0: java.time.temporal.TemporalAmount): LocalDateTime;
        minus(
          arg0: number,
          arg1: java.time.temporal.TemporalUnit
        ): LocalDateTime;
        minusYears(arg0: number): LocalDateTime;
        minusMonths(arg0: number): LocalDateTime;
        minusWeeks(arg0: number): LocalDateTime;
        minusDays(arg0: number): LocalDateTime;
        minusHours(arg0: number): LocalDateTime;
        minusMinutes(arg0: number): LocalDateTime;
        minusSeconds(arg0: number): LocalDateTime;
        minusNanos(arg0: number): LocalDateTime;
        query<R>(arg0: java.time.temporal.TemporalQuery<R>): R;
        adjustInto(
          arg0: java.time.temporal.Temporal
        ): java.time.temporal.Temporal;
        until(
          arg0: java.time.temporal.Temporal,
          arg1: java.time.temporal.TemporalUnit
        ): number;
        format(arg0: java.time.format.DateTimeFormatter): string;
        atOffset(arg0: ZoneOffset): OffsetDateTime;
        atZone(arg0: ZoneId): ZonedDateTime;
        compareTo(arg0: java.time.chrono.ChronoLocalDateTime<any>): number;
        isAfter(arg0: java.time.chrono.ChronoLocalDateTime<any>): boolean;
        isBefore(arg0: java.time.chrono.ChronoLocalDateTime<any>): boolean;
        isEqual(arg0: java.time.chrono.ChronoLocalDateTime<any>): boolean;
      }

      const LocalDate: JavaClassStatics<false> & {
        readonly MIN: LocalDate;
        readonly MAX: LocalDate;
        readonly EPOCH: LocalDate;

        now(): LocalDate;
        now(arg0: ZoneId): LocalDate;
        now(arg0: Clock): LocalDate;
        of(arg0: number, arg1: Month, arg2: number): LocalDate;
        of(arg0: number, arg1: number, arg2: number): LocalDate;
        ofYearDay(arg0: number, arg1: number): LocalDate;
        ofInstant(arg0: Instant, arg1: ZoneId): LocalDate;
        ofEpochDay(arg0: number): LocalDate;
        from(arg0: java.time.temporal.TemporalAccessor): LocalDate;
        parse(arg0: java.lang.CharSequence): LocalDate;
        parse(
          arg0: java.lang.CharSequence,
          arg1: java.time.format.DateTimeFormatter
        ): LocalDate;
      };
      interface LocalDate
        extends java.time.temporal.Temporal,
          java.time.temporal.TemporalAdjuster,
          java.time.chrono.ChronoLocalDate,
          java.io.Serializable {
        isSupported(arg0: java.time.temporal.TemporalField): boolean;
        isSupported(arg0: java.time.temporal.TemporalUnit): boolean;
        range(
          arg0: java.time.temporal.TemporalField
        ): java.time.temporal.ValueRange;
        get(arg0: java.time.temporal.TemporalField): number;
        getLong(arg0: java.time.temporal.TemporalField): number;
        getChronology(): java.time.chrono.IsoChronology;
        getEra(): java.time.chrono.IsoEra;
        getYear(): number;
        getMonthValue(): number;
        getMonth(): Month;
        getDayOfMonth(): number;
        getDayOfYear(): number;
        getDayOfWeek(): DayOfWeek;
        isLeapYear(): boolean;
        lengthOfMonth(): number;
        lengthOfYear(): number;
        with(arg0: java.time.temporal.TemporalAdjuster): LocalDate;
        with(arg0: java.time.temporal.TemporalField, arg1: number): LocalDate;
        withYear(arg0: number): LocalDate;
        withMonth(arg0: number): LocalDate;
        withDayOfMonth(arg0: number): LocalDate;
        withDayOfYear(arg0: number): LocalDate;
        plus(arg0: java.time.temporal.TemporalAmount): LocalDate;
        plus(arg0: number, arg1: java.time.temporal.TemporalUnit): LocalDate;
        plusYears(arg0: number): LocalDate;
        plusMonths(arg0: number): LocalDate;
        plusWeeks(arg0: number): LocalDate;
        plusDays(arg0: number): LocalDate;
        minus(arg0: java.time.temporal.TemporalAmount): LocalDate;
        minus(arg0: number, arg1: java.time.temporal.TemporalUnit): LocalDate;
        minusYears(arg0: number): LocalDate;
        minusMonths(arg0: number): LocalDate;
        minusWeeks(arg0: number): LocalDate;
        minusDays(arg0: number): LocalDate;
        query<R>(arg0: java.time.temporal.TemporalQuery<R>): R;
        adjustInto(
          arg0: java.time.temporal.Temporal
        ): java.time.temporal.Temporal;
        until(
          arg0: java.time.temporal.Temporal,
          arg1: java.time.temporal.TemporalUnit
        ): number;
        until(arg0: java.time.chrono.ChronoLocalDate): Period;
        datesUntil(arg0: LocalDate): java.util.stream.Stream<LocalDate>;
        datesUntil(
          arg0: LocalDate,
          arg1: Period
        ): java.util.stream.Stream<LocalDate>;
        format(arg0: java.time.format.DateTimeFormatter): string;
        atTime(arg0: LocalTime): LocalDateTime;
        atTime(arg0: number, arg1: number): LocalDateTime;
        atTime(arg0: number, arg1: number, arg2: number): LocalDateTime;
        atTime(
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: number
        ): LocalDateTime;
        atTime(arg0: OffsetTime): OffsetDateTime;
        atStartOfDay(): LocalDateTime;
        atStartOfDay(arg0: ZoneId): ZonedDateTime;
        toEpochDay(): number;
        toEpochSecond(arg0: LocalTime, arg1: ZoneOffset): number;
        compareTo(arg0: java.time.chrono.ChronoLocalDate): number;
        isAfter(arg0: java.time.chrono.ChronoLocalDate): boolean;
        isBefore(arg0: java.time.chrono.ChronoLocalDate): boolean;
        isEqual(arg0: java.time.chrono.ChronoLocalDate): boolean;
      }

      const Period: JavaClassStatics<false> & {
        readonly ZERO: Period;

        ofYears(arg0: number): Period;
        ofMonths(arg0: number): Period;
        ofWeeks(arg0: number): Period;
        ofDays(arg0: number): Period;
        of(arg0: number, arg1: number, arg2: number): Period;
        from(arg0: java.time.temporal.TemporalAmount): Period;
        parse(arg0: java.lang.CharSequence): Period;
        between(arg0: LocalDate, arg1: LocalDate): Period;
      };
      interface Period
        extends java.time.chrono.ChronoPeriod,
          java.io.Serializable {
        get(arg0: java.time.temporal.TemporalUnit): number;
        getUnits(): JavaList<java.time.temporal.TemporalUnit>;
        getChronology(): java.time.chrono.IsoChronology;
        isZero(): boolean;
        isNegative(): boolean;
        getYears(): number;
        getMonths(): number;
        getDays(): number;
        withYears(arg0: number): Period;
        withMonths(arg0: number): Period;
        withDays(arg0: number): Period;
        plus(arg0: java.time.temporal.TemporalAmount): Period;
        plusYears(arg0: number): Period;
        plusMonths(arg0: number): Period;
        plusDays(arg0: number): Period;
        minus(arg0: java.time.temporal.TemporalAmount): Period;
        minusYears(arg0: number): Period;
        minusMonths(arg0: number): Period;
        minusDays(arg0: number): Period;
        multipliedBy(arg0: number): Period;
        negated(): Period;
        normalized(): Period;
        toTotalMonths(): number;
        addTo(arg0: java.time.temporal.Temporal): java.time.temporal.Temporal;
        subtractFrom(
          arg0: java.time.temporal.Temporal
        ): java.time.temporal.Temporal;
      }

      const InstantSource: JavaInterfaceStatics & {
        system(): InstantSource;
        tick(arg0: InstantSource, arg1: Duration): InstantSource;
        fixed(arg0: Instant): InstantSource;
        offset(arg0: InstantSource, arg1: Duration): InstantSource;
      };
      interface InstantSource extends JavaObject {
        instant(): Instant;
        millis(): number;
        withZone(arg0: ZoneId): Clock;
      }

      const Month: JavaClassStatics<false> & {
        readonly JANUARY: Month;
        readonly FEBRUARY: Month;
        readonly MARCH: Month;
        readonly APRIL: Month;
        readonly MAY: Month;
        readonly JUNE: Month;
        readonly JULY: Month;
        readonly AUGUST: Month;
        readonly SEPTEMBER: Month;
        readonly OCTOBER: Month;
        readonly NOVEMBER: Month;
        readonly DECEMBER: Month;

        values(): Month[];
        valueOf(arg0: string): Month;
        of(arg0: number): Month;
        from(arg0: java.time.temporal.TemporalAccessor): Month;
      };
      interface Month
        extends java.lang.Enum<Month>,
          java.time.temporal.TemporalAccessor,
          java.time.temporal.TemporalAdjuster {
        getValue(): number;
        getDisplayName(
          arg0: java.time.format.TextStyle,
          arg1: java.util.Locale
        ): string;
        isSupported(arg0: java.time.temporal.TemporalField): boolean;
        range(
          arg0: java.time.temporal.TemporalField
        ): java.time.temporal.ValueRange;
        get(arg0: java.time.temporal.TemporalField): number;
        getLong(arg0: java.time.temporal.TemporalField): number;
        plus(arg0: number): Month;
        minus(arg0: number): Month;
        length(arg0: boolean): number;
        minLength(): number;
        maxLength(): number;
        firstDayOfYear(arg0: boolean): number;
        firstMonthOfQuarter(): Month;
        query<R>(arg0: java.time.temporal.TemporalQuery<R>): R;
        adjustInto(
          arg0: java.time.temporal.Temporal
        ): java.time.temporal.Temporal;
      }

      const OffsetTime: JavaClassStatics<false> & {
        readonly MIN: OffsetTime;
        readonly MAX: OffsetTime;

        now(): OffsetTime;
        now(arg0: ZoneId): OffsetTime;
        now(arg0: Clock): OffsetTime;
        of(arg0: LocalTime, arg1: ZoneOffset): OffsetTime;
        of(
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: number,
          arg4: ZoneOffset
        ): OffsetTime;
        ofInstant(arg0: Instant, arg1: ZoneId): OffsetTime;
        from(arg0: java.time.temporal.TemporalAccessor): OffsetTime;
        parse(arg0: java.lang.CharSequence): OffsetTime;
        parse(
          arg0: java.lang.CharSequence,
          arg1: java.time.format.DateTimeFormatter
        ): OffsetTime;
      };
      interface OffsetTime
        extends java.time.temporal.Temporal,
          java.time.temporal.TemporalAdjuster,
          java.lang.Comparable<OffsetTime>,
          java.io.Serializable {
        isSupported(arg0: java.time.temporal.TemporalField): boolean;
        isSupported(arg0: java.time.temporal.TemporalUnit): boolean;
        range(
          arg0: java.time.temporal.TemporalField
        ): java.time.temporal.ValueRange;
        get(arg0: java.time.temporal.TemporalField): number;
        getLong(arg0: java.time.temporal.TemporalField): number;
        getOffset(): ZoneOffset;
        withOffsetSameLocal(arg0: ZoneOffset): OffsetTime;
        withOffsetSameInstant(arg0: ZoneOffset): OffsetTime;
        toLocalTime(): LocalTime;
        getHour(): number;
        getMinute(): number;
        getSecond(): number;
        getNano(): number;
        with(arg0: java.time.temporal.TemporalAdjuster): OffsetTime;
        with(arg0: java.time.temporal.TemporalField, arg1: number): OffsetTime;
        withHour(arg0: number): OffsetTime;
        withMinute(arg0: number): OffsetTime;
        withSecond(arg0: number): OffsetTime;
        withNano(arg0: number): OffsetTime;
        truncatedTo(arg0: java.time.temporal.TemporalUnit): OffsetTime;
        plus(arg0: java.time.temporal.TemporalAmount): OffsetTime;
        plus(arg0: number, arg1: java.time.temporal.TemporalUnit): OffsetTime;
        plusHours(arg0: number): OffsetTime;
        plusMinutes(arg0: number): OffsetTime;
        plusSeconds(arg0: number): OffsetTime;
        plusNanos(arg0: number): OffsetTime;
        minus(arg0: java.time.temporal.TemporalAmount): OffsetTime;
        minus(arg0: number, arg1: java.time.temporal.TemporalUnit): OffsetTime;
        minusHours(arg0: number): OffsetTime;
        minusMinutes(arg0: number): OffsetTime;
        minusSeconds(arg0: number): OffsetTime;
        minusNanos(arg0: number): OffsetTime;
        query<R>(arg0: java.time.temporal.TemporalQuery<R>): R;
        adjustInto(
          arg0: java.time.temporal.Temporal
        ): java.time.temporal.Temporal;
        until(
          arg0: java.time.temporal.Temporal,
          arg1: java.time.temporal.TemporalUnit
        ): number;
        format(arg0: java.time.format.DateTimeFormatter): string;
        atDate(arg0: LocalDate): OffsetDateTime;
        toEpochSecond(arg0: LocalDate): number;
        compareTo(arg0: OffsetTime): number;
        isAfter(arg0: OffsetTime): boolean;
        isBefore(arg0: OffsetTime): boolean;
        isEqual(arg0: OffsetTime): boolean;
      }

      const DayOfWeek: JavaClassStatics<false> & {
        readonly MONDAY: DayOfWeek;
        readonly TUESDAY: DayOfWeek;
        readonly WEDNESDAY: DayOfWeek;
        readonly THURSDAY: DayOfWeek;
        readonly FRIDAY: DayOfWeek;
        readonly SATURDAY: DayOfWeek;
        readonly SUNDAY: DayOfWeek;

        values(): DayOfWeek[];
        valueOf(arg0: string): DayOfWeek;
        of(arg0: number): DayOfWeek;
        from(arg0: java.time.temporal.TemporalAccessor): DayOfWeek;
      };
      interface DayOfWeek
        extends java.lang.Enum<DayOfWeek>,
          java.time.temporal.TemporalAccessor,
          java.time.temporal.TemporalAdjuster {
        getValue(): number;
        getDisplayName(
          arg0: java.time.format.TextStyle,
          arg1: java.util.Locale
        ): string;
        isSupported(arg0: java.time.temporal.TemporalField): boolean;
        range(
          arg0: java.time.temporal.TemporalField
        ): java.time.temporal.ValueRange;
        get(arg0: java.time.temporal.TemporalField): number;
        getLong(arg0: java.time.temporal.TemporalField): number;
        plus(arg0: number): DayOfWeek;
        minus(arg0: number): DayOfWeek;
        query<R>(arg0: java.time.temporal.TemporalQuery<R>): R;
        adjustInto(
          arg0: java.time.temporal.Temporal
        ): java.time.temporal.Temporal;
      }

      namespace temporal {
        const TemporalAmount: JavaInterfaceStatics;
        interface TemporalAmount extends JavaObject {
          get(arg0: TemporalUnit): number;
          getUnits(): JavaList<TemporalUnit>;
          addTo(arg0: Temporal): Temporal;
          subtractFrom(arg0: Temporal): Temporal;
        }

        const Temporal: JavaInterfaceStatics;
        interface Temporal extends TemporalAccessor {
          isSupported(arg0: TemporalUnit): boolean;
          isSupported(arg0: TemporalField): boolean;
          with(arg0: TemporalAdjuster): Temporal;
          with(arg0: TemporalField, arg1: number): Temporal;
          plus(arg0: TemporalAmount): Temporal;
          plus(arg0: number, arg1: TemporalUnit): Temporal;
          minus(arg0: TemporalAmount): Temporal;
          minus(arg0: number, arg1: TemporalUnit): Temporal;
          until(arg0: Temporal, arg1: TemporalUnit): number;
        }

        const TemporalUnit: JavaInterfaceStatics;
        interface TemporalUnit extends JavaObject {
          getDuration(): java.time.Duration;
          isDurationEstimated(): boolean;
          isDateBased(): boolean;
          isTimeBased(): boolean;
          isSupportedBy(arg0: Temporal): boolean;
          addTo<R>(arg0: R, arg1: number): R;
          between(arg0: Temporal, arg1: Temporal): number;
        }

        const ChronoUnit: JavaClassStatics<false> & {
          readonly NANOS: ChronoUnit;
          readonly MICROS: ChronoUnit;
          readonly MILLIS: ChronoUnit;
          readonly SECONDS: ChronoUnit;
          readonly MINUTES: ChronoUnit;
          readonly HOURS: ChronoUnit;
          readonly HALF_DAYS: ChronoUnit;
          readonly DAYS: ChronoUnit;
          readonly WEEKS: ChronoUnit;
          readonly MONTHS: ChronoUnit;
          readonly YEARS: ChronoUnit;
          readonly DECADES: ChronoUnit;
          readonly CENTURIES: ChronoUnit;
          readonly MILLENNIA: ChronoUnit;
          readonly ERAS: ChronoUnit;
          readonly FOREVER: ChronoUnit;

          values(): ChronoUnit[];
          valueOf(arg0: string): ChronoUnit;
        };
        interface ChronoUnit extends java.lang.Enum<ChronoUnit>, TemporalUnit {
          getDuration(): java.time.Duration;
          isDurationEstimated(): boolean;
          isDateBased(): boolean;
          isTimeBased(): boolean;
          isSupportedBy(arg0: Temporal): boolean;
          addTo<R>(arg0: R, arg1: number): R;
          between(arg0: Temporal, arg1: Temporal): number;
        }

        const TemporalAdjuster: JavaInterfaceStatics;
        interface TemporalAdjuster extends JavaObject {
          adjustInto(arg0: Temporal): Temporal;
        }

        const TemporalField: JavaInterfaceStatics;
        interface TemporalField extends JavaObject {
          getDisplayName(arg0: java.util.Locale): string;
          getBaseUnit(): TemporalUnit;
          getRangeUnit(): TemporalUnit;
          range(): ValueRange;
          isDateBased(): boolean;
          isTimeBased(): boolean;
          isSupportedBy(arg0: TemporalAccessor): boolean;
          rangeRefinedBy(arg0: TemporalAccessor): ValueRange;
          getFrom(arg0: TemporalAccessor): number;
          adjustInto<R>(arg0: R, arg1: number): R;
          resolve(
            arg0: JavaMap<TemporalField, number>,
            arg1: TemporalAccessor,
            arg2: java.time.format.ResolverStyle
          ): TemporalAccessor;
        }

        const TemporalAccessor: JavaInterfaceStatics;
        interface TemporalAccessor extends JavaObject {
          isSupported(arg0: TemporalField): boolean;
          range(arg0: TemporalField): ValueRange;
          get(arg0: TemporalField): number;
          getLong(arg0: TemporalField): number;
          query<R>(arg0: TemporalQuery<R>): R;
        }

        const TemporalQuery: JavaInterfaceStatics;
        interface TemporalQuery<R> extends JavaObject {
          queryFrom(arg0: TemporalAccessor): R;
        }

        const ValueRange: JavaClassStatics<false> & {
          of(arg0: number, arg1: number): ValueRange;
          of(arg0: number, arg1: number, arg2: number): ValueRange;
          of(
            arg0: number,
            arg1: number,
            arg2: number,
            arg3: number
          ): ValueRange;
        };
        interface ValueRange extends java.io.Serializable {
          isFixed(): boolean;
          getMinimum(): number;
          getLargestMinimum(): number;
          getSmallestMaximum(): number;
          getMaximum(): number;
          isIntValue(): boolean;
          isValidValue(arg0: number): boolean;
          isValidIntValue(arg0: number): boolean;
          checkValidValue(arg0: number, arg1: TemporalField): number;
          checkValidIntValue(arg0: number, arg1: TemporalField): number;
        }

        const ChronoField: JavaClassStatics<false> & {
          readonly NANO_OF_SECOND: ChronoField;
          readonly NANO_OF_DAY: ChronoField;
          readonly MICRO_OF_SECOND: ChronoField;
          readonly MICRO_OF_DAY: ChronoField;
          readonly MILLI_OF_SECOND: ChronoField;
          readonly MILLI_OF_DAY: ChronoField;
          readonly SECOND_OF_MINUTE: ChronoField;
          readonly SECOND_OF_DAY: ChronoField;
          readonly MINUTE_OF_HOUR: ChronoField;
          readonly MINUTE_OF_DAY: ChronoField;
          readonly HOUR_OF_AMPM: ChronoField;
          readonly CLOCK_HOUR_OF_AMPM: ChronoField;
          readonly HOUR_OF_DAY: ChronoField;
          readonly CLOCK_HOUR_OF_DAY: ChronoField;
          readonly AMPM_OF_DAY: ChronoField;
          readonly DAY_OF_WEEK: ChronoField;
          readonly ALIGNED_DAY_OF_WEEK_IN_MONTH: ChronoField;
          readonly ALIGNED_DAY_OF_WEEK_IN_YEAR: ChronoField;
          readonly DAY_OF_MONTH: ChronoField;
          readonly DAY_OF_YEAR: ChronoField;
          readonly EPOCH_DAY: ChronoField;
          readonly ALIGNED_WEEK_OF_MONTH: ChronoField;
          readonly ALIGNED_WEEK_OF_YEAR: ChronoField;
          readonly MONTH_OF_YEAR: ChronoField;
          readonly PROLEPTIC_MONTH: ChronoField;
          readonly YEAR_OF_ERA: ChronoField;
          readonly YEAR: ChronoField;
          readonly ERA: ChronoField;
          readonly INSTANT_SECONDS: ChronoField;
          readonly OFFSET_SECONDS: ChronoField;

          values(): ChronoField[];
          valueOf(arg0: string): ChronoField;
        };
        interface ChronoField
          extends java.lang.Enum<ChronoField>,
            TemporalField {
          getDisplayName(arg0: java.util.Locale): string;
          getBaseUnit(): TemporalUnit;
          getRangeUnit(): TemporalUnit;
          range(): ValueRange;
          isDateBased(): boolean;
          isTimeBased(): boolean;
          checkValidValue(arg0: number): number;
          checkValidIntValue(arg0: number): number;
          isSupportedBy(arg0: TemporalAccessor): boolean;
          rangeRefinedBy(arg0: TemporalAccessor): ValueRange;
          getFrom(arg0: TemporalAccessor): number;
          adjustInto<R>(arg0: R, arg1: number): R;
        }

        export {
          TemporalAmount,
          Temporal,
          TemporalUnit,
          ChronoUnit,
          TemporalAdjuster,
          TemporalField,
          TemporalAccessor,
          TemporalQuery,
          ValueRange,
          ChronoField,
        };
      }

      namespace format {
        const ResolverStyle: JavaClassStatics<false> & {
          readonly STRICT: ResolverStyle;
          readonly SMART: ResolverStyle;
          readonly LENIENT: ResolverStyle;

          values(): ResolverStyle[];
          valueOf(arg0: string): ResolverStyle;
        };
        interface ResolverStyle extends java.lang.Enum<ResolverStyle> {}

        const TextStyle: JavaClassStatics<false> & {
          readonly FULL: TextStyle;
          readonly FULL_STANDALONE: TextStyle;
          readonly SHORT: TextStyle;
          readonly SHORT_STANDALONE: TextStyle;
          readonly NARROW: TextStyle;
          readonly NARROW_STANDALONE: TextStyle;

          values(): TextStyle[];
          valueOf(arg0: string): TextStyle;
        };
        interface TextStyle extends java.lang.Enum<TextStyle> {
          isStandalone(): boolean;
          asStandalone(): TextStyle;
          asNormal(): TextStyle;
        }

        const DateTimeFormatter: JavaClassStatics<false> & {
          readonly ISO_LOCAL_DATE: DateTimeFormatter;
          readonly ISO_OFFSET_DATE: DateTimeFormatter;
          readonly ISO_DATE: DateTimeFormatter;
          readonly ISO_LOCAL_TIME: DateTimeFormatter;
          readonly ISO_OFFSET_TIME: DateTimeFormatter;
          readonly ISO_TIME: DateTimeFormatter;
          readonly ISO_LOCAL_DATE_TIME: DateTimeFormatter;
          readonly ISO_OFFSET_DATE_TIME: DateTimeFormatter;
          readonly ISO_ZONED_DATE_TIME: DateTimeFormatter;
          readonly ISO_DATE_TIME: DateTimeFormatter;
          readonly ISO_ORDINAL_DATE: DateTimeFormatter;
          readonly ISO_WEEK_DATE: DateTimeFormatter;
          readonly ISO_INSTANT: DateTimeFormatter;
          readonly BASIC_ISO_DATE: DateTimeFormatter;
          readonly RFC_1123_DATE_TIME: DateTimeFormatter;

          ofPattern(arg0: string): DateTimeFormatter;
          ofPattern(arg0: string, arg1: java.util.Locale): DateTimeFormatter;
          ofLocalizedDate(arg0: FormatStyle): DateTimeFormatter;
          ofLocalizedTime(arg0: FormatStyle): DateTimeFormatter;
          ofLocalizedDateTime(arg0: FormatStyle): DateTimeFormatter;
          ofLocalizedDateTime(
            arg0: FormatStyle,
            arg1: FormatStyle
          ): DateTimeFormatter;
          parsedExcessDays(): java.time.temporal.TemporalQuery<java.time.Period>;
          parsedLeapSecond(): java.time.temporal.TemporalQuery<boolean>;
        };
        interface DateTimeFormatter extends JavaObject {
          getLocale(): java.util.Locale;
          withLocale(arg0: java.util.Locale): DateTimeFormatter;
          localizedBy(arg0: java.util.Locale): DateTimeFormatter;
          getDecimalStyle(): DecimalStyle;
          withDecimalStyle(arg0: DecimalStyle): DateTimeFormatter;
          getChronology(): java.time.chrono.Chronology;
          withChronology(arg0: java.time.chrono.Chronology): DateTimeFormatter;
          getZone(): java.time.ZoneId;
          withZone(arg0: java.time.ZoneId): DateTimeFormatter;
          getResolverStyle(): ResolverStyle;
          withResolverStyle(arg0: ResolverStyle): DateTimeFormatter;
          getResolverFields(): JavaSet<java.time.temporal.TemporalField>;
          withResolverFields(
            ...arg0: java.time.temporal.TemporalField[]
          ): DateTimeFormatter;
          withResolverFields(
            arg0: JavaSet<java.time.temporal.TemporalField>
          ): DateTimeFormatter;
          format(arg0: java.time.temporal.TemporalAccessor): string;
          formatTo(
            arg0: java.time.temporal.TemporalAccessor,
            arg1: java.lang.Appendable
          ): void;
          parse(
            arg0: java.lang.CharSequence
          ): java.time.temporal.TemporalAccessor;
          parse(
            arg0: java.lang.CharSequence,
            arg1: java.text.ParsePosition
          ): java.time.temporal.TemporalAccessor;
          parse<T>(
            arg0: java.lang.CharSequence,
            arg1: java.time.temporal.TemporalQuery<T>
          ): T;
          parseBest(
            arg0: java.lang.CharSequence,
            ...arg1: java.time.temporal.TemporalQuery<any>[]
          ): java.time.temporal.TemporalAccessor;
          parseUnresolved(
            arg0: java.lang.CharSequence,
            arg1: java.text.ParsePosition
          ): java.time.temporal.TemporalAccessor;
          toFormat(): java.text.Format;
          toFormat(
            arg0: java.time.temporal.TemporalQuery<any>
          ): java.text.Format;
        }

        const FormatStyle: JavaClassStatics<false> & {
          readonly FULL: FormatStyle;
          readonly LONG: FormatStyle;
          readonly MEDIUM: FormatStyle;
          readonly SHORT: FormatStyle;

          values(): FormatStyle[];
          valueOf(arg0: string): FormatStyle;
        };
        interface FormatStyle extends java.lang.Enum<FormatStyle> {}

        const DecimalStyle: JavaClassStatics<false> & {
          readonly STANDARD: DecimalStyle;

          getAvailableLocales(): JavaSet<java.util.Locale>;
          ofDefaultLocale(): DecimalStyle;
          of(arg0: java.util.Locale): DecimalStyle;
        };
        interface DecimalStyle extends JavaObject {
          getZeroDigit(): number;
          withZeroDigit(arg0: number): DecimalStyle;
          getPositiveSign(): number;
          withPositiveSign(arg0: number): DecimalStyle;
          getNegativeSign(): number;
          withNegativeSign(arg0: number): DecimalStyle;
          getDecimalSeparator(): number;
          withDecimalSeparator(arg0: number): DecimalStyle;
        }

        export {
          ResolverStyle,
          TextStyle,
          DateTimeFormatter,
          FormatStyle,
          DecimalStyle,
        };
      }

      namespace zone {
        const ZoneRules: JavaClassStatics<false> & {
          of(
            arg0: java.time.ZoneOffset,
            arg1: java.time.ZoneOffset,
            arg2: JavaList<ZoneOffsetTransition>,
            arg3: JavaList<ZoneOffsetTransition>,
            arg4: JavaList<ZoneOffsetTransitionRule>
          ): ZoneRules;
          of(arg0: java.time.ZoneOffset): ZoneRules;
        };
        interface ZoneRules extends java.io.Serializable {
          isFixedOffset(): boolean;
          getOffset(arg0: java.time.Instant): java.time.ZoneOffset;
          getOffset(arg0: java.time.LocalDateTime): java.time.ZoneOffset;
          getValidOffsets(
            arg0: java.time.LocalDateTime
          ): JavaList<java.time.ZoneOffset>;
          getTransition(arg0: java.time.LocalDateTime): ZoneOffsetTransition;
          getStandardOffset(arg0: java.time.Instant): java.time.ZoneOffset;
          getDaylightSavings(arg0: java.time.Instant): java.time.Duration;
          isDaylightSavings(arg0: java.time.Instant): boolean;
          isValidOffset(
            arg0: java.time.LocalDateTime,
            arg1: java.time.ZoneOffset
          ): boolean;
          nextTransition(arg0: java.time.Instant): ZoneOffsetTransition;
          previousTransition(arg0: java.time.Instant): ZoneOffsetTransition;
          getTransitions(): JavaList<ZoneOffsetTransition>;
          getTransitionRules(): JavaList<ZoneOffsetTransitionRule>;
        }

        const ZoneOffsetTransition: JavaClassStatics<false> & {
          of(
            arg0: java.time.LocalDateTime,
            arg1: java.time.ZoneOffset,
            arg2: java.time.ZoneOffset
          ): ZoneOffsetTransition;
        };
        interface ZoneOffsetTransition
          extends java.lang.Comparable<ZoneOffsetTransition>,
            java.io.Serializable {
          getInstant(): java.time.Instant;
          toEpochSecond(): number;
          getDateTimeBefore(): java.time.LocalDateTime;
          getDateTimeAfter(): java.time.LocalDateTime;
          getOffsetBefore(): java.time.ZoneOffset;
          getOffsetAfter(): java.time.ZoneOffset;
          getDuration(): java.time.Duration;
          isGap(): boolean;
          isOverlap(): boolean;
          isValidOffset(arg0: java.time.ZoneOffset): boolean;
          compareTo(arg0: ZoneOffsetTransition): number;
        }

        const ZoneOffsetTransitionRule: JavaClassStatics<false> & {
          of(
            arg0: java.time.Month,
            arg1: number,
            arg2: java.time.DayOfWeek,
            arg3: java.time.LocalTime,
            arg4: boolean,
            arg5: ZoneOffsetTransitionRule$TimeDefinition,
            arg6: java.time.ZoneOffset,
            arg7: java.time.ZoneOffset,
            arg8: java.time.ZoneOffset
          ): ZoneOffsetTransitionRule;
        };
        interface ZoneOffsetTransitionRule extends java.io.Serializable {
          getMonth(): java.time.Month;
          getDayOfMonthIndicator(): number;
          getDayOfWeek(): java.time.DayOfWeek;
          getLocalTime(): java.time.LocalTime;
          isMidnightEndOfDay(): boolean;
          getTimeDefinition(): ZoneOffsetTransitionRule$TimeDefinition;
          getStandardOffset(): java.time.ZoneOffset;
          getOffsetBefore(): java.time.ZoneOffset;
          getOffsetAfter(): java.time.ZoneOffset;
          createTransition(arg0: number): ZoneOffsetTransition;
        }

        const ZoneOffsetTransitionRule$TimeDefinition: JavaClassStatics<false> & {
          readonly UTC: ZoneOffsetTransitionRule$TimeDefinition;
          readonly WALL: ZoneOffsetTransitionRule$TimeDefinition;
          readonly STANDARD: ZoneOffsetTransitionRule$TimeDefinition;

          values(): ZoneOffsetTransitionRule$TimeDefinition[];
          valueOf(arg0: string): ZoneOffsetTransitionRule$TimeDefinition;
        };
        interface ZoneOffsetTransitionRule$TimeDefinition
          extends java.lang.Enum<ZoneOffsetTransitionRule$TimeDefinition> {
          createDateTime(
            arg0: java.time.LocalDateTime,
            arg1: java.time.ZoneOffset,
            arg2: java.time.ZoneOffset
          ): java.time.LocalDateTime;
        }

        export {
          ZoneRules,
          ZoneOffsetTransition,
          ZoneOffsetTransitionRule,
          ZoneOffsetTransitionRule$TimeDefinition,
        };
      }

      namespace chrono {
        const Chronology: JavaInterfaceStatics & {
          from(arg0: java.time.temporal.TemporalAccessor): Chronology;
          ofLocale(arg0: java.util.Locale): Chronology;
          of(arg0: string): Chronology;
          getAvailableChronologies(): JavaSet<Chronology>;
        };
        interface Chronology extends java.lang.Comparable<Chronology> {
          getId(): string;
          getCalendarType(): string;
          date(
            arg0: Era,
            arg1: number,
            arg2: number,
            arg3: number
          ): ChronoLocalDate;
          date(arg0: number, arg1: number, arg2: number): ChronoLocalDate;
          dateYearDay(arg0: Era, arg1: number, arg2: number): ChronoLocalDate;
          dateYearDay(arg0: number, arg1: number): ChronoLocalDate;
          dateEpochDay(arg0: number): ChronoLocalDate;
          dateNow(): ChronoLocalDate;
          dateNow(arg0: java.time.ZoneId): ChronoLocalDate;
          dateNow(arg0: java.time.Clock): ChronoLocalDate;
          date(arg0: java.time.temporal.TemporalAccessor): ChronoLocalDate;
          localDateTime(
            arg0: java.time.temporal.TemporalAccessor
          ): ChronoLocalDateTime<any>;
          zonedDateTime(
            arg0: java.time.temporal.TemporalAccessor
          ): ChronoZonedDateTime<any>;
          zonedDateTime(
            arg0: java.time.Instant,
            arg1: java.time.ZoneId
          ): ChronoZonedDateTime<any>;
          isLeapYear(arg0: number): boolean;
          prolepticYear(arg0: Era, arg1: number): number;
          eraOf(arg0: number): Era;
          eras(): JavaList<Era>;
          range(
            arg0: java.time.temporal.ChronoField
          ): java.time.temporal.ValueRange;
          getDisplayName(
            arg0: java.time.format.TextStyle,
            arg1: java.util.Locale
          ): string;
          resolveDate(
            arg0: JavaMap<java.time.temporal.TemporalField, number>,
            arg1: java.time.format.ResolverStyle
          ): ChronoLocalDate;
          period(arg0: number, arg1: number, arg2: number): ChronoPeriod;
          epochSecond(
            arg0: number,
            arg1: number,
            arg2: number,
            arg3: number,
            arg4: number,
            arg5: number,
            arg6: java.time.ZoneOffset
          ): number;
          epochSecond(
            arg0: Era,
            arg1: number,
            arg2: number,
            arg3: number,
            arg4: number,
            arg5: number,
            arg6: number,
            arg7: java.time.ZoneOffset
          ): number;
          compareTo(arg0: Chronology): number;
        }

        const ChronoZonedDateTime: JavaInterfaceStatics & {
          timeLineOrder(): java.util.Comparator<ChronoZonedDateTime<any>>;
          from(
            arg0: java.time.temporal.TemporalAccessor
          ): ChronoZonedDateTime<any>;
        };
        interface ChronoZonedDateTime<D extends ChronoLocalDate>
          extends java.time.temporal.Temporal,
            java.lang.Comparable<ChronoZonedDateTime<any>> {
          range(
            arg0: java.time.temporal.TemporalField
          ): java.time.temporal.ValueRange;
          get(arg0: java.time.temporal.TemporalField): number;
          getLong(arg0: java.time.temporal.TemporalField): number;
          toLocalDate(): D;
          toLocalTime(): java.time.LocalTime;
          toLocalDateTime(): ChronoLocalDateTime<D>;
          getChronology(): Chronology;
          getOffset(): java.time.ZoneOffset;
          getZone(): java.time.ZoneId;
          withEarlierOffsetAtOverlap(): ChronoZonedDateTime<D>;
          withLaterOffsetAtOverlap(): ChronoZonedDateTime<D>;
          withZoneSameLocal(arg0: java.time.ZoneId): ChronoZonedDateTime<D>;
          withZoneSameInstant(arg0: java.time.ZoneId): ChronoZonedDateTime<D>;
          isSupported(arg0: java.time.temporal.TemporalField): boolean;
          isSupported(arg0: java.time.temporal.TemporalUnit): boolean;
          with(
            arg0: java.time.temporal.TemporalAdjuster
          ): ChronoZonedDateTime<D>;
          with(
            arg0: java.time.temporal.TemporalField,
            arg1: number
          ): ChronoZonedDateTime<D>;
          plus(arg0: java.time.temporal.TemporalAmount): ChronoZonedDateTime<D>;
          plus(
            arg0: number,
            arg1: java.time.temporal.TemporalUnit
          ): ChronoZonedDateTime<D>;
          minus(
            arg0: java.time.temporal.TemporalAmount
          ): ChronoZonedDateTime<D>;
          minus(
            arg0: number,
            arg1: java.time.temporal.TemporalUnit
          ): ChronoZonedDateTime<D>;
          query<R>(arg0: java.time.temporal.TemporalQuery<R>): R;
          format(arg0: java.time.format.DateTimeFormatter): string;
          toInstant(): java.time.Instant;
          toEpochSecond(): number;
          compareTo(arg0: ChronoZonedDateTime<any>): number;
          isBefore(arg0: ChronoZonedDateTime<any>): boolean;
          isAfter(arg0: ChronoZonedDateTime<any>): boolean;
          isEqual(arg0: ChronoZonedDateTime<any>): boolean;
        }

        const ChronoLocalDate: JavaInterfaceStatics & {
          timeLineOrder(): java.util.Comparator<ChronoLocalDate>;
          from(arg0: java.time.temporal.TemporalAccessor): ChronoLocalDate;
        };
        interface ChronoLocalDate
          extends java.time.temporal.Temporal,
            java.time.temporal.TemporalAdjuster,
            java.lang.Comparable<ChronoLocalDate> {
          getChronology(): Chronology;
          getEra(): Era;
          isLeapYear(): boolean;
          lengthOfMonth(): number;
          lengthOfYear(): number;
          isSupported(arg0: java.time.temporal.TemporalField): boolean;
          isSupported(arg0: java.time.temporal.TemporalUnit): boolean;
          with(arg0: java.time.temporal.TemporalAdjuster): ChronoLocalDate;
          with(
            arg0: java.time.temporal.TemporalField,
            arg1: number
          ): ChronoLocalDate;
          plus(arg0: java.time.temporal.TemporalAmount): ChronoLocalDate;
          plus(
            arg0: number,
            arg1: java.time.temporal.TemporalUnit
          ): ChronoLocalDate;
          minus(arg0: java.time.temporal.TemporalAmount): ChronoLocalDate;
          minus(
            arg0: number,
            arg1: java.time.temporal.TemporalUnit
          ): ChronoLocalDate;
          query<R>(arg0: java.time.temporal.TemporalQuery<R>): R;
          adjustInto(
            arg0: java.time.temporal.Temporal
          ): java.time.temporal.Temporal;
          until(
            arg0: java.time.temporal.Temporal,
            arg1: java.time.temporal.TemporalUnit
          ): number;
          until(arg0: ChronoLocalDate): ChronoPeriod;
          format(arg0: java.time.format.DateTimeFormatter): string;
          atTime(arg0: java.time.LocalTime): ChronoLocalDateTime<any>;
          toEpochDay(): number;
          compareTo(arg0: ChronoLocalDate): number;
          isAfter(arg0: ChronoLocalDate): boolean;
          isBefore(arg0: ChronoLocalDate): boolean;
          isEqual(arg0: ChronoLocalDate): boolean;
        }

        const Era: JavaInterfaceStatics;
        interface Era
          extends java.time.temporal.TemporalAccessor,
            java.time.temporal.TemporalAdjuster {
          getValue(): number;
          isSupported(arg0: java.time.temporal.TemporalField): boolean;
          range(
            arg0: java.time.temporal.TemporalField
          ): java.time.temporal.ValueRange;
          get(arg0: java.time.temporal.TemporalField): number;
          getLong(arg0: java.time.temporal.TemporalField): number;
          query<R>(arg0: java.time.temporal.TemporalQuery<R>): R;
          adjustInto(
            arg0: java.time.temporal.Temporal
          ): java.time.temporal.Temporal;
          getDisplayName(
            arg0: java.time.format.TextStyle,
            arg1: java.util.Locale
          ): string;
        }

        const ChronoPeriod: JavaInterfaceStatics & {
          between(arg0: ChronoLocalDate, arg1: ChronoLocalDate): ChronoPeriod;
        };
        interface ChronoPeriod extends java.time.temporal.TemporalAmount {
          get(arg0: java.time.temporal.TemporalUnit): number;
          getUnits(): JavaList<java.time.temporal.TemporalUnit>;
          getChronology(): Chronology;
          isZero(): boolean;
          isNegative(): boolean;
          plus(arg0: java.time.temporal.TemporalAmount): ChronoPeriod;
          minus(arg0: java.time.temporal.TemporalAmount): ChronoPeriod;
          multipliedBy(arg0: number): ChronoPeriod;
          negated(): ChronoPeriod;
          normalized(): ChronoPeriod;
          addTo(arg0: java.time.temporal.Temporal): java.time.temporal.Temporal;
          subtractFrom(
            arg0: java.time.temporal.Temporal
          ): java.time.temporal.Temporal;
        }

        const ChronoLocalDateTime: JavaInterfaceStatics & {
          timeLineOrder(): java.util.Comparator<ChronoLocalDateTime<any>>;
          from(
            arg0: java.time.temporal.TemporalAccessor
          ): ChronoLocalDateTime<any>;
        };
        interface ChronoLocalDateTime<D extends ChronoLocalDate>
          extends java.time.temporal.Temporal,
            java.time.temporal.TemporalAdjuster,
            java.lang.Comparable<ChronoLocalDateTime<any>> {
          getChronology(): Chronology;
          toLocalDate(): D;
          toLocalTime(): java.time.LocalTime;
          isSupported(arg0: java.time.temporal.TemporalField): boolean;
          isSupported(arg0: java.time.temporal.TemporalUnit): boolean;
          with(
            arg0: java.time.temporal.TemporalAdjuster
          ): ChronoLocalDateTime<D>;
          with(
            arg0: java.time.temporal.TemporalField,
            arg1: number
          ): ChronoLocalDateTime<D>;
          plus(arg0: java.time.temporal.TemporalAmount): ChronoLocalDateTime<D>;
          plus(
            arg0: number,
            arg1: java.time.temporal.TemporalUnit
          ): ChronoLocalDateTime<D>;
          minus(
            arg0: java.time.temporal.TemporalAmount
          ): ChronoLocalDateTime<D>;
          minus(
            arg0: number,
            arg1: java.time.temporal.TemporalUnit
          ): ChronoLocalDateTime<D>;
          query<R>(arg0: java.time.temporal.TemporalQuery<R>): R;
          adjustInto(
            arg0: java.time.temporal.Temporal
          ): java.time.temporal.Temporal;
          format(arg0: java.time.format.DateTimeFormatter): string;
          atZone(arg0: java.time.ZoneId): ChronoZonedDateTime<D>;
          toInstant(arg0: java.time.ZoneOffset): java.time.Instant;
          toEpochSecond(arg0: java.time.ZoneOffset): number;
          compareTo(arg0: ChronoLocalDateTime<any>): number;
          isAfter(arg0: ChronoLocalDateTime<any>): boolean;
          isBefore(arg0: ChronoLocalDateTime<any>): boolean;
          isEqual(arg0: ChronoLocalDateTime<any>): boolean;
        }

        const IsoChronology: JavaClassStatics<false> & {
          readonly INSTANCE: IsoChronology;
        };
        interface IsoChronology
          extends AbstractChronology,
            java.io.Serializable {
          getId(): string;
          getCalendarType(): string;
          date(
            arg0: Era,
            arg1: number,
            arg2: number,
            arg3: number
          ): java.time.LocalDate;
          date(arg0: number, arg1: number, arg2: number): java.time.LocalDate;
          dateYearDay(
            arg0: Era,
            arg1: number,
            arg2: number
          ): java.time.LocalDate;
          dateYearDay(arg0: number, arg1: number): java.time.LocalDate;
          dateEpochDay(arg0: number): java.time.LocalDate;
          date(arg0: java.time.temporal.TemporalAccessor): java.time.LocalDate;
          epochSecond(
            arg0: number,
            arg1: number,
            arg2: number,
            arg3: number,
            arg4: number,
            arg5: number,
            arg6: java.time.ZoneOffset
          ): number;
          epochSecond(
            arg0: Era,
            arg1: number,
            arg2: number,
            arg3: number,
            arg4: number,
            arg5: number,
            arg6: number,
            arg7: java.time.ZoneOffset
          ): number;
          localDateTime(
            arg0: java.time.temporal.TemporalAccessor
          ): java.time.LocalDateTime;
          zonedDateTime(
            arg0: java.time.temporal.TemporalAccessor
          ): java.time.ZonedDateTime;
          zonedDateTime(
            arg0: java.time.Instant,
            arg1: java.time.ZoneId
          ): java.time.ZonedDateTime;
          dateNow(): java.time.LocalDate;
          dateNow(arg0: java.time.ZoneId): java.time.LocalDate;
          dateNow(arg0: java.time.Clock): java.time.LocalDate;
          isLeapYear(arg0: number): boolean;
          prolepticYear(arg0: Era, arg1: number): number;
          eraOf(arg0: number): IsoEra;
          eras(): JavaList<Era>;
          resolveDate(
            arg0: JavaMap<java.time.temporal.TemporalField, number>,
            arg1: java.time.format.ResolverStyle
          ): java.time.LocalDate;
          range(
            arg0: java.time.temporal.ChronoField
          ): java.time.temporal.ValueRange;
          period(arg0: number, arg1: number, arg2: number): java.time.Period;
        }

        const IsoEra: JavaClassStatics<false> & {
          readonly BCE: IsoEra;
          readonly CE: IsoEra;

          values(): IsoEra[];
          valueOf(arg0: string): IsoEra;
          of(arg0: number): IsoEra;
        };
        interface IsoEra extends java.lang.Enum<IsoEra>, Era {
          getValue(): number;
        }

        const AbstractChronology: JavaClassStatics<false>;
        interface AbstractChronology extends Chronology {
          resolveDate(
            arg0: JavaMap<java.time.temporal.TemporalField, number>,
            arg1: java.time.format.ResolverStyle
          ): ChronoLocalDate;
          compareTo(arg0: Chronology): number;
        }

        export {
          Chronology,
          ChronoZonedDateTime,
          ChronoLocalDate,
          Era,
          ChronoPeriod,
          ChronoLocalDateTime,
          IsoChronology,
          IsoEra,
          AbstractChronology,
        };
      }

      export {
        Duration,
        Instant,
        ZoneOffset,
        ZonedDateTime,
        OffsetDateTime,
        Clock,
        ZoneId,
        LocalTime,
        LocalDateTime,
        LocalDate,
        Period,
        InstantSource,
        Month,
        OffsetTime,
        DayOfWeek,
        temporal,
        format,
        zone,
        chrono,
      };
    }

    namespace math {
      const BigDecimal: JavaClassStatics<{
        new (arg0: number[], arg1: number, arg2: number): BigDecimal;
        new (
          arg0: number[],
          arg1: number,
          arg2: number,
          arg3: MathContext
        ): BigDecimal;
        new (arg0: number[]): BigDecimal;
        new (arg0: number[], arg1: MathContext): BigDecimal;
        new (arg0: string): BigDecimal;
        new (arg0: string, arg1: MathContext): BigDecimal;
        new (arg0: number): BigDecimal;
        new (arg0: number, arg1: MathContext): BigDecimal;
        new (arg0: BigInteger): BigDecimal;
        new (arg0: BigInteger, arg1: MathContext): BigDecimal;
        new (arg0: BigInteger, arg1: number): BigDecimal;
        new (arg0: BigInteger, arg1: number, arg2: MathContext): BigDecimal;
        new (arg0: number): BigDecimal;
        new (arg0: number, arg1: MathContext): BigDecimal;
        new (arg0: number): BigDecimal;
        new (arg0: number, arg1: MathContext): BigDecimal;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        readonly ZERO: BigDecimal;
        readonly ONE: BigDecimal;
        readonly TEN: BigDecimal;
        /** @deprecated */
        readonly ROUND_UP: number;
        /** @deprecated */
        readonly ROUND_DOWN: number;
        /** @deprecated */
        readonly ROUND_CEILING: number;
        /** @deprecated */
        readonly ROUND_FLOOR: number;
        /** @deprecated */
        readonly ROUND_HALF_UP: number;
        /** @deprecated */
        readonly ROUND_HALF_DOWN: number;
        /** @deprecated */
        readonly ROUND_HALF_EVEN: number;
        /** @deprecated */
        readonly ROUND_UNNECESSARY: number;

        valueOf(arg0: number, arg1: number): BigDecimal;
        valueOf(arg0: number): BigDecimal;
        valueOf(arg0: number): BigDecimal;
      };
      interface BigDecimal
        extends java.lang.Number,
          java.lang.Comparable<BigDecimal> {
        add(arg0: BigDecimal): BigDecimal;
        add(arg0: BigDecimal, arg1: MathContext): BigDecimal;
        subtract(arg0: BigDecimal): BigDecimal;
        subtract(arg0: BigDecimal, arg1: MathContext): BigDecimal;
        multiply(arg0: BigDecimal): BigDecimal;
        multiply(arg0: BigDecimal, arg1: MathContext): BigDecimal;
        /** @deprecated */
        divide(arg0: BigDecimal, arg1: number, arg2: number): BigDecimal;
        divide(arg0: BigDecimal, arg1: number, arg2: RoundingMode): BigDecimal;
        /** @deprecated */
        divide(arg0: BigDecimal, arg1: number): BigDecimal;
        divide(arg0: BigDecimal, arg1: RoundingMode): BigDecimal;
        divide(arg0: BigDecimal): BigDecimal;
        divide(arg0: BigDecimal, arg1: MathContext): BigDecimal;
        divideToIntegralValue(arg0: BigDecimal): BigDecimal;
        divideToIntegralValue(arg0: BigDecimal, arg1: MathContext): BigDecimal;
        remainder(arg0: BigDecimal): BigDecimal;
        remainder(arg0: BigDecimal, arg1: MathContext): BigDecimal;
        divideAndRemainder(arg0: BigDecimal): BigDecimal[];
        divideAndRemainder(arg0: BigDecimal, arg1: MathContext): BigDecimal[];
        sqrt(arg0: MathContext): BigDecimal;
        pow(arg0: number): BigDecimal;
        pow(arg0: number, arg1: MathContext): BigDecimal;
        abs(): BigDecimal;
        abs(arg0: MathContext): BigDecimal;
        negate(): BigDecimal;
        negate(arg0: MathContext): BigDecimal;
        plus(): BigDecimal;
        plus(arg0: MathContext): BigDecimal;
        signum(): number;
        scale(): number;
        precision(): number;
        unscaledValue(): BigInteger;
        round(arg0: MathContext): BigDecimal;
        setScale(arg0: number, arg1: RoundingMode): BigDecimal;
        /** @deprecated */
        setScale(arg0: number, arg1: number): BigDecimal;
        setScale(arg0: number): BigDecimal;
        movePointLeft(arg0: number): BigDecimal;
        movePointRight(arg0: number): BigDecimal;
        scaleByPowerOfTen(arg0: number): BigDecimal;
        stripTrailingZeros(): BigDecimal;
        compareTo(arg0: BigDecimal): number;
        min(arg0: BigDecimal): BigDecimal;
        max(arg0: BigDecimal): BigDecimal;
        toEngineeringString(): string;
        toPlainString(): string;
        toBigInteger(): BigInteger;
        toBigIntegerExact(): BigInteger;
        longValue(): number;
        longValueExact(): number;
        intValue(): number;
        intValueExact(): number;
        shortValueExact(): number;
        byteValueExact(): number;
        floatValue(): number;
        doubleValue(): number;
        ulp(): BigDecimal;
      }

      const BigInteger: JavaClassStatics<{
        new (arg0: number[], arg1: number, arg2: number): BigInteger;
        new (arg0: number[]): BigInteger;
        new (
          arg0: number,
          arg1: number[],
          arg2: number,
          arg3: number
        ): BigInteger;
        new (arg0: number, arg1: number[]): BigInteger;
        new (arg0: string, arg1: number): BigInteger;
        new (arg0: string): BigInteger;
        new (arg0: number, arg1: java.util.Random): BigInteger;
        new (arg0: number, arg1: number, arg2: java.util.Random): BigInteger;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        readonly ZERO: BigInteger;
        readonly ONE: BigInteger;
        readonly TWO: BigInteger;
        readonly TEN: BigInteger;

        probablePrime(arg0: number, arg1: java.util.Random): BigInteger;
        valueOf(arg0: number): BigInteger;
      };
      interface BigInteger
        extends java.lang.Number,
          java.lang.Comparable<BigInteger> {
        nextProbablePrime(): BigInteger;
        add(arg0: BigInteger): BigInteger;
        subtract(arg0: BigInteger): BigInteger;
        multiply(arg0: BigInteger): BigInteger;
        divide(arg0: BigInteger): BigInteger;
        divideAndRemainder(arg0: BigInteger): BigInteger[];
        remainder(arg0: BigInteger): BigInteger;
        pow(arg0: number): BigInteger;
        sqrt(): BigInteger;
        sqrtAndRemainder(): BigInteger[];
        gcd(arg0: BigInteger): BigInteger;
        abs(): BigInteger;
        negate(): BigInteger;
        signum(): number;
        mod(arg0: BigInteger): BigInteger;
        modPow(arg0: BigInteger, arg1: BigInteger): BigInteger;
        modInverse(arg0: BigInteger): BigInteger;
        shiftLeft(arg0: number): BigInteger;
        shiftRight(arg0: number): BigInteger;
        and(arg0: BigInteger): BigInteger;
        or(arg0: BigInteger): BigInteger;
        xor(arg0: BigInteger): BigInteger;
        not(): BigInteger;
        andNot(arg0: BigInteger): BigInteger;
        testBit(arg0: number): boolean;
        setBit(arg0: number): BigInteger;
        clearBit(arg0: number): BigInteger;
        flipBit(arg0: number): BigInteger;
        getLowestSetBit(): number;
        bitLength(): number;
        bitCount(): number;
        isProbablePrime(arg0: number): boolean;
        compareTo(arg0: BigInteger): number;
        min(arg0: BigInteger): BigInteger;
        max(arg0: BigInteger): BigInteger;
        toString(arg0: number): string;
        toString(): string;
        toByteArray(): number[];
        intValue(): number;
        longValue(): number;
        floatValue(): number;
        doubleValue(): number;
        longValueExact(): number;
        intValueExact(): number;
        shortValueExact(): number;
        byteValueExact(): number;
      }

      const RoundingMode: JavaClassStatics<false> & {
        readonly UP: RoundingMode;
        readonly DOWN: RoundingMode;
        readonly CEILING: RoundingMode;
        readonly FLOOR: RoundingMode;
        readonly HALF_UP: RoundingMode;
        readonly HALF_DOWN: RoundingMode;
        readonly HALF_EVEN: RoundingMode;
        readonly UNNECESSARY: RoundingMode;

        values(): RoundingMode[];
        valueOf(arg0: string): RoundingMode;
        valueOf(arg0: number): RoundingMode;
      };
      interface RoundingMode extends java.lang.Enum<RoundingMode> {}

      const MathContext: JavaClassStatics<{
        new (arg0: number): MathContext;
        new (arg0: number, arg1: RoundingMode): MathContext;
        new (arg0: string): MathContext;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        readonly UNLIMITED: MathContext;
        readonly DECIMAL32: MathContext;
        readonly DECIMAL64: MathContext;
        readonly DECIMAL128: MathContext;
      };
      interface MathContext extends java.io.Serializable {
        getPrecision(): number;
        getRoundingMode(): RoundingMode;
      }

      export { BigDecimal, BigInteger, RoundingMode, MathContext };
    }

    namespace net {
      const Socket: JavaClassStatics<{
        new (): Socket;
        new (arg0: Proxy): Socket;
        new (arg0: string, arg1: number): Socket;
        new (arg0: InetAddress, arg1: number): Socket;
        new (
          arg0: string,
          arg1: number,
          arg2: InetAddress,
          arg3: number
        ): Socket;
        new (
          arg0: InetAddress,
          arg1: number,
          arg2: InetAddress,
          arg3: number
        ): Socket;
        /** @deprecated */
        new (arg0: string, arg1: number, arg2: boolean): Socket;
        /** @deprecated */
        new (arg0: InetAddress, arg1: number, arg2: boolean): Socket;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        /** @deprecated */
        setSocketImplFactory(arg0: SocketImplFactory): void;
      };
      interface Socket extends java.io.Closeable {
        connect(arg0: SocketAddress): void;
        connect(arg0: SocketAddress, arg1: number): void;
        bind(arg0: SocketAddress): void;
        getInetAddress(): InetAddress;
        getLocalAddress(): InetAddress;
        getPort(): number;
        getLocalPort(): number;
        getRemoteSocketAddress(): SocketAddress;
        getLocalSocketAddress(): SocketAddress;
        getChannel(): java.nio.channels.SocketChannel;
        getInputStream(): java.io.InputStream;
        getOutputStream(): java.io.OutputStream;
        setTcpNoDelay(arg0: boolean): void;
        getTcpNoDelay(): boolean;
        setSoLinger(arg0: boolean, arg1: number): void;
        getSoLinger(): number;
        sendUrgentData(arg0: number): void;
        setOOBInline(arg0: boolean): void;
        getOOBInline(): boolean;
        setSoTimeout(arg0: number): void;
        getSoTimeout(): number;
        setSendBufferSize(arg0: number): void;
        getSendBufferSize(): number;
        setReceiveBufferSize(arg0: number): void;
        getReceiveBufferSize(): number;
        setKeepAlive(arg0: boolean): void;
        getKeepAlive(): boolean;
        setTrafficClass(arg0: number): void;
        getTrafficClass(): number;
        setReuseAddress(arg0: boolean): void;
        getReuseAddress(): boolean;
        close(): void;
        shutdownInput(): void;
        shutdownOutput(): void;
        isConnected(): boolean;
        isBound(): boolean;
        isClosed(): boolean;
        isInputShutdown(): boolean;
        isOutputShutdown(): boolean;
        setPerformancePreferences(
          arg0: number,
          arg1: number,
          arg2: number
        ): void;
        setOption<T>(arg0: SocketOption<T>, arg1: T): Socket;
        getOption<T>(arg0: SocketOption<T>): T;
        supportedOptions(): JavaSet<SocketOption<any>>;
      }

      const InetAddress: JavaClassStatics<false> & {
        getByAddress(arg0: string, arg1: number[]): InetAddress;
        getByName(arg0: string): InetAddress;
        getAllByName(arg0: string): InetAddress[];
        getLoopbackAddress(): InetAddress;
        getByAddress(arg0: number[]): InetAddress;
        getLocalHost(): InetAddress;
      };
      interface InetAddress extends java.io.Serializable {
        isMulticastAddress(): boolean;
        isAnyLocalAddress(): boolean;
        isLoopbackAddress(): boolean;
        isLinkLocalAddress(): boolean;
        isSiteLocalAddress(): boolean;
        isMCGlobal(): boolean;
        isMCNodeLocal(): boolean;
        isMCLinkLocal(): boolean;
        isMCSiteLocal(): boolean;
        isMCOrgLocal(): boolean;
        isReachable(arg0: number): boolean;
        isReachable(
          arg0: NetworkInterface,
          arg1: number,
          arg2: number
        ): boolean;
        getHostName(): string;
        getCanonicalHostName(): string;
        getAddress(): number[];
        getHostAddress(): string;
      }

      const Proxy: JavaClassStatics<
        [Proxy],
        [arg0: Proxy$Type, arg1: SocketAddress]
      > & {
        readonly NO_PROXY: Proxy;
      };
      interface Proxy extends JavaObject {
        type(): Proxy$Type;
        address(): SocketAddress;
      }

      const SocketImplFactory: JavaInterfaceStatics;
      interface SocketImplFactory extends JavaObject {
        createSocketImpl(): SocketImpl;
      }

      const SocketOption: JavaInterfaceStatics;
      interface SocketOption<T> extends JavaObject {
        name(): string;
        type(): JavaClass<T>;
      }

      const SocketAddress: JavaClassStatics<[SocketAddress]>;
      interface SocketAddress extends java.io.Serializable {}

      const NetworkInterface: JavaClassStatics<false> & {
        getByName(arg0: string): NetworkInterface;
        getByIndex(arg0: number): NetworkInterface;
        getByInetAddress(arg0: InetAddress): NetworkInterface;
        getNetworkInterfaces(): java.util.Enumeration<NetworkInterface>;
        networkInterfaces(): java.util.stream.Stream<NetworkInterface>;
      };
      interface NetworkInterface extends JavaObject {
        getName(): string;
        getInetAddresses(): java.util.Enumeration<InetAddress>;
        inetAddresses(): java.util.stream.Stream<InetAddress>;
        getInterfaceAddresses(): JavaList<InterfaceAddress>;
        getSubInterfaces(): java.util.Enumeration<NetworkInterface>;
        subInterfaces(): java.util.stream.Stream<NetworkInterface>;
        getParent(): NetworkInterface;
        getIndex(): number;
        getDisplayName(): string;
        isUp(): boolean;
        isLoopback(): boolean;
        isPointToPoint(): boolean;
        supportsMulticast(): boolean;
        getHardwareAddress(): number[];
        getMTU(): number;
        isVirtual(): boolean;
      }

      const Proxy$Type: JavaClassStatics<false> & {
        readonly DIRECT: Proxy$Type;
        readonly HTTP: Proxy$Type;
        readonly SOCKS: Proxy$Type;

        values(): Proxy$Type[];
        valueOf(arg0: string): Proxy$Type;
      };
      interface Proxy$Type extends java.lang.Enum<Proxy$Type> {}

      const SocketImpl: JavaClassStatics<[SocketImpl]>;
      interface SocketImpl extends SocketOptions {}

      const SocketOptions: JavaInterfaceStatics & {
        readonly TCP_NODELAY: number;
        readonly SO_BINDADDR: number;
        readonly SO_REUSEADDR: number;
        readonly SO_REUSEPORT: number;
        readonly SO_BROADCAST: number;
        readonly IP_MULTICAST_IF: number;
        readonly IP_MULTICAST_IF2: number;
        readonly IP_MULTICAST_LOOP: number;
        readonly IP_TOS: number;
        readonly SO_LINGER: number;
        readonly SO_TIMEOUT: number;
        readonly SO_SNDBUF: number;
        readonly SO_RCVBUF: number;
        readonly SO_KEEPALIVE: number;
        readonly SO_OOBINLINE: number;
      };
      interface SocketOptions extends JavaObject {
        setOption(arg0: number, arg1: any): void;
        getOption(arg0: number): any;
      }

      const InterfaceAddress: JavaClassStatics<false>;
      interface InterfaceAddress extends JavaObject {
        getAddress(): InetAddress;
        getBroadcast(): InetAddress;
        getNetworkPrefixLength(): number;
      }

      const ServerSocket: JavaClassStatics<{
        new (): ServerSocket;
        new (arg0: number): ServerSocket;
        new (arg0: number, arg1: number): ServerSocket;
        new (arg0: number, arg1: number, arg2: InetAddress): ServerSocket;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        /** @deprecated */
        setSocketFactory(arg0: SocketImplFactory): void;
      };
      interface ServerSocket extends java.io.Closeable {
        bind(arg0: SocketAddress): void;
        bind(arg0: SocketAddress, arg1: number): void;
        getInetAddress(): InetAddress;
        getLocalPort(): number;
        getLocalSocketAddress(): SocketAddress;
        accept(): Socket;
        close(): void;
        getChannel(): java.nio.channels.ServerSocketChannel;
        isBound(): boolean;
        isClosed(): boolean;
        setSoTimeout(arg0: number): void;
        getSoTimeout(): number;
        setReuseAddress(arg0: boolean): void;
        getReuseAddress(): boolean;
        setReceiveBufferSize(arg0: number): void;
        getReceiveBufferSize(): number;
        setPerformancePreferences(
          arg0: number,
          arg1: number,
          arg2: number
        ): void;
        setOption<T>(arg0: SocketOption<T>, arg1: T): ServerSocket;
        getOption<T>(arg0: SocketOption<T>): T;
        supportedOptions(): JavaSet<SocketOption<any>>;
      }

      const DatagramSocket: JavaClassStatics<{
        new (): DatagramSocket;
        new (arg0: SocketAddress): DatagramSocket;
        new (arg0: number): DatagramSocket;
        new (arg0: number, arg1: InetAddress): DatagramSocket;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        /** @deprecated */
        setDatagramSocketImplFactory(arg0: DatagramSocketImplFactory): void;
      };
      interface DatagramSocket extends java.io.Closeable {
        bind(arg0: SocketAddress): void;
        connect(arg0: InetAddress, arg1: number): void;
        connect(arg0: SocketAddress): void;
        disconnect(): void;
        isBound(): boolean;
        isConnected(): boolean;
        getInetAddress(): InetAddress;
        getPort(): number;
        getRemoteSocketAddress(): SocketAddress;
        getLocalSocketAddress(): SocketAddress;
        send(arg0: DatagramPacket): void;
        receive(arg0: DatagramPacket): void;
        getLocalAddress(): InetAddress;
        getLocalPort(): number;
        setSoTimeout(arg0: number): void;
        getSoTimeout(): number;
        setSendBufferSize(arg0: number): void;
        getSendBufferSize(): number;
        setReceiveBufferSize(arg0: number): void;
        getReceiveBufferSize(): number;
        setReuseAddress(arg0: boolean): void;
        getReuseAddress(): boolean;
        setBroadcast(arg0: boolean): void;
        getBroadcast(): boolean;
        setTrafficClass(arg0: number): void;
        getTrafficClass(): number;
        close(): void;
        isClosed(): boolean;
        getChannel(): java.nio.channels.DatagramChannel;
        setOption<T>(arg0: SocketOption<T>, arg1: T): DatagramSocket;
        getOption<T>(arg0: SocketOption<T>): T;
        supportedOptions(): JavaSet<SocketOption<any>>;
        joinGroup(arg0: SocketAddress, arg1: NetworkInterface): void;
        leaveGroup(arg0: SocketAddress, arg1: NetworkInterface): void;
      }

      const ProtocolFamily: JavaInterfaceStatics;
      interface ProtocolFamily extends JavaObject {
        name(): string;
      }

      const DatagramPacket: JavaClassStatics<{
        new (arg0: number[], arg1: number, arg2: number): DatagramPacket;
        new (arg0: number[], arg1: number): DatagramPacket;
        new (
          arg0: number[],
          arg1: number,
          arg2: number,
          arg3: InetAddress,
          arg4: number
        ): DatagramPacket;
        new (
          arg0: number[],
          arg1: number,
          arg2: number,
          arg3: SocketAddress
        ): DatagramPacket;
        new (
          arg0: number[],
          arg1: number,
          arg2: InetAddress,
          arg3: number
        ): DatagramPacket;
        new (arg0: number[], arg1: number, arg2: SocketAddress): DatagramPacket;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface DatagramPacket extends JavaObject {
        getAddress(): InetAddress;
        getPort(): number;
        getData(): number[];
        getOffset(): number;
        getLength(): number;
        setData(arg0: number[], arg1: number, arg2: number): void;
        setAddress(arg0: InetAddress): void;
        setPort(arg0: number): void;
        setSocketAddress(arg0: SocketAddress): void;
        getSocketAddress(): SocketAddress;
        setData(arg0: number[]): void;
        setLength(arg0: number): void;
      }

      const DatagramSocketImplFactory: JavaInterfaceStatics;
      interface DatagramSocketImplFactory extends JavaObject {
        createDatagramSocketImpl(): DatagramSocketImpl;
      }

      const DatagramSocketImpl: JavaClassStatics<[DatagramSocketImpl]>;
      interface DatagramSocketImpl extends SocketOptions {}

      export {
        Socket,
        InetAddress,
        Proxy,
        SocketImplFactory,
        SocketOption,
        SocketAddress,
        NetworkInterface,
        Proxy$Type,
        SocketImpl,
        SocketOptions,
        InterfaceAddress,
        ServerSocket,
        DatagramSocket,
        ProtocolFamily,
        DatagramPacket,
        DatagramSocketImplFactory,
        DatagramSocketImpl,
      };
    }

    namespace text {
      const ParsePosition: JavaClassStatics<[ParsePosition], [arg0: number]>;
      interface ParsePosition extends JavaObject {
        getIndex(): number;
        setIndex(arg0: number): void;
        setErrorIndex(arg0: number): void;
        getErrorIndex(): number;
      }

      const Format: JavaClassStatics<false>;
      interface Format extends java.io.Serializable, java.lang.Cloneable {
        format(arg0: any): string;
        format(
          arg0: any,
          arg1: java.lang.StringBuffer,
          arg2: FieldPosition
        ): java.lang.StringBuffer;
        formatToCharacterIterator(arg0: any): AttributedCharacterIterator;
        parseObject(arg0: string, arg1: ParsePosition): any;
        parseObject(arg0: string): any;
        clone(): any;
      }

      const FieldPosition: JavaClassStatics<{
        new (arg0: number): FieldPosition;
        new (arg0: Format$Field): FieldPosition;
        new (arg0: Format$Field, arg1: number): FieldPosition;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface FieldPosition extends JavaObject {
        getFieldAttribute(): Format$Field;
        getField(): number;
        getBeginIndex(): number;
        getEndIndex(): number;
        setBeginIndex(arg0: number): void;
        setEndIndex(arg0: number): void;
      }

      const AttributedCharacterIterator: JavaInterfaceStatics;
      interface AttributedCharacterIterator extends CharacterIterator {
        getRunStart(): number;
        getRunStart(arg0: AttributedCharacterIterator$Attribute): number;
        getRunStart(arg0: JavaSet<any>): number;
        getRunLimit(): number;
        getRunLimit(arg0: AttributedCharacterIterator$Attribute): number;
        getRunLimit(arg0: JavaSet<any>): number;
        getAttributes(): JavaMap<AttributedCharacterIterator$Attribute, any>;
        getAttribute(arg0: AttributedCharacterIterator$Attribute): any;
        getAllAttributeKeys(): JavaSet<AttributedCharacterIterator$Attribute>;
      }

      const AttributedCharacterIterator$Attribute: JavaClassStatics<false> & {
        readonly LANGUAGE: AttributedCharacterIterator$Attribute;
        readonly READING: AttributedCharacterIterator$Attribute;
        readonly INPUT_METHOD_SEGMENT: AttributedCharacterIterator$Attribute;
      };
      interface AttributedCharacterIterator$Attribute
        extends java.io.Serializable {}

      const CharacterIterator: JavaInterfaceStatics & {
        readonly DONE: number;
      };
      interface CharacterIterator extends java.lang.Cloneable {
        first(): number;
        last(): number;
        current(): number;
        next(): number;
        previous(): number;
        setIndex(arg0: number): number;
        getBeginIndex(): number;
        getEndIndex(): number;
        getIndex(): number;
        clone(): any;
      }

      const Format$Field: JavaClassStatics<false>;
      interface Format$Field extends AttributedCharacterIterator$Attribute {}

      export {
        ParsePosition,
        Format,
        FieldPosition,
        AttributedCharacterIterator,
        AttributedCharacterIterator$Attribute,
        CharacterIterator,
        Format$Field,
      };
    }
  }

  namespace javax {
    namespace sound.sampled {
      const Clip: JavaInterfaceStatics & {
        readonly LOOP_CONTINUOUSLY: number;
      };
      interface Clip extends DataLine {
        open(
          arg0: AudioFormat,
          arg1: number[],
          arg2: number,
          arg3: number
        ): void;
        open(arg0: AudioInputStream): void;
        open(): void;
        getFrameLength(): number;
        getMicrosecondLength(): number;
        setFramePosition(arg0: number): void;
        setMicrosecondPosition(arg0: number): void;
        setLoopPoints(arg0: number, arg1: number): void;
        loop(arg0: number): void;
      }

      const AudioInputStream: JavaClassStatics<{
        new (
          arg0: java.io.InputStream,
          arg1: AudioFormat,
          arg2: number
        ): AudioInputStream;
        new (arg0: TargetDataLine): AudioInputStream;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface AudioInputStream extends java.io.InputStream {
        getFormat(): AudioFormat;
        getFrameLength(): number;
        read(): number;
        read(arg0: number[]): number;
        read(arg0: number[], arg1: number, arg2: number): number;
        skip(arg0: number): number;
        available(): number;
        close(): void;
        mark(arg0: number): void;
        reset(): void;
        markSupported(): boolean;
      }

      const AudioFormat: JavaClassStatics<{
        new (
          arg0: AudioFormat$Encoding,
          arg1: number,
          arg2: number,
          arg3: number,
          arg4: number,
          arg5: number,
          arg6: boolean
        ): AudioFormat;
        new (
          arg0: AudioFormat$Encoding,
          arg1: number,
          arg2: number,
          arg3: number,
          arg4: number,
          arg5: number,
          arg6: boolean,
          arg7: JavaMap<string, any>
        ): AudioFormat;
        new (
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: boolean,
          arg4: boolean
        ): AudioFormat;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }>;
      interface AudioFormat extends JavaObject {
        getEncoding(): AudioFormat$Encoding;
        getSampleRate(): number;
        getSampleSizeInBits(): number;
        getChannels(): number;
        getFrameSize(): number;
        getFrameRate(): number;
        isBigEndian(): boolean;
        properties(): JavaMap<string, any>;
        getProperty(arg0: string): any;
        matches(arg0: AudioFormat): boolean;
      }

      const DataLine: JavaInterfaceStatics;
      interface DataLine extends Line {
        drain(): void;
        flush(): void;
        start(): void;
        stop(): void;
        isRunning(): boolean;
        isActive(): boolean;
        getFormat(): AudioFormat;
        getBufferSize(): number;
        available(): number;
        getFramePosition(): number;
        getLongFramePosition(): number;
        getMicrosecondPosition(): number;
        getLevel(): number;
      }

      const Line: JavaInterfaceStatics;
      interface Line extends java.lang.AutoCloseable {
        getLineInfo(): Line$Info;
        open(): void;
        close(): void;
        isOpen(): boolean;
        getControls(): Control[];
        isControlSupported(arg0: Control$Type): boolean;
        getControl(arg0: Control$Type): Control;
        addLineListener(arg0: LineListener): void;
        removeLineListener(arg0: LineListener): void;
      }

      const AudioFormat$Encoding: JavaClassStatics<
        [AudioFormat$Encoding],
        [arg0: string]
      > & {
        readonly PCM_SIGNED: AudioFormat$Encoding;
        readonly PCM_UNSIGNED: AudioFormat$Encoding;
        readonly PCM_FLOAT: AudioFormat$Encoding;
        readonly ULAW: AudioFormat$Encoding;
        readonly ALAW: AudioFormat$Encoding;
      };
      interface AudioFormat$Encoding extends JavaObject {}

      const TargetDataLine: JavaInterfaceStatics;
      interface TargetDataLine extends DataLine {
        open(arg0: AudioFormat, arg1: number): void;
        open(arg0: AudioFormat): void;
        open(): void;
        read(arg0: number[], arg1: number, arg2: number): number;
      }

      const Line$Info: JavaClassStatics<[Line$Info], [arg0: JavaClass<any>]>;
      interface Line$Info extends JavaObject {
        getLineClass(): JavaClass<any>;
        matches(arg0: Line$Info): boolean;
      }

      const LineListener: JavaInterfaceStatics;
      interface LineListener extends java.util.EventListener {
        update(arg0: LineEvent): void;
      }

      const Control: JavaClassStatics<false>;
      interface Control extends JavaObject {
        getType(): Control$Type;
      }

      const Control$Type: JavaClassStatics<false>;
      interface Control$Type extends JavaObject {}

      const LineEvent: JavaClassStatics<
        [LineEvent],
        [arg0: Line, arg1: LineEvent$Type, arg2: number]
      >;
      interface LineEvent extends java.util.EventObject {
        getLine(): Line;
        getType(): LineEvent$Type;
        getFramePosition(): number;
      }

      const LineEvent$Type: JavaClassStatics<false> & {
        readonly OPEN: LineEvent$Type;
        readonly CLOSE: LineEvent$Type;
        readonly START: LineEvent$Type;
        readonly STOP: LineEvent$Type;
      };
      interface LineEvent$Type extends JavaObject {}

      export {
        Clip,
        AudioInputStream,
        AudioFormat,
        DataLine,
        Line,
        AudioFormat$Encoding,
        TargetDataLine,
        Line$Info,
        LineListener,
        Control,
        Control$Type,
        LineEvent,
        LineEvent$Type,
      };
    }

    namespace security.auth {
      const Subject: JavaClassStatics<{
        new (): Subject;
        new (
          arg0: boolean,
          arg1: JavaSet<any>,
          arg2: JavaSet<any>,
          arg3: JavaSet<any>
        ): Subject;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        /** @deprecated */
        getSubject(arg0: java.security.AccessControlContext): Subject;
        doAs<T>(arg0: Subject, arg1: java.security.PrivilegedAction<T>): T;
        doAs<T>(
          arg0: Subject,
          arg1: java.security.PrivilegedExceptionAction<T>
        ): T;
        /** @deprecated */
        doAsPrivileged<T>(
          arg0: Subject,
          arg1: java.security.PrivilegedAction<T>,
          arg2: java.security.AccessControlContext
        ): T;
        /** @deprecated */
        doAsPrivileged<T>(
          arg0: Subject,
          arg1: java.security.PrivilegedExceptionAction<T>,
          arg2: java.security.AccessControlContext
        ): T;
      };
      interface Subject extends java.io.Serializable {
        setReadOnly(): void;
        isReadOnly(): boolean;
        getPrincipals(): JavaSet<java.security.Principal>;
        getPrincipals<T>(arg0: JavaClass<T>): JavaSet<T>;
        getPublicCredentials(): JavaSet<any>;
        getPrivateCredentials(): JavaSet<any>;
        getPublicCredentials<T>(arg0: JavaClass<T>): JavaSet<T>;
        getPrivateCredentials<T>(arg0: JavaClass<T>): JavaSet<T>;
      }

      export { Subject };
    }
  }

  namespace javassist {
    const CtClass: JavaClassStatics<false> & {
      debugDump: string;
      readonly version: string;
      booleanType: CtClass;
      charType: CtClass;
      byteType: CtClass;
      shortType: CtClass;
      intType: CtClass;
      longType: CtClass;
      floatType: CtClass;
      doubleType: CtClass;
      voidType: CtClass;

      main(arg0: string[]): void;
    };
    interface CtClass extends JavaObject {
      getClassPool(): ClassPool;
      getClassFile(): javassist.bytecode.ClassFile;
      getClassFile2(): javassist.bytecode.ClassFile;
      getAccessorMaker(): javassist.compiler.AccessorMaker;
      getURL(): java.net.URL;
      isModified(): boolean;
      isFrozen(): boolean;
      freeze(): void;
      defrost(): void;
      isPrimitive(): boolean;
      isArray(): boolean;
      isKotlin(): boolean;
      getComponentType(): CtClass;
      subtypeOf(arg0: CtClass): boolean;
      getName(): string;
      getSimpleName(): string;
      getPackageName(): string;
      setName(arg0: string): void;
      getGenericSignature(): string;
      setGenericSignature(arg0: string): void;
      replaceClassName(arg0: string, arg1: string): void;
      replaceClassName(arg0: ClassMap): void;
      getRefClasses(): JavaCollection<string>;
      isInterface(): boolean;
      isAnnotation(): boolean;
      isEnum(): boolean;
      getModifiers(): number;
      hasAnnotation(arg0: JavaClass<any>): boolean;
      hasAnnotation(arg0: string): boolean;
      getAnnotation(arg0: JavaClass<any>): any;
      getAnnotations(): any[];
      getAvailableAnnotations(): any[];
      getDeclaredClasses(): CtClass[];
      getNestedClasses(): CtClass[];
      setModifiers(arg0: number): void;
      subclassOf(arg0: CtClass): boolean;
      getSuperclass(): CtClass;
      setSuperclass(arg0: CtClass): void;
      getInterfaces(): CtClass[];
      setInterfaces(arg0: CtClass[]): void;
      addInterface(arg0: CtClass): void;
      getDeclaringClass(): CtClass;
      /** @deprecated */
      getEnclosingMethod(): CtMethod;
      getEnclosingBehavior(): CtBehavior;
      makeNestedClass(arg0: string, arg1: boolean): CtClass;
      getFields(): CtField[];
      getField(arg0: string): CtField;
      getField(arg0: string, arg1: string): CtField;
      getDeclaredFields(): CtField[];
      getDeclaredField(arg0: string): CtField;
      getDeclaredField(arg0: string, arg1: string): CtField;
      getDeclaredBehaviors(): CtBehavior[];
      getConstructors(): CtConstructor[];
      getConstructor(arg0: string): CtConstructor;
      getDeclaredConstructors(): CtConstructor[];
      getDeclaredConstructor(arg0: CtClass[]): CtConstructor;
      getClassInitializer(): CtConstructor;
      getMethods(): CtMethod[];
      getMethod(arg0: string, arg1: string): CtMethod;
      getDeclaredMethods(): CtMethod[];
      getDeclaredMethod(arg0: string, arg1: CtClass[]): CtMethod;
      getDeclaredMethods(arg0: string): CtMethod[];
      getDeclaredMethod(arg0: string): CtMethod;
      makeClassInitializer(): CtConstructor;
      addConstructor(arg0: CtConstructor): void;
      removeConstructor(arg0: CtConstructor): void;
      addMethod(arg0: CtMethod): void;
      removeMethod(arg0: CtMethod): void;
      addField(arg0: CtField): void;
      addField(arg0: CtField, arg1: string): void;
      addField(arg0: CtField, arg1: CtField$Initializer): void;
      removeField(arg0: CtField): void;
      getAttribute(arg0: string): number[];
      setAttribute(arg0: string, arg1: number[]): void;
      instrument(arg0: CodeConverter): void;
      instrument(arg0: javassist.expr.ExprEditor): void;
      toClass(): JavaClass<any>;
      toClass(arg0: JavaClass<any>): JavaClass<any>;
      toClass(arg0: java.lang.invoke.MethodHandles$Lookup): JavaClass<any>;
      toClass(
        arg0: java.lang.ClassLoader,
        arg1: java.security.ProtectionDomain
      ): JavaClass<any>;
      /** @deprecated */
      toClass(arg0: java.lang.ClassLoader): JavaClass<any>;
      detach(): void;
      stopPruning(arg0: boolean): boolean;
      prune(): void;
      rebuildClassFile(): void;
      toBytecode(): number[];
      writeFile(): void;
      writeFile(arg0: string): void;
      debugWriteFile(): void;
      debugWriteFile(arg0: string): void;
      toBytecode(arg0: java.io.DataOutputStream): void;
      makeUniqueName(arg0: string): string;
    }

    const CtField$Initializer: JavaClassStatics<[CtField$Initializer]> & {
      constant(arg0: number): CtField$Initializer;
      constant(arg0: boolean): CtField$Initializer;
      constant(arg0: number): CtField$Initializer;
      constant(arg0: number): CtField$Initializer;
      constant(arg0: number): CtField$Initializer;
      constant(arg0: string): CtField$Initializer;
      byParameter(arg0: number): CtField$Initializer;
      byNew(arg0: CtClass): CtField$Initializer;
      byNew(arg0: CtClass, arg1: string[]): CtField$Initializer;
      byNewWithParams(arg0: CtClass): CtField$Initializer;
      byNewWithParams(arg0: CtClass, arg1: string[]): CtField$Initializer;
      byCall(arg0: CtClass, arg1: string): CtField$Initializer;
      byCall(arg0: CtClass, arg1: string, arg2: string[]): CtField$Initializer;
      byCallWithParams(arg0: CtClass, arg1: string): CtField$Initializer;
      byCallWithParams(
        arg0: CtClass,
        arg1: string,
        arg2: string[]
      ): CtField$Initializer;
      byNewArray(arg0: CtClass, arg1: number): CtField$Initializer;
      byNewArray(arg0: CtClass, arg1: number[]): CtField$Initializer;
      byExpr(arg0: string): CtField$Initializer;
    };
    interface CtField$Initializer extends JavaObject {}

    const CtBehavior: JavaClassStatics<false>;
    interface CtBehavior extends CtMember {
      getLongName(): string;
      getMethodInfo(): javassist.bytecode.MethodInfo;
      getMethodInfo2(): javassist.bytecode.MethodInfo;
      getModifiers(): number;
      setModifiers(arg0: number): void;
      hasAnnotation(arg0: string): boolean;
      hasAnnotation(arg0: JavaClass<any>): boolean;
      getAnnotation(arg0: JavaClass<any>): any;
      getAnnotations(): any[];
      getAvailableAnnotations(): any[];
      getParameterAnnotations(): any[][];
      getAvailableParameterAnnotations(): any[][];
      getParameterTypes(): CtClass[];
      getSignature(): string;
      getGenericSignature(): string;
      setGenericSignature(arg0: string): void;
      getExceptionTypes(): CtClass[];
      setExceptionTypes(arg0: CtClass[]): void;
      isEmpty(): boolean;
      setBody(arg0: string): void;
      setBody(arg0: string, arg1: string, arg2: string): void;
      getAttribute(arg0: string): number[];
      setAttribute(arg0: string, arg1: number[]): void;
      useCflow(arg0: string): void;
      addLocalVariable(arg0: string, arg1: CtClass): void;
      insertParameter(arg0: CtClass): void;
      addParameter(arg0: CtClass): void;
      instrument(arg0: CodeConverter): void;
      instrument(arg0: javassist.expr.ExprEditor): void;
      insertBefore(arg0: string): void;
      insertAfter(arg0: string): void;
      insertAfter(arg0: string, arg1: boolean): void;
      insertAfter(arg0: string, arg1: boolean, arg2: boolean): void;
      addCatch(arg0: string, arg1: CtClass): void;
      addCatch(arg0: string, arg1: CtClass, arg2: string): void;
      insertAt(arg0: number, arg1: string): number;
      insertAt(arg0: number, arg1: boolean, arg2: string): number;
    }

    const ClassMap: JavaClassStatics<[ClassMap]> & {
      toJvmName(arg0: string): string;
      toJavaName(arg0: string): string;
    };
    interface ClassMap extends java.util.HashMap<string, string> {
      put(arg0: CtClass, arg1: CtClass): void;
      put(arg0: string, arg1: string): string;
      putIfNone(arg0: string, arg1: string): void;
      get(arg0: any): string;
      fix(arg0: CtClass): void;
      fix(arg0: string): void;
    }

    const CtMember: JavaClassStatics<false>;
    interface CtMember extends JavaObject {
      getDeclaringClass(): CtClass;
      visibleFrom(arg0: CtClass): boolean;
      getModifiers(): number;
      setModifiers(arg0: number): void;
      hasAnnotation(arg0: JavaClass<any>): boolean;
      hasAnnotation(arg0: string): boolean;
      getAnnotation(arg0: JavaClass<any>): any;
      getAnnotations(): any[];
      getAvailableAnnotations(): any[];
      getName(): string;
      getSignature(): string;
      getGenericSignature(): string;
      setGenericSignature(arg0: string): void;
      getAttribute(arg0: string): number[];
      setAttribute(arg0: string, arg1: number[]): void;
    }

    const ClassPool: JavaClassStatics<{
      new (): ClassPool;
      new (arg0: boolean): ClassPool;
      new (arg0: ClassPool): ClassPool;

      /** @deprecated */ Symbol: unknown;
      /** @deprecated */ apply: unknown;
      /** @deprecated */ arguments: unknown;
      /** @deprecated */ bind: unknown;
      /** @deprecated */ call: unknown;
      /** @deprecated */ caller: unknown;
      /** @deprecated */ length: unknown;
      /** @deprecated */ name: unknown;
      /** @deprecated */ prototype: unknown;
    }> & {
      doPruning: boolean;
      releaseUnmodifiedClassFile: boolean;
      cacheOpenedJarFile: boolean;

      getDefault(): ClassPool;
    };
    interface ClassPool extends JavaObject {
      childFirstLookup: boolean;

      importPackage(arg0: string): void;
      clearImportedPackages(): void;
      getImportedPackages(): java.util.Iterator<string>;
      /** @deprecated */
      recordInvalidClassName(arg0: string): void;
      lookupCflow(arg0: string): any[];
      getAndRename(arg0: string, arg1: string): CtClass;
      get(arg0: string): CtClass;
      getOrNull(arg0: string): CtClass;
      getCtClass(arg0: string): CtClass;
      find(arg0: string): java.net.URL;
      get(arg0: string[]): CtClass[];
      getMethod(arg0: string, arg1: string): CtMethod;
      makeClass(arg0: java.io.InputStream): CtClass;
      makeClass(arg0: java.io.InputStream, arg1: boolean): CtClass;
      makeClass(arg0: javassist.bytecode.ClassFile): CtClass;
      makeClass(arg0: javassist.bytecode.ClassFile, arg1: boolean): CtClass;
      makeClassIfNew(arg0: java.io.InputStream): CtClass;
      makeClass(arg0: string): CtClass;
      makeClass(arg0: string, arg1: CtClass): CtClass;
      makeInterface(arg0: string): CtClass;
      makeInterface(arg0: string, arg1: CtClass): CtClass;
      makeAnnotation(arg0: string): CtClass;
      appendSystemPath(): ClassPath;
      insertClassPath(arg0: ClassPath): ClassPath;
      appendClassPath(arg0: ClassPath): ClassPath;
      insertClassPath(arg0: string): ClassPath;
      appendClassPath(arg0: string): ClassPath;
      removeClassPath(arg0: ClassPath): void;
      appendPathList(arg0: string): void;
      toClass(arg0: CtClass): JavaClass;
      getClassLoader(): java.lang.ClassLoader;
      /** @deprecated */
      toClass(arg0: CtClass, arg1: java.lang.ClassLoader): JavaClass;
      /** @deprecated */
      toClass(
        arg0: CtClass,
        arg1: java.lang.ClassLoader,
        arg2: java.security.ProtectionDomain
      ): JavaClass;
      toClass(arg0: CtClass, arg1: JavaClass<any>): JavaClass<any>;
      toClass(
        arg0: CtClass,
        arg1: java.lang.invoke.MethodHandles$Lookup
      ): JavaClass<any>;
      toClass(
        arg0: CtClass,
        arg1: JavaClass<any>,
        arg2: java.lang.ClassLoader,
        arg3: java.security.ProtectionDomain
      ): JavaClass;
      /** @deprecated */
      makePackage(arg0: java.lang.ClassLoader, arg1: string): void;
    }

    const CtConstructor: JavaClassStatics<{
      new (arg0: CtClass[], arg1: CtClass): CtConstructor;
      new (arg0: CtConstructor, arg1: CtClass, arg2: ClassMap): CtConstructor;

      /** @deprecated */ Symbol: unknown;
      /** @deprecated */ apply: unknown;
      /** @deprecated */ arguments: unknown;
      /** @deprecated */ bind: unknown;
      /** @deprecated */ call: unknown;
      /** @deprecated */ caller: unknown;
      /** @deprecated */ length: unknown;
      /** @deprecated */ name: unknown;
      /** @deprecated */ prototype: unknown;
    }>;
    interface CtConstructor extends CtBehavior {
      isConstructor(): boolean;
      isClassInitializer(): boolean;
      getLongName(): string;
      getName(): string;
      isEmpty(): boolean;
      callsSuper(): boolean;
      setBody(arg0: string): void;
      setBody(arg0: CtConstructor, arg1: ClassMap): void;
      setBody(arg0: string, arg1: string, arg2: string): void;
      insertBeforeBody(arg0: string): void;
      toMethod(arg0: string, arg1: CtClass): CtMethod;
      toMethod(arg0: string, arg1: CtClass, arg2: ClassMap): CtMethod;
    }

    const CtMethod: JavaClassStatics<{
      new (
        arg0: CtClass,
        arg1: string,
        arg2: CtClass[],
        arg3: CtClass
      ): CtMethod;
      new (arg0: CtMethod, arg1: CtClass, arg2: ClassMap): CtMethod;

      /** @deprecated */ Symbol: unknown;
      /** @deprecated */ apply: unknown;
      /** @deprecated */ arguments: unknown;
      /** @deprecated */ bind: unknown;
      /** @deprecated */ call: unknown;
      /** @deprecated */ caller: unknown;
      /** @deprecated */ length: unknown;
      /** @deprecated */ name: unknown;
      /** @deprecated */ prototype: unknown;
    }> & {
      make(arg0: string, arg1: CtClass): CtMethod;
      make(arg0: javassist.bytecode.MethodInfo, arg1: CtClass): CtMethod;
    };
    interface CtMethod extends CtBehavior {
      getLongName(): string;
      getName(): string;
      setName(arg0: string): void;
      getReturnType(): CtClass;
      isEmpty(): boolean;
      setBody(arg0: CtMethod, arg1: ClassMap): void;
      setBody(arg0: string): void;
      setBody(arg0: string, arg1: string, arg2: string): void;
      setWrappedBody(arg0: CtMethod, arg1: CtMethod$ConstParameter): void;
    }

    const CtField: JavaClassStatics<{
      new (arg0: CtClass, arg1: string, arg2: CtClass): CtField;
      new (arg0: CtField, arg1: CtClass): CtField;

      /** @deprecated */ Symbol: unknown;
      /** @deprecated */ apply: unknown;
      /** @deprecated */ arguments: unknown;
      /** @deprecated */ bind: unknown;
      /** @deprecated */ call: unknown;
      /** @deprecated */ caller: unknown;
      /** @deprecated */ length: unknown;
      /** @deprecated */ name: unknown;
      /** @deprecated */ prototype: unknown;
    }> & {
      make(arg0: string, arg1: CtClass): CtField;
    };
    interface CtField extends CtMember {
      getFieldInfo(): javassist.bytecode.FieldInfo;
      getFieldInfo2(): javassist.bytecode.FieldInfo;
      getDeclaringClass(): CtClass;
      getName(): string;
      setName(arg0: string): void;
      getModifiers(): number;
      setModifiers(arg0: number): void;
      hasAnnotation(arg0: string): boolean;
      hasAnnotation(arg0: JavaClass<any>): boolean;
      getAnnotation(arg0: JavaClass<any>): any;
      getAnnotations(): any[];
      getAvailableAnnotations(): any[];
      getSignature(): string;
      getGenericSignature(): string;
      setGenericSignature(arg0: string): void;
      getType(): CtClass;
      setType(arg0: CtClass): void;
      getConstantValue(): any;
      getAttribute(arg0: string): number[];
      setAttribute(arg0: string, arg1: number[]): void;
    }

    const CodeConverter: JavaClassStatics<[CodeConverter]>;
    interface CodeConverter extends JavaObject {
      replaceNew(arg0: CtClass, arg1: CtClass, arg2: string): void;
      replaceNew(arg0: CtClass, arg1: CtClass): void;
      redirectFieldAccess(arg0: CtField, arg1: CtClass, arg2: string): void;
      replaceFieldRead(arg0: CtField, arg1: CtClass, arg2: string): void;
      replaceFieldWrite(arg0: CtField, arg1: CtClass, arg2: string): void;
      replaceArrayAccess(
        arg0: CtClass,
        arg1: CodeConverter$ArrayAccessReplacementMethodNames
      ): void;
      redirectMethodCall(arg0: CtMethod, arg1: CtMethod): void;
      redirectMethodCall(arg0: string, arg1: CtMethod): void;
      redirectMethodCallToStatic(arg0: CtMethod, arg1: CtMethod): void;
      insertBeforeMethod(arg0: CtMethod, arg1: CtMethod): void;
      insertAfterMethod(arg0: CtMethod, arg1: CtMethod): void;
    }

    const CodeConverter$ArrayAccessReplacementMethodNames: JavaInterfaceStatics;
    interface CodeConverter$ArrayAccessReplacementMethodNames
      extends JavaObject {
      byteOrBooleanRead(): string;
      byteOrBooleanWrite(): string;
      charRead(): string;
      charWrite(): string;
      doubleRead(): string;
      doubleWrite(): string;
      floatRead(): string;
      floatWrite(): string;
      intRead(): string;
      intWrite(): string;
      longRead(): string;
      longWrite(): string;
      objectRead(): string;
      objectWrite(): string;
      shortRead(): string;
      shortWrite(): string;
    }

    const ClassPath: JavaInterfaceStatics;
    interface ClassPath extends JavaObject {
      openClassfile(arg0: string): java.io.InputStream;
      find(arg0: string): java.net.URL;
    }

    const CtMethod$ConstParameter: JavaClassStatics<false> & {
      integer(arg0: number): CtMethod$ConstParameter;
      integer(arg0: number): CtMethod$ConstParameter;
      string(arg0: string): CtMethod$ConstParameter;
    };
    interface CtMethod$ConstParameter extends JavaObject {}

    namespace util.proxy {
      const ProxyFactory: JavaClassStatics<[ProxyFactory]> & {
        onlyPublicMethods: boolean;
        useCache: boolean;
        useWriteReplace: boolean;
        classLoaderProvider: ProxyFactory$ClassLoaderProvider;
        nameGenerator: ProxyFactory$UniqueName;

        isProxyClass(arg0: JavaClass<any>): boolean;
        getHandler(arg0: Proxy): MethodHandler;
      };
      interface ProxyFactory extends JavaObject {
        writeDirectory: string;

        isUseCache(): boolean;
        setUseCache(arg0: boolean): void;
        isUseWriteReplace(): boolean;
        setUseWriteReplace(arg0: boolean): void;
        setSuperclass(arg0: JavaClass<any>): void;
        getSuperclass(): JavaClass<any>;
        setInterfaces(arg0: JavaClass<any>[]): void;
        getInterfaces(): JavaClass<any>[];
        setFilter(arg0: MethodFilter): void;
        setGenericSignature(arg0: string): void;
        createClass(): JavaClass<any>;
        createClass(arg0: MethodFilter): JavaClass<any>;
        createClass(
          arg0: java.lang.invoke.MethodHandles$Lookup
        ): JavaClass<any>;
        createClass(
          arg0: java.lang.invoke.MethodHandles$Lookup,
          arg1: MethodFilter
        ): JavaClass<any>;
        getKey(
          arg0: JavaClass<any>,
          arg1: JavaClass<any>[],
          arg2: number[],
          arg3: boolean
        ): string;
        create(arg0: JavaClass<any>[], arg1: any[], arg2: MethodHandler): any;
        create(arg0: JavaClass<any>[], arg1: any[]): any;
        /** @deprecated */
        setHandler(arg0: MethodHandler): void;
      }

      const Proxy: JavaInterfaceStatics;
      interface Proxy extends JavaObject {
        setHandler(arg0: MethodHandler): void;
      }

      const ProxyFactory$UniqueName: JavaInterfaceStatics;
      interface ProxyFactory$UniqueName extends JavaObject {
        get(arg0: string): string;
      }

      const ProxyFactory$ClassLoaderProvider: JavaInterfaceStatics;
      interface ProxyFactory$ClassLoaderProvider extends JavaObject {
        get(arg0: ProxyFactory): java.lang.ClassLoader;
      }

      const MethodHandler: JavaInterfaceStatics;
      interface MethodHandler extends JavaObject {
        invoke(
          arg0: any,
          arg1: java.lang.reflect.Method,
          arg2: java.lang.reflect.Method,
          arg3: any[]
        ): any;
      }

      const MethodFilter: JavaInterfaceStatics;
      interface MethodFilter extends JavaObject {
        isHandled(arg0: java.lang.reflect.Method): boolean;
      }

      export {
        ProxyFactory,
        Proxy,
        ProxyFactory$UniqueName,
        ProxyFactory$ClassLoaderProvider,
        MethodHandler,
        MethodFilter,
      };
    }

    namespace bytecode {
      const Opcode: JavaInterfaceStatics & {
        readonly AALOAD: number;
        readonly AASTORE: number;
        readonly ACONST_NULL: number;
        readonly ALOAD: number;
        readonly ALOAD_0: number;
        readonly ALOAD_1: number;
        readonly ALOAD_2: number;
        readonly ALOAD_3: number;
        readonly ANEWARRAY: number;
        readonly ARETURN: number;
        readonly ARRAYLENGTH: number;
        readonly ASTORE: number;
        readonly ASTORE_0: number;
        readonly ASTORE_1: number;
        readonly ASTORE_2: number;
        readonly ASTORE_3: number;
        readonly ATHROW: number;
        readonly BALOAD: number;
        readonly BASTORE: number;
        readonly BIPUSH: number;
        readonly CALOAD: number;
        readonly CASTORE: number;
        readonly CHECKCAST: number;
        readonly D2F: number;
        readonly D2I: number;
        readonly D2L: number;
        readonly DADD: number;
        readonly DALOAD: number;
        readonly DASTORE: number;
        readonly DCMPG: number;
        readonly DCMPL: number;
        readonly DCONST_0: number;
        readonly DCONST_1: number;
        readonly DDIV: number;
        readonly DLOAD: number;
        readonly DLOAD_0: number;
        readonly DLOAD_1: number;
        readonly DLOAD_2: number;
        readonly DLOAD_3: number;
        readonly DMUL: number;
        readonly DNEG: number;
        readonly DREM: number;
        readonly DRETURN: number;
        readonly DSTORE: number;
        readonly DSTORE_0: number;
        readonly DSTORE_1: number;
        readonly DSTORE_2: number;
        readonly DSTORE_3: number;
        readonly DSUB: number;
        readonly DUP: number;
        readonly DUP2: number;
        readonly DUP2_X1: number;
        readonly DUP2_X2: number;
        readonly DUP_X1: number;
        readonly DUP_X2: number;
        readonly F2D: number;
        readonly F2I: number;
        readonly F2L: number;
        readonly FADD: number;
        readonly FALOAD: number;
        readonly FASTORE: number;
        readonly FCMPG: number;
        readonly FCMPL: number;
        readonly FCONST_0: number;
        readonly FCONST_1: number;
        readonly FCONST_2: number;
        readonly FDIV: number;
        readonly FLOAD: number;
        readonly FLOAD_0: number;
        readonly FLOAD_1: number;
        readonly FLOAD_2: number;
        readonly FLOAD_3: number;
        readonly FMUL: number;
        readonly FNEG: number;
        readonly FREM: number;
        readonly FRETURN: number;
        readonly FSTORE: number;
        readonly FSTORE_0: number;
        readonly FSTORE_1: number;
        readonly FSTORE_2: number;
        readonly FSTORE_3: number;
        readonly FSUB: number;
        readonly GETFIELD: number;
        readonly GETSTATIC: number;
        readonly GOTO: number;
        readonly GOTO_W: number;
        readonly I2B: number;
        readonly I2C: number;
        readonly I2D: number;
        readonly I2F: number;
        readonly I2L: number;
        readonly I2S: number;
        readonly IADD: number;
        readonly IALOAD: number;
        readonly IAND: number;
        readonly IASTORE: number;
        readonly ICONST_0: number;
        readonly ICONST_1: number;
        readonly ICONST_2: number;
        readonly ICONST_3: number;
        readonly ICONST_4: number;
        readonly ICONST_5: number;
        readonly ICONST_M1: number;
        readonly IDIV: number;
        readonly IFEQ: number;
        readonly IFGE: number;
        readonly IFGT: number;
        readonly IFLE: number;
        readonly IFLT: number;
        readonly IFNE: number;
        readonly IFNONNULL: number;
        readonly IFNULL: number;
        readonly IF_ACMPEQ: number;
        readonly IF_ACMPNE: number;
        readonly IF_ICMPEQ: number;
        readonly IF_ICMPGE: number;
        readonly IF_ICMPGT: number;
        readonly IF_ICMPLE: number;
        readonly IF_ICMPLT: number;
        readonly IF_ICMPNE: number;
        readonly IINC: number;
        readonly ILOAD: number;
        readonly ILOAD_0: number;
        readonly ILOAD_1: number;
        readonly ILOAD_2: number;
        readonly ILOAD_3: number;
        readonly IMUL: number;
        readonly INEG: number;
        readonly INSTANCEOF: number;
        readonly INVOKEDYNAMIC: number;
        readonly INVOKEINTERFACE: number;
        readonly INVOKESPECIAL: number;
        readonly INVOKESTATIC: number;
        readonly INVOKEVIRTUAL: number;
        readonly IOR: number;
        readonly IREM: number;
        readonly IRETURN: number;
        readonly ISHL: number;
        readonly ISHR: number;
        readonly ISTORE: number;
        readonly ISTORE_0: number;
        readonly ISTORE_1: number;
        readonly ISTORE_2: number;
        readonly ISTORE_3: number;
        readonly ISUB: number;
        readonly IUSHR: number;
        readonly IXOR: number;
        readonly JSR: number;
        readonly JSR_W: number;
        readonly L2D: number;
        readonly L2F: number;
        readonly L2I: number;
        readonly LADD: number;
        readonly LALOAD: number;
        readonly LAND: number;
        readonly LASTORE: number;
        readonly LCMP: number;
        readonly LCONST_0: number;
        readonly LCONST_1: number;
        readonly LDC: number;
        readonly LDC2_W: number;
        readonly LDC_W: number;
        readonly LDIV: number;
        readonly LLOAD: number;
        readonly LLOAD_0: number;
        readonly LLOAD_1: number;
        readonly LLOAD_2: number;
        readonly LLOAD_3: number;
        readonly LMUL: number;
        readonly LNEG: number;
        readonly LOOKUPSWITCH: number;
        readonly LOR: number;
        readonly LREM: number;
        readonly LRETURN: number;
        readonly LSHL: number;
        readonly LSHR: number;
        readonly LSTORE: number;
        readonly LSTORE_0: number;
        readonly LSTORE_1: number;
        readonly LSTORE_2: number;
        readonly LSTORE_3: number;
        readonly LSUB: number;
        readonly LUSHR: number;
        readonly LXOR: number;
        readonly MONITORENTER: number;
        readonly MONITOREXIT: number;
        readonly MULTIANEWARRAY: number;
        readonly NEW: number;
        readonly NEWARRAY: number;
        readonly NOP: number;
        readonly POP: number;
        readonly POP2: number;
        readonly PUTFIELD: number;
        readonly PUTSTATIC: number;
        readonly RET: number;
        readonly RETURN: number;
        readonly SALOAD: number;
        readonly SASTORE: number;
        readonly SIPUSH: number;
        readonly SWAP: number;
        readonly TABLESWITCH: number;
        readonly WIDE: number;
        readonly T_BOOLEAN: number;
        readonly T_CHAR: number;
        readonly T_FLOAT: number;
        readonly T_DOUBLE: number;
        readonly T_BYTE: number;
        readonly T_SHORT: number;
        readonly T_INT: number;
        readonly T_LONG: number;
        readonly STACK_GROW: number[];
      };
      interface Opcode extends JavaObject {}

      const ClassFile: JavaClassStatics<{
        new (arg0: java.io.DataInputStream): ClassFile;
        new (arg0: boolean, arg1: string, arg2: string): ClassFile;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        readonly JAVA_1: number;
        readonly JAVA_2: number;
        readonly JAVA_3: number;
        readonly JAVA_4: number;
        readonly JAVA_5: number;
        readonly JAVA_6: number;
        readonly JAVA_7: number;
        readonly JAVA_8: number;
        readonly JAVA_9: number;
        readonly JAVA_10: number;
        readonly JAVA_11: number;
        readonly MAJOR_VERSION: number;
      };
      interface ClassFile extends JavaObject {
        compact(): void;
        prune(): void;
        getConstPool(): ConstPool;
        isInterface(): boolean;
        isFinal(): boolean;
        isAbstract(): boolean;
        getAccessFlags(): number;
        setAccessFlags(arg0: number): void;
        getInnerAccessFlags(): number;
        getName(): string;
        setName(arg0: string): void;
        getSuperclass(): string;
        getSuperclassId(): number;
        setSuperclass(arg0: string): void;
        renameClass(arg0: string, arg1: string): void;
        renameClass(arg0: JavaMap<string, string>): void;
        getRefClasses(arg0: JavaMap<string, string>): void;
        getInterfaces(): string[];
        setInterfaces(arg0: string[]): void;
        addInterface(arg0: string): void;
        getFields(): JavaList<FieldInfo>;
        addField(arg0: FieldInfo): void;
        addField2(arg0: FieldInfo): void;
        getMethods(): JavaList<MethodInfo>;
        getMethod(arg0: string): MethodInfo;
        getStaticInitializer(): MethodInfo;
        addMethod(arg0: MethodInfo): void;
        addMethod2(arg0: MethodInfo): void;
        getAttributes(): JavaList<AttributeInfo>;
        getAttribute(arg0: string): AttributeInfo;
        removeAttribute(arg0: string): AttributeInfo;
        addAttribute(arg0: AttributeInfo): void;
        getSourceFile(): string;
        write(arg0: java.io.DataOutputStream): void;
        getMajorVersion(): number;
        setMajorVersion(arg0: number): void;
        getMinorVersion(): number;
        setMinorVersion(arg0: number): void;
        setVersionToJava5(): void;
      }

      const FieldInfo: JavaClassStatics<
        [FieldInfo],
        [arg0: ConstPool, arg1: string, arg2: string]
      >;
      interface FieldInfo extends JavaObject {
        getConstPool(): ConstPool;
        getName(): string;
        setName(arg0: string): void;
        getAccessFlags(): number;
        setAccessFlags(arg0: number): void;
        getDescriptor(): string;
        setDescriptor(arg0: string): void;
        getConstantValue(): number;
        getAttributes(): JavaList<AttributeInfo>;
        getAttribute(arg0: string): AttributeInfo;
        removeAttribute(arg0: string): AttributeInfo;
        addAttribute(arg0: AttributeInfo): void;
      }

      const MethodInfo: JavaClassStatics<{
        new (arg0: ConstPool, arg1: string, arg2: string): MethodInfo;
        new (
          arg0: ConstPool,
          arg1: string,
          arg2: MethodInfo,
          arg3: JavaMap<string, string>
        ): MethodInfo;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        doPreverify: boolean;
        readonly nameInit: string;
        readonly nameClinit: string;
      };
      interface MethodInfo extends JavaObject {
        getName(): string;
        setName(arg0: string): void;
        isMethod(): boolean;
        getConstPool(): ConstPool;
        isConstructor(): boolean;
        isStaticInitializer(): boolean;
        getAccessFlags(): number;
        setAccessFlags(arg0: number): void;
        getDescriptor(): string;
        setDescriptor(arg0: string): void;
        getAttributes(): JavaList<AttributeInfo>;
        getAttribute(arg0: string): AttributeInfo;
        removeAttribute(arg0: string): AttributeInfo;
        addAttribute(arg0: AttributeInfo): void;
        getExceptionsAttribute(): ExceptionsAttribute;
        getCodeAttribute(): CodeAttribute;
        removeExceptionsAttribute(): void;
        setExceptionsAttribute(arg0: ExceptionsAttribute): void;
        removeCodeAttribute(): void;
        setCodeAttribute(arg0: CodeAttribute): void;
        rebuildStackMapIf6(arg0: javassist.ClassPool, arg1: ClassFile): void;
        rebuildStackMap(arg0: javassist.ClassPool): void;
        rebuildStackMapForME(arg0: javassist.ClassPool): void;
        getLineNumber(arg0: number): number;
        setSuperclass(arg0: string): void;
      }

      const ConstPool: JavaClassStatics<{
        new (arg0: string): ConstPool;
        new (arg0: java.io.DataInputStream): ConstPool;

        /** @deprecated */ Symbol: unknown;
        /** @deprecated */ apply: unknown;
        /** @deprecated */ arguments: unknown;
        /** @deprecated */ bind: unknown;
        /** @deprecated */ call: unknown;
        /** @deprecated */ caller: unknown;
        /** @deprecated */ length: unknown;
        /** @deprecated */ name: unknown;
        /** @deprecated */ prototype: unknown;
      }> & {
        readonly CONST_Class: number;
        readonly CONST_Fieldref: number;
        readonly CONST_Methodref: number;
        readonly CONST_InterfaceMethodref: number;
        readonly CONST_String: number;
        readonly CONST_Integer: number;
        readonly CONST_Float: number;
        readonly CONST_Long: number;
        readonly CONST_Double: number;
        readonly CONST_NameAndType: number;
        readonly CONST_Utf8: number;
        readonly CONST_MethodHandle: number;
        readonly CONST_MethodType: number;
        readonly CONST_Dynamic: number;
        readonly CONST_DynamicCallSite: number;
        readonly CONST_InvokeDynamic: number;
        readonly CONST_Module: number;
        readonly CONST_Package: number;
        readonly THIS: javassist.CtClass;
        readonly REF_getField: number;
        readonly REF_getStatic: number;
        readonly REF_putField: number;
        readonly REF_putStatic: number;
        readonly REF_invokeVirtual: number;
        readonly REF_invokeStatic: number;
        readonly REF_invokeSpecial: number;
        readonly REF_newInvokeSpecial: number;
        readonly REF_invokeInterface: number;
      };
      interface ConstPool extends JavaObject {
        getSize(): number;
        getClassName(): string;
        getThisClassInfo(): number;
        getTag(arg0: number): number;
        getClassInfo(arg0: number): string;
        getClassInfoByDescriptor(arg0: number): string;
        getNameAndTypeName(arg0: number): number;
        getNameAndTypeDescriptor(arg0: number): number;
        getMemberClass(arg0: number): number;
        getMemberNameAndType(arg0: number): number;
        getFieldrefClass(arg0: number): number;
        getFieldrefClassName(arg0: number): string;
        getFieldrefNameAndType(arg0: number): number;
        getFieldrefName(arg0: number): string;
        getFieldrefType(arg0: number): string;
        getMethodrefClass(arg0: number): number;
        getMethodrefClassName(arg0: number): string;
        getMethodrefNameAndType(arg0: number): number;
        getMethodrefName(arg0: number): string;
        getMethodrefType(arg0: number): string;
        getInterfaceMethodrefClass(arg0: number): number;
        getInterfaceMethodrefClassName(arg0: number): string;
        getInterfaceMethodrefNameAndType(arg0: number): number;
        getInterfaceMethodrefName(arg0: number): string;
        getInterfaceMethodrefType(arg0: number): string;
        getLdcValue(arg0: number): any;
        getIntegerInfo(arg0: number): number;
        getFloatInfo(arg0: number): number;
        getLongInfo(arg0: number): number;
        getDoubleInfo(arg0: number): number;
        getStringInfo(arg0: number): string;
        getUtf8Info(arg0: number): string;
        getMethodHandleKind(arg0: number): number;
        getMethodHandleIndex(arg0: number): number;
        getMethodTypeInfo(arg0: number): number;
        getInvokeDynamicBootstrap(arg0: number): number;
        getInvokeDynamicNameAndType(arg0: number): number;
        getInvokeDynamicType(arg0: number): string;
        getDynamicBootstrap(arg0: number): number;
        getDynamicNameAndType(arg0: number): number;
        getDynamicType(arg0: number): string;
        getModuleInfo(arg0: number): string;
        getPackageInfo(arg0: number): string;
        isConstructor(arg0: string, arg1: number): number;
        isMember(arg0: string, arg1: string, arg2: number): number;
        eqMember(arg0: string, arg1: string, arg2: number): string;
        copy(
          arg0: number,
          arg1: ConstPool,
          arg2: JavaMap<string, string>
        ): number;
        addClassInfo(arg0: javassist.CtClass): number;
        addClassInfo(arg0: string): number;
        addNameAndTypeInfo(arg0: string, arg1: string): number;
        addNameAndTypeInfo(arg0: number, arg1: number): number;
        addFieldrefInfo(arg0: number, arg1: string, arg2: string): number;
        addFieldrefInfo(arg0: number, arg1: number): number;
        addMethodrefInfo(arg0: number, arg1: string, arg2: string): number;
        addMethodrefInfo(arg0: number, arg1: number): number;
        addInterfaceMethodrefInfo(
          arg0: number,
          arg1: string,
          arg2: string
        ): number;
        addInterfaceMethodrefInfo(arg0: number, arg1: number): number;
        addStringInfo(arg0: string): number;
        addIntegerInfo(arg0: number): number;
        addFloatInfo(arg0: number): number;
        addLongInfo(arg0: number): number;
        addDoubleInfo(arg0: number): number;
        addUtf8Info(arg0: string): number;
        addMethodHandleInfo(arg0: number, arg1: number): number;
        addMethodTypeInfo(arg0: number): number;
        addInvokeDynamicInfo(arg0: number, arg1: number): number;
        addDynamicInfo(arg0: number, arg1: number): number;
        addModuleInfo(arg0: number): number;
        addPackageInfo(arg0: number): number;
        getClassNames(): JavaSet<string>;
        renameClass(arg0: string, arg1: string): void;
        renameClass(arg0: JavaMap<string, string>): void;
        write(arg0: java.io.DataOutputStream): void;
        print(): void;
        print(arg0: java.io.PrintWriter): void;
      }

      const AttributeInfo: JavaClassStatics<
        [AttributeInfo],
        [arg0: ConstPool, arg1: string, arg2: number[]]
      >;
      interface AttributeInfo extends JavaObject {
        getName(): string;
        getConstPool(): ConstPool;
        length(): number;
        get(): number[];
        set(arg0: number[]): void;
        copy(arg0: ConstPool, arg1: JavaMap<string, string>): AttributeInfo;
      }

      const CodeAttribute: JavaClassStatics<
        [CodeAttribute],
        [
          arg0: ConstPool,
          arg1: number,
          arg2: number,
          arg3: number[],
          arg4: ExceptionTable
        ]
      > & {
        readonly tag: string;
      };
      interface CodeAttribute extends AttributeInfo, Opcode {
        copy(arg0: ConstPool, arg1: JavaMap<string, string>): AttributeInfo;
        length(): number;
        get(): number[];
        set(arg0: number[]): void;
        getDeclaringClass(): string;
        getMaxStack(): number;
        setMaxStack(arg0: number): void;
        computeMaxStack(): number;
        getMaxLocals(): number;
        setMaxLocals(arg0: number): void;
        getCodeLength(): number;
        getCode(): number[];
        iterator(): CodeIterator;
        getExceptionTable(): ExceptionTable;
        getAttributes(): JavaList<AttributeInfo>;
        getAttribute(arg0: string): AttributeInfo;
        setAttribute(arg0: StackMapTable): void;
        setAttribute(arg0: StackMap): void;
        insertLocalVar(arg0: number, arg1: number): void;
      }

      const ExceptionsAttribute: JavaClassStatics<
        [ExceptionsAttribute],
        [arg0: ConstPool]
      > & {
        readonly tag: string;
      };
      interface ExceptionsAttribute extends AttributeInfo {
        copy(arg0: ConstPool, arg1: JavaMap<string, string>): AttributeInfo;
        getExceptionIndexes(): number[];
        getExceptions(): string[];
        setExceptionIndexes(arg0: number[]): void;
        setExceptions(arg0: string[]): void;
        tableLength(): number;
        getException(arg0: number): number;
      }

      const StackMap: JavaClassStatics<false> & {
        readonly tag: string;
        readonly TOP: number;
        readonly INTEGER: number;
        readonly FLOAT: number;
        readonly DOUBLE: number;
        readonly LONG: number;
        readonly NULL: number;
        readonly THIS: number;
        readonly OBJECT: number;
        readonly UNINIT: number;
      };
      interface StackMap extends AttributeInfo {
        numOfEntries(): number;
        copy(arg0: ConstPool, arg1: JavaMap<string, string>): AttributeInfo;
        insertLocal(arg0: number, arg1: number, arg2: number): void;
        removeNew(arg0: number): void;
        print(arg0: java.io.PrintWriter): void;
      }

      const ExceptionTable: JavaClassStatics<
        [ExceptionTable],
        [arg0: ConstPool]
      >;
      interface ExceptionTable extends java.lang.Cloneable {
        clone(): any;
        size(): number;
        startPc(arg0: number): number;
        setStartPc(arg0: number, arg1: number): void;
        endPc(arg0: number): number;
        setEndPc(arg0: number, arg1: number): void;
        handlerPc(arg0: number): number;
        setHandlerPc(arg0: number, arg1: number): void;
        catchType(arg0: number): number;
        setCatchType(arg0: number, arg1: number): void;
        add(arg0: number, arg1: ExceptionTable, arg2: number): void;
        add(
          arg0: number,
          arg1: number,
          arg2: number,
          arg3: number,
          arg4: number
        ): void;
        add(arg0: number, arg1: number, arg2: number, arg3: number): void;
        remove(arg0: number): void;
        copy(arg0: ConstPool, arg1: JavaMap<string, string>): ExceptionTable;
      }

      const CodeIterator: JavaClassStatics<false>;
      interface CodeIterator extends Opcode {
        begin(): void;
        move(arg0: number): void;
        setMark(arg0: number): void;
        setMark2(arg0: number): void;
        getMark(): number;
        getMark2(): number;
        get(): CodeAttribute;
        getCodeLength(): number;
        byteAt(arg0: number): number;
        signedByteAt(arg0: number): number;
        writeByte(arg0: number, arg1: number): void;
        u16bitAt(arg0: number): number;
        s16bitAt(arg0: number): number;
        write16bit(arg0: number, arg1: number): void;
        s32bitAt(arg0: number): number;
        write32bit(arg0: number, arg1: number): void;
        write(arg0: number[], arg1: number): void;
        hasNext(): boolean;
        next(): number;
        lookAhead(): number;
        skipConstructor(): number;
        skipSuperConstructor(): number;
        skipThisConstructor(): number;
        insert(arg0: number[]): number;
        insert(arg0: number, arg1: number[]): void;
        insertAt(arg0: number, arg1: number[]): number;
        insertEx(arg0: number[]): number;
        insertEx(arg0: number, arg1: number[]): void;
        insertExAt(arg0: number, arg1: number[]): number;
        insertGap(arg0: number): number;
        insertGap(arg0: number, arg1: number): number;
        insertExGap(arg0: number): number;
        insertExGap(arg0: number, arg1: number): number;
        insertGapAt(
          arg0: number,
          arg1: number,
          arg2: boolean
        ): CodeIterator$Gap;
        insert(arg0: ExceptionTable, arg1: number): void;
        append(arg0: number[]): number;
        appendGap(arg0: number): void;
        append(arg0: ExceptionTable, arg1: number): void;
      }

      const StackMapTable: JavaClassStatics<false> & {
        readonly tag: string;
        readonly TOP: number;
        readonly INTEGER: number;
        readonly FLOAT: number;
        readonly DOUBLE: number;
        readonly LONG: number;
        readonly NULL: number;
        readonly THIS: number;
        readonly OBJECT: number;
        readonly UNINIT: number;

        typeTagOf(arg0: number): number;
      };
      interface StackMapTable extends AttributeInfo {
        copy(arg0: ConstPool, arg1: JavaMap<string, string>): AttributeInfo;
        insertLocal(arg0: number, arg1: number, arg2: number): void;
        println(arg0: java.io.PrintWriter): void;
        println(arg0: java.io.PrintStream): void;
        removeNew(arg0: number): void;
      }

      const CodeIterator$Gap: JavaClassStatics<[CodeIterator$Gap]>;
      interface CodeIterator$Gap extends JavaObject {
        position: number;
        length: number;
      }

      export {
        Opcode,
        ClassFile,
        FieldInfo,
        MethodInfo,
        ConstPool,
        AttributeInfo,
        CodeAttribute,
        ExceptionsAttribute,
        StackMap,
        ExceptionTable,
        CodeIterator,
        StackMapTable,
        CodeIterator$Gap,
      };
    }

    namespace compiler {
      const AccessorMaker: JavaClassStatics<
        [AccessorMaker],
        [arg0: javassist.CtClass]
      >;
      interface AccessorMaker extends JavaObject {
        getConstructor(
          arg0: javassist.CtClass,
          arg1: string,
          arg2: javassist.bytecode.MethodInfo
        ): string;
        getMethodAccessor(
          arg0: string,
          arg1: string,
          arg2: string,
          arg3: javassist.bytecode.MethodInfo
        ): string;
        getFieldGetter(
          arg0: javassist.bytecode.FieldInfo,
          arg1: boolean
        ): javassist.bytecode.MethodInfo;
        getFieldSetter(
          arg0: javassist.bytecode.FieldInfo,
          arg1: boolean
        ): javassist.bytecode.MethodInfo;
      }

      export { AccessorMaker };
    }

    namespace expr {
      const ExprEditor: JavaClassStatics<[ExprEditor]>;
      interface ExprEditor extends JavaObject {
        doit(
          arg0: javassist.CtClass,
          arg1: javassist.bytecode.MethodInfo
        ): boolean;
        edit(arg0: NewExpr): void;
        edit(arg0: NewArray): void;
        edit(arg0: MethodCall): void;
        edit(arg0: ConstructorCall): void;
        edit(arg0: FieldAccess): void;
        edit(arg0: Instanceof): void;
        edit(arg0: Cast): void;
        edit(arg0: Handler): void;
      }

      const FieldAccess: JavaClassStatics<false>;
      interface FieldAccess extends Expr {
        where(): javassist.CtBehavior;
        getLineNumber(): number;
        getFileName(): string;
        isStatic(): boolean;
        isReader(): boolean;
        isWriter(): boolean;
        getClassName(): string;
        getFieldName(): string;
        getField(): javassist.CtField;
        mayThrow(): javassist.CtClass[];
        getSignature(): string;
        replace(arg0: string): void;
      }

      const Instanceof: JavaClassStatics<false>;
      interface Instanceof extends Expr {
        where(): javassist.CtBehavior;
        getLineNumber(): number;
        getFileName(): string;
        getType(): javassist.CtClass;
        mayThrow(): javassist.CtClass[];
        replace(arg0: string): void;
      }

      const Handler: JavaClassStatics<false>;
      interface Handler extends Expr {
        where(): javassist.CtBehavior;
        getLineNumber(): number;
        getFileName(): string;
        mayThrow(): javassist.CtClass[];
        getType(): javassist.CtClass;
        isFinally(): boolean;
        replace(arg0: string): void;
        replace(arg0: string, arg1: ExprEditor): void;
        insertBefore(arg0: string): void;
      }

      const NewExpr: JavaClassStatics<false>;
      interface NewExpr extends Expr {
        where(): javassist.CtBehavior;
        getLineNumber(): number;
        getFileName(): string;
        getClassName(): string;
        getSignature(): string;
        getConstructor(): javassist.CtConstructor;
        mayThrow(): javassist.CtClass[];
        replace(arg0: string): void;
      }

      const MethodCall: JavaClassStatics<false>;
      interface MethodCall extends Expr {
        where(): javassist.CtBehavior;
        getLineNumber(): number;
        getFileName(): string;
        getClassName(): string;
        getMethodName(): string;
        getMethod(): javassist.CtMethod;
        getSignature(): string;
        mayThrow(): javassist.CtClass[];
        isSuper(): boolean;
        replace(arg0: string): void;
      }

      const ConstructorCall: JavaClassStatics<false>;
      interface ConstructorCall extends MethodCall {
        getMethodName(): string;
        getMethod(): javassist.CtMethod;
        getConstructor(): javassist.CtConstructor;
        isSuper(): boolean;
      }

      const NewArray: JavaClassStatics<false>;
      interface NewArray extends Expr {
        where(): javassist.CtBehavior;
        getLineNumber(): number;
        getFileName(): string;
        mayThrow(): javassist.CtClass[];
        getComponentType(): javassist.CtClass;
        getDimension(): number;
        getCreatedDimensions(): number;
        replace(arg0: string): void;
      }

      const Cast: JavaClassStatics<false>;
      interface Cast extends Expr {
        where(): javassist.CtBehavior;
        getLineNumber(): number;
        getFileName(): string;
        getType(): javassist.CtClass;
        mayThrow(): javassist.CtClass[];
        replace(arg0: string): void;
      }

      const Expr: JavaClassStatics<false>;
      interface Expr extends javassist.bytecode.Opcode {
        getEnclosingClass(): javassist.CtClass;
        where(): javassist.CtBehavior;
        mayThrow(): javassist.CtClass[];
        indexOfBytecode(): number;
        getLineNumber(): number;
        getFileName(): string;
        replace(arg0: string): void;
        replace(arg0: string, arg1: ExprEditor): void;
      }

      export {
        ExprEditor,
        FieldAccess,
        Instanceof,
        Handler,
        NewExpr,
        MethodCall,
        ConstructorCall,
        NewArray,
        Cast,
        Expr,
      };
    }

    export {
      CtClass,
      CtField$Initializer,
      CtBehavior,
      ClassMap,
      CtMember,
      ClassPool,
      CtConstructor,
      CtMethod,
      CtField,
      CodeConverter,
      CodeConverter$ArrayAccessReplacementMethodNames,
      ClassPath,
      CtMethod$ConstParameter,
      util,
      bytecode,
      compiler,
      expr,
    };
  }
}

type AbstractRenderCodeCompiler =
  Packages.xyz.wagyourtail.jsmacros.client.gui.editor.highlighting.AbstractRenderCodeCompiler;
type AutoCompleteSuggestion =
  Packages.xyz.wagyourtail.jsmacros.client.gui.editor.highlighting.AutoCompleteSuggestion;
type BaseEvent = Events.BaseEvent;
type BaseEventRegistry =
  Packages.xyz.wagyourtail.jsmacros.core.event.BaseEventRegistry;
type BaseHelper<T = any> =
  Packages.xyz.wagyourtail.jsmacros.core.helpers.BaseHelper<T>;
type BaseLanguage<
  U = any,
  T extends BaseScriptContext<U> = any
> = Packages.xyz.wagyourtail.jsmacros.core.language.BaseLanguage<U, T>;
type BaseLibrary = Packages.xyz.wagyourtail.jsmacros.core.library.BaseLibrary;
type BaseProfile = Packages.xyz.wagyourtail.jsmacros.core.config.BaseProfile;
type BaseScreen = Packages.xyz.wagyourtail.wagyourgui.BaseScreen;
type BaseScriptContext$SleepRunnable =
  Packages.xyz.wagyourtail.jsmacros.core.language.BaseScriptContext$SleepRunnable;
type BaseScriptContext<T = any> =
  Packages.xyz.wagyourtail.jsmacros.core.language.BaseScriptContext<T>;
type BaseWrappedException$SourceLocation =
  Packages.xyz.wagyourtail.jsmacros.core.language.BaseWrappedException$SourceLocation;
type BaseWrappedException<T = any> =
  Packages.xyz.wagyourtail.jsmacros.core.language.BaseWrappedException<T>;
type BlockDataHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.BlockDataHelper;
type BlockHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.BlockHelper;
type BlockPosHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.BlockPosHelper;
type BlockStateHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.BlockStateHelper;
type BossBarHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.BossBarHelper;
type ButtonWidgetHelper<T = /* minecraft class */ any> =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.ButtonWidgetHelper<T>;
type ChatHistoryManager =
  Packages.xyz.wagyourtail.jsmacros.client.api.classes.ChatHistoryManager;
type ChatHudLineHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.ChatHudLineHelper;
type ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U = any> =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.ClassBuilder$AnnotationBuilder$AnnotationArrayBuilder<U>;
type ClassBuilder$AnnotationBuilder<T = any> =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.ClassBuilder$AnnotationBuilder<T>;
type ClassBuilder$BodyBuilder =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.ClassBuilder$BodyBuilder;
type ClassBuilder$ConstructorBuilder =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.ClassBuilder$ConstructorBuilder;
type ClassBuilder$FieldBuilder =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.ClassBuilder$FieldBuilder;
type ClassBuilder$FieldBuilder$FieldInitializerBuilder =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.ClassBuilder$FieldBuilder$FieldInitializerBuilder;
type ClassBuilder$MethodBuilder =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.ClassBuilder$MethodBuilder;
type ClassBuilder<T = any> =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.ClassBuilder<T>;
type ClientPlayerEntityHelper<T = /* minecraft class */ any> =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.ClientPlayerEntityHelper<T>;
type CommandBuilder =
  Packages.xyz.wagyourtail.jsmacros.client.api.classes.CommandBuilder;
type CommandContextHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.CommandContextHelper;
type CommandManager =
  Packages.xyz.wagyourtail.jsmacros.client.api.classes.CommandManager;
type CommandNodeHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.CommandNodeHelper;
type ConfigManager =
  Packages.xyz.wagyourtail.jsmacros.core.config.ConfigManager;
type Core<
  T extends BaseProfile = any,
  U extends BaseEventRegistry = any
> = Packages.xyz.wagyourtail.jsmacros.core.Core<T, U>;
type Draw2D = Packages.xyz.wagyourtail.jsmacros.client.api.classes.Draw2D;
type Draw3D = Packages.xyz.wagyourtail.jsmacros.client.api.classes.Draw3D;
type Draw3D$Box =
  Packages.xyz.wagyourtail.jsmacros.client.api.classes.Draw3D$Box;
type Draw3D$Line =
  Packages.xyz.wagyourtail.jsmacros.client.api.classes.Draw3D$Line;
type Draw3D$Surface =
  Packages.xyz.wagyourtail.jsmacros.client.api.classes.Draw3D$Surface;
type EditorScreen =
  Packages.xyz.wagyourtail.jsmacros.client.gui.screens.EditorScreen;
type EntityHelper<T = /* minecraft class */ any> =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.EntityHelper<T>;
type EventContainer<T extends BaseScriptContext<any> = any> =
  Packages.xyz.wagyourtail.jsmacros.core.language.EventContainer<T>;
type EventCustom =
  Packages.xyz.wagyourtail.jsmacros.core.event.impl.EventCustom;
type EventService = Packages.xyz.wagyourtail.jsmacros.core.service.EventService;
type Extension = Packages.xyz.wagyourtail.jsmacros.core.extensions.Extension;
type Extension$ExtMatch =
  Packages.xyz.wagyourtail.jsmacros.core.extensions.Extension$ExtMatch;
type ExtensionLoader =
  Packages.xyz.wagyourtail.jsmacros.core.extensions.ExtensionLoader;
type FJsMacros$EventAndContext<E extends keyof Events = "BaseEvent"> =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.FJsMacros$EventAndContext & {
    readonly event: Events<E>;
  };
type FileHandler =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.FileHandler;
type HTTPRequest =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.HTTPRequest;
type HTTPRequest$Response =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.HTTPRequest$Response;
type History = Packages.xyz.wagyourtail.jsmacros.client.gui.editor.History;
type IContainerParent =
  Packages.xyz.wagyourtail.wagyourgui.containers.IContainerParent;
type IDraw2D<T = any> =
  Packages.xyz.wagyourtail.jsmacros.client.api.sharedinterfaces.IDraw2D<T>;
type IEventListener =
  Packages.xyz.wagyourtail.jsmacros.core.event.IEventListener;
type IOverlayParent =
  Packages.xyz.wagyourtail.wagyourgui.overlays.IOverlayParent;
type IScreen =
  Packages.xyz.wagyourtail.jsmacros.client.api.sharedinterfaces.IScreen;
type Inventory<T = /* minecraft class */ any> =
  Packages.xyz.wagyourtail.jsmacros.client.api.classes.Inventory<T>;
type ItemEntityHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.ItemEntityHelper;
type ItemStackHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper;
type Library = Packages.xyz.wagyourtail.jsmacros.core.library.Library;
type LibraryBuilder =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.LibraryBuilder;
type LibraryRegistry =
  Packages.xyz.wagyourtail.jsmacros.core.library.LibraryRegistry;
type LivingEntityHelper<T = /* minecraft class */ any> =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.LivingEntityHelper<T>;
type Mappings = Packages.xyz.wagyourtail.jsmacros.core.classes.Mappings;
type Mappings$ClassData =
  Packages.xyz.wagyourtail.jsmacros.core.classes.Mappings$ClassData;
type Mappings$MappedClass<T = any> =
  Packages.xyz.wagyourtail.jsmacros.core.classes.Mappings$MappedClass<T>;
type Mappings$MethodData =
  Packages.xyz.wagyourtail.jsmacros.core.classes.Mappings$MethodData;
type MerchantEntityHelper<T = /* minecraft class */ any> =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.MerchantEntityHelper<T>;
type MethodWrapper<
  T = any,
  U = any,
  R = any,
  C extends BaseScriptContext<any> = any
> = Packages.xyz.wagyourtail.jsmacros.core.MethodWrapper<T, U, R, C>;
type MultiElementContainer<T extends IContainerParent = any> =
  Packages.xyz.wagyourtail.wagyourgui.containers.MultiElementContainer<T>;
type NBTElementHelper$NBTCompoundHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.NBTElementHelper$NBTCompoundHelper;
type NBTElementHelper$NBTListHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.NBTElementHelper$NBTListHelper;
type NBTElementHelper$NBTNumberHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.NBTElementHelper$NBTNumberHelper;
type NBTElementHelper<T = /* minecraft class */ any> =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.NBTElementHelper<T>;
type OptionsHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.OptionsHelper;
type OverlayContainer =
  Packages.xyz.wagyourtail.wagyourgui.overlays.OverlayContainer;
type PerLanguageLibrary =
  Packages.xyz.wagyourtail.jsmacros.core.library.PerLanguageLibrary;
type PlayerAbilitiesHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.PlayerAbilitiesHelper;
type PlayerEntityHelper<T = /* minecraft class */ any> =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.PlayerEntityHelper<T>;
type PlayerInput =
  Packages.xyz.wagyourtail.jsmacros.client.api.classes.PlayerInput;
type PlayerListEntryHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.PlayerListEntryHelper;
type PositionCommon$Pos2D =
  Packages.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos2D;
type PositionCommon$Pos3D =
  Packages.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D;
type PositionCommon$Vec2D =
  Packages.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Vec2D;
type PositionCommon$Vec3D =
  Packages.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Vec3D;
type ProxyBuilder$MethodSigParts =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.ProxyBuilder$MethodSigParts;
type ProxyBuilder$ProxyReference<T = any> =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.ProxyBuilder$ProxyReference<T>;
type ProxyBuilder<T = any> =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.ProxyBuilder<T>;
type RecipeHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.RecipeHelper;
type RenderCommon$Image =
  Packages.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Image;
type RenderCommon$Item =
  Packages.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
type RenderCommon$Rect =
  Packages.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Rect;
type RenderCommon$RenderElement =
  Packages.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$RenderElement;
type RenderCommon$Text =
  Packages.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Text;
type ScoreboardObjectiveHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.ScoreboardObjectiveHelper;
type ScoreboardsHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.ScoreboardsHelper;
type ScriptScreen =
  Packages.xyz.wagyourtail.jsmacros.client.api.classes.ScriptScreen;
type ScriptTrigger =
  Packages.xyz.wagyourtail.jsmacros.core.config.ScriptTrigger;
type ScriptTrigger$TriggerType =
  Packages.xyz.wagyourtail.jsmacros.core.config.ScriptTrigger$TriggerType;
type Scrollbar = Packages.xyz.wagyourtail.wagyourgui.elements.Scrollbar;
type SelectCursor =
  Packages.xyz.wagyourtail.jsmacros.client.gui.editor.SelectCursor;
type ServerInfoHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.ServerInfoHelper;
type ServiceManager =
  Packages.xyz.wagyourtail.jsmacros.core.service.ServiceManager;
type ServiceManager$ServiceStatus =
  Packages.xyz.wagyourtail.jsmacros.core.service.ServiceManager$ServiceStatus;
type ServiceTrigger =
  Packages.xyz.wagyourtail.jsmacros.core.service.ServiceTrigger;
type StatsHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.StatsHelper;
type StatusEffectHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.StatusEffectHelper;
type StringHashTrie = Packages.xyz.wagyourtail.StringHashTrie;
type StyleHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.StyleHelper;
type SuggestionsBuilderHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.SuggestionsBuilderHelper;
type TeamHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.TeamHelper;
type TextBuilder =
  Packages.xyz.wagyourtail.jsmacros.client.api.classes.TextBuilder;
type TextFieldWidgetHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.TextFieldWidgetHelper;
type TextHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.TextHelper;
type TradeOfferHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.TradeOfferHelper;
type VillagerEntityHelper =
  Packages.xyz.wagyourtail.jsmacros.client.api.helpers.VillagerEntityHelper;
type VillagerInventory =
  Packages.xyz.wagyourtail.jsmacros.client.api.classes.VillagerInventory;
type Websocket =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.Websocket;
type Websocket$Disconnected =
  Packages.xyz.wagyourtail.jsmacros.core.library.impl.classes.Websocket$Disconnected;
type WorldScanner =
  Packages.xyz.wagyourtail.jsmacros.client.api.classes.worldscanner.WorldScanner;
type WorldScannerBuilder =
  Packages.xyz.wagyourtail.jsmacros.client.api.classes.worldscanner.WorldScannerBuilder;
type WrappedClassInstance<T = any> =
  Packages.xyz.wagyourtail.jsmacros.core.classes.WrappedClassInstance<T>;

type Pos2D = PositionCommon$Pos2D;
type Pos3D = PositionCommon$Pos3D;
type Vec2D = PositionCommon$Vec2D;
type Vec3D = PositionCommon$Vec3D;
