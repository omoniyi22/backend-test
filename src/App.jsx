import "./App.css";
import RoutesComponent from "./routes";
import { Helmet } from "react-helmet";
import favicon from "./assets/img/tokens/wtheta.png";
import { TransactionProvider } from "./context/TransactionContext.jsx"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <TransactionProvider>
      <div className="App">
        <Helmet>
          <title>Theta Screener</title>
          <link rel="icon" type="image/png" href={favicon} sizes="16x16" />
        </Helmet>
        <ToastContainer />
        <RoutesComponent />
    </div >
    </TransactionProvider>
  )
}

export default App;
