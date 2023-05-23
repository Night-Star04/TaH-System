"use client";

import type { JSX } from "react";
import type { NextPage } from "next";
import useSWR from "swr";

import { fetcher_json as fetcher } from "@/util";

import word from "@/text/home.json";

import type { DeviceData, RecordInfo } from "@/interface/db";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Container,
  Unstable_Grid2 as Grid,
  Paper,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography as Text,
  Button,
  Avatar,
  CardActionArea,
} from "@mui/material";

function Textblock({ text }: { text: string }): JSX.Element {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "grid",
        textAlign: "center",
      }}
    >
      <Text variant="h6">{text}</Text>
    </Paper>
  );
}

function StateGraph({ value }: { value?: Array<RecordInfo> }): JSX.Element {
  if (!value || value.length === 0)
    return <div style={{ width: "100%", height: "20px" }} />;

  const { t, h } = value[0];
  const color = t > 35 || t < 0 || h > 75 ? "red" : "green";

  return (
    <div style={{ width: "100%", height: "20px", backgroundColor: color }} />
  );
}

function DeviceCard({ data }: { data: DeviceData }): JSX.Element {
  const { uid, name } = data;
  const {
    data: values,
    error,
    isLoading,
  } = useSWR(`/api/data/${uid}/get?limit=1`, fetcher<Array<RecordInfo>>, {
    refreshInterval: 5000,
  });

  return (
    <Grid xs={12} sm={6} md={4}>
      <Card elevation={6}>
        <CardHeader
          avatar={<Avatar aria-label="">{uid[0]}</Avatar>}
          title={<Text variant="h6">{name || word.noDaviceName}</Text>}
          subheader={<Text variant="body1">ID: {uid}</Text>}
        />
        <CardActionArea>
          <StateGraph value={values} />
          <CardContent>
            {isLoading ? (
              <Text variant="h6">{word.SWR.loading}</Text>
            ) : error ? (
              <Text variant="h6">{word.SWR.error}</Text>
            ) : !values || values.length === 0 ? (
              <Text variant="h6">{word.Data.nodata}</Text>
            ) : (
              <>
                {[
                  `${word.Data.t}：${values[0].t}℃`,
                  `${word.Data.h}：${values[0].h}%`,
                  `${word.Data.time}：${new Date(
                    values[0].time
                  ).toLocaleString()}`,
                ].map((v, i) => (
                  <Text variant="h6" key={`${uid}-${i}-text`}>
                    {v}
                  </Text>
                ))}
              </>
            )}
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" href={`/device/${uid}`}>
            {word.Data.button}
          </Button>
        </CardActions>
      </Card>
    </Grid>
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
