import './styles/index.scss';

import Header from './components/Header';
import {Container} from './components/main-page';

function App(): JSX.Element {
  return (
    <>
      <Header />
      <Container />
    </>
  );
}

export default App;
