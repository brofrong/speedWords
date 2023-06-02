import { values } from "lodash";
import { createSignal } from "solid-js";

export type ConfigKey = { key: string; code: string };

export type Config = {
  delay: number;
  yes: ConfigKey;
  no: ConfigKey;
  dummy: string;
  showProgressBar: boolean;
};

const defaultConfig = {
  delay: 750,
  yes: { key: "F", code: "KeyF" },
  no: { key: "J", code: "KeyJ" },
  dummy: "***",
  showProgressBar: true,
};

const LS_KEY = "CONFIG";

let [_config, setConfig] = createSignal(loadConfig());

function defaultValue<T>(value: T | undefined, fallback: T): T {
  return values === undefined ? fallback : (value as any);
}

function loadConfig(): Config {
  const data = localStorage.getItem(LS_KEY);
  if (data) {
    const parsed: Config = JSON.parse(data);
    return {
      delay: defaultValue(parsed.delay, defaultConfig.delay),
      yes: defaultValue(parsed.yes, defaultConfig.yes),
      no: defaultValue(parsed.no, defaultConfig.no),
      dummy: defaultValue(parsed.dummy, defaultConfig.dummy),
      showProgressBar: defaultValue(
        parsed.showProgressBar,
        defaultConfig.showProgressBar
      ),
    };
  }
  return defaultConfig;
}

export function saveConfigLS(config: Config) {
  localStorage.setItem(LS_KEY, JSON.stringify(config));
  setConfig(config);
}

export const config = _config;
