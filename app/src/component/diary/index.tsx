"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";

const Diary = () => {
    var text: string = "";
    var rows: any = [];

    function handleChange(rowNumber: number, event: ChangeEvent<HTMLInputElement>) {
        if (event.target.scrollWidth > event.target.clientWidth) {
            // When text overflows, continue on next row
            let lastCharacter = event.target.value.slice(event.target.value.length - 1, event.target.value.length)
            event.target.value = event.target.value.slice(0, event.target.value.length - 1)

            let nextRow = document.getElementById("diary-row-" + (rowNumber + 1)) as HTMLInputElement | null;

            if (nextRow != null) {
                nextRow.value = lastCharacter + nextRow.value;
                nextRow?.focus(); // TODO next page
            } else {
                event.preventDefault();
            }
        }

        // TODO paste large texts
        // TODO paste backspace to prev row
        // TODO enter to next row
    }

    function handleKeyDown(rowNumber: number, event: KeyboardEvent<HTMLInputElement>) {
        let currentRow = event.target as HTMLInputElement;

        if (event.code === "Enter") {
            let nextRow = document.getElementById("diary-row-" + (rowNumber + 1)) as HTMLInputElement | null;

            if (nextRow != null) {
                nextRow?.focus(); // TODO next page
            }
        }

        if (event.code === "Backspace") {
            if (currentRow.selectionStart !== 0) {
                return;
            }

            let prevRow = document.getElementById("diary-row-" + (rowNumber - 1)) as HTMLInputElement | null;

            if (prevRow != null) {
                prevRow?.focus(); // TODO next page
                event.preventDefault();
            }
        }

        // TODO paste large texts
    }

    for (var i = 0; i < 20; i++) {
        let index = i;
        rows.push(
            <input id={"diary-row-" + index} className="px-4 bg-transparent glass-dense rounded-sm text-black w-full"
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
            />
        );
    }

    return (
        <div className="glass rounded-md">
            <table className="table-auto w-96">
                <thead>
                    <tr>
                        <th className="text-left px-4">Page 1</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row: any, index: number) => {
                        return (
                            <tr key={index}>
                                <td className="w-40 border-y border-slate-400">
                                    <div className="flex items-center">
                                        <MoonIcon className="h-4 w-4 mx-2 " />
                                        {row}
                                    </div>

                                </td>
                            </tr>
                        );

                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <th>​</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default Diary;