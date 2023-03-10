
// is service

JsMacros.once('ChunkLoad', JavaWrapper.methodToJava(() => {
  const Double = Java.type('java.lang.Double')
  const widthOption = Client.getGameOptions().getRaw().method_42556() // .getChatWidth()
  const optionValue = Reflection.getDeclaredField(Java.type('net.minecraft.class_7172'), 'field_37868')
  optionValue.setAccessible(true)
  optionValue.set(widthOption, new Double(2.0))
}))
