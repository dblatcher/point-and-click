import { RoomData } from "@/definitions/RoomData"

export const INSIDE: RoomData = {
  id: "INSIDE",
  name: "the red shed",
  frameWidth: 320,
  width: 480,
  height: 200,
  background: [

    {
      imageId: "trees.png",
      parallax: 0.5
    },
    {
      imageId: "indoors.png",
      parallax: 1
    }
  ],
  hotspots: [
    {
      id: "window",
      name: "window",
      type: "hotspot",
      x: 70,
      y: 130,
      rect: [190, 60],
      parallax: 1
    }
  ],
  obstacleAreas: [
    {
      x: 300,
      y: 100,
      rect: [10, 90],
    },
  ],
  backgroundMusic: {
    soundId: '2step_pattern1',
    volume: .1
  }
}
