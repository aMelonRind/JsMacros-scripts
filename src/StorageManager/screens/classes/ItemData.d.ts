
export class ItemData {
  /** @deprecated */ static Symbol: undefined;
  /** @deprecated */ static arguments: undefined;
  /** @deprecated */ static caller: undefined;
  /** @deprecated */ static prototype: undefined;
  readonly static class: JavaClass<ItemData>;

  static localeNumber(num: long): string;
  static cleanUUID(nbt: NbtCompound): NbtCompound;

  constructor (item: ItemStackHelper): ItemData;

  readonly item: ItemStackHelper;
  readonly index: int;
  readonly count: number;
  readonly distance: number;
  readonly nearest: BlockPosHelper;

  compareCount(other: ItemData): int;
  compareName(other: ItemData): int;
  compareDistance(other: ItemData): int;

  /**
   * this method only checks index, item id and nbt.
   */
  equals(o: any): boolean;

}
