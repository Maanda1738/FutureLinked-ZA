import '../styles/globals.css';
import { SavedJobsProvider } from '../context/SavedJobsContext';

export default function App({ Component, pageProps }) {
  return (
    <SavedJobsProvider>
      <Component {...pageProps} />
    </SavedJobsProvider>
  );
}