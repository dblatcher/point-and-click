import { h, FunctionComponent } from 'preact';
import { GameEditor } from '../../components/GameEditor';

const Editor: FunctionComponent = () => (
	<div style={{ paddingTop: 56 }}>
		<GameEditor />
	</div>
);

export default Editor;
