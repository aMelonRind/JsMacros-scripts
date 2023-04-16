
// is service

JsMacros.once('ChunkLoad', JavaWrapper.methodToJava(() => {
  const widthOption = Client.getGameOptions().getRaw().method_42556() // .getChatWidth()
  const optionValue = Packages.net.minecraft.class_7172.class.getDeclaredField('field_37868')
  optionValue.setAccessible(true)
  optionValue.set(widthOption, new java.lang.Double(2.0))
}))
