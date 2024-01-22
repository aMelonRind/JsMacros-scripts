//@ts-check
// useful when you encounter a resourcepack that cannot be unzipped by unzip softwares but minecraft can read it just fine.
JsMacros.assertEvent(event, 'Key')

/** @type {*} */
const FileOutputStream = Java.type('java.io.FileOutputStream')

const ZipResourcePack = Java.type('net.minecraft.class_3258')
const zipFileF = Reflection.getDeclaredField(ZipResourcePack, 'field_45038')
zipFileF.setAccessible(true)

const ZipFileWrapper = Java.type('net.minecraft.class_3258$class_8616')
const openM = Reflection.getDeclaredMethod(ZipFileWrapper, 'method_52426')
openM.setAccessible(true)

const destDir = file.toPath().getParent().resolve('./unzip resourcepack/')

/**
 * unzips the specific resourcepack
 * @param {string} name 
 */
function exec(name) {
  name = `file/${name}.zip`
  // .method_14444() .getEnabledProfiles()
  for (const prof of Client.getMinecraft().method_1520().method_14441()) { // .getResourcePackManager().getProfiles()
    if (prof.method_14463() !== name) continue
    const zipFileWrap = zipFileF.get(prof.method_14458()) // .createResourcePack()
    const zipFile = openM.invoke(zipFileWrap)
    Chat.log('file found, unzipping...')
    unzip(zipFile)
    zipFileWrap.close()
    break
  }
}

function unzip(zipFile) {
  const folder = destDir.toFile()
  if (folder.exists()) folder.delete()
  folder.mkdirs()

  const entries = zipFile.entries()
  while (entries.hasMoreElements()) {
    const entry = entries.nextElement()
    const entryDestination = destDir.resolve(entry.getName()).toFile()
    const dir = entryDestination.getParentFile()
    if (!dir.exists()) dir.mkdirs()

    if (entry.isDirectory()) {
      entryDestination.mkdirs()
    } else {
      const inputStream = zipFile.getInputStream(entry)
      const outputStream = new FileOutputStream(entryDestination)
      const byte = Java.type('byte[]')
      const buffer = new byte(1024)
      let length = 0
      while ((length = inputStream.read(buffer)) > 0) {
          outputStream.write(buffer, 0, length)
      }
      inputStream.close()
      outputStream.close()
    }
  }
  Chat.log('Unzip completed successfully.')
}

module.exports = { exec }
