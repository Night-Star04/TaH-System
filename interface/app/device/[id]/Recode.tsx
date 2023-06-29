"use client";

import { JSX, useState } from "react";
import useSWR from "swr";

import { fetcher_json as fetcher } from "@/util";
import { RecordInfo } from "@/interface/db";

import styled from "@emotion/styled";

import { CircularProgress, Stack, Typography as Text } from "@mui/material";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  GridPrintExportMenuItem,
} from "@mui/x-data-grid";

import type {
  GridColDef,
  GridCsvExportOptions,
  GridPrintExportOptions,
} from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "UUID", width: 300, editable: false },
  {
    field: "t",
    headerName: "Temperature (°C)",
    type: "number",
    width: 150,
    editable: false,
    valueFormatter: ({ value }) => `${value} °C`,
  },
  {
    field: "h",
    headerName: "Humidity (%)",
    type: "number",
    width: 150,
    editable: false,
    valueFormatter: ({ value }) => `${value} %`,
  },
  {
    field: "time",
    headerName: "Time",
    type: "date",
    width: 200,
    editable: false,
    valueGetter: ({ value }) => value && new Date(value),
    valueFormatter: ({ value }) => (value as Date).toLocaleString(),
  },
];

function ToolbarExport({
  csvOptions,
  printOptions,
}: {
  csvOptions?: GridCsvExportOptions;
  printOptions?: GridPrintExportOptions;
}) {
  return (
    <GridToolbarExportContainer>
      <GridCsvExportMenuItem options={csvOptions} />
      <GridPrintExportMenuItem options={printOptions} />
    </GridToolbarExportContainer>
  );
}

function Toolbar() {
  return (
    <GridToolbarContainer>
      <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarFilterButton />
        <ToolbarExport
          csvOptions={{
            fileName: `device-recode`,
            delimiter: ",",
            utf8WithBom: true,
          }}
          printOptions={{
            hideFooter: true,
            hideToolbar: true,
          }}
        />
      </Stack>
    </GridToolbarContainer>
  );
}

const OverlayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

function Recode({ id }: { id: string }): JSX.Element {
  const { data, error, isLoading } = useSWR(
    `/api/data/${id}/get`,
    fetcher<Array<RecordInfo>>,
    { refreshInterval: 5000 }
  );
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  if (error) return <div>Error: {error}</div>;

  const rows =
    data?.map((item, index) => {
      return {
        id: item.uid || index,
        ...item,
      };
    }) || [];

  return (
    <>
      <div style={{ height: 835 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          loading={isLoading}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          slots={{
            toolbar: Toolbar,
            loadingOverlay: () => (
              <OverlayContainer>
                <CircularProgress />
                <Text>Please wait. The data is being acquired... </Text>
              </OverlayContainer>
            ),
            noRowsOverlay: () => (
              <OverlayContainer>
                <Text>Oops... Data no found</Text>
              </OverlayContainer>
            ),
          }}
        />
      </div>
    </>
  );
}

export default Recode;
