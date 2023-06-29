"use client";

import type { JSX } from "react";
import useSWR from "swr";

import { fetcher_json as fetcher } from "@/util";
import { RecordInfo } from "@/interface/db";

import { Paper, Typography as Text } from "@mui/material";

function CurrentData({ id }: { id: string }): JSX.Element {
  const { data, error, isLoading } = useSWR(
    `/api/data/${id}/get?limit=1`,
    fetcher<Array<RecordInfo>>,
    { refreshInterval: 5000 }
  );

  return (
    <Paper elevation={6} sx={{ height: "100%", width: "100%" }}>
      <Text variant="h3">Current Value</Text>
      {isLoading ? (
        <Text variant="h6">Loading...</Text>
      ) : error ? (
        <Text variant="h6">Error loading data.</Text>
      ) : !data || !data[0] ? (
        <Text variant="h6">No data found.</Text>
      ) : (
        <div style={{ marginLeft: "16px" }}>
          <Text variant="h6">Temperature: {data[0].t}°C</Text>
          <Text variant="h6">Humidity: {data[0].h}%</Text>
          <Text variant="h6">
            Time: {new Date(data[0].time).toLocaleString()}
          </Text>
        </div>
      )}
    </Paper>
  );
}

export default CurrentData;
