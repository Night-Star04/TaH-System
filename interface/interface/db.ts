type DeviceData = {
  uid: string;
  name?: string;
};

type DeviceInfo = DeviceData & {
  id: string;
};

type RecordInfo = {
  h: number;
  t: number;
  time: number;
};

export type { DeviceData, DeviceInfo, RecordInfo };
