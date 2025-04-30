import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import MainLayout from './components/main-layout';

function App() {
  const location = useLocation();

  return (
    <Switch location={location}>
      <Route path="/:sectionId?" component={MainLayout} />
    </Switch>
  );
}

export default App;
