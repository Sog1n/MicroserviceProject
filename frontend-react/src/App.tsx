import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '@/app/store';
import AppRouter from '@/routes';
import '@/i18n';

export default function App() {
  return (
    <Provider store={store}>
      <AppRouter />
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'custom-toast',
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#1e272e',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f1f2f6',
            fontWeight: 500,
          },
        }}
      />
    </Provider>
  );
}
