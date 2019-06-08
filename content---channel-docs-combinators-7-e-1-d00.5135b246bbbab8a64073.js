(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{40:function(e,n,a){"use strict";a.r(n),a.d(n,"frontMatter",function(){return l}),a.d(n,"rightToc",function(){return o}),a.d(n,"default",function(){return h});a(0);var t=a(56);function r(){return(r=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var a=arguments[n];for(var t in a)Object.prototype.hasOwnProperty.call(a,t)&&(e[t]=a[t])}return e}).apply(this,arguments)}function i(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},i=Object.keys(e);for(t=0;t<i.length;t++)a=i[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)a=i[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var l={id:"combinators",title:"Combining Async Iterators"},o=[{value:"Channel.race",id:"channelrace",children:[]},{value:"Channel.merge",id:"channelmerge",children:[]},{value:"Channel.zip",id:"channelzip",children:[]},{value:"Channel.latest",id:"channellatest",children:[]}],c={rightToc:o},s="wrapper";function h(e){var n=e.components,a=i(e,["components"]);return Object(t.b)(s,r({},c,a,{components:n,mdxType:"MDXLayout"}),Object(t.b)("p",null,"Combining async iterators is a ",Object(t.b)("a",r({parentName:"p"},{href:"https://stackoverflow.com/questions/50585456/how-can-i-interleave-merge-async-iterables"}),"non-trivial task"),", and the ",Object(t.b)("inlineCode",{parentName:"p"},"Channel")," class provide four static methods inspired by ",Object(t.b)("inlineCode",{parentName:"p"},"Promise.race")," and ",Object(t.b)("inlineCode",{parentName:"p"},"Promise.all")," which provide different strategies for combining async iterators."),Object(t.b)("h2",null,Object(t.b)("a",r({parentName:"h2"},{"aria-hidden":!0,className:"anchor",id:"channelrace"})),Object(t.b)("a",r({parentName:"h2"},{"aria-hidden":!0,className:"hash-link",href:"#channelrace"}),"#"),Object(t.b)("inlineCode",{parentName:"h2"},"Channel.race")),Object(t.b)("p",null,Object(t.b)("inlineCode",{parentName:"p"},"Channel.race")," takes an iterable of async iterators and races iterations from each iterator using ",Object(t.b)("inlineCode",{parentName:"p"},"Promise.race")," and yielding the value which resolved first. One important use-case is to place a fixed upper bound on how long each iteration of an async iterator can take:"),Object(t.b)("pre",null,Object(t.b)("code",r({parentName:"pre"},{className:"language-js"}),'import { Channel } from "@channel/channel";\nimport { timeout } from "@channel/timers";\n\nconst chan = new Channel(async (push) => {\n  await push(1);\n  await push(2);\n  await new Promise((resolve) => setTimeout(resolve, 2000));\n  await push(3);\n});\n\ntry {\n  (async () => {\n    for await (const num of Channel.race([chan, timeout(1000)])) {\n      console.log(num); // 1, 2\n    }\n  })();\n} catch (err) {\n  console.log(err); // TimeoutError: 1000 ms elapsed\n}\n')),Object(t.b)("p",null,"The ",Object(t.b)("inlineCode",{parentName:"p"},"timeout")," function is a useful channel-based utility which errors if ",Object(t.b)("inlineCode",{parentName:"p"},"next")," is not called within a specified period of time. In the above example, each iteration has one second to resolve or the iterator throws."),Object(t.b)("p",null,"You can also pass a promise to ",Object(t.b)("inlineCode",{parentName:"p"},"Channel.race")," in which case the entire iteration will be raced against the promise:"),Object(t.b)("pre",null,Object(t.b)("code",r({parentName:"pre"},{className:"language-js"}),'import { Channel } from "@channel/channel";\nimport { timeout } from "@channel/timers";\n\nconst chan = new Channel(async (push) => {\n  await new Promise((resolve) => setTimeout(resolve, 800));\n  await push(1);\n  await new Promise((resolve) => setTimeout(resolve, 800));\n  await push(2);\n  await new Promise((resolve) => setTimeout(resolve, 800));\n  await push(3);\n});\nconst timer = timeout(2000);\n\ntry {\n  (async () => {\n    for await (const num of Channel.race([chan, timer.next()])) {\n      console.log(num); // 1, 2\n    }\n  })();\n} catch (err) {\n  console.log(err); // TimeoutError: 2000 ms elapsed\n} finally {\n  await timer.return();\n}\n')),Object(t.b)("p",null,"Note that it is important to call ",Object(t.b)("inlineCode",{parentName:"p"},"timer.return")," manually in a ",Object(t.b)("inlineCode",{parentName:"p"},"finally")," block to ensure there are no unhandled promise rejections."),Object(t.b)("h2",null,Object(t.b)("a",r({parentName:"h2"},{"aria-hidden":!0,className:"anchor",id:"channelmerge"})),Object(t.b)("a",r({parentName:"h2"},{"aria-hidden":!0,className:"hash-link",href:"#channelmerge"}),"#"),Object(t.b)("inlineCode",{parentName:"h2"},"Channel.merge")),Object(t.b)("p",null,Object(t.b)("inlineCode",{parentName:"p"},"Channel.merge")," takes an iterable of async iterators and returns a channel which yields values whenever any of the child iterators yield values. This method is useful for when you have multiple async iterators from different sources and want to consume values from all of them in the order in which they occur."),Object(t.b)("pre",null,Object(t.b)("code",r({parentName:"pre"},{className:"language-js"}),'import { Channel } from "@channel/channel";\nconst leftClicks = new Channel(async (push, stop) => {\n  const listener = (ev) => push({ type: "left", event: ev });\n  window.addEventListener("click", listener);\n  await stop;\n  window.removeEventListener("click", listener);\n});\nconst rightClicks = new Channel(async (push, stop) => {\n  const listener = (ev) => push({ type: "right", event: ev });\n  window.addEventListener("contextmenu", listener);\n  await stop;\n  window.removeEventListener("contextmenu", listener);\n});\n\n(async () => {\n  for await (const click of Channel.merge([leftClicks, rightClicks])) {\n    console.log(click);\n  }\n})();\n')),Object(t.b)("h2",null,Object(t.b)("a",r({parentName:"h2"},{"aria-hidden":!0,className:"anchor",id:"channelzip"})),Object(t.b)("a",r({parentName:"h2"},{"aria-hidden":!0,className:"hash-link",href:"#channelzip"}),"#"),Object(t.b)("inlineCode",{parentName:"h2"},"Channel.zip")),Object(t.b)("p",null,Object(t.b)("inlineCode",{parentName:"p"},"Channel.zip")," takes an iterable of async iterators and returns a channel which awaits every iteration from every iterator using ",Object(t.b)("inlineCode",{parentName:"p"},"Promise.all"),", yielding the resulting array."),Object(t.b)("p",null,Object(t.b)("strong",{parentName:"p"}," TODO: provide a useful example ")),Object(t.b)("h2",null,Object(t.b)("a",r({parentName:"h2"},{"aria-hidden":!0,className:"anchor",id:"channellatest"})),Object(t.b)("a",r({parentName:"h2"},{"aria-hidden":!0,className:"hash-link",href:"#channellatest"}),"#"),Object(t.b)("inlineCode",{parentName:"h2"},"Channel.latest")),Object(t.b)("p",null,Object(t.b)("inlineCode",{parentName:"p"},"Channel.latest")," takes an iterable of async iterators and returns a channel which yields an array of the latest values from each iterator whenever any of the iterators yields a value."),Object(t.b)("p",null,Object(t.b)("strong",{parentName:"p"}," TODO: provide a useful example ")))}h.isMDXComponent=!0}}]);