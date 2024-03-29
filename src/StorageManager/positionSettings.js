// @ts-check

// although i think it's not useful in this kind of script, i should mention:
// don't use JavaWrapper.methodToJava because it'll keep the spawned context alive and occupy resources.

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

  /**
   * since each of the functions will be wrapped to another context to solve multi thread exception,  
   * you can't declare/use any local variable outside of the functions  
   * you can still use `GlobalVars` to store/get variables since it's a global library
   * @readonly
   */
  storageViewer: {

    /**
     * this callback is executed every frame
     * @param {Pos2D} screenSize 
     * @returns {Vec2D} indicates start and end. can be reversed order (who the f wants reversed order)
     */
    itemsPosition(screenSize) {
      screenSize = screenSize.multiply(0.5, 0.5)
      // const dynamic = Math.abs(Math.sin(Time.time() / 200)) * 200
      // return screenSize.add(-90 - dynamic, -80).toReverseVector(screenSize.add(90 + dynamic, 101))
      // return screenSize.add(-290, -80).toReverseVector(screenSize.add(290, 201))
      return screenSize.add(-90, -80).toReverseVector(screenSize.add(90, 101))
    },

    /**
     * this callback is executed every frame
     * @param {Pos2D} screenSize 
     * @returns {Vec2D} indicates x, y, width, height
     */
    searchBarPosition(screenSize) {
      return screenSize.multiply(0.5, 0.5).add(-88, -100).toReverseVector(176, 16)
    }

  }

}
