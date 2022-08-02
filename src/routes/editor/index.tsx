import { h, FunctionComponent } from 'preact';
import style from './style.css';
import { GameEditor } from '../../components/GameEditor';

const Editor: FunctionComponent = () => (
	<div className={style.editor}>
		<GameEditor />
	</div>
);

export default Editor;
