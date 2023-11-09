// can set the sun's position to player's pitch
// if holding left shift, set the moon instead
module.exports = 0

const p = Player.getPlayer()
const reverse = KeyBind.getPressedKeys().contains('key.keyboard.left.shift')
const angle = Math.sign(p.getYaw()) * (p.getPitch() + 90) / 360 + 0.5
Chat.say(`/time set ${Math.floor((approachTime(!reverse ? angle : (angle + 0.5) % 1) + 0.75) % 1 * 24000)}`)

function approachTime(angle) { // i'm just lazy to find reverse function for getSkyAngle
  let time = angle
  let error
  while (Math.abs(error = angle - getSkyAngle(time)) > 0.00001) time += error
  return time
}

function getSkyAngle(time) {
  time = (time + 0.5) % 1
  return ((time * 4 + 1 - Math.cos(time * Math.PI)) / 6 + 0.5) % 1
}
