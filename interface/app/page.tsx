"use client";

import type { JSX } from "react";
import type { NextPage } from "next";
import useSWR from "swr";

import { fetcher_json as fetcher } from "@/util";

import word from "@/text/home.json";

import type { DeviceData } from "@/interface/db";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Container,
  Unstable_Grid2 as Grid,
  Typography as Text,
} from "@mui/material";
import DeviceCard from "./DeviceCard";

function Textblock({ text }: { text: string }): JSX.Element {
  return (
    <div style={{ textAlign: "center" }}>
      <Text variant="h6">{text}</Text>
    </div>
  );
}

function Datasheets(): JSX.Element {
  const { data, error, isLoading } = useSWR(
    "/api/device/get",
    fetcher<Array<DeviceData>>,
    { refreshInterval: 5000 }
  );

  if (isLoading) return <Textblock text={word.SWR.loading} />;
  if (error) return <Textblock text={word.SWR.error} />;
  if (!data || data.length === 0)
    return (
      <Textblock text="No devices found. Please add a device to continue." />
    );

  return (
    <Grid
      container
      spacing={2}
      disableEqualOverflow
      sx={{
        mb: 2,
        justifyContent: "center",
      }}
    >
      {data.map((v) => (
        <DeviceCard key={v.uid} data={v} />
      ))}
    </Grid>
  );
}

const Home: NextPage = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <Container maxWidth={false}>
        <Text variant="h3">{word.title}</Text>
        <Text variant="h5">{word.description}</Text>
        <Datasheets />
      </Container>
    </ThemeProvider>
  );
};

export default Home;
