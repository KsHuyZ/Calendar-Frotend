import { io } from "socket.io-client";
import { serverHost } from "./serverHost";

const socket = io(serverHost.product);
export default socket;
