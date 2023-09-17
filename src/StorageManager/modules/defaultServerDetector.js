
/**
 * this function is used to detect sub servers  
 * the identifier should be a valid directory name  
 * you shouldn't use `default` as a server id because it's a fallback id  
 * this function will be called on server profile load, every container opened, every in-inventory icon clicked  
 * when dimension changed, the id will set to default first
 * @returns {string | undefined | null}
 *  string for identifier  
 *  `undefined` for not sure (keep previous one)  
 *  `null` for unknown (fallback to default)
 */
function detect() {
  // World.getTabListHeader()
  // Chat.getHistory()
}

module.exports = detect
