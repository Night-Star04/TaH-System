"use client";

import type { NextPage } from "next";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography as Text,
} from "@mui/material";

import CurrentData from "./Currentdata";
import Dashboard from "./Dashboard";
import DataInfo from "./DataInfo";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

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
            <Dashboard id={id} />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Page;
