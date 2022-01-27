import DropdownButton from "react-bootstrap/DropdownButton";
import Janus from "./Janus";
import axios from "axios";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Dropdown from "react-bootstrap/Dropdown";
import $, { Callbacks } from "jquery";
import { Textroom } from "./Textroom";
var server: any = null;
// if (window.location.protocol === "http:")
// else server = "https://" + window.location.hostname + ":8089/janus";
server = "ws://" + window.location.hostname + ":8188/janus";
var janus: any = null;
var sfutest: any = null;
var opaqueId: any = "videoroomtest-" + Janus.randomString(12);
var myusername: any = null;
var myid: any = null;
var mystream: any = null;
var mypvtid: any = null;
var feeds: any = [];
var bitrateTimer: any = [];
var subscriber_mode = false;

export const Create = () => {
  var myDate = new Date(1643009551493694 * 1000);
console.log(myDate.toLocaleString());
console.log(myDate);
  const handleSelect = (e: any) => {
    bitRate(e);
  };
  //  const [sfuTestObject, setsfuTestObject]: any = useState<any[]>([]);
  // console.log(sfuTestObject);
  const [name, setName] = useState<string>("");
  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    return setName(event.currentTarget.value);
  };
  // const remoteFeedData : any[]   = [];
  // const [remoteFeedData, setremoteFeedData] = useState<any[]>([]);

  const pushedData: any[] = [];
  const [remoteFeedPushedData, setremoteFeedPushedData] = useState<any[]>([]);
  const [roomID, setRoomID] = useState<number>();
  var myroom: any = roomID; // Demo room

  const [showColMd, setShowColMd] = useState(false);

  const [joinDiv, setjoinDiv] = useState(true);

  const onChangeRoomID = (event: React.ChangeEvent<HTMLInputElement>) => {
    return setRoomID(parseInt(event.target.value));
  };
  const subscriberMode = () => {
    subscriber_mode = true;
    start();
  };

  const iD = async () => {
    // try {

    const session = await axios.post("http://127.0.0.1:8088/janus", {
      janus: "create",
      transaction: "session",
    });
    const sessionID = session.data.data.id;
    const handle = await axios.post(
      `http://127.0.0.1:8088/janus/${sessionID}`,
      {
        janus: "attach",
        plugin: "janus.plugin.videoroom",
        transaction: "pluginAttach",
      }
    );
    const handleID = handle.data.data.id;
    const roomCreate = await axios.post(
      `http://127.0.0.1:8088/janus/${sessionID}/${handleID}`,
      {
        janus: "message",
        transaction: "roomCreate",
        body: {
          request: "create",
          room: roomID,
          permanent: true,
          description: "Videoroom Application Room",
          publishers: 8,
          record: true,
          rec_dir: "/tmp",
        },
      }
    );
    const config = await axios.post(
      `http://127.0.0.1:8088/janus/${sessionID}/${handleID}`,
      {
        janus: "message",
        transacion: "config",
        body: {
          request: "c",
        },
      }
    );
    console.log(roomCreate);
    if (
      roomCreate.data.plugindata.data.error === `Room ${roomID} already exists`
    ) {
      alert("Room Already Exists, Try Joining This Room instead");
    } else {
      alert(
        `Your Room is Created | Room Number : ${roomCreate.data.plugindata.data.room}`
      );
      myroom = roomCreate.data.plugindata.data.room;
    }
    setInterval(async () => {
      const keepAlive = await axios.post(
        `http://127.0.0.1:8088/janus/${sessionID}/${handleID}`,
        {
          janus: "keepalive",
          session_id: sessionID,
          transaction: "keepingalive",
        }
      );
    }, 50000);
    await textRoomCreate();
  };

  const textRoomCreate = async () => {
    // try {

    const session = await axios.post("http://127.0.0.1:8088/janus", {
      janus: "create",
      transaction: "session",
    });
    const sessionID = session.data.data.id;
    console.log(sessionID);
    const handle = await axios.post(
      `http://127.0.0.1:8088/janus/${sessionID}`,
      {
        janus: "attach",
        plugin: "janus.plugin.textroom",
        transaction: "pluginAttach",
      }
    );
    const handleID = handle.data.data.id;
    console.log(handleID);

    const roomCreate = await axios.post(
      `http://127.0.0.1:8088/janus/${sessionID}/${handleID}`,
      {
        janus: "message",
        transaction: "roomCreate",
        body: {
          request: "create",
          room: roomID,
          history: 100,
          permanent: true,
          description: "Textroom Application Room",
        },
      }
    );

    console.log(roomCreate);

    setInterval(async () => {
      const keepAlive = await axios.post(
        `http://127.0.0.1:8088/janus/${sessionID}/${handleID}`,
        {
          janus: "keepalive",
          session_id: sessionID,
          transaction: "keepingalive",
        }
      );
    }, 50000);
  };
  const bitRate = (e: any) => {
    var id: any = parseInt(e);
    console.log(id);
    var bitrate = parseInt(id) * 1000;
    console.log(bitrate);
    if (bitrate === 0) {
      console.log("Not limiting bandwidth via REMB");
    } else {
      console.log("Capping bandwidth to " + bitrate + " via REMB");
    }

    sfutest.send({
      message: { request: "configure", bitrate: bitrate },
    });

    return false;
  };

  const start = () => {
    setShowColMd(true);
    setjoinDiv(false);

    Janus.init({
      debug: "all",
      callback: function () {
        // Make sure the browser supports WebRTC
        // Create session
        janus = new Janus({
          server: server,
          success: function () {
            // Attach to VideoRoom plugin
            janus.attach({
              plugin: "janus.plugin.videoroom",
              opaqueId: opaqueId,
              success: function (pluginHandle: any) {
                sfutest = pluginHandle;
                console.log(
                  "Plugin attached! (" +
                    sfutest.getPlugin() +
                    ", id=" +
                    sfutest.getId() +
                    ")"
                );
                console.log(sfutest.session.getSessionId());

                console.log("  -- This is a publisher/m a n a g e r ");

                myusername = name;

                const register = {
                  request: "join",
                  room: myroom,
                  ptype: "publisher",
                  display: name,
                  record: false,
                };
                console.log(myusername);

                sfutest.send({ message: register });
              },
              error: function (error: any) {
                console.error("  -- Error attaching plugin...", error);
              },
              consentDialog: function (on: any) {
                console.debug(
                  "Consent dialog should be " + (on ? "on" : "off") + " now"
                );
              },
              mediaState: function (medium: any, on: any) {
                console.log(
                  "Janus " +
                    (on ? "started" : "stopped") +
                    " receiving our " +
                    medium
                );
              },
              webrtcState: function (on: any) {
                console.log(
                  "Janus says our WebRTC PeerConnection is " +
                    (on ? "up" : "down") +
                    " now"
                );
                if (!on) return;
                // setsfuTestObject(sfutest);
              },

              onmessage: function (msg: any, jsep: any) {
                console.debug(" ::: Got a message (publisher) :::");
                let event = msg["videoroom"];
                console.log(msg);
                console.debug("Event: " + event);
                if (event != undefined && event != null) {
                  if (event === "joined") {
                    // Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
                    myid = msg["id"];
                    mypvtid = msg["private_id"];
                    console.log(
                      "Successfully joined room " +
                        msg["room"] +
                        " with ID " +
                        myid
                    );
                    if (subscriber_mode) {
                      const element: HTMLElement =
                        document.getElementById("hideDiv")!;
                      element?.parentNode?.removeChild(element);
                      // $("#videos").removeClass("hide").show();
                    } else {
                      publishOwnFeed(true);
                    }

                    if (
                      msg["publishers"] !== undefined &&
                      msg["publishers"] !== null
                    ) {
                      let list = msg["publishers"];
                      console.log("Got a list of available publishers/feeds:");
                      console.log(list);
                      for (let f in list) {
                        let id = list[f]["id"];
                        let display = list[f]["display"];
                        let audio = list[f]["audio_codec"];
                        let video = list[f]["video_codec"];
                        console.log(
                          "  >> [" +
                            id +
                            "] " +
                            display +
                            " (audio: " +
                            audio +
                            ", video: " +
                            video +
                            ")"
                        );
                        newRemoteFeed(id, display, audio, video);
                      }
                    }
                  } else if (event === "destroyed") {
                    // The room has been destroyed
                    console.warn("The room has been destroyed!");
                    console.error("The room has been destroyed");
                  } else if (event === "event") {
                    // Any new feed to attach to?
                    if (
                      msg["publishers"] !== undefined &&
                      msg["publishers"] !== null
                    ) {
                      console.log("new publishers!");
                      let list = msg["publishers"];
                      console.log(msg);
                      for (let f in list) {
                        let id = list[f]["id"];
                        let display = list[f]["display"];
                        let audio = list[f]["audio_codec"];
                        let video = list[f]["video_codec"];
                        console.log(
                          "  >> [" +
                            id +
                            "] " +
                            display +
                            " (audio: " +
                            audio +
                            ", video: " +
                            video +
                            ")"
                        );
                        newRemoteFeed(id, display, audio, video);
                      }
                    } else if (
                      msg["leaving"] !== undefined &&
                      msg["leaving"] !== null
                    ) {
                      // One of the publishers has gone away?
                    } else if (
                      msg["unpublished"] !== undefined &&
                      msg["unpublished"] !== null
                    ) {
                      // One of the publishers has unpublished?
                      if (msg["unpublished"] === "ok") {
                        sfutest.hangup();
                        return;
                      }
                    } else if (
                      msg["error"] !== undefined &&
                      msg["error"] !== null
                    ) {
                      if (msg["error_code"] === 426) {
                        // This is a "no such room" error: give a more meaningful description
                      } else {
                        console.log("No Such Room");
                      }
                    }
                  }
                }

                if (jsep !== undefined && jsep !== null) {
                  console.debug("Got room event. Handling SDP as well...");
                  console.debug(jsep);
                  sfutest.handleRemoteJsep({ jsep: jsep });
                  // Check if any of the media we wanted to publish has
                  // been rejected (e.g., wrong or unsupported codec)
                  let audio = msg["audio_codec"];
                  if (
                    mystream &&
                    mystream.getAudioTracks() &&
                    mystream.getAudioTracks().length > 0 &&
                    !audio
                  ) {
                    // Audio has been rejected
                    alert(
                      "Our audio stream has been rejected, viewers won't hear us"
                    );
                  }
                  let video = msg["video_codec"];
                  if (
                    mystream &&
                    mystream.getVideoTracks() &&
                    mystream.getVideoTracks().length > 0 &&
                    !video
                  ) {
                    // Video has been rejected
                    console.log(
                      "Our video stream has been rejected, viewers won't see us"
                    );
                  }
                }
              },

              onlocalstream: function (stream: any) {
                console.log(" ::: Got a local stream :::", stream);
                mystream = stream;

                $("#videos").removeClass("hide").show();

                const videoTag = document.createElement("video");
                videoTag.className = "rounded centered";
                videoTag.id = "myvideo";
                videoTag.height = 330;
                videoTag.width = 270;
                videoTag.autoplay = true;
                videoTag.playsInline = true;
                videoTag.style.borderRadius = "5px";
                videoTag.muted = true;

                const muteBtn = document.createElement("button");
                muteBtn.className = "btn btn-warning btn-xs";
                muteBtn.id = "mute";
                muteBtn.textContent = "Mute";
                muteBtn.style.position = "relative";
                muteBtn.style.right = "10px";

                const unpublishBtn = document.createElement("button");
                unpublishBtn.className = "btn btn-warning btn-xs";
                unpublishBtn.id = "unpublish";
                unpublishBtn.textContent = "Unpublish";
                unpublishBtn.style.position = "relative";
                unpublishBtn.style.left = "100px";

                if ($("#myvideo").length === 0) {
                  //
                  var videolocal = document.getElementById("videolocal")!;

                  videolocal.appendChild(videoTag);

                  videolocal.appendChild(muteBtn);
                  videolocal.appendChild(unpublishBtn);
                  var muteToggle: any = document.getElementById("mute");

                  muteToggle?.addEventListener("click", toggleMute);
                  var unpublishHandle: any =
                    document.getElementById("unpublish");

                  unpublishHandle?.addEventListener("click", unpublishOwnFeed);
                }
                $("#publisher").removeClass("hide").html(myusername).show();
                Janus.attachMediaStream(videoTag, stream);
                if (
                  sfutest.webrtcStuff.pc.iceConnectionState !== "completed" &&
                  sfutest.webrtcStuff.pc.iceConnectionState !== "connected"
                )
                  var videoTracks = stream.getVideoTracks();
              },
              onremotestream: function (stream: any) {
                // The publisher stream is sendonly, we don't expect anything here
              },
              oncleanup: function () {
                console.log(
                  " ::: Got a cleanup notification: we are unpublished now :::"
                );
                mystream = null;
                function createButton() {
                  var div: HTMLElement = document.getElementById("videolocal")!;
                  div.innerHTML =
                    '<button id="publish" class="btn btn-primary">Publish</button>';
                }
                createButton();

                const hide = () => {
                  const publishBtn = document.getElementById("publish")!;
                  publishBtn.style.display = "none";
                };
                var element: any = document.getElementById("publish");
                var listener = element.addEventListener("click", function () {
                  publishOwnFeed(true);
                  hide();
                });
              },
            });
          },
          error: function (error: any) {
            console.error(error);
          },
          destroyed: function () {
            console.log("destroyed");
          },
        });
      },
    });

    function publishOwnFeed(useAudio: any) {
      // Publish our stream
      sfutest.createOffer({
        media: {
          audioRecv: false,
          videoRecv: false,
          audioSend: useAudio,
          videoSend: true,
        }, // Publishers are sendonly
        success: function (jsep: any) {
          console.debug("Got publisher SDP!");
          console.debug(jsep);
          const publish = {
            request: "configure",
            audio: useAudio,
            video: true,
            record: false,
          };
          sfutest.send({ message: publish, jsep: jsep });
        },
        error: function (error: any) {
          console.error("WebRTC error:", error);
          if (useAudio) {
            publishOwnFeed(false);
          }
        },
      });
    }

    function newRemoteFeed(id: any, display: any, audio: any, video: any) {
      // A new feed has been published, create a new plugin handle and attach to it as a subscriber
      let remoteFeed: any = null;

      console.log("hexx");
      janus.attach({
        plugin: "janus.plugin.videoroom",
        opaqueId: opaqueId,
        success: function (pluginHandle: any) {
          remoteFeed = pluginHandle;

          console.log(pluginHandle.plugin);
          console.log(
            "Plugin attached! (" +
              remoteFeed.getPlugin() +
              ", id=" +
              remoteFeed.getId() +
              ")"
          );
          console.log("  -- This is a subscriber");
          // We wait for the plugin to send us an offer
          let subscribe = {
            request: "join",
            room: myroom,
            ptype: "subscriber",
            feed: id,
            private_id: mypvtid,
          };
          remoteFeed.videoCodec = video;
          remoteFeed.send({ message: subscribe });
          console.log(subscribe);
        },
        error: function (error: any) {
          console.error("  -- Error attaching plugin...", error);
        },
        onmessage: function (msg: any, jsep: any) {
          console.debug(" ::: Got a message (subscriber) :::", msg);
          let event = msg["videoroom"];

          console.log(msg);
          console.log(jsep);
          console.log("Event: " + event);
          if (event) {
            if (event === "attached") {
              console.log(`subscriber created and attached!`);
              // Subscriber created and attached
              for (let i = 1; i < 6; i++) {
                if (!feeds[i]) {
                  feeds[i] = remoteFeed;
                  remoteFeed.rfindex = i;
                  break;
                }
              }
              remoteFeed.rfid = msg["id"];
              remoteFeed.rfdisplay = msg["display"];
              console.log(`attached`, remoteFeed);
              console.log(
                "Successfully attached to feed " +
                  remoteFeed.rfid +
                  " (" +
                  remoteFeed.rfdisplay +
                  ") in room " +
                  msg["room"]
              );
              // $("#remote" + remoteFeed.rfindex).removeClass("hide").htmlshow();
            }
            else if(event === 'recording') {
              // Got an ANSWER to our recording OFFER
              // if(jsep)
                // recordplay.handleRemoteJsep({ jsep: jsep });
              // var id = result["id"];
              // if(id) {
              //   Janus.log("The ID of the current recording is " + id);
              //   // recordingId = id;
              // }
              console.log('record');
            }

          }
          if (jsep) {
            console.debug("Handling SDP as well...", jsep);
            // Answer and attach
            remoteFeed.createAnswer({
              jsep: jsep,
              media: { audioSend: false, videoSend: false }, // We want recvonly audio/video
              success: function (jsep: any) {
                console.log("Got SDP!", jsep);
                let body = { request: "start", room: myroom };
                remoteFeed.send({ message: body, jsep: jsep });
              },
              error: function (error: any) {
                console.error("WebRTC error:", error);
              },
            });
          }
        },
        iceState: function (state: any) {
          console.log(
            "ICE state of this WebRTC PeerConnection (feed #" +
              remoteFeed.rfindex +
              ") changed to " +
              state
          );
        },
        webrtcState: function (on: any) {
          console.log(
            "Janus says this WebRTC PeerConnection (feed #" +
              remoteFeed.rfindex +
              ") is " +
              (on ? "up" : "down") +
              " now"
          );
        },
        onlocalstream: function (stream: any) {
          // The subscriber stream is recvonly, we don't expect anything here
        },
        onremotestream: function (stream: any) {
          console.log(remoteFeed);

          const a = $("#remotevideo" + remoteFeed.rfindex).length
          console.log(a);
          // var addButtons = false;
          if ($("#remotevideo" + remoteFeed.rfindex).length === 0) {
          //   addButtons = true;
          $("#videoremote" + remoteFeed.id).append(
            '<span class="label label-primary hide" id="curres' +
              remoteFeed.id +
              '" style="position: absolute; bottom: 0px; left: 0px; margin: 15px;"></span>' +
              '  <span class="label label-info hide" id="curbitrate' +
              remoteFeed.id +
              '" style="position: absolute; bottom: 0px; right: 0px; margin: 15px;"></span>'
          );
          $("#curbitrate" + remoteFeed.id)
            .removeClass("hide")
            .show();
          bitrateTimer[remoteFeed.id] = setInterval(function () {
            var bitrate = remoteFeed.getBitrate();
            $("#curbitrate" + remoteFeed.id).text(bitrate);
          }, 1000);

          // const indexOfData: any = pushedData.findIndex((remote) => {
          //   return remote.id == remoteFeed.id;
          // });

          // if (indexOfData < 0) {
          //   pushedData.push(remoteFeed);
          //   setremoteFeedPushedData(pushedData);
          // }

          // console.log(typeof remoteFeed);

          // console.log(pushedData);
          // console.log();

          // setremoteFeedData([...remoteFeedData, remoteFeed]);

          // No remote video yet
          // $("#videoremote" + remoteFeed.rfindex).append(
          //   '<video class="rounded centered relative hide" id="remotevideo' +
          //     remoteFeed.rfindex +
          //     '" width="100%" height="100%" autoplay playsinline/>'
          // );
          }

          const indexOfData: any = pushedData.findIndex((remote) => {
            return remote.id == remoteFeed.id;
          });

          if (indexOfData < 0) {
            pushedData.push(remoteFeed);
            setremoteFeedPushedData(pushedData);
          }

          // console.log(typeof remoteFeed);

          // console.log(pushedData);
          // console.log();
          const video: HTMLElement = document.getElementById(
            `remotevideo${remoteFeed.rfindex}`
          )!;
          Janus.attachMediaStream(video, stream);
          var videoTracks = stream.getVideoTracks();
          // $("#videoremote" + remoteFeed.id).append(
          //   '<span class="label label-primary hide" id="curres' +
          //     remoteFeed.id +
          //     '" style="position: absolute; bottom: 0px; left: 0px; margin: 15px;"></span>' +
          //     '  <span class="label label-info hide" id="curbitrate' +
          //     remoteFeed.id +
          //     '" style="position: absolute; bottom: 0px; right: 0px; margin: 15px;"></span>'
          // );
          // $("#curbitrate" + remoteFeed.id)
          //   .removeClass("hide")
          //   .show();
          // bitrateTimer[remoteFeed.id] = setInterval(function () {
          //   var bitrate = remoteFeed.getBitrate();
          //   $("#curbitrate" + remoteFeed.id).text(bitrate);
          // }, 1000);

          console.log(remoteFeed);
          console.log("Remote feed #" + remoteFeed.id + ", stream:", stream);
          console.log(remoteFeed.display);
        },
        oncleanup: function () {
          console.log(
            " ::: Got a cleanup notification (remote feed " + id + ") :::"
          );

          $("#remoteDiv" + remoteFeed.rfindex).remove();
        },
      });
    }
    function toggleMute() {
      var muted = sfutest.isAudioMuted();
      console.log(muted);
      console.log((muted ? "Unmuting" : "Muting") + " local stream...");
      if (muted) sfutest.unmuteAudio();
      else sfutest.muteAudio();
      muted = sfutest.isAudioMuted();
      $("#mute").html(muted ? "Unmute" : "Mute");
    }

    function unpublishOwnFeed() {
      // Unpublish our stream
      var unpublish = { request: "unpublish" };
      sfutest.send({ message: unpublish });
    }
  };
  const bitrateDropDownObject = [
    {
      event: "0",
      detail: "No Limit",
    },{
      event: "128",
      detail: "Cap to 128kbit",
    },{
      event: "256",
      detail: "Cap to 256kbit",
    }, {
      event: "512",
      detail: "Cap to 512kbit",
    },{
      event: "1024",
      detail: "Cap to 1024kbit",
    },{
      event: "1500",
      detail: "Cap to 1500kbit",
    },{
      event: "2000",
      detail: "Cap to 2000kbit",
    },
  ];


  function start_screensharing(){
    // var newstream;
    // navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    // 					.then(function (stream) {
    //             var [videoStream] = stream.getVideoTracks();
    //             navigator.mediaDevices.getUserMedia({audio: true})
    //             .then((audioStream)=> {
    //              var  [audioTrack] = audioStream.getAudioTracks();
    //               newstream =new MediaStream([videoStream, audioTrack] )
    // var constraints = {video: {'mandatory': {'chromeMediaSource':'screen'}}};

    // navigator.mediaDevices.getUserMedia(constraints)
    //   .then(stream => newstream = stream)

    // // ogcode  //
    sfutest.createOffer(
      {
        media: { 
          video: "screen", audioSend: true, videoRecv: false,  
          videoSend: true,
        replaceVideo: true,},	// Screen sharing Publishers are sendonly
        // stream: newstream ,
        success: function(jsep : any) {
         console.log("Got publisher SDP!", jsep);
          var publish = { request: "configure", audio: true, video: true };
          sfutest.send({ message: publish, jsep: jsep });
        },
        error: function(error : any) {
          console.log("WebRTC error:", error);
          console.log("WebRTC error... " + error.message);
        }
      });

    //   //og code//


      
    // })
  // })

  }
  function stop_screensharing(){
    sfutest.createOffer(
      {
        media: { videoSend: true, audioSend: true,
        replaceVideo: true,},	// Screen sharing Publishers are sendonly
        success: function(jsep :any) {
          console.log("Got publisher SDP!", jsep);
          var publish = { request: "configure", audio: true, video: true };
          sfutest.send({ message: publish, jsep: jsep });
        },
        error: function(error : any) {
          console.log("WebRTC error:", error);
          console.log("WebRTC error... " + error.message);
        }
      });
  }
  

  return (
    <div className="join">
      {joinDiv && (
        <div className="join-container">
          <h2>Create Or Join Room</h2>

          <form>
            <table>
              <tr>
                <td>
                  <label>Enter Username</label>
                </td>
                <td>
                  <input onChange={onChangeName} type="text"></input>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Enter Room ID</label>
                </td>
                <td>
                  <input onChange={onChangeRoomID} type="number"></input>
                </td>
              </tr>
            </table>
          </form>
          <button className="roombtn" onClick={iD}>
            {" "}
            Generate Room
          </button>
          <button className="pubsub" onClick={start}>
            {" "}
            Publisher
          </button>
          <button className="pubsub" onClick={subscriberMode}>
            {" "}
            Subscriber
          </button>
        </div>
      )}

      <div>
        {showColMd && (
          <div className="container hide" id="videos">
            <Textroom name={name} roomIDS={roomID} />
            <div id="row" className="row">
              <div className="col-md-4">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <div id="hideDiv">
                      {remoteFeedPushedData.map((use: any, i) => {
                        return <h1 key={i}>{use.rfdisplay}</h1>;
                      })}
                
                      <h3 className="panel-title">
                        Local Video{" "}
                        <span
                          className="label label-primary hide"
                          id="publisher"
                        />
                        <button className="btn btn-info" onClick={() => start_screensharing()}>Start Screen</button> 
                        <button className="btn btn-warning" onClick={() => stop_screensharing()}>Stop Screen</button> 
                   
                        <Dropdown>
                          <DropdownButton
                            title="Bandwith"
                            id="dropdown-menu-align-right"
                            onSelect={handleSelect}
                          >
                            {bitrateDropDownObject.map((bit , i) => {
                              return (
                                <Dropdown.Item key={i} eventKey={bit.event}>
                                  {bit.detail}
                                </Dropdown.Item>
                              );
                            })}
                          </DropdownButton>
                        </Dropdown>
                      </h3>
                    </div>
                  </div>

                  <div className="panel-body" id="videolocal" />

                  {remoteFeedPushedData.map((use: any, i) => {
                    console.log("ansh");

                    return (
                      <div
                        key={use.rfindex}
                        id={`remoteDiv${use.id}`}
                        className="col-md-4"
                      >
                        <div className="panel panel-default">
                          <div className="panel-heading">
                            <h3 className="panel-title">
                              User Name : {use.rfdisplay}
                              <span
                                className="label label-info hide"
                                id={`remote${use.id}`}
                              ></span>
                            </h3>
                          </div>
                          <div
                            className="panel-body relative"
                            id={`videoremote${use.id}`}
                          >
                            <video
                              id={`remotevideo${use.rfindex}`}
                              className="rounded"
                              width="270px"
                              height="330px"
                              
                              autoPlay
                              playsInline
                            ></video>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
