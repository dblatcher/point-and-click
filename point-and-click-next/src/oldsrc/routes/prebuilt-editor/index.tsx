import { h, FunctionComponent } from 'preact';
import style from './style.css';
import { GameEditor } from '../../components/GameEditor';

const PrebuiltEditor: FunctionComponent = () => (
	<div className={style.editor}>
		<GameEditor usePrebuiltGame />
	</div>
);

export default PrebuiltEditor;
