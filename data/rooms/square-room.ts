import { RoomData } from "../../src/definitions/RoomData"

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
    { x: 285, y: 100, circle: 20, },
    { x: 315, y: 100, circle: 20, },
    { x: 340, y: 100, circle: 20, },
    { x: 0, y: 0, polygon: [[0, 0], [130, 180], [130, 480], [0, 100]], },
    { x: 0, y: 0, polygon: [[0, 180], [480, 180], [480, 480], [0, 480]], },
    { x: 0, y: 0, polygon: [[480, 0], [480, 180], [360, 180],], },
  ],
  scaling: [
    [0, 3], [200, 1]
  ]
}
