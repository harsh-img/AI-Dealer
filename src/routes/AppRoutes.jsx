import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'
import MainLayout from '../components/layout/MainLayout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Agents from '../pages/agents/Agents'
import CreateAgent from '../pages/agents/CreateAgent'
import AgentDetails from '../pages/agents/AgentDetails'
import Campaigns from '../pages/campaigns/Campaigns'
import CreateCampaign from '../pages/campaigns/CreateCampaign'
import CampaignDetails from '../pages/campaigns/CampaignDetails'
import EditCampaign from '../pages/campaigns/EditCampaign'
import LiveAgents from '../pages/liveAgents/LiveAgents'
import CreateLiveAgent from '../pages/liveAgents/CreateLiveAgent'
import LiveAgentDetails from '../pages/liveAgents/LiveAgentDetails'
import EditLiveAgent from '../pages/liveAgents/EditLiveAgent'
import CallHistory from '../pages/callHistory/CallHistory'
import Wallet from '../pages/wallet/Wallet'
import Settings from '../pages/settings/Settings'
import Profile from '../pages/profile/Profile'
import NotFound from '../pages/NotFound'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes with Shared MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* AI Agents Module Routes */}
            <Route path="/agents" element={<Agents />} />
            <Route path="/agents/create" element={<CreateAgent />} />
            <Route path="/agents/:id" element={<AgentDetails />} />
            <Route path="/agents/:id/edit" element={<CreateAgent />} />

            {/* Campaigns Module Routes */}
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/create" element={<CreateCampaign />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
            <Route path="/campaigns/:id/edit" element={<EditCampaign />} />

            {/* Live Agents Module Routes */}
            <Route path="/live-agents" element={<LiveAgents />} />
            <Route path="/live-agents/create" element={<CreateLiveAgent />} />
            <Route path="/live-agents/:id" element={<LiveAgentDetails />} />
            <Route path="/live-agents/:id/edit" element={<EditLiveAgent />} />

            {/* Call History Module Route */}
            <Route path="/call-history" element={<CallHistory />} />

            {/* Wallet & Billing Module Route */}
            <Route path="/wallet" element={<Wallet />} />

            {/* Settings Module Route */}
            <Route path="/settings" element={<Settings />} />

            {/* Profile Module Route */}
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Catch-all / 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes