"use client";

import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
    message: string;
};

export const isBrowser = typeof window !== "undefined";

export default function Chat() {
    const { data: session } = useSession();
    const wsInstance = useMemo(() => isBrowser ? new WebSocket(`${process.env.NEXT_PUBLIC_CHAT_URL}`) : null, []);
    const [messages, setMessages] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors, isSubmitting }, // TODO implementing error
    } = useForm<FormData>();

    const onSend = handleSubmit((data) => {
        if (wsInstance?.readyState !== WebSocket.OPEN) {
            console.log("Socket is not open");
            return
        }

        wsInstance.send(data.message);
        resetField("message");
    });

    useEffect(() => {
        if (wsInstance === null) {
            return
        }

        wsInstance.onclose = () => console.log("close");
        wsInstance.onopen = () => {
            // Authenticate on first message
            wsInstance.send(session?.user.access_token!)
        };

        wsInstance.onerror = err => console.error(err);
        wsInstance.onmessage = msgCluster => {
            var newMessages = msgCluster.data.split('\n');
            console.log(newMessages);
            setMessages(currentMessages => currentMessages.concat(newMessages));
        }
    }, [wsInstance?.readyState])


    if (wsInstance == null) return <div>Chat not supported for browser</div>;
    if (wsInstance.readyState === wsInstance.CLOSED) return <div>Chat was closed</div>;

    return (
        <div className="App bg-slate-800">
            <div className="h-[20rem]">
                {messages.map((value, index) => {
                    return (
                        <p key={index}>{value}</p>
                    )
                })}
            </div>
            <div className="flex items-center">
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={onSend}
                >
                    Send
                </button>
                <input
                    disabled={isSubmitting}
                    {...register("message", { required: true })}
                    type="text"
                    className="ml-2 w-full bg-slate-700"
                    onKeyUp={(event) => {
                        if (event.key === 'Enter') {
                            onSend();
                        }
                    }}
                    autoComplete="off"
                    autoFocus
                />
            </div>
        </div>
    );
}