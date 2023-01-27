import io from "socket.io-client";
import { serverHost } from "./serverHost";

const socket = io.connect(serverHost.local);
export default socket;
