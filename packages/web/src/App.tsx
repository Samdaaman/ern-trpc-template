import './App.css';
import { AppBar, Box, Stack, ThemeProvider, Typography } from '@mui/material';
import theme from './theme';
import { useState } from 'react'
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SuperJSON from 'superjson';
import trpc from './trpc';
import { ExampleShared } from '@core/example'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'

export default function App() {
  const example = new ExampleShared()
  console.log({ yeet: example.yeet })

  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() => trpc.createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:8080'
      }),
    ],
    transformer: SuperJSON,
  }))

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        // TODO
      ]
    },
  ])

  return <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <Box display='flex' flexDirection='column' height='100%'>
        <ThemeProvider theme={theme}>
          <AppBar>
            <Typography variant="h6" color="inherit" component="div">
              Unnamed
            </Typography>
          </AppBar>
          <RouterProvider router={router} />
        </ThemeProvider>
      </Box>
    </QueryClientProvider>
  </trpc.Provider>
}

function Root() {
  return <Stack flexGrow={1} direction={'row'} overflow='clip'>
    <Outlet />
  </Stack>
}
