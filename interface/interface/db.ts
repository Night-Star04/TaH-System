type ScopeType = {
  t: {
    max: number;
    min: number;
  };
  h: {
    max: number;
    min: number;
  };
};

type DeviceData = {
  uid: string;
  name?: string;
  scope?: ScopeType;
};

type DeviceInfo = DeviceData & {
  mac: string;
};

type RecordInfo = {
  uid: string;
  h: number;
  t: number;
  time: number;
};

export type { DeviceData, DeviceInfo, RecordInfo, ScopeType };
