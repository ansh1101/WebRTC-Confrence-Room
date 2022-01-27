import React, { useState } from "react";
import Janus from "./Janus";
import $, { Callbacks } from "jquery";
import axios from "axios";
import bootbox from "bootbox";
var server: any = null;
// if (window.location.protocol === "http:")
server = "ws://" + window.location.hostname + ":8188/janus";

// else server = "https://" + window.location.hostname + ":8089/janus";

var janus: any = null;
var textroom: any = null;
var opaqueId: any = "textroomtest-" + Janus.randomString(12);
var myroom: any = null; // Demo room

var myusername: any = null;
// var myid: any = null;
var participants: any = {};
var transactions: any = {};

export const Textroom = (props: any) => {
  myroom = props.roomIDS;
  var todayDate = new Date();
  const janusDate = todayDate.toString().substring(4, 16);
  const [data, setData] = useState<string>("");
  const onChangeData = (event: React.ChangeEvent<HTMLInputElement>) => {
    return setData(event.currentTarget.value);
  };
  const [jsonFinal, setjsonFinal] = useState<any[]>([]);
  const participantsJson: any[] = [];
  const [selfID, setselfID] = useState("");

  const start = () => {
    Janus.init({
      debug: "all",
      callback: function () {
        if (!Janus.isWebrtcSupported()) {
          console.log("No WebRTC support... ");
          return;
        }
        // Create session
        janus = new Janus({
          server: server,
          success: function () {
            // Attach to TextRoom plugin
            janus.attach({
              plugin: "janus.plugin.textroom",
              opaqueId: opaqueId,
              success: function (pluginHandle: any) {
                textroom = pluginHandle;
                console.log(
                  "Plugin attached! (" +
                    textroom.getPlugin() +
                    ", id=" +
                    textroom.getId() +
                    ")"
                );
                console.log(textroom.session.getSessionId());
                console.log(textroom.session);
                var body = { request: "setup" };
                console.debug("Sending message:", body);
                textroom.send({ message: body });
                // Setup the DataChannel
              },
              error: function (error: any) {
                console.error(" -- Error attaching plugin...", error);
              },
              iceState: function (state: any) {
                console.log("ICE state changed to " + state);
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
              },
              onmessage: function (msg: any, jsep: any) {
                console.debug(" ::: Got a message :::", msg, jsep);
                if (msg["error"]) {
                }
                if (jsep) {
                  // Answer
                  textroom.createAnswer({
                    jsep: jsep,
                    media: { audio: false, video: false, data: true }, // We only use datachannels
                    success: function (jsep: any) {
                      console.debug("Got SDP!", jsep);
                      var body = { request: "ack" };
                      textroom.send({
                        message: body,
                        jsep: jsep,
                        success: () => {
                          const myid = Janus.randomString(12);
                          setselfID(myid);
                          const register = {
                            textroom: "join",
                            room: myroom,
                            transaction: Janus.randomString(12),
                            username: props.name,
                            history: true,
                            display: myid,
                          };
                          textroom.data({
                            text: JSON.stringify(register),
                            error: function (reason: any) {
                              console.log(reason);
                            },
                          });
                        },
                      });
                    },
                    error: function (error: any) {
                      console.error("WebRTC error:", error);
                    },
                  });
                }
              },
              ondataopen: function (data: any) {
                console.log("The DataChannel is available!");
                // Prompt for a display name to join the default room
              },

              ondata: function (data: any) {
                console.debug("We got data from the DataChannel!", data);
                var json = JSON.parse(data);
                const insert = json["participants"];
                const arrayCheck = Array.isArray(insert);
                if (arrayCheck) {
                  participantsJson.push(...insert);
                }
                var filtered = participantsJson.filter(function (el: any) {
                  return el.username !== props.name;
                });
                setjsonFinal(filtered);
                var transaction = json["transaction"];
                if (transactions[transaction]) {
                  // S o m e o n e   w a s  w  a  i t i n g f o r  t h i s
                  transactions[transaction](json);
                  delete transactions[transaction];
                  return;
                }
                var what = json["textroom"];
                //var jsonParticipant = json["participants"];
                //console.log(jsonParticipant);
                //  participantsJson.push(...jsonParticipant)
                // if ( jsonParticipant) {
                //   setparticipantsJson(jsonParticipant);
                // }

                if (what === "message") {
                  // Incoming message: public or private?
                  var msg = json["text"];
                  // const datee = json["date"];

                  var dt = new Date();
                  const janusDate = dt.toString().substring(4, 16);
                  console.log(dt.getMilliseconds());
                  console.log(typeof janusDate);
                  // console.log(dt.toString().substring(16,25 ))
                  msg = msg.replace(new RegExp("<", "g"), "&lt");
                  msg = msg.replace(new RegExp(">", "g"), "&gt");
                  var from = json["from"];
                  console.log(json, "iran");
                  var dateString = getDateString();
                  // var dateString = getDateString(json["date"]);
                  console.log(dateString);
                  var whisper = json["whisper"];
                  var sender = participants[from]
                    ? participants[from]
                    : escapeXmlTags(json["display"]);
                  console.log(sender);

                  if (whisper === true) {
                    // Private message
                    $("#chatroom").append(
                      '<p style="color: purple;"> <b>[Private Msg :' +
                        from +
                        "]</b> " +
                        msg
                    );
                    $("#chatroom").get(0)!.scrollTop =
                      $("#chatroom").get(0)!.scrollHeight;
                  } else {
                    // Public message
                    $("#chatroom").append(
                      "<p> <b>" +
                        dateString +
                        " " +
                        "User-" +
                        from +
                        ": </b> " +
                        msg
                    );
                    $("#chatroom").get(0)!.scrollTop =
                      $("#chatroom").get(0)!.scrollHeight;
                  }
                } else if (what === "join") {
                  //   // Somebody joined

                  // console.log(json);
                  const arrayCheck = Array.isArray(json);
                  // console.log(arrayCheck);
                  // const sfksd = json["participants"];
                  // console.log(Array.isArray(sfksd));

                  console.log(arrayCheck);

                  participantsJson.push(json);

                  console.log(participantsJson);

                  var filtered = participantsJson.filter(function (el: any) {
                    return el.username !== props.name;
                  });

                  console.log(filtered);
                  setjsonFinal(filtered);
                } else if (what === "leave") {
                  // Somebody left
                  console.log(participants[username]);
                  var username = json["username"];
                  var display = json["display"];
                  console.log(display);
                  console.log(json["username"]);
                  var when = new Date();
                  $("#rp" + username).remove();

                  $("#chatroom")!.append(
                    '<p style="color: green;"> <i>' + username + " left</i></p>"
                  );
                  $("#chatroom")!.get(0)!.scrollTop =
                    $("#chatroom").get(0)!.scrollHeight;
                  delete participants[username];
                }
              },
            });
          },
          error: function (error: any) {
            console.error(error);
            alert(error);
          },
          destroyed: function () {
            console.log("destroyed");
          },
        });
      },
    });
  };

  const checkEnter = (
    field: any,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    var theCode = event.key;

    if (theCode == "Enter") {
      sendData(data);
      return false;
    }
  };
  function sendData(data: any) {
    if (data === "") {
      alert("Insert a message to send on the DataChannel");
      return;
    }
    let message = {
      textroom: "message",
      transaction: Janus.randomString(12),
      room: myroom,
      text: data,
    };

    textroom.data({
      text: JSON.stringify(message),
      error: function (reason: any) {
        console.log(reason);
      },
      success: function () {
        const handleChange = async () => {
          const checkIfRoomEntryExists = await axios.get(
            `http://localhost:3002/chat/${myroom}`,
            {}
          );
          if (checkIfRoomEntryExists.data.length == 0) {
            const response = await axios.post(`http://localhost:3002/chat`, {
              _id: selfID,
              roomid: myroom,
              messages: [
                {
                  name: props.name,
                  message: data,
                  timestamp: getDateString(),
                  _id: selfID,
                },
              ],
            });
          } else if (checkIfRoomEntryExists.data[0].roomid == myroom) {
            const updateTheEntry = await axios.put(
              `http://localhost:3002/chat/${myroom}`,
              {
                name: props.name,
                message: data,
                timestamp: getDateString(),
                _id: selfID,
              }
            );
          } else {
            const response = await axios.post(`http://localhost:3002/chat`, {
              _id: selfID,
              roomid: myroom,
              messages: [
                {
                  name: props.name,
                  message: data,
                  timestamp: getDateString(),
                  _id: selfID,
                },
              ],
            });
          }
          // .then((response) => {
          // console.log(response);
          // // const roomcheck = response.data.roomid
          // })

          // const roomcheck = checkIfRoomEntryExists.data.data.roomid;

          // if (roomcheck == myroom) {

          //   const updateTheEntry = await axios.put(`http://localhost:3002/chat/${myroom}`, {
          //     name: props.name,
          //     message: data,
          //     timestamp: getDateString(),
          //     _id: selfID,
          //   });
          // } else {
          //   const response = await axios.post(`http://localhost:3002/chat`, {
          //     _id: selfID,
          //     roomid: myroom,
          //     messages: [
          //       {
          //         name: props.name,
          //         message: data,
          //         timestamp: getDateString(),
          //         _id: selfID,
          //       },
          //     ],
          //   });
          // }
          console.log("Chat history created");
        };

        handleChange();
      },
    });
  }
  function getDateString() {
    var when = new Date();

    var dateString =
      ("0" + when.getHours()).slice(-2) +
      ":" +
      ("0" + when.getMinutes()).slice(-2) +
      ":" +
      ("0" + when.getSeconds()).slice(-2) +
      ":" +
      ("0" + when.getMilliseconds().toString().slice(-1));
    return dateString;
  }
  function escapeXmlTags(value: any) {
    if (value) {
      var escapedValue = value.replace(new RegExp("<", "g"), "&lt");
      escapedValue = escapedValue.replace(new RegExp(">", "g"), "&gt");
      return escapedValue;
    }
  }

  const sendUser = (
    username: any,
    event: React.MouseEvent<HTMLLIElement>
  ): void => {
    sendPrivateMsg(username);
  };

  function sendPrivateMsg(username: any) {
    console.log(username);
    var display = username;
    if (!display) return;
    const result = prompt("Private message to " + display);
    if (result && result !== "") {
      var message = {
        textroom: "message",
        transaction: Janus.randomString(12),
        room: myroom,
        to: username,
        text: result,
      };
      textroom.data({
        text: JSON.stringify(message),
        error: function (reason: any) {
          console.log(reason);
        },
        success: function () {},
      });
    }
    return;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="page-header"></div>
          <div className="container" id="details">
            <div className="row"></div>
          </div>
          <div className="container hide" id="roomjoin">
            <div className="row">
              <span className="label label-info" id="you" />
              <div className="col-md-12" id="controls">
                <div
                  className="input-group margin-bottom-md hide"
                  id="registernow"
                >
                  <span className="input-group-addon"></span>

                  <span className="input-group-btn">
                    <button
                      className="btn btn-success"
                      onClick={start}
                      id="register"
                    >
                      Enter Chat
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="container hide" id="room">
            <div className="row">
              <div className="col-md-4">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">
                      Participants List
                      <span
                        className="label label-info hide"
                        id="participant"
                      />
                    </h4>
                  </div>
                  <div className="panel-body">
                    <ul id="list" className="list-group">
                      {jsonFinal.map((users: any, i) => {
                        return (
                          <li
                            key={i}
                            onClick={(event: any) => {
                              sendUser(users.username, event);
                            }}
                            id={`rp${users.username}`}
                            className={"list-group-item"}
                          >
                            {" "}
                            {users.username}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h3 className="panel-title">Public Chatroom</h3>
                    <h6> {janusDate} </h6>
                  </div>
                  <div className="panel-body relative" id="chatroom"></div>
                  <div className="panel-footer">
                    <div className="input-group margin-bottom-sm">
                      <span className="input-group-addon">
                        <i className="fa fa-cloud-upload fa-fw" />
                      </span>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Write a chatroom message"
                        autoComplete="off"
                        id="datasend"
                        onKeyPress={(event) => checkEnter("datasend", event)}
                        onChange={onChangeData}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="footer"></div>
    </div>
  );
};
