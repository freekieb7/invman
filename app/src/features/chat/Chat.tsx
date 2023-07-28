"use client";

import { io } from 'socket.io-client';


export default function Chat() {
    const socket = io('http://localhost:8090', {
        autoConnect: false
    });

    socket.on("connect", () => {
        const engine = socket.io.engine;
        console.log(engine.transport.name); // in most cases, prints "polling"

        engine.once("upgrade", () => {
            // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
            console.log(engine.transport.name); // in most cases, prints "websocket"
            console.log("upgrade");
        });

        engine.on("packet", ({ type, data }) => {
            // called for each packet received
            console.log("packet received");
        });

        engine.on("packetCreate", ({ type, data }) => {
            // called for each packet sent
            console.log("create package");
        });

        engine.on("drain", () => {
            console.log("drain");
        });

        engine.on("close", (reason) => {
            console.log("close");
        });

        engine.on("message", (reason) => {
            console.log("message");
        });
    });


    function onStart() {
        socket.connect();


    }

    function onStop() {
        socket.disconnect();
    }

    return (
        <div className="App bg-slate-400">
            <button
                type="button"
                onClick={onStart}
            >
                Start
            </button>
            <br></br>
            <button
                type="button"
                onClick={onStop}
            >
                Stop
            </button>
        </div>
    );
}