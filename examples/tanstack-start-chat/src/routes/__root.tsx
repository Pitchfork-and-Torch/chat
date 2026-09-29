import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Chat SDK + TanStack Start" },
    ],
  }),
  component: RootComponent,
});

const styles = `
  :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
  body { margin: 0; }
`;

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <style>{styles}</style>
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
