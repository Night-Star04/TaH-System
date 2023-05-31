"use client";

import type { JSX } from "react";
import type { NextPage } from "next";
import useSWR from "swr";

import { fetcher_json as fetcher } from "@/util";
import { Numjudgment } from "@/tool";

import word from "@/text/home.json";

import type { DeviceData, RecordInfo, ScopeType } from "@/interface/db";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Divider } from "@/styles";
import {
  Container,
  Unstable_Grid2 as Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography as Text,
  Button,
  Avatar,
  CardActionArea,
  Stack,
} from "@mui/material";

function Textblock({ text }: { text: string }): JSX.Element {
  return (
    <div style={{ textAlign: "center" }}>
      <Text variant="h6">{text}</Text>
    </div>
  );
}

function StateGraph({
  value,
  scope,
}: {
  value?: Array<RecordInfo>;
  scope?: ScopeType;
}): JSX.Element {
  if (!value || !value[0] || !scope)
    return (
      <div
        style={{ width: "100%", height: "20px", backgroundColor: "orange" }}
      />
    );

  const { t, h } = value[0];
  const { t: tScope, h: hScope } = scope;

  const color =
    t > tScope.max || t < tScope.min || h > hScope.max || h < hScope.min
      ? "red"
      : "green";

  return (
    <div style={{ width: "100%", height: "20px", backgroundColor: color }} />
  );
}

function DeviceCard({ data }: { data: DeviceData }): JSX.Element {
  const { uid, name } = data;
  const { t, h } = data.scope || {};

  const {
    data: values,
    error,
    isLoading,
  } = useSWR(`/api/data/${uid}/get?limit=1`, fetcher<Array<RecordInfo>>, {
    refreshInterval: 5000,
  });
  const scope: ScopeType = {
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
    <Grid xs={12} sm={6} md={4}>
      <Card elevation={6}>
        <CardHeader
          avatar={<Avatar aria-label="">{uid[0]}</Avatar>}
          title={<Text variant="h6">{name || word.noDaviceName}</Text>}
          subheader={<Text variant="body1">ID: {uid}</Text>}
        />
        <CardActionArea>
          <StateGraph value={values} scope={scope} />

          <CardContent>
            {isLoading ? (
              <Text variant="h6">{word.SWR.loading}</Text>
            ) : error ? (
              <Text variant="h6">{word.SWR.error}</Text>
            ) : !values || values.length === 0 ? (
              <Text variant="h6">{word.Data.nodata}</Text>
            ) : (
              <Stack
                direction={{ md: "row" }}
                spacing={2}
                divider={<Divider />}
              >
                <div>
                  {[
                    `${word.Data.t}: ${values[0].t}℃`,
                    `${word.Data.h}: ${values[0].h}%`,
                    `${word.Data.time}: ${new Date(
                      values[0].time
                    ).toLocaleString()}`,
                  ].map((v, i) => (
                    <Text variant="h6" key={`${uid}-${i}-text`}>
                      {v}
                    </Text>
                  ))}
                </div>
                <div>
                  <Text variant="h6">Safe Value:</Text>
                  <Text variant="h6">
                    {`${word.Data.t}: ${scope.t.min}℃ ~ ${scope.t.max}℃`}
                  </Text>
                  <Text variant="h6">
                    {`${word.Data.h}: ${scope.h.min}% ~ ${scope.h.max}%`}
                  </Text>
                </div>
              </Stack>
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
