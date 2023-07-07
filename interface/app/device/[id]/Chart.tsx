"use client";

import { useRef, useEffect } from "react";
import type { JSX, DetailedHTMLProps, HTMLAttributes } from "react";
import useSWR from "swr";

import * as echarts from "echarts/core";
import type { GaugeSeriesOption } from "echarts/charts";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([GaugeChart, CanvasRenderer]);

import { fetcher_json as fetcher } from "@/util";
import { RecordInfo } from "@/interface/db";

import { Stack } from "@mui/material";

type GaugeProps = {
  div?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  series?: Array<GaugeSeriesOption> | GaugeSeriesOption;
};

function Gauge(props: GaugeProps) {
  const { series } = props;
  const gaugeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gaugeRef.current) return;
    gaugeRef.current.focus();

    const chart = echarts.init(gaugeRef.current);
    chart.setOption({
      series: series,
    });
    window.addEventListener("resize", () => chart.resize());
  }, [series]);

  return <div ref={gaugeRef} {...props.div} />;
}

function Chart({ id }: { id: string }): JSX.Element {
  const { data, error, isLoading } = useSWR(
    `/api/data/${id}/get?limit=1`,
    fetcher<Array<RecordInfo>>,
    { refreshInterval: 5000 }
  );

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        flexWrap="wrap"
        sx={{ justifyContent: "center" }}
      >
        <Gauge
          div={{
            id: "TemperatureGauge",
            style: { width: "600px", height: "450px" },
          }}
          series={[
            {
              type: "gauge",
              center: ["50%", "60%"],
              startAngle: 200,
              endAngle: -20,
              min: -20,
              max: 60,
              splitNumber: 8,
              itemStyle: {
                color: "#FFAB91",
              },
              progress: {
                show: true,
                width: 30,
              },
              pointer: {
                show: true,
              },
              axisLine: {
                lineStyle: {
                  width: 30,
                },
              },
              axisTick: {
                distance: -45,
                splitNumber: 5,
                lineStyle: {
                  width: 2,
                  color: "#999",
                },
              },
              splitLine: {
                distance: -52,
                length: 14,
                lineStyle: {
                  width: 3,
                  color: "#999",
                },
              },
              axisLabel: {
                distance: -20,
                color: "#999",
                fontSize: 20,
              },
              anchor: {
                show: true,
                showAbove: true,
              },
              title: {
                offsetCenter: [0, "60%"],
                fontSize: "1.5rem",
              },
              detail: {
                valueAnimation: true,
                width: "60%",
                lineHeight: 40,
                borderRadius: 8,
                offsetCenter: [0, "30%"],
                fontWeight: "bolder",
                formatter: (value) => `${value}°C`,
                color: "inherit",
              },
              data: [
                {
                  value: data ? data[0].t : 20,
                  name: "Temperature",
                },
              ],
            },
          ]}
        />
        <Gauge
          div={{
            id: "HumidityGauge",
            style: { width: "600px", height: "450px" },
          }}
          series={[
            {
              type: "gauge",
              center: ["50%", "60%"],
              startAngle: 200,
              endAngle: -20,
              min: 0,
              max: 100,
              splitNumber: 10,
              progress: {
                show: true,
                width: 30,
              },
              pointer: {
                show: true,
              },
              axisLine: {
                lineStyle: {
                  width: 30,
                },
              },
              axisTick: {
                distance: -45,
                splitNumber: 5,
                lineStyle: {
                  width: 2,
                  color: "#999",
                },
              },
              splitLine: {
                distance: -52,
                length: 14,
                lineStyle: {
                  width: 3,
                  color: "#999",
                },
              },
              axisLabel: {
                distance: -20,
                color: "#999",
                fontSize: 20,
              },
              anchor: {
                show: true,
                showAbove: true,
              },
              title: {
                offsetCenter: [0, "60%"],
                fontSize: "1.5rem",
              },
              detail: {
                valueAnimation: true,
                width: "60%",
                lineHeight: 40,
                borderRadius: 8,
                offsetCenter: [0, "30%"],
                fontWeight: "bolder",
                formatter: (value) => `${value}°C`,
                color: "inherit",
              },
              data: [
                {
                  value: data ? data[0].h : 20,
                  name: "Humidity",
                },
              ],
            },
          ]}
        />
      </Stack>
    </>
  );
}

export default Chart;
