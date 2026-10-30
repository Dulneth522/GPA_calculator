/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AcademicProvider } from './hooks/useAcademicData';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { GpaCalculatorPage } from './pages/GpaCalculatorPage';
import { TargetPlannerPage } from './pages/TargetPlannerPage';
import { CareerPlannerPage } from './pages/CareerPlannerPage';
import { AcademicHistoryPage } from './pages/AcademicHistoryPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  return (
    <AcademicProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />

          {/* Academic Suite Layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/calculator" element={<GpaCalculatorPage />} />
            <Route path="/target-planner" element={<TargetPlannerPage />} />
            <Route path="/career-planner" element={<CareerPlannerPage />} />
            <Route path="/history" element={<AcademicHistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback to Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AcademicProvider>
  );
}
