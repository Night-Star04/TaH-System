import { cwd } from "process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
const { parse, stringify } = JSON;

const dbPath = join(cwd(), "db");
const devicePath = join(dbPath, "device.json");

import { DeviceInfo, RecordInfo } from "@/interface/db";

function ReadJSON<T>(path: string): T {
  const data = readFileSync(path);
  return parse(data.toString());
}

function WriteJSON<T>(path: string, data: T): void {
  writeFileSync(path, stringify(data));
}

function GetDeviceList(): Array<DeviceInfo> {
  return ReadJSON<Array<DeviceInfo>>(devicePath);
}

function IsExistDevice({ id, uid }: { id?: string; uid?: string }): boolean {
  const deviceList = GetDeviceList();

  if (id) return deviceList.findIndex((device) => device.id === id) !== -1;
  else if (uid)
    return deviceList.findIndex((device) => device.uid === uid) !== -1;
  else throw new Error("id or uid must be provided");
}

function GetDeviceInfo({
  id,
  uid,
}: {
  id?: string;
  uid?: string;
}): DeviceInfo | undefined {
  const deviceList = GetDeviceList();

  if (id) return deviceList.find((device) => device.id === id);
  else if (uid) return deviceList.find((device) => device.uid === uid);
  else throw new Error("id or uid must be provided");
}

function AddDevice(device: DeviceInfo): void {
  const deviceList = GetDeviceList();
  deviceList.push(device);
  WriteJSON(devicePath, deviceList);
}

function GetRecordList(id: string): Array<RecordInfo> {
  if (!existsSync(join(dbPath, id))) {
    mkdirSync(join(dbPath, id));
  }
  if (!existsSync(join(dbPath, id, "record.json"))) {
    writeFileSync(join(dbPath, id, "record.json"), "[]");
  }

  return ReadJSON<Array<RecordInfo>>(join(dbPath, id, "record.json"));
}

function GetNewestRecord(id: string): RecordInfo {
  const recordList = GetRecordList(id);
  return recordList[recordList.length - 1];
}

function AddRecord(id: string, record: RecordInfo): void {
  const recordList = GetRecordList(id);
  recordList.push(record);
  WriteJSON(join(dbPath, id, "record.json"), recordList);
}

export {
  GetDeviceList,
  GetDeviceInfo,
  GetNewestRecord,
  GetRecordList,
  IsExistDevice,
  AddDevice,
  AddRecord,
};
