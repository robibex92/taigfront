import React from "react";
import { Box, Tabs, Tab, Badge } from "@mui/material";

const UserAdsTabs = ({
  activeTab,
  onTabChange,
  setActiveTab,
  announcementCounts = {},
}) => {
  const handleTabChange = (event, newTab) => {
    if (onTabChange) {
      onTabChange(newTab);
    } else if (setActiveTab) {
      setActiveTab(newTab);
    }
  };

  const a11yProps = (index) => ({
    id: `announcement-tab-${index}`,
    "aria-controls": `announcement-tabpanel-${index}`,
  });

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="announcement tabs"
        variant="fullWidth"
      >
        <Tab
          value="active"
          label={`Активные (${announcementCounts.active || 0})`}
          {...a11yProps(0)}
        />
        <Tab
          value="archive"
          label={`В архиве (${announcementCounts.archive || 0})`}
          {...a11yProps(1)}
        />
        <Tab
          value="deleted"
          label={`Удаленные (${announcementCounts.deleted || 0})`}
          {...a11yProps(2)}
        />
      </Tabs>
    </Box>
  );
};

export default UserAdsTabs;
