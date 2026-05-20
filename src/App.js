import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ApiProvider, useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";
// 🚨 THE FIX: Changed '../context...' to './context...'
import { ItineraryProvider } from "./context/ItineraryContext";
import { LeadProvider } from "./context/LeadContext";

import ThemeWrapper from "./components/ThemeWrapper";
import MainLayout from "./components/MainLayout";

// Import Pages
import Login from "./pages/Login";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import Dashboard from "./pages/Dashboard";
import PreviewItinerary from "./pages/PreviewItinerary";
import Settings from "./pages/Settings";
import LeadManagement from "./pages/LeadManagement";
import { ExtAuth } from "./pages/ExtAuth";
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ApiProvider config={{ baseURL: "http://15.207.113.217:8000" }}>
      <ItineraryProvider
        onLogin={() => {
          setIsAuthenticated(true);
        }}
      >
        <LeadProvider>
          <ThemeWrapper>
            <Routes>
              {/* 1. PUBLIC ROUTES */}
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/dashboard" />
                  ) : (
                    <Login
                      onLogin={() => {
                        setIsAuthenticated(true);
                      }}
                    />
                  )
                }
              />

              <Route path="/preview" element={<PreviewItinerary />} />

              {/* 2. PROTECTED ROUTES */}
              <Route
                path="/*"
                element={
                  isAuthenticated ? (
                    <MainLayout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route
                          path="/lead-management"
                          element={<LeadManagement />}
                        />
                        <Route
                          path="/itinerary-builder"
                          element={<ItineraryBuilder />}
                        />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </MainLayout>
                  ) : (
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <ExtAuth
                            onLogin={() => {
                              setIsAuthenticated(true);
                            }}
                          />
                        }
                      />
                    </Routes>
                  )
                }
              />
            </Routes>
          </ThemeWrapper>
        </LeadProvider>
      </ItineraryProvider>
    </ApiProvider>
  );
}
