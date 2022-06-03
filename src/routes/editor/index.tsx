import { h, FunctionComponent } from 'preact';

import { RoomEditor } from '../../components/RoomEditor';
import { INSIDE } from '../../../data/INSIDE'
import outside  from '../../../data/OUTSIDE.json'
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
			data={outside as RoomData}
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
