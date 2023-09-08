// @ts-check

// you don't need to care about Math.floor, the script will do it itself
module.exports = {

  /**
   * @param {Pos2D} screenSize 
   * @param {number} rows the rows that the container has. `0` for survival inventory, `-1` for creative inventory
   * @returns {Pos2D}
   */
  statusElementPosition(screenSize, rows) {
    if (rows === 0) return screenSize.multiply(0.5, 0.5).add(-110, -105)
    else if (rows === -1) return screenSize.multiply(0.5, 0.5).add(-123, -117)
    return screenSize.multiply(0.5, 0.5).add(-110, -40 - rows * 9)
  },

  /** @readonly */
  storageViewer: {

    /**
     * @param {Pos2D} screenSize 
     * @returns {Vec2D} indicates start and end. can be reversed order (who the f wants reversed order)
     */
    itemsPosition(screenSize) {
      screenSize = screenSize.multiply(0.5, 0.5)
      return screenSize.add(-90, -80).toReverseVector(screenSize.add(90, 100))
      // return screenSize.add(-290, -80).toReverseVector(screenSize.add(290, 200))
    },

    /**
     * @param {Pos2D} screenSize 
     * @returns {Vec2D} indicates x, y, width, height
     */
    searchBarPosition(screenSize) {
      return screenSize.multiply(0.5, 0.5).add(-88, -100).toReverseVector(176, 16)
    }

  }

}
