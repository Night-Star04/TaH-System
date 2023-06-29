"use client";

import { useState, ReactNode, SyntheticEvent } from "react";
import dynamic from "next/dynamic";

import { Box, Tab, Tabs } from "@mui/material";

const Recode = dynamic(() => import("./Recode"));

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ padding: { xs: 1, md: 2 } }}>{children}</Box>
      )}
    </div>
  );
}

function Dashboard({ id }: { id: string }) {
  const [value, setValue] = useState(0);
  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange} variant="fullWidth">
        <Tab label="Chart" value={0} />
        <Tab label="Recode" value={1} />
      </Tabs>
      <TabPanel value={value} index={0}>
        Chart
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Recode id={id} />
      </TabPanel>
    </>
  );
}

export default Dashboard;
