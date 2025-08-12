export const featureFlags = JSON.parse(
  import.meta.env.VITE_FEATURE_FLAGS || '{}'
);
export type FeatureFlags = typeof featureFlags;
