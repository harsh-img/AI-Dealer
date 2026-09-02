import React from "react";
import dashboardData from "../data/dashboard.json";

import StatCard from "../components/dashboard/StatCard";
import CallPerformanceChart from "../components/dashboard/CallPerformanceChart";
import CampaignOverview from "../components/dashboard/CampaignOverview";

const Dashboard = () => {
  const { stats, callPerformance, campaigns } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-10">
      {/* 2. Top 4 Core Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((item) => (
          <StatCard
            key={item.id}
            label={item.label}
            value={item.value}
            change={item.change}
            changeType={item.changeType}
            changeLabel={item.changeLabel}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </div>

      {/* 3. Main Analytics & Campaigns Sections */}
      <div className="space-y-6 sm:space-y-8">
        {/* 7-day Call Performance Chart */}
        <CallPerformanceChart data={callPerformance} />

        {/* Campaign Overview Table */}
        <CampaignOverview campaigns={campaigns} />
      </div>
    </div>
  );
};

export default Dashboard;
