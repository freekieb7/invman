"use client";

import { useEffect, useState } from "react";


export default function Chat() {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        console.log("use effect callled");

        let socket = new WebSocket('ws://localhost:8081/ws');

        socket.onmessage = function (messageCluster) {
            var newMessages = messageCluster.data.split('\n');
            setMessages(currentMessages => currentMessages.concat(newMessages));
        }

        socket.onclose = function (event) {
            console.log("Connection closed");
        }

        return () => {
            socket.close();
        };
    }, [messages]);

    return (
        <div className="App bg-slate-400">
            <div id="log" className="h-[20rem]">
                {messages.map((value, index) => {
                    return (
                        <p key={index}>{value}</p>
                    )
                })}
            </div>
            <form id="form">
                <button type="button" value="Send" />
                <input type="text" id="msg" size={64} autoFocus />
            </form>
        </div>
    );
}