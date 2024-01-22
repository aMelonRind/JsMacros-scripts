// https://baritone.leijurv.com/
export interface BaritoneAPI {
  getProvider(): Provider
  getSettings(): Settings
}

interface Settings {
  /** A list of all settings */
  allSettings: JavaList<Setting<?>>
  /** A map of lowercase setting field names to their respective setting */
  byLowerName: JavaMap<string, Setting<?>>
  settingTypes: JavaMap<Setting<?>, Packages.java.lang.reflect.Type>
  getAllValuesByType<T>(cla$$: JavaClassArg<T>): JavaList<Setting<T>>

  /** Blocks that Baritone is allowed to place (as throwaway, for sneak bridging, pillaring, etc.) */
  acceptableThrowawayItems: Setting<JavaList<net.minecraft.item.Item>>
  /** Allow Baritone to break blocks */
  allowBreak: Setting<boolean>
  /** Blocks that baritone will be allowed to break even with allowBreak set to false */
  allowBreakAnyway: Setting<JavaList<net.minecraft.block.Block>>
  /** Allow diagonal ascending */
  allowDiagonalAscend: Setting<boolean>
  /** Allow descending diagonally */
  allowDiagonalDescend: Setting<boolean>
  /** Allow mining the block directly beneath its feet */
  allowDownward: Setting<boolean>
  /** Allow Baritone to move items in your inventory to your hotbar */
  allowInventory: Setting<boolean>
  /** If true, parkour is allowed to make jumps when standing on blocks at the maximum height, so player feet is y=256 */
  allowJumpAt256: Setting<boolean>
  /** This will only allow baritone to mine exposed ores, can be used to stop ore obfuscators on servers that use them. */
  allowOnlyExposedOres: Setting<boolean>
  /** When allowOnlyExposedOres is enabled this is the distance around to search. */
  allowOnlyExposedOresDistance: Setting<int>
  /** Is it okay to sprint through a descend followed by a diagonal? The player overshoots the landing, but not enough to fall off. */
  allowOvershootDiagonalDescend: Setting<boolean>
  /** You know what it is */
  allowParkour: Setting<boolean>
  /** This should be monetized it's so good */
  allowParkourAscend: Setting<boolean>
  /** Actually pretty reliable. */
  allowParkourPlace: Setting<boolean>
  /** Allow Baritone to place blocks */
  allowPlace: Setting<boolean>
  /** Allow Baritone to sprint */
  allowSprint: Setting<boolean>
  /** Enables some more advanced vine features. */
  allowVines: Setting<boolean>
  /** Slab behavior is complicated, disable this for higher path reliability. */
  allowWalkOnBottomSlab: Setting<boolean>
  /** Allow Baritone to fall arbitrary distances and place a water bucket beneath it. */
  allowWaterBucketFall: Setting<boolean>
  /** Will cause some minor behavioral differences to ensure that Baritone works on anticheats. */
  antiCheatCompatibility: Setting<boolean>
  /** Disable baritone's auto-tool at runtime, but still assume that another mod will provide auto tool functionality */
  assumeExternalAutoTool: Setting<boolean>
  /** Assume safe walk functionality; don't sneak on a backplace traverse. */
  assumeSafeWalk: Setting<boolean>
  /** Assume step functionality; don't jump on an Ascend. */
  assumeStep: Setting<boolean>
  /** If you have Fire Resistance and Jesus then I guess you could turn this on lol */
  assumeWalkOnLava: Setting<boolean>
  /** Allow Baritone to assume it can walk on still water just like any other block. */
  assumeWalkOnWater: Setting<boolean>
  /** Automatically select the best available tool */
  autoTool: Setting<boolean>
  /** Toggle the following 4 settings */
  avoidance: Setting<boolean>
  /** this multiplies the break speed, if set above 1 it's "encourage breaking" instead */
  avoidBreakingMultiplier: Setting<double>
  /** If this setting is true, Baritone will never break a block that is adjacent to an unsupported falling block. */
  avoidUpdatingFallingBlocks: Setting<boolean>
  /** The "axis" command (aka GoalAxis) will go to a axis, or diagonal axis, at this Y level. */
  axisHeight: Setting<int>
  /** Fill in blocks behind you */
  backfill: Setting<boolean>
  /** Set to 1.0 to effectively disable this feature */
  backtrackCostFavoringCoefficient: Setting<double>
  /** When GetToBlockProcess or MineProcess fails to calculate a path, instead of just giving up, mark the closest instance of that block as "unreachable" and go towards the next closest. */
  blacklistClosestOnFailure: Setting<boolean>
  /** This is just a tiebreaker to make it less likely to break blocks if it can avoid it. */
  blockBreakAdditionalPenalty: Setting<double>
  /** It doesn't actually take twenty ticks to place a block, this cost is so high because we want to generally conserve blocks which might be limited. */
  blockPlacementPenalty: Setting<double>
  /** Block reach distance */
  blockReachDistance: Setting<float>
  /** Blocks that Baritone will attempt to avoid (Used in avoidance) */
  blocksToAvoid: Setting<JavaList<net.minecraft.block.Block>>
  /** blocks that baritone shouldn't break, but can if it needs to. */
  blocksToAvoidBreaking: Setting<JavaList<net.minecraft.block.Block>>
  /** Blocks that Baritone is not allowed to break */
  blocksToDisallowBreaking: Setting<JavaList<net.minecraft.block.Block>>
  /** Multiply the cost of breaking a block that's correct in the builder's schematic by this coefficient */
  breakCorrectBlockPenaltyMultiplier: Setting<double>
  /** Allow standing above a block while mining it, in BuilderProcess */
  breakFromAbove: Setting<boolean>
  /** Distance to scan every tick for updates. */
  builderTickScanRadius: Setting<int>
  /** A list of blocks to be treated as if they're air. */
  buildIgnoreBlocks: Setting<JavaList<net.minecraft.block.Block>>
  /** If this is true, the builder will ignore directionality of certain blocks like glazed terracotta. */
  buildIgnoreDirection: Setting<boolean>
  /** If this is true, the builder will treat all non-air blocks as correct. */
  buildIgnoreExisting: Setting<boolean>
  /** A list of names of block properties the builder will ignore. */
  buildIgnoreProperties: Setting<JavaList<string>>
  /** Don't consider the next layer in builder until the current one is done */
  buildInLayers: Setting<boolean>
  /** Only build the selected part of schematics */
  buildOnlySelection: Setting<boolean>
  /** How far to move before repeating the build. */
  buildRepeat: Setting<net.minecraft.util.math.Vec3i>
  /** How many times to buildrepeat. */
  buildRepeatCount: Setting<int>
  /** Don't notify schematics that they are moved. */
  buildRepeatSneaky: Setting<boolean>
  /** A list of blocks to be treated as correct. */
  buildSkipBlocks: Setting<JavaList<net.minecraft.block.Block>>
  /** A mapping of blocks to blocks to be built instead */
  buildSubstitutes: Setting<JavaMap<net.minecraft.block.Block, JavaList<net.minecraft.block.Block>>>
  /** A mapping of blocks to blocks treated as correct in their position */
  buildValidSubstitutes: Setting<JavaMap<net.minecraft.block.Block, JavaList<net.minecraft.block.Block>>>
  /** Cached chunks (regardless of if they're in RAM or saved to disk) expire and are deleted after this number of seconds -1 to disable */
  cachedChunksExpirySeconds: Setting<long>
  /** 0.0f = not visible, fully transparent (instead of setting this to 0, turn off renderCachedChunks) 1.0f = fully opaque */
  cachedChunksOpacity: Setting<float>
  /** Cancel the current path if the goal has changed, and the path originally ended in the goal but doesn't anymore. */
  cancelOnGoalInvalidation: Setting<boolean>
  /** Censor coordinates in goals and block positions */
  censorCoordinates: Setting<boolean>
  /** Censor arguments to ran commands, to hide, for example, coordinates to #goal */
  censorRanCommands: Setting<boolean>
  /** Allow chat based control of Baritone. */
  chatControl: Setting<boolean>
  /** Some clients like Impact try to force chatControl to off, so here's a second setting to do it anyway */
  chatControlAnyway: Setting<boolean>
  /** Print all the debug messages to chat */
  chatDebug: Setting<boolean>
  /** The big one. */
  chunkCaching: Setting<boolean>
  /** The color of the best path so far */
  colorBestPathSoFar: Setting<Packages.java.awt.Color>
  /** The color of the blocks to break */
  colorBlocksToBreak: Setting<Packages.java.awt.Color>
  /** The color of the blocks to place */
  colorBlocksToPlace: Setting<Packages.java.awt.Color>
  /** The color of the blocks to walk into */
  colorBlocksToWalkInto: Setting<Packages.java.awt.Color>
  /** The color of the current path */
  colorCurrentPath: Setting<Packages.java.awt.Color>
  /** The color of the goal box */
  colorGoalBox: Setting<Packages.java.awt.Color>
  /** The color of the goal box when it's inverted */
  colorInvertedGoalBox: Setting<Packages.java.awt.Color>
  /** The color of the path to the most recent considered node */
  colorMostRecentConsidered: Setting<Packages.java.awt.Color>
  /** The color of the next path */
  colorNextPath: Setting<Packages.java.awt.Color>
  /** The color of all selections */
  colorSelection: Setting<Packages.java.awt.Color>
  /** The color of the selection pos 1 */
  colorSelectionPos1: Setting<Packages.java.awt.Color>
  /** The color of the selection pos 2 */
  colorSelectionPos2: Setting<Packages.java.awt.Color>
  /** For example, if you have Mining Fatigue or Haste, adjust the costs of breaking blocks accordingly. */
  considerPotionEffects: Setting<boolean>
  /** This is the big A* setting. */
  costHeuristic: Setting<double>
  /** Stop 5 movements before anything that made the path COST_INF. */
  costVerificationLookahead: Setting<int>
  /** After calculating a path (potentially through cached chunks), artificially cut it off to just the part that is entirely within currently loaded chunks. */
  cutoffAtLoadBoundary: Setting<boolean>
  /** Desktop notifications */
  desktopNotifications: Setting<boolean>
  /** Turn this on if your exploration filter is enormous, you don't want it to check if it's done, and you are just fine with it just hanging on completion */
  disableCompletionCheck: Setting<boolean>
  /** Disconnect from the server upon arriving at your goal */
  disconnectOnArrival: Setting<boolean>
  /** Trim incorrect positions too far away, helps performance but hurts reliability in very large schematics */
  distanceTrim: Setting<boolean>
  /** allows baritone to save bed waypoints when interacting with beds */
  doBedWaypoints: Setting<boolean>
  /** allows baritone to save death waypoints */
  doDeathWaypoints: Setting<boolean>
  /** Echo commands to chat when they are run */
  echoCommands: Setting<boolean>
  /** When running a goto towards a nether portal block, walk all the way into the portal instead of stopping one block before. */
  enterPortal: Setting<boolean>
  /** Take the 10 closest chunks, even if they aren't strictly tied for distance metric from origin. */
  exploreChunkSetMinimumSize: Setting<int>
  /** When GetToBlock or non-legit Mine doesn't know any locations for the desired block, explore randomly instead of giving up. */
  exploreForBlocks: Setting<boolean>
  /** Attempt to maintain Y coordinate while exploring */
  exploreMaintainY: Setting<int>
  /** When the cache scan gives less blocks than the maximum threshold (but still above zero), scan the main world too. */
  extendCacheOnThreshold: Setting<boolean>
  /** Start fading out the path at 20 movements ahead, and stop rendering it entirely 30 movements ahead. */
  fadePath: Setting<boolean>
  /** Pathing can never take longer than this, even if that means failing to find any path at all */
  failureTimeoutMS: Setting<long>
  /** The actual GoalNear is set in this direction from the entity you're following. */
  followOffsetDirection: Setting<float>
  /** The actual GoalNear is set this distance away from the entity you're following */
  followOffsetDistance: Setting<double>
  /** The radius (for the GoalNear) of how close to your target position you actually have to be */
  followRadius: Setting<int>
  /** When mining block of a certain type, try to mine two at once instead of one. */
  forceInternalMining: Setting<boolean>
  /** Move without having to force the client-sided rotations */
  freeLook: Setting<boolean>
  /** As well as breaking from above, set a goal to up and to the side of all blocks to break. */
  goalBreakFromAbove: Setting<boolean>
  /** Line width of the goal when rendered, in pixels */
  goalRenderLineWidthPixels: Setting<float>
  /** The set of incorrect blocks can never grow beyond this size */
  incorrectSize: Setting<int>
  /** Modification to the previous setting, only has effect if forceInternalMining is true If true, only apply the previous setting if the block adjacent to the goal isn't air. */
  internalMiningAirException: Setting<boolean>
  /** Stop using tools just before they are going to break. */
  itemSaver: Setting<boolean>
  /** Durability to leave on the tool when using itemSaver */
  itemSaverThreshold: Setting<int>
  /** Additional penalty for hitting the space bar (ascend, pillar, or parkour) because it uses hunger */
  jumpPenalty: Setting<double>
  /** How high should the individual layers be? */
  layerHeight: Setting<int>
  /** false = build from bottom to top */
  layerOrder: Setting<boolean>
  /** Disallow MineBehavior from using X-Ray to see where the ores are. */
  legitMine: Setting<boolean>
  /** Magically see ores that are separated diagonally from existing ores. */
  legitMineIncludeDiagonals: Setting<boolean>
  /** What Y level to go to for legit strip mining */
  legitMineYLevel: Setting<int>
  /** Shows popup message in the upper right corner, similarly to when you make an advancement */
  logAsToast: Setting<boolean>
  /** The function that is called when Baritone will log to chat. */
  logger: Setting<MethodWrapper<net.minecraft.util.text.ITextComponent>>
  /** Build in map art mode, which makes baritone only care about the top block in each column */
  mapArtMode: Setting<boolean>
  /** After finding this many instances of the target block in the cache, it will stop expanding outward the chunk search. */
  maxCachedWorldScanCount: Setting<int>
  /** If a movement's cost increases by more than this amount between calculation and execution (due to changes in the environment / world), cancel and recalculate */
  maxCostIncrease: Setting<double>
  /** How far are you allowed to fall onto solid ground (with a water bucket)? It's not that reliable, so I've set it below what would kill an unarmored player (23) */
  maxFallHeightBucket: Setting<int>
  /** How far are you allowed to fall onto solid ground (without a water bucket)? 3 won't deal any damage. */
  maxFallHeightNoWater: Setting<int>
  /** If we are more than 300 movements into the current path, discard the oldest segments, as they are no longer useful */
  maxPathHistoryLength: Setting<int>
  /** While mining, wait this number of milliseconds after mining an ore to see if it will drop an item instead of immediately going onto the next one */
  mineDropLoiterDurationMSThanksLouca: Setting<long>
  /** Rescan for the goal once every 5 ticks. */
  mineGoalUpdateInterval: Setting<int>
  /** While mining, should it also consider dropped items of the correct type as a pathing destination (as well as ore blocks)? */
  mineScanDroppedItems: Setting<boolean>
  /** Don't repropagate cost improvements below 0.01 ticks. */
  minimumImprovementRepropagation: Setting<boolean>
  /** Sets the minimum y level whilst mining - set to 0 to turn off. */
  minYLevelWhileMining: Setting<int>
  /** Set to 1.0 to effectively disable this feature */
  mobAvoidanceCoefficient: Setting<double>
  /** Distance to avoid mobs. */
  mobAvoidanceRadius: Setting<int>
  /** Set to 1.0 to effectively disable this feature */
  mobSpawnerAvoidanceCoefficient: Setting<double>
  /** Distance to avoid mob spawners. */
  mobSpawnerAvoidanceRadius: Setting<int>
  /** If a movement takes this many ticks more than its initial cost estimate, cancel it */
  movementTimeoutTicks: Setting<int>
  /** Desktop notification on build finished */
  notificationOnBuildFinished: Setting<boolean>
  /** Desktop notification on explore finished */
  notificationOnExploreFinished: Setting<boolean>
  /** Desktop notification on farm fail */
  notificationOnFarmFail: Setting<boolean>
  /** Desktop notification on mine fail */
  notificationOnMineFail: Setting<boolean>
  /** Desktop notification on path complete */
  notificationOnPathComplete: Setting<boolean>
  /** The function that is called when Baritone will send a desktop notification. */
  notifier: Setting<MethodWrapper<string, boolean>>
  /** A list of blocks to become air */
  okIfAir: Setting<JavaList<net.minecraft.block.Block>>
  /** Override builder's behavior to not attempt to correct blocks that are currently water */
  okIfWater: Setting<boolean>
  /** If we overshoot a traverse and end up one block beyond the destination, mark it as successful anyway. */
  overshootTraverse: Setting<boolean>
  /** Static cutoff factor. */
  pathCutoffFactor: Setting<double>
  /** Only apply static cutoff for paths of at least this length (in terms of number of movements) */
  pathCutoffMinimumLength: Setting<int>
  /** If the current path is too long, cut off this many movements from the beginning. */
  pathHistoryCutoffAmount: Setting<int>
  /** Default size of the Long2ObjectOpenHashMap used in pathing */
  pathingMapDefaultSize: Setting<int>
  /** Load factor coefficient for the Long2ObjectOpenHashMap used in pathing */
  pathingMapLoadFactor: Setting<float>
  /** The maximum number of times it will fetch outside loaded or cached chunks before assuming that pathing has reached the end of the known area, and should therefore stop. */
  pathingMaxChunkBorderFetch: Setting<int>
  /** Line width of the path when rendered, in pixels */
  pathRenderLineWidthPixels: Setting<float>
  /** Exclusively use cached chunks for pathing */
  pathThroughCachedOnly: Setting<boolean>
  /** When breaking blocks for a movement, wait until all falling blocks have settled before continuing */
  pauseMiningForFallingBlocks: Setting<boolean>
  /** Planning ahead while executing a segment can never take longer than this, even if that means failing to find any path at all */
  planAheadFailureTimeoutMS: Setting<long>
  /** Planning ahead while executing a segment ends after this amount of time, but only if a path has been found */
  planAheadPrimaryTimeoutMS: Setting<long>
  /** Start planning the next path once the remaining movements tick estimates sum up to less than this value */
  planningTickLookahead: Setting<int>
  /** Always prefer silk touch tools over regular tools. */
  preferSilkTouch: Setting<boolean>
  /** The command prefix for chat control */
  prefix: Setting<string>
  /** Whether or not to allow you to run Baritone commands with the prefix */
  prefixControl: Setting<boolean>
  /** Pathing ends after this amount of time, but only if a path has been found */
  primaryTimeoutMS: Setting<long>
  /** On save, delete from RAM any cached regions that are more than 1024 blocks away from the player */
  pruneRegionsFromRAM: Setting<boolean>
  /** How many degrees to randomize the pitch and yaw every tick. */
  randomLooking: Setting<double>
  /** ðŸ˜Ž Render cached chunks as semitransparent. */
  renderCachedChunks: Setting<boolean>
  /** Render the goal */
  renderGoal: Setting<boolean>
  /** Render the goal as a sick animated thingy instead of just a box (also controls animation of GoalXZ if renderGoalXZBeacon is enabled) */
  renderGoalAnimated: Setting<boolean>
  /** Ignore depth when rendering the goal */
  renderGoalIgnoreDepth: Setting<boolean>
  /** Renders X/Z type Goals with the vanilla beacon beam effect. */
  renderGoalXZBeacon: Setting<boolean>
  /** Render the path */
  renderPath: Setting<boolean>
  /** Render the path as a line instead of a frickin thingy */
  renderPathAsLine: Setting<boolean>
  /** Ignore depth when rendering the path */
  renderPathIgnoreDepth: Setting<boolean>
  /** Render selections */
  renderSelection: Setting<boolean>
  /** Render selection boxes */
  renderSelectionBoxes: Setting<boolean>
  /** Ignore depth when rendering the selection boxes (to break, to place, to walk into) */
  renderSelectionBoxesIgnoreDepth: Setting<boolean>
  /** Render selection corners */
  renderSelectionCorners: Setting<boolean>
  /** Ignore depth when rendering selections */
  renderSelectionIgnoreDepth: Setting<boolean>
  /** Whenever a block changes, repack the whole chunk that it's in */
  repackOnAnyBlockChange: Setting<boolean>
  /** Replant normal Crops while farming and leave cactus and sugarcane to regrow */
  replantCrops: Setting<boolean>
  /** Replant nether wart while farming. */
  replantNetherWart: Setting<boolean>
  /** When running a goto towards a container block (chest, ender chest, furnace, etc), right click and open it once you arrive. */
  rightClickContainerOnArrival: Setting<boolean>
  /** How many ticks between right clicks are allowed. */
  rightClickSpeed: Setting<int>
  /** The fallback used by the build command when no extension is specified. */
  schematicFallbackExtension: Setting<string>
  /** When this setting is true, build a schematic with the highest X coordinate being the origin, instead of the lowest */
  schematicOrientationX: Setting<boolean>
  /** When this setting is true, build a schematic with the highest Y coordinate being the origin, instead of the lowest */
  schematicOrientationY: Setting<boolean>
  /** When this setting is true, build a schematic with the highest Z coordinate being the origin, instead of the lowest */
  schematicOrientationZ: Setting<boolean>
  /** Line width of the goal when rendered, in pixels */
  selectionLineWidth: Setting<float>
  /** The opacity of the selection. */
  selectionOpacity: Setting<float>
  /** Use a short Baritone prefix [B] instead of [Baritone] when logging to chat */
  shortBaritonePrefix: Setting<boolean>
  /** If your goal is a GoalBlock in an unloaded chunk, assume it's far enough away that the Y coord doesn't matter yet, and replace it with a GoalXZ to the same place before calculating a path. */
  simplifyUnloadedYCoord: Setting<boolean>
  /** If a layer is unable to be constructed, just skip it. */
  skipFailedLayers: Setting<boolean>
  /** For debugging, consider nodes much much slower */
  slowPath: Setting<boolean>
  /** Milliseconds between each node */
  slowPathTimeDelayMS: Setting<long>
  /** The alternative timeout number when slowPath is on */
  slowPathTimeoutMS: Setting<long>
  /** When a new segment is calculated that doesn't overlap with the current one, but simply begins where the current segment ends, splice it on and make a longer combined path. */
  splicePath: Setting<boolean>
  /** Sprint and jump a block early on ascends wherever possible */
  sprintAscends: Setting<boolean>
  /** Continue sprinting while in water */
  sprintInWater: Setting<boolean>
  /** Start building the schematic at a specific layer. */
  startAtLayer: Setting<int>
  /** The function that is called when Baritone will show a toast. */
  toaster: Setting<MethodWrapper<net.minecraft.util.text.ITextComponent, net.minecraft.util.text.ITextComponent>>
  /** The time of how long the message in the pop-up will display */
  toastTimer: Setting<long>
  /** Use sword to mine. */
  useSwordToMine: Setting<boolean>
  /** Walking on water uses up hunger really quick, so penalize it */
  walkOnWaterOnePenalty: Setting<double>
  /** Don't stop walking forward when you need to break blocks in your way */
  walkWhileBreaking: Setting<boolean>
  /** While exploring the world, offset the closest unloaded chunk by this much in both axes. */
  worldExploringChunkOffset: Setting<int>
  /** The size of the box that is rendered when the current goal is a GoalYLevel */
  yLevelBoxSize: Setting<double>
}

interface Setting<T> {
  defaultValue: T
  value: T

  getName(): string
  getType(): Packages.java.lang.reflect.Type
  getValueClass(): JavaClass<T>
  /** Reset this setting to its default value */
  reset(): void
  toString(): string
}

interface Provider {
  /** Returns all of the active IBaritone instances. */
  getAllBaritones(): JavaList<IBaritone>
  /** Provides the IBaritone instance for a given EntityPlayerSP. */
  getBaritoneForPlayer(player: net.minecraft.client.entity.EntityPlayerSP): IBaritone
  /** Returns the ICommandSystem instance. */
  getCommandSystem(): ICommandSystem
  /** Returns the primary IBaritone instance. */
  getPrimaryBaritone(): IBaritone
  getSchematicSystem(): ISchematicSystem
  /** Returns the IWorldScanner instance. */
  getWorldScanner(): IWorldScanner
}

interface IBaritone {
  getBuilderProcess(): IBuilderProcess
  getCommandManager(): ICommandManager
  getCustomGoalProcess(): ICustomGoalProcess
  getExploreProcess(): IExploreProcess
  getFarmProcess(): IFarmProcess
  getFollowProcess(): IFollowProcess
  getGameEventHandler(): IEventBus
  getGetToBlockProcess(): IGetToBlockProcess
  getInputOverrideHandler(): IInputOverrideHandler
  getLookBehavior(): ILookBehavior
  getMineProcess(): IMineProcess
  getPathingBehavior(): IPathingBehavior
  /** Returns the IPathingControlManager for this IBaritone instance, which is responsible for managing the IBaritoneProcesses which control the IPathingBehavior state. */
  getPathingControlManager(): IPathingControlManager
  getPlayerContext(): IPlayerContext
  getSelectionManager(): ISelectionManager
  getWorldProvider(): IWorldProvider
  /** Open click */
  openClick(): void
}

interface ICustomGoalProcess {
  getGoal(): Goal | null
  /** Starts path calculation and execution. */
  path(): void
  /** Sets the pathing goal */
  setGoal(goal: Goal | null): void
  /** Sets the goal and begins the path execution. */
  setGoalAndPath(goal: Goal): void
}

interface Goal {

  /**
   * Returns whether or not the specified position
   * meets the requirement for this goal based.
   *
   * @param x The goal X position
   * @param y The goal Y position
   * @param z The goal Z position
   * @return Whether or not it satisfies this goal
   */
  isInGoal(x: int, y: int, z: int): boolean

  /**
   * Estimate the number of ticks it will take to get to the goal
   *
   * @param x The goal X position
   * @param y The goal Y position
   * @param z The goal Z position
   * @return The estimate number of ticks to satisfy the goal
   */
  heuristic(x: int, y: int, z: int): double
  isInGoal(pos: RawBlockPos): boolean
  heuristic(pos: RawBlockPos): double

  /**
   * Returns the heuristic at the goal.
   * i.e. {@code heuristic() == heuristic(x,y,z)}
   * when {@code isInGoal(x,y,z) == true}
   * This is needed by {@code PathingBehavior#estimatedTicksToGoal} because
   * some Goals actually do not have a heuristic of 0 when that condition is met
   *
   * @return The estimate number of ticks to satisfy the goal when the goal
   * is already satisfied
   */
  heuristic(): double
}
