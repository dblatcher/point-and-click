import { h, FunctionComponent } from 'preact';

import { RoomEditor } from '../../components/RoomEditor';
import { startingGameCondition } from '../../../data/fullGame';
import { RoomData } from '../../definitions/RoomData';
import { makeDownloadFile, dataToBlob } from '../../lib/download';

const path = "./assets/backgrounds/"
function getBackgroundAssets(): string[] {
	return [
		"square-room.png",
		"hill.png",
		"indoors.png",
		"sky.png",
		"trees.png",
	].map(filename => path + filename)
}

const Editor: FunctionComponent = () => (
	<div>
		<RoomEditor
			assetList={getBackgroundAssets()}
			data={startingGameCondition.rooms[0]}
			saveFunction={(roomData: RoomData): void => {
				const blob = dataToBlob(roomData)
				if (blob) {
					makeDownloadFile(`${roomData.name || 'UNNAMED'}.room.json`, blob)
				}
			}}
		/>
	</div>
);

export default Editor;
