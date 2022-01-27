import React from "react";
import { Link } from "react-router-dom";

export const Videoroom = () => {
  return (
    <div className="linkcontainer">
      <div className="link">
        <h2>Janus  Video  Room</h2>
        <ul>
          <li className="links1">
            <Link to="/create">Create or Join Room</Link>
          </li>
         
        </ul>
      </div>
    </div>
  );
};
