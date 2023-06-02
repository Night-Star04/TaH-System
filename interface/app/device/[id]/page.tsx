"use client";

import type { NextPage } from "next";
import useSWR from "swr";

import { fetcher_json as fetcher } from "@/util";
import { Numjudgment } from "@/tool";

import { DeviceInfo, RecordInfo } from "@/interface/db";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography as Text,
} from "@mui/material";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

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

function InfoList({ data }: { data: DeviceInfo }): JSX.Element {
  const { uid, name, mac } = data;
  const { h, t } = data.scope || {};

  const scope = {
    t: {
      min: Numjudgment({ value: t?.min, scope: -20 }),
      max: Numjudgment({ value: t?.max, scope: 60 }),
    },
    h: {
      min: Numjudgment({ value: h?.min, scope: 0 }),
      max: Numjudgment({ value: h?.max, scope: 100 }),
    },
  };

  return (
    <div style={{ marginLeft: "16px" }}>
      <Text variant="h6">Name: {name || "Unnamed Sensor"}</Text>
      <Text variant="h6">UID: {uid}</Text>
      <Text variant="h6">Mac Address: {mac}</Text>
      <Text variant="h6">Security range: </Text>
      <div style={{ marginLeft: "16px" }}>
        <Text variant="subtitle1">{`Humidity: ${scope.h.min}% ~ ${scope.h.max}%`}</Text>
        <Text variant="subtitle1">{`Temperature: ${scope.t.min}°C ~ ${scope.t.max}°C`}</Text>
      </div>
    </div>
  );
}

function DataInfo({ id }: { id: string }): JSX.Element {
  const { data, error, isLoading } = useSWR(
    `/api/device/${id}/get`,
    fetcher<DeviceInfo>
  );

  return (
    <Paper elevation={6} sx={{ height: "100%", width: "100%" }}>
      <Text variant="h3">Device Info</Text>

      {isLoading ? (
        <Text variant="h6">Loading...</Text>
      ) : error ? (
        <Text variant="h6">Error loading data.</Text>
      ) : !data ? (
        <Text variant="h6">No data found.</Text>
      ) : (
        <InfoList data={data} />
      )}
    </Paper>
  );
}

const Page: NextPage<Props> = ({ params }) => {
  const { id } = params;

  return (
    <ThemeProvider theme={createTheme()}>
      <Container maxWidth={false}>
        <Button href="/">
          <Text variant="subtitle1">{"<— Back Home"}</Text>
        </Button>

        <Box
          sx={{
            minHeight: "calc(100vh - 56px)",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            mb: 2,
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "25%" } }}>
            <Stack
              spacing={2}
              direction={{ xs: "column", sm: "row", md: "column" }}
            >
              <DataInfo id={id} />
              <CurrentData id={id} />
            </Stack>
          </Box>
          <Paper
            elevation={6}
            sx={{
              width: { xs: "100%", md: "75%" },
              mt: { xs: 2, md: 0 },
              ml: { xs: 0, md: 2 },
            }}
          ></Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Page;
