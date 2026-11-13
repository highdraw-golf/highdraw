declare module 'us-atlas/states-10m.json' {
  const topology: {
    type: string;
    objects: {
      states: {
        type: string;
        geometries: Array<{
          type: string;
          id?: string;
          properties?: { name?: string };
        }>;
      };
      [key: string]: unknown;
    };
    arcs: unknown[];
  };
  export default topology;
}
