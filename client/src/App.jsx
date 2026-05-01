// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProfileSettings from "./Pages/ProfileSettings";
import Tasks from "./Pages/TasksPage";
// import Notes from "./Pages/Notes";
 import Habits from "./Pages/Habits";
 import Analytics from "./Pages/Analytics";
// import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* All your pages */}
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notes" element={<Notes />} /> */}
        <Route path="/tasks" element={<Tasks />} />
         <Route path="/habits" element={<Habits />} />
         <Route path="/analytics" element={<Analytics />} />  
         <Route path="/settings" element={<ProfileSettings />} />
        
        {/* 404 - Page not found */}
        {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;