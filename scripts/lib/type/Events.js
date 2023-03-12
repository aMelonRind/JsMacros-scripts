
// use .ts will cause issues, idk why

/**
 * @typedef {{ [none: symbol]: undefined }} _ to trick vscode to rename types
 * 
 * @typedef {_&_javatypes.com.mojang.brigadier.context.StringRange} StringRange
 * @typedef {_&_javatypes.io.noties.prism4j.Prism4j$Node} PrismNode
 * @typedef {_&_javatypes.xyz.wagyourtail.StringHashTrie} StringHashTrie
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.gui.editor.SelectCursor} SelectCursor
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.gui.editor.highlighting.AutoCompleteSuggestion} AutoCompleteSuggestion
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.gui.screens.EditorScreen} EditorScreen
 * 
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.TextHelper} TextHelper
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.BossBarHelper} BossBarHelper
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper} ItemStackHelper
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.BlockDataHelper} BlockDataHelper
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.EntityHelper<any>} EntityHelper
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.CommandContextHelper} CommandContextHelper
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.PlayerListEntryHelper} PlayerListEntryHelper
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.ClientPlayerEntityHelper<any>} ClientPlayerEntityHelper
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.api.classes.TextBuilder} TextBuilder
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.api.classes.Inventory<any>} Inventory
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedinterfaces.IScreen} IScreen
 * @typedef {_&_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D} Pos3D
 * 
 * @type {{
 *  CodeRender: {
 *     readonly cursor: SelectCursor,
 *     readonly code: string,
 *     readonly language: string,
 *     readonly screen: EditorScreen,
 *     readonly textLines: _javatypes.java.util.List<TextHelper>,
 *     readonly autoCompleteSuggestions: _javatypes.java.util.List<AutoCompleteSuggestion>,
 *     rightClickActions: _javatypes.xyz.wagyourtail.jsmacros.core.MethodWrapper<number, any, _javatypes.java.util.Map<string, _javatypes.xyz.wagyourtail.jsmacros.core.MethodWrapper<any, any, any, any>>, any>,
 *     genPrismNodes(): _javatypes.java.util.List<PrismNode>,
 *     createMap(): _javatypes.java.util.Map<any, any>,
 *     createTextBuilder(): TextBuilder,
 *     createSuggestion(startIndex: number, suggestion: string): AutoCompleteSuggestion,
 *     createSuggestion(startIndex: number, suggestion: string, displayText: TextHelper): AutoCompleteSuggestion,
 *     createPrefixTree(): StringHashTrie,
 *     getThemeData(): _javatypes.java.util.Map<string, number[]>,
 *   },
 *   DimensionChange: {
 *     readonly dimension: string,
 *     toString(): string,
 *   },
 *   ItemDamage: {
 *     readonly item: ItemStackHelper,
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
 *     readonly item: ItemStackHelper,
 *     readonly oldItem: ItemStackHelper,
 *     toString(): string,
 *   },
 *   InteractEntity: {
 *     readonly offhand: boolean,
 *     readonly result: string,
 *     readonly entity: EntityHelper,
 *     toString(): string,
 *   },
 *   Heal: {
 *     readonly source: string,
 *     readonly health: number,
 *     readonly change: number,
 *     toString(): string,
 *   },
 *   OpenScreen: {
 *     readonly screen: IScreen,
 *     readonly screenName: string,
 *     toString(): string,
 *   },
 *   Disconnect: {
 *     readonly message: TextHelper,
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
 *     message: TextHelper,
 *     toString(): string,
 *   },
 *   OpenContainer: {
 *     readonly inventory: Inventory,
 *     readonly screen: IScreen,
 *     cancelled: boolean,
 *   },
 *   Damage: {
 *     readonly attacker: EntityHelper,
 *     readonly source: string,
 *     readonly health: number,
 *     readonly change: number,
 *     toString(): string,
 *   },
 *   Sound: {
 *     readonly sound: string,
 *     readonly volume: number,
 *     readonly pitch: number,
 *     readonly position: Pos3D,
 *     toString(): string,
 *   },
 *   JoinServer: {
 *     readonly player: ClientPlayerEntityHelper,
 *     readonly address: string,
 *     toString(): string,
 *   },
 *   DropSlot: {
 *     readonly slot: number,
 *     readonly all: boolean,
 *     cancel: boolean,
 *     getInventory(): Inventory,
 *     toString(): string,
 *   },
 *   AttackBlock: {
 *     readonly block: BlockDataHelper,
 *     readonly side: number,
 *   },
 *   EntityDamaged: {
 *     readonly entity: EntityHelper,
 *     readonly health: number,
 *     readonly damage: number,
 *     toString(): string,
 *   },
 *   BlockUpdate: {
 *     readonly block: BlockDataHelper,
 *     readonly updateType: string,
 *     toString(): string,
 *   },
 *   EntityUnload: {
 *     readonly entity: EntityHelper,
 *     readonly reason: string,
 *     toString(): string,
 *   },
 *   EntityHealed: {
 *     readonly entity: EntityHelper,
 *     readonly health: number,
 *     readonly damage: number,
 *     toString(): string,
 *   },
 *   Riding: {
 *     readonly state: boolean,
 *     readonly entity: EntityHelper,
 *     toString(): string,
 *   },
 *   RecvMessage: {
 *     text: TextHelper,
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
 *     readonly player: PlayerListEntryHelper,
 *     toString(): string,
 *   },
 *   ItemPickup: {
 *     readonly item: ItemStackHelper,
 *     toString(): string,
 *   },
 *   SignEdit: {
 *     readonly pos: Pos3D,
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
 *     readonly entity: EntityHelper,
 *   },
 *   Bossbar: {
 *     readonly bossBar: BossBarHelper,
 *     readonly uuid: string,
 *     readonly type: string,
 *     toString(): string,
 *   },
 *   HungerChange: {
 *     readonly foodLevel: number,
 *     toString(): string,
 *   },
 *   EntityLoad: {
 *     readonly entity: EntityHelper,
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
 *     readonly player: PlayerListEntryHelper,
 *     toString(): string,
 *   },
 *   InteractBlock: {
 *     readonly offhand: boolean,
 *     readonly result: string,
 *     readonly block: BlockDataHelper,
 *     readonly side: number,
 *     toString(): string,
 *   },
 *   ClickSlot: {
 *     readonly mode: number,
 *     readonly button: number,
 *     readonly slot: number,
 *     cancel: boolean,
 *     getInventory(): Inventory,
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
 *     readonly item: ItemStackHelper,
 *     readonly oldItem: ItemStackHelper,
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
 *     getChild(): CommandContextHelper,
 *     getRange(): StringRange,
 *     getInput(): string,
 *   },
 *   ProfileLoad: {
 *     readonly profileName: string,
 *     toString(): string,
 *   }
 * }}
 */
module.exports = null
