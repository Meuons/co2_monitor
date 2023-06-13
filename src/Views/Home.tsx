import Device from "../Components/Device";
import * as React from "react";
const rooms = ['room_1', 'room_2', 'room_3']
export function Home() {
  return (
    <div>
  { rooms.map((item , i) => 
<Device room={item}/>
)}

    </div>
  );
}
