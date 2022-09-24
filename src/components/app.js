import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './header';

// Code-splitting is automated for `routes` directory
import Game from '../routes/game';
import PrebuiltGame from '../routes/prebuilt-game';
import Profile from '../routes/profile';
import Editor from '../routes/editor'
import PrebuiltEditor from '../routes/prebuilt-editor';

const App = () => (
	<div id="app">
		<Header />
		<Router>
			<Game path="/" />
			<PrebuiltGame path="/prebuilt/" />
			<Editor path="/editor/" user="me" />
			<PrebuiltEditor path="/prebuilt-editor/" user="me" />
			<Profile path="/profile/:user" />
		</Router>
	</div>
)

export default App;
