import { h, FunctionComponent } from 'preact';

import { RoomEditor } from '../../components/RoomEditor';
import { INSIDE } from '../../../data/INSIDE'
import { RoomData } from '../../definitions/RoomData';

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

const Editor:FunctionComponent = () => (
	<div>
		<RoomEditor 
			assetList={getBackgroundAssets()} 
			data={INSIDE} 
			saveFunction={(roomData:RoomData) => {
				console.log(roomData)
			} }
		/>
	</div>
);

export default Editor;
