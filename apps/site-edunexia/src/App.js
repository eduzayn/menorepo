import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { ApiProvider } from './lib/ApiContext';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import AppRoutes from './routes';

function App() {
    return (
        _jsx(ErrorBoundary, { 
            children: _jsx(ApiProvider, { 
                children: _jsx(ThemeProvider, { 
                    defaultTheme: "light", 
                    storageKey: "edunexia-ui-theme", 
                    children: _jsxs(Router, { 
                        children: [
                            _jsx(ScrollToTop, {}), 
                            _jsx(AppRoutes, {})
                        ] 
                    }) 
                })
            })
        })
    );
}

export default App;
