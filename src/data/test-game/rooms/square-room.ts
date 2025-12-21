import { RoomData } from "point-click-lib"

export const SQUARE_ROOM: RoomData = {
  id: "SQUARE_ROOM",
  frameWidth: 480,
  width: 480,
  height: 480,
  background: [

    {
      imageId: "square-room.png",
      parallax: 1
    },
  ],
  hotspots: [

  ],
  obstacleAreas: [
    { x: 285, y: 100, circle: 20, ref: 'ob-1' },
    { x: 315, y: 100, circle: 20, ref: 'ob-2' },
    { x: 340, y: 100, circle: 20, },
  ],

  walkableAreas: [
    {
      x: 1, y: 8,
      polygon: [
        [0, 0],
        [130, 170],
        [364, 168],
        [475, -1]
      ]
    }
  ],
  scaling: [
    [0, 3], [200, 1]
  ]
}
