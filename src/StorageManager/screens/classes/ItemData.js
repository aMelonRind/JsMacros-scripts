// @ts-check
const JavaClassBuilder = require('../../lib/JavaClassBuilder')

/**
 * [Isource](./classes/IItemData.java)  
 * [source](./classes/ItemData.java)
 * @type {typeof import('./ItemData').ItemData}
 */// @ts-ignore
const ItemData = JavaClassBuilder.buildClass('MelonRind$Class$ItemData', __dirname + '/ItemData.java', {
  IItemData: JavaClassBuilder.buildClass('MelonRind$Interface$IItemData', __dirname + '/IItemData.java').class.getTypeName()
})

module.exports = { ItemData }
