"use client";

import type { NextPage } from "next";
import useSWR from "swr";
import { useState, ChangeEvent } from "react";

import { fetcher_json as fetcher } from "@/util";
import { Numjudgment } from "@/tool";

import { DeviceInfo, RecordInfo } from "@/interface/db";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Divider } from "@/styles";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography as Text,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Slider,
  DialogActions,
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

function EditDialog({
  open,
  onClose,
  data,
  returncb,
}: {
  open: boolean;
  onClose: () => void;
  data: DeviceInfo;
  returncb?: (data: DeviceInfo) => void;
}) {
  const { t, h } = data.scope || {};
  const [name, setName] = useState<string>(data.name || "");
  const [HScrop, setHScrop] = useState<Array<number>>([
    h?.min || 0,
    h?.max || 100,
  ]);
  const [TScrop, setTScrop] = useState<Array<number>>([
    t?.min || 0,
    t?.max || 60,
  ]);

  const SaveClick = () => {
    const form = new FormData();
    form.append("name", name);
    form.append(
      "scope",
      JSON.stringify({
        h: { min: HScrop[0], max: HScrop[1] },
        t: { min: TScrop[0], max: TScrop[1] },
      })
    );
    fetch(`/api/device/${data.uid}/setting`, {
      method: "POST",
      body: form,
    })
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          data = {
            ...data,
            name,
            scope: {
              h: { min: HScrop[0], max: HScrop[1] },
              t: { min: TScrop[0], max: TScrop[1] },
            },
          };
          if (returncb) returncb(data);
          onClose();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle variant="h4">Edit Device Info</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Text variant="h6">Name: </Text>
          <TextField
            placeholder="Device Name"
            sx={{ ml: 2 }}
            type="text"
            fullWidth
            value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
            variant="standard"
            helperText="The name of the device."
          />
        </div>

        <Text variant="h6">Security range: </Text>
        <div style={{ marginLeft: "16px" }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text variant="subtitle1">Temperature: </Text>
              <Text variant="subtitle1">{`Current: ${TScrop[0]}°C ~ ${TScrop[1]}°C`}</Text>
            </div>
            <Slider
              defaultValue={TScrop}
              value={TScrop}
              sx={{ width: "90%" }}
              onChange={(_event: Event, newValue: number | Array<number>) => {
                setTScrop(newValue as Array<number>);
              }}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value} °C`}
              min={-20}
              max={60}
              marks={[
                {
                  value: -20,
                  label: "-20°C",
                },
                {
                  value: 0,
                  label: "0°C",
                },
                {
                  value: 60,
                  label: "60°C",
                },
              ]}
            />
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text variant="subtitle1">Humidity:</Text>
              <Text variant="subtitle1">{`Current: ${HScrop[0]}% ~ ${HScrop[1]}%`}</Text>
            </div>

            <Slider
              defaultValue={HScrop}
              value={HScrop}
              sx={{ width: "90%" }}
              onChange={(_event: Event, newValue: number | Array<number>) => {
                setHScrop(newValue as Array<number>);
              }}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
              min={0}
              max={100}
              marks={[
                {
                  value: 0,
                  label: "0%",
                },
                {
                  value: 100,
                  label: "100%",
                },
              ]}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel (Not Save)</Button>
        <Button onClick={SaveClick}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function InfoList({ data }: { data: DeviceInfo }): JSX.Element {
  const [value, setValue] = useState<DeviceInfo>(data);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { uid, name, mac } = value;
  const { h, t } = value.scope || {};

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
    <>
      <div style={{ marginLeft: "16px" }}>
        <Text variant="h6">Name: {name || "Unnamed Sensor"}</Text>
        <Text variant="h6">UID: {uid}</Text>
        <Text variant="h6">Mac Address: {mac}</Text>
        <Text variant="h6">Security range: </Text>
        <div style={{ marginLeft: "16px" }}>
          <Text variant="subtitle1">{`Temperature: ${scope.t.min}°C ~ ${scope.t.max}°C`}</Text>
          <Text variant="subtitle1">{`Humidity: ${scope.h.min}% ~ ${scope.h.max}%`}</Text>
        </div>
      </div>
      <Divider />
      <div style={{ textAlign: "center" }}>
        <Button variant="text" onClick={() => setIsEdit(!isEdit)}>
          <Text variant="h6">{isEdit ? "End Edit" : "Edit"}</Text>
        </Button>
      </div>

      {isEdit && (
        <EditDialog
          open={isEdit}
          onClose={() => setIsEdit(false)}
          data={value}
          returncb={(d) => setValue(d)}
        />
      )}
    </>
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
          >
            <Text variant="h3">Graph</Text>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Page;
