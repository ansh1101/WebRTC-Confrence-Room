import React from 'react'

export const Dynamicdiv = (props) => {


    // if ($("#remotevideo" + remoteFeed.rfindex).length === 0) {
    //     addButtons = true;
    //     // No remote video yet
    //     $("#videoremote" + remoteFeed.rfindex).append(
    //       '<video class="rounded centered relative hide" id="remotevideo' +
    //         remoteFeed.rfindex +
    //         '" width="100%" height="100%" autoplay playsinline />'
    //     );
    //     $("#videoremote" + remoteFeed.rfindex).append(
    //       '<span class="label label-primary hide" id="curres' +
    //         remoteFeed.rfindex +
    //         '" style="position: absolute; bottom: 0px; left: 0px; margin: 15px;"></span>' +
    //         '<span class="label label-info hide" id="curbitrate' +
    //         remoteFeed.rfindex +
    //         '" style="position: absolute; bottom: 0px; right: 0px; margin: 15px;"></span>'
    //     );
    //     // Show the video, hide the spinner and show the resolution when we get a playing event
    //     $("#remotevideo" + remoteFeed.rfindex).bind("playing", function () {
    //       if (remoteFeed.spinner) remoteFeed.spinner.stop();
    //       remoteFeed.spinner = null;
    //     });
    //   }
    // const video: HTMLElement = $("#remotevideo" + remoteFeed.rfindex).get(
    //     0
    //   )!;
    //   Janus.attachMediaStream(video, stream);
    return (
        <div>
            <div className="col-md-4">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">
                            Remote Feed {props.remote.rfindex}{" "}

                            <span className="label label-info hide" id="remote2" />
                        </h3>
                        <p>{props.name }</p>
                    </div>
                    <div className="panel-body relative" id="videoremote2" />
                    <video class="rounded centered relative hide" id="remotevideo' +  remoteFeed.rfindex + '" width="100%" height="100%" autoplay playsinline />

                </div>
            </div>

        </div>
    )
}
