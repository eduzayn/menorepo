import { Routes, Route } from 'react-router-dom';
import routes from './routes';

export default function App() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        >
          {route.children?.map((childRoute) => (
            <Route
              key={`${route.path}/${childRoute.path}`}
              path={childRoute.path}
              element={childRoute.element}
            />
          ))}
        </Route>
      ))}
    </Routes>
  );
} 