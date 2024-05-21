//@ts-check
// This imports types using triple-slash directives. If you set up the environent, you don't need to do this.
/// <reference path = "./index.d.ts"/>

// This file contains some examples, while you can play around with types.
// Most of the examples isn't relevant to each other, thus this file most likely won't work as a script.
if (1) throw 'This is playground, not a script.'

// The @ts-expect-error annotation are used to suppress errors. Remove them to see the error.

// Some strings has defined set of contents based on their position.
// Try delete the content of the string and press ctrl+space. It'll show you some suggestions.

// You can view the definition by ctrl+left clicking the field/method.



// This will error because the type of event is BaseEvent.
//@ts-expect-error
event.stopListener

// Asserts the global event object, and change the type if applicable.
JsMacros.assertEvent(event, 'Service')
// The type of event would be `Key` if the script is in Key tab, `Service` in Service tab, and corresponding event if in Event tab.

// Now it won't error because the type of event has been asserted and changed.
event.stopListener = JavaWrapper.methodToJava(() => {
  // The code to run when the service is stopped.
})


// The basic of registering an event listener:
JsMacros.on('EntityLoad', false, JavaWrapper.methodToJava(e => {
  // The behavior/action of this listener.
  if (e.entity.getType() === 'minecraft:cat') {
  }
}))
// 'EntityLoad' - The name of the event.
// false - Whether the listener should be joined, if the listener should be runned on the main thread.
// JavaWrapper... - The callback of the listener.

// Example of a message filterer:
JsMacros.on('RecvMessage', true, JavaWrapper.methodToJava((e, ctx) => {
  const str = e.text?.getString()
  if (!str) return // can happen if other listener set the text to null
  if (str.startsWith('[Ad]') || str.startsWith('[Advertisement]') || str.startsWith('[Spam]')) {
    // You can either just cancel the event
    e.cancel()
    // ...or set the text to null, it also prevents other listener to get the text
    // this allows other listener to re-assign value to receive another message, unlike `e.cancel()`.
    e.text = null
    // ...or replace the text, modifying the message
    e.text = Chat.createTextHelperFromString('[Suppressed Message]')
  }

  // At this point, this callback is still joined. But if you do
  ctx.releaseLock()
  // then it'll spawn a new thread and let the main thread continue, reducing lag.
  // It's not necessary if it's at the end of the callback.
}))

// Notice that in JsMacros, we use JavaWrapper.methodToJava(() => {...}) to present a callback. It's meant to add
// thread safety, because javascript is single-threaded while java is multi-threaded. If java for some reason invoke the
// js function from multiple thread, it'll crash. So JavaWrapper is there to schedule the threads, preventing the crash.


// Example of getting entities:
const entities = World.getEntities()
const catEntities = World.getEntities('cat')
const armorStandEntities = World.getEntities('armor_stand')
const skeletonEntities = World.getEntities('skeleton')
// This ts environment is able to infer the entity type based on the provided id. Hover over the variables to see the type.


