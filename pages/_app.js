/*import { Provider } from 'react-redux';
import store from '../pages/store'; 

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;*/
import { Provider } from 'react-redux';
import store from '../public/store'; 
import '../styles/globals.css';
export default function App({ Component, pageProps }) {
  return <Provider store={store}>
  <Component {...pageProps} />
</Provider>
}
