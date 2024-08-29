//@ts-check
// useful when you encounter a resourcepack that cannot be unzipped by unzip softwares but minecraft can read it just fine.
JsMacros.assertEvent(event, 'Key')

/** @type {*} */
const FileOutputStream = Java.type('java.io.FileOutputStream')

/** @type {*} */
const ZipFile = Java.type('java.util.zip.ZipFile')

const destDir = file.toPath().getParent().resolve('./unzip resourcepack/')

/**
 * unzips the specific resourcepack
 * @param {string} name 
 */
function exec(name) {
  let path = file.toPath().toAbsolutePath()
  if (!path.toString().includes('\\.minecraft\\')) {
    throw "can't find .minecraft folder"
  }
  do path = path.getParent()
  while (path.getFileName().toString() !== '.minecraft');
  path = path.resolve(`resourcepacks/${name}.zip`)
  const fil = path.toFile()
  if (!fil.isFile()) return
  const zipFile = new ZipFile(fil)
  try {
    Chat.log('file found, unzipping...')
    unzip(zipFile)
  } finally {
    zipFile.close()
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
