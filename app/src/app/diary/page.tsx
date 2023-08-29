const Page = () => {
    var rows = [];
    for (var i = 0; i < 20; i++) {
        rows.push(
            <tr>
                <td className="w-40 border-y border-slate-400">
                    <p className="px-4">Test</p>
                </td>
                <td><div id="circle"></div></td>
                <td className="-m-4 w-40 border-y border-slate-400">
                    <input className="px-4 bg-transparent" />
                </td>
            </tr>
        );
    }

    return (
        <table className="table-auto glass rounded-md">
            <thead>
                <tr>
                    <th className="text-left px-4">Page 1</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
            <tfoot>
                <tr>
                    <th>​</th>
                </tr>
            </tfoot>
        </table>

    );
}

export default Page;