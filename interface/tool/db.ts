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

function IsExistDevice({ mac, uid }: { mac?: string; uid?: string }): boolean {
  const deviceList = GetDeviceList();

  if (mac) return deviceList.findIndex((device) => device.mac === mac) !== -1;
  else if (uid)
    return deviceList.findIndex((device) => device.uid === uid) !== -1;
  else throw new Error("id or uid must be provided");
}

function GetDeviceInfo({
  mac,
  uid,
}: {
  mac?: string;
  uid?: string;
}): DeviceInfo | undefined {
  const deviceList = GetDeviceList();

  if (mac) return deviceList.find((device) => device.mac === mac);
  else if (uid) return deviceList.find((device) => device.uid === uid);
  else throw new Error("id or uid must be provided");
}

function AddDevice(device: DeviceInfo): void {
  const deviceList = GetDeviceList();
  deviceList.push(device);
  WriteJSON(devicePath, deviceList);
}

function EditDevice(uid: string, device: DeviceInfo) {
  const deviceList = GetDeviceList();
  const index = deviceList.findIndex((device) => device.uid === uid);
  if (index === -1) throw new Error("device not found");

  deviceList[index] = device;
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
  EditDevice,
};
