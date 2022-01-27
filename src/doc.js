// function hide(elements: any) {
    //   elements = elements.length ? elements : [elements];
    //   for (var index = 0; index < elements.length; index++) {
    //     elements[index].style.display = "none";
    //   }
    // }
    // const start = () => {
    //   Janus.init({
    //     debug: "all",
    //     callback: function () {
    //       // Use a button to start the demo
  
    //       // Create session
    //       janus = new Janus({
    //         server: server,
    //         success: function () {
    //           // Attach to VideoRoom plugin
    //           janus.attach({
    //             plugin: "janus.plugin.videoroom",
    //             opaqueId: opaqueId,
    //             success: function (pluginHandle: any) {
    //               sfutest = pluginHandle;
    //               console.log(
    //                 "Plugin attached! (" +
    //                   sfutest.getPlugin() +
    //                   ", id=" +
    //                   sfutest.getId() +
    //                   ")"
    //               );
    //               console.log("  -- This is a publisher/manager");
    //               // Prepare the username registration
    //             },
    //             error: function (error: any) {
    //               console.error("  -- Error attaching plugin...", error);
    //             },
    //             consentDialog: function (on: any) {
    //               console.debug(
    //                 "Consent dialog should be " + (on ? "on" : "off") + " now"
    //               );
    //             },
    //             iceState: function (state: any) {
    //               console.log("ICE state changed to " + state);
    //             },
    //             mediaState: function (medium: any, on: any) {
    //               console.log(
    //                 "Janus " +
    //                   (on ? "started" : "stopped") +
    //                   " receiving our " +
    //                   medium
    //               );
    //             },
    //             webrtcState: function (on: any) {
    //               console.log(
    //                 "Janus says our WebRTC PeerConnection is " +
    //                   (on ? "up" : "down") +
    //                   " now"
    //               );
    //             },
    //             onmessage: function (msg: any, jsep: any) {
    //               console.debug(" ::: Got a message (publisher) :::", msg);
    //               var event = msg["videoroom"];
    //               console.debug("Event: " + event);
    //               if (event) {
    //                 if (event === "joined") {
    //                   // Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
    //                   myid = msg["id"];
    //                   mypvtid = msg["private_id"];
    //                   console.log(
    //                     "Successfully joined room " +
    //                       msg["room"] +
    //                       " with ID " +
    //                       myid
    //                   );
    //                   if (subscriber_mode) {
    //                     console.log("subscriber");
    //                   } else {
    //                     publishOwnFeed(true);
    //                   }
    //                   // Any new feed to attach to?
    //                   if (msg["publishers"]) {
    //                     var list = msg["publishers"];
    //                     console.debug(
    //                       "Got a list of available publishers/feeds:",
    //                       list
    //                     );
    //                     for (var f in list) {
    //                       var id = list[f]["id"];
    //                       var display = list[f]["display"];
    //                       var audio = list[f]["audio_codec"];
    //                       var video = list[f]["video_codec"];
    //                       console.debug(
    //                         "  >> [" +
    //                           id +
    //                           "] " +
    //                           display +
    //                           " (audio: " +
    //                           audio +
    //                           ", video: " +
    //                           video +
    //                           ")"
    //                       );
    //                       newRemoteFeed(id, display, audio, video);
    //                     }
    //                   }
    //                 } else if (event === "destroyed") {
    //                   // The room has been destroyed
    //                   console.warn("The room has been destroyed!");
    //                 } else if (event === "event") {
    //                   // Any new feed to attach to?
    //                   if (msg["publishers"]) {
    //                     var list = msg["publishers"];
    //                     console.debug(
    //                       "Got a list of available publishers/feeds:",
    //                       list
    //                     );
    //                     for (var f in list) {
    //                       var id = list[f]["id"];
    //                       var display = list[f]["display"];
    //                       var audio = list[f]["audio_codec"];
    //                       var video = list[f]["video_codec"];
    //                       console.debug(
    //                         "  >> [" +
    //                           id +
    //                           "] " +
    //                           display +
    //                           " (audio: " +
    //                           audio +
    //                           ", video: " +
    //                           video +
    //                           ")"
    //                       );
    //                       newRemoteFeed(id, display, audio, video);
    //                     }
    //                   } else if (msg["leaving"]) {
    //                     // One of the publishers has gone away?
    //                     var leaving = msg["leaving"];
    //                     console.log("Publisher left: " + leaving);
    //                     var remoteFeed = null;
    //                     for (var i = 1; i < 6; i++) {
    //                       if (feeds[i] && feeds[i].rfid == leaving) {
    //                         remoteFeed = feeds[i];
    //                         break;
    //                       }
    //                     }
    //                     if (remoteFeed != null) {
    //                       console.debug(
    //                         "Feed " +
    //                           remoteFeed.rfid +
    //                           " (" +
    //                           remoteFeed.rfdisplay +
    //                           ") has left the room, detaching"
    //                       );
    //                     }
    //                   } else if (msg["unpublished"]) {
    //                     // One of the publishers has unpublished?
    //                     var unpublished = msg["unpublished"];
    //                     console.log("Publisher left: " + unpublished);
    //                     if (unpublished === "ok") {
    //                       // That's us
    //                       sfutest.hangup();
    //                       return;
    //                     }
    //                     var remoteFeed = null;
    //                     for (var i = 1; i < 6; i++) {
    //                       if (feeds[i] && feeds[i].rfid == unpublished) {
    //                         remoteFeed = feeds[i];
    //                         break;
    //                       }
    //                     }
    //                     if (remoteFeed != null) {
    //                       console.debug(
    //                         "Feed " +
    //                           remoteFeed.rfid +
    //                           " (" +
    //                           remoteFeed.rfdisplay +
    //                           ") has left the room, detaching"
    //                       );
    //                       feeds[remoteFeed.rfindex] = null;
    //                       remoteFeed.detach();
    //                     }
    //                   } else if (msg["error"]) {
    //                     if (msg["error_code"] === 426) {
    //                     } else {
    //                       console.log(msg["error"]);
    //                     }
    //                   }
    //                 }
    //               }
    //               if (jsep) {
    //                 console.debug("Handling SDP as well...", jsep);
    //                 sfutest.handleRemoteJsep({ jsep: jsep });
    //                 // Check if any of the media we wanted to publish has
    //                 // been rejected (e.g., wrong or unsupported codec)
    //                 var audio = msg["audio_codec"];
    //                 if (
    //                   mystream &&
    //                   mystream.getAudioTracks() &&
    //                   mystream.getAudioTracks().length > 0 &&
    //                   !audio
    //                 ) {
    //                   // Audio has been rejected
    //                 }
    //                 var video = msg["video_codec"];
    //                 if (
    //                   mystream &&
    //                   mystream.getVideoTracks() &&
    //                   mystream.getVideoTracks().length > 0 &&
    //                   !video
    //                 ) {
    //                   // Video has been rejected
    //                 }
    //               }
    //             },
    //             onlocalstream: function (stream: any) {
    //               console.debug(" ::: Got a local stream :::", stream);
    //               mystream = stream;
    //               $("#videos").removeClass("hide").show();
    //               if ($("#myvideo").length === 0) {
    //                 $("#myvideo").hide();
    //                 $("#videolocal").append(
    //                   '<video class="rounded centered" id="myvideo" width="100%" height="100%" autoplay playsinline muted="muted"/>'
    //                 );
    //                 // Add a 'mute' button
    //                 $("#videolocal").append(
    //                   '<button class="btn btn-warning btn-xs" id="mute" style="position: absolute; bottom: 0px; left: 0px; margin: 15px;">Mute</button>'
    //                 );
    //                 $("#mute").click(toggleMute);
    //                 // Add an 'unpublish' button
    //                 $("#videolocal").append(
    //                   '<button class="btn btn-warning btn-xs" id="unpublish" style="position: absolute; bottom: 0px; right: 0px; margin: 15px;">Unpublish</button>'
    //                 );
    //                 $("#unpublish").click(unpublishOwnFeed);
    //               }
    //               $("#publisher").removeClass("hide").html(myusername).show();
    //               Janus.attachMediaStream($("#myvideo").get(0), stream);
  
    //               if (
    //                 sfutest.webrtcStuff.pc.iceConnectionState !== "completed" &&
    //                 sfutest.webrtcStuff.pc.iceConnectionState !== "connected"
    //               ) {
    //                 $("#videolocal").parent().parent();
    //               }
    //               var videoTracks = stream.getVideoTracks();
    //               if (!videoTracks || videoTracks.length === 0) {
    //                 // No webcam
    //                 $("#myvideo").hide();
    //                 if ($("#videolocal .no-video-container").length === 0) {
    //                   $("#videolocal").append(
    //                     '<div class="no-video-container">' +
    //                       '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
    //                       '<span class="no-video-text">No webcam available</span>' +
    //                       "</div>"
    //                   );
    //                 }
    //               } else {
    //                 $("#videolocal .no-video-container").remove();
    //                 $("#myvideo").removeClass("hide").show();
    //               }
    //             },
    //             onremotestream: function (stream: any) {
    //               // The publisher stream is sendonly, we don't expect anything here
    //             },
    //             oncleanup: function () {
    //               console.log(
    //                 " ::: Got a cleanup notification: we are unpublished now :::"
    //               );
    //               mystream = null;
    //               $("#videolocal").html(
    //                 '<button id="publish" class="btn btn-primary">Publish</button>'
    //               );
    //               $("#publish").click(function () {
    //                 publishOwnFeed(true);
    //               });
  
    //               $("#bitrate").parent().parent().addClass("hide");
    //               $("#bitrate a").unbind("click");
    //             },
    //           });
    //         },
    //         error: function (error: any) {
    //           console.error(error);
    //         },
    //         destroyed: function () {
    //           window.location.reload();
    //         },
    //       });
    //     },
    //   });
    // };
  
    // const iD = async () => {
    //   try {
    //     const session = await axios.post("http://127.0.0.1:8088/janus", {
    //       janus: "create",
    //       transaction: "session",
    //     });
    //     const sessionID = session.data.data.id;
    //     // console.log(sessionID)
    //     const handle = await axios.post(
    //       `http://127.0.0.1:8088/janus/${sessionID}`,
    //       {
    //         janus: "attach",
    //         plugin: "janus.plugin.videoroom",
    //         transaction: "pluginAttach",
    //       }
    //     );
    //     const handleID = handle.data.data.id;
    //     console.log(handleID);
  
    //     const roomCreate = await axios.post(
    //       `http://127.0.0.1:8088/janus/${sessionID}/${handleID}`,
    //       {
    //         janus: "message",
    //         transaction: "roomCreate",
    //         body: {
    //           request: "create",
    //           room: roomID,
    //           permanent: true,
    //           description: "my room 11",
    //         },
    //       }
    //     );
    //     console.log(roomCreate);
    //     if (
    //       roomCreate.data.plugindata.data.error ===
    //       `Room ${roomID} already exists`
    //     ) {
    //       console.log("roomCreate.data.plugindata.data.error");
    //     } else {
    //       // myroom = roomCreate.data.plugindata.data.room;
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
  
    // function checkEnter() {
    //   console.log("check enter");
    //   registerUsername();
    //   // 	return false;
    //   // var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    //   // if(theCode == 13)
    //   //  {
    //   // } else {
    //   // 	return true;
    //   // }
    // }
    // function registerUsername() {
    //   console.log("register");
  
    //   var register = {
    //     request: "join",
    //     room: myroom,
    //     ptype: "publisher",
    //     display: name,
    //   };
    //   myusername = name;
    //   sfutest.send({ message: register });
    // }
  
    // function publishOwnFeed(useAudio: any) {
    //   // Publish our stream
    //   // $('#publish').attr('disabled', true).unbind('click');
    //   sfutest.createOffer({
    //     media: {
    //       audioRecv: false,
    //       videoRecv: false,
    //       audioSend: useAudio,
    //       videoSend: true,
    //     }, // Publishers are sendonly
  
    //     success: function (jsep: any) {
    //       console.debug("Got publisher SDP!", jsep);
    //       var publish: any = {
    //         request: "configure",
    //         audio: useAudio,
    //         video: true,
    //       };
  
    //       if (acodec) publish["audiocodec"] = acodec;
    //       if (vcodec) publish["videocodec"] = vcodec;
    //       sfutest.send({ message: publish, jsep: jsep });
    //     },
    //     error: function (error: any) {
    //       console.error("WebRTC error:", error);
    //       if (useAudio) {
    //         publishOwnFeed(false);
    //       } else {
    //         $("#publish")
    //           .removeAttr("disabled")
    //           .click(function () {
    //             publishOwnFeed(true);
    //           });
    //       }
    //     },
    //   });
    // }
  
    // function toggleMute() {
    //   var muted = sfutest.isAudioMuted();
    //   console.log((muted ? "Unmuting" : "Muting") + " local stream...");
    //   if (muted) sfutest.unmuteAudio();
    //   else sfutest.muteAudio();
    //   muted = sfutest.isAudioMuted();
    //   $("#mute").html(muted ? "Unmute" : "Mute");
    // }
  
    // function unpublishOwnFeed() {
    //   // Unpublish our stream
    //   // $('#unpublish').attr('disabled', true).unbind('click');
    //   var unpublish = { request: "unpublish" };
    //   sfutest.send({ message: unpublish });
    // }
  
    // function newRemoteFeed(id: any, display: any, audio: any, video: any) {
    //   // A new feed has been published, create a new plugin handle and attach to it as a subscriber
    //   var remoteFeed: any = null;
    //   janus.attach({
    //     plugin: "janus.plugin.videoroom",
    //     opaqueId: opaqueId,
    //     success: function (pluginHandle: any) {
    //       remoteFeed = pluginHandle;
    //       remoteFeed.simulcastStarted = false;
    //       console.log(
    //         "Plugin attached! (" +
    //           remoteFeed.getPlugin() +
    //           ", id=" +
    //           remoteFeed.getId() +
    //           ")"
    //       );
    //       console.log("  -- This is a subscriber");
    //       // We wait for the plugin to send us an offer
    //       var subscribe: any = {
    //         request: "join",
    //         room: myroom,
    //         ptype: "subscriber",
    //         feed: id,
    //         private_id: mypvtid,
    //       };
    //       // In case you don't want to receive audio, video or data, even if the
    //       // publisher is sending them, set the 'offer_audio', 'offer_video' or
    //       // 'offer_data' properties to false (they're true by default), e.g.:
    //       // 		subscribe["offer_video"] = false;
    //       // For example, if the publisher is VP8 and this is Safari, let's avoid video
    //       if (
    //         janus.webRTCAdapter.browserDetails.browser === "safari" &&
    //         (video === "vp9" || (video === "vp8" && !janus.safariVp8))
    //       ) {
    //         if (video) video = video.toUpperCase();
    //         subscribe["offer_video"] = false;
    //       }
    //       remoteFeed.videoCodec = video;
    //       remoteFeed.send({ message: subscribe });
    //     },
    //     error: function (error: any) {
    //       console.error("  -- Error attaching plugin...", error);
    //     },
    //     onmessage: function (msg: any, jsep: any) {
    //       console.debug(" ::: Got a message (subscriber) :::", msg);
    //       var event = msg["videoroom"];
    //       console.debug("Event: " + event);
    //       if (msg["error"]) {
    //         console.log(msg["error"]);
    //       } else if (event) {
    //         if (event === "attached") {
    //           // Subscriber created and attached
    //           for (var i = 1; i < 6; i++) {
    //             if (!feeds[i]) {
    //               feeds[i] = remoteFeed;
    //               remoteFeed.rfindex = i;
    //               break;
    //             }
    //           }
    //           remoteFeed.rfid = msg["id"];
    //           remoteFeed.rfdisplay = msg["display"];
    //           if (!remoteFeed.spinner) {
    //             var target = document.getElementById(
    //               "videoremote" + remoteFeed.rfindex
    //             );
    //           } else {
    //             remoteFeed.spinner.spin();
    //           }
    //           console.log(
    //             "Successfully attached to feed " +
    //               remoteFeed.rfid +
    //               " (" +
    //               remoteFeed.rfdisplay +
    //               ") in room " +
    //               msg["room"]
    //           );
    //           $("#remote" + remoteFeed.rfindex)
    //             .removeClass("hide")
    //             .html(remoteFeed.rfdisplay)
    //             .show();
    //         } else if (event === "event") {
    //           // Check if we got a simulcast-related event from this publisher
    //           var substream = msg["substream"];
    //           var temporal = msg["temporal"];
    //         }
    //       }
    //       if (jsep) {
    //         console.debug("Handling SDP as well...", jsep);
    //         // Answer and attach
    //         remoteFeed.createAnswer({
    //           jsep: jsep,
    //           // Add data:true here if you want to subscribe to datachannels as well
    //           // (obviously only works if the publisher offered them in the first place)
    //           media: { audioSend: false, videoSend: false }, // We want recvonly audio/video
    //           success: function (jsep: any) {
    //             console.debug("Got SDP!", jsep);
    //             var body = { request: "start", room: myroom };
    //             remoteFeed.send({ message: body, jsep: jsep });
    //           },
    //           error: function (error: any) {
    //             console.error("WebRTC error:", error);
    //           },
    //         });
    //       }
    //     },
    //     iceState: function (state: any) {
    //       console.log(
    //         "ICE state of this WebRTC PeerConnection (feed #" +
    //           remoteFeed.rfindex +
    //           ") changed to " +
    //           state
    //       );
    //     },
    //     webrtcState: function (on: any) {
    //       console.log(
    //         "Janus says this WebRTC PeerConnection (feed #" +
    //           remoteFeed.rfindex +
    //           ") is " +
    //           (on ? "up" : "down") +
    //           " now"
    //       );
    //     },
    //     onlocalstream: function (stream: any) {
    //       // The subscriber stream is recvonly, we don't expect anything here
    //     },
    //     onremotestream: function (stream: any) {
    //       console.debug(
    //         "Remote feed #" + remoteFeed.rfindex + ", stream:",
    //         stream
    //       );
    //       var addButtons = false;
    //       if ($("#remotevideo" + remoteFeed.rfindex).length === 0) {
    //         addButtons = true;
    //         // No remote video yet
    //         $("#videoremote" + remoteFeed.rfindex).append(
    //           '<video class="rounded centered" id="waitingvideo' +
    //             remoteFeed.rfindex +
    //             '" width="100%" height="100%" />'
    //         );
    //         $("#videoremote" + remoteFeed.rfindex).append(
    //           '<video class="rounded centered relative hide" id="remotevideo' +
    //             remoteFeed.rfindex +
    //             '" width="100%" height="100%" autoplay playsinline/>'
    //         );
    //         $("#videoremote" + remoteFeed.rfindex).append(
    //           '<span class="label label-primary hide" id="curres' +
    //             remoteFeed.rfindex +
    //             '" style="position: absolute; bottom: 0px; left: 0px; margin: 15px;"></span>' +
    //             '<span class="label label-info hide" id="curbitrate' +
    //             remoteFeed.rfindex +
    //             '" style="position: absolute; bottom: 0px; right: 0px; margin: 15px;"></span>'
    //         );
    //         // Show the video, hide the spinner and show the resolution when we get a playing event
    //         $("#remotevideo" + remoteFeed.rfindex).bind("playing", function () {
    //           if (remoteFeed.spinner) remoteFeed.spinner.stop();
    //           remoteFeed.spinner = null;
    //           $("#waitingvideo" + remoteFeed.rfindex).remove();
    //           // if(this.videoWidth)
    //           //   $('#remotevideo'+remoteFeed.rfindex).removeClass('hide').show();
    //           // var width = this.videoWidth;
    //           // var height = this.videoHeight;
    //           // $('#curres'+remoteFeed.rfindex).removeClass('hide').text(width+'x'+height).show();
    //           // if(janus.webRTCAdapter.browserDetails.browser === "firefox") {
    //           //   // Firefox Stable has a bug: width and height are not immediately available after a playing
    //           //   setTimeout(function() {
    //           //     var width = $("#remotevideo"+remoteFeed.rfindex).get(0).videoWidth;
    //           //     var height = $("#remotevideo"+remoteFeed.rfindex).get(0).videoHeight;
    //           //     $('#curres'+remoteFeed.rfindex).removeClass('hide').text(width+'x'+height).show();
    //           //   }, 2000);
    //           // }
    //         });
    //       }
    //       janus.attachMediaStream(
    //         $("#remotevideo" + remoteFeed.rfindex).get(0),
    //         stream
    //       );
    //       var videoTracks = stream.getVideoTracks();
    //       if (!videoTracks || videoTracks.length === 0) {
    //         // No remote video
    //         $("#remotevideo" + remoteFeed.rfindex).hide();
    //         if (
    //           $("#videoremote" + remoteFeed.rfindex + " .no-video-container")
    //             .length === 0
    //         ) {
    //           $("#videoremote" + remoteFeed.rfindex).append(
    //             '<div class="no-video-container">' +
    //               '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
    //               '<span class="no-video-text">No remote video available</span>' +
    //               "</div>"
    //           );
    //         }
    //       } else {
    //         $(
    //           "#videoremote" + remoteFeed.rfindex + " .no-video-container"
    //         ).remove();
    //         $("#remotevideo" + remoteFeed.rfindex)
    //           .removeClass("hide")
    //           .show();
    //       }
    //       if (!addButtons) return;
    //       if (
    //         janus.webRTCAdapter.browserDetails.browser === "chrome" ||
    //         janus.webRTCAdapter.browserDetails.browser === "firefox" ||
    //         janus.webRTCAdapter.browserDetails.browser === "safari"
    //       ) {
    //         $("#curbitrate" + remoteFeed.rfindex)
    //           .removeClass("hide")
    //           .show();
    //         bitrateTimer[remoteFeed.rfindex] = setInterval(function () {
    //           // Display updated bitrate, if supported
    //           var bitrate = remoteFeed.getBitrate();
    //           $("#curbitrate" + remoteFeed.rfindex).text(bitrate);
    //           // Check if the resolution changed too
    //         }, 1000);
    //       }
    //     },
    //     oncleanup: function () {
    //       console.log(
    //         " ::: Got a cleanup notification (remote feed " + id + ") :::"
    //       );
    //       if (remoteFeed.spinner) remoteFeed.spinner.stop();
    //       remoteFeed.spinner = null;
    //       $("#remotevideo" + remoteFeed.rfindex).remove();
    //       $("#waitingvideo" + remoteFeed.rfindex).remove();
    //       $("#novideo" + remoteFeed.rfindex).remove();
    //       $("#curbitrate" + remoteFeed.rfindex).remove();
    //       $("#curres" + remoteFeed.rfindex).remove();
    //       if (bitrateTimer[remoteFeed.rfindex])
    //         clearInterval(bitrateTimer[remoteFeed.rfindex]);
    //       bitrateTimer[remoteFeed.rfindex] = null;
    //       remoteFeed.simulcastStarted = false;
    //       $("#simulcast" + remoteFeed.rfindex).remove();
    //     },
    //   });
    // }
  
    // Helper to parse query string
  



    // html




//     <div>
//     <div className="container hide" id="videojoin">
//       <div className="row">
//         <span className="label label-info" id="you" />
//         <div className="col-md-12" id="controls">
//           <div
//             className="input-group margin-bottom-md hide"
//             id="registernow"
//           >
//             <span className="input-group-addon">@</span>
//             <input
//               autoComplete="off"
//               className="form-control"
//               type="text"
//               placeholder="Choose a display name"
//               id="username"
//             />
//             <span className="input-group-btn">
//               <button
//                 onClick={checkEnter}
//                 className="btn btn-success"
//                 id="register"
//               >
//                 Join the room
//               </button>
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div className="container hide" id="videos">
//       <div className="row">
//         <div className="col-md-4">
//           <div className="panel panel-default">
//             <div className="panel-heading">
//               <h3 className="panel-title">
//                 Local Video{" "}
//                 <span className="label label-primary hide" id="publisher" />
//                 <div className="btn-group btn-group-xs pull-right hide">
//                   <div className="btn-group btn-group-xs">
//                     <button
//                       id="bitrateset"
//                       className="btn btn-primary dropdown-toggle"
//                       data-toggle="dropdown"
//                     >
//                       Bandwidth
//                       <span className="caret" />
//                     </button>
//                     <ul id="bitrate" className="dropdown-menu" role="menu">
//                       <li>
//                         <a href="#" id="0">
//                           No limit
//                         </a>
//                       </li>
//                       <li>
//                         <a href="#" id={"128"}>
//                           Cap to 128kbit
//                         </a>
//                       </li>
//                       <li>
//                         <a href="#" id={"256"}>
//                           Cap to 256kbit
//                         </a>
//                       </li>
//                       <li>
//                         <a href="#" id={"512"}>
//                           Cap to 512kbit
//                         </a>
//                       </li>
//                       <li>
//                         <a href="#" id={"1024"}>
//                           Cap to 1mbit
//                         </a>
//                       </li>
//                       <li>
//                         <a href="#" id={"1500"}>
//                           Cap to 1.5mbit
//                         </a>
//                       </li>
//                       <li>
//                         <a href="#" id={"2000"}>
//                           Cap to 2mbit
//                         </a>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </h3>
//             </div>
//             <div className="panel-body" id="videolocal" />
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="panel panel-default">
//             <div className="panel-heading">
//               <h3 className="panel-title">
//                 Remote Video #1{" "}
//                 <span className="label label-info hide" id="remote1" />
//               </h3>
//             </div>
//             <div className="panel-body relative" id="videoremote1" />
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="panel panel-default">
//             <div className="panel-heading">
//               <h3 className="panel-title">
//                 Remote Video #2{" "}
//                 <span className="label label-info hide" id="remote2" />
//               </h3>
//             </div>
//             <div className="panel-body relative" id="videoremote2" />
//           </div>
//         </div>
//       </div>
//       <div className="row">
//         <div className="col-md-4">
//           <div className="panel panel-default">
//             <div className="panel-heading">
//               <h3 className="panel-title">
//                 Remote Video #3{" "}
//                 <span className="label label-info hide" id="remote3" />
//               </h3>
//             </div>
//             <div className="panel-body relative" id="videoremote3" />
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="panel panel-default">
//             <div className="panel-heading">
//               <h3 className="panel-title">
//                 Remote Video #4{" "}
//                 <span className="label label-info hide" id="remote4" />
//               </h3>
//             </div>
//             <div className="panel-body relative" id="videoremote4" />
//           </div>
//         </div>
//         <div className="col-md-4">
//           <div className="panel panel-default">
//             <div className="panel-heading">
//               <h3 className="panel-title">
//                 Remote Video #5{" "}
//                 <span className="label label-info hide" id="remote5" />
//               </h3>
//             </div>
//             <div className="panel-body relative" id="videoremote5" />
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>



//running video container//


{/* <div id="myvideo">
<video id="localvideo" autoPlay playsInline></video>
</div>
<div id="videolocal"></div>

<div id="videoremote">
<video id="remotevideo" autoPlay playsInline></video>
</div> */}



///////////////////


const bitrateDropDownObject = [
    {
      bitrateEvent: [
        {
          event: 0,
        },
        {
          event: 128,
        },
        {
          event: 256,
        },
        {
          event: 512,
        },
        {
          event: 1024,
        },
        {
          event: 1500,
        },
        {
          event: 2000,
        },
      ],
      bitrateDetails: [
        {
          detail: "No Limit",
        },
        {
          detail: "Cap to 128kbit"
        },
        {
          detail: "Cap to 256kbit"
        },
        {
          detail: "Cap to 512kbit"
        },
        {
          detail: "Cap to 1024kbit"
        },
        {
          detail: "Cap to 1500kbit"
        },
        {
          detail: "Cap to 2000kbit"
        },
        
      ],
    },
  ];




//   dynamic = 
    {/* <div className="panel-body" id="videolocal">
                    {remoteFeedData.map((callBackData) => {
                      if(callBackData === null){
                      return;
                      }
                      else
                      return(
                      <div className="col-md-4">
                        <div className="panel panel-default">
                          <div className="panel-heading">
                            <h3 className="panel-title">
                              {console.log(callBackData)}
                              <span
                                className="label label-info hide"
                                id="remote22"
                              ></span>
                            </h3>
                          </div>
                          <div
                            className="panel-body relative"
                            id="videoremote22"
                          ></div>
                        </div>
                      </div>
                      )
                    })}
                  </div> */}