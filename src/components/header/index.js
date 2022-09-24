import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Header = () => (
	<header class={style.header}>
		<h1>Point and Click</h1>
		<nav>
			<Link activeClassName={style.active} href="/">Game</Link>
			<Link activeClassName={style.active} href="/prebuilt">Prebuilt Game</Link>
			<Link activeClassName={style.active} href="/editor">editor</Link>
			<Link activeClassName={style.active} href="/prebuilt-editor">prebuilt editor</Link>
		</nav>
	</header>
);

export default Header;
