
// is service

JsMacros.once('ChunkLoad', JavaWrapper.methodToJava(() => {
  const widthOption = Client.getGameOptions().getRaw().method_42556() // .getChatWidth()
  const optionValue = Java.type('net.minecraft.class_7172').class.getDeclaredField('field_37868')
  optionValue.setAccessible(true)
  const Double = Java.type('java.lang.Double')
  optionValue.set(widthOption, new Double(2.0))
}))
