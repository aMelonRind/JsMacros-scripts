
// use .ts will cause issues
/**
 * @type {{
 *  CodeRender: {
 *     readonly cursor: _javatypes.xyz.wagyourtail.jsmacros.client.gui.editor.SelectCursor,
 *     readonly code: string,
 *     readonly language: string,
 *     readonly screen: _javatypes.xyz.wagyourtail.jsmacros.client.gui.screens.EditorScreen,
 *     readonly textLines: _javatypes.java.util.List<_javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.TextHelper>,
 *     readonly autoCompleteSuggestions: _javatypes.java.util.List<_javatypes.xyz.wagyourtail.jsmacros.client.gui.editor.highlighting.AutoCompleteSuggestion>,
 *     rightClickActions: _javatypes.xyz.wagyourtail.jsmacros.core.MethodWrapper<number, any, _javatypes.java.util.Map<string, _javatypes.xyz.wagyourtail.jsmacros.core.MethodWrapper<any, any, any, any>>, any>,
 *     genPrismNodes(): _javatypes.java.util.List<_javatypes.io.noties.prism4j.Prism4j$Node>,
 *     createMap(): _javatypes.java.util.Map<any, any>,
 *     createTextBuilder(): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.TextBuilder,
 *     createSuggestion(startIndex: number, suggestion: string): _javatypes.xyz.wagyourtail.jsmacros.client.gui.editor.highlighting.AutoCompleteSuggestion,
 *     createSuggestion(startIndex: number, suggestion: string, displayText: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.TextHelper): _javatypes.xyz.wagyourtail.jsmacros.client.gui.editor.highlighting.AutoCompleteSuggestion,
 *     createPrefixTree(): _javatypes.xyz.wagyourtail.StringHashTrie,
 *     getThemeData(): _javatypes.java.util.Map<string, number[]>,
 *   },
 *   DimensionChange: {
 *     readonly dimension: string,
 *     toString(): string,
 *   },
 *   ItemDamage: {
 *     readonly item: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper,
 *     readonly damage: number,
 *     toString(): string,
 *   },
 *   FallFlying: {
 *     readonly state: boolean,
 *     toString(): string,
 *   },
 *   JoinedTick: {
 *     toString(): string,
 *   },
 *   ArmorChange: {
 *     readonly slot: string,
 *     readonly item: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper,
 *     readonly oldItem: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper,
 *     toString(): string,
 *   },
 *   InteractEntity: {
 *     readonly offhand: boolean,
 *     readonly result: string,
 *     readonly entity: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.EntityHelper<any>,
 *     toString(): string,
 *   },
 *   Heal: {
 *     readonly source: string,
 *     readonly health: number,
 *     readonly change: number,
 *     toString(): string,
 *   },
 *   OpenScreen: {
 *     readonly screen: _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedinterfaces.IScreen,
 *     readonly screenName: string,
 *     toString(): string,
 *   },
 *   Disconnect: {
 *     readonly message: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.TextHelper,
 *     toString(): string,
 *   },
 *   SendMessage: {
 *     message: string,
 *     toString(): string,
 *   },
 *   AirChange: {
 *     readonly air: number,
 *     toString(): string,
 *   },
 *   Title: {
 *     readonly type: string,
 *     message: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.TextHelper,
 *     toString(): string,
 *   },
 *   OpenContainer: {
 *     readonly inventory: _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.Inventory<any>,
 *     readonly screen: _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedinterfaces.IScreen,
 *     cancelled: boolean,
 *   },
 *   Damage: {
 *     readonly attacker: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.EntityHelper<any>,
 *     readonly source: string,
 *     readonly health: number,
 *     readonly change: number,
 *     toString(): string,
 *   },
 *   Sound: {
 *     readonly sound: string,
 *     readonly volume: number,
 *     readonly pitch: number,
 *     readonly position: _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D,
 *     toString(): string,
 *   },
 *   JoinServer: {
 *     readonly player: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.ClientPlayerEntityHelper<any>,
 *     readonly address: string,
 *     toString(): string,
 *   },
 *   DropSlot: {
 *     readonly slot: number,
 *     readonly all: boolean,
 *     cancel: boolean,
 *     getInventory(): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.Inventory<any>,
 *     toString(): string,
 *   },
 *   AttackBlock: {
 *     readonly block: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.BlockDataHelper,
 *     readonly side: number,
 *   },
 *   EntityDamaged: {
 *     readonly entity: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.EntityHelper<any>,
 *     readonly health: number,
 *     readonly damage: number,
 *     toString(): string,
 *   },
 *   BlockUpdate: {
 *     readonly block: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.BlockDataHelper,
 *     readonly updateType: string,
 *     toString(): string,
 *   },
 *   EntityUnload: {
 *     readonly entity: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.EntityHelper<any>,
 *     readonly reason: string,
 *     toString(): string,
 *   },
 *   EntityHealed: {
 *     readonly entity: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.EntityHelper<any>,
 *     readonly health: number,
 *     readonly damage: number,
 *     toString(): string,
 *   },
 *   Riding: {
 *     readonly state: boolean,
 *     readonly entity: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.EntityHelper<any>,
 *     toString(): string,
 *   },
 *   RecvMessage: {
 *     text: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.TextHelper,
 *     signature: number[],
 *     messageType: string,
 *     toString(): string,
 *   },
 *   ChunkUnload: {
 *     readonly x: number,
 *     readonly z: number,
 *     toString(): string,
 *   },
 *   ChunkLoad: {
 *     readonly x: number,
 *     readonly z: number,
 *     readonly isFull: boolean,
 *     toString(): string,
 *   },
 *   PlayerLeave: {
 *     readonly UUID: string,
 *     readonly player: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.PlayerListEntryHelper,
 *     toString(): string,
 *   },
 *   ItemPickup: {
 *     readonly item: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper,
 *     toString(): string,
 *   },
 *   SignEdit: {
 *     readonly pos: _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D,
 *     closeScreen: boolean,
 *     signText: _javatypes.java.util.List<string>,
 *     toString(): string,
 *   },
 *   Tick: {
 *     toString(): string,
 *   },
 *   Death: {
 *     toString(): string,
 *   },
 *   AttackEntity: {
 *     readonly entity: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.EntityHelper<any>,
 *   },
 *   Bossbar: {
 *     readonly bossBar: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.BossBarHelper,
 *     readonly uuid: string,
 *     readonly type: string,
 *     toString(): string,
 *   },
 *   HungerChange: {
 *     readonly foodLevel: number,
 *     toString(): string,
 *   },
 *   EntityLoad: {
 *     readonly entity: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.EntityHelper<any>,
 *     toString(): string,
 *   },
 *   Key: {
 *     readonly action: number,
 *     readonly key: string,
 *     readonly mods: string,
 *     toString(): string,
 *   },
 *   PlayerJoin: {
 *     readonly UUID: string,
 *     readonly player: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.PlayerListEntryHelper,
 *     toString(): string,
 *   },
 *   InteractBlock: {
 *     readonly offhand: boolean,
 *     readonly result: string,
 *     readonly block: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.BlockDataHelper,
 *     readonly side: number,
 *     toString(): string,
 *   },
 *   ClickSlot: {
 *     readonly mode: number,
 *     readonly button: number,
 *     readonly slot: number,
 *     cancel: boolean,
 *     getInventory(): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.Inventory<any>,
 *     toString(): string,
 *   },
 *   ResourcePackLoaded: {
 *     readonly isGameStart: boolean,
 *     readonly loadedPacks: _javatypes.java.util.List<string>,
 *     toString(): string,
 *   },
 *   JoinedKey: {
 *     cancel: boolean,
 *   },
 *   HeldItemChange: {
 *     readonly offHand: boolean,
 *     readonly item: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper,
 *     readonly oldItem: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper,
 *     toString(): string,
 *   },
 *   EXPChange: {
 *     readonly progress: number,
 *     readonly total: number,
 *     readonly level: number,
 *     readonly prevProgress: number,
 *     readonly prevTotal: number,
 *     readonly prevLevel: number,
 *     toString(): string,
 *   },
 *   CommandContext: {
 *     getArg(name: string): any,
 *     getChild(): _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.CommandContextHelper,
 *     getRange(): _javatypes.com.mojang.brigadier.context.StringRange,
 *     getInput(): string,
 *   },
 *   ProfileLoad: {
 *     readonly profileName: string,
 *     toString(): string,
 *   }
 * }}
 */
const Events = null
module.exports = Events