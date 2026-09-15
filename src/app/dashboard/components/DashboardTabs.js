"use client";
import React, { forwardRef, startTransition, useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { usePathname, useRouter } from 'next/navigation';
import styles from './DashboardTabs.module.css';

const DashboardItems=[
  {
    label:"Today",
    value:"one",
    route:"/dashboard/today"
  },
  {
    label:"Timeline",
    value:"two",
    route:"/dashboard/timeline"
  },
  {
    label:"Care Plans",
    value:"three",
    route:"/dashboard/carePlans"
  }
];

const DashboardTabItem = forwardRef(function DashboardTabItem(
  { label, value, ...tabProps },
  ref,
) {
  return <Tab ref={ref} {...tabProps} value={value} label={label} />;
});

const DashboardTabs=()=> {
  const pathname = usePathname();
  const router = useRouter();
  const [dashboardTab, setDashboardTab] = useState('one');

  useEffect(() => {
    const matchingDashboardTab = DashboardItems.find(
      (dashboardItem) => dashboardItem.route === pathname,
    )?.value || 'one';

    startTransition(() => {
      setDashboardTab(matchingDashboardTab);
    });
  }, [pathname]);

  const handleChange = (event, dashboardValue) => {
    setDashboardTab(dashboardValue);
    const selectedDashboardRoute = (DashboardItems.find(
      (dashboardItem) => dashboardItem.value === dashboardValue,
    ))?.route || '';
    router.push(selectedDashboardRoute);
  };

  return (
<Tabs
        value={dashboardTab}
        onChange={handleChange}
  textColor="inherit"
        variant="fullWidth"
  className={styles.tabs}
        aria-label="pawlogs tabs"
      >
        {DashboardItems.map((dashboardItem) => (
          <DashboardTabItem
            key={dashboardItem.value}
            value={dashboardItem.value}
            label={dashboardItem.label}
            className={styles.tab}
          />
        ))}
        </Tabs>
  );
}
export default  DashboardTabs;