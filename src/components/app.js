import { h } from 'preact';
import { Router } from 'preact-router';

import Header from './header';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Profile from '../routes/profile';
import Editor from '../routes/editor'

const App = () => (
	<div id="app">
		<Header />
		<Router>
			<Home path="/" />
			<Editor path="/editor/" user="me" />
			<Profile path="/profile/:user" />
		</Router>
	</div>
)

export default App;
