import { ActorData } from "point-click-lib";
import { RoomData } from "point-click-lib";


export const beach: RoomData = { "id": "room-1", "frameWidth": 320, "width": 400, "height": 200, "background": [{ "parallax": 0, "imageId": "sky.png" }, { "parallax": 1, "imageId": "beach-s.png" }], "backgroundColor": "#AEF4F9", "obstacleAreas": [], "hotspots": [], "walkableAreas": [{ "x": 0, "y": 53, "rect": [400, 53] }] };
export const player: ActorData = {
    id: 'PLAYER',
    width: 50,
    height: 50,
    type: "actor",
    x: 50,
    y: 10,
    isPlayer: true,
    sprite: 'boy',
    room: 'room-1',
    dialogueColor: '#F00A0A'
};
export const npc: ActorData = {
    id: 'NPC',
    width: 50,
    height: 50,
    type: "actor",
    x: 150,
    y: 20,
    sprite: 'boy',
    room: 'room-1',
    filter: 'hue-rotate(60deg)',
    dialogueColor: '#0AF00A'
};
