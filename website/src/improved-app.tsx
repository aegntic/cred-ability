import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import improved components
import MainLayout from './components/improved/main-layout';
import ExclusiveAccessPage from './pages/ExclusiveAccessPage';
import GetStartedPage from './pages/GetStartedPage';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch location={location} key={location.pathname}>
        <Route path="/exclusive-access" component={ExclusiveAccessPage} />
        <Route path="/get-started" component={GetStartedPage} />
        <Route path="/:sectionId?" component={MainLayout} />
      </Switch>
    </AnimatePresence>
  );
}

export default App;