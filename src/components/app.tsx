import { h, FunctionalComponent } from 'preact';
import { Router } from 'preact-router';

import Header from './header';

// Code-splitting is automated for `routes` directory
import Game from '../routes/game';
import PrebuiltGame from '../routes/prebuilt-game';
import Editor from '../routes/editor'
import PrebuiltEditor from '../routes/prebuilt-editor';

const App: FunctionalComponent = () => (
	<div id="app">
		<Header />
		<Router>
			<Game path="/" />
			<PrebuiltGame path="/prebuilt/" />
			<Editor path="/editor/" />
			<PrebuiltEditor path="/prebuilt-editor/" />
		</Router>
	</div>
)

export default App;
