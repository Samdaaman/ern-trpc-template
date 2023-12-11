import type { Router } from '@server/index';
import { createTRPCReact } from '@trpc/react-query';

const trpc = createTRPCReact<Router>()

export default trpc;
